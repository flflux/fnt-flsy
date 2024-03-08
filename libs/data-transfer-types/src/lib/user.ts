import { Page } from './page';
import { OrganizationRoleName, SocietyRoleName, SuperRoleName } from '@prisma/client';


export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  SocietyRole?: SocietyRoleName
  organizationRoles?: OrganizationRoleDto[];
  superRole?: SuperRoleName;
}
export interface OrganizationRoleDto  {
  organizationId: number;
  organizationRole: OrganizationRoleName;
};

export interface ViewUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  organizationRoles: ViewOrganizationRoleDto[];
  superRole?: SuperRoleName;
}
export interface ViewOrganizationRoleDto  {
  name: string;
  organizationRole: OrganizationRoleName;
};


export type ListUser = Pick<
ViewUser,
  | 'id'
  | 'email'
  | 'phoneNumber'
  | 'firstName'
  | 'lastName'
  | 'organizationRoles'
  | 'superRole'
>;

export type AddUser = Omit<User, 'id'>;

export type ListUserPage = Page<ListUser>;
