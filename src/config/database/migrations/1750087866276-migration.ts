import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1750087866276 implements MigrationInterface {
  name = 'Migration1750087866276';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "faturamento" TYPE numeric(10,2)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "faturamento" TYPE numeric(15,2)`,
    );
  }
}
