import { MigrationInterface, QueryRunner } from 'typeorm';

export class addLocations1654262733428 implements MigrationInterface {
  name = 'addLocations1654262733428';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "location" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, CONSTRAINT "PK_876d7bdba03c72251ec4c2dc827" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "detail" ADD "locationId" uuid NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "detail" ADD CONSTRAINT "FK_c13057c4428be86001829204753" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "detail" DROP CONSTRAINT "FK_c13057c4428be86001829204753"`,
    );
    await queryRunner.query(`ALTER TABLE "detail" DROP COLUMN "locationId"`);
    await queryRunner.query(`DROP TABLE "location"`);
  }
}
