import { IsString, IsOptional, IsDecimal, IsArray, ValidateNested, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { PaymentMethod } from '@prisma/client';

export class CreateSaleItemDto {
  @ApiProperty({ example: 'product-id' })
  @IsString()
  productId: string;

  @ApiProperty({ example: 2.5 })
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal({ decimal_digits: '1,3' })
  quantity: number;

  @ApiProperty({ example: 45.50 })
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal({ decimal_digits: '1,2' })
  unitPrice: number;

  @ApiPropertyOptional({ example: 5.00, default: 0 })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsDecimal({ decimal_digits: '1,2' })
  discount?: number;
}

export class CreateSalePaymentDto {
  @ApiProperty({ example: 100.00 })
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal({ decimal_digits: '1,2' })
  amount: number;

  @ApiProperty({ enum: PaymentMethod })
  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @ApiPropertyOptional({ example: 'transaction-id-123' })
  @IsOptional()
  @IsString()
  transactionId?: string;

  @ApiPropertyOptional({ example: '1234' })
  @IsOptional()
  @IsString()
  cardLast4?: string;
}

export class CreateSaleDto {
  @ApiPropertyOptional({ example: 'customer-id' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ example: 'counterparty-id' })
  @IsString()
  counterpartyId: string;

  @ApiProperty({ type: [CreateSaleItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSaleItemDto)
  items: CreateSaleItemDto[];

  @ApiProperty({ type: [CreateSalePaymentDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSalePaymentDto)
  payments: CreateSalePaymentDto[];

  @ApiPropertyOptional({ example: 10.00, default: 0 })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsDecimal({ decimal_digits: '1,2' })
  discountAmount?: number;

  @ApiPropertyOptional({ example: 25.00, default: 0 })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsDecimal({ decimal_digits: '1,2' })
  bonusUsed?: number;

  @ApiPropertyOptional({ example: 200.00, default: 0 })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : 0)
  @IsDecimal({ decimal_digits: '1,2' })
  paidAmount?: number;
} 