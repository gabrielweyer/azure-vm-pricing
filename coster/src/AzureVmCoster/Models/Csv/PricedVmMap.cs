using CsvHelper.Configuration;

namespace AzureVmCoster.Models.Csv
{
    public sealed class PricedVmMap : ClassMap<PricedVm>
    {
        public PricedVmMap()
        {
            Map(v => v.Region).Index(0);
            Map(v => v.Name).Index(1);
            Map(v => v.OperatingSystem).Index(2).Name("Operating System");
            Map(v => v.Instance).Index(3);
            Map(v => v.VCpu).Index(4).Name("CPU");
            Map(v => v.Ram).Index(5).Name("RAM");
            Map(v => v.PayAsYouGo).Index(6).Name("Pay as You Go");
            Map(v => v.OneYearReserved).Index(7).Name("One Year Reserved");
            Map(v => v.ThreeYearReserved).Index(8).Name("Three Year Reserved");
            Map(v => v.ThreeYearReservedWithAzureHybridBenefit).Index(9)
                .Name("Three Year Reserved with Azure Hybrid Benefit");
        }
    }
}