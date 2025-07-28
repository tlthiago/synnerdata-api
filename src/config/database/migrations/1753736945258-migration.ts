import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1753736945258 implements MigrationInterface {
  name = 'Migration1753736945258';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "acidentes" DROP COLUMN "cat"`);
    await queryRunner.query(
      `ALTER TABLE "acidentes" ADD "cat" character varying(25)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "acidentes" DROP COLUMN "cat"`);
    await queryRunner.query(
      `ALTER TABLE "acidentes" ADD "cat" character varying(15)`,
    );
  }
}
