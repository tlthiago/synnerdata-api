import { PartialType } from '@nestjs/swagger';
import { CreateCpfAnalysisDto } from './create-cpf-analysis.dto';

export class UpdateCpfAnalysisDto extends PartialType(CreateCpfAnalysisDto) {}
