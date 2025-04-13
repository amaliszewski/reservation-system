import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ required: true, type: String })
  @IsNotEmpty()
  password: string;
}
