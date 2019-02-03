using System;
using System.Collections.Generic;
using System.IO;
using AzureVmCoster.Models;
using CsvHelper;

namespace AzureVmCoster.Services
{
    public class PricedVmWriter
    {
        public void Write(List<PricedVm> pricedVms)
        {
            using (var writer = new StreamWriter($@"Out\{Guid.NewGuid()}.csv"))
            using (var csv = new CsvWriter(writer))
            {
                csv.WriteRecords(pricedVms);
            }
        }
    }
}