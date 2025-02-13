import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739405757985 implements MigrationInterface {
  name = 'Migration1739405757985';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_status_funcionario_enum" AS ENUM('ATIVO', 'DEMITIDO', 'AFASTADO', 'EM_FERIAS', 'FERIAS_PROGRAMADA')`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD "status_funcionario" "public"."funcionarios_status_funcionario_enum" NOT NULL DEFAULT 'ATIVO'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP COLUMN "status_funcionario"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."funcionarios_status_funcionario_enum"`,
    );
  }
}
