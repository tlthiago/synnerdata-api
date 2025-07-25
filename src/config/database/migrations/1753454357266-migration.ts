import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753454357266 implements MigrationInterface {
  name = 'Migration1753454357266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "atestados" ADD "cid" character varying(10)`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD "data_exame_admissional" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD "filhos_abaixo_de_21" boolean`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD "valor_alimentacao" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD "valor_transporte" numeric(10,2) NOT NULL DEFAULT '0'`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "UQ_a0de321e9da6c025e7fc92f0bd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ALTER COLUMN "nome_pai" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ALTER COLUMN "nome_pai" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "UQ_a0de321e9da6c025e7fc92f0bd8" UNIQUE ("cpf")`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP COLUMN "valor_transporte"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP COLUMN "valor_alimentacao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP COLUMN "filhos_abaixo_de_21"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP COLUMN "data_exame_admissional"`,
    );
    await queryRunner.query(`ALTER TABLE "atestados" DROP COLUMN "cid"`);
  }
}
