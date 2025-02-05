import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738618034953 implements MigrationInterface {
    name = 'Migration1738618034953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funcionarios" ADD "empresaId" integer`);
        await queryRunner.query(`ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_2bbe7cd2d280902d09e5c3c2ffc" FOREIGN KEY ("empresaId") REFERENCES "empresas"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_2bbe7cd2d280902d09e5c3c2ffc"`);
        await queryRunner.query(`ALTER TABLE "funcionarios" DROP COLUMN "empresaId"`);
    }

}
