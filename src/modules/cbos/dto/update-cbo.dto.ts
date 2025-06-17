import { PartialType } from '@nestjs/swagger';
import { CreateCboDto } from './create-cbo.dto';

export class UpdateCboDto extends PartialType(CreateCboDto) {}
