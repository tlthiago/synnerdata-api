import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1739754320372 implements MigrationInterface {
  name = 'Migration1739754320372';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "acidentes" ALTER COLUMN "cat" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "acidentes" ALTER COLUMN "cat" SET NOT NULL`,
    );
  }
}
