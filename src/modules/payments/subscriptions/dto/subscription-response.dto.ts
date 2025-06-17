import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform, Type } from 'class-transformer';

export class CurrentCycleDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  start_at: string;

  @ApiProperty()
  @Expose()
  end_at: string;

  @ApiProperty()
  @Expose()
  billing_at: string;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  cycle: number;
}

export class MobilePhoneDto {
  @ApiProperty()
  @Expose()
  country_code: string;

  @ApiProperty()
  @Expose()
  area_code: string;

  @ApiProperty()
  @Expose()
  number: string;
}

export class PhonesDto {
  @ApiProperty({ type: MobilePhoneDto })
  @Expose()
  @Type(() => MobilePhoneDto)
  mobile_phone: MobilePhoneDto;
}

export class CustomerMetadataDto {
  @ApiProperty()
  @Expose()
  company: string;
}

export class CustomerDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  document: string;

  @ApiProperty()
  @Expose()
  document_type: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  delinquent: boolean;

  @ApiProperty()
  @Expose()
  created_at: string;

  @ApiProperty()
  @Expose()
  updated_at: string;

  @ApiProperty({ type: PhonesDto })
  @Expose()
  @Type(() => PhonesDto)
  phones: PhonesDto;

  @ApiProperty({ type: CustomerMetadataDto })
  @Expose()
  @Type(() => CustomerMetadataDto)
  metadata: CustomerMetadataDto;
}

export class PricingSchemeDto {
  @ApiProperty()
  @Expose()
  price: number;

  @ApiProperty()
  @Expose()
  scheme_type: string;
}

export class SubscriptionItemDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  quantity: number;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  created_at: string;

  @ApiProperty()
  @Expose()
  updated_at: string;

  @ApiProperty({ type: PricingSchemeDto })
  @Expose()
  @Type(() => PricingSchemeDto)
  pricing_scheme: PricingSchemeDto;
}

export class SubscriptionResponseDto {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  start_at: string;

  @ApiProperty()
  @Expose()
  interval: string;

  @ApiProperty()
  @Expose()
  interval_count: number;

  @ApiProperty()
  @Expose()
  billing_type: string;

  @ApiProperty({ type: CurrentCycleDto })
  @Expose()
  @Type(() => CurrentCycleDto)
  current_cycle: CurrentCycleDto;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) =>
    new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'short',
    }).format(new Date(value)),
  )
  next_billing_at: string;

  @ApiProperty()
  @Expose()
  payment_method: string;

  @ApiProperty()
  @Expose()
  installments: number;

  @ApiProperty()
  @Expose()
  status: string;

  @ApiProperty()
  @Expose()
  created_at: string;

  @ApiProperty()
  @Expose()
  updated_at: string;

  @ApiProperty({ type: CustomerDto })
  @Expose()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ type: [SubscriptionItemDto] })
  @Expose()
  @Type(() => SubscriptionItemDto)
  items: SubscriptionItemDto[];
}
