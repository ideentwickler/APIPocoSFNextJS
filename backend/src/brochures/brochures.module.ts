import { Module } from '@nestjs/common';
import { BrochuresService } from './brochures.service';
import { BrochuresController } from './brochures.controller';

@Module({
  providers: [BrochuresService],
  controllers: [BrochuresController]
})
export class BrochuresModule {}
