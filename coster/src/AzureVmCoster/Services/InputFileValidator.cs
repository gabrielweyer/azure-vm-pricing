namespace AzureVmCoster.Services;

internal static class InputFileValidator
{
    public static FileInfo Validate(string? path)
    {
        if (string.IsNullOrWhiteSpace(path))
        {
            throw new ArgumentOutOfRangeException(nameof(path), "The input file path is required: -i <file-path>");
        }

        var inputFile = new FileInfo(path);

        if (!inputFile.Exists)
        {
            throw new InvalidOperationException($"The file '{inputFile.FullName}' is not accessible");
        }

        if (!".csv".Equals(inputFile.Extension, StringComparison.OrdinalIgnoreCase))
        {
            throw new ArgumentOutOfRangeException(nameof(path), $"The file '{inputFile.FullName}' doesn't have a '.csv' extension");
        }

        return inputFile;
    }
}
