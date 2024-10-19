namespace AzureVmCosterTests.TestInfrastructure;

internal static class VmPricingBuilder
{
    public static VmPricing AsUsWestWindowsD2V3()
    {
        return new VmPricing
        {
            Instance = "D2 v3",
            OperatingSystem = "windows",
            Ram = 8,
            Region = "us-west",
            VCpu = 2,
            PayAsYouGo = 1.1m,
            PayAsYouGoWithAzureHybridBenefit = 1.05m,
            Spot = 0.95m,
            SpotWithAzureHybridBenefit = 0.93m,
            OneYearSavingsPlan = 0.89m,
            OneYearSavingsPlanWithAzureHybridBenefit = 0.86m,
            ThreeYearSavingsPlan = 0.78m,
            ThreeYearSavingsPlanWithAzureHybridBenefit = 0.72m,
            OneYearReserved = 0.84m,
            OneYearReservedWithAzureHybridBenefit = 0.81m,
            ThreeYearReserved = 0.71m,
            ThreeYearReservedWithAzureHybridBenefit = 0.68m
        };
    }

    public static VmPricing AsUsWestWindowsD4V3()
    {
        return new VmPricing
        {
            Instance = "D4 v3",
            OperatingSystem = "windows",
            Ram = 16,
            Region = "us-west",
            VCpu = 4,
            PayAsYouGo = 2.2m,
            PayAsYouGoWithAzureHybridBenefit = 2.1m,
            Spot = 1.8m,
            SpotWithAzureHybridBenefit = 1.86m,
            OneYearSavingsPlan = 1.78m,
            OneYearSavingsPlanWithAzureHybridBenefit = 1.72m,
            ThreeYearSavingsPlan = 1.56m,
            ThreeYearSavingsPlanWithAzureHybridBenefit = 1.44m,
            OneYearReserved = 1.68m,
            OneYearReservedWithAzureHybridBenefit = 1.62m,
            ThreeYearReserved = 1.42m,
            ThreeYearReservedWithAzureHybridBenefit = 1.36m
        };
    }

    public static VmPricing AsUsWestWindowsD8V3()
    {
        return new VmPricing
        {
            Instance = "D8 v3",
            OperatingSystem = "windows",
            Ram = 32,
            Region = "us-west",
            VCpu = 8,
            PayAsYouGo = 4.4m,
            PayAsYouGoWithAzureHybridBenefit = 4.2m,
            Spot = 3.6m,
            SpotWithAzureHybridBenefit = 3.72m,
            OneYearSavingsPlan = 3.56m,
            OneYearSavingsPlanWithAzureHybridBenefit = 3.44m,
            ThreeYearSavingsPlan = 3.12m,
            ThreeYearSavingsPlanWithAzureHybridBenefit = 2.88m,
            OneYearReserved = 3.36m,
            OneYearReservedWithAzureHybridBenefit = 3.24m,
            ThreeYearReserved = 2.84m,
            ThreeYearReservedWithAzureHybridBenefit = 2.72m
        };
    }

    public static VmPricing AsUsWestWindowsD16V3()
    {
        return new VmPricing
        {
            Instance = "D16 v3",
            OperatingSystem = "windows",
            Ram = 64,
            Region = "us-west",
            VCpu = 16,
            PayAsYouGo = 8.8m,
            PayAsYouGoWithAzureHybridBenefit = 8.4m,
            Spot = 7.2m,
            SpotWithAzureHybridBenefit = 7.44m,
            OneYearSavingsPlan = 7.12m,
            OneYearSavingsPlanWithAzureHybridBenefit = 6.88m,
            ThreeYearSavingsPlan = 6.24m,
            ThreeYearSavingsPlanWithAzureHybridBenefit = 5.76m,
            OneYearReserved = 6.72m,
            OneYearReservedWithAzureHybridBenefit = 6.48m,
            ThreeYearReserved = 5.68m,
            ThreeYearReservedWithAzureHybridBenefit = 5.44m
        };
    }
}
