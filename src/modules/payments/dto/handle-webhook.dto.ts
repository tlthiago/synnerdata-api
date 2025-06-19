import { IsString, IsObject, ValidateNested, IsEmail } from 'class-validator';
import { Type } from 'class-transformer';

class SubscriptionCustomerDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  document: string;

  @IsObject()
  phones: {
    home_phone?: {
      country_code: string;
      area_code: string;
      number: string;
    };
    mobile_phone?: {
      country_code: string;
      area_code: string;
      number: string;
    };
  };
}

class SubscriptionPlanDto {
  @IsString()
  name: string;
}

class SubscriptionDataDto {
  @IsString()
  id: string;

  @IsString()
  code: string;

  @ValidateNested()
  @Type(() => SubscriptionCustomerDto)
  customer: SubscriptionCustomerDto;

  @ValidateNested()
  @Type(() => SubscriptionPlanDto)
  plan: SubscriptionPlanDto;

  @IsObject()
  metadata: {
    company?: string;
  };
}

export class WebhookSubscriptionCreatedDto {
  @IsString()
  type: string;

  @ValidateNested()
  @Type(() => SubscriptionDataDto)
  data: SubscriptionDataDto;
}
