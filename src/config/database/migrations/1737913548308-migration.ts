import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737913548308 implements MigrationInterface {
  name = 'Migration1737913548308';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."centros_de_custo_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "centros_de_custo" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "status" "public"."centros_de_custo_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "empresaId" integer, CONSTRAINT "PK_1e81867ce2846ef8683cd57070e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "centros_de_custo" ADD CONSTRAINT "FK_aef4b7874ab522b056857509a22" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "centros_de_custo" DROP CONSTRAINT "FK_aef4b7874ab522b056857509a22"`,
    );
    await queryRunner.query(`DROP TABLE "centros_de_custo"`);
    await queryRunner.query(
      `DROP TYPE "public"."centros_de_custo_status_enum"`,
    );
  }
}
