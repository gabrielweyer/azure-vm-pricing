import { addUnavailableVms, PartialVmPricing } from "./vmPricing";

function getVm(name: string, vCpu: number, ram: number): PartialVmPricing {
  return <PartialVmPricing>{
    instance: name,
    vCpu: vCpu,
    ram: ram
  };
}

describe('Add unavailable VMs', () => {
  describe('Given same VMs with and without hybrid benefits', () => {
    test('Then VMs are unchanged', () => {
      let withHybridBenefits = [getVm('A', 1, 1)];
      let withoutHybridBenefits = [getVm('A', 1, 1)];

      addUnavailableVms(withHybridBenefits, withoutHybridBenefits);

      const expected = [getVm('A', 1, 1)];
      expect(withHybridBenefits).toEqual(expected);
      expect(withoutHybridBenefits).toEqual(expected);
    });
  });

  describe('Given VM not present in without hybrid benefits list', () => {
    test('Then VM added as unavailable to instances without hybrid benefits', () => {
      let withHybridBenefits = [getVm('A', 1, 1), getVm('B', 2, 2), getVm('C', 3, 3)];
      let withoutHybridBenefits = [getVm('A', 1, 1), getVm('C', 3, 3)];

      addUnavailableVms(withHybridBenefits, withoutHybridBenefits);

      const expectedWithoutHybridBenefits = [getVm('A', 1, 1), getVm('B', 2, 2), getVm('C', 3, 3)];
      expect(withoutHybridBenefits).toEqual(expectedWithoutHybridBenefits);
    });
  });

  describe('Given VM not present in with hybrid benefits list', () => {
    test('Then VM added as unavailable to instances with hybrid benefits', () => {
      let withHybridBenefits = [getVm('A', 1, 1), getVm('C', 3, 3)];
      let withoutHybridBenefits = [getVm('A', 1, 1), getVm('B', 2, 2), getVm('C', 3, 3)];

      addUnavailableVms(withHybridBenefits, withoutHybridBenefits);

      const expectedWithHybridBenefits = [getVm('A', 1, 1), getVm('B', 2, 2), getVm('C', 3, 3)];
      expect(withHybridBenefits).toEqual(expectedWithHybridBenefits);
    });
  });

  describe('Given different VMs present in with and without hybrid benefits lists', () => {
    test('Then VMs added as unavailable to both with and without hybrid benefits lists', () => {
      let withHybridBenefits = [getVm('A', 1, 1), getVm('B', 2, 2), getVm('D', 4, 4)];
      let withoutHybridBenefits = [getVm('A', 1, 1), getVm('C', 3, 3), getVm('D', 4, 4)];

      addUnavailableVms(withHybridBenefits, withoutHybridBenefits);

      const expected = [getVm('A', 1, 1), getVm('B', 2, 2), getVm('C', 3, 3), getVm('D', 4, 4)];
      expect(withHybridBenefits).toEqual(expected);
      expect(withoutHybridBenefits).toEqual(expected);
    });
  });

  describe('Given multiple VMs in a row not present in without hybrid benefits list', () => {
    test('Then VMs added as unavailable to without hybrid benefits list', () => {
      let withHybridBenefits = [getVm('A', 1, 1), getVm('B', 2, 2), getVm('C', 3, 3), getVm('D', 4, 4), getVm('E', 5, 5), getVm('F', 6, 6), getVm('G', 7, 7)];
      let withoutHybridBenefits = [getVm('A', 1, 1), getVm('D', 4, 4), getVm('G', 7, 7)];

      addUnavailableVms(withHybridBenefits, withoutHybridBenefits);

      const expected = [getVm('A', 1, 1), getVm('B', 2, 2), getVm('C', 3, 3), getVm('D', 4, 4), getVm('E', 5, 5), getVm('F', 6, 6), getVm('G', 7, 7)];
      expect(withoutHybridBenefits).toEqual(expected);
    });
  });
});
