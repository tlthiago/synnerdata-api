import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739580400088 implements MigrationInterface {
  name = 'Migration1739580400088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "faltas" DROP COLUMN "data"`);
    await queryRunner.query(`ALTER TABLE "faltas" ADD "data" date NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" DROP COLUMN "data"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" ADD "data" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "projetos" DROP COLUMN "data_inicio"`);
    await queryRunner.query(
      `ALTER TABLE "projetos" ADD "data_inicio" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "promocoes" DROP COLUMN "salario"`);
    await queryRunner.query(
      `ALTER TABLE "promocoes" ADD "salario" numeric(10,2) NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "promocoes" DROP COLUMN "data"`);
    await queryRunner.query(`ALTER TABLE "promocoes" ADD "data" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "demissoes" DROP COLUMN "data"`);
    await queryRunner.query(`ALTER TABLE "demissoes" ADD "data" date NOT NULL`);
    await queryRunner.query(`ALTER TABLE "acidentes" DROP COLUMN "data"`);
    await queryRunner.query(`ALTER TABLE "acidentes" ADD "data" date NOT NULL`);
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "data_ajuizamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "data_ajuizamento" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "descricao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "descricao" character varying NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ALTER COLUMN "valor_causa" TYPE numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "decisao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "decisao" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "data_conclusao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "data_conclusao" date`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "recursos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "recursos" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ALTER COLUMN "custas_despesas" TYPE numeric(10,2)`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "data_conhecimento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "data_conhecimento" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ferias" DROP COLUMN "data_inicio"`);
    await queryRunner.query(
      `ALTER TABLE "ferias" ADD "data_inicio" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ferias" DROP COLUMN "data_fim"`);
    await queryRunner.query(
      `ALTER TABLE "ferias" ADD "data_fim" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "advertencias" DROP COLUMN "data"`);
    await queryRunner.query(
      `ALTER TABLE "advertencias" ADD "data" date NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios_projetos_logs" DROP COLUMN "data_inicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios_projetos_logs" ADD "data_inicio" date NOT NULL DEFAULT now()`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funcionarios_projetos_logs" DROP COLUMN "data_inicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios_projetos_logs" ADD "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`,
    );
    await queryRunner.query(`ALTER TABLE "advertencias" DROP COLUMN "data"`);
    await queryRunner.query(
      `ALTER TABLE "advertencias" ADD "data" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ferias" DROP COLUMN "data_fim"`);
    await queryRunner.query(
      `ALTER TABLE "ferias" ADD "data_fim" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "ferias" DROP COLUMN "data_inicio"`);
    await queryRunner.query(
      `ALTER TABLE "ferias" ADD "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "data_conhecimento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "data_conhecimento" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ALTER COLUMN "custas_despesas" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "recursos"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "recursos" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "data_conclusao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "data_conclusao" TIMESTAMP WITH TIME ZONE`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "decisao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "decisao" text`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ALTER COLUMN "valor_causa" TYPE numeric`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "descricao"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "descricao" text NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" DROP COLUMN "data_ajuizamento"`,
    );
    await queryRunner.query(
      `ALTER TABLE "acoes_trabalhistas" ADD "data_ajuizamento" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "acidentes" DROP COLUMN "data"`);
    await queryRunner.query(
      `ALTER TABLE "acidentes" ADD "data" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "demissoes" DROP COLUMN "data"`);
    await queryRunner.query(
      `ALTER TABLE "demissoes" ADD "data" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "promocoes" DROP COLUMN "data"`);
    await queryRunner.query(
      `ALTER TABLE "promocoes" ADD "data" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "promocoes" DROP COLUMN "salario"`);
    await queryRunner.query(
      `ALTER TABLE "promocoes" ADD "salario" TIMESTAMP(6) WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "projetos" DROP COLUMN "data_inicio"`);
    await queryRunner.query(
      `ALTER TABLE "projetos" ADD "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" DROP COLUMN "data"`,
    );
    await queryRunner.query(
      `ALTER TABLE "entregas_de_epis" ADD "data" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "faltas" DROP COLUMN "data"`);
    await queryRunner.query(
      `ALTER TABLE "faltas" ADD "data" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }
}
