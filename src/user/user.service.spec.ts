import * as bcrypt from 'bcrypt';
import { Repository, UpdateResult } from "typeorm";
import { UserService } from "./user.service";
import { User } from "./entities/user.entity";
import { Test, TestingModule } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Contact } from "./contact/entities/contact.entity";

// Mock the bcrypt module
jest.mock('bcrypt');

describe('UserService', ()=> {
    let userService: UserService;
    let userRepository: Repository<User>;

    const mockUser = new User();
    mockUser.id = 14;
    mockUser.username = "john";
    mockUser.email = "doe@john.com";
    mockUser.password = "";
    mockUser.createdAt = new Date("2024-08-22T18:50:43.001Z");
    mockUser.updatedAt = new Date("2024-08-22T18:50:43.001Z");
    mockUser.contacts = [] as Contact[];

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
            UserService,
            {
              provide: getRepositoryToken(User),
              useClass: Repository, // or use a mock repository
            },
          ],
        }).compile();

        userService = module.get<UserService>(UserService);
        userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    });

    it('canFindOneUserAndExcludePassword', async () => {
        jest.spyOn(userRepository, 'findOneBy').mockImplementation(() => Promise.resolve(mockUser));
        const user = await userService.findOne(14);
        const { password, ...resultWithoutPassword } = mockUser;

        expect(user).toEqual(resultWithoutPassword);

    });

    it('canFindOneAllUserAndRemovePassword', async () => {
        const result = [
            {
                "id": 14,
                "username": "john",
                "email": "doe@john.com",
                "password": "",
                "createdAt": new Date("2024-08-22T18:50:43.001Z"),
                "updatedAt":  new Date("2024-08-22T18:50:43.001Z"),
                "contacts": [] as Contact[],
            },
            {
                "id": 15,
                "username": "john2",
                "email": "doe2@john.com",
                "password": "",
                "createdAt": new Date("2024-08-22T18:50:43.001Z"),
                "updatedAt":  new Date("2024-08-22T18:50:43.001Z"),
                "contacts": [] as Contact[],
            }
        ]
        

        jest.spyOn(userRepository, 'find').mockImplementation(() => Promise.resolve(result));
        const users = await userService.findAll();
        const newResult = users.map((user) => {
            const {password, ...userWithoutPassword} = user;
            return userWithoutPassword;
        })

        expect(users).toEqual(newResult);

    });

    it('canCreateUser', async () => {
        const newUser = {
            "username": "john2",
            "email": "doe2@john.com",
            "password": "@Password1234"
        };

        const newCreatedUser = {
            "username": "john2",
            "password": "$2b$10$gQxhplR/l/1PrdsQu8bHt.Kmod4LPD3pPlvv7uvZr9.hz.gN.kJd6",
            "email": "doe2@john.com",
            "id": 14,
            "createdAt": new Date("2024-08-22T18:50:43.001Z"),
            "updatedAt": new Date("2024-08-22T18:50:4s3.001Z"),
            "contacts": [] as Contact[],
        };

        (bcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$gQxhplR/l/1PrdsQu8bHt.Kmod4LPD3pPlvv7uvZr9.hz.gN.kJd6');

        // Mock userRepository.create to return the new user entity directly
        jest.spyOn(userRepository, 'create').mockImplementation(() => newCreatedUser);
        jest.spyOn(userRepository, 'save').mockResolvedValue(newCreatedUser);

        const userCreated = await userService.create(newUser);

        expect(userCreated).toEqual(newCreatedUser);
        expect(userCreated.password).toEqual('$2b$10$gQxhplR/l/1PrdsQu8bHt.Kmod4LPD3pPlvv7uvZr9.hz.gN.kJd6');
        
    });

    it('canUpdateAUser', async () => {
        const updatedPayload = {
            "username"  : "john2",
            "email"     : "doe2@john.com"
        }

        // Create a mock UpdateResult
        const mockUpdateResult: UpdateResult = {
            generatedMaps: [],
            raw: {}, // raw can be any type, depending on your query
            affected: 1, // optional, represents the number of rows affected by the update
        };
        const updatedUser =  { ...mockUser };

        updatedUser.username = updatedPayload.username;
        updatedUser.email = updatedPayload.email;

        jest.spyOn(userRepository, 'update').mockResolvedValue(Promise.resolve(mockUpdateResult));

        jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(updatedUser);

        const result = await userService.update(14, updatedPayload);

        expect(result).toEqual(updatedUser);

    });

    it('canFindUserBasedOnUsernameAndPassword', async () => {
        const username: string = 'john';
        const user = {...mockUser};

        jest.spyOn(userRepository, 'findOneBy').mockResolvedValue(Promise.resolve(user));

        const userResult = await userService.findWithLogin(username);

        expect(userResult).toEqual(user);

    });
});