namespace AzureVmCoster.Models;

public class FileIdentifier
{
    public string Region { get; }
    public string OperatingSystem { get; }

    public FileIdentifier(string region, string operatingSystem)
    {
        Region = region;
        OperatingSystem = operatingSystem;
    }

    public string GetPricingFilename()
    {
        return $"vm-pricing_{Region}_{OperatingSystem}.json";
    }

    public static FileIdentifier From(FileInfo fileInfo)
    {
        var underscoreFirstIndex = fileInfo.Name.IndexOf('_');
        var underscoreLastIndex = fileInfo.Name.LastIndexOf('_');
        var extensionIndex = fileInfo.Name.LastIndexOf(".json", StringComparison.Ordinal);

        if (underscoreFirstIndex < 0 ||
            underscoreLastIndex <= underscoreFirstIndex ||
            extensionIndex < underscoreLastIndex)
        {
            throw new ArgumentOutOfRangeException(nameof(fileInfo), fileInfo.Name,
                "The pricing filename does not follow the pattern 'vm-pricing_<region>_<operating-system>.json'");
        }

        var region = fileInfo.Name.Substring(underscoreFirstIndex + 1, underscoreLastIndex - underscoreFirstIndex - 1);
        var operatingSystem = fileInfo.Name.Substring(underscoreLastIndex + 1, extensionIndex - underscoreLastIndex - 1);

        return new FileIdentifier(region, operatingSystem);
    }
}
