using System.Collections.Generic;
using System.IO;
using System.Linq;
using AzureVmCoster.Models;
using AzureVmCoster.Models.Csv;
using CsvHelper;

namespace AzureVmCoster.Services
{
    public class InputVmParser
    {
        public List<InputVm> Parse(string csvFilePath)
        {
            using (var reader = new StreamReader(csvFilePath))
            using (var csv = new CsvReader(reader))
            {
                return csv.GetRecords<InputVm>().ToList();
            }
        }
    }
}