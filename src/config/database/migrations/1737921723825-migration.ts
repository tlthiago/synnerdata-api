import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737921723825 implements MigrationInterface {
  name = 'Migration1737921723825';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."cbos_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "cbos" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "status" "public"."cbos_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "empresaId" integer, CONSTRAINT "PK_f04e510d8386ef479ba0188809d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "cbos" ADD CONSTRAINT "FK_36d8e5d56f741c4063f944224f2" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "cbos" DROP CONSTRAINT "FK_36d8e5d56f741c4063f944224f2"`,
    );
    await queryRunner.query(`DROP TABLE "cbos"`);
    await queryRunner.query(`DROP TYPE "public"."cbos_status_enum"`);
  }
}
