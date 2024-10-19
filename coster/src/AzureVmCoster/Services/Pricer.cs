using System.Text.Json;

namespace AzureVmCoster.Services;

internal class Pricer
{
    private readonly string _pricingDirectory;

    public Pricer(string pricingDirectory)
    {
        _pricingDirectory = pricingDirectory;
    }

    public void EnsurePricingExists(List<InputVm> vms)
    {
        var missingFiles = vms
            .Select(vm => new FileIdentifier(vm.Region, vm.OperatingSystem))
            .Distinct(new FileIdentifierComparer())
            .Where(fileIdentifier => !File.Exists($@"{_pricingDirectory}{fileIdentifier.PricingFilename}"))
            .ToList();

        if (missingFiles.Count > 0)
        {
            throw new InvalidOperationException($"Pricing files are missing for {JsonSerializer.Serialize(missingFiles)}");
        }
    }

    /// <summary>
    /// Discard the prices contained in <paramref name="excludedVms"/>. The instances are discarded by name (case
    /// insensitive), if the same instance is present with different regions/operating systems, all occurrences will be
    /// discarded.
    /// </summary>
    /// <param name="pricings">The list of prices to filter</param>
    /// <param name="excludedVms">The list of instances to remove</param>
    /// <returns>The filtered prices</returns>
    public static IList<VmPricing> FilterPricing(IList<VmPricing> pricings, IList<string> excludedVms)
    {
        return pricings.Where(p => !excludedVms.Contains(p.Instance, StringComparer.OrdinalIgnoreCase)).ToList();
    }

    public static List<PricedVm> Price(List<InputVm> vms, IList<VmPricing> pricings)
    {
        var medianCpu = GetCpuMedianForNonZeroValues(vms);
        var medianRam = GetRamMedianForNonZeroValues(vms);

        var orderedPricings = pricings.OrderBy(p => p.PayAsYouGo).ToList();

        var pricedVms = new List<PricedVm>();

        foreach (var vm in vms)
        {
            var minCpu = vm.Cpu > 0 ? vm.Cpu : medianCpu;
            var minRam = vm.Ram > 0 ? vm.Ram : medianRam;

            var pricing = orderedPricings.FirstOrDefault(p =>
                p.Region.Equals(vm.Region, StringComparison.Ordinal) &&
                p.OperatingSystem.Equals(vm.OperatingSystem, StringComparison.Ordinal) &&
                p.Ram >= minRam &&
                p.VCpu >= minCpu);

            if (pricing == null)
            {
                Console.WriteLine($"Could not find a matching pricing for VM '{vm.Name}' ({vm.Cpu} CPU cores and {vm.Ram} GB of RAM)");
            }

            pricedVms.Add(new PricedVm(vm, pricing));
        }

        return pricedVms;
    }

    private static short GetCpuMedianForNonZeroValues(List<InputVm> vms)
    {
        var orderedCpus = vms.Where(v => v.Cpu > 0).Select(v => (decimal)v.Cpu).OrderBy(c => c).ToList();
        var medianCpu = GetMedian(orderedCpus);

        return (short)Math.Ceiling(medianCpu);
    }

    private static decimal GetRamMedianForNonZeroValues(List<InputVm> vms)
    {
        var orderedRams = vms.Where(v => v.Ram > 0).Select(v => v.Ram).OrderBy(r => r).ToList();
        return GetMedian(orderedRams);
    }

    private static decimal GetMedian(IReadOnlyList<decimal> orderedList)
    {
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
