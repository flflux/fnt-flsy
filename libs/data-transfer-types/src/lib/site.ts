import { Page } from './page';

export interface Site {
  id: number;
  name: string;
  siteGroupId: number;
}

export interface ViewSite {
  id: number;
  name: string;
  siteGroup: {
    id: number;
    name: string;
    organization: { id: number; name: string };
  };
}

export type ListSite = Pick<ViewSite, 'id' | 'name' | 'siteGroup'>;

export type AddSite = Omit<Site, 'id'>;

export type ListSitePage = Page<ListSite>;
