import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739376647444 implements MigrationInterface {
  name = 'Migration1739376647444';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."usuarios_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "funcao" character varying NOT NULL, "status" "public"."usuarios_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."faltas_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "faltas" ("id" SERIAL NOT NULL, "status" "public"."faltas_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data" TIMESTAMP WITH TIME ZONE NOT NULL, "motivo" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcionarioId" integer, CONSTRAINT "PK_f5990e028829287d55315bd6ed2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."atestados_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "atestados" ("id" SERIAL NOT NULL, "status" "public"."atestados_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "data_fim" TIMESTAMP WITH TIME ZONE NOT NULL, "motivo" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcionarioId" integer, CONSTRAINT "PK_47af221bfabcbbc7075f3a09e64" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."filiais_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "filiais" ("id" SERIAL NOT NULL, "status" "public"."filiais_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "cnpj" character varying(14) NOT NULL, "rua" character varying(255) NOT NULL, "numero" character varying(10) NOT NULL, "complemento" character varying(100), "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "estado" character varying(2) NOT NULL, "cep" character varying(10) NOT NULL, "data_fundacao" date, "telefone" character varying(20), "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "empresaId" integer, CONSTRAINT "UQ_69b849a883435ef28afc72a6a0c" UNIQUE ("cnpj"), CONSTRAINT "PK_9cc507f6ebfb9cdeca7f05044f5" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."setores_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "setores" ("id" SERIAL NOT NULL, "status" "public"."setores_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "empresaId" integer, CONSTRAINT "PK_85908551895de8d968532c35d07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."centros_de_custo_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "centros_de_custo" ("id" SERIAL NOT NULL, "status" "public"."centros_de_custo_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "empresaId" integer, CONSTRAINT "PK_1e81867ce2846ef8683cd57070e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."cbos_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cbos" ("id" SERIAL NOT NULL, "status" "public"."cbos_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "empresaId" integer, CONSTRAINT "PK_f04e510d8386ef479ba0188809d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."entregas_de_epis_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "entregas_de_epis" ("id" SERIAL NOT NULL, "status" "public"."entregas_de_epis_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data" TIMESTAMP WITH TIME ZONE NOT NULL, "motivo" character varying(255) NOT NULL, "entregue_por" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcionarioId" integer, CONSTRAINT "PK_0cc69811debcd4c43332a1210ec" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."epis_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "epis" ("id" SERIAL NOT NULL, "status" "public"."epis_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "descricao" character varying(255) NOT NULL, "equipamentos" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "empresaId" integer, CONSTRAINT "PK_470f0275b622d24454cf42f6e99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."projetos_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "projetos" ("id" SERIAL NOT NULL, "status" "public"."projetos_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "descricao" character varying(255) NOT NULL, "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "cno" character varying(12) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "empresaId" integer, CONSTRAINT "PK_fb6b6aed4b30e10b976fe8bdf5b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."empresas_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "empresas" ("id" SERIAL NOT NULL, "status" "public"."empresas_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome_fantasia" character varying(255) NOT NULL, "razao_social" character varying(255) NOT NULL, "cnpj" character varying(14) NOT NULL, "rua" character varying(255) NOT NULL, "numero" character varying(10) NOT NULL, "complemento" character varying(100), "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "estado" character varying(2) NOT NULL, "cep" character varying(10) NOT NULL, "data_fundacao" date NOT NULL, "telefone" character varying(20) NOT NULL, "faturamento" numeric(15,2) NOT NULL, "regime_tributario" character varying(50) NOT NULL, "inscricao_estadual" character varying(50) NOT NULL, "cnae_principal" character varying(50) NOT NULL, "segmento" character varying(100) NOT NULL, "ramo_atuacao" character varying(100) NOT NULL, "logo_url" character varying(500), "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, CONSTRAINT "UQ_f5ed71aeb4ef47f95df5f8830b8" UNIQUE ("cnpj"), CONSTRAINT "PK_ce7b122b37c6499bfd6520873e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcoes_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcoes" ("id" SERIAL NOT NULL, "status" "public"."funcoes_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "empresaId" integer, CONSTRAINT "PK_48495eac66422a689003585fb88" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."promocoes_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "promocoes" ("id" SERIAL NOT NULL, "status" "public"."promocoes_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "salario" TIMESTAMP WITH TIME ZONE NOT NULL, "data" TIMESTAMP WITH TIME ZONE NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcaoId" integer, "funcionarioId" integer, CONSTRAINT "PK_71c26f436e5727cf140cd8a095e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."demissoes_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "demissoes" ("id" SERIAL NOT NULL, "status" "public"."demissoes_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data" TIMESTAMP WITH TIME ZONE NOT NULL, "motivo_interno" character varying(255) NOT NULL, "motivo_trabalhista" character varying(255) NOT NULL, "acao_trabalhista" character varying(255) NOT NULL, "forma_demissao" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcionarioId" integer, CONSTRAINT "PK_5b29022a7f9c3e19a579ade42fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."analise_de_cpf_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "analise_de_cpf" ("id" SERIAL NOT NULL, "status" "public"."analise_de_cpf_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "descricao" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcionarioId" integer, CONSTRAINT "PK_b75858c5ee8e4d17dd4a97967eb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."acidentes_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "acidentes" ("id" SERIAL NOT NULL, "status" "public"."acidentes_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "descricao" character varying(255) NOT NULL, "data" TIMESTAMP WITH TIME ZONE NOT NULL, "natureza" character varying(255) NOT NULL, "cat" character varying(15) NOT NULL, "medidasTomadas" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcionarioId" integer, CONSTRAINT "PK_69d71abea5206c911e07ce91335" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."acoes_trabalhistas_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "acoes_trabalhistas" ("id" SERIAL NOT NULL, "status" "public"."acoes_trabalhistas_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "numero_processo" character varying NOT NULL, "tribunal" character varying NOT NULL, "data_ajuizamento" TIMESTAMP WITH TIME ZONE NOT NULL, "reclamante" character varying NOT NULL, "reclamado" character varying NOT NULL, "advogado_reclamante" character varying, "advogado_reclamado" character varying, "descricao" text NOT NULL, "valor_causa" numeric, "andamento" character varying, "decisao" text, "data_conclusao" TIMESTAMP WITH TIME ZONE, "recursos" text, "custas_despesas" numeric, "data_conhecimento" TIMESTAMP WITH TIME ZONE NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcionarioId" integer, CONSTRAINT "PK_41014cd4224847fd66b43fe5cfd" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."ferias_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "ferias" ("id" SERIAL NOT NULL, "status" "public"."ferias_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "data_fim" TIMESTAMP WITH TIME ZONE NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcionarioId" integer, CONSTRAINT "PK_15aaf56d0233a1f69ebb6dc1502" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_sexo_enum" AS ENUM('MASCULINO', 'FEMININO', 'NAO_DECLARADO', 'OUTRO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_estado_civil_enum" AS ENUM('SOLTEIRO', 'CASADO', 'DIVORCIADO', 'VIUVO', 'UNIAO_ESTAVEL', 'SEPARADO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_regime_contratacao_enum" AS ENUM('CLT', 'PJ')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_grau_instrucao_enum" AS ENUM('FUNDAMENTAL', 'MEDIO', 'SUPERIOR', 'POS_GRADUACAO', 'MESTRADO', 'DOUTORADO')`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcionarios_escala_enum" AS ENUM('DOZE_TRINTA_SEIS', 'SEIS_UM', 'QUATRO_TRES')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcionarios" ("id" SERIAL NOT NULL, "status" "public"."funcionarios_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "carteira_identidade" character varying(14) NOT NULL, "cpf" character varying(11) NOT NULL, "sexo" "public"."funcionarios_sexo_enum" NOT NULL, "data_nascimento" date NOT NULL, "estado_civil" "public"."funcionarios_estado_civil_enum" NOT NULL, "naturalidade" character varying(100) NOT NULL, "nacionalidade" character varying(100) NOT NULL, "altura" numeric(4,2) NOT NULL, "peso" numeric(6,2) NOT NULL, "nome_pai" character varying(100) NOT NULL, "nome_mae" character varying(100) NOT NULL, "email" character varying(100) NOT NULL, "pis" character varying(11) NOT NULL, "ctps_numero" character varying(7) NOT NULL, "ctps_serie" character varying(4) NOT NULL, "certificado_reservista" character varying(14) NOT NULL, "regime_contratacao" "public"."funcionarios_regime_contratacao_enum" NOT NULL, "data_admissao" date NOT NULL, "salario" numeric(10,2) NOT NULL, "data_ultimo_aso" date, "vencimento_experiencia_1" date, "vencimento_experiencia_2" date, "data_exame_demissional" date, "grau_instrucao" "public"."funcionarios_grau_instrucao_enum" NOT NULL, "necessidades_especiais" boolean NOT NULL, "tipo_deficiencia" character varying(255), "filhos" boolean NOT NULL, "quantidade_filhos" integer, "telefone" character varying(20), "celular" character varying(20) NOT NULL, "gestor" character varying(255) NOT NULL, "rua" character varying(255) NOT NULL, "numero" character varying(10) NOT NULL, "complemento" character varying(100), "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "estado" character varying(2) NOT NULL, "cep" character varying(10) NOT NULL, "latitude" numeric(9,6) NOT NULL, "longitude" numeric(9,6) NOT NULL, "quantidade_onibus" integer NOT NULL, "carga_horaria" numeric(5,2) NOT NULL, "escala" "public"."funcionarios_escala_enum" NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcaoId" integer NOT NULL, "setorId" integer NOT NULL, "centroCustoId" integer, "cboId" integer NOT NULL, "empresaId" integer, CONSTRAINT "UQ_a0de321e9da6c025e7fc92f0bd8" UNIQUE ("cpf"), CONSTRAINT "PK_a6ee7c0e30d968db531ad073337" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."advertencias_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "advertencias" ("id" SERIAL NOT NULL, "status" "public"."advertencias_status_enum" NOT NULL DEFAULT 'A', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "data" TIMESTAMP WITH TIME ZONE NOT NULL, "motivo" character varying(255) NOT NULL, "criadoPorId" integer NOT NULL, "atualizadoPorId" integer, "funcionarioId" integer, CONSTRAINT "PK_daf66cb2e71e4926957c7d74b79" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TYPE "public"."funcao_epi_logs_acao_enum" AS ENUM('REMOVEU', 'ADICIONOU')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcao_epi_logs" ("id" SERIAL NOT NULL, "acao" "public"."funcao_epi_logs_acao_enum" NOT NULL, "descricao" character varying NOT NULL, "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "funcaoId" integer, "epiId" integer, CONSTRAINT "PK_9ccde2cb971be53184066677c37" PRIMARY KEY ("id"))`,
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
      `CREATE TABLE "funcoes_epis" ("funcaoId" integer NOT NULL, "epiId" integer NOT NULL, CONSTRAINT "PK_f5259dd3943682a7adc90f2444f" PRIMARY KEY ("funcaoId", "epiId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_a38bc15b5ff546a5940e3fc941" ON "funcoes_epis" ("funcaoId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_c4b784941b4b248a95411b94f9" ON "funcoes_epis" ("epiId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "faltas" ADD CONSTRAINT "FK_ea9bc229b1b691e4db9b1bf6209" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "faltas" ADD CONSTRAINT "FK_116d4648371dcaba0b5856011c9" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "faltas" ADD CONSTRAINT "FK_f1bc437430509d59102ebbdf011" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" ADD CONSTRAINT "FK_16b860dd3ae67e3d9ee1be638ed" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" ADD CONSTRAINT "FK_b7a5e3059ddad98b12b767a8cb0" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" ADD CONSTRAINT "FK_2ff24f400261f385e385e7e9c9d" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "filiais" ADD CONSTRAINT "FK_43b35d8f05806f31e48a1703b7c" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "filiais" ADD CONSTRAINT "FK_79d0fe19f7c6200d37fc58c531c" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "filiais" ADD CONSTRAINT "FK_b07991eecd7f53eb639bc298eac" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores" ADD CONSTRAINT "FK_d8e37e8704b29ea70d2d62a8e16" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores" ADD CONSTRAINT "FK_9f862502cc3aaca7ab0a1bd339d" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores" ADD CONSTRAINT "FK_32e02144bde7c8b0b6a52393a4c" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_de_custo" ADD CONSTRAINT "FK_dc555247ebbc239ad981fb2e3d1" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_de_custo" ADD CONSTRAINT "FK_9834cc6f271d8891c72157b4951" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_de_custo" ADD CONSTRAINT "FK_aef4b7874ab522b056857509a22" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cbos" ADD CONSTRAINT "FK_270026d62b17c17de1eb8319db1" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cbos" ADD CONSTRAINT "FK_be60fa4694b8bd2cd48473841c5" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "cbos" ADD CONSTRAINT "FK_36d8e5d56f741c4063f944224f2" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" ADD CONSTRAINT "FK_a89d452d4cc0ca85fbdfb713fe1" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" ADD CONSTRAINT "FK_8c1e99672cb32d04fcff5e94aa4" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" ADD CONSTRAINT "FK_1b206ec9d4b3cf5a79a6a983fac" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "epis" ADD CONSTRAINT "FK_97f28a339d3a3b85eef5c41db47" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "epis" ADD CONSTRAINT "FK_513d87e3aa008ab8d25c34b2bc5" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "epis" ADD CONSTRAINT "FK_8a244538721e9d5cc4251328c68" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos" ADD CONSTRAINT "FK_6772f3c23640d1c8370a9d25dfe" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos" ADD CONSTRAINT "FK_039dbc63999f6883e8a5a4fed7f" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos" ADD CONSTRAINT "FK_b58e4c1de339356a987700c655d" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ADD CONSTRAINT "FK_5139a44e732d7600e93125c294d" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" ADD CONSTRAINT "FK_95ca04571a44dfc16d2614f3437" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes" ADD CONSTRAINT "FK_91f591d55f681f3593274450ae6" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes" ADD CONSTRAINT "FK_6b030b1fd65fb19e4d30a660729" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes" ADD CONSTRAINT "FK_fed4986873998e1fa9736ccb59b" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" ADD CONSTRAINT "FK_f2bdec8253bd64a42fe46267e6e" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" ADD CONSTRAINT "FK_26bda94d4995ee1e389b14fb6cc" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" ADD CONSTRAINT "FK_5d1edcf14cfb23f2025aec7c246" FOREIGN KEY ("funcaoId") REFERENCES "funcoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" ADD CONSTRAINT "FK_62c7165b5611d68710aa72cf899" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "demissoes" ADD CONSTRAINT "FK_49b1654c4ae1e7b0c72b3ec7929" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "demissoes" ADD CONSTRAINT "FK_8a1be22fbd28dd53bec1e2b3037" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "demissoes" ADD CONSTRAINT "FK_1259488a34ce786ad661b75e428" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "analise_de_cpf" ADD CONSTRAINT "FK_d8a94e5d0ba4e2a28ee13226085" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "analise_de_cpf" ADD CONSTRAINT "FK_2e3e99a798e0a3d982c5b66b057" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "analise_de_cpf" ADD CONSTRAINT "FK_fe6571e99015f807165414251fd" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acidentes" ADD CONSTRAINT "FK_b4aecf910adb001a8962152268c" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acidentes" ADD CONSTRAINT "FK_21348114d792699f6e737519eb6" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acidentes" ADD CONSTRAINT "FK_4806a9ce0ad4b5e77b478a004e8" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD CONSTRAINT "FK_e122d0753a201779e91dd7d6e0f" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD CONSTRAINT "FK_50e5237cf9d7837336d0d91e56c" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD CONSTRAINT "FK_18d74f5686cfdfbdb2711063dde" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ferias" ADD CONSTRAINT "FK_2023bcd21ef59f5df9f42ce0b52" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ferias" ADD CONSTRAINT "FK_96dc7ee5c7e1f1762bfb8263042" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "ferias" ADD CONSTRAINT "FK_1cd0290a6fac5c7463478647a9f" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_5613d2967559a444e5d3c49e0a5" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_e83efff7a99204cd13959953083" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_3e68a1f3b32c19016d6f951dcb1" FOREIGN KEY ("funcaoId") REFERENCES "funcoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_5997af78f6a20ffd2fe7e70554f" FOREIGN KEY ("setorId") REFERENCES "setores"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_9f17e7b761300d3e2b275e6ccce" FOREIGN KEY ("centroCustoId") REFERENCES "centros_de_custo"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_c219d9d003a589cc8051efc3a5f" FOREIGN KEY ("cboId") REFERENCES "cbos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_2bbe7cd2d280902d09e5c3c2ffc" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertencias" ADD CONSTRAINT "FK_d6adc8bdb86adfe32785715f02f" FOREIGN KEY ("criadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertencias" ADD CONSTRAINT "FK_b513054fede2f100f63f7060da3" FOREIGN KEY ("atualizadoPorId") REFERENCES "usuarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertencias" ADD CONSTRAINT "FK_6b87a6021d5a34ee1cc4151f5d8" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcao_epi_logs" ADD CONSTRAINT "FK_4083feed2e23a0f569a3ddba9f1" FOREIGN KEY ("funcaoId") REFERENCES "funcoes"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcao_epi_logs" ADD CONSTRAINT "FK_67e42f8b4695f6fefbbce92aaec" FOREIGN KEY ("epiId") REFERENCES "epis"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "funcionarios_projetos_logs" ADD CONSTRAINT "FK_617e59ddd046a09f851786eabc2" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "projetos_funcionarios" ADD CONSTRAINT "FK_168dd5769f24892016a56553b84" FOREIGN KEY ("funcionarioId") REFERENCES "funcionarios"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "funcao_epi_logs" DROP CONSTRAINT "FK_67e42f8b4695f6fefbbce92aaec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcao_epi_logs" DROP CONSTRAINT "FK_4083feed2e23a0f569a3ddba9f1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertencias" DROP CONSTRAINT "FK_6b87a6021d5a34ee1cc4151f5d8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertencias" DROP CONSTRAINT "FK_b513054fede2f100f63f7060da3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "advertencias" DROP CONSTRAINT "FK_d6adc8bdb86adfe32785715f02f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_2bbe7cd2d280902d09e5c3c2ffc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_c219d9d003a589cc8051efc3a5f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_9f17e7b761300d3e2b275e6ccce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_5997af78f6a20ffd2fe7e70554f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_3e68a1f3b32c19016d6f951dcb1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_e83efff7a99204cd13959953083"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_5613d2967559a444e5d3c49e0a5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ferias" DROP CONSTRAINT "FK_1cd0290a6fac5c7463478647a9f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ferias" DROP CONSTRAINT "FK_96dc7ee5c7e1f1762bfb8263042"`,
    );
    await queryRunner.query(
      `ALTER TABLE "ferias" DROP CONSTRAINT "FK_2023bcd21ef59f5df9f42ce0b52"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP CONSTRAINT "FK_18d74f5686cfdfbdb2711063dde"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP CONSTRAINT "FK_50e5237cf9d7837336d0d91e56c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP CONSTRAINT "FK_e122d0753a201779e91dd7d6e0f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acidentes" DROP CONSTRAINT "FK_4806a9ce0ad4b5e77b478a004e8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acidentes" DROP CONSTRAINT "FK_21348114d792699f6e737519eb6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acidentes" DROP CONSTRAINT "FK_b4aecf910adb001a8962152268c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "analise_de_cpf" DROP CONSTRAINT "FK_fe6571e99015f807165414251fd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "analise_de_cpf" DROP CONSTRAINT "FK_2e3e99a798e0a3d982c5b66b057"`,
    );
    await queryRunner.query(
      `ALTER TABLE "analise_de_cpf" DROP CONSTRAINT "FK_d8a94e5d0ba4e2a28ee13226085"`,
    );
    await queryRunner.query(
      `ALTER TABLE "demissoes" DROP CONSTRAINT "FK_1259488a34ce786ad661b75e428"`,
    );
    await queryRunner.query(
      `ALTER TABLE "demissoes" DROP CONSTRAINT "FK_8a1be22fbd28dd53bec1e2b3037"`,
    );
    await queryRunner.query(
      `ALTER TABLE "demissoes" DROP CONSTRAINT "FK_49b1654c4ae1e7b0c72b3ec7929"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" DROP CONSTRAINT "FK_62c7165b5611d68710aa72cf899"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" DROP CONSTRAINT "FK_5d1edcf14cfb23f2025aec7c246"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" DROP CONSTRAINT "FK_26bda94d4995ee1e389b14fb6cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "promocoes" DROP CONSTRAINT "FK_f2bdec8253bd64a42fe46267e6e"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes" DROP CONSTRAINT "FK_fed4986873998e1fa9736ccb59b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes" DROP CONSTRAINT "FK_6b030b1fd65fb19e4d30a660729"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcoes" DROP CONSTRAINT "FK_91f591d55f681f3593274450ae6"`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" DROP CONSTRAINT "FK_95ca04571a44dfc16d2614f3437"`,
    );
    await queryRunner.query(
      `ALTER TABLE "empresas" DROP CONSTRAINT "FK_5139a44e732d7600e93125c294d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos" DROP CONSTRAINT "FK_b58e4c1de339356a987700c655d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos" DROP CONSTRAINT "FK_039dbc63999f6883e8a5a4fed7f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "projetos" DROP CONSTRAINT "FK_6772f3c23640d1c8370a9d25dfe"`,
    );
    await queryRunner.query(
      `ALTER TABLE "epis" DROP CONSTRAINT "FK_8a244538721e9d5cc4251328c68"`,
    );
    await queryRunner.query(
      `ALTER TABLE "epis" DROP CONSTRAINT "FK_513d87e3aa008ab8d25c34b2bc5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "epis" DROP CONSTRAINT "FK_97f28a339d3a3b85eef5c41db47"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" DROP CONSTRAINT "FK_1b206ec9d4b3cf5a79a6a983fac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" DROP CONSTRAINT "FK_8c1e99672cb32d04fcff5e94aa4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" DROP CONSTRAINT "FK_a89d452d4cc0ca85fbdfb713fe1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cbos" DROP CONSTRAINT "FK_36d8e5d56f741c4063f944224f2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cbos" DROP CONSTRAINT "FK_be60fa4694b8bd2cd48473841c5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "cbos" DROP CONSTRAINT "FK_270026d62b17c17de1eb8319db1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_de_custo" DROP CONSTRAINT "FK_aef4b7874ab522b056857509a22"`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_de_custo" DROP CONSTRAINT "FK_9834cc6f271d8891c72157b4951"`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_de_custo" DROP CONSTRAINT "FK_dc555247ebbc239ad981fb2e3d1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores" DROP CONSTRAINT "FK_32e02144bde7c8b0b6a52393a4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores" DROP CONSTRAINT "FK_9f862502cc3aaca7ab0a1bd339d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores" DROP CONSTRAINT "FK_d8e37e8704b29ea70d2d62a8e16"`,
    );
    await queryRunner.query(
      `ALTER TABLE "filiais" DROP CONSTRAINT "FK_b07991eecd7f53eb639bc298eac"`,
    );
    await queryRunner.query(
      `ALTER TABLE "filiais" DROP CONSTRAINT "FK_79d0fe19f7c6200d37fc58c531c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "filiais" DROP CONSTRAINT "FK_43b35d8f05806f31e48a1703b7c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" DROP CONSTRAINT "FK_2ff24f400261f385e385e7e9c9d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" DROP CONSTRAINT "FK_b7a5e3059ddad98b12b767a8cb0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" DROP CONSTRAINT "FK_16b860dd3ae67e3d9ee1be638ed"`,
    );
    await queryRunner.query(
      `ALTER TABLE "faltas" DROP CONSTRAINT "FK_f1bc437430509d59102ebbdf011"`,
    );
    await queryRunner.query(
      `ALTER TABLE "faltas" DROP CONSTRAINT "FK_116d4648371dcaba0b5856011c9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "faltas" DROP CONSTRAINT "FK_ea9bc229b1b691e4db9b1bf6209"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c4b784941b4b248a95411b94f9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a38bc15b5ff546a5940e3fc941"`,
    );
    await queryRunner.query(`DROP TABLE "funcoes_epis"`);
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
    await queryRunner.query(`DROP TABLE "funcao_epi_logs"`);
    await queryRunner.query(`DROP TYPE "public"."funcao_epi_logs_acao_enum"`);
    await queryRunner.query(`DROP TABLE "advertencias"`);
    await queryRunner.query(`DROP TYPE "public"."advertencias_status_enum"`);
    await queryRunner.query(`DROP TABLE "funcionarios"`);
    await queryRunner.query(`DROP TYPE "public"."funcionarios_escala_enum"`);
    await queryRunner.query(
      `DROP TYPE "public"."funcionarios_grau_instrucao_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."funcionarios_regime_contratacao_enum"`,
    );
    await queryRunner.query(
      `DROP TYPE "public"."funcionarios_estado_civil_enum"`,
    );
    await queryRunner.query(`DROP TYPE "public"."funcionarios_sexo_enum"`);
    await queryRunner.query(`DROP TYPE "public"."funcionarios_status_enum"`);
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
    await queryRunner.query(`DROP TABLE "projetos"`);
    await queryRunner.query(`DROP TYPE "public"."projetos_status_enum"`);
    await queryRunner.query(`DROP TABLE "epis"`);
    await queryRunner.query(`DROP TYPE "public"."epis_status_enum"`);
    await queryRunner.query(`DROP TABLE "entregas_de_epis"`);
    await queryRunner.query(
      `DROP TYPE "public"."entregas_de_epis_status_enum"`,
    );
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
    await queryRunner.query(`DROP TABLE "usuarios"`);
    await queryRunner.query(`DROP TYPE "public"."usuarios_status_enum"`);
  }
}
