import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1723686055842 implements MigrationInterface {
    name = 'AddPasswordToUser1723686055842'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` ADD \`password\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`user\` DROP COLUMN \`password\``);
    }

}
