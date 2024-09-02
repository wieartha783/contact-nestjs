import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { ResponseFormatInterceptor } from '../response-format/response-format.interceptor';

@UseInterceptors(ResponseFormatInterceptor)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @UseGuards(AuthenticationGuard)
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @UseGuards(AuthenticationGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOne(+id);
  }

  @UseGuards(AuthenticationGuard)
  @Patch(':id')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Param('id', ParseIntPipe) id: number
  ): Promise<User> {
    const updatedUser = await this.userService.update(id, updateUserDto);

    return updatedUser;
  }

  @UseGuards(AuthenticationGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(+id);
  }
}
