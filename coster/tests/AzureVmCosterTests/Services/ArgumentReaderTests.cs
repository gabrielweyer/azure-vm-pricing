using System.Globalization;
using AzureVmCoster.Services;

namespace AzureVmCosterTests.Services;

public class ArgumentReaderTests
{
    [Fact]
    public void GivenValidArguments_WhenShortNames_ThenReturnExpectedConfiguration()
    {
        // Arrange
        var args = new[] { "-l", "en-us", "-i", "/tmp/input.json", "-c", "/tmp/config.json" };

        // Act
        var (inputFilePath, configurationFilePath, culture) = ArgumentReader.Read(args);

        // Assert
        inputFilePath.Should().Be("/tmp/input.json");
        configurationFilePath.Should().Be("/tmp/config.json");
        culture.Should().Be(new CultureInfo("en-us"));
    }

    [Fact]
    public void GivenDoubleQuotePaths_ThenStripDoubleQuotes()
    {
        // Arrange
        var args = new[] { "-i", @"""C:\tmp\input.json""", "-c", @"""C:\tmp\input\config.json""" };

        // Act
        var (inputFilePath, configurationFilePath, culture) = ArgumentReader.Read(args);

        // Assert
        inputFilePath.Should().Be(@"C:\tmp\input.json");
        configurationFilePath.Should().Be(@"C:\tmp\input\config.json");
    }

    [Fact]
    public void GivenUnknownArgument_ThenIgnoreUnknownArgument()
    {
        // Arrange
        var args = new[] { "--unknown", "ignored", "-i", "/tmp/input.json" };

        // Act
        var (inputFilePath, _, _) = ArgumentReader.Read(args);

        // Assert
        inputFilePath.Should().Be("/tmp/input.json");
    }

    [Fact]
    public void GivenValidArguments_WhenLongNames_ThenReturnExpectedConfiguration()
    {
        // Arrange
        var args = new[] { "--culture", "en-us", "--input", "/tmp/input.json", "--configuration", "/tmp/config.json" };

        // Act
        var (inputFilePath, configurationFilePath, culture) = ArgumentReader.Read(args);

        // Assert
        inputFilePath.Should().Be("/tmp/input.json");
        configurationFilePath.Should().Be("/tmp/config.json");
        culture.Should().Be(new CultureInfo("en-us"));
    }

    [Fact]
    public void GivenNoCultureArgumentProvided_ThenUseThreadCulture()
    {
        // Arrange
        var args = new[] { "-i", "/tmp/input.json", "-c", "/tmp/config.json" };

        // Act
        var thread = new Thread(AssertThreadCulture);
        thread.Start();

        var hasThreadTerminated = thread.Join(TimeSpan.FromSeconds(1));
        hasThreadTerminated.Should().BeTrue();
        return;

        void AssertThreadCulture()
        {
            Thread.CurrentThread.CurrentCulture = new CultureInfo("pl-pl");

            var (inputFilePath, configurationFilePath, culture) = ArgumentReader.Read(args);

            // Assert
            inputFilePath.Should().Be("/tmp/input.json");
            configurationFilePath.Should().Be("/tmp/config.json");
            culture.Should().Be(new CultureInfo("pl-pl"));
        }
    }
}
