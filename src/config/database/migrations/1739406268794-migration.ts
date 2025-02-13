import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739406268794 implements MigrationInterface {
  name = 'Migration1739406268794';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ALTER COLUMN "latitude" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ALTER COLUMN "longitude" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ALTER COLUMN "longitude" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionarios" ALTER COLUMN "latitude" SET NOT NULL`,
    );
  }
}
