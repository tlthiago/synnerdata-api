import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737843580305 implements MigrationInterface {
  name = 'Migration1737843580305';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."filiais_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "filiais" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "cnpj" character varying(14) NOT NULL, "rua" character varying(255) NOT NULL, "numero" character varying(10) NOT NULL, "complemento" character varying(100), "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "estado" character varying(2) NOT NULL, "cep" character varying(10) NOT NULL, "data_fundacao" date, "telefone" character varying(20), "status" "public"."filiais_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "empresaId" integer, CONSTRAINT "UQ_69b849a883435ef28afc72a6a0c" UNIQUE ("cnpj"), CONSTRAINT "PK_9cc507f6ebfb9cdeca7f05044f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "filiais" ADD CONSTRAINT "FK_b07991eecd7f53eb639bc298eac" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "filiais" DROP CONSTRAINT "FK_b07991eecd7f53eb639bc298eac"`,
    );
    await queryRunner.query(`DROP TABLE "filiais"`);
    await queryRunner.query(`DROP TYPE "public"."filiais_status_enum"`);
  }
}
