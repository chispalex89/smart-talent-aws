export type AppConfig = {
  apiPrefix: string;
  authenticatedEntryPath: string;
  unAuthenticatedEntryPath: string;
  locale: string;
  accessTokenPersistStrategy: 'localStorage' | 'sessionStorage' | 'cookies';
  enableMock: boolean;
  landingPageRoute: string;
};

const appConfig: AppConfig = {
  apiPrefix: '/api',
  authenticatedEntryPath: '/home',
  unAuthenticatedEntryPath: '/sign-in',
  locale: 'es',
  accessTokenPersistStrategy: 'cookies',
  enableMock: true,
  landingPageRoute: 'https://smart-talent.com.gt',
};

export default appConfig;
