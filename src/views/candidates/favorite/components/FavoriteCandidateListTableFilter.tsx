import { useState } from 'react';
import Button from '@/components/ui/Button';
import Dialog from '@/components/ui/Dialog';
import Checkbox from '@/components/ui/Checkbox';
import Input from '@/components/ui/Input';
import { Form, FormItem } from '@/components/ui/Form';
import useFavoriteCandidateList from '../hooks/useFavoriteCandidateList';
import { TbFilter } from 'react-icons/tb';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ZodType } from 'zod';
import { Drawer } from '@/components/ui';
import { useCatalogContext } from '../../../../context/catalogContext';

type FormSchema = {
  profession: Array<number>;
};

const validationSchema: ZodType<FormSchema> = z.object({
  profession: z.array(z.number()),
});

const FavoriteCandidateListTableFilter = () => {
  const { professions } = useCatalogContext();
    
    const [dialogIsOpen, setIsOpen] = useState(false);

  const { filterData, setFilterData } = useFavoriteCandidateList();

  const openDialog = () => {
    setIsOpen(true);
  };

  const onDialogClose = () => {
    setIsOpen(false);
  };

  const { handleSubmit, reset, control, getValues, setValue } = useForm<FormSchema>({
    defaultValues: filterData,
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = (values: FormSchema) => {
    setFilterData(values);
    setIsOpen(false);
  };

  return (
    <>
      <Button icon={<TbFilter />} onClick={() => openDialog()}>
        Filtrar
      </Button>
      <Drawer
        title="Filtrar"
        isOpen={dialogIsOpen}
        onClose={onDialogClose}
        onRequestClose={onDialogClose}
      >
        <h4 className="mb-4">Filtrar</h4>
        <Form onSubmit={(e) => {
            e.preventDefault();
            const professions = getValues('profession');
            const selectedProfessions = professions.filter(Boolean);
            setValue('profession', selectedProfessions);
            handleSubmit(onSubmit)()
            }}>
          <FormItem label="Profesiones">
            <Controller
              name="profession"
              control={control}
              render={({ field }) => (
                <Checkbox.Group vertical className="flex mt-4" {...field}>
                  {professions.map((source) => (
                    <Checkbox
                      key={source.id}
                      name={field.name}
                      value={source.id}
                      className="justify-between flex-row-reverse heading-text"
                    >
                      {source.name}
                    </Checkbox>
                  ))}
                </Checkbox.Group>
              )}
            />
          </FormItem>
          <div className="flex justify-end items-center gap-2 mt-4">
            <Button type="button" onClick={() => reset()}>
              Limpiar
            </Button>
            <Button type="submit" variant="solid">
              Aplicar
            </Button>
          </div>
        </Form>
      </Drawer>
    </>
  );
};

export default FavoriteCandidateListTableFilter;
