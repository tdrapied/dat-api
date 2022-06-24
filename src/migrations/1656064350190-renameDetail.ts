import { MigrationInterface, QueryRunner } from 'typeorm';

export class renameDetail1656064350190 implements MigrationInterface {
  name = 'renameDetail1656064350190';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "detail" RENAME TO "humidity";`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "humidity" RENAME TO "detail";`);
  }
}
