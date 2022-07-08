import { MigrationInterface, QueryRunner } from 'typeorm';

export class updateUser1657206792672 implements MigrationInterface {
  name = 'updateUser1657206792672';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "user_locations_location" ("userId" uuid NOT NULL, "locationId" uuid NOT NULL, CONSTRAINT "PK_74f842536fef41eeffaa70fa2f7" PRIMARY KEY ("userId", "locationId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_791fca420efe73aaa6e629253d" ON "user_locations_location" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_ec11acf591ae4054e8fc7a42d9" ON "user_locations_location" ("locationId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations_location" ADD CONSTRAINT "FK_791fca420efe73aaa6e629253df" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations_location" ADD CONSTRAINT "FK_ec11acf591ae4054e8fc7a42d9d" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_locations_location" DROP CONSTRAINT "FK_ec11acf591ae4054e8fc7a42d9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_locations_location" DROP CONSTRAINT "FK_791fca420efe73aaa6e629253df"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_ec11acf591ae4054e8fc7a42d9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_791fca420efe73aaa6e629253d"`,
    );
    await queryRunner.query(`DROP TABLE "user_locations_location"`);
  }
}
