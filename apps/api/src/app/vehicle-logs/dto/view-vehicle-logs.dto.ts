import { ViewVehicleLogs } from "@fnt-flsy/data-transfer-types";
import { AccessDirection, AccessStatus } from "@prisma/client";


export class ViewVehicleLogsDto implements ViewVehicleLogs{
    id: number;
    device: { id: number; name: string; deviceId: string; };
    vehicle: { id: number; name: string; number: string; flats: { id: number; number: string; }[]; };
    status: AccessStatus;
    direction: AccessDirection;
    dateTime: string;
}