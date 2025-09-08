import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Avatar,
  Button,
  DatePicker,
  Dialog,
  Input,
  Select,
  Spinner,
  Steps,
  toast,
  Upload,
} from '@/components/ui';
import { Card } from '@aws-amplify/ui-react';
import { useNavigate } from 'react-router-dom';
import { MdApartment, MdPerson } from 'react-icons/md';
import classNames from 'classnames';
import { Controller, useForm } from 'react-hook-form';
import { Form, FormItem } from '@/components/ui/Form';
import { yearsBeforeToday } from '../../helpers/math';
import NumericInput from '@/components/shared/NumericInput';
import { useCatalogContext } from '../../context/catalogContext';
import { validateNIT, validateCUI } from '../../helpers/idValidators';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUserContext } from '../../context/userContext';
import { City, User } from '@prisma/client';
import apiService from '../../services/apiService';
import { Notification } from '@/components/ui/Notification';
import { TbPlus } from 'react-icons/tb';

type CompanyFormData = {
  name: string;
  legalName: string;
  logoUrl: string;
  description: string;
  taxId: string;
  webSiteUrl: string;
  phone: string;
  employmentSectorId: number;
};

type ApplicantFormData = {
  address: string;
  cityId: number;
  stateId: number;
  countryOfResidencyId: number;
  zone: string;
  dateOfBirth: Date;
  phone: string;
  mobile: string;
  genderId: number;
  maritalStatusId: number;
  documentTypeId: number;
  documentId: string;
};

type Option = {
  value: number;
  label: string;
  className: string;
};

const applicantValidationSchema = z.object({
  documentId: z
    .string()
    .min(1, { message: 'Documento de Identificación requerido' }),
  phone: z.string().optional().or(z.literal('')),
  mobile: z.string().optional().or(z.literal('')),
  dateOfBirth: z
    .date()
    .refine((date) => {
      const today = new Date();
      const birthDate = new Date(date);
      const age = today.getFullYear() - birthDate.getFullYear();
      const month = today.getMonth() - birthDate.getMonth();
      if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
      }
      return age >= 18;
    })
    .transform((val) => val.toISOString())
    .or(z.string().min(1, { message: 'Fecha de Nacimiento requerida' })),
  documentTypeId: z.number().min(1, { message: 'Tipo de documento requerido' }),
  genderId: z.number().min(1, { message: 'Género requerido' }),
  maritalStatusId: z.number().min(1, { message: 'Estado civil requerido' }),
  address: z.string().nonempty('Por favor ingrese su dirección.'),
  countryOfResidencyId: z
    .number()
    .int()
    .nonnegative('Por favor seleccione un país.'),
  stateId: z
    .number()
    .int()
    .nonnegative('Por favor seleccione un departamento.'),
  cityId: z.number().int().nonnegative('Por favor seleccione un municipio.'),
  zone: z.string().nonempty('Por favor ingrese su zona.'),
});

const companyValidationSchema = z.object({
  name: z.string().nonempty('Nombre de la empresa requerido'),
  legalName: z.string().nonempty('Nombre legal de la empresa requerido'),
  logoUrl: z.string().optional(),
  description: z.string().optional(),
  taxId: z.string().nonempty('Número de identificación tributaria requerido'),
  webSiteUrl: z.string().optional(),
  phone: z.string().optional(),
  employmentSectorId: z
    .number()
    .min(1, { message: 'Sector Empresarial requerido' }),
});

