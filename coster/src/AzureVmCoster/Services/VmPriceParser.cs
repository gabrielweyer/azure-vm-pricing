namespace AzureVmCoster.Services;

internal class VmPriceParser
{
    private readonly string _priceDirectory;

    public VmPriceParser(PriceDirectory priceDirectory)
    {
        _priceDirectory = priceDirectory.Directory;
    }

    public async Task<IList<VmPrice>> ParseAsync()
    {
        var priceFiles = Directory.GetFiles(_priceDirectory, "*.json");

        var allVmPrices = new List<VmPrice>();

        foreach (var priceFile in priceFiles)
        {
            var fileIdentifier = FileIdentifier.From(new FileInfo(priceFile));

            var fileVmPrices = await JsonReader.DeserializeAsync<List<VmPrice>>(priceFile);

            if (fileVmPrices == null || fileVmPrices.Count == 0)
            {
                continue;
            }

            fileVmPrices.ForEach(price =>
            {
                price.Region = fileIdentifier.Region;
                price.OperatingSystem = fileIdentifier.OperatingSystem;
            });

            allVmPrices.AddRange(fileVmPrices);
        }

        return allVmPrices;
    }
}
