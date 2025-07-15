import { MigrationInterface, QueryRunner } from "typeorm";

export class AddKakaoIdToUser1752564715659 implements MigrationInterface {
    name = 'AddKakaoIdToUser1752564715659'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "kakaoId" bigint`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_55196ba714fe2e96252301cc3dd" UNIQUE ("kakaoId")`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profileImage" text`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profileImage"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_55196ba714fe2e96252301cc3dd"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "kakaoId"`);
    }

}
