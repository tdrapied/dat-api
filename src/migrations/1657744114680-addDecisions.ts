import { MigrationInterface, QueryRunner } from 'typeorm';

export class addDecisions1657744114680 implements MigrationInterface {
  name = 'addDecisions1657744114680';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."decision_type_enum" AS ENUM('WATERING_VINES', 'COVER_VINES', 'TREAT_VINES', 'TYING_VINES', 'SAV_VINES')`,
    );
    await queryRunner.query(
      `CREATE TABLE "decision" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "value" double precision, "type" "public"."decision_type_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "locationId" uuid NOT NULL, CONSTRAINT "PK_fa4cbd6abf1215054f13c27df5a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "decision" ADD CONSTRAINT "FK_c0aa2893e1e4257f7ec77357604" FOREIGN KEY ("locationId") REFERENCES "location"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "decision" DROP CONSTRAINT "FK_c0aa2893e1e4257f7ec77357604"`,
    );
    await queryRunner.query(`DROP TABLE "decision"`);
    await queryRunner.query(`DROP TYPE "public"."decision_type_enum"`);
  }
}
