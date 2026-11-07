namespace AzureVmCoster.Models.Csv;

[CsvRecordMap(typeof(InputVm))]
internal sealed partial class InputVmMap
{
    [CsvColumn("CPU")]
    public short Cpu { get; set; }

    [CsvColumn("RAM")]
    [CsvConverter(typeof(CurrencyStyleDecimalConverter))]
    public decimal Ram { get; set; }

    [CsvColumn("Operating System")]
    [CsvConverter(typeof(LowercaseConverter))]
    public string OperatingSystem { get; set; } = default!;

    [CsvConverter(typeof(LowercaseConverter))]
    public string Region { get; set; } = default!;
}
