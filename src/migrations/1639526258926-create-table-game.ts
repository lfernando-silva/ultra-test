import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createTableGame1639526258926 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'game',
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
            name: 'price',
            type: 'integer',
            isNullable: false,
            default: 0,
          },
          {
            name: 'tags',
            type: 'varchar[]',
            isNullable: true,
          },
          {
            name: 'releaseDate',
            type: 'timestamptz',
            isNullable: false,
          },
          {
            name: 'publisher',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'game',
      new TableForeignKey({
        columnNames: ['publisher'],
        referencedTableName: 'publisher',
        referencedColumnNames: ['id'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('game');
  }
}
