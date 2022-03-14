using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using AzureVmCoster.Models;
using AzureVmCoster.Models.Csv;
using CsvHelper;
using CsvHelper.Configuration;

namespace AzureVmCoster.Services;

public class InputVmParser
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
