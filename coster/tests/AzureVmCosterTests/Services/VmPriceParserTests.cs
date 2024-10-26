using AzureVmCoster.Services;

namespace AzureVmCosterTests.Services;

public class VmPriceParserTests
{
    [Fact]
    public async Task GivenValidPrice_ThenParseVm()
    {
        // Arrange
        var parser = new VmPriceParser(new PriceDirectory("TestFiles/Price/"));

        // Act
        var actualPrices = await parser.ParseAsync();

        // Assert
        var expectedPrices = new List<VmPrice>
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
        actualPrices.Should().BeEquivalentTo(expectedPrices);
    }

    [Fact]
    public async Task GivenEmptyPriceFile_ThenHandleGracefully()
    {
        // Arrange
        var parser = new VmPriceParser(new PriceDirectory("TestFiles/EmptyPrice/"));

        // Act
        var prices = await parser.ParseAsync();

        // Assert
        prices.Should().BeEmpty();
    }
}
