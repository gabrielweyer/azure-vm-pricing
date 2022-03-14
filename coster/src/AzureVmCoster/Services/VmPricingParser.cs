using Newtonsoft.Json;

namespace AzureVmCoster.Services;

public class VmPricingParser
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

            var fileVmPricing = JsonConvert.DeserializeObject<List<VmPricing>>(File.ReadAllText(pricingFile));

            if (fileVmPricing == null || !fileVmPricing.Any())
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
