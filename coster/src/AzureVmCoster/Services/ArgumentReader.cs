namespace AzureVmCoster.Services;

internal static class ArgumentReader
{
    public static (string? inputFilePath, string? configurationFilePath, CultureInfo culture) Read(string[] args)
    {
        string? inputFilePath = null;
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
                    inputFilePath = args[offset + 1];
                    StripSurroundingDoubleQuotes(ref inputFilePath);
                    break;
                case "-c":
                case "--configuration":
                    configurationFilePath = args[offset + 1];
                    StripSurroundingDoubleQuotes(ref configurationFilePath);
                    break;
                default:
                    Console.WriteLine($"'{args[offset]}' is not a known switch, supported values are: '-l', '--culture', '-i', '--input', '-c', '--configuration'");
                    break;
            }
        }

        return (inputFilePath, configurationFilePath, culture);
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
