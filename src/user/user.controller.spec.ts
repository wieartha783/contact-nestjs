import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { dataSourceOptions } from '../test-utils/TypeORMSQLITETestingModule';
import { Contact } from './contact/entities/contact.entity';
import { testDatasetSeed } from '../test-utils/testDataset.seed';
import { AuthenticationGuard } from '../guards/authentication.guard';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { error } from 'console';

class MockAuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
      return true; // Always allow access
    }
  }

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;
  let userRepository: Repository<User>;
  let dataSource: DataSource;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(dataSourceOptions),
        TypeOrmModule.forFeature([User, Contact]),
      ],
      controllers: [UserController],
      providers: [UserService],
    })
    .overrideGuard(AuthenticationGuard).useClass(MockAuthGuard)
    .compile();

    dataSource = module.get<DataSource>(DataSource);
    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    userController = module.get<UserController>(UserController);
    await testDatasetSeed(dataSource);
  });

  afterAll(async () => {
    await dataSource.destroy(); // Clean up the in-memory database
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  it('should create a user', async () => {
    const dto: CreateUserDto = {
      username: 'johnTestControllerCreate',
      email: 'johnTestControllerCreate@john.com',
      password: 'password123',
    };

    const result = await userController.create(dto);
    const createdUser = await userRepository.findOne({ where: { username: 'johnTestControllerCreate' } });

    expect(createdUser).toBeDefined();
    expect(createdUser?.username).toEqual(result.username);
    expect(createdUser).toBeInstanceOf(User);
  });

  it('should return all users', async () => {
    const result = await userController.findAll();
    expect(result.length).toBeGreaterThan(0);
  });

  it('should return a user by ID', async () => {
    const result = await userController.findOne(1);
    expect(result).toBeDefined();
    expect(result.id).toBe(1);
  });

  it('CanUpdateAUser', async () => {
    const payLoad: UpdateUserDto = {
        username: 'johnTestControllerCreateUpdated'
    }
    const currentUser = await userRepository.findOneBy({username: 'johnTestControllerCreate'});
    expect(currentUser).toBeInstanceOf(User);

    if(!(currentUser instanceof User)){
        throw error
    }

    const result = await userController.update(payLoad, currentUser.id);
    expect(result.username). toEqual('johnTestControllerCreateUpdated');
  });

  it('should delete a user by ID', async () => {
    await userController.remove(3);
    const deletedUser = await userRepository.findOne({ where: { id: 3 } });
    expect(deletedUser).toBeNull();
  });

});
