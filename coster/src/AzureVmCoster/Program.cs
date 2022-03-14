using System;
using System.Globalization;
using System.IO;
using System.Threading;
using AzureVmCoster.Services;

namespace AzureVmCoster;

public static class Program
{
    private const string PricingDirectory = @"Pricing\";

    static int Main(string[] args)
    {
        string inputFilePath = null;
        var culture = Thread.CurrentThread.CurrentCulture;

#if DEBUG
            Console.Write("Input file path: ");
            inputFilePath = Console.ReadLine();

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
                default:
                    Console.WriteLine($"'{args[offset]}' is not a known switch, supported values are: '-l', '--culture', '-i', '--input'");
                    break;
            }
        }
#endif

        if (string.IsNullOrWhiteSpace(inputFilePath))
        {
            Console.WriteLine("The input file path is required: -i <file-path>");
            return -1;
        }

        if (inputFilePath.StartsWith('"'))
        {
            inputFilePath = inputFilePath.Replace("\"", "");
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

        var inputVms = InputVmParser.Parse(inputFile, culture);

        var pricer = new Pricer(PricingDirectory);
        pricer.EnsurePricingExists(inputVms);

        var pricings = new VmPricingParser(PricingDirectory).Parse();

        var pricedVms = Pricer.Price(inputVms, pricings);
        PricedVmWriter.Write(inputFile.Name, pricedVms, culture);

        return 0;
    }
}
