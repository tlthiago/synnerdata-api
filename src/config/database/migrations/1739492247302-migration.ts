import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739492247302 implements MigrationInterface {
  name = 'Migration1739492247302';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "atestados" DROP COLUMN "data_inicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" ADD "data_inicio" date NOT NULL`,
    );
    await queryRunner.query(`ALTER TABLE "atestados" DROP COLUMN "data_fim"`);
    await queryRunner.query(
      `ALTER TABLE "atestados" ADD "data_fim" date NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "atestados" DROP COLUMN "data_fim"`);
    await queryRunner.query(
      `ALTER TABLE "atestados" ADD "data_fim" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" DROP COLUMN "data_inicio"`,
    );
    await queryRunner.query(
      `ALTER TABLE "atestados" ADD "data_inicio" TIMESTAMP WITH TIME ZONE NOT NULL`,
    );
  }
}
