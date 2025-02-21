import { User } from '@prisma/client';
export const nameFormat = (user: User) => {
  return `${user.firstName}${user.middleName ? ` ${user.middleName}` : ''}${user.lastName ? ` ${user.lastName}` : ''}${user.secondLastName ? ` ${user.secondLastName}` : ''} ${user.marriedLastName ? ` ${user.marriedLastName}` : ''}`;
};

export const dateFormat = (date: string | Date) => {
  return new Date(date).toLocaleString('es-GT', {
    timeZone: 'America/Guatemala',
  });
};

export const calculateAge = (date: string | Date) => {
  const birthDate = new Date(date);
  const difference = Date.now() - birthDate.getTime();
  const ageDate = new Date(difference);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
};