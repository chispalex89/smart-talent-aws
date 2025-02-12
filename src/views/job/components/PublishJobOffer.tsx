import { useState } from 'react';
import { FormSectionBaseProps } from '../JobForm/types';
import { Form, Switcher } from '@/components/ui';
import { FormItem } from '@/components/ui';
import { Card } from '@/components/ui';
import { Controller } from 'react-hook-form';
import Input from '@/components/ui/Input';
import { Alert } from '@/components/ui';

type ContractDetailsSectionProps = FormSectionBaseProps;

const PublishJobOffer = ({ control, errors }: ContractDetailsSectionProps) => {
  const [checked, setChecked] = useState(false);
  const [checked2, setChecked2] = useState(false);

  return (
    <Card id="publishJob">
        <h4 className="mb-6">Publicar el trabajo</h4>
        <div>
          <FormItem
            label="Descripcion de salario y beneficios extra"
            invalid={Boolean(errors.description)}
            errorMessage={errors.description?.message}
          >
            <Controller
              name="publicDescription"
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
            <Alert showIcon className="mb-4" type='info'>
            Puedes publicar la información en el idioma de las personas a quienes te diriges.

            </Alert>
          </FormItem>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          <div className="grid md:grid-cols-1 gap-5">
            <p>Trabajo confidencial</p>
            <Switcher
              className="w-14"
              defaultChecked={checked}
              onChange={(checked) => setChecked(checked)}
              checked={checked}
              checkedContent="Si"
              unCheckedContent="No"
            />
            <Alert showIcon className="mb-4">
              Al seleccionar ésta opción los datos de tu empresa serán
              confidenciales cuando se publique esta oferta de trabajo.
            </Alert>
          </div>
          <div className="grid md:grid-cols-1 gap-5">
            <p>Empleo destacado</p>
            <Switcher
              id='featured'
              className="w-14"
              defaultChecked={checked2}
              onChange={(checked2) => setChecked2(checked2)}
              checked={checked2}
              checkedContent="Si"
              unCheckedContent="No"
            />
            <Alert showIcon className="mb-4">
              Al seleccionar ésta opción hara su empleo destacado
            </Alert>
          </div>
        </div>
    </Card>
  );
};

export default PublishJobOffer;
