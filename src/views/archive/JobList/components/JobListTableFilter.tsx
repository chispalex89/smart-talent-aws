import { useState } from 'react';
import Button from '@/components/ui/Button';
import DatePicker from '@/components/ui/DatePicker';
import Drawer from '@/components/ui/Drawer';
import Checkbox from '@/components/ui/Checkbox';
import Badge from '@/components/ui/Badge';
import Select, { Option as DefaultOption } from '@/components/ui/Select';
import { components } from 'react-select';
import { Form, FormItem } from '@/components/ui/Form';
import useJobOfferList from '../hooks/useJobOfferList';
import { TbFilter } from 'react-icons/tb';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { ZodType } from 'zod';
import type { ControlProps, OptionProps } from 'react-select';
import classNames from '@/utils/classNames';

type FilterFormSchema = {
  status: string;
};

type Option = {
  value: string;
  label: string;
  className: string;
};

const { Control } = components;

const statusOption: Option[] = [
  { value: 'active', label: 'Activo', className: 'bg-emerald-500' },
  { value: 'inactive', label: 'Inactivo', className: 'bg-red-500' },
  { value: 'archived', label: 'Archivado', className: 'bg-amber-500' },
  { value: 'all', label: 'Todos', className: 'bg-gray-400' },
];

const CustomSelectOption = (props: OptionProps<Option>) => {
  return (
    <DefaultOption<Option>
      {...props}
      customLabel={(data, label) => (
        <span className="flex items-center gap-2">
          <Badge className={data.className} />
          <span className="ml-2 rtl:mr-2">{label}</span>
        </span>
      )}
    />
  );
};

const CustomControl = ({ children, ...props }: ControlProps<Option>) => {
  const selected = props.getValue()[0];
  return (
    <Control {...props}>
      {selected && <Badge className={classNames('ml-4', selected.className)} />}
      {children}
    </Control>
  );
};

const validationSchema: ZodType<FilterFormSchema> = z.object({
  status: z.string(),
});

const JobOfferListTableFilter = () => {
  const [filterIsOpen, setFilterIsOpen] = useState(false);

  const { filterData, setFilterData } = useJobOfferList();

  const { handleSubmit, control } = useForm<FilterFormSchema>({
    defaultValues: filterData,
    resolver: zodResolver(validationSchema),
  });

  const onSubmit = (values: FilterFormSchema) => {
    if (values.status === 'all') {
      values.status = '';
    }
    setFilterData(values);
    setFilterIsOpen(false);
  };

  return (
    <>
      <Button variant='default' icon={<TbFilter />} onClick={() => setFilterIsOpen(true)}>
        Filtrar
      </Button>
      <Drawer
        title="Filtrar"
        isOpen={filterIsOpen}
        onClose={() => setFilterIsOpen(false)}
        onRequestClose={() => setFilterIsOpen(false)}
      >
        <Form
          className="h-full"
          containerClassName="flex flex-col justify-between h-full"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <FormItem label="Estado">
              <Controller
                name="status"
                control={control}
                defaultValue='active'
                render={({ field }) => (
                  <Select<Option>
                    options={statusOption}
                    {...field}
                    value={statusOption.filter(
                      (option) => option.value === field.value,
                    )}
                    components={{
                      Option: CustomSelectOption,
                      Control: CustomControl,
                    }}
                    onChange={(option) => field.onChange(option?.value)}
                  />
                )}
              />
            </FormItem>
          </div>
          <Button variant="solid" type="submit">
            Query
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default JobOfferListTableFilter;
