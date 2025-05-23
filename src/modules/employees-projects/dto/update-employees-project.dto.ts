import { PartialType } from '@nestjs/swagger';
import { CreateEmployeesProjectDto } from './create-employees-project.dto';

export class UpdateEmployeesProjectDto extends PartialType(
  CreateEmployeesProjectDto,
) {}
