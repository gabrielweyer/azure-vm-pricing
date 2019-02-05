namespace AzureVmCoster.Models
{
    public class PricedVm
    {
        public PricedVm(InputVm inputVm, VmPricing vmPricing)
        {
            Name = inputVm.Name;
            Region = inputVm.Region;
            OperatingSystem = inputVm.OperatingSystem;

            if (vmPricing != null)
            {
                Instance = vmPricing.Instance;
                VCpu = vmPricing.VCpu;
                Ram = vmPricing.Ram;
                PayAsYouGo = vmPricing.PayAsYouGo;
                OneYearReserved = vmPricing.OneYearReserved;
                ThreeYearReserved = vmPricing.ThreeYearReserved;
                ThreeYearReservedWithAzureHybridBenefit = vmPricing.ThreeYearReservedWithAzureHybridBenefit;
            }
            else
            {
                VCpu = inputVm.Cpu;
                Ram = inputVm.Ram;
            }
        }

        public string Name { get; }
        public string Region { get; }
        public string OperatingSystem { get; }
        public string Instance { get; }
        public short VCpu { get; }
        public decimal Ram { get; }
        public decimal? PayAsYouGo { get; }
        public decimal? OneYearReserved { get; }
        public decimal? ThreeYearReserved { get; }
        public decimal? ThreeYearReservedWithAzureHybridBenefit { get; }
    }
}