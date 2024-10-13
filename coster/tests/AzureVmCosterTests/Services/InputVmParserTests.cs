using System.Globalization;
using AzureVmCoster.Services;

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
        // Arrange
        var file = new FileInfo(@"SampleInputs/input-en-au.csv");
        var culture = new CultureInfo("en-au");

        // Act
        var actualVms = InputVmParser.Parse(file, culture);

        // Assert
        Assert.NotNull(actualVms);
        actualVms.Select(v => v.Name).Should().ContainInOrder("name-1", "name-2", "name-3");
    }

    [Fact]
    public void GivenExactMatchInputAndCultureWithPeriodDecimalPoint_WhenParse_ThenParseAllFields()
    {
        // Arrange
        var file = new FileInfo(@"SampleInputs/input-en-au.csv");
        var culture = new CultureInfo("en-au");

        // Act
        var actualVms = InputVmParser.Parse(file, culture);

        // Assert
        Assert.NotNull(actualVms);
        actualVms.Should().BeEquivalentTo(_expected);
    }

    [Fact]
    public void GivenInputWithUnknownFieldsAndCultureWithPeriodDecimalPoint_WhenParse_ThenIgnoreUnknownFields()
    {
        // Arrange
        var fileInfo = new FileInfo(@"SampleInputs/input-en-au-extra-fields.csv");
        var culture = new CultureInfo("en-au");

        // Act
        var actualVms = InputVmParser.Parse(fileInfo, culture);

        // Assert
        Assert.NotNull(actualVms);
        actualVms.Should().BeEquivalentTo(_expected);
    }

    [Fact]
    public void GivenExactMatchInputAndCultureWithCommaDecimalPoint_WhenParse_ThenParseAllFields()
    {
        // Arrange
        var file = new FileInfo(@"SampleInputs/input-fr-fr.csv");
        var culture = new CultureInfo("fr-fr");

        // Act
        var actualVms = InputVmParser.Parse(file, culture);

        // Assert
        Assert.NotNull(actualVms);
        actualVms.Should().BeEquivalentTo(_expected);
    }

    [Fact]
    public void GivenRegionAndOperatingSystemWithUnexpectedCase_WhenParse_ThenLowerCase()
    {
        // Arrange
        var file = new FileInfo("SampleInputs/input-en-au-wrong-case.csv");
        var culture = new CultureInfo("en-au");

        // Act
        var actualVms = InputVmParser.Parse(file, culture);

        // Assert
        var expected = new List<InputVm>
        {
            new() {Name = "name-1", Region = "us-west", Cpu = 4, Ram = 8, OperatingSystem = "windows"}
        };
        Assert.NotNull(actualVms);
        actualVms.Should().BeEquivalentTo(expected);
    }
}
