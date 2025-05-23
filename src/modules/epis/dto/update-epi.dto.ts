import { PartialType } from '@nestjs/swagger';
import { CreateEpiDto } from './create-epi.dto';

export class UpdateEpiDto extends PartialType(CreateEpiDto) {}
