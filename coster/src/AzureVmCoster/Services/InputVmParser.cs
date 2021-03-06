using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using AzureVmCoster.Models;
using AzureVmCoster.Models.Csv;
using CsvHelper;

namespace AzureVmCoster.Services
{
    public class InputVmParser
    {
        public List<InputVm> Parse(FileInfo inputCsv, CultureInfo culture)
        {
            using (var reader = new StreamReader(inputCsv.FullName))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                csv.Configuration.RegisterClassMap<InputVmMap>();
                csv.Configuration.CultureInfo = culture;
                return csv.GetRecords<InputVm>().ToList();
            }
        }
    }
}