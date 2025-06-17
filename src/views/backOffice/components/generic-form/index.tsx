import { Form, FormItem } from '@/components/ui';
import React from 'react';
import { useForm, Controller } from 'react-hook-form';

export interface GenericFormProps<T> {
  subTitle?: string;
  initialValues: T;
  onSubmit?: (values: T) => void;
  onCancel?: () => void;
  submitButtonText?: string;
  cancelButtonText?: string;
}

export type FormFields<T> = Record<string, T[keyof T]>;

function GenericForm<T>({
  subTitle = '',
  initialValues,
  onSubmit,
  onCancel,
  submitButtonText,
  cancelButtonText,
}: GenericFormProps<T>) {
  // const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  //   e.preventDefault();
  //   onSubmit?.(initialValues);
  // };

  const { handleSubmit, control } = useForm<FormFields<T>>({
    defaultValues: initialValues as FormFields<T>,
  });

  const handleFormSubmit = (data: FormFields<T>) => {
    onSubmit?.(data as T);
  };

  return (
    <>
      <Form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {subTitle && (
          <h2 className="text-base text-gray-500 mb-4">{subTitle}</h2>
        )}
        <div className="space-y-4">
          {Object.entries(
            initialValues as Record<keyof FormFields<T>, unknown>
          ).map(([key, value]) => {
            if (
              key === 'id' ||
              key === 'created_at' ||
              key === 'createdAt' ||
              key === 'updated_at' ||
              key === 'updatedAt' ||
              key === 'createdBy' ||
              key === 'created_by' ||
              key === 'updatedBy' ||
              key === 'updated_by' ||
              key === 'isDeleted'
            )
              return null; // Skip fields

            let inputType = 'text';
            if (typeof value === 'number') inputType = 'number';
            if (typeof value === 'boolean') {
              return (
                <div key={key} className="flex items-center gap-2">
                  <FormItem>
                    <Controller
                      // @ts-ignore
                      name={key}
                      control={control}
                      render={({ field }) => (
                        <>
                          <input
                            type="checkbox"
                            name={key}
                            defaultChecked={value as boolean}
                            className="form-checkbox h-5 w-5 text-primary-600"
                            disabled={key === 'uuid'}
                          />
                          <label
                            htmlFor={key}
                            className="text-gray-700 capitalize"
                          >
                            {key}
                          </label>
                        </>
                      )}
                    />
                  </FormItem>
                </div>
              );
            }
            return (
              <div key={key} className="flex flex-col gap-1">
                <FormItem className="mb-2" label={key}>
                  <Controller
                    // @ts-ignore
                    name={key}
                    control={control}
                    render={({ field }) => (
                      <input
                        type={inputType}
                        {...field}
                        defaultValue={value as string | number}
                        className="form-input text-black border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                    )}
                  />
                </FormItem>
              </div>
            );
          })}
        </div>
        <div className="flex gap-4 mt-6">
          <button
            type="submit"
            className="bg-[#5994ff] text-white px-4 py-2 rounded hover:bg-[rgb(128,173,255)] transition"
          >
            {submitButtonText || 'Submit'}
          </button>
          <button
            type="button"
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 transition"
            onClick={() => onCancel?.()}
          >
            {cancelButtonText || 'Cancel'}
          </button>
        </div>
      </Form>
    </>
  );
}

export default GenericForm;
