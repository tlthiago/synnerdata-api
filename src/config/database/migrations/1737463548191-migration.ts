import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737463548191 implements MigrationInterface {
  name = 'Migration1737463548191';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "organization_id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "organization_id" SET NOT NULL`,
    );
  }
}
