namespace AzureVmCoster.Models;

internal class PriceDirectory
{
    public string Directory { get; }

    public PriceDirectory(string priceDirectory)
    {
        Directory = priceDirectory;
    }
}
