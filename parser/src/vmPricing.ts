export interface VmPricing {
  instance: string;
  vCpu: number;
  ram: number;
  payAsYouGo: number;
  payAsYouGoWithAzureHybridBenefit: number;
  oneYearSavingsPlan: number;
  oneYearSavingsPlanWithAzureHybridBenefit: number;
  threeYearSavingsPlan: number;
  threeYearSavingsPlanWithAzureHybridBenefit: number;
  oneYearReserved: number;
  oneYearReservedWithAzureHybridBenefit: number;
  threeYearReserved: number;
  threeYearReservedWithAzureHybridBenefit: number;
  spot: number;
  spotWithAzureHybridBenefit: number;
}

export interface PartialVmPricing {
  instance: string;
  vCpu: number;
  ram: number;
  payAsYouGo: number;
  oneYear: number;
  threeYear: number;
  spot: number;
}

function addUnavailable(additionalInstances: string[], additional: PartialVmPricing[], toFill: PartialVmPricing[]): void {
  additionalInstances.forEach(additionalInstance => {
    var offset = additional.findIndex(v => v.instance == additionalInstance);
    var unavailableVm = <PartialVmPricing> {
      instance: additionalInstance,
      vCpu: additional[offset].vCpu,
      ram: additional[offset].ram
    };
    toFill.splice(offset, 0, unavailableVm);
  });
}

function validateUnique(instances: string[]): void {
  const uniqueWith = [...new Set(instances)];

  if (instances.length !== uniqueWith.length) {
    let duplicates: string[] = [];
    instances.forEach((i, o) => {if (instances.indexOf(i) !== o) { duplicates.push(i); }});
    throw `Instances contain duplicates ${duplicates}.`;
  }
}

/**
 * Ensure that if a VM is present in one of the arrays and not the other it will be added so that both arrays
 * have the same VMs in the same order.
 * @param withHybridBenefits the instances available with hybrid benefits. The array will be modified if the
 * other one has additional instances.
 * @param withoutHybridBenefits the instances available without hybrid benefits. The array will be modified
 * if the other one has additional instances.
 */
export function addUnavailableVms(withHybridBenefits: PartialVmPricing[], withoutHybridBenefits: PartialVmPricing[]): void {
  const instancesWithHybridBenefits = withHybridBenefits.map(v => v.instance);
  validateUnique(instancesWithHybridBenefits);
  const instancesWithoutHybridBenefits = withoutHybridBenefits.map(v => v.instance);
  validateUnique(instancesWithoutHybridBenefits);
  const additionalWith = instancesWithHybridBenefits.filter(v => !instancesWithoutHybridBenefits.includes(v));
  const additionalWithout = instancesWithoutHybridBenefits.filter(v => !instancesWithHybridBenefits.includes(v));
  addUnavailable(additionalWith, withHybridBenefits, withoutHybridBenefits);
  addUnavailable(additionalWithout, withoutHybridBenefits, withHybridBenefits);
}

/**
 * Remove duplicate instance names. Unfortunately the pricing sometimes contain duplicate VMs. When
 * that's the case, only the name is duplicated, the specs and prices are correct. The easiest fix is
 * to remove all instances, e.g. if VM 'A' appears twice, I remove both instances.
 * @param vms The list of VMs we crawled from the pricing page. The array will be modified in-place.
 */
export function discardDuplicateVms(vms: PartialVmPricing[]): void {
  const uniqueNames = new Map<string, number>();
  const offsetsToRemove = new Set<number>();

  for (let o = 0; o < vms.length; o++) {
    const name = vms[o].instance;

    if (uniqueNames.has(name)) {
      offsetsToRemove.add(uniqueNames.get(name));
      offsetsToRemove.add(o);
    } else {
      uniqueNames.set(name, o);
    }
  }

  let deletedElementCount = 0;
  // We need to sort the offset to remove because a duplicate name could appear before and after
  // another duplicate, e.g. ['A, 'B', 'B', 'A'].
  for (const offsetToRemove of Array.from(offsetsToRemove.keys()).sort()) {
    vms.splice(offsetToRemove - deletedElementCount, 1);
    deletedElementCount++;
  }
}
