import { ListUser } from '@fnt-flsy/data-transfer-types';
import { PickType } from '@nestjs/swagger';
import { ViewUserDto } from './view-user.dto';

export class ListUserDto
  extends PickType(ViewUserDto, [
    'id',
    'email',
    'phoneNumber',
    'firstName',
    'lastName',
    'organizationRoles',
    'superRole'
  ])
  implements ListUser {}
