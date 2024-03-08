import { Society } from "@fnt-flsy/data-transfer-types";
import { OrganizationRoleName, SuperRoleName } from "@prisma/client";
import React from "react";
// import { User } from "@fnt-flsy/data-transfer-types";

interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    societyRoles: {
        societyId: number;
        societyName: string;
        societyRole: string;
    }[],
    organizationRoles?: OrganizationRoleDto[];
    superRole?: SuperRoleName;
}



export interface OrganizationRoleDto {
    organizationId: number;
    organizationRole: OrganizationRoleName;
};


export const UserContext = React.createContext<User | null>(null);
export const SocietyContext=React.createContext<Society | null>(null);
