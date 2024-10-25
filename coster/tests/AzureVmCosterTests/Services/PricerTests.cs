using AzureVmCoster.Services;
using AzureVmCosterTests.TestInfrastructure;

namespace AzureVmCosterTests.Services;

public class PricerTests
{
    private readonly Pricer _target = new("TestFiles/Pricing/");

    [Fact]
    public void GivenMissingRegionAndMissingOperatingSystem_WhenEnsurePricingExists_ThenThrow()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            new() {Region = "missing", OperatingSystem = "missing"}
        };

        // Act
        var actualException = Assert.Throws<InvalidOperationException>(() => _target.EnsurePricingExists(vms));

        // Assert
        Assert.NotNull(actualException);
    }

    [Fact]
    public void GivenExistingRegionAndExistingOperatingSystem_WhenEnsurePricingExists_ThenDoNotThrow()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            new() {Region = "germany-west-central", OperatingSystem = "windows"}
        };

        // Act
        var action = () => _target.EnsurePricingExists(vms);

        // Assert
        action.Should().NotThrow();
    }

    [Fact]
    public void GivenExistingRegionAndMissingOperatingSystem_WhenEnsurePricingExists_ThenThrow()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            new() {Region = "germany-west-central", OperatingSystem = "missing"}
        };

        // Act
        var actualException = Assert.Throws<InvalidOperationException>(() => _target.EnsurePricingExists(vms));

        // Assert
        Assert.NotNull(actualException);
    }

    [Fact]
    public void GivenMissingRegionAndExistingOperatingSystem_WhenEnsurePricingExists_ThenThrow()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            new() {Region = "missing", OperatingSystem = "windows"}
        };

        // Act
        var actualException = Assert.Throws<InvalidOperationException>(() => _target.EnsurePricingExists(vms));

        // Assert
        Assert.NotNull(actualException);
    }

    [Fact]
    public void GivenEmptyExcludeList_WhenFilterPricing_ThenNoPriceRemoved()
    {
        // Arrange
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3()
        };
        var exclusions = new List<string>();

        // Act
        var filteredPrices = Pricer.FilterPricing(prices, exclusions);

        // Assert
        filteredPrices.Should().BeEquivalentTo(prices);
    }

    [Fact]
    public void GivenExcludeList_WhenFilterPricing_ThenRemoveInstanceWithSameName()
    {
        // Arrange
        var d4V3 = VmPricingBuilder.AsUsWestWindowsD2V3();
        d4V3.Instance = "D4 v3";
        var d2V3Linux = VmPricingBuilder.AsUsWestWindowsD2V3();
        d2V3Linux.OperatingSystem = "linux";
        var d2V3EuWest = VmPricingBuilder.AsUsWestWindowsD2V3();
        d2V3EuWest.Region = "europe-west";
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3(),
            d4V3,
            d2V3Linux,
            d2V3EuWest
        };
        var exclusions = new List<string> { "D2 v3" };

        // Act
        var filteredPrices = Pricer.FilterPricing(prices, exclusions);

        // Assert
        var expected = new List<VmPricing> { d4V3 };
        filteredPrices.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void GivenExcludeList_WhenFilterPricing_ThenRemoveInstanceWithSameNameCaseInsensitive()
    {
        // Arrange
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3()
        };
        var exclusions = new List<string> { "d2 V3" };

        // Act
        var filteredPrices = Pricer.FilterPricing(prices, exclusions);

        // Assert
        filteredPrices.Should().BeEmpty();
    }

    [Fact]
    public void GivenMatchingPrice_WhenPrice_ThenPriceVm()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            InputVmBuilder.AsUsWestWindowsD2V3Equivalent()
        };
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3()
        };

        // Act
        var actualPricedVms = Pricer.Price(vms, prices);

        // Assert
        var expectedPricedVms = new List<PricedVm> { new(vms[0], prices[0]) };
        actualPricedVms.Should().BeEquivalentTo(expectedPricedVms);
    }

    [Fact]
    public void GivenNoMatchingPrice_WhenPrice_ThenHandleVmAsNoPrice()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            InputVmBuilder.AsUsWestWindowsD2V3Equivalent()
        };
        var prices = new List<VmPricing>();

        // Act
        var actualPricedVms = Pricer.Price(vms, prices);

        // Assert
        var expectedPricedVms = new List<PricedVm> { new(vms[0], null) };
        actualPricedVms.Should().BeEquivalentTo(expectedPricedVms);
    }

    [Fact]
    public void GivenVmWithoutCpuAndWithoutRam_WhenPrice_ThenUseMedianCpuAndRam()
    {
        // Arrange
        var vmWithoutCpuWithoutRam = new InputVm
        {
            Name = "map-me-to-median",
            OperatingSystem = "windows",
            Region = "us-west"
        };
        var vms = new List<InputVm>
        {
            InputVmBuilder.AsUsWestWindowsD2V3Equivalent(),
            InputVmBuilder.AsUsWestWindowsD4V3Equivalent(),
            InputVmBuilder.AsUsWestWindowsD8V3Equivalent(),
            InputVmBuilder.AsUsWestWindowsD16V3Equivalent(),
            vmWithoutCpuWithoutRam
        };
        var medianPrice = VmPricingBuilder.AsUsWestWindowsD8V3();
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3(),
            VmPricingBuilder.AsUsWestWindowsD4V3(),
            medianPrice,
            VmPricingBuilder.AsUsWestWindowsD16V3()
        };

        // Act
        var actualPricedVms = Pricer.Price(vms, prices);

        // Assert
        var expectedPricedVms = new List<PricedVm>
        {
            new(vms[0], prices[0]),
            new(vms[1], prices[1]),
            new(vms[2], prices[2]),
            new(vms[3], prices[3]),
            new(vmWithoutCpuWithoutRam, medianPrice)
        };
        actualPricedVms.Should().BeEquivalentTo(expectedPricedVms);
    }
}
