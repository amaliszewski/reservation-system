import { IsDateString, IsIn, IsNotEmpty, IsString } from 'class-validator';
import { ReservationStatus } from '../enums/reservation-status.enum';

export class ReservationDto {
  @IsNotEmpty()
  @IsString()
  reservation_id: string;

  @IsNotEmpty()
  @IsString()
  guest_name: string;

  @IsNotEmpty()
  @IsIn(Object.values(ReservationStatus))
  status: ReservationStatus;

  @IsNotEmpty()
  @IsDateString()
  check_in_date: string;

  @IsNotEmpty()
  @IsDateString()
  check_out_date: string;
}
