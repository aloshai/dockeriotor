import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class UpdateWorkerDto {
  @IsString()
  @ApiProperty()
  tag: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty()
  command: string;
}
