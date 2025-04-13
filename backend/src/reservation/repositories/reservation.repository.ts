import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Reservation } from '../schemas/reservation.schema';
import { Model } from 'mongoose';

@Injectable()
export class ReservationRepository {
  constructor(
    @InjectModel(Reservation.name)
    private readonly reservationModel: Model<Reservation>,
  ) {}

  async findOne(field: string, value: string): Promise<Reservation> {
    const reservation = await this.reservationModel.findOne({
      [field]: value,
    });

    return reservation;
  }

  async updateOne(field: string, value: string, data: Partial<Reservation>) {
    const reservation = await this.reservationModel.updateOne(
      { [field]: value },
      data,
      {
        upsert: true,
        new: true,
      },
    );

    return reservation;
  }
}
