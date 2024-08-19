import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPhoneToContact1724048710734 implements MigrationInterface {
    name = 'AddPhoneToContact1724048710734'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact\` ADD \`phone\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`contact\` DROP COLUMN \`phone\``);
    }

}
