import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737463578300 implements MigrationInterface {
  name = 'Migration1737463578300';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "hashed_refresh_token" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "hashed_refresh_token" SET NOT NULL`,
    );
  }
}
