import { SyntheticEvent, useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import Select from '@/components/ui/Select';
import { Form, FormItem } from '@/components/ui/Form';
import useJobOfferList from '../hooks/useJobOfferList';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ZodType } from 'zod';
import { useCatalogContext } from '../../../../context/catalogContext';

type FilterFormSchema = {
  stateId?: number;
  languageId?: number;
  salaryRangeId?: number;
  employmentSectorId?: number;
  workShiftIds?: number[];
  contractTypeIds?: number[];
  jobHierarchyIds?: number[];
};

type Option = {
  value: string | number;
  label: string;
  className: string;
};

const validationSchema: ZodType<FilterFormSchema> = z.object({
  stateId: z.number().int().optional(),
  languageId: z.number().int().optional(),
  salaryRangeId: z.number().int().optional(),
  employmentSectorId: z.number().int().optional(),
  workShiftIds: z.array(z.number().int()).optional(),
  contractTypeIds: z.array(z.number().int()).optional(),
  jobHierarchyIds: z.array(z.number().int()).optional(),
});

const JobOfferSearchFilter = () => {
  const { filterData, setFilterData } = useJobOfferList();
  const [workingShiftCheckboxList, setWorkingShiftCheckboxList] = useState(
    [] as string[]
  );
  const [contractTypeCheckboxList, setContractTypeCheckboxList] = useState(
    [] as string[]
  );
  const [jobHierarchyCheckboxList, setJobHierarchyCheckboxList] = useState(
    [] as string[]
  );

  const { handleSubmit, control, setValue, reset } = useForm<FilterFormSchema>({
    defaultValues: filterData,
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = (values: FilterFormSchema) => {
    setFilterData(values);
  };

  const onContractTypeCheckboxChange = (
    options: string[],
    e: SyntheticEvent
  ) => {
    setContractTypeCheckboxList(options);
  };

  useEffect(() => {
    setValue('contractTypeIds', contractTypeCheckboxList.map(Number));
  }, [contractTypeCheckboxList]);

  const onJobHierarchyCheckboxChange = (
    options: string[],
    e: SyntheticEvent
  ) => {
    setJobHierarchyCheckboxList(options);
  };

  useEffect(() => {
    setValue('jobHierarchyIds', jobHierarchyCheckboxList.map(Number));
  }, [jobHierarchyCheckboxList]);

  const onWorkingShiftCheckboxChange = (
    options: string[],
    e: SyntheticEvent
  ) => {
    setWorkingShiftCheckboxList(options);
  };

  useEffect(() => {
    setValue('workShiftIds', workingShiftCheckboxList.map(Number));
  }, [workingShiftCheckboxList]);

  const {
    academicLevels,
    professions,
    jobHierarchies,
    states,
    languages,
    salaryRanges,
    employmentSectors,
    workShifts,
    contractTypes,
  } = useCatalogContext();

  const academicLevelOptions = useMemo(() => {
    return academicLevels.map((academicLevel) => ({
      label: academicLevel.name,
      value: academicLevel.id,
      className: 'text-gray-900',
    }));
  }, [academicLevels]);

  const professionOptions = useMemo(() => {
    return professions.map((profession) => ({
      label: profession.name,
      value: profession.id,
      className: 'text-gray-900',
    }));
  }, [professions]);

  const jobHierarchyOptions = useMemo(() => {
    return jobHierarchies.map((jobHierarchy) => ({
      label: jobHierarchy.name,
      value: jobHierarchy.id,
      className: 'text-gray-900',
    }));
  }, [jobHierarchies]);

  const stateOptions = useMemo(() => {
    return states.map((state) => ({
      label: state.name,
      value: state.id,
      className: 'text-gray-900',
    }));
  }, [states]);

  const languageOptions = useMemo(() => {
    return languages.map((language) => ({
      label: language.name,
      value: language.id,
      className: 'text-gray-900',
    }));
  }, [languages]);

  const salaryRangeOptions = useMemo(() => {
    return salaryRanges.map((salaryRange) => ({
      label: salaryRange.range,
      value: salaryRange.id,
      className: 'text-gray-900',
    }));
  }, [languages]);

  const employmentSectorOptions = useMemo(() => {
    return employmentSectors.map((employmentSector) => ({
      label: employmentSector.name,
      value: employmentSector.id,
      className: 'text-gray-900',
    }));
  }, [employmentSectors]);

  const workShiftOptions = useMemo(() => {
    return workShifts.map((workShift) => ({
      label: workShift.name,
      value: workShift.id,
      className: 'text-gray-900',
    }));
  }, [workShifts]);

  const contractTypeOptions = useMemo(() => {
    return contractTypes.map((contractType) => ({
      label: contractType.name,
      value: contractType.id,
      className: 'text-gray-900',
    }));
  }, [contractTypes]);

  return (
    <>
      <Form
        className="w-full"
        containerClassName="flex flex-col justify-between w-full"
        onSubmit={handleSubmit(onSubmit, (e) => console.log(e))}
      >
        <div className="grid md:grid-cols-4 gap-6 ">
          <FormItem label="Ubicación">
            <Controller
              name="stateId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  options={stateOptions}
                  {...field}
                  placeholder={'Departamento'}
                  value={stateOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem label="Idioma Requerido">
            <Controller
              name="languageId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  options={languageOptions}
                  {...field}
                  placeholder={'Seleccione una opción'}
                  value={languageOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem label="Rango Salarial">
            <Controller
              name="salaryRangeId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  options={salaryRangeOptions}
                  {...field}
                  placeholder={'Seleccione una opción'}
                  value={salaryRangeOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem label="Área de Trabajo">
            <Controller
              name="employmentSectorId"
              control={control}
              render={({ field }) => (
                <Select<Option>
                  options={employmentSectorOptions}
                  {...field}
                  placeholder={'Seleccione una opción'}
                  value={employmentSectorOptions.filter(
                    (option) => option.value === field.value
                  )}
                  onChange={(option) => field.onChange(option?.value)}
                />
              )}
            />
          </FormItem>
          <FormItem label="Jornada Laboral">
            <Controller
              name="workShiftIds"
              control={control}
              render={() => (
                <Checkbox.Group
                  value={workingShiftCheckboxList}
                  onChange={onWorkingShiftCheckboxChange}
                  vertical
                >
                  {workShiftOptions.map((option) => (
                    <Checkbox value={option.value.toString()}>
                      {option.label}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              )}
            />
          </FormItem>
          <FormItem label="Tipo de Contrato">
            <Controller
              name="contractTypeIds"
              control={control}
              render={() => (
                <Checkbox.Group
                  value={contractTypeCheckboxList}
                  onChange={onContractTypeCheckboxChange}
                  vertical
                >
                  {contractTypeOptions.map((option) => (
                    <Checkbox value={option.value.toString()}>
                      {option.label}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              )}
            />
          </FormItem>
          <FormItem label="Nivel de Puesto">
            <Controller
              name="jobHierarchyIds"
              control={control}
              render={() => (
                <Checkbox.Group
                  value={jobHierarchyCheckboxList}
                  onChange={onJobHierarchyCheckboxChange}
                  vertical
                >
                  {jobHierarchyOptions.map((option) => (
                    <Checkbox value={option.value.toString()}>
                      {option.label}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              )}
            />
          </FormItem>
        <div className="w-full flex flex-row items-end justify-end gap-4">
          <Button
            type="button"
            onClick={() => {
              reset();
              setContractTypeCheckboxList([]);
              setJobHierarchyCheckboxList([]);
              setWorkingShiftCheckboxList([]);
            }}
          >
            Limpiar
          </Button>
          <Button variant="solid" type="submit">
            Buscar
          </Button>
        </div>
        </div>
      </Form>
    </>
  );
};

export default JobOfferSearchFilter;
