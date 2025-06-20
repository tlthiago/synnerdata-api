import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1750422685889 implements MigrationInterface {
  name = 'Migration1750422685889';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "rua" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "numero" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "bairro" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "cidade" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "estado" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "cep" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "cep" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "estado" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "cidade" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "bairro" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "numero" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ALTER COLUMN "rua" SET NOT NULL`,
    );
  }
}
