import { Page } from './page';

export interface Organization {
  id: number;
  name: string;
  type: string;
  email: string;
  phoneNumber: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateCode: string;
  countryCode: string;
  postalCode: string;
}

export type ListOrganization = Pick<Organization, 'id' | 'name' | 'type'>;

export type AddOrganization = Omit<Organization, 'id'>;

export type ListOrganizationPage = Page<ListOrganization>;
