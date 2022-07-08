import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateUser1657282203987 implements MigrationInterface {
  name = 'updateUser1657282203987';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_locations" ("userId" uuid NOT NULL, "locationId" uuid NOT NULL, CONSTRAINT "PK_e0f4177dd3c4bb2659a50ef3808" PRIMARY KEY ("userId", "locationId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_58343d9d63e326037f304fde3c" ON "user_locations" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a2532b78fb97c733436438030f" ON "user_locations" ("locationId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD CONSTRAINT "FK_58343d9d63e326037f304fde3c5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" ADD CONSTRAINT "FK_a2532b78fb97c733436438030f0" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP CONSTRAINT "FK_a2532b78fb97c733436438030f0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations" DROP CONSTRAINT "FK_58343d9d63e326037f304fde3c5"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a2532b78fb97c733436438030f"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_58343d9d63e326037f304fde3c"`,
    );
    await queryRunner.query(`DROP TABLE "user_locations"`);
  }
}
