namespace AzureVmCoster.Models.Csv;

internal sealed class CurrencyStyleDecimalConverter : ICsvConverter<decimal>
{
    public decimal Read(CsvReader reader, int index)
    {
        return reader.Parse(index, static (text, provider) => decimal.Parse(text, NumberStyles.Currency, provider));
    }

    public void Write(CsvWriter writer, decimal value)
    {
        writer.WriteField(value, default, writer.Options.FormatProvider);
    }
}
