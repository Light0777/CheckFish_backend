import { Controller, Post, Body } from '@nestjs/common';
import { PgnService } from './pgn.service';

@Controller('analyze')
export class PgnController {
  constructor(private pgnService: PgnService) {}

  @Post('pgn')
  analyze(@Body() body: { pgn: string }) {
    return this.pgnService.analyzePgn(body.pgn);
  }
}
