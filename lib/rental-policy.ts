export type RentalPolicy = {
  minAge: number | null;
  licenceYears: number | null;
  excessEur: number | null;
  fullInsuranceEur: number;
  additionalDriverEur: number;
  freeCancelHours: number;
};

export const RENTAL_POLICY: RentalPolicy = {
  minAge: null,
  licenceYears: null,
  excessEur: null,
  fullInsuranceEur: 10,
  additionalDriverEur: 5,
  freeCancelHours: 24,
};
