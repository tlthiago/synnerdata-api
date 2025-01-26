import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737908839595 implements MigrationInterface {
  name = 'Migration1737908839595';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."setores_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "setores" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "status" "public"."setores_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "empresaId" integer, CONSTRAINT "PK_85908551895de8d968532c35d07" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "setores" ADD CONSTRAINT "FK_32e02144bde7c8b0b6a52393a4c" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "setores" DROP CONSTRAINT "FK_32e02144bde7c8b0b6a52393a4c"`,
    );
    await queryRunner.query(`DROP TABLE "setores"`);
    await queryRunner.query(`DROP TYPE "public"."setores_status_enum"`);
  }
}
