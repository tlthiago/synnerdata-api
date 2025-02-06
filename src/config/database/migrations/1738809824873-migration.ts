import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738809824873 implements MigrationInterface {
  name = 'Migration1738809824873';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."entregas_de_epis_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "entregas_de_epis" ("id" SERIAL NOT NULL, "status" "public"."entregas_de_epis_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data" TIMESTAMP WITH TIME ZONE NOT NULL, "motivo" character varying(255) NOT NULL, "entregue_por" character varying(255) NOT NULL, "funcionarioId" integer, CONSTRAINT "PK_0cc69811debcd4c43332a1210ec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."projetos_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projetos" ("id" SERIAL NOT NULL, "status" "public"."projetos_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "descricao" character varying(255) NOT NULL, "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "cno" character varying(12) NOT NULL, "empresaId" integer, CONSTRAINT "PK_fb6b6aed4b30e10b976fe8bdf5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."entregas_epis_logs_acao_enum" AS ENUM('REMOVEU', 'ADICIONOU')`,
    );
    await queryRunner.query(
      `CREATE TABLE "entregas_epis_logs" ("id" SERIAL NOT NULL, "acao" "public"."entregas_epis_logs_acao_enum" NOT NULL, "descricao" character varying NOT NULL, "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "entregaDeEpiId" integer, "epiId" integer, CONSTRAINT "PK_682e5f76e9269d81340364a724f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_projetos_logs_acao_enum" AS ENUM('ADICIONOU', 'REMOVEU')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcionarios_projetos_logs" ("id" SERIAL NOT NULL, "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "acao" "public"."funcionarios_projetos_logs_acao_enum" NOT NULL, "descricao" character varying NOT NULL, "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "projetoId" integer, "funcionarioId" integer, CONSTRAINT "PK_352175c674e09d7cffa8407088a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "entregas_epis" ("entregaId" integer NOT NULL, "epiId" integer NOT NULL, CONSTRAINT "PK_f193c324d593c815ccf4ef1c24f" PRIMARY KEY ("entregaId", "epiId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_91ad62a43fee57030eacb54251" ON "entregas_epis" ("entregaId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_570fcc24a6aaa8d9c3046b3718" ON "entregas_epis" ("epiId") `,
    );
    await queryRunner.query(
      `CREATE TABLE "projetos_funcionarios" ("projetoId" integer NOT NULL, "funcionarioId" integer NOT NULL, CONSTRAINT "PK_e35b5e2a6cbda1cbf4b604e98fd" PRIMARY KEY ("projetoId", "funcionarioId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_8663a86eeb5c14f3d3f54060a1" ON "projetos_funcionarios" ("projetoId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_168dd5769f24892016a56553b8" ON "projetos_funcionarios" ("funcionarioId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" ADD CONSTRAINT "FK_1b206ec9d4b3cf5a79a6a983fac" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos" ADD CONSTRAINT "FK_b58e4c1de339356a987700c655d" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_epis_logs" ADD CONSTRAINT "FK_d017341a46b238be7d59e398d9f" FOREIGN KEY ("entregaDeEpiId") REFERENCES "entregas_de_epis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_epis_logs" ADD CONSTRAINT "FK_9d76c093975bae79bc9d857d20c" FOREIGN KEY ("epiId") REFERENCES "epis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios_projetos_logs" ADD CONSTRAINT "FK_e075a42d6171b9759ee25294865" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios_projetos_logs" ADD CONSTRAINT "FK_617e59ddd046a09f851786eabc2" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_epis" ADD CONSTRAINT "FK_91ad62a43fee57030eacb542513" FOREIGN KEY ("entregaId") REFERENCES "entregas_de_epis"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_epis" ADD CONSTRAINT "FK_570fcc24a6aaa8d9c3046b3718e" FOREIGN KEY ("epiId") REFERENCES "epis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos_funcionarios" ADD CONSTRAINT "FK_8663a86eeb5c14f3d3f54060a19" FOREIGN KEY ("projetoId") REFERENCES "projetos"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos_funcionarios" ADD CONSTRAINT "FK_168dd5769f24892016a56553b84" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "projetos_funcionarios" DROP CONSTRAINT "FK_168dd5769f24892016a56553b84"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos_funcionarios" DROP CONSTRAINT "FK_8663a86eeb5c14f3d3f54060a19"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_epis" DROP CONSTRAINT "FK_570fcc24a6aaa8d9c3046b3718e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_epis" DROP CONSTRAINT "FK_91ad62a43fee57030eacb542513"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios_projetos_logs" DROP CONSTRAINT "FK_617e59ddd046a09f851786eabc2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios_projetos_logs" DROP CONSTRAINT "FK_e075a42d6171b9759ee25294865"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_epis_logs" DROP CONSTRAINT "FK_9d76c093975bae79bc9d857d20c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_epis_logs" DROP CONSTRAINT "FK_d017341a46b238be7d59e398d9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos" DROP CONSTRAINT "FK_b58e4c1de339356a987700c655d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" DROP CONSTRAINT "FK_1b206ec9d4b3cf5a79a6a983fac"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_168dd5769f24892016a56553b8"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_8663a86eeb5c14f3d3f54060a1"`,
    );
    await queryRunner.query(`DROP TABLE "projetos_funcionarios"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_570fcc24a6aaa8d9c3046b3718"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_91ad62a43fee57030eacb54251"`,
    );
    await queryRunner.query(`DROP TABLE "entregas_epis"`);
    await queryRunner.query(`DROP TABLE "funcionarios_projetos_logs"`);
    await queryRunner.query(
      `DROP TYPE "public"."funcionarios_projetos_logs_acao_enum"`,
    );
    await queryRunner.query(`DROP TABLE "entregas_epis_logs"`);
    await queryRunner.query(
      `DROP TYPE "public"."entregas_epis_logs_acao_enum"`,
    );
    await queryRunner.query(`DROP TABLE "projetos"`);
    await queryRunner.query(`DROP TYPE "public"."projetos_status_enum"`);
    await queryRunner.query(`DROP TABLE "entregas_de_epis"`);
    await queryRunner.query(
      `DROP TYPE "public"."entregas_de_epis_status_enum"`,
    );
  }
}
