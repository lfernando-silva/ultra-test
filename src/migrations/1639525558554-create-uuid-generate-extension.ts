import { MigrationInterface, QueryRunner } from 'typeorm';

export class createUuidGenerateExtension1639525558554
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP EXTENSION IF EXISTS "uuid-ossp";`);
    await queryRunner.query(`CREATE EXTENSION "uuid-ossp" SCHEMA public;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP EXTENSION "uuid-ossp";');
  }
}
