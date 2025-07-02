import Button from '@/components/ui/Button';
import Tag from '@/components/ui/Tag';
import { Switcher } from '@/components/ui';
import { TbTrash } from 'react-icons/tb';
import { Form, FormItem } from '@/components/ui/Form';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import { MembershipType } from '@prisma/client';
import { useEffect } from 'react';
import apiService from '../../../../../services/apiService';
import React from 'react';
import { BsFillPatchPlusFill, BsStar, BsWindowPlus } from 'react-icons/bs';

type Membership = Omit<MembershipType, 'created_at'>;

export interface MembershipPlanFormProps {
  membership: Membership;
  onSubmit?: (values: Membership) => void;
  onError?: (errors: any) => void;
  className?: string;
  resetForm?: () => void;
  onUpdateMembership?: (membership: Membership) => void;
}

const MembershipPlanForm = ({
  className,
  membership,
  onError,
  onSubmit,
  resetForm,
  onUpdateMembership,
}: MembershipPlanFormProps) => {
  const {
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
    control,
    getValues,
    setValue,
  } = useForm<Membership>({});
  useEffect(() => {
    if (membership) {
      reset(membership);
    }
  }, [membership, reset]);

  const onSubmitForm = async (values: Membership) => {
    if (values.id) {
      await apiService.put(`/membership-type/${values.id}`, {
        price: Number(values.price) || 0,
        description: values.description,
        name: values.name,
        status: values.status,
        features: values.features,
      });
    }
    if (onSubmit) {
      onSubmit(values);
    }
    reset(values);
  };
  const onErrorForm = (errors: any) => {
    console.error('Form errors:', errors);
  };

  const [features, setFeatures] = React.useState(membership.features);

  return (
    <div className="">
      <Form onSubmit={handleSubmit(onSubmitForm, onErrorForm)}>
        <FormItem
          className="mb-4"
          label="Nombre del plan"
          invalid={Boolean(errors.name)}
          errorMessage={errors.name?.message}
        >
          <div className="flex items-center justify-between mt-2">
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <Input
                  type="text"
                  className="font-semibold text-lg w-5/6"
                  placeholder="Nombre del plan"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (onUpdateMembership) {
                      onUpdateMembership({
                        ...membership,
                        name: e.target.value,
                      });
                    }
                  }}
                />
              )}
            />

            <div className="flex items-center justify-center flex-col sm:flex-row w-full">
              <span className="text-sm text-gray-500 pr-0 sm:pr-4 dark:text-gray-400 text-center sm:text-left mb-2 sm:mb-0">
                Activo
              </span>
              <Controller
                name="status"
                control={control}
                defaultValue={'active'}
                render={({ field }) => (
                  <div className="flex justify-center">
                    <Switcher
                      checked={field.value === 'active'}
                      onChange={() => {
                        const newStatus =
                          field.value === 'active' ? 'inactive' : 'active';
                        field.onChange(newStatus);
                        if (onUpdateMembership) {
                          onUpdateMembership({
                            ...membership,
                            status: newStatus,
                          });
                        }
                      }}
                    />
                  </div>
                )}
              />
            </div>
          </div>
          <div className="flex justify-end items-center space-x-2 pr-4 py-2 w-full">
            <span className="font-bold min-w-[60px] p-4">Q</span>
            <Controller
              name={'price'}
              control={control}
              render={({ field }) => (
                <Input
                  type="number"
                  className="font-bold text-center px-4 py-2 w-auto min-w-[80px] max-w-[140px]"
                  style={{
                    width: `${Math.max(80, String(field.value || '').length * 16)}px`,
                  }}
                  placeholder={'0.00'}
                  min={0}
                  step={0.01}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    if (onUpdateMembership) {
                      onUpdateMembership({
                        ...membership,
                        price: parseFloat(e.target.value),
                      });
                    }
                  }}
                />
              )}
            />
          </div>
        </FormItem>

        <Controller
          name="description"
          control={control}
          render={({ field }: { field: any }) => (
            <textarea
              className="w-full bg-transparent border-b border-gray-300 focus:outline-none text-sm text-gray-500 dark:text-gray-400 mt-2"
              placeholder="Descripción del plan"
              rows={2}
              {...field}
              onChange={(e) => {
                field.onChange(e);
                if (onUpdateMembership) {
                  onUpdateMembership({
                    ...membership,
                    description: e.target.value,
                  });
                }
              }}
            />
          )}
        />
        <div className="mt-4">
          <span className="font-medium">Características:</span>
          <FormItem className="mt-2">
            <Controller
              name="features"
              control={control}
              render={({ field }) => (
                <>
                  {(field.value || []).map((feature, idx) => (
                    <div key={idx} className="flex items-center mb-2">
                      <TbTrash
                        color="red"
                        size={20}
                        className="text-green-500 mr-2 cursor-pointer"
                        onClick={() => {
                          const newFeatures = [...(field.value || [])];
                          newFeatures.splice(idx, 1);
                          field.onChange(newFeatures);
                          setFeatures(newFeatures);
                          if (onUpdateMembership) {
                            onUpdateMembership({
                              ...membership,
                              features: newFeatures,
                            });
                          }
                        }}
                      />
                      <Input
                        type="text"
                        className="w-full"
                        placeholder="Característica"
                        value={feature}
                        onChange={(e) => {
                          const newFeatures = [...(field.value || [])];
                          newFeatures[idx] = e.target.value;
                          field.onChange(newFeatures);
                          setFeatures(newFeatures);
                          if (onUpdateMembership) {
                            onUpdateMembership({
                              ...membership,
                              features: newFeatures,
                            });
                          }
                        }}
                      />
                    </div>
                  ))}
                </>
              )}
            />
          </FormItem>

          <ul className="list-disc list-inside ml-4 mt-1"></ul>
        </div>
        <div className="w-full flex flex-col md:items-end items-center">
          <Button
            type="button"
            className="ml-4 w-full"
            onClick={() => {
              const currentFeatures = getValues('features') || [];
              const newFeatures = [...currentFeatures, ''];
              setValue('features', newFeatures);
              setFeatures(newFeatures);
              if (onUpdateMembership) {
                onUpdateMembership({ ...membership, features: newFeatures });
              }
            }}
          >
            <div className="flex flex-row items-center justify-center w-full text-md py-1.5">
              <BsFillPatchPlusFill
                className="mr-3 self-center"
                color="#5994FF"
                size={24}
              />
              <span className="font-semibold text-base md:text-md self-center">
                Agregar característica
              </span>
            </div>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row justify-start items-center mt-4 w-full gap-4 ">
          <Button
            type="submit"
            variant="solid"
            className="ml-4"
            disabled={isSubmitting}
          >
            Guardar
          </Button>
        </div>

        <div className="text-xs text-gray-400 mt-4">
          Última actualización:{' '}
          {(() => {
            const updatedAt = getValues('updated_at');
            if (updatedAt instanceof Date) {
              return updatedAt.toLocaleString();
            }
            if (typeof updatedAt === 'string' && updatedAt) {
              const date = new Date(updatedAt);
              return !isNaN(date.getTime()) ? date.toLocaleString() : '';
            }
            return '';
          })()}
          {' por '}
          {getValues('updated_by') || getValues('created_by') || ''}
        </div>
      </Form>
    </div>
  );
};
export default MembershipPlanForm;
