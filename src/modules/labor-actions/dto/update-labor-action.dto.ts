import { PartialType } from '@nestjs/swagger';
import { CreateLaborActionDto } from './create-labor-action.dto';

export class UpdateLaborActionDto extends PartialType(CreateLaborActionDto) {}
