import { ApiProperty } from '@nestjs/swagger';

class TokensDataDto {
  @ApiProperty({ description: 'The access token issued to the user' })
  access_token: string;

  @ApiProperty({ description: 'The expiration date of the token' })
  expiration_date: string;

  @ApiProperty({ description: 'The type of the tokens (e.g., Bearer)' })
  token_type: string;
}

export class SignInResponseDto {
  @ApiProperty({ description: 'Indicates whether the login was successful' })
  succeeded: boolean;

  @ApiProperty({
    description: 'The data of the token or null if login failed',
    type: TokensDataDto,
    nullable: true,
  })
  data: TokensDataDto | null;

  @ApiProperty({ description: 'A message describing the result of the login' })
  message: string;
}
