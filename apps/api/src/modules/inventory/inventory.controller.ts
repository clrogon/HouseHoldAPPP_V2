import { Controller, Get, Post, Patch, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateCategoryDto, CreateItemDto, UpdateItemDto, CategoryResponseDto, ItemResponseDto } from './dto';
import { CurrentUser } from '../../common/decorators';
import type { JwtPayload } from '../../common/decorators';
import { HouseholdGuard } from '../../common/guards';

@ApiTags('inventory')
@ApiBearerAuth()
@UseGuards(HouseholdGuard)
@Controller('inventory')
export class InventoryController {
  constructor(private inventoryService: InventoryService) {}

  // Categories
  @Post('categories')
  @ApiOperation({ summary: 'Create category' })
  @ApiResponse({ status: 201, type: CategoryResponseDto })
  async createCategory(@CurrentUser() user: JwtPayload, @Body() dto: CreateCategoryDto): Promise<CategoryResponseDto> {
    return this.inventoryService.createCategory(user.householdId!, dto);
  }

  @Get('categories')
  @ApiOperation({ summary: 'Get all categories' })
  @ApiResponse({ status: 200, type: [CategoryResponseDto] })
  async getCategories(@CurrentUser() user: JwtPayload): Promise<CategoryResponseDto[]> {
    return this.inventoryService.getCategories(user.householdId!);
  }

  @Delete('categories/:id')
  @ApiOperation({ summary: 'Delete category' })
  async deleteCategory(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<{ success: boolean }> {
    return this.inventoryService.deleteCategory(user.householdId!, id);
  }

  // Items
  @Post('items')
  @ApiOperation({ summary: 'Create item' })
  @ApiResponse({ status: 201, type: ItemResponseDto })
  async createItem(@CurrentUser() user: JwtPayload, @Body() dto: CreateItemDto): Promise<ItemResponseDto> {
    return this.inventoryService.createItem(user.householdId!, dto);
  }

  @Get('items')
  @ApiOperation({ summary: 'Get all items' })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiResponse({ status: 200, type: [ItemResponseDto] })
  async getItems(@CurrentUser() user: JwtPayload, @Query('categoryId') categoryId?: string): Promise<ItemResponseDto[]> {
    return this.inventoryService.getItems(user.householdId!, categoryId);
  }

  @Get('items/:id')
  @ApiOperation({ summary: 'Get item' })
  @ApiResponse({ status: 200, type: ItemResponseDto })
  async getItem(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<ItemResponseDto> {
    return this.inventoryService.getItem(user.householdId!, id);
  }

  @Patch('items/:id')
  @ApiOperation({ summary: 'Update item' })
  @ApiResponse({ status: 200, type: ItemResponseDto })
  async updateItem(@CurrentUser() user: JwtPayload, @Param('id') id: string, @Body() dto: UpdateItemDto): Promise<ItemResponseDto> {
    return this.inventoryService.updateItem(user.householdId!, id, dto);
  }

  @Delete('items/:id')
  @ApiOperation({ summary: 'Delete item' })
  async deleteItem(@CurrentUser() user: JwtPayload, @Param('id') id: string): Promise<{ success: boolean }> {
    return this.inventoryService.deleteItem(user.householdId!, id);
  }
}
