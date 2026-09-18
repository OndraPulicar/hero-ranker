import { Controller, Get } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeData } from '@hero-ranker/shared/schemas/home';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getHome(): Promise<HomeData> {
    return this.homeService.getHome();
  }
}
