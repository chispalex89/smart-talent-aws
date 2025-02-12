import { useState, useRef } from 'react';
import Avatar from '@/components/ui/Avatar';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { Form, FormItem } from '@/components/ui/Form';
import classNames from '@/utils/classNames';
import sleep from '@/utils/sleep';
import isLastChild from '@/utils/isLastChild';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import type { ZodType } from 'zod';
import apiService from '../../../../services/apiService';
import Notification from '@/components/ui/Notification';
import { toast } from '@/components/ui';
import { useAuth } from '@/auth';

type PasswordSchema = {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

const validationSchema: ZodType<PasswordSchema> = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Please enter your current password!' }),
    newPassword: z
      .string()
      .min(1, { message: 'Please enter your new password!' }),
    confirmNewPassword: z
      .string()
      .min(1, { message: 'Please confirm your new password!' }),
  })
  .refine((data) => data.confirmNewPassword === data.newPassword, {
    message: 'Password not match',
    path: ['confirmNewPassword'],
  })
  .refine((data) => data.newPassword !== data.currentPassword, {
    message: 'New password must be different to current password',
    path: ['newPassword'],
  });

const SettingsSecurity = () => {
  const [confirmationOpen, setConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);

  const {
    getValues,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm<PasswordSchema>({
    resolver: zodResolver(validationSchema),
  });

  const { user } = useAuth();

  const handlePostSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await apiService.patch<{ status: number }>(
        `/user/${user.userId}/change-password`,
        getValues(),
      );
      console.log(response); 
      if (response.status === 200) {
        toast.push(
          <Notification type="success">
            ¡Contraseña actualizada con éxito!
          </Notification>,
          {
            placement: 'top-center',
          },
        );
      } else {
        toast.push(
          <Notification type="danger">
            ¡Error al actualizar la contraseña!
          </Notification>,
          {
            placement: 'top-center',
          },
        );
      }
    } catch (error) {
      console.error(error);
      toast.push(
        <Notification type="danger">
          ¡Error al actualizar la contraseña!
        </Notification>,
        {
          placement: 'top-center',
        },
      );
    } finally {
      setIsSubmitting(false);
      setConfirmationOpen(false);
    }
  };

  const onSubmit = async () => {
    setConfirmationOpen(true);
  };

  return (
    <div>
      <div className="mb-8">
        <h4>Cambio de contraseña</h4>
        <p>
          Por seguridad, debes cambiar tu contraseña periódicamente para
          proteger tu cuenta.
        </p>
      </div>
      <Form ref={formRef} className="mb-8" onSubmit={handleSubmit(onSubmit)}>
        <FormItem
          label="Contraseña actual"
          invalid={Boolean(errors.currentPassword)}
          errorMessage={errors.currentPassword?.message}
        >
          <Controller
            name="currentPassword"
            control={control}
            render={({ field }) => (
              <Input
                type="password"
                autoComplete="off"
                placeholder="•••••••••"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Nueva contraseña"
          invalid={Boolean(errors.newPassword)}
          errorMessage={errors.newPassword?.message}
        >
          <Controller
            name="newPassword"
            control={control}
            render={({ field }) => (
              <Input
                type="password"
                autoComplete="off"
                placeholder="•••••••••"
                {...field}
              />
            )}
          />
        </FormItem>
        <FormItem
          label="Confirmar nueva contraseña"
          invalid={Boolean(errors.confirmNewPassword)}
          errorMessage={errors.confirmNewPassword?.message}
        >
          <Controller
            name="confirmNewPassword"
            control={control}
            render={({ field }) => (
              <Input
                type="password"
                autoComplete="off"
                placeholder="•••••••••"
                {...field}
              />
            )}
          />
        </FormItem>
        <div className="flex justify-end">
          <Button variant="solid" type="submit">
            Actualizar
          </Button>
        </div>
      </Form>
      <ConfirmDialog
        isOpen={confirmationOpen}
        type="warning"
        title="Actualizar contraseña"
        confirmButtonProps={{
          loading: isSubmitting,
          onClick: handlePostSubmit,
        }}
        onClose={() => setConfirmationOpen(false)}
        onRequestClose={() => setConfirmationOpen(false)}
        onCancel={() => setConfirmationOpen(false)}
      >
        <p>¿Estas seguro de actualizar tu contraseña?</p>
      </ConfirmDialog>
    </div>
  );
};

export default SettingsSecurity;
