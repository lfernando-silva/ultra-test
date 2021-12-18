import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { GameService } from './game.service';

@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  async create(@Body() data: CreateGameDto) {
    return this.gameService.create(data);
  }

  @Post('/process-discounts')
  async processDiscounts() {
    await this.gameService.processDiscounts();
    return {
      processed: true,
    };
  }

  @Get()
  findAll() {
    return this.gameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.gameService.findOne(id);
  }

  @Get(':id/publisher')
  findGamePublisher(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.gameService.findGamePublisher(id);
  }

  @Patch(':id')
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gameService.update(id, updateGameDto);
  }

  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.gameService.remove(id);
  }
}
