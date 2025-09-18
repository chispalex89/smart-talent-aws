export enum DBRole {
  USER = 'Usuario',
  COMPANY = 'Empresa',
  ADMIN = 'Admin',
  SUPERADMIN = 'Super Admin',
}

export enum FrontendRole {
  APPLICANT = 'applicant',
  RECRUITER = 'recruiter',
  ADMIN = 'admin',
}

export const mapDBRoleToFrontendRole = (role: DBRole): FrontendRole | undefined => {
  switch (role) {
    case DBRole.USER:
      return FrontendRole.APPLICANT;
    case DBRole.COMPANY:
      return FrontendRole.RECRUITER;
    case DBRole.ADMIN:
      return FrontendRole.ADMIN;
    case DBRole.SUPERADMIN:
      return FrontendRole.ADMIN;
    default:
      return undefined;
  }
};
