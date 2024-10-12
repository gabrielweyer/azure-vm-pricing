using AzureVmCoster.Services;

namespace AzureVmCosterTests.Services;

public class VmPricingParserTests
{
    private readonly VmPricingParser _parser = new("TestPricing/");

    [Fact]
    public void GivenValidPrice_ThenParseVm()
    {
        // Act
        var prices = _parser.Parse();

        // Assert
        var expectedPrices = new List<VmPricing>
        {
            new()
            {
                Region = "germany-west-central",
                OperatingSystem = "windows",
                Instance = "B2ts v2",
                VCpu = 2,
                Ram = 1,
                PayAsYouGo = 0.019m,
                PayAsYouGoWithAzureHybridBenefit = 0.0107m,
                OneYearSavingsPlan = 0.0153m,
                OneYearSavingsPlanWithAzureHybridBenefit = 0.0082m,
                ThreeYearSavingsPlan = 0.0131m,
                ThreeYearSavingsPlanWithAzureHybridBenefit = 0.0059m,
                OneYearReserved = 0.0135m,
                OneYearReservedWithAzureHybridBenefit = 0.0063m,
                ThreeYearReserved = 0.0113m,
                ThreeYearReservedWithAzureHybridBenefit = 0.0041m,
                Spot = 0.0063m,
                SpotWithAzureHybridBenefit = 0.0036m
            }
        };
        prices.Should().BeEquivalentTo(expectedPrices);
    }
}
