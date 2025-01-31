import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1738191494293 implements MigrationInterface {
  name = 'Migration1738191494293';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."funcionario_status_enum" AS ENUM('A', 'D', 'F', 'AF', 'FP')`,
    );
    await queryRunner.query(
      `ALTER TABLE "funcionario" ADD "status" "public"."funcionario_status_enum" NOT NULL DEFAULT 'A'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "funcionario" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."funcionario_status_enum"`);
  }
}
