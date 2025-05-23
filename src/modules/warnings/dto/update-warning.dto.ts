import { PartialType } from '@nestjs/swagger';
import { CreateWarningDto } from './create-warning.dto';

export class UpdateWarningDto extends PartialType(CreateWarningDto) {}
