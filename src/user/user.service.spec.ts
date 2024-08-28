import * as bcrypt from 'bcrypt';
import { DataSource, QueryFailedError, Repository } from "typeorm";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken, TypeOrmModule } from "@nestjs/typeorm";
import { Contact } from "../user/contact/entities/contact.entity";
import { dataSourceOptions } from '../test-utils/TypeORMSQLITETestingModule';
import { testDatasetSeed } from '../test-utils/testDataset.seed';
import { plainToClass } from 'class-transformer';
import { UserDto } from './dto/user.dto';

// Mock the bcrypt module
jest.mock('bcrypt');

describe('UserService', ()=> {
    let module: TestingModule;
    let userService: UserService;
    let userRepository: Repository<User>;
    let dataSource: DataSource;

    const mockUser = new User();
    mockUser.id = 1;
    mockUser.username = "john";
    mockUser.email = "doe@john.com";
    mockUser.password = "";
    mockUser.createdAt = new Date("2024-08-22T18:50:43.001Z");
    mockUser.updatedAt = new Date("2024-08-22T18:50:43.001Z");
    mockUser.contacts = [] as Contact[];

    beforeAll(async () => {
        module = await Test.createTestingModule({
        imports: [
            TypeOrmModule.forRoot(dataSourceOptions),
            TypeOrmModule.forFeature([User, Contact]), // Make sure both entities are included here
        ],
        providers: [UserService],
        }).compile();

        dataSource = module.get<DataSource>(DataSource);
        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
        await testDatasetSeed(dataSource);
    });

    beforeEach(async () => {
        // Seed the database with test data
    });

    it('canFindOneUserAndExcludePassword', async () => {
        // this if we want to mock the repository
        // jest.spyOn(userRepository, 'findOneBy').mockImplementation(() => Promise.resolve(mockUser));
        
        const user = await userService.findOne(1);

        expect(user).toEqual({
            id: 1,
            username: 'johnTest',
            email: 'doe@john.com',
            createdAt: new Date('2024-08-22T18:50:43.001Z'),
            updatedAt: new Date('2024-08-22T18:50:43.001Z'),
            contacts: undefined
        });

    });

    it('canFindOneAllUserAndRemovePassword', async () => {
        const users = await userService.findAll();
        
        const allUser = await userRepository.find(); // Get the user from repository
        
        const newResult = allUser.map((user) => {
            const {password, ...userWithoutPassword} = user;
            return userWithoutPassword;
        });

        expect(users).toEqual(newResult);
    });

    it('canCreateUser', async () => {
        const newUser = {
            "username": "johnNew",
            "email": "johnNew@john.com",
            "password": "@Password1234"
        };

        (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$gQxhplR/l/1PrdsQu8bHt.Kmod4LPD3pPlvv7uvZr9.hz.gN.kJd6');

        const userCreated = await userService.create(newUser);
        const expectedUserCreated = await userRepository.findOneBy({username: 'johnNew', email: 'johnNew@john.com'});

        expect(userCreated).toEqual(expectedUserCreated);
        expect(userCreated.password).toEqual('$2b$10$gQxhplR/l/1PrdsQu8bHt.Kmod4LPD3pPlvv7uvZr9.hz.gN.kJd6');

        try {
            await userService.create({
                username: "johnNew",
                email: "johnNew@john.com",
                password: "@Password1234"
            });
            // If no error is thrown, fail the test
            fail('Expected an HttpException to be thrown');
        } catch (error) {
            expect(error).toBeInstanceOf(QueryFailedError);
            expect(error.message).toContain('UNIQUE constraint failed');
        }
    });

    it('canUpdateAUser', async () => {
        const updatedPayload = {
            "username"  : "johnTestUpdated",
        }

        const result = await userService.update(1, updatedPayload);
        const updatedUserRepo = plainToClass(UserDto, await userRepository.findOneBy({id : 1})); 

        expect(result).toEqual(updatedUserRepo);

    });

    it('canFindUserBasedOnUsernameAndPassword', async () => {
        const username: string = 'johnTestUpdated';
        const userResult = await userService.findWithLogin(username);

        expect(userResult?.username).toEqual(username);
    });

    it('canDeleteUser', async () => {

        const newInsertedUser = await userRepository.insert([{
            id: 100,
            username: 'johnTestDelete',
            email: 'doeDelete@john.com',
            password: 'passwordDeleted',
            createdAt: new Date('2024-08-22T18:50:43.001Z'),
            updatedAt: new Date('2024-08-22T18:50:43.001Z')
        }]);

        const result = await userService.remove(100);

        expect(result).toEqual({
            id: undefined,
            username: 'johnTestDelete',
            password: 'passwordDeleted',
            email: 'doeDelete@john.com',
            createdAt: new Date('2024-08-22T18:50:43.001Z'),
            updatedAt: new Date('2024-08-22T18:50:43.001Z')
          });
    });

    afterAll(async () => {
        await dataSource.destroy(); // Clean up the in-memory database
    });
});