import {
  CacheInterceptor,
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BrochuresService } from './brochures.service';
import { ApiKeyGuard } from '../auth/guard';

@UseGuards(ApiKeyGuard)
@Controller()
export class BrochuresController {
  constructor(private brochures: BrochuresService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('/brochures')
  async getBrochures() {
    return this.brochures.getBrochures();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('/brochures/:id')
  async getBrochureByPosId(@Param() params) {
    console.log(params.id);
    return this.brochures.getBrochures();
  }
}
