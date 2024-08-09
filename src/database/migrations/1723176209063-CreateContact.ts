import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateContact1723176209063 implements MigrationInterface {
    name = 'CreateContact1723176209063'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`contact\` (\`id\` int NOT NULL AUTO_INCREMENT, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NULL, \`email\` varchar(255) NOT NULL, \`address\` varchar(255) NOT NULL, \`postCode\` varchar(255) NULL, \`userId\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`contact\` ADD CONSTRAINT \`FK_e7e34fa8e409e9146f4729fd0cb\` FOREIGN KEY (\`userId\`) REFERENCES \`user\`(\`id\`) ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact\` DROP FOREIGN KEY \`FK_e7e34fa8e409e9146f4729fd0cb\``);
        await queryRunner.query(`DROP TABLE \`contact\``);
    }

}
