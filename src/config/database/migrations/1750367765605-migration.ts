import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1750367765605 implements MigrationInterface {
  name = 'Migration1750367765605';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "intencoes_de_pagamento" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "nome_fantasia" character varying(255) NOT NULL, "razao_social" character varying(255) NOT NULL, "cnpj" character varying(14) NOT NULL, "email" character varying(100) NOT NULL, "telefone" character varying(20), "celular" character varying(20) NOT NULL, "tipo_plano" character varying NOT NULL, "quantidade_funcionarios" character varying NOT NULL, "preco" numeric(10,2) NOT NULL, "pagarme_id" character varying NOT NULL, "status" character varying NOT NULL DEFAULT 'pending', "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_ff362f15aec3b8d348c2f325748" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "intencoes_de_pagamento"`);
  }
}
