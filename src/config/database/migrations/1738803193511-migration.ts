import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738803193511 implements MigrationInterface {
  name = 'Migration1738803193511';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."faltas_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "faltas" ("id" SERIAL NOT NULL, "status" "public"."faltas_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data" TIMESTAMP WITH TIME ZONE NOT NULL, "motivo" character varying(255) NOT NULL, "funcionarioId" integer, CONSTRAINT "PK_f5990e028829287d55315bd6ed2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."atestados_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "atestados" ("id" SERIAL NOT NULL, "status" "public"."atestados_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "data_fim" TIMESTAMP WITH TIME ZONE NOT NULL, "motivo" character varying(255) NOT NULL, "funcionarioId" integer, CONSTRAINT "PK_47af221bfabcbbc7075f3a09e64" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."filiais_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "filiais" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "cnpj" character varying(14) NOT NULL, "rua" character varying(255) NOT NULL, "numero" character varying(10) NOT NULL, "complemento" character varying(100), "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "estado" character varying(2) NOT NULL, "cep" character varying(10) NOT NULL, "data_fundacao" date, "telefone" character varying(20), "status" "public"."filiais_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "empresaId" integer, CONSTRAINT "UQ_69b849a883435ef28afc72a6a0c" UNIQUE ("cnpj"), CONSTRAINT "PK_9cc507f6ebfb9cdeca7f05044f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."setores_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "setores" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "status" "public"."setores_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "empresaId" integer, CONSTRAINT "PK_85908551895de8d968532c35d07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."centros_de_custo_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "centros_de_custo" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "status" "public"."centros_de_custo_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "empresaId" integer, CONSTRAINT "PK_1e81867ce2846ef8683cd57070e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cbos_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cbos" ("id" SERIAL NOT NULL, "status" "public"."cbos_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "empresaId" integer, CONSTRAINT "PK_f04e510d8386ef479ba0188809d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."epis_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "epis" ("id" SERIAL NOT NULL, "status" "public"."epis_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "descricao" character varying(255) NOT NULL, "equipamentos" character varying(255) NOT NULL, "empresaId" integer, CONSTRAINT "PK_470f0275b622d24454cf42f6e99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."empresas_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "empresas" ("id" SERIAL NOT NULL, "nome_fantasia" character varying(255) NOT NULL, "razao_social" character varying(255) NOT NULL, "cnpj" character varying(14) NOT NULL, "rua" character varying(255) NOT NULL, "numero" character varying(10) NOT NULL, "complemento" character varying(100), "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "estado" character varying(2) NOT NULL, "cep" character varying(10) NOT NULL, "data_fundacao" date NOT NULL, "telefone" character varying(20) NOT NULL, "faturamento" numeric(15,2) NOT NULL, "regime_tributario" character varying(50) NOT NULL, "inscricao_estadual" character varying(50) NOT NULL, "cnae_principal" character varying(50) NOT NULL, "segmento" character varying(100) NOT NULL, "ramo_atuacao" character varying(100) NOT NULL, "logo_url" character varying(500), "status" "public"."empresas_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_f5ed71aeb4ef47f95df5f8830b8" UNIQUE ("cnpj"), CONSTRAINT "PK_ce7b122b37c6499bfd6520873e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcoes_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcoes" ("id" SERIAL NOT NULL, "status" "public"."funcoes_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying NOT NULL, "empresaId" integer, CONSTRAINT "PK_48495eac66422a689003585fb88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."promocoes_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "promocoes" ("id" SERIAL NOT NULL, "status" "public"."promocoes_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "salario" TIMESTAMP WITH TIME ZONE NOT NULL, "data" TIMESTAMP WITH TIME ZONE NOT NULL, "funcaoId" integer, "funcionarioId" integer, CONSTRAINT "PK_71c26f436e5727cf140cd8a095e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."demissoes_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "demissoes" ("id" SERIAL NOT NULL, "status" "public"."demissoes_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data" TIMESTAMP WITH TIME ZONE NOT NULL, "motivo_interno" character varying(255) NOT NULL, "motivo_trabalhista" character varying(255) NOT NULL, "acao_trabalhista" character varying(255) NOT NULL, "forma_demissao" character varying(255) NOT NULL, "funcionarioId" integer, CONSTRAINT "PK_5b29022a7f9c3e19a579ade42fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."analise_de_cpf_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "analise_de_cpf" ("id" SERIAL NOT NULL, "status" "public"."analise_de_cpf_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "descricao" character varying(255) NOT NULL, "funcionarioId" integer, CONSTRAINT "PK_b75858c5ee8e4d17dd4a97967eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."acidentes_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "acidentes" ("id" SERIAL NOT NULL, "status" "public"."acidentes_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "descricao" character varying(255) NOT NULL, "data" TIMESTAMP WITH TIME ZONE NOT NULL, "natureza" character varying(255) NOT NULL, "cat" character varying(15) NOT NULL, "medidasTomadas" character varying(255) NOT NULL, "funcionarioId" integer, CONSTRAINT "PK_69d71abea5206c911e07ce91335" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."acoes_trabalhistas_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "acoes_trabalhistas" ("id" SERIAL NOT NULL, "status" "public"."acoes_trabalhistas_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "numero_processo" character varying NOT NULL, "tribunal" character varying NOT NULL, "data_ajuizamento" TIMESTAMP WITH TIME ZONE NOT NULL, "reclamante" character varying NOT NULL, "reclamado" character varying NOT NULL, "advogado_reclamante" character varying, "advogado_reclamado" character varying, "descricao" text NOT NULL, "valor_causa" numeric, "andamento" character varying, "decisao" text, "data_conclusao" TIMESTAMP WITH TIME ZONE, "recursos" text, "custas_despesas" numeric, "data_conhecimento" TIMESTAMP WITH TIME ZONE NOT NULL, "funcionarioId" integer, CONSTRAINT "PK_41014cd4224847fd66b43fe5cfd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ferias_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ferias" ("id" SERIAL NOT NULL, "status" "public"."ferias_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "data_fim" TIMESTAMP WITH TIME ZONE NOT NULL, "funcionarioId" integer, CONSTRAINT "PK_15aaf56d0233a1f69ebb6dc1502" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionario_regimecontratacao_enum" AS ENUM('CLT', 'PJ')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionario_grauinstrucao_enum" AS ENUM('Fundamental', 'Médio', 'Superior', 'Pós-Graduação', 'Mestrado', 'Doutorado')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionario_status_enum" AS ENUM('A', 'D', 'F', 'AF', 'FP')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcionario" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "funcao" character varying(255) NOT NULL, "setor" character varying(255) NOT NULL, "razao" character varying(255) NOT NULL, "cnpjContratacao" character varying(18) NOT NULL, "regimeContratacao" "public"."funcionario_regimecontratacao_enum" NOT NULL, "dataAdmissao" date, "salario" numeric(10,2) NOT NULL, "ctpsSerie" character varying(50) NOT NULL, "cpf" character varying(11) NOT NULL, "dataUltimoASO" date, "dataExameDemissional" date, "vencimentoPrazo1Experiencia" date NOT NULL, "vencimentoPrazo2Experiencia" date NOT NULL, "centroCusto" character varying(255) NOT NULL, "grauInstrucao" "public"."funcionario_grauinstrucao_enum" NOT NULL, "necessidadesEspeciais" boolean NOT NULL, "tipoDeficiencia" character varying(255), "sexo" character varying(10) NOT NULL, "dataNascimento" date NOT NULL, "estadoCivil" character varying(255) NOT NULL, "processoJudicial" boolean NOT NULL, "gestor" character varying(255) NOT NULL, "cbo" character varying(255) NOT NULL, "cep" character varying(10) NOT NULL, "rua" character varying(255) NOT NULL, "numero" character varying(10) NOT NULL, "complemento" character varying(100), "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "estado" character varying(2) NOT NULL, "criadoPor" integer NOT NULL, "criadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizadoEm" TIMESTAMP NOT NULL DEFAULT now(), "atualizado_por" integer, "status" "public"."funcionario_status_enum" NOT NULL DEFAULT 'A', "empresaId" integer, CONSTRAINT "PK_2c5d0c275b4f652fd5cb381655f" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."advertencias_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "advertencias" ("id" SERIAL NOT NULL, "status" "public"."advertencias_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data" TIMESTAMP WITH TIME ZONE NOT NULL, "motivo" character varying(255) NOT NULL, "funcionarioId" integer, CONSTRAINT "PK_daf66cb2e71e4926957c7d74b79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."usuarios_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "funcao" character varying NOT NULL, "status" "public"."usuarios_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcao_epi_logs_acao_enum" AS ENUM('REMOVEU', 'ADICIONOU')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcao_epi_logs" ("id" SERIAL NOT NULL, "acao" "public"."funcao_epi_logs_acao_enum" NOT NULL, "descricao" character varying NOT NULL, "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "funcaoId" integer, "epiId" integer, CONSTRAINT "PK_9ccde2cb971be53184066677c37" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcoes_epis" ("funcaoId" integer NOT NULL, "epiId" integer NOT NULL, CONSTRAINT "PK_f5259dd3943682a7adc90f2444f" PRIMARY KEY ("funcaoId", "epiId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a38bc15b5ff546a5940e3fc941" ON "funcoes_epis" ("funcaoId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4b784941b4b248a95411b94f9" ON "funcoes_epis" ("epiId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "faltas" ADD CONSTRAINT "FK_f1bc437430509d59102ebbdf011" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" ADD CONSTRAINT "FK_2ff24f400261f385e385e7e9c9d" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "filiais" ADD CONSTRAINT "FK_b07991eecd7f53eb639bc298eac" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores" ADD CONSTRAINT "FK_32e02144bde7c8b0b6a52393a4c" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_de_custo" ADD CONSTRAINT "FK_aef4b7874ab522b056857509a22" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cbos" ADD CONSTRAINT "FK_36d8e5d56f741c4063f944224f2" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "epis" ADD CONSTRAINT "FK_8a244538721e9d5cc4251328c68" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes" ADD CONSTRAINT "FK_fed4986873998e1fa9736ccb59b" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" ADD CONSTRAINT "FK_5d1edcf14cfb23f2025aec7c246" FOREIGN KEY ("funcaoId") REFERENCES "funcoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" ADD CONSTRAINT "FK_62c7165b5611d68710aa72cf899" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "demissoes" ADD CONSTRAINT "FK_1259488a34ce786ad661b75e428" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "analise_de_cpf" ADD CONSTRAINT "FK_fe6571e99015f807165414251fd" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acidentes" ADD CONSTRAINT "FK_4806a9ce0ad4b5e77b478a004e8" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD CONSTRAINT "FK_18d74f5686cfdfbdb2711063dde" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ferias" ADD CONSTRAINT "FK_1cd0290a6fac5c7463478647a9f" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionario" ADD CONSTRAINT "FK_a2a616862df841a81cb92f07b8c" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertencias" ADD CONSTRAINT "FK_6b87a6021d5a34ee1cc4151f5d8" FOREIGN KEY ("funcionarioId") REFERENCES "funcionario"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcao_epi_logs" ADD CONSTRAINT "FK_4083feed2e23a0f569a3ddba9f1" FOREIGN KEY ("funcaoId") REFERENCES "funcoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcao_epi_logs" ADD CONSTRAINT "FK_67e42f8b4695f6fefbbce92aaec" FOREIGN KEY ("epiId") REFERENCES "epis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes_epis" ADD CONSTRAINT "FK_a38bc15b5ff546a5940e3fc9416" FOREIGN KEY ("funcaoId") REFERENCES "funcoes"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes_epis" ADD CONSTRAINT "FK_c4b784941b4b248a95411b94f9b" FOREIGN KEY ("epiId") REFERENCES "epis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funcoes_epis" DROP CONSTRAINT "FK_c4b784941b4b248a95411b94f9b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes_epis" DROP CONSTRAINT "FK_a38bc15b5ff546a5940e3fc9416"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcao_epi_logs" DROP CONSTRAINT "FK_67e42f8b4695f6fefbbce92aaec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcao_epi_logs" DROP CONSTRAINT "FK_4083feed2e23a0f569a3ddba9f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertencias" DROP CONSTRAINT "FK_6b87a6021d5a34ee1cc4151f5d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionario" DROP CONSTRAINT "FK_a2a616862df841a81cb92f07b8c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ferias" DROP CONSTRAINT "FK_1cd0290a6fac5c7463478647a9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP CONSTRAINT "FK_18d74f5686cfdfbdb2711063dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acidentes" DROP CONSTRAINT "FK_4806a9ce0ad4b5e77b478a004e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "analise_de_cpf" DROP CONSTRAINT "FK_fe6571e99015f807165414251fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "demissoes" DROP CONSTRAINT "FK_1259488a34ce786ad661b75e428"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" DROP CONSTRAINT "FK_62c7165b5611d68710aa72cf899"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" DROP CONSTRAINT "FK_5d1edcf14cfb23f2025aec7c246"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes" DROP CONSTRAINT "FK_fed4986873998e1fa9736ccb59b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "epis" DROP CONSTRAINT "FK_8a244538721e9d5cc4251328c68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cbos" DROP CONSTRAINT "FK_36d8e5d56f741c4063f944224f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_de_custo" DROP CONSTRAINT "FK_aef4b7874ab522b056857509a22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores" DROP CONSTRAINT "FK_32e02144bde7c8b0b6a52393a4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "filiais" DROP CONSTRAINT "FK_b07991eecd7f53eb639bc298eac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" DROP CONSTRAINT "FK_2ff24f400261f385e385e7e9c9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "faltas" DROP CONSTRAINT "FK_f1bc437430509d59102ebbdf011"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_db5d996dbb53c00ad22cfbbe94"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_68fb2a23dcae44036e38bd27cf"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_11f25d3bab1417e2e650596de7"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9f5e0fc59d3b163736489c1ada"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c4b784941b4b248a95411b94f9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a38bc15b5ff546a5940e3fc941"`,
    );
    await queryRunner.query(`DROP TABLE "funcoes_epis"`);
    await queryRunner.query(`DROP TABLE "funcao_epi_logs"`);
    await queryRunner.query(`DROP TYPE "public"."funcao_epi_logs_acao_enum"`);
    await queryRunner.query(`DROP TABLE "usuarios"`);
    await queryRunner.query(`DROP TYPE "public"."usuarios_status_enum"`);
    await queryRunner.query(`DROP TABLE "advertencias"`);
    await queryRunner.query(`DROP TYPE "public"."advertencias_status_enum"`);
    await queryRunner.query(`DROP TABLE "funcionario"`);
    await queryRunner.query(`DROP TYPE "public"."funcionario_status_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."funcionario_grauinstrucao_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."funcionario_regimecontratacao_enum"`,
    );
    await queryRunner.query(`DROP TABLE "ferias"`);
    await queryRunner.query(`DROP TYPE "public"."ferias_status_enum"`);
    await queryRunner.query(`DROP TABLE "acoes_trabalhistas"`);
    await queryRunner.query(
      `DROP TYPE "public"."acoes_trabalhistas_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "acidentes"`);
    await queryRunner.query(`DROP TYPE "public"."acidentes_status_enum"`);
    await queryRunner.query(`DROP TABLE "analise_de_cpf"`);
    await queryRunner.query(`DROP TYPE "public"."analise_de_cpf_status_enum"`);
    await queryRunner.query(`DROP TABLE "demissoes"`);
    await queryRunner.query(`DROP TYPE "public"."demissoes_status_enum"`);
    await queryRunner.query(`DROP TABLE "promocoes"`);
    await queryRunner.query(`DROP TYPE "public"."promocoes_status_enum"`);
    await queryRunner.query(`DROP TABLE "funcoes"`);
    await queryRunner.query(`DROP TYPE "public"."funcoes_status_enum"`);
    await queryRunner.query(`DROP TABLE "empresas"`);
    await queryRunner.query(`DROP TYPE "public"."empresas_status_enum"`);
    await queryRunner.query(`DROP TABLE "epis"`);
    await queryRunner.query(`DROP TYPE "public"."epis_status_enum"`);
    await queryRunner.query(`DROP TABLE "cbos"`);
    await queryRunner.query(`DROP TYPE "public"."cbos_status_enum"`);
    await queryRunner.query(`DROP TABLE "centros_de_custo"`);
    await queryRunner.query(
      `DROP TYPE "public"."centros_de_custo_status_enum"`,
    );
    await queryRunner.query(`DROP TABLE "setores"`);
    await queryRunner.query(`DROP TYPE "public"."setores_status_enum"`);
    await queryRunner.query(`DROP TABLE "filiais"`);
    await queryRunner.query(`DROP TYPE "public"."filiais_status_enum"`);
    await queryRunner.query(`DROP TABLE "atestados"`);
    await queryRunner.query(`DROP TYPE "public"."atestados_status_enum"`);
    await queryRunner.query(`DROP TABLE "faltas"`);
    await queryRunner.query(`DROP TYPE "public"."faltas_status_enum"`);
  }
}
