import {
  CacheInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { PosService } from './pos.service';
import { ApiKeyGuard } from '../auth/guard';

@UseGuards(ApiKeyGuard)
@Controller()
export class PosController {
  constructor(private pos: PosService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/pos')
  async getPOS() {
    return this.pos.getPOS();
  }
}
