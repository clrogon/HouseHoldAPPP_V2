import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { CreateCategoryDto, CreateItemDto, UpdateItemDto, CategoryResponseDto, ItemResponseDto } from './dto';

@Injectable()
export class InventoryService {
  constructor(private prisma: PrismaService) {}

  // Categories
  async createCategory(householdId: string, dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    const category = await this.prisma.inventoryCategory.create({
      data: {
        name: dto.name,
        icon: dto.icon,
        color: dto.color,
        order: dto.order || 0,
        parentId: dto.parentId,
        householdId,
      },
      include: { _count: { select: { items: true } } },
    });
    return this.mapCategory(category);
  }

  async getCategories(householdId: string): Promise<CategoryResponseDto[]> {
    const categories = await this.prisma.inventoryCategory.findMany({
      where: { householdId },
      include: { _count: { select: { items: true } } },
      orderBy: { order: 'asc' },
    });
    return categories.map((c) => this.mapCategory(c));
  }

  async deleteCategory(householdId: string, categoryId: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.inventoryCategory.findFirst({
      where: { id: categoryId, householdId },
    });
    if (!existing) throw new NotFoundException('Category not found');
    await this.prisma.inventoryCategory.delete({ where: { id: categoryId } });
    return { success: true };
  }

  // Items
  async createItem(householdId: string, dto: CreateItemDto): Promise<ItemResponseDto> {
    const item = await this.prisma.inventoryItem.create({
      data: {
        name: dto.name,
        description: dto.description,
        quantity: dto.quantity,
        unit: dto.unit,
        location: dto.location,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : null,
        purchasePrice: dto.purchasePrice,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : null,
        lowStockThreshold: dto.lowStockThreshold,
        barcode: dto.barcode,
        categoryId: dto.categoryId,
        householdId,
        onShoppingList: dto.onShoppingList || false,
      },
      include: { category: true },
    });
    return this.mapItem(item);
  }

  async getItems(householdId: string, categoryId?: string): Promise<ItemResponseDto[]> {
    const where: any = { householdId };
    if (categoryId) where.categoryId = categoryId;

    const items = await this.prisma.inventoryItem.findMany({
      where,
      include: { category: true },
      orderBy: { name: 'asc' },
    });
    return items.map((i) => this.mapItem(i));
  }

  async getItem(householdId: string, itemId: string): Promise<ItemResponseDto> {
    const item = await this.prisma.inventoryItem.findFirst({
      where: { id: itemId, householdId },
      include: { category: true },
    });
    if (!item) throw new NotFoundException('Item not found');
    return this.mapItem(item);
  }

  async updateItem(householdId: string, itemId: string, dto: UpdateItemDto): Promise<ItemResponseDto> {
    const existing = await this.prisma.inventoryItem.findFirst({
      where: { id: itemId, householdId },
    });
    if (!existing) throw new NotFoundException('Item not found');

    const item = await this.prisma.inventoryItem.update({
      where: { id: itemId },
      data: {
        name: dto.name,
        description: dto.description,
        quantity: dto.quantity,
        unit: dto.unit,
        location: dto.location,
        purchaseDate: dto.purchaseDate ? new Date(dto.purchaseDate) : undefined,
        purchasePrice: dto.purchasePrice,
        expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
        lowStockThreshold: dto.lowStockThreshold,
        barcode: dto.barcode,
        categoryId: dto.categoryId,
        onShoppingList: dto.onShoppingList,
      },
      include: { category: true },
    });
    return this.mapItem(item);
  }

  async deleteItem(householdId: string, itemId: string): Promise<{ success: boolean }> {
    const existing = await this.prisma.inventoryItem.findFirst({
      where: { id: itemId, householdId },
    });
    if (!existing) throw new NotFoundException('Item not found');
    await this.prisma.inventoryItem.delete({ where: { id: itemId } });
    return { success: true };
  }

  private mapCategory(category: any): CategoryResponseDto {
    return {
      id: category.id,
      name: category.name,
      icon: category.icon || undefined,
      color: category.color || undefined,
      order: category.order,
      parentId: category.parentId || undefined,
      itemCount: category._count?.items || 0,
      householdId: category.householdId,
      createdAt: category.createdAt.toISOString(),
    };
  }

  private mapItem(item: any): ItemResponseDto {
    return {
      id: item.id,
      name: item.name,
      description: item.description || undefined,
      quantity: item.quantity,
      unit: item.unit,
      location: item.location || undefined,
      purchaseDate: item.purchaseDate?.toISOString() || undefined,
      purchasePrice: item.purchasePrice || undefined,
      expiryDate: item.expiryDate?.toISOString() || undefined,
      lowStockThreshold: item.lowStockThreshold || undefined,
      barcode: item.barcode || undefined,
      categoryId: item.categoryId,
      categoryName: item.category?.name,
      onShoppingList: item.onShoppingList,
      householdId: item.householdId,
      createdAt: item.createdAt.toISOString(),
      updatedAt: item.updatedAt.toISOString(),
    };
  }
}
