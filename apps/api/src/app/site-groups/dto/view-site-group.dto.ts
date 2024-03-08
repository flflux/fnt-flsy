import { ViewSiteGroup} from '@fnt-flsy/data-transfer-types';


export class ViewSiteGroupDto implements ViewSiteGroup {
  id: number;
  name: string;
  organization: { id: number; name: string; };
}
