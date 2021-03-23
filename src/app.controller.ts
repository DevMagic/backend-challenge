import { Controller, Get, Req, Res, Next } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AppService } from './app.services'


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}


  @Get("/**")
  getHello(@Req() request: Request, @Res() response: Response, @Next() next: NextFunction): void {
    let router = request.app._router;
    let thisendpoint = request.url
    let exist = false;

    const routes = router.stack.map(route => {
      return route.route;
    })

    routes.forEach(route => {
      if(route){
        route.path == thisendpoint ? exist = true : ''
      }
    })

    if (exist) {
      next()
    } else {
      response.status(404).send(this.appService.getDefault())
    }
  }
}