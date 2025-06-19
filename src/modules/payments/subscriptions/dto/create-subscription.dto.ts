import {
  IsArray,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateCustomerDto } from '../../customers/dto/create-customer.dto';

enum SchemeType {
  unit = 'unit',
  package = 'package',
  volume = 'volume',
  tier = 'tier',
}

class PricingScheme {
  @IsEnum(SchemeType)
  scheme_type: SchemeType;

  @IsInt()
  price: number;
}

class Item {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsString()
  quantity: string;

  @ValidateNested()
  @Type(() => PricingScheme)
  pricing_scheme: PricingScheme;
}

class Address {
  @IsString()
  line_1: string;

  @IsString()
  @IsOptional()
  line_2: string;

  @IsString()
  country: string;

  @IsString()
  state: string;

  @IsString()
  city: string;

  @IsString()
  zip_code: string;
}

class Card {
  @ValidateNested()
  @Type(() => Address)
  billing_address: Address;
}

class CreditCard {
  @ValidateNested()
  @Type(() => Card)
  card: Card;
}

export class CreateSubscriptionDto {
  @IsString()
  @IsOptional()
  customer_id?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CreateCustomerDto)
  customer?: CreateCustomerDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Item)
  items: Item[];

  @IsString()
  card_token: string;

  @ValidateNested()
  @Type(() => CreditCard)
  credit_card: CreditCard;
}
