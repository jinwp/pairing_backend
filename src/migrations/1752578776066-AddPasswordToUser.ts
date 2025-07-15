import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPasswordToUser1752578776066 implements MigrationInterface {
    name = 'AddPasswordToUser1752578776066'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "password" character varying(255)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "password"`);
    }

}
