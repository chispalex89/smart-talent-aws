import { AuthUser } from 'aws-amplify/auth';
import React, { useEffect } from 'react';
import apiService from '../services/apiService';
import { Permission, Role, User, UserRole } from '@prisma/client';

export type UserRoleWithDetails = UserRole & {
  role: Role;
  user: User;
};

export interface IUserContext {
  user: User | null;
  setUser: (user: User | null) => void;
  authUser: AuthUser | null;
  setAuthUser: (authUser: AuthUser | null) => void;
  role: string;
  setRole: (roles: string) => void;
  permissions: Permission[];
  setPermissions: (permissions: Permission[]) => void;
}

export const UserContext = React.createContext<IUserContext | null>(null);

export const UserContextProvider: React.FC<{
  children: React.ReactNode | React.ReactNode[] | null;
}> = (props) => {
  const [authUser, setAuthUser] = React.useState<AuthUser | null>(null);
  const [user, setUser] = React.useState<User | null>(null);
  const [role, setRole] = React.useState<string>('');
  const [permissions, setPermissions] = React.useState<Permission[]>([]);

  const fetchUser = async () => {
    const currentUser = await apiService.get<User>(
      `/user/${authUser?.username}`
    );
    setUser(currentUser);
  };

  useEffect(() => {
    if (authUser) {
      fetchUser();
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

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        role,
        setRole,
        permissions,
        setPermissions,
        authUser,
        setAuthUser,
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
