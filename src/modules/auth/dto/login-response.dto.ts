import { ApiProperty } from '@nestjs/swagger';

export class TokenDataDto {
  @ApiProperty({ description: 'The access token issued to the user' })
  access_token: string;

  @ApiProperty({ description: 'The type of the token (e.g., Bearer)' })
  token_type: string;

  @ApiProperty({ description: 'The expiration date of the token' })
  expiration_date: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'Indicates whether the login was successful' })
  succeeded: boolean;

  @ApiProperty({
    description: 'The data of the user or null if login failed',
    type: TokenDataDto,
    nullable: true,
  })
  data: TokenDataDto | null;

  @ApiProperty({ description: 'A message describing the result of the login' })
  message: string;
}
