using AzureVmCoster.Models.Csv;
using CsvHelper;
using Microsoft.Extensions.Logging;

namespace AzureVmCoster.Services;

internal class PricedVmWriter
{
    private readonly ILogger<PricedVmWriter> _logger;

    public PricedVmWriter(ILogger<PricedVmWriter> logger)
    {
        _logger = logger;
    }

    public void Write(string filename, IList<PricedVm> pricedVms, CultureInfo culture)
    {
        var csvConfiguration = new CsvConfiguration(culture)
        {
            Delimiter = ","
        };

        var fileInfo = new FileInfo($@"Out\{filename}");

        using var writer = new StreamWriter(fileInfo.FullName);
        using var csv = new CsvWriter(writer, csvConfiguration);
        csv.Context.RegisterClassMap<PricedVmMap>();
        csv.WriteRecords(pricedVms);

        _logger.LogInformation("Wrote priced VM to '{OutputFile}'", fileInfo);
    }
}
