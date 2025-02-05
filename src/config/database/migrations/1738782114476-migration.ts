import { MigrationInterface, QueryRunner } from "typeorm";

export class Migration1738782114476 implements MigrationInterface {
    name = 'Migration1738782114476'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funcionarios" ADD "projetosId" integer`);
        await queryRunner.query(`ALTER TABLE "funcionarios" ADD CONSTRAINT "FK_d68bd8f53ce5209781947bae972" FOREIGN KEY ("projetosId") REFERENCES "projetos"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "funcionarios" DROP CONSTRAINT "FK_d68bd8f53ce5209781947bae972"`);
        await queryRunner.query(`ALTER TABLE "funcionarios" DROP COLUMN "projetosId"`);
    }

}
