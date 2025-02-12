import { useMemo, useState } from 'react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';
import type { FormSectionBaseProps } from '../JobForm/types';
import DatePicker from '@/components/ui/DatePicker';
import Select from '@/components/ui/Select';
import { useCatalogContext } from '../../../context/catalogContext';

type JobOfferDetailsSectionProps = FormSectionBaseProps;

const JobOfferDetailsSection = ({
  control,
  errors,
}: JobOfferDetailsSectionProps) => {
  const {
    employmentSectors,
    professions,
    maritalStatuses,
    genders,
    jobHierarchies,
  } = useCatalogContext();

  const employmentSectorOptions = useMemo(() => {
    return employmentSectors.map((employmentSector) => ({
      label: employmentSector.name,
      value: employmentSector.id,
    }));
  }, [employmentSectors]);

  const professionOptions = useMemo(() => {
    return professions.map((professions) => ({
      label: professions.name,
      value: professions.id,
    }));
  }, [professions]);

  const maritalStatusOptions = useMemo(() => {
    return maritalStatuses.map((maritalStatuses) => ({
      label: maritalStatuses.name,
      value: maritalStatuses.id,
    }));
  }, [maritalStatuses]);

  const genderPreferenceOptions = useMemo(() => {
    return genders.map((genders) => ({
      label: genders.name,
      value: genders.id,
    }));
  }, [genders]);

  const jobHierarchiesOptions = useMemo(() => {
    return jobHierarchies.map((jobHierarchies) => ({
      label: jobHierarchies.name,
      value: jobHierarchies.id,
    }));
  }, [jobHierarchies]);

  return (
    <Card id="jobOfferDetails">
      <h4 className="mb-6">Oferta de Trabajo</h4>
      <div className="grid md:grid-cols-1 gap-5">
        {
          //titulo del trabajo
        }
        <FormItem
          label="Título o Nombre del Trabajo"
          invalid={Boolean(errors.name)}
          errorMessage={errors.name?.message}
        >
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <Input
                size="lg"
                type="text"
                autoComplete="off"
                placeholder=""
                {...field}
              />
            )}
          />
        </FormItem>
        {
          //Descripcion del trabajo
        }
        <FormItem
          label="Descripcion del trabajo"
          invalid={Boolean(errors.description)}
          errorMessage={errors.description?.message}
        >
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Input
                type="text"
                autoComplete="off"
                placeholder=""
                {...field}
                textArea={true}
                rows={3}
              />
            )}
          />
        </FormItem>
      </div>
      <div className="grid md:grid-cols-2 gap-5">
        {
          //fecha de contratacion
        }
        <FormItem
          label="Fecha de Publicación"
          invalid={Boolean(errors.publicationDate)}
          errorMessage={errors.publicationDate?.message}
        >
          <Controller
            name="publicationDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                
              />
            )}
          />
        </FormItem>
        {
          //fecha de publicacion
        }
        <FormItem
          label="Fecha de Contratación"
          invalid={Boolean(errors.hiringDate)}
          errorMessage={errors.hiringDate?.message}
        >
          <Controller
            name="hiringDate"
            control={control}
            render={({ field }) => (
              <DatePicker value={field.value} onChange={field.onChange} />
            )}
          />
        </FormItem>
        {
          //profesion
        }
        <FormItem
          label="Profesión"
          invalid={Boolean(errors.professionId)}
          errorMessage={errors.professionId?.message}
        >
          <Controller
            name="professionId"
            control={control}
            render={({ field }) => (
              <Select
                options={professionOptions}
                value={professionOptions.filter(
                  (profession) => profession.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
              />
            )}
          />
        </FormItem>
        {
          //area de trabajo
        }
        <FormItem
          label="Area de Trabajo"
          invalid={Boolean(errors.employmentSectorId)}
          errorMessage={errors.employmentSectorId?.message}
        >
          <Controller
            name="employmentSectorId"
            control={control}
            render={({ field }) => (
              <Select
                options={employmentSectorOptions}
                value={employmentSectorOptions.filter(
                  (employmentSector) => employmentSector.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => {
                  field.onChange(option?.value);
                }}
              />
            )}
          />
        </FormItem>
        {
          //nivel de puesto
        }
        <FormItem
          label="Nivel de puesto"
          invalid={Boolean(errors.jobHierarchyId)}
          errorMessage={errors.jobHierarchyId?.message}
        >
          <Controller
            name="jobHierarchyId"
            control={control}
            render={({ field }) => (
              <Select
                options={jobHierarchiesOptions}
                value={jobHierarchiesOptions.filter(
                  (jobHierarchies) => jobHierarchies.value === field.value,
                )}
                placeholder="Seleccione una opción"
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>
        {
          //Estado civil
        }
        <FormItem
          label="Estado civil"
          invalid={Boolean(errors.maritalStatusId)}
          errorMessage={errors.maritalStatusId?.message}
        >
          <Controller
            name="maritalStatusId"
            control={control}
            render={({ field }) => (
              <Select
                options={maritalStatusOptions}
                value={maritalStatusOptions.filter(
                  (maritalStatus) => maritalStatus.value === field.value,
                )}
                placeholder="Seleccione una opción"
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>
        {
          //Sexo
        }
        <FormItem
          label="Sexo"
          invalid={Boolean(errors.genderPreferenceId)}
          errorMessage={errors.genderPreferenceId?.message}
        >
          <Controller
            name="genderPreferenceId"
            control={control}
            render={({ field }) => (
              <Select
                options={genderPreferenceOptions}
                value={genderPreferenceOptions.filter(
                  (gender) => gender.value === field.value,
                )}
                placeholder="Seleccione una opción"
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>
      </div>
      <h6>Rango de edades</h6>
      <div className="grid md:grid-cols-2 gap-5">
        <FormItem
          label="Desde"
          invalid={Boolean(errors.ageRangeFrom)}
          errorMessage={errors.ageRangeTo?.message}
        >
          <Controller
            name="ageRangeFrom"
            control={control}
            render={({ field }) => (
              <Input
                size="lg"
                type="number"
                autoComplete="off"
                placeholder=""
                {...field}
              />
            )}
          />
        </FormItem>

        <FormItem
          label="Hasta"
          invalid={Boolean(errors.ageRangeTo)}
          errorMessage={errors.ageRangeTo?.message}
        >
          <Controller
            name="ageRangeTo"
            control={control}
            render={({ field }) => (
              <Input
                size="lg"
                type="number"
                autoComplete="off"
                placeholder=""
                {...field}
              />
            )}
          />
        </FormItem>
      </div>
    </Card>
  );
};

export default JobOfferDetailsSection;
