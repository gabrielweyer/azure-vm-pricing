using AzureVmCoster.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace AzureVmCoster;

#pragma warning disable CA1052 // Used as a parameter type
public class Program
#pragma warning restore CA1052
{
    public static async Task<int> Main(string[] args)
    {
        var builder = Host.CreateDefaultBuilder(args);
        builder.ConfigureServices(s => s
            .AddSingleton(new PriceDirectory(@"Prices\"))
            .AddSingleton<Pricer>()
            .AddSingleton<ArgumentReader>()
            .AddSingleton<VmPriceParser>()
            .AddSingleton<PricedVmWriter>()
            .AddSingleton<PriceService>());
        var host = builder.Build();

        var logger = host.Services.GetRequiredService<ILogger<Program>>();
        var priceService = host.Services.GetRequiredService<PriceService>();
        var argumentReader = host.Services.GetRequiredService<ArgumentReader>();

        try
        {
            ArgumentNullException.ThrowIfNull(args);

            var (inputFilePath, configurationFilePath, culture) = ParseConfiguration(args, argumentReader);

            await priceService.PriceAsync(inputFilePath, configurationFilePath, culture);

            return 0;
        }
#pragma warning disable CA1031 // This is a catch-all so that we can log the exception
        catch (Exception e)
#pragma warning restore CA1031
        {
            logger.LogError(e, "Failed to cost VMs");
            return -1;
        }
    }

    private static (string? inputVmFilePath, string? configurationFilePath, CultureInfo culture) ParseConfiguration(string[] args, ArgumentReader argumentReader)
    {
        string? inputVmFilePath = null;
        string? configurationFilePath = null;
        var culture = Thread.CurrentThread.CurrentCulture;

#if DEBUG
        Console.Write("Input file path: ");
        inputVmFilePath = Console.ReadLine();
        ArgumentReader.StripSurroundingDoubleQuotes(ref inputVmFilePath);

        Console.Write("Configuration file path (leave blank if not used): ");
        configurationFilePath = Console.ReadLine();
        ArgumentReader.StripSurroundingDoubleQuotes(ref configurationFilePath);

        Console.Write("Culture (leave blank for system default): ");
        var cultureInput = Console.ReadLine();

        if (!string.IsNullOrWhiteSpace(cultureInput))
        {
            culture = new CultureInfo(cultureInput);
        }
#else
        (inputVmFilePath, configurationFilePath, culture) = argumentReader.Read(args);
#endif

        return (inputVmFilePath, configurationFilePath, culture);
    }
}
