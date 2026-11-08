using AzureVmCoster.Models.Csv;
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
        var csvOptions = new CsvWriterOptions
        {
            FormatProvider = culture,
            Separator = ','
        };

        var fileInfo = new FileInfo($@"Out\{filename}");

        using var csv = CsvWriter.ToFile(fileInfo.FullName, csvOptions);
        csv.WriteRecords(pricedVms, new PricedVmRecordWriter());

        if (_logger.IsEnabled(LogLevel.Information))
        {
            _logger.LogInformation("Wrote priced VM to '{OutputFile}'", fileInfo);
        }
    }
}
