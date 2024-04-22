import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsString } from 'class-validator';

export class CreateWorkerDto {
  @IsString()
  @ApiProperty()
  tag: string;

  @IsString()
  @Transform(({ value }) => value?.trim())
  @ApiProperty({
    minimum: 1,
  })
  command: string;
}
