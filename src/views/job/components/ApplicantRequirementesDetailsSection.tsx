import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Select, { Option as DefaultOption } from '@/components/ui/Select';
import Avatar from '@/components/ui/Avatar';
import { FormItem } from '@/components/ui/Form';
import { Controller } from 'react-hook-form';
import { components } from 'react-select';
import type { FormSectionBaseProps } from '../JobForm/types';
import type { OptionProps } from 'react-select';
import { Switcher } from '@/components/ui';
import { useState, useEffect } from 'react';
import { useMemo } from 'react';
import { useCatalogContext } from '../../../context/catalogContext';
import apiService from '../../../services/apiService';
import { City } from '@prisma/client';
import { debounce } from 'lodash';
type jobOfferApplicantRequirements = FormSectionBaseProps;

type CountryOption = {
  label: string;
  dialCode: string;
  value: string;
};

const { Control } = components;

const debouncedOnChange = debounce((field, value) => {
  field.onChange(value);
}, 300);

const CustomSelectOption = (props: OptionProps<CountryOption>) => {
  return (
    <DefaultOption<CountryOption>
      {...props}
      customLabel={(data, label) => (
        <span className="flex items-center gap-2">
          <Avatar
            shape="circle"
            size={20}
            src={`/img/countries/${data.value}.png`}
          />
          <span>{label}</span>
        </span>
      )}
    />
  );
};

