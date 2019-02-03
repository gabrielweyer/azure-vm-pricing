namespace AzureVmCoster.Models
{
    public class InputVm
    {
        public string Name { get; set; }
        public string Region { get; set; }
        public short Cpu { get; set; }
        public decimal Ram { get; set; }
        public string OperatingSystem { get; set; }
    }
}