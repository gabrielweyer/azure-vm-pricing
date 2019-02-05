using System;
using System.IO;
using AzureVmCoster.Services;

namespace AzureVmCoster
{
    class Program
    {
        private const string PricingDirectory = @"Pricing\";

        static int Main(string[] args)
        {
            string inputFilePath;
#if DEBUG
            Console.Write("Input file path: ");
            inputFilePath = Console.ReadLine();

            if (string.IsNullOrWhiteSpace(inputFilePath))
            {
                Console.WriteLine("The input file path is required");
                return -1;
            }

            if (inputFilePath.StartsWith('"'))
            {
                inputFilePath = inputFilePath.Replace("\"", "");
            }
#else
            if (args.Length != 1)
            {
                Console.WriteLine("You should provide the input file path as the single argument");
                return -1;
            }

            inputFilePath = args[0];
#endif

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

            var inputVms = new InputVmParser().Parse(inputFile);

            var pricer = new Pricer(PricingDirectory);
            pricer.EnsurePricingExists(inputVms);

            var pricings = new VmPricingParser(PricingDirectory).Parse();

            var pricedVms = pricer.Price(inputVms, pricings);
            new PricedVmWriter().Write(inputFile.Name, pricedVms);

            return 0;
        }
    }
}
