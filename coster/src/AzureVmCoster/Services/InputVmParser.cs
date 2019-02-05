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
        public List<InputVm> Parse(FileInfo inputCsv)
        {
            using (var reader = new StreamReader(inputCsv.FullName))
            using (var csv = new CsvReader(reader))
            {
                csv.Configuration.RegisterClassMap<InputVmMap>();
                return csv.GetRecords<InputVm>().ToList();
            }
        }
    }
}