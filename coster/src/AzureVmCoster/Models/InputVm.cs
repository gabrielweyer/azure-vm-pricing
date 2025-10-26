namespace AzureVmCoster.Models;

internal class InputVm
{
    public string Name { get; set; } = default!;
    public string Region { get; set; } = default!;
    public short Cpu { get; set; }
    public decimal Ram { get; set; }
    public string OperatingSystem { get; set; } = default!;
}
