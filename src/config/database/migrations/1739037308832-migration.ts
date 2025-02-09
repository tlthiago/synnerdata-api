import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739037308832 implements MigrationInterface {
  name = 'Migration1739037308832';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" RENAME COLUMN "criado_por" TO "criadoPorId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ADD CONSTRAINT "FK_5139a44e732d7600e93125c294d" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "empresas" DROP CONSTRAINT "FK_5139a44e732d7600e93125c294d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" RENAME COLUMN "criadoPorId" TO "criado_por"`,
    );
  }
}
