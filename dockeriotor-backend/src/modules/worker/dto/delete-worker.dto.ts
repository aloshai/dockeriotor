import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class DeleteWorkerDto {
  @IsString()
  @ApiProperty()
  tag: string; // worker tag
}
