import { defineAuth } from '@aws-amplify/backend';

/**
 * Define and configure your auth resource
 * @see https://docs.amplify.aws/gen2/build-a-backend/auth
 */
export const auth = defineAuth({
  loginWith: {
    email: {
      verificationEmailStyle: 'CODE',
      verificationEmailSubject:
        'Código de verificación para tu cuenta de Smart Talent',
      verificationEmailBody: (createCode) =>
        `Utiliza este código para activar tu cuenta: ${createCode()}`,
      userInvitation: {
        emailSubject: '¡Bienvenido(a) a Smart Talent!',
        emailBody: (user, code) =>
          `¡Estamos encantados que estés con nosotros! Puedes iniciar sesión con ${user()} y este código ${code()}`,
      },
      
    },
  },
});
