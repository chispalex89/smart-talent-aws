import { useEffect, useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import useSWR from 'swr';
import {
  TbPlus,
} from 'react-icons/tb';
import type { GetSettingsCompanyResponse } from '../types';
import apiService from '../../../../services/apiService';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { validateNIT } from '../../../../helpers/idValidators';
import { Form, FormItem, Input, Select, toast, Upload } from '@/components/ui';
import Notification from '@/components/ui/Notification';
import { useUserContext } from '../../../../context/userContext';
import { useCatalogContext } from '../../../../context/catalogContext';
import { profileImageUrl } from '../../../../helpers/s3Url';

type Option = {
  value: number;
  label: string;
  className: string;
};

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

const SettingCompany = () => {
  const { recruiter } = useUserContext();
  const { employmentSectors } = useCatalogContext();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  const { data, error, isLoading, mutate } = useSWR<GetSettingsCompanyResponse>(
    `/company/${recruiter?.companyId}`,
    (url) => apiService.get<GetSettingsCompanyResponse>(url),
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
    }
  );

  useEffect(() => {
    if (data) {
      reset(data)
    }
  }, [data]);

  // TODO: add actual employment sectors
  const employmentSectorOptions = useMemo(() => {
    return [
      {
        name: 'Empleador Directo',
        id: 1,
      },
      {
        name: 'Agencia de Reclutamiento',
        id: 2,
      },
      {
        name: 'Servicios Temporales',
        id: 3,
      },
    ].map((employmentSector) => ({
      label: employmentSector.name,
      value: employmentSector.id,
      className: 'text-gray-900',
    }));
  }, [employmentSectors]);

  const {
    handleSubmit: companyHandleSubmit,
    control: companyControl,
    formState: { errors: companyErrors },
    reset,
  } = useForm<CompanyFormData>({
    resolver: zodResolver(companyValidationSchema),
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
    const formData = new FormData();

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
      await apiService.put(`/company/${recruiter?.companyId}`, formData);
      toast.push(
        <Notification type="success">
          Compañía actualizada exitosamente.
        </Notification>,
        {
          placement: 'top-center',
        }
      );
    } catch (error) {
      {
        toast.push(
          <Notification type="danger">
            Error al actualizar la compañía. Por favor, intenta nuevamente.
          </Notification>,
          {
            placement: 'top-center',
          }
        );
      }
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
    <>
      <div className="flex flex-col gap-4">Company</div>
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
                    src={profileImageUrl(field.value) ?? ''}
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
                options={employmentSectorOptions}
                value={employmentSectorOptions.filter(
                  (option) => option.value === field.value
                )}
                onChange={(option) => field.onChange(option?.value)}
              />
            )}
          />
        </FormItem>
        <div className="col-span-2 flex justify-end">
          <Button variant="solid" type="submit">
            Guardar
          </Button>
        </div>
      </Form>
    </>
  );
};

export default SettingCompany;
