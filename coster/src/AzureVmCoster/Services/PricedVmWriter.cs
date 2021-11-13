using System.Collections.Generic;
using System.Globalization;
using System.IO;
using AzureVmCoster.Models;
using AzureVmCoster.Models.Csv;
using CsvHelper;
using CsvHelper.Configuration;

namespace AzureVmCoster.Services
{
    public class PricedVmWriter
    {
        public void Write(string filename, List<PricedVm> pricedVms, CultureInfo culture)
        {
            var csvConfiguration = new CsvConfiguration(culture)
            {
                Delimiter = ","
            };

            using (var writer = new StreamWriter($@"Out\{filename}"))
            using (var csv = new CsvWriter(writer, csvConfiguration))
            {
                csv.Context.RegisterClassMap<PricedVmMap>();
                csv.WriteRecords(pricedVms);
            }
        }
    }
}