using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using AzureVmCoster.Models;
using AzureVmCoster.Services;
using FluentAssertions;
using Xunit;

namespace AzureVmCosterTests.Services;

public class InputVmParserTests
{
    private readonly List<InputVm> _expected = new List<InputVm>
    {
        new InputVm {Name = "name-1", Region = "us-west", Cpu = 4, Ram = 8, OperatingSystem = "windows"},
        new InputVm {Name = "name-2", Region = "us-west-2", Cpu = 8, Ram = 16, OperatingSystem = "linux"},
        new InputVm {Name = "name-3", Region = "us-west", Cpu = 16, Ram = 32.5m, OperatingSystem = "linux"}
    };

    [Fact]
    public void GivenExactMatchInputAndCultureWithPeriodDecimalPoint_WhenParse_ThenPreserveOrder()
    {
        // Act

        var file = new FileInfo(@"SampleInputs/input-en-au.csv");
        var culture = new CultureInfo("en-au");
        var actualVms = InputVmParser.Parse(file, culture);

        // Assert

        Assert.NotNull(actualVms);
        actualVms.Select(v => v.Name).Should().ContainInOrder("name-1", "name-2", "name-3");
    }

    [Fact]
    public void GivenExactMatchInputAndCultureWithPeriodDecimalPoint_WhenParse_ThenParseAllFields()
    {
        // Act

        var file = new FileInfo(@"SampleInputs/input-en-au.csv");
        var culture = new CultureInfo("en-au");
        var actualVms = InputVmParser.Parse(file, culture);

        // Assert

        Assert.NotNull(actualVms);
        actualVms.Should().BeEquivalentTo(_expected);
    }

    [Fact]
    public void GivenInputWithUnknownFieldsAndCultureWithPeriodDecimalPoint_WhenParse_ThenIgnoreUnknownFields()
    {
        // Act

        var fileInfo = new FileInfo(@"SampleInputs/input-en-au-extra-fields.csv");
        var culture = new CultureInfo("en-au");
        var actualVms = InputVmParser.Parse(fileInfo, culture);

        // Assert

        Assert.NotNull(actualVms);
        actualVms.Should().BeEquivalentTo(_expected);
    }

    [Fact]
    public void GivenExactMatchInputAndCultureWithCommaDecimalPoint_WhenParse_ThenParseAllFields()
    {
        // Act

        var file = new FileInfo(@"SampleInputs/input-fr-fr.csv");
        var culture = new CultureInfo("fr-fr");
        var actualVms = InputVmParser.Parse(file, culture);

        // Assert

        Assert.NotNull(actualVms);
        actualVms.Should().BeEquivalentTo(_expected);
    }
}
