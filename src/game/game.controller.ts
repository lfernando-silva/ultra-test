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
import {
  ApiParam,
  ApiNotFoundResponse,
  ApiCreatedResponse,
  ApiTags,
  ApiBadRequestResponse,
  ApiOkResponse,
} from '@nestjs/swagger';

import { CreateGameDto } from './dto/create-game.dto';
import { UpdateGameDto } from './dto/update-game.dto';
import { Game, Publisher } from './entities';
import { GameService } from './game.service';

@ApiTags('games')
@Controller('games')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Post()
  @ApiCreatedResponse({
    type: Game,
  })
  @ApiBadRequestResponse()
  async create(@Body() data: CreateGameDto) {
    return this.gameService.create(data);
  }

  @Post('/process-discounts')
  @ApiCreatedResponse()
  @ApiBadRequestResponse({
    type: Object,
  })
  async processDiscounts() {
    await this.gameService.processDiscounts();
    return {
      processed: true,
    };
  }

  @Get()
  @ApiOkResponse({
    type: [Game],
  })
  findAll() {
    return this.gameService.findAll();
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @Get(':id')
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Game,
  })
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.gameService.findOne(id);
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @Get(':id/publisher')
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Publisher,
  })
  findGamePublisher(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.gameService.findGamePublisher(id);
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @Patch(':id')
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse({
    type: Game,
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateGameDto: UpdateGameDto,
  ) {
    return this.gameService.update(id, updateGameDto);
  }

  @ApiParam({
    name: 'id',
    type: 'string',
    format: 'uuid',
  })
  @Delete(':id')
  @ApiNotFoundResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse()
  remove(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.gameService.remove(id);
  }
}
