import { AutomationType } from '@/enums/automation-type.enum';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  _id: false,
})
export class Automation {
  @Prop({
    required: true,
    enum: AutomationType,
    default: AutomationType.Manual,
  })
  type: AutomationType;

  @Prop({ required: false })
  period: number;
}

export const AutomationSchema = SchemaFactory.createForClass(Automation);
