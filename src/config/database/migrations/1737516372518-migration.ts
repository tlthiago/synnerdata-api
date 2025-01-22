import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737516372518 implements MigrationInterface {
  name = 'Migration1737516372518';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "empresas" ("id" SERIAL NOT NULL, "nome_fantasia" character varying(255) NOT NULL, "razao_social" character varying(255) NOT NULL, "cnpj" character varying(14) NOT NULL, "rua" character varying(255) NOT NULL, "numero" character varying(10) NOT NULL, "complemento" character varying(100), "bairro" character varying(100) NOT NULL, "cidade" character varying(100) NOT NULL, "estado" character varying(2) NOT NULL, "cep" character varying(10) NOT NULL, "data_fundacao" date NOT NULL, "telefone" character varying(20) NOT NULL, "faturamento" numeric(15,2) NOT NULL, "regime_tributario" character varying(50) NOT NULL, "inscricao_estadual" character varying(50) NOT NULL, "cnae_principal" character varying(50) NOT NULL, "segmento" character varying(100) NOT NULL, "ramo_atuacao" character varying(100) NOT NULL, "logo_url" character varying(500), "status" "public"."empresas_status_enum" NOT NULL DEFAULT 'A', "criado_por" integer NOT NULL, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "UQ_f5ed71aeb4ef47f95df5f8830b8" UNIQUE ("cnpj"), CONSTRAINT "PK_ce7b122b37c6499bfd6520873e1" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "usuarios" ("id" SERIAL NOT NULL, "nome" character varying(255) NOT NULL, "email" character varying NOT NULL, "senha" character varying NOT NULL, "funcao" character varying NOT NULL, "criado_por" integer, "criado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "atualizado_por" integer, "atualizado_em" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "empresa_id" integer, CONSTRAINT "UQ_446adfc18b35418aac32ae0b7b5" UNIQUE ("email"), CONSTRAINT "PK_d7281c63c176e152e4c531594a8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD CONSTRAINT "FK_f7a79f991bd7319aef158bfbd38" FOREIGN KEY ("empresa_id") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" DROP CONSTRAINT "FK_f7a79f991bd7319aef158bfbd38"`,
    );
    await queryRunner.query(`DROP TABLE "usuarios"`);
    await queryRunner.query(`DROP TABLE "empresas"`);
  }
}
