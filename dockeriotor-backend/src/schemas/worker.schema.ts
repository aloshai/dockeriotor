import mongoose, { Types } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Automation, AutomationSchema } from './automation.schema';
import { AutomationType } from '@/enums/automation-type.enum';
import { User } from './user.schema';
import { WorkerEnvironment } from '@/types/worker-environment.type';

export type WorkerDocument = mongoose.HydratedDocument<Worker>;

@Schema({
  timestamps: true,
})
export class Worker {
  @Prop({ required: true })
  tag: string;

  @Prop({ required: true, type: Types.ObjectId, ref: User.name })
  owner: User | string;

  @Prop({ required: true })
  command: string;

  @Prop({ required: true, type: Object })
  environment: WorkerEnvironment;

  @Prop({
    required: true,
    type: AutomationSchema,
    default: () => ({
      type: AutomationType.Manual,
    }),
  })
  automation: Automation;
}

export const WorkerSchema = SchemaFactory.createForClass(Worker);
