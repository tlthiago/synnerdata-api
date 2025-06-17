import { PartialType } from '@nestjs/swagger';
import { CreateEpiDeliveryDto } from './create-epi-delivery.dto';

export class UpdateEpiDeliveryDto extends PartialType(CreateEpiDeliveryDto) {}
