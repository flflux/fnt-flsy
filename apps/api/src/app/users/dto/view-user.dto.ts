import { ViewOrganizationRoleDto, ViewUser } from "@fnt-flsy/data-transfer-types";
import { ApiProperty } from "@nestjs/swagger";
import { SuperRoleName } from '@prisma/client';


export class ViewUserDto implements ViewUser {
  @ApiProperty() id: number;
  @ApiProperty() firstName: string;
  @ApiProperty() lastName: string;
  @ApiProperty() email: string;
  @ApiProperty() isActive: boolean;
  @ApiProperty() phoneNumber: string;
  @ApiProperty() organizationRoles: ViewOrganizationRoleDto[];
  @ApiProperty() superRole?: SuperRoleName;
}


export class EditUserStatus {
  @ApiProperty() isActive: boolean;
}
