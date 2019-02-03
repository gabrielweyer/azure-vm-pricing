namespace AzureVmCoster.Models
{
    public class VmPricing
    {
        public string Region { get; set; }
        public string OperatingSystem { get; set; }
        public string Instance { get; set; }
        public short VCpu { get; set; }
        public decimal Ram { get; set; }
        public decimal PayAsYouGo { get; set; }
        public decimal OneYearReserved { get; set; }
        public decimal ThreeYearReserved { get; set; }
        public decimal ThreeYearReservedWithAzureHybridBenefit { get; set; }
    }
}