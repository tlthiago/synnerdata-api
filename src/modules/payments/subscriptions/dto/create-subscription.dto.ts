import { IsArray, IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import {
  Address,
  CreateCustomerDto,
} from '../../customers/dto/create-customer.dto';

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

  princing_scheme: PricingScheme;
}

class Card {
  billing_address: Address;
}

class CreditCard {
  card: Card;
}

export class CreateSubscriptionDto {
  @IsString()
  @IsOptional()
  customer_id: string;

  @IsOptional()
  customer: CreateCustomerDto;

  @IsArray()
  items: Item[];

  @IsString()
  card_token: string;

  credit_card: CreditCard;
}
