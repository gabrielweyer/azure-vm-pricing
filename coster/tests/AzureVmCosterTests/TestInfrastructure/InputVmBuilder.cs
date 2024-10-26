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

    public static InputVm AsUsWestLinuxD2V3Equivalent()
    {
        return new InputVm
        {
            Name = "map-me-to-d2-v3",
            OperatingSystem = "linux",
            Ram = 8,
            Region = "us-west",
            Cpu = 2
        };
    }

    public static InputVm AsUsWestWindowsD4V3Equivalent()
    {
        return new InputVm
        {
            Name = "map-me-to-d4-v3",
            OperatingSystem = "windows",
            Ram = 16,
            Region = "us-west",
            Cpu = 4
        };
    }

    public static InputVm AsUsWestWindowsD8V3Equivalent()
    {
        return new InputVm
        {
            Name = "map-me-to-d8-v3",
            OperatingSystem = "windows",
            Ram = 32,
            Region = "us-west",
            Cpu = 8
        };
    }

    public static InputVm AsUsWestWindowsD16V3Equivalent()
    {
        return new InputVm
        {
            Name = "map-me-to-d16-v3",
            OperatingSystem = "windows",
            Ram = 64,
            Region = "us-west",
            Cpu = 16
        };
    }

    public static InputVm AsUsEastWindowsD2V3Equivalent()
    {
        return new InputVm
        {
            Name = "map-me-to-d2-v3",
            OperatingSystem = "windows",
            Ram = 8,
            Region = "us-east",
            Cpu = 2
        };
    }

    public static InputVm AsUsEastLinuxD2V3Equivalent()
    {
        return new InputVm
        {
            Name = "map-me-to-d2-v3",
            OperatingSystem = "linux",
            Ram = 8,
            Region = "us-east",
            Cpu = 2
        };
    }
}
