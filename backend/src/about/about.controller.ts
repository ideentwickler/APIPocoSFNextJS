import {
  CacheInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutDto } from './dto';
import { ApiKeyGuard } from '../auth/guard';

@UseGuards(ApiKeyGuard)
@Controller('')
export class AboutController {
  constructor(private aboutService: AboutService) {}

  @UseInterceptors(CacheInterceptor)
  @Get('about')
  getAbout(): Promise<AboutDto[]> {
    return this.aboutService.getAbout();
  }

  @UseInterceptors(CacheInterceptor)
  @Get('legal')
  getLegal() {
    return this.aboutService.getLegal();
  }
}
