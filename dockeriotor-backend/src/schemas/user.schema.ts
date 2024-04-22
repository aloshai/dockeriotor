import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as uuid from 'uuid';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    unique: true,
    index: true,
    default: function () {
      return uuid.v4();
    },
  })
  id: string;

  @Prop({ required: false })
  discordId?: string;

  @Prop({ required: false })
  telegramId?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
