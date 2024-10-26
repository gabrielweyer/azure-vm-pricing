using System.Text.Json;
using Microsoft.Extensions.Logging;

namespace AzureVmCoster.Services;

internal class Pricer
{
    private readonly ILogger<Pricer> _logger;

    public Pricer(ILogger<Pricer> logger)
    {
        _logger = logger;
    }

    public List<PricedVm> Price(IList<InputVm> inputVms, IList<VmPrice> vmPrices, CosterConfiguration configuration)
    {
        EnsurePriceExists(inputVms, vmPrices);

        var filteredVmPrices = FilterPrices(vmPrices, configuration.ExcludedVms);

        var medianCpu = GetCpuMedianForNonZeroValues(inputVms);
        var medianRam = GetRamMedianForNonZeroValues(inputVms);

        var orderedVmPrices = filteredVmPrices.OrderBy(p => p.PayAsYouGo).ToList();

        var pricedVms = new List<PricedVm>();

        foreach (var vm in inputVms)
        {
            var minCpu = vm.Cpu > 0 ? vm.Cpu : medianCpu;
            var minRam = vm.Ram > 0 ? vm.Ram : medianRam;

            var price = orderedVmPrices.FirstOrDefault(p =>
                p.Region.Equals(vm.Region, StringComparison.Ordinal) &&
                p.OperatingSystem.Equals(vm.OperatingSystem, StringComparison.Ordinal) &&
                p.Ram >= minRam &&
                p.VCpu >= minCpu);

            if (price == null)
            {
                _logger.LogWarning("Could not find a matching price for VM '{VmName}' ({VmCpu} CPU cores and {VmRam} GB of RAM)", vm.Name, vm.Cpu, vm.Ram);
            }

            pricedVms.Add(new PricedVm(vm, price));
        }

        return pricedVms;
    }

    private static void EnsurePriceExists(IList<InputVm> vms, IList<VmPrice> vmPrices)
    {
        var missingFiles = vms
            .Select(vm => new FileIdentifier(vm.Region, vm.OperatingSystem))
            .Distinct(new FileIdentifierComparer())
            .Where(fileIdentifier => !vmPrices.Any(p =>
                string.Equals(fileIdentifier.Region, p.Region, StringComparison.Ordinal) &&
                string.Equals(fileIdentifier.OperatingSystem, p.OperatingSystem, StringComparison.Ordinal)))
            .ToList();

        if (missingFiles.Count > 0)
        {
            throw new InvalidOperationException($"Price files are missing for {JsonSerializer.Serialize(missingFiles)}");
        }
    }

    /// <summary>
    /// Discard the prices contained in <paramref name="excludedVms"/>. The instances are discarded by name (case
    /// insensitive), if the same instance is present with different regions/operating systems, all occurrences will be
    /// discarded.
    /// </summary>
    /// <param name="vmPrices">The list of prices to filter</param>
    /// <param name="excludedVms">The list of instances to remove</param>
    /// <returns>The filtered prices</returns>
    private static List<VmPrice> FilterPrices(IList<VmPrice> vmPrices, IList<string> excludedVms)
    {
        return vmPrices.Where(p => !excludedVms.Contains(p.Instance, StringComparer.OrdinalIgnoreCase)).ToList();
    }

    private short GetCpuMedianForNonZeroValues(IList<InputVm> vms)
    {
        var orderedCpus = vms.Where(v => v.Cpu > 0).Select(v => (decimal)v.Cpu).Order().ToList();

        _logger.LogInformation("CPU is present for {MissingCpuCount} VMs out of {InputVmCount} VMs", orderedCpus.Count, vms.Count);

        if (orderedCpus.Count == 0)
        {
            throw new ArgumentException("CPU is missing for all input VMs.", nameof(vms));
        }

        var medianCpu = GetMedian(orderedCpus);

        return (short)Math.Ceiling(medianCpu);
    }

    private decimal GetRamMedianForNonZeroValues(IList<InputVm> vms)
    {
        var orderedRams = vms.Where(v => v.Ram > 0).Select(v => v.Ram).OrderBy(r => r).ToList();

        _logger.LogInformation("RAM is present for {MissingRamCount} VMs out of {InputVmCount} VMs", orderedRams.Count, vms.Count);

        if (orderedRams.Count == 0)
        {
            throw new ArgumentException("RAM is missing for all input VMs.", nameof(vms));
        }

        return GetMedian(orderedRams);
    }

    private static decimal GetMedian(IReadOnlyList<decimal> orderedList)
    {
        if (orderedList.Count == 1)
        {
            return orderedList[0];
        }

        if (orderedList.Count % 2 != 0)
        {
            return orderedList[orderedList.Count / 2];
        }

        var lowerMedian = orderedList[orderedList.Count / 2 - 1];
        var upperMedian = orderedList[orderedList.Count / 2];

        return (lowerMedian + upperMedian) / 2m;
    }

    private class FileIdentifierComparer : IEqualityComparer<FileIdentifier>
    {
        public bool Equals(FileIdentifier? x, FileIdentifier? y)
        {
            if (ReferenceEquals(x, y))
            {
                return true;
            }

            if (ReferenceEquals(x, null))
            {
                return false;
            }

            if (ReferenceEquals(y, null))
            {
                return false;
            }

            if (x.GetType() != y.GetType())
            {
                return false;
            }

            return string.Equals(x.Region, y.Region, StringComparison.Ordinal) &&
                   string.Equals(x.OperatingSystem, y.OperatingSystem, StringComparison.Ordinal);
        }

        public int GetHashCode(FileIdentifier obj)
        {
            return obj.Region.GetHashCode(StringComparison.Ordinal) ^ obj.OperatingSystem.GetHashCode(StringComparison.Ordinal);
        }
    }
}
