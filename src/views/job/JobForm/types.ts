import type { Control, FieldErrors, UseFormWatch } from 'react-hook-form';
import type { JobOffer } from '@prisma/client';

export type JobOfferFields = JobOffer;

export type JobFormSchema = JobOfferFields;

export type FormSectionBaseProps = {
  control: Control<JobFormSchema>;
  errors: FieldErrors<JobFormSchema>;
  watch: UseFormWatch<JobFormSchema>;
};
