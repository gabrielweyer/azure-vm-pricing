namespace AzureVmCoster.Services;

internal static class InputVmParser
{
    public static List<InputVm> Parse(FileInfo inputCsv, CultureInfo culture)
    {
        var csvOptions = new CsvReaderOptions
        {
            FormatProvider = culture,
            Separator = ',',
            MalformedData = CsvMalformedDataHandling.Throw,
            MissingField = CsvMissingFieldHandling.Throw
        };

        using var csv = CsvReader.FromFile(inputCsv.FullName, csvOptions);
        return csv.GetRecords<InputVm>().ToList();
    }
}
