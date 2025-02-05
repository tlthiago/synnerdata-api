import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738703392029 implements MigrationInterface {
    name = 'Migration1738703392029'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funcionarios" ADD "atualizado_por" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funcionarios" DROP COLUMN "atualizado_por"`);
    }

}
