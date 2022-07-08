import { MigrationInterface, QueryRunner } from 'typeorm';

export class addTemperatures1657286742078 implements MigrationInterface {
  name = 'addTemperatures1657286742078';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "humidity" DROP CONSTRAINT "FK_c13057c4428be86001829204753"`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."temperature_type_enum" AS ENUM('AIR', 'SOIL')`,
    );
    await queryRunner.query(
      `CREATE TABLE "temperature" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" double precision NOT NULL, "type" "public"."temperature_type_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "locationId" uuid NOT NULL, CONSTRAINT "PK_3b69dc45d57daf28f4b930eb4c9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "temperature" ADD CONSTRAINT "FK_290f758ca4eeb7574510a46ecd2" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "humidity" ADD CONSTRAINT "FK_f3eec2430e93561f193c4edf4be" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "humidity" DROP CONSTRAINT "FK_f3eec2430e93561f193c4edf4be"`,
    );
    await queryRunner.query(
      `ALTER TABLE "temperature" DROP CONSTRAINT "FK_290f758ca4eeb7574510a46ecd2"`,
    );
    await queryRunner.query(`DROP TABLE "temperature"`);
    await queryRunner.query(`DROP TYPE "public"."temperature_type_enum"`);
    await queryRunner.query(
      `ALTER TABLE "humidity" ADD CONSTRAINT "FK_c13057c4428be86001829204753" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
