namespace AzureVmCosterTests.TestInfrastructure;

internal static class PricedVmBuilder
{
    public static PricedVm From(InputVm vm, VmPrice price)
    {
        return new PricedVm(vm, price);
    }

    public static PricedVm WithoutPrice(InputVm vm)
    {
        return new PricedVm(vm, vmPrice: null);
    }
}
