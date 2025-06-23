import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { PaginationDto, PaginatedResponseDto } from '../common/dto/pagination.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    // Проверяем уникальность SKU и штрихкода
    const existing = await this.prisma.product.findFirst({
      where: {
        OR: [
          { sku: createProductDto.sku },
          { barcode: createProductDto.barcode },
          { moyskladId: createProductDto.moyskladId },
        ],
        deletedAt: null,
      },
    });

    if (existing) {
      throw new ConflictException('Product with this SKU, barcode or MoySklad ID already exists');
    }

    return this.prisma.product.create({
      data: {
        ...createProductDto,
        price: createProductDto.price,
        cost: createProductDto.cost,
        stock: createProductDto.stock || 0,
        weight: createProductDto.weight,
        volume: createProductDto.volume,
        bonusPercent: createProductDto.bonusPercent,
        bonusFixed: createProductDto.bonusFixed,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit, search, sortBy, sortOrder } = paginationDto;
    const skip = (page - 1) * limit;

    const where: any = {
      deletedAt: null,
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { sku: { contains: search, mode: 'insensitive' } },
        { barcode: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ];
    }

    const orderBy: any = {};
    if (sortBy) {
      orderBy[sortBy] = sortOrder;
    } else {
      orderBy.createdAt = sortOrder;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy,
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
          _count: {
            select: {
              serialNumbers: true,
            },
          },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return new PaginatedResponseDto(products, total, page, limit);
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findFirst({
      where: { id, deletedAt: null },
      include: {
        category: true,
        serialNumbers: {
          where: { status: 'AVAILABLE' },
        },
        _count: {
          select: {
            saleItems: true,
            serialNumbers: true,
          },
        },
      },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, updateProductDto: any) {
    await this.findOne(id);

    // Проверяем уникальность при обновлении
    if (updateProductDto.sku || updateProductDto.barcode || updateProductDto.moyskladId) {
      const existing = await this.prisma.product.findFirst({
        where: {
          OR: [
            { sku: updateProductDto.sku },
            { barcode: updateProductDto.barcode },
            { moyskladId: updateProductDto.moyskladId },
          ],
          NOT: { id },
          deletedAt: null,
        },
      });

      if (existing) {
        throw new ConflictException('Product with this SKU, barcode or MoySklad ID already exists');
      }
    }

    return this.prisma.product.update({
      where: { id },
      data: {
        ...updateProductDto,
        moyskladUpdatedAt: updateProductDto.moyskladId ? new Date() : undefined,
      },
      include: {
        category: true,
      },
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        isActive: false,
      },
    });
  }

  async updateStock(id: string, quantity: number, operation: 'add' | 'subtract' | 'set') {
    const product = await this.findOne(id);
    
    let newStock: number;
    switch (operation) {
      case 'add':
        newStock = product.stock + quantity;
        break;
      case 'subtract':
        newStock = Math.max(0, product.stock - quantity);
        break;
      case 'set':
        newStock = Math.max(0, quantity);
        break;
    }

    return this.prisma.product.update({
      where: { id },
      data: { stock: newStock },
    });
  }

  async findByBarcode(barcode: string) {
    return this.prisma.product.findFirst({
      where: { 
        barcode,
        deletedAt: null,
        isActive: true,
      },
      include: {
        category: true,
      },
    });
  }

  async findBySku(sku: string) {
    return this.prisma.product.findFirst({
      where: { 
        sku,
        deletedAt: null,
        isActive: true,
      },
      include: {
        category: true,
      },
    });
  }
} 