using Microsoft.Extensions.Logging;

namespace AzureVmCoster.Services;

internal class ArgumentReader
{
    private readonly ILogger<ArgumentReader> _logger;

    public ArgumentReader(ILogger<ArgumentReader> logger)
    {
        _logger = logger;
    }

    public (string? inputVmFilePath, string? configurationFilePath, CultureInfo culture) Read(string[] args)
    {
        string? inputVmFilePath = null;
        string? configurationFilePath = null;
        var culture = Thread.CurrentThread.CurrentCulture;

        for (var offset = 0; offset < args.Length; offset += 2)
        {
            switch (args[offset])
            {
                case "-l":
                case "--culture":
                    culture = new CultureInfo(args[offset + 1]);
                    break;
                case "-i":
                case "--input":
                    inputVmFilePath = args[offset + 1];
                    StripSurroundingDoubleQuotes(ref inputVmFilePath);
                    break;
                case "-c":
                case "--configuration":
                    configurationFilePath = args[offset + 1];
                    StripSurroundingDoubleQuotes(ref configurationFilePath);
                    break;
                default:
                    _logger.LogWarning("'{UnsupportedArgument}' is not a known switch, supported values are: '-l', '--culture', '-i', '--input', '-c', '--configuration'", args[offset]);
                    break;
            }
        }

        return (inputVmFilePath, configurationFilePath, culture);
    }

    /// <summary>
    /// <para>Strip starting and trailing double quotes if present.</para>
    /// <para>When copying a path from the Explorer, Windows surrounds the path with double quotes so that it remains
    /// usable if a space is present.</para>
    /// </summary>
    /// <param name="filePath">The reference will be assigned to only if the path starts with ".</param>
    public static void StripSurroundingDoubleQuotes(ref string? filePath)
    {
        if (filePath != null && filePath.StartsWith('"'))
        {
            filePath = filePath.Replace("\"", "", StringComparison.Ordinal);
        }
    }
}
