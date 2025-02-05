import { MigrationInterface, QueryRunner } from 'typeorm';

export class Migration1737830812264 implements MigrationInterface {
  name = 'Migration1737830812264';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TYPE "public"."usuarios_status_enum" AS ENUM('A', 'I', 'E')`,
    );
    await queryRunner.query(
      `ALTER TABLE "usuarios" ADD "status" "public"."usuarios_status_enum" NOT NULL DEFAULT 'A'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "usuarios" DROP COLUMN "status"`);
    await queryRunner.query(`DROP TYPE "public"."usuarios_status_enum"`);
  }
}
