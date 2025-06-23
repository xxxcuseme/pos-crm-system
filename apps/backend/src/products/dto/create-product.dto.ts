import { IsString, IsOptional, IsDecimal, IsInt, IsBoolean, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({ example: 'Хлеб белый' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ example: 'Свежий хлеб высшего сорта' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 'BREAD001' })
  @IsString()
  sku: string;

  @ApiPropertyOptional({ example: '4607034170000' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiProperty({ example: 45.50 })
  @Transform(({ value }) => parseFloat(value))
  @IsDecimal({ decimal_digits: '1,2' })
  price: number;

  @ApiPropertyOptional({ example: 32.00 })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsDecimal({ decimal_digits: '1,2' })
  cost?: number;

  @ApiPropertyOptional({ example: 100, default: 0 })
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  @IsInt()
  @Min(0)
  stock?: number;

  @ApiPropertyOptional({ example: 10 })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  @IsInt()
  @Min(0)
  minStock?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  @IsInt()
  @Min(0)
  maxStock?: number;

  @ApiPropertyOptional({ example: 0.5 })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsDecimal({ decimal_digits: '1,3' })
  weight?: number;

  @ApiPropertyOptional({ example: 0.8 })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsDecimal({ decimal_digits: '1,3' })
  volume?: number;

  @ApiPropertyOptional({ example: 'moysklad-product-id' })
  @IsOptional()
  @IsString()
  moyskladId?: string;

  @ApiPropertyOptional({ example: 2.5 })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsDecimal({ decimal_digits: '1,2' })
  bonusPercent?: number;

  @ApiPropertyOptional({ example: 5.00 })
  @IsOptional()
  @Transform(({ value }) => value ? parseFloat(value) : undefined)
  @IsDecimal({ decimal_digits: '1,2' })
  bonusFixed?: number;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isWeighted?: boolean;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  hasSerialNumbers?: boolean;

  @ApiPropertyOptional({ example: 'category-id' })
  @IsOptional()
  @IsString()
  categoryId?: string;
} 