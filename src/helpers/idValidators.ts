export const validateCUI = (cui: string) => {
  const noSpacesAndDashesCUI = cui.replace(/-|\s/g, '');
  const regex = /^[0-9]{4}\s?[0-9]{5}\s?[0-9]{4}$/;
  const test = regex.test(noSpacesAndDashesCUI);
  if (!test) {
    return false;
  }

  const department = parseInt(noSpacesAndDashesCUI.substring(9, 11), 10);
  const municipality = parseInt(noSpacesAndDashesCUI.substring(11, 13), 10);
  const checkSumChecker = noSpacesAndDashesCUI.substring(0, 8);
  const checkDigit = parseInt(noSpacesAndDashesCUI.substring(8, 9), 10);

  const validMunicipalities = [
    /* 01 - Guatemala tiene:      */ 17 /* municipios. */,
    /* 02 - El Progreso tiene:    */ 8 /* municipios. */,
    /* 03 - Sacatepéquez tiene:   */ 16 /* municipios. */,
    /* 04 - Chimaltenango tiene:  */ 16 /* municipios. */,
    /* 05 - Escuintla tiene:      */ 13 /* municipios. */,
    /* 06 - Santa Rosa tiene:     */ 14 /* municipios. */,
    /* 07 - Sololá tiene:         */ 19 /* municipios. */,
    /* 08 - Totonicapán tiene:    */ 8 /* municipios. */,
    /* 09 - Quetzaltenango tiene: */ 24 /* municipios. */,
    /* 10 - Suchitepéquez tiene:  */ 21 /* municipios. */,
    /* 11 - Retalhuleu tiene:     */ 9 /* municipios. */,
    /* 12 - San Marcos tiene:     */ 30 /* municipios. */,
    /* 13 - Huehuetenango tiene:  */ 32 /* municipios. */,
    /* 14 - Quiché tiene:         */ 21 /* municipios. */,
    /* 15 - Baja Verapaz tiene:   */ 8 /* municipios. */,
    /* 16 - Alta Verapaz tiene:   */ 17 /* municipios. */,
    /* 17 - Petén tiene:          */ 14 /* municipios. */,
    /* 18 - Izabal tiene:         */ 5 /* municipios. */,
    /* 19 - Zacapa tiene:         */ 11 /* municipios. */,
    /* 20 - Chiquimula tiene:     */ 11 /* municipios. */,
    /* 21 - Jalapa tiene:         */ 7 /* municipios. */,
    /* 22 - Jutiapa tiene:        */ 17 /* municipios. */,
  ];

  if (
    department < 1 || // Department is out of range.
    department > validMunicipalities.length || // Department is out of range.
    municipality < 1 || // Municipality is out of range.
    municipality > validMunicipalities[department - 1] // Municipality is out of range.
  ) {
    return false;
  }

  let checkSum = 0;
  for (let i = 0; i < checkSumChecker.length; i++) {
    const digit = parseInt(checkSumChecker[i], 10);
    checkSum += digit * (i + 2);
  }

  const module = checkSum % 11;
  return module === checkDigit;
};

export const validateNIT = (nit: string) => {
  const regex = /^[0-9]+(-?[0-9k])?/i;
  if (!regex.test(nit)) {
    return false;
  }

  const noDashesNIT = nit.toLowerCase().replace(/-/g, '');
  const checkSumChecker = noDashesNIT[noDashesNIT.length - 1];
  const number = noDashesNIT.substring(0, noDashesNIT.length - 1);

  let factor = number.length + 1;
  let checkSum = 0;

  for (let i = 0; i < number.length; i++) {
    const digit = parseInt(number[i], 10);
    checkSum += digit * factor;
    factor--;
  }

  const module = (11 - (checkSum % 11)) % 11;
  const computedCheckSum = module === 10 ? 'k' : module.toString();
  return computedCheckSum === checkSumChecker;
};
