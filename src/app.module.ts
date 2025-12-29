import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EngineService } from './engine/engine.service';
import { AnalyzeController } from './analyze/analyze.controller';
import { PgnService } from './pgn/pgn.service';
import { PgnController } from './pgn/pgn.controller';

@Module({
  imports: [],
  controllers: [AppController, AnalyzeController, PgnController],
  providers: [AppService, EngineService, PgnService],
})
export class AppModule {}
