using System;
using System.Collections.Generic;
using AzureVmCoster.Models;
using AzureVmCoster.Services;
using FluentAssertions;
using Xunit;

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
}
