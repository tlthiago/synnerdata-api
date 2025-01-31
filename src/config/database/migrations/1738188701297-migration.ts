import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738188701297 implements MigrationInterface {
  name = 'Migration1738188701297';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funcionario" ADD "criado_por" integer NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionario" ADD "atualizado_por" integer`,
    );
    await queryRunner.query(`ALTER TABLE "funcionario" DROP COLUMN "telefone"`);
    await queryRunner.query(
      `ALTER TABLE "funcionario" ADD "telefone" character varying(20)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "funcionario" DROP COLUMN "telefone"`);
    await queryRunner.query(
      `ALTER TABLE "funcionario" ADD "telefone" character varying(15)`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionario" DROP COLUMN "atualizado_por"`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionario" DROP COLUMN "criado_por"`,
    );
  }
}
