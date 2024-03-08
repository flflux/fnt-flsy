import { Page } from './page';

export interface SiteGroup {
  id: number;
  name: string;
  organizationId: number;
}

export interface ViewSiteGroup {
  id: number;
  name: string;
  organization: { id: number; name: string };
}

export type ListSiteGroup = Pick<ViewSiteGroup, 'id' | 'name' | 'organization'>;

export type AddSiteGroup = Omit<SiteGroup, 'id'>;

export type ListSiteGroupPage = Page<ListSiteGroup>;
