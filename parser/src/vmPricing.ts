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
