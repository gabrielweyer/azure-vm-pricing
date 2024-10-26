namespace AzureVmCoster.Services;

internal class PriceService
{
    private readonly Pricer _pricer;
    private readonly VmPriceParser _vmPriceParser;
    private readonly PricedVmWriter _pricedVmWriter;

    public PriceService(Pricer pricer, VmPriceParser vmPriceParser, PricedVmWriter pricedVmWriter)
    {
        _pricer = pricer;
        _vmPriceParser = vmPriceParser;
        _pricedVmWriter = pricedVmWriter;
    }

    public async Task PriceAsync(string? inputFilePath, string? configurationFilePath, CultureInfo culture)
    {
        var inputFile = InputFileValidator.Validate(inputFilePath);
        var inputVms = InputVmParser.Parse(inputFile, culture);

        var vmPrices = await _vmPriceParser.ParseAsync();

        var configuration = await CosterConfiguration.FromPathAsync(configurationFilePath);

        var pricedVms = _pricer.Price(inputVms, vmPrices, configuration);
        _pricedVmWriter.Write(inputFile.Name, pricedVms, culture);
    }
}
