import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

enum DocumentType {
  CPF = 'CPF',
  CNPJ = 'CNPJ',
  PASSPORT = 'PASSPORT',
}

enum Type {
  individual = 'individual',
  company = 'company',
}

enum Gender {
  male = 'male',
  female = 'female',
}

export class Address {
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

class PhoneObject {
  @IsString()
  country_code: string;

  @IsString()
  area_code: string;

  @IsString()
  number: string;
}

class Phones {
  @IsOptional()
  home_phone: PhoneObject;

  mobile_phone: PhoneObject;
}

class Metadata {
  @IsString()
  company: string;
}

export class CreateCustomerDto {
  @IsString()
  @IsOptional()
  code: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(DocumentType)
  document_type: DocumentType;

  @IsString()
  document: string;

  @IsEnum(Type)
  type: Type;

  @IsEnum(Gender)
  @IsOptional()
  gender: Gender;

  address: Address;

  phones: Phones;

  @IsDateString()
  @IsOptional()
  birthdate: Date;

  @IsOptional()
  metadata: Metadata;
}
