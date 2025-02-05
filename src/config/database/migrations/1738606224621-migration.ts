import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738606224621 implements MigrationInterface {
    name = 'Migration1738606224621'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."funcoes_status_enum" AS ENUM('A', 'I', 'E')`);
        await queryRunner.query(`CREATE TABLE "funcoes" ("id" SERIAL NOT NULL, "status" "public"."funcoes_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying NOT NULL, "empresaId" integer, CONSTRAINT "PK_48495eac66422a689003585fb88" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."role_epi_logs_acao_enum" AS ENUM('REMOVEU', 'ADICIONOU')`);
        await queryRunner.query(`CREATE TABLE "role_epi_logs" ("id" SERIAL NOT NULL, "acao" "public"."role_epi_logs_acao_enum" NOT NULL, "descricao" character varying NOT NULL, "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "funcaoId" integer, "epiId" integer, CONSTRAINT "PK_f0a5aa34642b7eed1ca05705239" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."funcionarios_status_enum" AS ENUM('Ativo', 'Demitido', 'Afastado', 'Em Férias', 'Férias Programada')`);
        await queryRunner.query(`CREATE TYPE "public"."funcionarios_regimecontratacao_enum" AS ENUM('CLT', 'PJ')`);
        await queryRunner.query(`CREATE TYPE "public"."funcionarios_grauinstrucao_enum" AS ENUM('Fundamental', 'Médio', 'Superior', 'Pós-Graduação', 'Mestrado', 'Doutorado')`);
        await queryRunner.query(`CREATE TABLE "funcionarios" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "status" "public"."funcionarios_status_enum" NOT NULL, "funcao" character varying(255) NOT NULL, "setor" character varying(255) NOT NULL, "razao" character varying(255) NOT NULL, "cnpjContratacao" character varying(18) NOT NULL, "regimeContratacao" "public"."funcionarios_regimecontratacao_enum" NOT NULL, "dataAdmissao" date, "salario" numeric(10,2) NOT NULL, "ctpsSerie" character varying(50) NOT NULL, "cpf" character varying(11) NOT NULL, "dataUltimoASO" date, "dataExameDemissional" date, "vencimentoPrazo1Experiencia" date NOT NULL, "vencimentoPrazo2Experiencia" date NOT NULL, "centroCusto" character varying(255) NOT NULL, "grauInstrucao" "public"."funcionarios_grauinstrucao_enum" NOT NULL, "necessidadesEspeciais" boolean NOT NULL, "tipoDeficiencia" character varying(255), "sexo" character varying(10) NOT NULL, "dataNascimento" date NOT NULL, "estadoCivil" character varying(255) NOT NULL, "processoJudicial" boolean NOT NULL, "gestor" character varying(255) NOT NULL, "cbo" character varying(255) NOT NULL, "cep" character varying(10) NOT NULL, "rua" character varying(255) NOT NULL, "numero" character varying(10) NOT NULL, "complemento" character varying(100), "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "estado" character varying(2) NOT NULL, "criadoPor" integer NOT NULL, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a6ee7c0e30d968db531ad073337" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "funcoes_epis" ("funcaoId" integer NOT NULL, "epiId" integer NOT NULL, CONSTRAINT "PK_f5259dd3943682a7adc90f2444f" PRIMARY KEY ("funcaoId", "epiId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_a38bc15b5ff546a5940e3fc941" ON "funcoes_epis" ("funcaoId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c4b784941b4b248a95411b94f9" ON "funcoes_epis" ("epiId") `);
        await queryRunner.query(`ALTER TABLE "funcoes" ADD CONSTRAINT "FK_fed4986873998e1fa9736ccb59b" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_epi_logs" ADD CONSTRAINT "FK_dc9e4aeb372dcae04a06b61581c" FOREIGN KEY ("funcaoId") REFERENCES "funcoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "role_epi_logs" ADD CONSTRAINT "FK_ba74cef5fbc7f24ef630c285843" FOREIGN KEY ("epiId") REFERENCES "epis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "funcoes_epis" ADD CONSTRAINT "FK_a38bc15b5ff546a5940e3fc9416" FOREIGN KEY ("funcaoId") REFERENCES "funcoes"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "funcoes_epis" ADD CONSTRAINT "FK_c4b784941b4b248a95411b94f9b" FOREIGN KEY ("epiId") REFERENCES "epis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funcoes_epis" DROP CONSTRAINT "FK_c4b784941b4b248a95411b94f9b"`);
        await queryRunner.query(`ALTER TABLE "funcoes_epis" DROP CONSTRAINT "FK_a38bc15b5ff546a5940e3fc9416"`);
        await queryRunner.query(`ALTER TABLE "role_epi_logs" DROP CONSTRAINT "FK_ba74cef5fbc7f24ef630c285843"`);
        await queryRunner.query(`ALTER TABLE "role_epi_logs" DROP CONSTRAINT "FK_dc9e4aeb372dcae04a06b61581c"`);
        await queryRunner.query(`ALTER TABLE "funcoes" DROP CONSTRAINT "FK_fed4986873998e1fa9736ccb59b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c4b784941b4b248a95411b94f9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a38bc15b5ff546a5940e3fc941"`);
        await queryRunner.query(`DROP TABLE "funcoes_epis"`);
        await queryRunner.query(`DROP TABLE "funcionarios"`);
        await queryRunner.query(`DROP TYPE "public"."funcionarios_grauinstrucao_enum"`);
        await queryRunner.query(`DROP TYPE "public"."funcionarios_regimecontratacao_enum"`);
        await queryRunner.query(`DROP TYPE "public"."funcionarios_status_enum"`);
        await queryRunner.query(`DROP TABLE "role_epi_logs"`);
        await queryRunner.query(`DROP TYPE "public"."role_epi_logs_acao_enum"`);
        await queryRunner.query(`DROP TABLE "funcoes"`);
        await queryRunner.query(`DROP TYPE "public"."funcoes_status_enum"`);
    }

}
