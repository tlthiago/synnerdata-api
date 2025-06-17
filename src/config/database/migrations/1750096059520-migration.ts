import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1750096059520 implements MigrationInterface {
    name = 'Migration1750096059520'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "empresas" ADD "id_assinatura" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "empresas" DROP COLUMN "id_assinatura"`);
    }

}
