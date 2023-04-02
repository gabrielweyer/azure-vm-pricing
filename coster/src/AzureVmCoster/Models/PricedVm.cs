namespace AzureVmCoster.Models;

internal class PricedVm
{
    public PricedVm(InputVm inputVm, VmPricing? vmPricing)
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
            PayAsYouGoWithAzureHybridBenefit = vmPricing.PayAsYouGoWithAzureHybridBenefit;
            OneYearReserved = vmPricing.OneYearReserved;
            OneYearReservedWithAzureHybridBenefit = vmPricing.OneYearReservedWithAzureHybridBenefit;
            ThreeYearReserved = vmPricing.ThreeYearReserved;
            ThreeYearReservedWithAzureHybridBenefit = vmPricing.ThreeYearReservedWithAzureHybridBenefit;
            Spot = vmPricing.Spot;
            SpotWithAzureHybridBenefit = vmPricing.SpotWithAzureHybridBenefit;
            OneYearSavingsPlan = vmPricing.OneYearSavingsPlan;
            OneYearSavingsPlanWithAzureHybridBenefit = vmPricing.OneYearSavingsPlanWithAzureHybridBenefit;
            ThreeYearSavingsPlan = vmPricing.ThreeYearSavingsPlan;
            ThreeYearSavingsPlanWithAzureHybridBenefit = vmPricing.ThreeYearSavingsPlanWithAzureHybridBenefit;
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
    public string? Instance { get; }
    public short VCpu { get; }
    public decimal Ram { get; }
    public decimal? PayAsYouGo { get; }
    public decimal? PayAsYouGoWithAzureHybridBenefit { get; }
    public decimal? OneYearReserved { get; }
    public decimal? OneYearReservedWithAzureHybridBenefit { get; }
    public decimal? ThreeYearReserved { get; }
    public decimal? ThreeYearReservedWithAzureHybridBenefit { get; }
    public decimal? Spot { get; }
    public decimal? SpotWithAzureHybridBenefit { get; }
    public decimal? OneYearSavingsPlan { get; }
    public decimal? OneYearSavingsPlanWithAzureHybridBenefit { get; }
    public decimal? ThreeYearSavingsPlan { get; }
    public decimal? ThreeYearSavingsPlanWithAzureHybridBenefit { get; }
}
