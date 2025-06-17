import { Module } from '@nestjs/common';
import { StatusService } from './status.service';
import { StatusController } from './status.controller';
import { HealthController } from './health.controller';

@Module({
  controllers: [StatusController, HealthController],
  providers: [StatusService],
})
export class StatusModule {}
