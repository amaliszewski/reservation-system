// src/reservations/schemas/reservation.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ReservationStatus } from '../enums/reservation-status.enum';

export type ReservationDocument = HydratedDocument<Reservation>;

@Schema({ timestamps: true })
export class Reservation {
  @Prop({ required: true, unique: true })
  reservation_id: string;

  @Prop({ required: true })
  guest_name: string;

  @Prop({ required: true, enum: ReservationStatus })
  status: ReservationStatus;

  @Prop({ required: true })
  check_in_date: string;

  @Prop({ required: true })
  check_out_date: string;
}

export const ReservationSchema = SchemaFactory.createForClass(Reservation);
