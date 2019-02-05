using System;
using System.Collections.Generic;
using System.IO;
using AzureVmCoster.Models;
using AzureVmCoster.Models.Csv;
using CsvHelper;

namespace AzureVmCoster.Services
{
    public class PricedVmWriter
    {
        public void Write(string filename, List<PricedVm> pricedVms)
        {
            using (var writer = new StreamWriter($@"Out\{filename}"))
            using (var csv = new CsvWriter(writer))
            {
                csv.Configuration.RegisterClassMap<PricedVmMap>();
                csv.WriteRecords(pricedVms);
            }
        }
    }
}