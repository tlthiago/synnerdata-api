import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738275002738 implements MigrationInterface {
    name = 'Migration1738275002738'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."projetos_status_enum" AS ENUM('A', 'I', 'E')`);
        await queryRunner.query(`CREATE TABLE "projetos" ("id" SERIAL NOT NULL, "status" "public"."projetos_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "nome" character varying(255) NOT NULL, "descricao" character varying(255) NOT NULL, "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL, "cno" character varying(12) NOT NULL, "empresaId" integer, CONSTRAINT "PK_fb6b6aed4b30e10b976fe8bdf5b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "projetos" ADD CONSTRAINT "FK_b58e4c1de339356a987700c655d" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projetos" DROP CONSTRAINT "FK_b58e4c1de339356a987700c655d"`);
        await queryRunner.query(`DROP TABLE "projetos"`);
        await queryRunner.query(`DROP TYPE "public"."projetos_status_enum"`);
    }

}
