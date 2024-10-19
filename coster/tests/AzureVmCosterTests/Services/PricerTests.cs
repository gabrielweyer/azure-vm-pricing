using AzureVmCoster.Services;
using AzureVmCosterTests.TestInfrastructure;

namespace AzureVmCosterTests.Services;

public class PricerTests
{
    private readonly Pricer _target;

    public PricerTests()
    {
        _target = new Pricer(@"SamplePricing/");
    }

    [Fact]
    public void GivenMissingRegionAndMissingOperatingSystem_WhenEnsurePricingExists_ThenThrow()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            new InputVm {Region = "missing", OperatingSystem = "missing"}
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
            new InputVm {Region = "region", OperatingSystem = "operating-system"}
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
            new InputVm {Region = "region", OperatingSystem = "missing"}
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
            new InputVm {Region = "missing", OperatingSystem = "operating-system"}
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
}
