import { DataSource } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Contact } from '../user/contact/entities/contact.entity';

export const testDatasetSeed = async (dataSource: DataSource) => {

  const userRepository = dataSource.getRepository(User);

  await userRepository.insert([
    {
        "id": 1,
        "username": "johnTest",
        "email": "doe@john.com",
        "password": "",
        "createdAt": new Date("2024-08-22T18:50:43.001Z"),
        "updatedAt":  new Date("2024-08-22T18:50:43.001Z"),
        "contacts": [
          {
            id: 9,
            firstName: "John Update 3",
            lastName: "Doe 2",
            email: "john.doe@example.com",
            phone: "+62876256378",
            address: "123 Main St, Springfield",
            postCode: "12345"
          }
          ] as Contact [],
    },
    {
        "id": 2,
        "username": "johnTest2", 
        "email": "doe2@john.com",
        "password": "",
        "createdAt": new Date("2024-08-22T18:50:43.001Z"),
        "updatedAt":  new Date("2024-08-22T18:50:43.001Z"),
        "contacts": [] as Contact[],
    }
  ]);

  console.log('Test data initiated');
};
