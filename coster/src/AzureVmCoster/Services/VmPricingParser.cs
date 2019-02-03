using System.Collections.Generic;
using System.IO;
using AzureVmCoster.Models;
using Newtonsoft.Json;

namespace AzureVmCoster.Services
{
    public class VmPricingParser
    {
        private readonly string _pricingDirectory;

        public VmPricingParser(string pricingDirectory)
        {
            _pricingDirectory = pricingDirectory;
        }

        public List<VmPricing> Parse()
        {
            var pricingFiles = Directory.GetFiles(_pricingDirectory, "*.json");

            var allVmPricing = new List<VmPricing>();

            foreach (var pricingFile in pricingFiles)
            {
                var fileInfo = new FileInfo(pricingFile);
                var fileIdentifier = FileIdentifier.From(fileInfo);

                var fileVmPricing = JsonConvert.DeserializeObject<List<VmPricing>>(File.ReadAllText(pricingFile));
                fileVmPricing.ForEach(pricing =>
                {
                    pricing.Region = fileIdentifier.Region;
                    pricing.OperatingSystem = fileIdentifier.OperatingSystem;
                });

                allVmPricing.AddRange(fileVmPricing);
            }

            return allVmPricing;
        }
    }
}