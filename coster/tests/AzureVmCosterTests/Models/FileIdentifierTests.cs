namespace AzureVmCosterTests.Models;

public static class FileIdentifierTests
{
    [Fact]
    public static void GivenInitialisedIdentifier_WhenGetPricingFilename_ThenExpected()
    {
        // Arrange
        var identifier = new FileIdentifier("some-region", "some-operating-system");

        // Actual
        var actual = identifier.PricingFilename;

        // Assert
        actual.Should().Be("vm-pricing_some-region_some-operating-system.json");
    }

    [Fact]
    public static void GivenValidFilename_WhenFromFileInfo_ThenExpected()
    {
        // Arrange
        var file = new FileInfo(@"E:\tmp\vm-pricing_some-region_some-operating-system.json");

        // Act
        var actual = FileIdentifier.From(file);

        // Assert
        var expected = new FileIdentifier("some-region", "some-operating-system");

        actual.Should().BeEquivalentTo(expected);
    }

    [Theory]
    [InlineData(@"E:\tmp\vm-pricing_some-region.json")]
    [InlineData(@"E:\tmp\vm-pricing.json")]
    [InlineData(@"E:\tmp\vm-pricing_some-region_some-operating-system.csv")]
    public static void GivenInvalidFilename_WhenFromFileInfo_ThenThrows(string filePath)
    {
        // Arrange
        var file = new FileInfo(filePath);

        // Act
        var actualException = Assert.Throws<ArgumentOutOfRangeException>(() => FileIdentifier.From(file));

        // Assert
        Assert.NotNull(actualException);
    }
}
