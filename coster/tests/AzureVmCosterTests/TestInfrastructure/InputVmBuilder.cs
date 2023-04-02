namespace AzureVmCosterTests.TestInfrastructure;

internal static class InputVmBuilder
{
    public static InputVm AsUsWestWindowsD2V3Equivalent()
    {
        return new InputVm
        {
            Name = "map-me-to-d2-v3",
            OperatingSystem = "windows",
            Ram = 8,
            Region = "us-west",
            Cpu = 2
        };
    }
}
