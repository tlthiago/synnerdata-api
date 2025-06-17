import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1747344511266 implements MigrationInterface {
  name = 'Migration1747344511266';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "funcao"`);
    await queryRunner.query(
      `CREATE TYPE "public"."usuarios_funcao_enum" AS ENUM('SUPER_ADMIN', 'ADMIN', 'GESTOR_1', 'GESTOR_2', 'VISUALIZADOR')`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "funcao" "public"."usuarios_funcao_enum" NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "funcao"`);
    await queryRunner.query(`DROP TYPE "public"."usuarios_funcao_enum"`);
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "funcao" character varying NOT NULL`,
    );
  }
}
