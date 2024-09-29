import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CardDto {
  @IsString()
  @IsNotEmpty()
  cvc: string;

  @IsNumber()
  exp_month: number;

  @IsNumber()
  exp_year: number;

  @IsOptional()
  number?: string;

  // @IsOptional()
  // token?: string;

  // @IsCreditCard()
  // number: string;
}
