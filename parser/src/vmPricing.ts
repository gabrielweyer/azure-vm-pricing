export interface VmPricing {
  instance: string;
  vCpu: number;
  ram: number;
  payAsYouGo: number;
  payAsYouGoWithAzureHybridBenefit: number;
  oneYearReserved: number;
  oneYearReservedWithAzureHybridBenefit: number;
  threeYearReserved: number;
  threeYearReservedWithAzureHybridBenefit: number;
  spot: number;
  spotWithAzureHybridBenefit: number;
}

export interface PartialVmPricing {
  azureHybridBenefit: boolean;
  instance: string;
  vCpu: number;
  ram: number;
  payAsYouGo: number;
  oneYearReserved: number;
  threeYearReserved: number;
  spot: number;
}
