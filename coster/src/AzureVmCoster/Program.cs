using AzureVmCoster.Services;

namespace AzureVmCoster;

public static class Program
{
    private const string PricingDirectory = @"Pricing\";

    public static async Task<int> Main(string[] args)
    {
        ArgumentNullException.ThrowIfNull(args);

        var (inputFilePath, configurationFilePath, culture) = ParseConfiguration(args);

        if (string.IsNullOrWhiteSpace(inputFilePath))
        {
            Console.WriteLine("The input file path is required: -i <file-path>");
            return -1;
        }

        var inputFile = new FileInfo(inputFilePath);

        if (!inputFile.Exists)
        {
            Console.WriteLine($"The file '{inputFile.FullName}' is not accessible");
            return -1;
        }

        if (!".csv".Equals(inputFile.Extension, StringComparison.OrdinalIgnoreCase))
        {
            Console.WriteLine($"The file '{inputFile.FullName}' doesn't have a '.csv' extension");
            return -1;
        }

        var configuration = new CosterConfiguration();

        if (!string.IsNullOrWhiteSpace(configurationFilePath))
        {
            configuration = await JsonReader.DeserializeAsync<CosterConfiguration>(configurationFilePath) ?? new CosterConfiguration();
        }

        var inputVms = InputVmParser.Parse(inputFile, culture);

        var pricer = new Pricer(PricingDirectory);
        pricer.EnsurePricingExists(inputVms);

        var pricings = await new VmPricingParser(PricingDirectory).ParseAsync();
        pricings = Pricer.FilterPricing(pricings, configuration.ExcludedVms);

        var pricedVms = Pricer.Price(inputVms, pricings);
        PricedVmWriter.Write(inputFile.Name, pricedVms, culture);

        return 0;
    }

    private static (string? inputFilePath, string? configurationFilePath, CultureInfo culture) ParseConfiguration(string[] args)
    {
        string? inputFilePath = null;
        string? configurationFilePath = null;
        var culture = Thread.CurrentThread.CurrentCulture;

#if DEBUG
        Console.Write("Input file path: ");
        inputFilePath = Console.ReadLine();

        Console.Write("Configuration file path (leave blank if not used): ");
        configurationFilePath = Console.ReadLine();

        Console.Write("Culture (leave blank for system default): ");
        var cultureInput = Console.ReadLine();

        if (!string.IsNullOrWhiteSpace(cultureInput))
        {
            culture = new CultureInfo(cultureInput);
        }
#else
        (inputFilePath, configurationFilePath, culture) = ArgumentReader.Read(args);
#endif

        return (inputFilePath, configurationFilePath, culture);
    }
}
