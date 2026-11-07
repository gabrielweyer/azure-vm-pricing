namespace AzureVmCoster.Models.Csv;

internal sealed class PricedVmRecordWriter : CsvRecordWriter<PricedVm>
{
    private static readonly string[] _columnNames =
    [
        "Region",
        "Name",
        "Operating System",
        "Instance",
        "CPU",
        "RAM",
        "Pay as You Go",
        "Pay as You Go with Azure Hybrid Benefit",
        "One Year Reserved",
        "One Year Reserved with Azure Hybrid Benefit",
        "Three Year Reserved",
        "Three Year Reserved with Azure Hybrid Benefit",
        "Spot",
        "Spot with Azure Hybrid Benefit",
        "One Year Savings plan",
        "One Year Savings plan with Azure Hybrid Benefit",
        "Three Year Savings plan",
        "Three Year Savings plan with Azure Hybrid Benefit"
    ];

    public override int FieldCount => _columnNames.Length;

    public override void WriteHeader(CsvWriter writer)
    {
        foreach (var columnName in _columnNames)
        {
            WriteColumnName(writer, columnName);
        }
    }

    public override void Write(CsvWriter writer, PricedVm record)
    {
        writer.WriteField(record.Region);
        writer.WriteField(record.Name);
        writer.WriteField(record.OperatingSystem);
        writer.WriteField(record.Instance);
        writer.WriteField(record.VCpu, default, writer.Options.FormatProvider);
        writer.WriteField(record.Ram, default, writer.Options.FormatProvider);
        writer.WriteField(record.PayAsYouGo);
        writer.WriteField(record.PayAsYouGoWithAzureHybridBenefit);
        writer.WriteField(record.OneYearReserved);
        writer.WriteField(record.OneYearReservedWithAzureHybridBenefit);
        writer.WriteField(record.ThreeYearReserved);
        writer.WriteField(record.ThreeYearReservedWithAzureHybridBenefit);
        writer.WriteField(record.Spot);
        writer.WriteField(record.SpotWithAzureHybridBenefit);
        writer.WriteField(record.OneYearSavingsPlan);
        writer.WriteField(record.OneYearSavingsPlanWithAzureHybridBenefit);
        writer.WriteField(record.ThreeYearSavingsPlan);
        writer.WriteField(record.ThreeYearSavingsPlanWithAzureHybridBenefit);
    }
}
