using System.Collections.Generic;
using System.Linq;
using AzureVmCoster.Models;
using AzureVmCoster.Services;
using FluentAssertions;
using Xunit;

namespace AzureVmCosterTests.Services
{
    public class InputVmParserTests
    {
        private readonly InputVmParser _target;
        private readonly List<InputVm> _expected = new List<InputVm>
        {
            new InputVm {Name = "name-1", Region = "us-west", Cpu = 4, Ram = 8, OperatingSystem = "windows"},
            new InputVm {Name = "name-2", Region = "us-west-2", Cpu = 8, Ram = 16, OperatingSystem = "linux"},
            new InputVm {Name = "name-3", Region = "us-west", Cpu = 16, Ram = 32, OperatingSystem = "linux"}
        };

        public InputVmParserTests()
        {
            _target = new InputVmParser();
        }

        [Fact]
        public void GivenExactMatchInput_WhenParse_ThenPreserveOrder()
        {
            // Act

            var actualVms = _target.Parse(@"SampleInputs\input-01.csv");

            // Assert

            Assert.NotNull(actualVms);
            actualVms.Select(v => v.Name).Should().ContainInOrder("name-1", "name-2", "name-3");
        }

        [Fact]
        public void GivenExactMatchInput_WhenParse_ThenParseAllFields()
        {
            // Act

            var actualVms = _target.Parse(@"SampleInputs\input-01.csv");

            // Assert

            Assert.NotNull(actualVms);
            actualVms.Should().BeEquivalentTo(_expected);
        }

        [Fact]
        public void GivenInputWithUnknownFields_WhenParse_ThenIgnoreUnknownFields()
        {
            // Act

            var actualVms = _target.Parse(@"SampleInputs\input-02.csv");

            // Assert

            Assert.NotNull(actualVms);
            actualVms.Should().BeEquivalentTo(_expected);
        }
    }
}