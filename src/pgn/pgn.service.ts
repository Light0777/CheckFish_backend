import { Injectable } from '@nestjs/common';
import { Chess } from 'chess.js';
import { EngineService } from '../engine/engine.service';

@Injectable()
export class PgnService {
  constructor(private engine: EngineService) {}

  private extractSanMoves(rawPgn: string): string[] {
    return rawPgn
      // remove parentheses
      .replace(/^\s*\(|\)\s*$/g, '')

      // remove headers
      .replace(/\[.*?\]/g, ' ')

      // remove results
      .replace(/\b(1-0|0-1|1\/2-1\/2)\b/g, ' ')

      // normalize whitespace
      .replace(/\s+/g, ' ')
      .trim()

      // split into tokens
      .split(' ')

      // remove move numbers like "12." or "12..."
      .filter((t) => !/^\d+\.+$/.test(t));
  }

  async analyzePgn(pgn: string) {
    const sanMoves = this.extractSanMoves(pgn);

    const chess = new Chess();

    // 🔥 apply moves one by one (critical)
    for (const san of sanMoves) {
      const move = chess.move(san);
      if (!move) {
        throw new Error(`Invalid move in PGN: ${san}`);
      }
    }

    if (chess.history().length === 0) {
      throw new Error('Invalid or empty PGN');
    }

    const moves = chess.history({ verbose: true });

    const results: Array<{
      moveNumber: number;
      color: string;
      san: string;
      uci: string;
      evalBefore: number;
      evalAfter: number;
      evalLoss: number;
      bestMove: string;
      classification: string;
    }> = [];
    const replay = new Chess();

    for (let i = 0; i < moves.length; i++) {
      const move = moves[i];

      const fenBefore = replay.fen();
      const before = await this.engine.analyzePosition(fenBefore);

      replay.move(move);

      const fenAfter = replay.fen();
      const after = await this.engine.analyzePosition(fenAfter);

      const evalBefore =
        move.color === 'w' ? before.eval : -before.eval;
      const evalAfter =
        move.color === 'w' ? after.eval : -after.eval;

      const loss = evalBefore - evalAfter;

      results.push({
        moveNumber: Math.floor(i / 2) + 1,
        color: move.color,
        san: move.san,
        uci: move.from + move.to,
        evalBefore,
        evalAfter,
        evalLoss: loss,
        bestMove: before.bestMove,
        classification: this.classifyMove(loss),
      });
    }

    return results;
  }

  private classifyMove(loss: number) {
    if (loss < 0.3) return 'best';
    if (loss < 0.8) return 'inaccuracy';
    if (loss < 2.0) return 'mistake';
    return 'blunder';
  }
}
