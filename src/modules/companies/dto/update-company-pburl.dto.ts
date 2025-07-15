import { ApiProperty } from '@nestjs/swagger';
import { IsUrl } from 'class-validator';

export class UpdateCompanyPbUrlDto {
  @ApiProperty({ description: 'Url do Power BI.', type: 'string' })
  @IsUrl({}, { message: 'A URL informada não é válida.' })
  pbUrl: string;
}
