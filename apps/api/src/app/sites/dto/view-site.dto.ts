import { ViewSite} from '@fnt-flsy/data-transfer-types';


export class ViewSiteDto implements ViewSite {
  id: number;
  name: string;
  siteGroup: {
    id: number;
    name: string;
    organization: { id: number; name: string }
  }
}
