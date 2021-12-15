import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createTablePublisher1639525558555 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'publisher',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            isUnique: true,
            generationStrategy: 'uuid',
            default: `uuid_generate_v4()`,
          },
          {
            name: 'name',
            type: 'varchar(150)',
            isNullable: false,
          },
          {
            name: 'siret',
            type: 'float',
            isNullable: false,
            default: 0,
          },
          {
            name: 'phone',
            type: 'varchar(30)',
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('publisher');
  }
}
