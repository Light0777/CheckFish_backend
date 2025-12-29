import { Controller, Post, Body } from '@nestjs/common';
import { EngineService } from '../engine/engine.service';

@Controller('analyze')
export class AnalyzeController {
  constructor(private engine: EngineService) {}

  @Post('position')
  async analyzePosition(
    @Body() body: { fen: string; depth?: number },
  ) {
    const evalScore = await this.engine.analyze(
      body.fen,
      body.depth ?? 15,
    );

    return { eval: evalScore };
  }
}
