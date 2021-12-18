import { Test, TestingModule } from '@nestjs/testing';

import { AppModule } from '../../src/app.module';

export async function createTestingModule() {
  return Test.createTestingModule({
    imports: [AppModule],
  }).compile();
}

export default async function initApp() {
  const moduleFixture: TestingModule = await createTestingModule();

  return moduleFixture.createNestApplication();
}
