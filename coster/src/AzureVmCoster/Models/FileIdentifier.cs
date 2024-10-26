namespace AzureVmCoster.Models;

internal class FileIdentifier
{
    public string Region { get; }
    public string OperatingSystem { get; }
    public string PriceFilename => $"vm-pricing_{Region}_{OperatingSystem}.json";

    public FileIdentifier(string region, string operatingSystem)
    {
        Region = region;
        OperatingSystem = operatingSystem;
    }

    public static FileIdentifier From(FileInfo fileInfo)
    {
        var underscoreFirstIndex = fileInfo.Name.IndexOf('_', StringComparison.Ordinal);
        var underscoreLastIndex = fileInfo.Name.LastIndexOf('_');
        var extensionIndex = fileInfo.Name.LastIndexOf(".json", StringComparison.Ordinal);

        if (underscoreFirstIndex < 0 ||
            underscoreLastIndex <= underscoreFirstIndex ||
            extensionIndex < underscoreLastIndex)
        {
            throw new ArgumentOutOfRangeException(nameof(fileInfo), fileInfo.Name,
                "The price filename does not follow the pattern 'vm-pricing_<region>_<operating-system>.json'");
        }

        var region = fileInfo.Name.Substring(underscoreFirstIndex + 1, underscoreLastIndex - underscoreFirstIndex - 1);
        var operatingSystem = fileInfo.Name.Substring(underscoreLastIndex + 1, extensionIndex - underscoreLastIndex - 1);

        return new FileIdentifier(region, operatingSystem);
    }
}
