namespace AzureVmCosterTests.Models;

public class CosterConfigurationTests
{
    [Theory]
    [InlineData(null)]
    [InlineData("")]
    public async Task GivenNoFileProvided_ThenDefaultConfiguration(string? path)
    {
        // Act
        var actualConfiguration = await CosterConfiguration.FromPathAsync(path);

        // Assert
        actualConfiguration.ExcludedVms.Should().BeEmpty();
    }

    [Fact]
    public async Task GivenValidConfigurationFile_ThenReadExcludedVms()
    {
        // Arrange
        const string path = "TestFiles/Configuration/configuration.json";

        // Act
        var actualConfiguration = await CosterConfiguration.FromPathAsync(path);

        // Assert
        var expectedExcludedVms = new List<string> { "B2ts v2" };
        actualConfiguration.ExcludedVms.Should().BeEquivalentTo(expectedExcludedVms);
    }
}
