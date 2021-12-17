import { MigrationInterface, QueryRunner } from 'typeorm';

const publishers = [
  {
    id: '78ebdb8f-798f-4dfa-8e2b-0a75a8c94324',
    name: 'Valve',
    siret: 100000,
    phone: '4258899642',
  },
  {
    id: '52886ecf-81d1-4cdf-9408-28a4e7c30723',
    name: 'Bungie',
    siret: 200000,
    phone: '5532999999999',
  },
  {
    id: '290f236d-e966-4487-9387-21abc0bb953b',
    name: 'Activision',
    siret: 200500,
    phone: '132999999999',
  },
];

export class insertPublisherSeedData1639687972585
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.insert('publisher', publishers);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.manager.delete('publisher', {});
  }
}
