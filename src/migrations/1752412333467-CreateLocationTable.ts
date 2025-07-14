import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateLocationTable1752412333467 implements MigrationInterface {
    name = 'CreateLocationTable1752412333467'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "point" geography(Point,4326) NOT NULL, "timestamp" TIMESTAMP NOT NULL DEFAULT now(), "userId" integer, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_ba94dcfa1b352b0495b55ac3e0" ON "location" USING GiST ("point") `);
        await queryRunner.query(`ALTER TABLE "location" ADD CONSTRAINT "FK_bdef5f9d46ef330ddca009a8596" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "location" DROP CONSTRAINT "FK_bdef5f9d46ef330ddca009a8596"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_ba94dcfa1b352b0495b55ac3e0"`);
        await queryRunner.query(`DROP TABLE "location"`);
    }

}
