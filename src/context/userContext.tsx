import {
  AuthUser,
  fetchUserAttributes,
  type FetchUserAttributesOutput,
} from 'aws-amplify/auth';
import React, { useEffect } from 'react';
import apiService from '../services/apiService';
import { Permission, Recruiter, Role, User, UserRole } from '@prisma/client';

export type UserRoleWithDetails = UserRole & {
  role: Role;
  user: User;
};

export interface IUserContext {
  user: User | null;
  setUser: (user: User | null) => void;
  recruiter: Recruiter | null;
  setRecruiter: (recruiter: Recruiter | null) => void;
  refetchUser: () => Promise<void>;
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser | null) => void;
  role: string;
  setRole: (roles: string) => void;
  permissions: Permission[];
  setPermissions: (permissions: Permission[]) => void;
  userAttributes: FetchUserAttributesOutput | null;
}

export const UserContext = React.createContext<IUserContext | null>(null);

export const UserContextProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[] | null;
}> = (props) => {
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [recruiter, setRecruiter] = React.useState<Recruiter | null>(null);
  const [role, setRole] = React.useState<string>('');
  const [permissions, setPermissions] = React.useState<Permission[]>([]);
  const [userAttributes, setUserAttributes] =
    React.useState<FetchUserAttributesOutput | null>(null);

  const fetchUser = async () => {
    const currentUser = await apiService.get<User>(
      `/user/${authUser?.username}`
    );
    setUser(currentUser);
  };

  const fetchRecruiter = async () => {
    const recruiter = await apiService.get<Recruiter>(
      `/user/${user?.id}/recruiter`
    );
    setRecruiter(recruiter);
  };

  const refetchUser = async () => {
    setUserAttributes(null);
    fetchUser();
  };

  useEffect(() => {
    if (authUser) {
      setUserAttributes(null);
      fetchUser();
      fetchUserAttributes().then((attributes) => {
        setUserAttributes(attributes);
      });
    }
  }, [authUser]);

  useEffect(() => {
    if (user && user.id) {
      const fetchUserRoles = async () => {
        const userRole = await apiService.get<UserRoleWithDetails>(
          `/user-role/${user.id}`
        );
        setRole(userRole.role.name);
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
      if (role === 'Recruiter') {
        fetchRecruiter();
      } else {
        setRecruiter(null);
      }
    }
  }, [user, role]);

  return (
    <UserContext.Provider
      value={{
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
