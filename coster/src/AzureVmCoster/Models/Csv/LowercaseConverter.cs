namespace AzureVmCoster.Models.Csv;

internal sealed class LowercaseConverter : ICsvConverter<string>
{
    public string Read(CsvReader reader, int index)
    {
        return reader.GetString(index).ToLowerInvariant();
    }

    public void Write(CsvWriter writer, string value)
    {
        writer.WriteField(value);
    }
}
