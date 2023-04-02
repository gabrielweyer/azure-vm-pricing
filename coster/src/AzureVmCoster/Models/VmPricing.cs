namespace AzureVmCoster.Models;

public class VmPricing
{
    public string Region { get; set; } = default!;
    public string OperatingSystem { get; set; } = default!;
    public string Instance { get; set; } = default!;
    public short VCpu { get; set; }
    public decimal Ram { get; set; }
    public decimal PayAsYouGo { get; set; }
    public decimal PayAsYouGoWithAzureHybridBenefit { get; set; }
    public decimal? OneYearReserved { get; set; }
    public decimal? OneYearReservedWithAzureHybridBenefit { get; set; }
    public decimal? ThreeYearReserved { get; set; }
    public decimal? ThreeYearReservedWithAzureHybridBenefit { get; set; }
    public decimal? Spot { get; set; }
    public decimal? SpotWithAzureHybridBenefit { get; set; }
    public decimal? OneYearSavingsPlan { get; set; }
    public decimal? OneYearSavingsPlanWithAzureHybridBenefit { get; set; }
    public decimal? ThreeYearSavingsPlan { get; set; }
    public decimal? ThreeYearSavingsPlanWithAzureHybridBenefit { get; set; }
}
