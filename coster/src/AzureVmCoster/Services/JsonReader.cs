using System.Text.Json;

namespace AzureVmCoster.Services;

internal static class JsonReader
{
    private static readonly JsonSerializerOptions _options = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public static async Task<T?> DeserializeAsync<T>(string fileName)
    {
        await using var openStream = File.OpenRead(fileName);
        return await JsonSerializer.DeserializeAsync<T>(openStream, _options);
    }
}
