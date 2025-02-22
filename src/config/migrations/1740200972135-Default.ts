import { MigrationInterface, QueryRunner } from "typeorm";

export class Default1740200972135 implements MigrationInterface {
    name = 'Default1740200972135'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "teacher" ("teacher_id" integer NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(20), CONSTRAINT "UQ_00634394dce7677d531749ed8e8" UNIQUE ("email"), CONSTRAINT "PK_4218596f5a4a574cff06e91d791" PRIMARY KEY ("teacher_id"))`);
        await queryRunner.query(`CREATE TABLE "student" ("student_id" integer NOT NULL, "first_name" character varying(50) NOT NULL, "last_name" character varying(50) NOT NULL, "email" character varying(100) NOT NULL, "phone" character varying(20), "birth_date" TIMESTAMP, "gender" character varying(10) NOT NULL, "address" text, CONSTRAINT "UQ_a56c051c91dbe1068ad683f536e" UNIQUE ("email"), CONSTRAINT "PK_be3689991c2cc4b6f4cf39087fa" PRIMARY KEY ("student_id"))`);
        await queryRunner.query(`CREATE TABLE "class" ("class_id" integer NOT NULL, "class_name" character varying(100) NOT NULL, "subject" character varying(100) NOT NULL, "teacherIdTeacherId" integer, CONSTRAINT "PK_4265c685fe8a9043bd8d400ad58" PRIMARY KEY ("class_id"))`);
        await queryRunner.query(`ALTER TABLE "class" ADD CONSTRAINT "FK_b7706afbdd902d097ca763f5c8d" FOREIGN KEY ("teacherIdTeacherId") REFERENCES "teacher"("teacher_id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "class" DROP CONSTRAINT "FK_b7706afbdd902d097ca763f5c8d"`);
        await queryRunner.query(`DROP TABLE "class"`);
        await queryRunner.query(`DROP TABLE "student"`);
        await queryRunner.query(`DROP TABLE "teacher"`);
    }

}
