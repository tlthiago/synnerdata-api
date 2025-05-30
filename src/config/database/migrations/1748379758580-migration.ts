import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748379758580 implements MigrationInterface {
  name = 'Migration1748379758580';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "tokens_de_recuperacao_de_senha" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "token" uuid NOT NULL, "expira_em" TIMESTAMP WITH TIME ZONE NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_32c94354a205e14bfcafe5e93c2" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "tokens_de_recuperacao_de_senha"`);
  }
}
