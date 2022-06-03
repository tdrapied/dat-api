import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDetails1654182677927 implements MigrationInterface {
  name = 'addDetails1654182677927';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "detail" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" double precision NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_28de27ee9ae6103af88ab1b3c0c" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "detail"`);
  }
}
