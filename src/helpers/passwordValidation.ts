const validatePasswordLength = (password: string) => {
  return password.length < 8;
};

const validatePasswordAtLeastOneLowercase = (password: string) => {
  return !/[a-z]/.test(password);
};

const validatePasswordAtLeastOneUppercase = (password: string) => {
  return !/[A-Z]/.test(password);
};

const validatePasswordAtLeastOneNumber = (password: string) => {
  return !/[0-9]/.test(password);
};

const validatePasswordAtLeastOneSymbol = (password: string) => {
  return !/[!@#$%^&*(),.?":{}|<>]/.test(password);
};

export const validatePasswordStrength = (password: string): string[] => {
  const validations = [
    validatePasswordLength(password) ? 'La contraseña debe tener al menos 8 caracteres.' : null,
    validatePasswordAtLeastOneLowercase(password) ? 'La contraseña debe tener al menos una letra minúscula.' : null,
    validatePasswordAtLeastOneUppercase(password) ? 'La contraseña debe tener al menos una letra mayúscula.' : null,
    validatePasswordAtLeastOneNumber(password) ? 'La contraseña debe tener al menos un número.' : null,
    validatePasswordAtLeastOneSymbol(password) ? 'La contraseña debe tener al menos un símbolo.' : null,
  ];

  return validations.filter((x) => x !== null);
};
