using AzureVmCoster.Models.Csv;
using CsvHelper;

namespace AzureVmCoster.Services;

public static class PricedVmWriter
{
    public static void Write(string filename, List<PricedVm> pricedVms, CultureInfo culture)
    {
        var csvConfiguration = new CsvConfiguration(culture)
        {
            Delimiter = ","
        };

        using var writer = new StreamWriter($@"Out\{filename}");
        using var csv = new CsvWriter(writer, csvConfiguration);
        csv.Context.RegisterClassMap<PricedVmMap>();
        csv.WriteRecords(pricedVms);
    }
}
