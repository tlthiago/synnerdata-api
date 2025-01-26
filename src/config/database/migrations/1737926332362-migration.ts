import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737926332362 implements MigrationInterface {
  name = 'Migration1737926332362';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."epis_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `CREATE TABLE "epis" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "descricao" character varying(255) NOT NULL, "equipamentos" character varying(255) NOT NULL, "status" "public"."epis_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "empresaId" integer, CONSTRAINT "PK_470f0275b622d24454cf42f6e99" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "epis" ADD CONSTRAINT "FK_8a244538721e9d5cc4251328c68" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "epis" DROP CONSTRAINT "FK_8a244538721e9d5cc4251328c68"`,
    );
    await queryRunner.query(`DROP TABLE "epis"`);
    await queryRunner.query(`DROP TYPE "public"."epis_status_enum"`);
  }
}
