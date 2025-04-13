import { Injectable } from '@nestjs/common';
import { ReservationRepository } from '../repositories/reservation.repository';
import { Reservation } from '../schemas/reservation.schema';

@Injectable()
export class ReservationService {
  constructor(private readonly reservationRepository: ReservationRepository) {}

  async findByReservationId(reservationId: string) {
    return await this.reservationRepository.findOne(
      'reservation_id',
      reservationId,
    );
  }

  async createOrUpdateReservation(
    reservationId: string,
    data: Partial<Reservation>,
  ) {
    return await this.reservationRepository.updateOne(
      'reservation_id',
      reservationId,
      data,
    );
  }
}
