using AzureVmCoster.Services;
using AzureVmCosterTests.TestInfrastructure;
using Microsoft.Extensions.Logging.Abstractions;

namespace AzureVmCosterTests.Services;

public class PricerTests
{
    private readonly Pricer _target = new(NullLogger<Pricer>.Instance);
    private readonly CosterConfiguration _defaultConfiguration = new();

    [Fact]
    public void GivenMissingRegionAndMissingOperatingSystem_WhenEnsurePricingExists_ThenThrow()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            InputVmBuilder.AsUsEastLinuxD2V3Equivalent()
        };
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3()
        };

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => _target.Price(vms, prices, _defaultConfiguration));
    }

    [Fact]
    public void GivenExistingRegionAndExistingOperatingSystem_WhenEnsurePricingExists_ThenDoNotThrow()
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
        var pricedVms = _target.Price(vms, prices, _defaultConfiguration);

        // Assert
        pricedVms.Should().NotBeEmpty();
    }

    [Fact]
    public void GivenExistingRegionAndMissingOperatingSystem_WhenEnsurePricingExists_ThenThrow()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            InputVmBuilder.AsUsWestLinuxD2V3Equivalent()
        };
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3()
        };

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => _target.Price(vms, prices, _defaultConfiguration));
    }

    [Fact]
    public void GivenMissingRegionAndExistingOperatingSystem_WhenEnsurePricingExists_ThenThrow()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            InputVmBuilder.AsUsEastWindowsD2V3Equivalent()
        };
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3()
        };

        // Act & Assert
        Assert.Throws<InvalidOperationException>(() => _target.Price(vms, prices, _defaultConfiguration));
    }

    [Fact]
    public void GivenEmptyExcludeList_WhenFilterPricing_ThenNoPriceRemoved()
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
        var configuration = new CosterConfiguration { ExcludedVms = new List<string>() };

        // Act
        var actualPricedVms = _target.Price(vms, prices, configuration);

        // Assert
        var expectedPricedVms = new List<PricedVm> { PricedVmBuilder.From(vms[0], prices[0]) };
        actualPricedVms.Should().BeEquivalentTo(expectedPricedVms);
    }

    [Fact]
    public void GivenExcludeList_WhenFilterPricing_ThenRemoveInstanceWithSameName()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            InputVmBuilder.AsUsWestWindowsD2V3Equivalent()
        };
        var d4V3 = VmPricingBuilder.AsUsWestWindowsD4V3();
        var d2V3Linux = VmPricingBuilder.AsUsWestLinuxD2V3();
        var d2V3UsEast = VmPricingBuilder.AsUsEastWindowsD2V3();
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3(),
            d4V3,
            d2V3Linux,
            d2V3UsEast
        };
        var configuration = new CosterConfiguration { ExcludedVms = new List<string> { "D2 v3" } };

        // Act
        var pricedVms = _target.Price(vms, prices, configuration);

        // Assert
        var expected = new List<PricedVm> { PricedVmBuilder.From(vms[0], d4V3) };
        pricedVms.Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void GivenExcludeList_WhenFilterPricing_ThenRemoveInstanceWithSameNameCaseInsensitive()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            InputVmBuilder.AsUsWestWindowsD2V3Equivalent()
        };
        var d4V3 = VmPricingBuilder.AsUsWestWindowsD4V3();
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3(),
            d4V3
        };
        var configuration = new CosterConfiguration { ExcludedVms = new List<string> { "d2 V3" } };

        // Act
        var actual = _target.Price(vms, prices, configuration);

        // Assert
        var expected = new List<PricedVm> { PricedVmBuilder.From(vms[0], d4V3) };
        actual.Should().BeEquivalentTo(expected);
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
        var actualPricedVms = _target.Price(vms, prices, _defaultConfiguration);

        // Assert
        var expectedPricedVms = new List<PricedVm> { PricedVmBuilder.From(vms[0], prices[0]) };
        actualPricedVms.Should().BeEquivalentTo(expectedPricedVms);
    }

    [Fact]
    public void GivenNoMatchingPrice_WhenPrice_ThenHandleVmAsNoPrice()
    {
        // Arrange
        var vms = new List<InputVm>
        {
            InputVmBuilder.AsUsWestWindowsD4V3Equivalent()
        };
        var prices = new List<VmPricing>
        {
            VmPricingBuilder.AsUsWestWindowsD2V3()
        };

        // Act
        var actualPricedVms = _target.Price(vms, prices, _defaultConfiguration);

        // Assert
        var expectedPricedVms = new List<PricedVm> { PricedVmBuilder.WithoutPrice(vms[0]) };
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
        var actualPricedVms = _target.Price(vms, prices, _defaultConfiguration);

        // Assert
        var expectedPricedVms = new List<PricedVm>
        {
            PricedVmBuilder.From(vms[0], prices[0]),
            PricedVmBuilder.From(vms[1], prices[1]),
            PricedVmBuilder.From(vms[2], prices[2]),
            PricedVmBuilder.From(vms[3], prices[3]),
            PricedVmBuilder.From(vmWithoutCpuWithoutRam, medianPrice)
        };
        actualPricedVms.Should().BeEquivalentTo(expectedPricedVms);
    }
}
