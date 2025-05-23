import { PartialType } from '@nestjs/swagger';
import { CreateTerminationDto } from './create-termination.dto';

export class UpdateTerminationDto extends PartialType(CreateTerminationDto) {}
