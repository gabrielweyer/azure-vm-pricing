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

        StripSurroundingDoubleQuotes(ref inputFilePath);

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
            StripSurroundingDoubleQuotes(ref configurationFilePath);

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
        for (var offset = 0; offset < args.Length; offset += 2)
        {
            switch (args[offset])
            {
                case "-l":
                case "--culture":
                    culture = new CultureInfo(args[offset + 1]);
                    break;
                case "-i":
                case "--input":
                    inputFilePath = args[offset + 1];
                    break;
                case "-c":
                case "--configuration":
                    configurationFilePath = args[offset + 1];
                    break;
                default:
                    Console.WriteLine($"'{args[offset]}' is not a known switch, supported values are: '-l', '--culture', '-i', '--input', '-c', '--configuration'");
                    break;
            }
        }
#endif

        return (inputFilePath, configurationFilePath, culture);
    }

    /// <summary>
    /// <para>Strip starting and trailing double quotes if present.</para>
    /// <para>When copying a path from the Explorer, Windows surrounds the path with double quotes so that it remains
    /// usable if a space is present.</para>
    /// </summary>
    /// <param name="filePath">The reference will be assigned to only if the path starts with ".</param>
    private static void StripSurroundingDoubleQuotes(ref string filePath)
    {
        if (filePath.StartsWith('"'))
        {
            filePath = filePath.Replace("\"", "", StringComparison.Ordinal);
        }
    }
}
