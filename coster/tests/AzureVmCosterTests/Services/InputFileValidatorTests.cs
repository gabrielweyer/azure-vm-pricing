using AzureVmCoster.Services;

namespace AzureVmCosterTests.Services;

public class InputFileValidatorTests
{
    [Fact]
    public void GivenValidFile_ThenReturnFile()
    {
        // Arrange
        const string filePath = "TestFiles/Input/input-en-au.csv";

        // Act
        var actualFile = InputFileValidator.Validate(filePath);

        // Assert
        actualFile.Exists.Should().BeTrue();
    }

    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public void GivenEmptyOrNullFilePath_ThenThrow(string? filePath)
    {
        // Act
        Assert.Throws<ArgumentOutOfRangeException>(() => InputFileValidator.Validate(filePath));
    }

    [Fact]
    public void GivenNonCsvExtension_ThenThrow()
    {
        // Arrange
        const string filePath = "TestFiles/Pricing/vm-pricing_germany-west-central_windows.json";

        // Act
        Assert.Throws<ArgumentOutOfRangeException>(() => InputFileValidator.Validate(filePath));
    }

    [Fact]
    public void GivenNonExistingFile_ThenThrow()
    {
        // Arrange
        const string filePath = "TestFiles/Input/missing.csv";

        // Act
        Assert.Throws<InvalidOperationException>(() => InputFileValidator.Validate(filePath));
    }
}
