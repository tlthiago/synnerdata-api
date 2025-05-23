import { PartialType } from '@nestjs/swagger';
import { CreateAccidentDto } from './create-accident.dto';

export class UpdateAccidentDto extends PartialType(CreateAccidentDto) {}
