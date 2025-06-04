import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1748898768135 implements MigrationInterface {
  name = 'Migration1748898768135';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" ALTER COLUMN "nome" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "usuarios" ALTER COLUMN "nome" SET NOT NULL`,
    );
  }
}
