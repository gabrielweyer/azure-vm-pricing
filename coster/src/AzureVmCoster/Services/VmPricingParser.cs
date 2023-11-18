using System.Text.Json;

namespace AzureVmCoster.Services;

internal class VmPricingParser
{
    private readonly string _pricingDirectory;

    public VmPricingParser(string pricingDirectory)
    {
        _pricingDirectory = pricingDirectory;
    }

    public List<VmPricing> Parse()
    {
        var pricingFiles = Directory.GetFiles(_pricingDirectory, "*.json");

        var allVmPricing = new List<VmPricing>();

        foreach (var pricingFile in pricingFiles)
        {
            var fileInfo = new FileInfo(pricingFile);
            var fileIdentifier = FileIdentifier.From(fileInfo);

            var fileVmPricing = JsonSerializer.Deserialize<List<VmPricing>>(File.ReadAllText(pricingFile));

            if (fileVmPricing == null || fileVmPricing.Count == 0)
            {
                continue;
            }

            fileVmPricing.ForEach(pricing =>
            {
                pricing.Region = fileIdentifier.Region;
                pricing.OperatingSystem = fileIdentifier.OperatingSystem;
            });

            allVmPricing.AddRange(fileVmPricing);
        }

        return allVmPricing;
    }
}
