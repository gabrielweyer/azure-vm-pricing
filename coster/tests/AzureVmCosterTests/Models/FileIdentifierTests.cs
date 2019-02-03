using System.IO;
using AzureVmCoster.Models;
using FluentAssertions;
using Xunit;

namespace AzureVmCosterTests.Models
{
    public class FileIdentifierTests
    {
        [Fact]
        public void GivenInitialisedIdentifier_WhenGetPricingFilename_ThenExpected()
        {
            // Arrange

            var identifier = new FileIdentifier("some-region", "some-operating-system");

            // Actual

            var actual = identifier.GetPricingFilename();

            // Assert

            actual.Should().Be("vm-pricing_some-region_some-operating-system.json");
        }

        [Fact]
        public void GivenValidFilename_WhenFrom_Then()
        {
            // Arrange

            var file = new FileInfo(@"E:\tmp\vm-pricing_some-region_some-operating-system.json");

            // Act

            var actual = FileIdentifier.From(file);

            // Assert

            var expected = new FileIdentifier("some-region", "some-operating-system");

            actual.Should().BeEquivalentTo(expected);
        }
    }
}