import { AuthUser, type FetchUserAttributesOutput } from 'aws-amplify/auth';
import React, { useEffect } from 'react';
import apiService from '../services/apiService';
import {
  Applicant,
  Company,
  Membership,
  MembershipType,
  Permission,
  Recruiter,
  Role,
  User,
  UserRole,
} from '@prisma/client';
import {
  DBRole,
  FrontendRole,
  mapDBRoleToFrontendRole,
} from '../helpers/roleMapping';

export type UserRoleWithDetails = UserRole & {
  role: Role;
  user: User;
};

export type RecruiterWithDetails = Recruiter & {
  user: User;
  company: Company & {
    Membership: Array<
      Membership & {
        membership_type: MembershipType;
      }
    >;
  };
};

export type ApplicantWithDetails = Applicant & {
  user: User;
};

export interface IUserContext {
  loadingUser: boolean;
  loadingRole: boolean;
  user: User | null;
  setUser: (user: User | null) => void;
  recruiter: RecruiterWithDetails | null;
  setRecruiter: (recruiter: RecruiterWithDetails | null) => void;
  refetchRecruiter: () => Promise<void>;
  applicant: ApplicantWithDetails | null;
  setApplicant: (applicant: ApplicantWithDetails | null) => void;
  refetchApplicant: () => Promise<void>;
  refetchUser: () => Promise<void>;
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser | null) => void;
  role: FrontendRole | null;
  setRole: (role: FrontendRole | null) => void;
  permissions: Permission[];
  setPermissions: (permissions: Permission[]) => void;
  userAttributes: FetchUserAttributesOutput | null;
  membershipType: string | null;
}

export const UserContext = React.createContext<IUserContext | null>(null);

export const UserContextProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[] | null;
}> = (props) => {
  const [loadingUser, setLoadingUser] = React.useState<boolean>(true);
  const [loadingRole, setLoadingRole] = React.useState<boolean>(false);
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [recruiter, setRecruiter] = React.useState<RecruiterWithDetails | null>(
    null
  );
  const [applicant, setApplicant] = React.useState<ApplicantWithDetails | null>(
    null
  );
  const [membershipType, setMembershipType] = React.useState<string | null>(
    null
  );
  const [role, setRole] = React.useState<FrontendRole | null>(null);
  const [permissions, setPermissions] = React.useState<Permission[]>([]);
  const [userAttributes, setUserAttributes] =
    React.useState<FetchUserAttributesOutput | null>(null);

  const fetchUser = async () => {
    setLoadingUser(true);
    try {
      const currentUser = await apiService.get<User>(
        `/user/${authUser?.username}`
      );
      if (!currentUser || !currentUser.id) {
        throw new Error('User not found');
      }
      setUser(currentUser);
      setUserAttributes({
        email: currentUser.email,
        name: currentUser.firstName,
        middle_name: currentUser.middleName || '',
        family_name: currentUser.lastName || '',
        second_family_name: currentUser.secondLastName || '',
        sub: currentUser.loginId,
      });
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
    } finally {
      setLoadingUser(false);
    }
  };

  const fetchRecruiter = async () => {
    const recruiter = await apiService.get<RecruiterWithDetails>(
      `/user/${user?.id}/recruiter`
    );
    setRecruiter(recruiter);
  };

  const fetchApplicant = async () => {
    const applicant = await apiService.get<ApplicantWithDetails>(
      `/applicant/${user?.id}/applicant-data`
    );
    setApplicant(applicant);
  };

  const refetchUser = async () => {
    setUserAttributes(null);
    fetchUser();
  };

  useEffect(() => {
    if (authUser) {
      setUserAttributes(null);
      fetchUser();
    }
  }, [authUser]);

  useEffect(() => {
    if (user && user.id) {
      setLoadingRole(true);
      const fetchUserRoles = async () => {
        try {
          const userRole = await apiService.get<UserRoleWithDetails>(
            `/user-role/${user.id}`
          );
          if (userRole) {
            setRole(
              mapDBRoleToFrontendRole(userRole.role.name as DBRole) || null
            );
          } else {
            setRole(null); // Reset role if no userRole is found
          }
        } catch {
          setRole(null);
        }
        setLoadingRole(false);
      };
      const fetchUserPermissions = async () => {
        const userPermissions = await apiService.get<Permission[]>(
          '/permissions',
          {
            username: user.id,
          }
        );
        setPermissions(userPermissions);
      };
      fetchUserRoles();
      fetchUserPermissions();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      if (role === FrontendRole.RECRUITER) {
        fetchRecruiter();
      } else if (role === FrontendRole.APPLICANT) {
        fetchApplicant();
      } else {
        setRecruiter(null);
        setApplicant(null);
      }
    }
  }, [user, role]);

  useEffect(() => {
    if (recruiter) {
      setMembershipType(
        recruiter.company?.Membership[0]?.membership_type?.name
      );
    }
  }, [recruiter]);

  return (
    <UserContext.Provider
      value={{
        loadingUser,
        loadingRole,
        user,
        setUser,
        refetchUser,
        role,
        setRole,
        permissions,
        setPermissions,
        authUser,
        setAuthUser,
        userAttributes,
        recruiter,
        setRecruiter,
        refetchRecruiter: fetchRecruiter,
        applicant,
        setApplicant,
        refetchApplicant: fetchApplicant,
        membershipType,
      }}
    >
      {props.children}
    </UserContext.Provider>
  );
};

export function useUserContext() {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserContextProvider');
  }
  return context;
}
