import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLocationTable1752407937219 implements MigrationInterface {
    name = 'CreateLocationTable1752407937219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "email" text NOT NULL, "username" character varying(30) NOT NULL, "age" integer NOT NULL, "class" integer NOT NULL, "profileemoji" character varying(4), "comment" text, "love" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chatroom" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "user1_id" integer, "user2_id" integer, CONSTRAINT "PK_1e5ce0a999152e29952194d01ff" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" text NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "chat_id" integer, "sender_id" integer, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "chatroom" ADD CONSTRAINT "FK_6ad98e5ce7c98c10f479819a0a4" FOREIGN KEY ("user1_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chatroom" ADD CONSTRAINT "FK_1ae03781eca756da6ae773c8879" FOREIGN KEY ("user2_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_859ffc7f95098efb4d84d50c632" FOREIGN KEY ("chat_id") REFERENCES "chatroom"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_c0ab99d9dfc61172871277b52f6"`);
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_859ffc7f95098efb4d84d50c632"`);
        await queryRunner.query(`ALTER TABLE "chatroom" DROP CONSTRAINT "FK_1ae03781eca756da6ae773c8879"`);
        await queryRunner.query(`ALTER TABLE "chatroom" DROP CONSTRAINT "FK_6ad98e5ce7c98c10f479819a0a4"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "chatroom"`);
        await queryRunner.query(`DROP TABLE "users"`);
    }

}
