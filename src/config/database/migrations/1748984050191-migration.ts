import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748984050191 implements MigrationInterface {
  name = 'Migration1748984050191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" ADD "pb_url" character varying`,
    );
    await queryRunner.query(`ALTER TABLE "empresas" DROP COLUMN "logo_url"`);
    await queryRunner.query(
      `ALTER TABLE "empresas" ADD "logo_url" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "qt_usuarios" SET DEFAULT '4'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "qt_usuarios" SET DEFAULT '3'`,
    );
    await queryRunner.query(`ALTER TABLE "empresas" DROP COLUMN "logo_url"`);
    await queryRunner.query(
      `ALTER TABLE "empresas" ADD "logo_url" character varying(500)`,
    );
    await queryRunner.query(`ALTER TABLE "empresas" DROP COLUMN "pb_url"`);
  }
}
