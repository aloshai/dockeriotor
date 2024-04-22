import { WorkerActionType } from '@/enums/worker-action-type.enum';
import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsString } from 'class-validator';

export class ActionWorkerDto {
  @IsString()
  @ApiProperty({
    type: String,
  })
  tag: string;

  @IsEnum(WorkerActionType)
  @ApiProperty({
    enum: WorkerActionType,
    enumName: 'WorkerActionType',
  })
  action: WorkerActionType;
}
