import { MigrationInterface, QueryRunner } from 'typeorm';

export class addValidationCodes1657203852613 implements MigrationInterface {
  name = 'addValidationCodes1657203852613';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "validation_code" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "code" character varying NOT NULL, "type" "public"."validation_code_type_enum" NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "userId" uuid NOT NULL, CONSTRAINT "PK_fefcbba81f8a328e2e2927d5411" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "validation_code" ADD CONSTRAINT "FK_cdf4d9366bd60caf89a57abe521" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "validation_code" DROP CONSTRAINT "FK_cdf4d9366bd60caf89a57abe521"`,
    );
    await queryRunner.query(`DROP TABLE "validation_code"`);
  }
}
