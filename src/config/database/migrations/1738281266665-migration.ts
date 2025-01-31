import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738281266665 implements MigrationInterface {
  name = 'Migration1738281266665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."funcoes_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "funcoes" ("id" SERIAL NOT NULL, "status" "public"."funcoes_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying NOT NULL, "empresaId" integer, CONSTRAINT "PK_48495eac66422a689003585fb88" PRIMARY KEY ("id"))`,
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
      `ALTER TABLE "funcoes" ADD CONSTRAINT "FK_fed4986873998e1fa9736ccb59b" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
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
      `ALTER TABLE "funcoes" DROP CONSTRAINT "FK_fed4986873998e1fa9736ccb59b"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_c4b784941b4b248a95411b94f9"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_a38bc15b5ff546a5940e3fc941"`,
    );
    await queryRunner.query(`DROP TABLE "funcoes_epis"`);
    await queryRunner.query(`DROP TABLE "funcoes"`);
    await queryRunner.query(`DROP TYPE "public"."funcoes_status_enum"`);
  }
}
