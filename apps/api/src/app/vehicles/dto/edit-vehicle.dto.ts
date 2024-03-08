import { PickType } from "@nestjs/swagger";
import { AddVehicleDto } from "./add-vehicle.dto";
import { EditVehicle } from "@fnt-flsy/data-transfer-types";

export class EditVehicleDto extends PickType(AddVehicleDto, ['name' , 'type' , 'isActive']) implements EditVehicle {}