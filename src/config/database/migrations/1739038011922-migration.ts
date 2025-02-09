import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739038011922 implements MigrationInterface {
  name = 'Migration1739038011922';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" RENAME COLUMN "atualizado_por" TO "atualizadoPorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ADD CONSTRAINT "FK_95ca04571a44dfc16d2614f3437" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" DROP CONSTRAINT "FK_95ca04571a44dfc16d2614f3437"`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" RENAME COLUMN "atualizadoPorId" TO "atualizado_por"`,
    );
  }
}
