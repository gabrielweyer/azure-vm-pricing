using System.Globalization;
using AzureVmCoster.Services;
using AzureVmCosterTests.TestInfrastructure;
using Microsoft.Extensions.Logging.Abstractions;

namespace AzureVmCosterTests.Services;

public class PricedVmWriterTests
{
    private const string CsvHeader = "Region,Name,Operating System,Instance,CPU,RAM,Pay as You Go,Pay as You Go with Azure Hybrid Benefit,One Year Reserved,One Year Reserved with Azure Hybrid Benefit,Three Year Reserved,Three Year Reserved with Azure Hybrid Benefit,Spot,Spot with Azure Hybrid Benefit,One Year Savings plan,One Year Savings plan with Azure Hybrid Benefit,Three Year Savings plan,Three Year Savings plan with Azure Hybrid Benefit";

    private readonly PricedVmWriter _target = new(NullLogger<PricedVmWriter>.Instance);

    [Fact]
    public void GivenPricedVm_WhenWrite_ThenPopulateAllColumns()
    {
        // Arrange
        var inputVm = InputVmBuilder.AsUsWestWindowsD2V3Equivalent();
        var vmPrice = VmPriceBuilder.AsUsWestWindowsD2V3();
        var vm = PricedVmBuilder.From(inputVm, vmPrice);
        var fileName = $"{Guid.NewGuid():D}.csv";

        // Act
        _target.Write(fileName, new List<PricedVm> { vm }, new CultureInfo("en-au"));

        // Assert
        const string expected = "us-west,map-me-to-d2-v3,windows,D2 v3,2,8,1.1,1.05,0.84,0.81,0.71,0.68,0.95,0.93,0.89,0.86,0.78,0.72";
        var actual = File.ReadAllLines($@"Out\{fileName}");
        actual.Should().HaveCount(2);
        actual[0].Should().BeEquivalentTo(CsvHeader);
        actual[1].Should().BeEquivalentTo(expected);
    }

    [Fact]
    public void GivenPricedVmWithoutPrice_WhenWrite_ThenEmptyPriceColumns()
    {
        // Arrange
        var inputVm = InputVmBuilder.AsUsWestWindowsD2V3Equivalent();
        var vm = PricedVmBuilder.WithoutPrice(inputVm);
        var fileName = $"{Guid.NewGuid():D}.csv";

        // Act
        _target.Write(fileName, new List<PricedVm> { vm }, new CultureInfo("en-au"));

        // Assert
        const string expected = "us-west,map-me-to-d2-v3,windows,,2,8,,,,,,,,,,,,";
        var actual = File.ReadAllLines($@"Out\{fileName}");
        actual.Should().HaveCount(2);
        actual[0].Should().BeEquivalentTo(CsvHeader);
        actual[1].Should().BeEquivalentTo(expected);
    }
}
