namespace AzureVmCoster.Models;

internal class PricedVm
{
    public PricedVm(InputVm inputVm, VmPrice? vmPrice)
    {
        Name = inputVm.Name;
        Region = inputVm.Region;
        OperatingSystem = inputVm.OperatingSystem;

        if (vmPrice != null)
        {
            Instance = vmPrice.Instance;
            VCpu = vmPrice.VCpu;
            Ram = vmPrice.Ram;
            PayAsYouGo = vmPrice.PayAsYouGo;
            PayAsYouGoWithAzureHybridBenefit = vmPrice.PayAsYouGoWithAzureHybridBenefit;
            OneYearReserved = vmPrice.OneYearReserved;
            OneYearReservedWithAzureHybridBenefit = vmPrice.OneYearReservedWithAzureHybridBenefit;
            ThreeYearReserved = vmPrice.ThreeYearReserved;
            ThreeYearReservedWithAzureHybridBenefit = vmPrice.ThreeYearReservedWithAzureHybridBenefit;
            Spot = vmPrice.Spot;
            SpotWithAzureHybridBenefit = vmPrice.SpotWithAzureHybridBenefit;
            OneYearSavingsPlan = vmPrice.OneYearSavingsPlan;
            OneYearSavingsPlanWithAzureHybridBenefit = vmPrice.OneYearSavingsPlanWithAzureHybridBenefit;
            ThreeYearSavingsPlan = vmPrice.ThreeYearSavingsPlan;
            ThreeYearSavingsPlanWithAzureHybridBenefit = vmPrice.ThreeYearSavingsPlanWithAzureHybridBenefit;
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