const NewClient = () => {
  const {
    documentTypes,
    maritalStatuses,
    genders,
    countries,
    states,
    hiringEmploymentSectors,
  } = useCatalogContext();
  const { userAttributes, refetchUser, user: storedUser } = useUserContext();

  const [stateId, setStateId] = useState<number | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const countriesOptions = useMemo(() => {
    return countries.map((countries) => ({
      label: countries.name,
      value: countries.id,
      className: 'text-gray-900',
    }));
  }, [countries]);

  const stateOptions = useMemo(() => {
    return states.map((state) => ({
      label: state.name,
      value: state.id,
      className: 'text-gray-900',
    }));
  }, [states]);

  // TODO: add actual employment sectors
  const hiringEmploymentSectorOptions = useMemo(() => {
    return hiringEmploymentSectors.map((sector) => ({
      label: sector.name,
      value: sector.id,
      className: 'text-gray-900',
    }));
  }, [hiringEmploymentSectors]);

  const [cityOptions, setCityOptions] = useState(
    [] as { label: string; value: number; className: string }[]
  );

  useEffect(() => {
    if (stateId) {
      apiService.get<City[]>('/city', { stateId }).then((data: City[]) => {
        const cityOptions = data.map((city) => ({
          label: city.name,
          value: city.id,
          className: 'text-gray-900',
        }));
        setCityOptions(cityOptions);
      });
    }
  }, [stateId]);

  const maritalStatusOptions = useMemo(() => {
    return maritalStatuses.map((maritalStatuses) => ({
      label: maritalStatuses.name,
      value: maritalStatuses.id,
      className: 'text-gray-900',
    }));
  }, [maritalStatuses]);

  const genderOptions = useMemo(() => {
    return genders.map((genders) => ({
      label: genders.name,
      value: genders.id,
      className: 'text-gray-900',
    }));
  }, [genders]);

  const documentTypeOptions = useMemo(() => {
    return documentTypes.map((documentType) => ({
      label: documentType.name,
      value: documentType.id,
      className: 'text-gray-900',
    }));
  }, [documentTypes]);

  const navigate = useNavigate();

  const [current, setCurrent] = useState(1);
  const [logoutDialogIsOpen, setLogoutDialogIsOpen] = useState(false);
  const [userType, setUserType] = useState(''); // 'applicant' | 'employer'

  const handleStepChange = (step: number) => {
    if (step === 0) {
      openLogoutDialog();
      return;
    }
    if (step < 0 || step > 3) {
      return;
    }
    setCurrent(step);
  };

  const openLogoutDialog = () => {
    setLogoutDialogIsOpen(true);
  };

  const onDialogClose = () => {
    setLogoutDialogIsOpen(false);
  };

  const onDialogOk = () => {
    setLogoutDialogIsOpen(false);
    navigate('/logout');
  };

  const {
    handleSubmit: companyHandleSubmit,
    control: companyControl,
    formState: { errors: companyErrors },
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companyValidationSchema),
  });
  const {
    handleSubmit: applicantHandleSubmit,
    control: applicantControl,
    formState: { errors: applicantErrors },
    setValue: setApplicantValue,
  } = useForm<ApplicantFormData>({
    resolver: zodResolver(applicantValidationSchema),
  });

  const onSubmitCompany = async (data: CompanyFormData) => {
    const isValidNit = validateNIT(data.taxId);
    console.log('isValidNit', isValidNit);
    if (!isValidNit) {
      toast.push(
        <Notification type="danger">
          El NIT ingresado no es válido. Por favor, verifica el número.
        </Notification>,
        {
          placement: 'top-center',
        }
      );
      return;
    }
    setCurrent(3);
    const formData = new FormData();

    formData.append('firstName', userAttributes?.name || '');
    if (userAttributes?.middle_name) {
      formData.append('middleName', userAttributes?.middle_name || '');
    }
    formData.append('lastName', userAttributes?.family_name || '');
    if (userAttributes?.second_family_name) {
      formData.append(
        'secondLastName',
        userAttributes?.second_family_name || ''
      );
    }
    formData.append('email', userAttributes?.email || '');
    formData.append('loginId', userAttributes?.sub || '');
    formData.append('name', data.name);
    formData.append('legalName', data.legalName);
    if (data.description) {
      formData.append('description', data.description);
    }
    formData.append('taxId', data.taxId);
    if (data.webSiteUrl) {
      formData.append('webSite', data.webSiteUrl);
    }
    formData.append('phone', data.phone);
    formData.append('employmentSectorId', data.employmentSectorId.toString());
    if (uploadedFile) {
      formData.append('profileImage', uploadedFile || '');
    }

    try {
      await apiService.post(`/user/${storedUser?.id}/company`, formData);
      toast.push(
        <Notification type="success">
          Cuenta creada exitosamente. Redirigiendo...
        </Notification>,
        {
          placement: 'top-center',
        }
      );

      setTimeout(async () => {
        await refetchUser();
        navigate('/home');
      }, 2000);
    } catch (error) {
      {
        toast.push(
          <Notification type="danger">
            Error al crear la cuenta. Por favor, intenta nuevamente.
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      }
    }
  };

  const onSubmitApplicant = async (data: ApplicantFormData) => {
    const isValidCUI = validateCUI(data.documentId);
    if (!isValidCUI) {
      toast.push(
        <Notification type="danger">
          El número de documento ingresado no es válido. Por favor, verifica el
          número.
        </Notification>,
        {
          placement: 'top-center',
        }
      );
      return;
    }
    setCurrent(3);
    const user: Partial<User> = {
      firstName: userAttributes?.name,
      middleName: userAttributes?.middle_name,
      lastName: userAttributes?.family_name,
      secondLastName: userAttributes?.second_family_name,
      email: userAttributes?.email,
      loginId: userAttributes?.sub,
    };

    try {
      const result = await apiService.post(
        `/user/${storedUser?.id}/applicant`,
        {
          ...data,
          ...user,
        }
      );

      if (!result) {
        throw new Error('Error creating account');
      }
      setTimeout(async () => {
        await refetchUser();
        navigate('/profile/applicant');
      }, 2000);
    } catch {
      toast.push(
        <Notification type="danger">
          Error al crear la cuenta. Por favor, intenta nuevamente.
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    }
  };

  const beforeUpload = (files: FileList | null) => {
    let valid: string | boolean = true;

    const allowedFileType = ['image/jpeg', 'image/png'];
    if (files) {
      for (const file of files) {
        if (!allowedFileType.includes(file.type)) {
          valid = 'Please upload a .jpeg or .png file!';
        }
      }
    }

    return valid;
  };

  return (
    <Card className="flex flex-row items-center justify-center w-full h-full">
      <div className="lg:flex flex-col items-center justify-center w-[300px] h-full bg-gray-100 dark:bg-gray-800 p-4">
        <Steps vertical current={current} onChange={handleStepChange}>
          <Steps.Item title="Cuenta Creada" />
          <Steps.Item title="Tipo de Cuenta" />
          <Steps.Item title="Datos necesarios" />
          <Steps.Item title="Aprobada" isLast />
        </Steps>
      </div>

      <Card className="w-full h-full flex flex-col justify-center p-4">
        <h3 className="text-2xl font-bold text-center">
          {current === 1 && '¿Qué tipo de cuenta deseas crear?'}
        </h3>

        {current === 1 && (
          <div className="mt-6 rounded flex items-start justify-center w-full h-full gap-4">
            <div
              className={classNames(
                'px-6 pt-2 flex flex-col justify-between',
                'border-r-0 xl:border-r border-gray-200 dark:border-gray-700',
                'h-full'
              )}
            >
              <Card className="mb-4">
                <h5 className="mb-6 flex items-center gap-2">
                  <span>Busco trabajo</span>
                  <span className="text-sm text-gray-500">(Candidato)</span>
                </h5>
                <ul>
                  <li className="list-disc">
                    Podrás crear tu perfil y postularte a ofertas de trabajo
                  </li>
                  <li className="list-disc">
                    Podrás ver el estado de tus postulaciones
                  </li>
                  <li className="list-disc">
                    Podrás ver las empresas que están buscando candidatos
                  </li>
                  <li className="list-disc">
                    Podrás ver las ofertas de trabajo disponibles
                  </li>
                </ul>
              </Card>
              <Button
                className="flex flex-col items-center justify-center gap-2 w-[280] h-[280]"
                variant="secondary"
                onClick={() => {
                  setUserType('applicant');
                  setCurrent(2);
                }}
              >
                <MdPerson size={50} />
                <span>Estoy en búsqueda de trabajo</span>
              </Button>
            </div>
            <div
              className={classNames(
                'px-6 pt-2 flex flex-col justify-between',
                'h-full'
              )}
            >
              <Card className="mb-4">
                <h5 className="mb-6 flex items-center gap-2">
                  <span>Busco trabajadores</span>
                  <span className="text-sm text-gray-500">(Empresa)</span>
                </h5>
                <ul>
                  <li className="list-disc">
                    Podrás crear tu perfil y publicar ofertas de trabajo
                  </li>
                  <li className="list-disc">
                    Podrás ver el estado de tus postulaciones
                  </li>
                  <li className="list-disc">
                    Podrás ver los candidatos que han postulado a tus ofertas
                  </li>
                  <li className="list-disc">
                    Podrás guardar candidatos para futuras ofertas
                  </li>
                </ul>
              </Card>
              <Button
                className="flex flex-col items-center justify-center gap-2 w-[280] h-[280]"
                variant="secondary"
                onClick={() => {
                  setUserType('employer');
                  setCurrent(2);
                }}
              >
                <MdApartment size={50} />
                <span>Busco trabajadores para mi empresa</span>
              </Button>
            </div>
          </div>
        )}

        {current === 2 && userType === 'employer' && (
          <div className="mt-6 rounded flex flex-col items-center justify-start w-full h-full gap-4">
            <h3 className="text-2xl font-bold text-center">
              Datos de la empresa
            </h3>
            <Form
              onSubmit={companyHandleSubmit(onSubmitCompany)}
              className="w-[90%] h-full"
              containerClassName="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
            >
              <FormItem
                label="Nombre de la empresa"
                invalid={Boolean(companyErrors.name)}
                errorMessage={companyErrors.name?.message}
              >
                <Controller
                  name="name"
                  control={companyControl}
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      placeholder="Nombre de la empresa"
                      className="border border-gray-300 rounded p-2"
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Logo de la empresa"
                invalid={Boolean(companyErrors.logoUrl)}
                errorMessage={companyErrors.logoUrl?.message}
              >
                <Controller
                  name="logoUrl"
                  control={companyControl}
                  render={({ field }) => (
                    <div className="flex flex-col gap-2">
                      {field.value && (
                        <img
                          src={field.value}
                          alt="Logo de la empresa"
                          className="border border-gray-300"
                          loading="lazy"
                          style={{
                            maxWidth: '350px',
                            maxHeight: '200px',
                            objectFit: 'contain',
                            borderRadius: '8px',
                          }}
                        />
                      )}
                      <div className="flex flex-row items-center gap-2">
                        <Upload
                          showList={false}
                          uploadLimit={1}
                          beforeUpload={beforeUpload}
                          onChange={(files) => {
                            if (files.length > 0) {
                              setUploadedFile(files[0]);
                              field.onChange(URL.createObjectURL(files[0]));
                            }
                          }}
                        >
                          <Button
                            variant="solid"
                            size="sm"
                            type="button"
                            icon={<TbPlus />}
                          >
                            Subir Logo
                          </Button>
                        </Upload>
                        {uploadedFile && (
                          <Button
                            size="sm"
                            type="button"
                            onClick={() => {
                              setUploadedFile(null);
                              field.onChange('');
                            }}
                          >
                            Quitar Logo
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                />
              </FormItem>
              <FormItem
                label="Nombre legal de la empresa"
                invalid={Boolean(companyErrors.legalName)}
                errorMessage={companyErrors.legalName?.message}
              >
                <Controller
                  name="legalName"
                  control={companyControl}
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      placeholder="Nombre legal de la empresa"
                      className="border border-gray-300 rounded p-2"
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Número de identificación tributaria"
                invalid={Boolean(companyErrors.taxId)}
                errorMessage={companyErrors.taxId?.message}
              >
                <Controller
                  name="taxId"
                  control={companyControl}
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      placeholder="Número de identificación tributaria"
                      className="border border-gray-300 rounded p-2"
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Sitio web"
                invalid={Boolean(companyErrors.webSiteUrl)}
                errorMessage={companyErrors.webSiteUrl?.message}
              >
                <Controller
                  name="webSiteUrl"
                  control={companyControl}
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      placeholder="URL del sitio web"
                      className="border border-gray-300 rounded p-2"
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Teléfono"
                invalid={Boolean(companyErrors.phone)}
                errorMessage={companyErrors.phone?.message}
              >
                <Controller
                  name="phone"
                  control={companyControl}
                  render={({ field }) => (
                    <Input
                      type="text"
                      {...field}
                      placeholder="Número de teléfono"
                      className="border border-gray-300 rounded p-2"
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Descripción de la empresa"
                className="col-span-2"
                invalid={Boolean(companyErrors.description)}
                errorMessage={companyErrors.description?.message}
              >
                <Controller
                  name="description"
                  control={companyControl}
                  render={({ field }) => (
                    <Input
                      {...field}
                      autoComplete="off"
                      textArea
                      rows={5}
                      value={field.value || ''}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Sector de empleo"
                invalid={Boolean(companyErrors.employmentSectorId)}
                errorMessage={companyErrors.employmentSectorId?.message}
                className="col-span-2"
              >
                <Controller
                  name="employmentSectorId"
                  control={companyControl}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="Sector Empresarial"
                      {...field}
                      options={hiringEmploymentSectorOptions}
                      value={hiringEmploymentSectorOptions.filter(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
              </FormItem>
              <div className="col-span-2 flex justify-end">
                <Button variant="solid" type="submit">
                  Crear cuenta
                </Button>
              </div>
            </Form>
          </div>
        )}

        {current === 2 && userType === 'applicant' && (
          <div className="mt-6 rounded flex flex-col items-center justify-start w-full h-full gap-4">
            <h3 className="text-2xl font-bold text-center">
              Datos del candidato
            </h3>
            <Form
              onSubmit={applicantHandleSubmit(onSubmitApplicant, console.error)}
              className="w-[90%] h-full"
              containerClassName="grid grid-cols-1 md:grid-cols-2 gap-4 w-full"
            >
              <FormItem
                className="w-[calc(100%-30px)] md:w-[100%]"
                label="Fecha de Nacimiento"
              >
                <Controller
                  name="dateOfBirth"
                  control={applicantControl}
                  render={({ field }) => (
                    <>
                      <DatePicker
                        {...field}
                        placeholder="Fecha de Nacimiento"
                        value={field.value}
                        onChange={field.onChange}
                        onBlur={field.onBlur}
                        defaultMonth={
                          field.value
                            ? new Date(field.value)
                            : yearsBeforeToday(18)
                        }
                      />
                      <Alert
                        type="warning"
                        style={{ marginTop: 5, fontSize: 12 }}
                      >
                        Debes ser mayor de 18 años para aplicar a trabajos.
                      </Alert>
                    </>
                  )}
                />
              </FormItem>
              <FormItem
                className="w-[calc(100%-30px)] md:w-[100%]"
                invalid={Boolean(applicantErrors.phone)}
                errorMessage={applicantErrors.phone?.message}
                label="Teléfono de Casa"
              >
                <Controller
                  name="phone"
                  control={applicantControl}
                  render={({ field }) => (
                    <NumericInput
                      autoComplete="off"
                      placeholder="Teléfono de Casa"
                      value={field.value as string}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                className="w-[calc(100%-30px)] md:w-[100%]"
                invalid={Boolean(applicantErrors.mobile)}
                errorMessage={applicantErrors.mobile?.message}
                label="Teléfono Celular"
              >
                <Controller
                  name="mobile"
                  control={applicantControl}
                  render={({ field }) => (
                    <NumericInput
                      autoComplete="off"
                      placeholder="Teléfono Celular"
                      value={field.value as string}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Sexo"
                invalid={Boolean(applicantErrors.genderId)}
                errorMessage={applicantErrors.genderId?.message}
                className="w-[calc(100%-30px)] md:w-[100%]"
              >
                <Controller
                  name="genderId"
                  control={applicantControl}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="Sexo"
                      {...field}
                      options={genderOptions}
                      value={genderOptions.filter(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Estado Civil"
                invalid={Boolean(applicantErrors.maritalStatusId)}
                errorMessage={applicantErrors.maritalStatusId?.message}
                className="w-[calc(100%-30px)] md:w-[100%]"
              >
                <Controller
                  name="maritalStatusId"
                  control={applicantControl}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="Estado Civil"
                      {...field}
                      options={maritalStatusOptions}
                      value={maritalStatusOptions.filter(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Tipo de Documento"
                invalid={Boolean(applicantErrors.documentTypeId)}
                errorMessage={applicantErrors.documentTypeId?.message}
                className="w-[calc(100%-30px)] md:w-[100%]"
              >
                <Controller
                  name="documentTypeId"
                  control={applicantControl}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="Tipo de Documento"
                      {...field}
                      options={documentTypeOptions}
                      value={documentTypeOptions.filter(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                className="w-[calc(100%-30px)] md:w-[100%]"
                invalid={Boolean(applicantErrors.documentId)}
                errorMessage={applicantErrors.documentId?.message}
                label="Documento de Identificación"
              >
                <Controller
                  name="documentId"
                  control={applicantControl}
                  render={({ field }) => (
                    <NumericInput
                      autoComplete="off"
                      placeholder="Documento de Identificación"
                      value={field.value as string}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                className="w-[calc(100%-30px)] md:w-[100%] col-span-2"
                invalid={Boolean(applicantErrors.address)}
                errorMessage={applicantErrors.address?.message}
                label="Dirección"
              >
                <Controller
                  name="address"
                  control={applicantControl}
                  render={({ field }) => (
                    <Input
                      autoComplete="off"
                      placeholder="Dirección"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="País de Residencia"
                invalid={Boolean(applicantErrors.countryOfResidencyId)}
                errorMessage={applicantErrors.countryOfResidencyId?.message}
                className="w-[calc(100%-30px)] md:w-[100%]"
              >
                <Controller
                  name="countryOfResidencyId"
                  control={applicantControl}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="País de Residencia"
                      {...field}
                      options={countriesOptions}
                      value={countriesOptions.filter(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => {
                        field.onChange(option?.value);
                        setApplicantValue('stateId', -1);
                        setApplicantValue('cityId', -1);
                      }}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Departamento"
                invalid={Boolean(applicantErrors.stateId)}
                errorMessage={applicantErrors.stateId?.message}
                className="w-[calc(100%-30px)] md:w-[100%]"
              >
                <Controller
                  name="stateId"
                  control={applicantControl}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="Departamento"
                      {...field}
                      options={stateOptions}
                      value={stateOptions.filter(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => {
                        field.onChange(option?.value);
                        setStateId(option?.value || 0);
                        setApplicantValue('cityId', -1);
                      }}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                label="Municipio"
                invalid={Boolean(applicantErrors.cityId)}
                errorMessage={applicantErrors.cityId?.message}
                className="w-[calc(100%-30px)] md:w-[100%]"
              >
                <Controller
                  name="cityId"
                  control={applicantControl}
                  render={({ field }) => (
                    <Select<Option>
                      placeholder="Municipio"
                      {...field}
                      options={cityOptions}
                      value={cityOptions.filter(
                        (option) => option.value === field.value
                      )}
                      onChange={(option) => field.onChange(option?.value)}
                    />
                  )}
                />
              </FormItem>
              <FormItem
                className="w-[calc(100%-30px)] md:w-[100%]"
                invalid={Boolean(applicantErrors.zone)}
                errorMessage={applicantErrors.zone?.message}
                label="Zona"
              >
                <Controller
                  name="zone"
                  control={applicantControl}
                  render={({ field }) => (
                    <NumericInput
                      autoComplete="off"
                      placeholder="Zona"
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                    />
                  )}
                />
              </FormItem>
              <div className="col-span-2 flex justify-end">
                <Button variant="solid" type="submit">
                  Crear cuenta
                </Button>
              </div>
            </Form>
          </div>
        )}

        {current === 3 && (
          <div className="mt-6 rounded flex flex-col items-center justify-start w-full h-full gap-4">
            <Spinner size={50} />
            <h3 className="text-2xl font-bold text-center">
              Creando cuenta...
            </h3>
          </div>
        )}
      </Card>
      <Dialog
        isOpen={logoutDialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <h5 className="mb-4">Cancelar Creación de Cuenta</h5>
        <p>
          ¿Estás seguro que seas cancelar el proceso de creación de cuenta? Si
          lo haces, perderás toda la información que hayas ingresado hasta
          ahora.
          <br />
          <br />
          Si no deseas cerrar sesión, puedes continuar con el proceso de
          creación de cuenta.
        </p>
        <div className="text-right mt-6">
          <Button
            className="ltr:mr-2 rtl:ml-2"
            variant="plain"
            onClick={onDialogClose}
          >
            No
          </Button>
          <Button variant="solid" onClick={onDialogOk}>
            Sí
          </Button>
        </div>
      </Dialog>
    </Card>
  );
};

export default NewClient;
