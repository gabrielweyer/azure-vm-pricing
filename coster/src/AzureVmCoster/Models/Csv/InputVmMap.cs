using System.Globalization;
using CsvHelper.Configuration;

namespace AzureVmCoster.Models.Csv
{
    public sealed class InputVmMap : ClassMap<InputVm>
    {
        public InputVmMap()
        {
            Map(v => v.Cpu).Name("CPU");
            Map(v => v.Ram).Name("RAM").TypeConverterOption.NumberStyles(NumberStyles.Currency);
            Map(v => v.OperatingSystem).Name("Operating System");
            Map(v => v.Name);
            Map(v => v.Region);
        }
    }
}