const applicantRequirements = ({
  control,
  errors,
  watch
}: jobOfferApplicantRequirements) => {
  const stateId = watch('stateId');

  const [checked, setChecked] = useState(false);

  const [checkedLanguage, setCheckedLanguage] = useState(false);
  const [checkedLanguage2, setCheckedLanguage2] = useState(false);
  const [checkedLanguage3, setCheckedLanguage3] = useState(false);
  const [checkedLanguage4, setCheckedLanguage4] = useState(false);
  const [checkedLanguage5, setCheckedLanguage5] = useState(false);
  const [checkedLanguage6, setCheckedLanguage6] = useState(false);
  const [checkedLanguage7, setCheckedLanguage7] = useState(false);
  const [checkedLanguage8, setCheckedLanguage8] = useState(false);
  const [checkedLanguage9, setCheckedLanguage9] = useState(false);

  const [cityOptions, setCityOptions] = useState(
    [] as { label: string; value: number }[],
  );

  useEffect(() => {
    if (stateId) {
      apiService
        .get<City[]>('/city', { stateId })
        .then((data: City[]) => {
          const cityOptions = data.map((city) => ({
            label: city.name,
            value: city.id,
          }));
          setCityOptions(cityOptions);
        });
    }
  }, [stateId]);

  const {
    academicLevels,
    countries,
    languages,
    skillLevels,
    softwareSkills,
    states,
  } = useCatalogContext();

  const minimumAcademicLevelOptions = useMemo(() => {
    return academicLevels.map((academicLevels) => ({
      label: academicLevels.name,
      value: academicLevels.id,
    }));
  }, [academicLevels]);

  const countriesOptions = useMemo(() => {
    return countries.map((countries) => ({
      label: countries.name,
      value: countries.id,
    }));
  }, [countries]);

  const languageOptions = useMemo(() => {
    return languages.map((languages) => ({
      label: languages.name,
      value: languages.id,
    }));
  }, [languages]);

  const skillLevelsOptions = useMemo(() => {
    return skillLevels.map((skillLevels) => ({
      label: skillLevels.name,
      value: skillLevels.id,
    }));
  }, [languages]);

  const softwareSkillsOptions = useMemo(() => {
    return softwareSkills.map((softwareSkills) => ({
      label: softwareSkills.name,
      value: softwareSkills.id,
    }));
  }, [languages]);

  const stateOptions = useMemo(() => {
    return states.map((state) => ({
      label: state.name,
      value: state.id,
    }));
  }, [languages]);

  return (
    <Card id="applicantRequirements" className="mb-8">
      <h4 className="mb-6">Requisitos del aplicante</h4>
      <div className="flex items-center gap-10">
        <div className="flex grid grid-col-1-gap-5 ">
          <h6 className="mb-4">¿Experiencia requerida? </h6>
          <FormItem>
            <Controller
              name="isExperienceRequired"
              control={control}
              render={({ field }) => (
                <Switcher
                  {...field}
                  id="isExperienceRequired"
                  className="w-14"
                  checkedContent="Si"
                  unCheckedContent="No"
                  checked={field.value}
                  onChange={(e) => {
                    field.onChange(e);
                    setChecked(e)
                  }}
                />
              )}
            />
          </FormItem>
        </div>

        <FormItem>
          <Input
            type="number"
            size="lg"
            autoComplete="off"
            placeholder="Años de experiencia"
            disabled={!checked}
            id="requiredExperience"
          />
        </FormItem>
      </div>
      <div className="flex items-center justify-between">
        <FormItem
          label="Estudio Mínimos"
          invalid={Boolean(errors.minimumAcademicLevelId)}
          errorMessage={errors.minimumAcademicLevelId?.message}
        >
          <Controller
            name="minimumAcademicLevelId"
            control={control}
            render={({ field }) => (
              <Select
                options={minimumAcademicLevelOptions}
                value={minimumAcademicLevelOptions.filter(
                  (academicLevels) => academicLevels.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>
      </div>
      <h6 className="mb-4">Idiomas</h6>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem
          label="Idioma Principal"
          invalid={Boolean(errors.mainLanguageId)}
          //errorMessage={errors.mainLanguageId.message}
        >
          <Controller
            name="mainLanguageId"
            control={control}
            render={({ field }) => (
              <Select
                options={languageOptions}
                value={languageOptions.filter(
                  (language) => language.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormItem>
          <Switcher
            className="w-14"
            defaultChecked={checkedLanguage}
            onChange={(checkedLanguage) => setCheckedLanguage(checkedLanguage)}
            checked={checkedLanguage}
            checkedContent="Si"
            unCheckedContent="No"
          />
        </FormItem>
        <FormItem
          label="Idioma Adicional"
          invalid={Boolean(errors.otherLanguages)}
          //errorMessage={errors.otherLanguages.message}
        >
          <Controller
            name="otherLanguages"
            control={control}
            render={({ field }) => (
              <Select
                options={languageOptions}
                value={languageOptions.filter(
                  (language) => language.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => field.onChange(option?.value)}
                isDisabled={!checkedLanguage}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Nivel de idioma"
          invalid={Boolean(errors.languageSkills)}
          //errorMessage={errors.otherLanguages.message}
        >
          <Controller
            name="languageSkills"
            control={control}
            render={({ field }) => (
              <Select
                options={skillLevelsOptions}
                value={skillLevelsOptions.filter(
                  (skillLevel) => skillLevel.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => field.onChange(option?.value)}
                isDisabled={!checkedLanguage}
              />
            )}
          />
        </FormItem>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormItem>
          <Switcher
            className="w-14"
            defaultChecked={checkedLanguage2}
            onChange={(checkedLanguage2) =>
              setCheckedLanguage2(checkedLanguage2)
            }
            checked={checkedLanguage2}
            checkedContent="Si"
            unCheckedContent="No"
          />
        </FormItem>
        <FormItem
          label="Idioma Adicional"
          invalid={Boolean(errors.otherLanguages)}
          //errorMessage={errors.otherLanguages.message}
        >
          <Controller
            name="otherLanguages"
            control={control}
            render={({ field }) => (
              <Select
                options={languageOptions}
                value={languageOptions.filter(
                  (language) => language.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => field.onChange(option?.value)}
                isDisabled={!checkedLanguage2}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Nivel de idioma"
          invalid={Boolean(errors.languageSkills)}
          //errorMessage={errors.otherLanguages.message}
        >
          <Controller
            name="languageSkills"
            control={control}
            render={({ field }) => (
              <Select
                options={skillLevelsOptions}
                value={skillLevelsOptions.filter(
                  (skillLevel) => skillLevel.value === field.value,
                )}
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => field.onChange(option?.value)}
                isDisabled={!checkedLanguage2}
              />
            )}
          />
        </FormItem>
      </div>
      <h6 className="grid grid-cols-3 md:grid-cols-2 gap-4">
        Conocimientos informáticos
      </h6>
      <div className="grid grid-cols-2 gap-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <p>Word</p>

            <FormItem>
              <Switcher
                className="w-14"
                defaultChecked={checkedLanguage3}
                onChange={(checkedLanguage3) =>
                  setCheckedLanguage3(checkedLanguage3)
                }
                checked={checkedLanguage3}
                checkedContent="Si"
                unCheckedContent="No"
              />
            </FormItem>
          </div>
          <FormItem
            label="Nivel de Conocimiento"
            invalid={Boolean(errors.languageSkills)}
            //errorMessage={errors.otherLanguages.message}
          >
            <Controller
              name="languageSkills"
              control={control}
              render={({ field }) => (
                <Select
                  options={skillLevelsOptions}
                  value={skillLevelsOptions.filter(
                    (skillLevel) => skillLevel.value === field.value,
                  )}
                  defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                  placeholder="Seleccione una opción"
                  onChange={(option) => field.onChange(option?.value)}
                  isDisabled={!checkedLanguage3}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <p>Photoshop</p>

            <FormItem className="col-span-3">
              <Switcher
                className="w-14"
                defaultChecked={checkedLanguage4}
                onChange={(checkedLanguage4) =>
                  setCheckedLanguage4(checkedLanguage4)
                }
                checked={checkedLanguage4}
                checkedContent="Si"
                unCheckedContent="No"
              />
            </FormItem>
          </div>
          <FormItem
            label="Nivel de Conocimiento"
            invalid={Boolean(errors.softwareSkills)}
            //errorMessage={errors.otherLanguages.message}
          >
            <Controller
              name="softwareSkills"
              control={control}
              render={({ field }) => (
                <Select
                  options={softwareSkillsOptions}
                  value={softwareSkillsOptions.filter(
                    (softwareSkills) => softwareSkills.value === field.value,
                  )}
                  defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                  placeholder="Seleccione una opción"
                  onChange={(option) => field.onChange(option?.value)}
                  isDisabled={!checkedLanguage4}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <p>Project</p>

            <FormItem>
              <Switcher
                className="w-14"
                defaultChecked={checkedLanguage5}
                onChange={(checkedLanguage5) =>
                  setCheckedLanguage5(checkedLanguage5)
                }
                checked={checkedLanguage5}
                checkedContent="Si"
                unCheckedContent="No"
              />
            </FormItem>
          </div>

          <FormItem
            label="Nivel de Conocimiento"
            invalid={Boolean(errors.languageSkills)}
            //errorMessage={errors.otherLanguages.message}
          >
            <Controller
              name="languageSkills"
              control={control}
              render={({ field }) => (
                <Select
                  options={skillLevelsOptions}
                  value={skillLevelsOptions.filter(
                    (skillLevel) => skillLevel.value === field.value,
                  )}
                  defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                  placeholder="Seleccione una opción"
                  onChange={(option) => field.onChange(option?.value)}
                  isDisabled={!checkedLanguage5}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <p>Excel</p>

            <FormItem>
              <Switcher
                className="w-14"
                defaultChecked={checkedLanguage6}
                onChange={(checkedLanguage6) =>
                  setCheckedLanguage6(checkedLanguage6)
                }
                checked={checkedLanguage6}
                checkedContent="Si"
                unCheckedContent="No"
              />
            </FormItem>
          </div>
          <FormItem
            label="Nivel de Conocimiento"
            invalid={Boolean(errors.languageSkills)}
            //errorMessage={errors.otherLanguages.message}
          >
            <Controller
              name="languageSkills"
              control={control}
              render={({ field }) => (
                <Select
                  options={skillLevelsOptions}
                  value={skillLevelsOptions.filter(
                    (skillLevel) => skillLevel.value === field.value,
                  )}
                  defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                  placeholder="Seleccione una opción"
                  onChange={(option) => field.onChange(option?.value)}
                  isDisabled={!checkedLanguage6}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <p>PDF</p>

            <FormItem>
              <Switcher
                className="w-14"
                defaultChecked={checkedLanguage7}
                onChange={(checkedLanguage7) =>
                  setCheckedLanguage7(checkedLanguage7)
                }
                checked={checkedLanguage7}
                checkedContent="Si"
                unCheckedContent="No"
              />
            </FormItem>
          </div>

          <FormItem
            label="Nivel de Conocimiento"
            invalid={Boolean(errors.languageSkills)}
            //errorMessage={errors.otherLanguages.message}
          >
            <Controller
              name="languageSkills"
              control={control}
              render={({ field }) => (
                <Select
                  options={skillLevelsOptions}
                  value={skillLevelsOptions.filter(
                    (skillLevel) => skillLevel.value === field.value,
                  )}
                  defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                  placeholder="Seleccione una opción"
                  onChange={(option) => field.onChange(option?.value)}
                  isDisabled={!checkedLanguage7}
                />
              )}
            />
          </FormItem>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div className="grid grid-cols-1 md:grid-cols-1 gap-2">
            <p>Vegas</p>

            <FormItem>
              <Switcher
                className="w-14"
                defaultChecked={checkedLanguage8}
                onChange={(checkedLanguage8) =>
                  setCheckedLanguage8(checkedLanguage8)
                }
                checked={checkedLanguage8}
                checkedContent="Si"
                unCheckedContent="No"
              />
            </FormItem>
          </div>
          <FormItem
            label="Nivel de Conocimiento"
            invalid={Boolean(errors.languageSkills)}
            //errorMessage={errors.otherLanguages.message}
          >
            <Controller
              name="languageSkills"
              control={control}
              render={({ field }) => (
                <Select
                  options={skillLevelsOptions}
                  value={skillLevelsOptions.filter(
                    (skillLevel) => skillLevel.value === field.value,
                  )}
                  defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                  placeholder="Seleccione una opción"
                  onChange={(option) => field.onChange(option?.value)}
                  isDisabled={!checkedLanguage8}
                />
              )}
            />
          </FormItem>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          <div>
            <p>Otro</p>
            <FormItem>
              <Switcher
                className="w-14"
                defaultChecked={checkedLanguage9}
                onChange={(checkedLanguage9) =>
                  setCheckedLanguage9(checkedLanguage9)
                }
                checked={checkedLanguage9}
                checkedContent="Si"
                unCheckedContent="No"
              />
            </FormItem>
          </div>

          <FormItem
            label="Otro"
            invalid={Boolean(errors.softwareSkills)}
            errorMessage={errors.softwareSkills?.message}
            className="col-span-2"
          >
            <Controller
              name="softwareSkills"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  size="sm"
                  type="text"
                  autoComplete="off"
                  placeholder=""
                  disabled={!checkedLanguage9}
                />
              )}
            />
          </FormItem>
        </div>
      </div>
      <h6 className="mb-4">Ubicación</h6>

      <FormItem
        label="País"
        invalid={Boolean(errors.countryId)}
        //errorMessage={errors.countryId.message}
      >
        <Controller
          name="countryId"
          control={control}
          render={({ field }) => (
            <Select
              options={countriesOptions}
              value={countriesOptions.filter(
                (countries) => countries.value === field.value,
              )}
              defaultValue={{ label: 'Seleccione una opción', value: 0 }}
              placeholder="Seleccione una opción"
              onChange={(option) => field.onChange(option?.value)}
            />
          )}
        />
      </FormItem>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormItem
          label="Departamento"
          invalid={Boolean(errors.stateId)}
          //errorMessage={errors.countryId.message}
        >
          <Controller
            name="stateId"
            control={control}
            render={({ field }) => (
              <Select
                options={stateOptions}
                value={stateOptions.filter(
                  (state) => state.value === field.value,
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

        <FormItem
          label="Ciudad"
          invalid={Boolean(errors.cityId)}
          //errorMessage={errors.countryId.message}
        >
          <Controller
            name="cityId"
            control={control}
            render={({ field }) => (
              <Select
                options={cityOptions || ['choose a city']}
                value={
                  cityOptions?.filter((city) => city.value === field.value)  || []
                }
                defaultValue={{ label: 'Seleccione una opción', value: 0 }}
                placeholder="Seleccione una opción"
                onChange={(option) => debouncedOnChange(field, option?.value)}
              />
            )}
          />
        </FormItem>
      </div>
    </Card>
  );
};

export default applicantRequirements;
