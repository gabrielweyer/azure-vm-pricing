using CsvHelper;
using CsvHelper.TypeConversion;

namespace AzureVmCoster.Models.Csv;

public sealed class InputVmMap : ClassMap<InputVm>
{
    public InputVmMap()
    {
        Map(v => v.Cpu).Name("CPU");
        Map(v => v.Ram).Name("RAM").TypeConverterOption.NumberStyles(NumberStyles.Currency);
        Map(v => v.OperatingSystem).Name("Operating System").TypeConverter<LowercaseConverter>();
        Map(v => v.Name);
        Map(v => v.Region).TypeConverter<LowercaseConverter>();
    }

    private sealed class LowercaseConverter : DefaultTypeConverter
    {
        public override object? ConvertFromString(string? text, IReaderRow row, MemberMapData memberMapData)
        {
            return text?.ToLowerInvariant();
        }
    }
}
