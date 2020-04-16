using System.Collections.Generic;
using System.Globalization;
using System.IO;
using AzureVmCoster.Models;
using AzureVmCoster.Models.Csv;
using CsvHelper;

namespace AzureVmCoster.Services
{
    public class PricedVmWriter
    {
        public void Write(string filename, List<PricedVm> pricedVms, CultureInfo culture)
        {
            using (var writer = new StreamWriter($@"Out\{filename}"))
            using (var csv = new CsvWriter(writer, CultureInfo.InvariantCulture))
            {
                csv.Configuration.RegisterClassMap<PricedVmMap>();
                csv.Configuration.CultureInfo = culture;
                csv.WriteRecords(pricedVms);
            }
        }
    }
}