import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738440201546 implements MigrationInterface {
  name = 'Migration1738440201546';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."projetos_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projetos" ("id" SERIAL NOT NULL, "status" "public"."projetos_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "descricao" character varying(255) NOT NULL, "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "cno" character varying(12) NOT NULL, "empresaId" integer, CONSTRAINT "PK_fb6b6aed4b30e10b976fe8bdf5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."role_epi_logs_acao_enum" AS ENUM('ADICIONOU', 'REMOVEU')`,
    );
    await queryRunner.query(
      `CREATE TABLE "role_epi_logs" ("id" SERIAL NOT NULL, "acao" "public"."role_epi_logs_acao_enum" NOT NULL, "descricao" character varying NOT NULL, "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "funcaoId" integer, "epiId" integer, CONSTRAINT "PK_f0a5aa34642b7eed1ca05705239" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos" ADD CONSTRAINT "FK_b58e4c1de339356a987700c655d" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_epi_logs" ADD CONSTRAINT "FK_dc9e4aeb372dcae04a06b61581c" FOREIGN KEY ("funcaoId") REFERENCES "funcoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_epi_logs" ADD CONSTRAINT "FK_ba74cef5fbc7f24ef630c285843" FOREIGN KEY ("epiId") REFERENCES "epis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "role_epi_logs" DROP CONSTRAINT "FK_ba74cef5fbc7f24ef630c285843"`,
    );
    await queryRunner.query(
      `ALTER TABLE "role_epi_logs" DROP CONSTRAINT "FK_dc9e4aeb372dcae04a06b61581c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos" DROP CONSTRAINT "FK_b58e4c1de339356a987700c655d"`,
    );
    await queryRunner.query(`DROP TABLE "role_epi_logs"`);
    await queryRunner.query(`DROP TYPE "public"."role_epi_logs_acao_enum"`);
    await queryRunner.query(`DROP TABLE "projetos"`);
    await queryRunner.query(`DROP TYPE "public"."projetos_status_enum"`);
  }
}
