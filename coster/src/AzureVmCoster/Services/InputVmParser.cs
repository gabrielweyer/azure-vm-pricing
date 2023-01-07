using AzureVmCoster.Models.Csv;
using CsvHelper;

namespace AzureVmCoster.Services;

internal static class InputVmParser
{
    public static List<InputVm> Parse(FileInfo inputCsv, CultureInfo culture)
    {
        var csvConfiguration = new CsvConfiguration(culture)
        {
            Delimiter = ","
        };

        using var reader = new StreamReader(inputCsv.FullName);
        using var csv = new CsvReader(reader, csvConfiguration);
        csv.Context.RegisterClassMap<InputVmMap>();
        return csv.GetRecords<InputVm>().ToList();
    }
}
