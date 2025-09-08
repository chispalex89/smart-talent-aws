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
        `
      <img src="https://main.d1pmhoqbi0rauz.amplifyapp.com/img/logo/logo-light-full.svg" alt="Smart Talent" width="200" />
      <h3>¡Hola, bienvenido a Smart Talent!</h3>
      <p>Utiliza este código para activar tu cuenta:</p><h1>${createCode()}</h1>
      `,

      userInvitation: {
        emailSubject: '¡Bienvenido(a) a Smart Talent!',
        emailBody: (user, code) =>
          `<p>¡Estamos encantados que estés con nosotros!</p><p>Puedes iniciar sesión con <strong>${user()}</strong> y este código <strong>${code()}</strong></p>`,
      },
    },
  },
});
