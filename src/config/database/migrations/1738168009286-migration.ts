import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738168009286 implements MigrationInterface {
  name = 'Migration1738168009286';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."funcionario_tipocontrato_enum" AS ENUM('CLT', 'PJ')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcionario" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "cpf" character varying(11) NOT NULL, "dataNascimento" date NOT NULL, "cargo" character varying(255) NOT NULL, "setor" character varying(255) NOT NULL, "tipoContrato" "public"."funcionario_tipocontrato_enum" NOT NULL, "salario" integer NOT NULL, "telefone" character varying(15), "informacoesSaude" character varying(255), "rua" character varying(255) NOT NULL, "numero" character varying(10) NOT NULL, "complemento" character varying(100), "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "estado" character varying(2) NOT NULL, "cep" character varying(10) NOT NULL, CONSTRAINT "UQ_a84346b7f338dec9a7eeae49935" UNIQUE ("cpf"), CONSTRAINT "PK_2c5d0c275b4f652fd5cb381655f" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "funcionario"`);
    await queryRunner.query(
      `DROP TYPE "public"."funcionario_tipocontrato_enum"`,
    );
  }
}
