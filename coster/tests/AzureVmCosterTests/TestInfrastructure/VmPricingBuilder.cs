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
}
