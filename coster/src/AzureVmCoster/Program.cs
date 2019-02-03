using AzureVmCoster.Services;

namespace AzureVmCoster
{
    class Program
    {
        private const string PricingDirectory = @"Pricing\";

        static void Main(string[] args)
        {
            const string inputFilePath = @"";
            var inputVms = new InputVmParser().Parse(inputFilePath);

            var pricer = new Pricer(PricingDirectory);
            pricer.EnsurePricingExists(inputVms);

            var pricings = new VmPricingParser(PricingDirectory).Parse();

            var pricedVms = pricer.Price(inputVms, pricings);
        }
    }
}
