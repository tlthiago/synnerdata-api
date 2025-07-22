import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753197373894 implements MigrationInterface {
  name = 'Migration1753197373894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" ADD "qt_funcionarios" integer NOT NULL DEFAULT '10'`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ADD "plano" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "empresas" DROP COLUMN "plano"`);
    await queryRunner.query(
      `ALTER TABLE "empresas" DROP COLUMN "qt_funcionarios"`,
    );
  }
}
