import {
  CacheInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { StartService } from './start.service';
import { ApiKeyGuard } from '../auth/guard';

@UseGuards(ApiKeyGuard)
@Controller()
export class StartController {
  constructor(private start: StartService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/start')
  async getStart() {
    return this.start.getStart();
  }
}
