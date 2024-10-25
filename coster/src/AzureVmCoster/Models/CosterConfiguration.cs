using AzureVmCoster.Services;

namespace AzureVmCoster.Models;

internal sealed class CosterConfiguration
{
    public IList<string> ExcludedVms { get; set; } = new List<string>();

    public static async Task<CosterConfiguration> FromPathAsync(string? path)
    {
        if (!string.IsNullOrWhiteSpace(path))
        {
            return await JsonReader.DeserializeAsync<CosterConfiguration>(path) ?? new CosterConfiguration();
        }

        return new CosterConfiguration();
    }
}
