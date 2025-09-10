import { Command, CommandRunner } from 'nest-commander';
import { SuperAdminSeedService } from './super-admin.seed';

@Command({
  name: 'seed',
  description: 'Seed the database with initial data',
})
export class SeedCommand extends CommandRunner {
  constructor(private readonly superAdminSeedService: SuperAdminSeedService) {
    super();
  }

  async run(): Promise<void> {
    console.log('Starting database seeding...');
    await this.superAdminSeedService.runSeed();
    console.log('Database seeding completed!');
  }
}
