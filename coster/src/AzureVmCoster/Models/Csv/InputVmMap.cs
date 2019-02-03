using CsvHelper.Configuration;

namespace AzureVmCoster.Models.Csv
{
    public sealed class InputVmMap : ClassMap<InputVm>
    {
        public InputVmMap()
        {
            Map(v => v.Cpu);
            Map(v => v.Name);
            Map(v => v.Ram);
            Map(v => v.Region);
            Map(v => v.OperatingSystem);
        }
    }
}