namespace AzureVmCoster.Models;

internal sealed class CosterConfiguration
{
    public IList<string> ExcludedVms { get; set; } = default!;
}
