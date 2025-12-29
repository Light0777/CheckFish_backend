import { Injectable, OnModuleInit } from '@nestjs/common';
import { spawn, ChildProcessWithoutNullStreams } from 'child_process';

@Injectable()
export class EngineService implements OnModuleInit {
    private engine: ChildProcessWithoutNullStreams;

    onModuleInit() {
        this.engine = spawn('../../engine/stockfish');

        this.engine.stdin.write('uci\n');
        this.engine.stdin.write('isready\n');
    }

    analyze(fen: string, depth = 15): Promise<number> {
        return new Promise((resolve) => {
            this.engine.stdin.write(`position fen ${fen}\n`);
            this.engine.stdin.write(`go depth ${depth}\n`);

            this.engine.stdout.on('data', (data) => {
                const output = data.toString();
                if (output.includes('score cp')) {
                    const match = output.match(/score cp (-?\d+)/);
                    if (match) {
                        resolve(parseInt(match[1], 10) / 100);
                    }
                }
            });
        });
    }
    analyzePosition(
  fen: string,
  depth = 14,
): Promise<{ eval: number; bestMove: string }> {
  return new Promise((resolve) => {
    let evalScore = 0;

    const onData = (data: Buffer) => {
      const lines = data.toString().split('\n');

      for (const line of lines) {
        if (line.includes('score cp')) {
          const match = line.match(/score cp (-?\d+)/);
          if (match) {
            evalScore = parseInt(match[1], 10) / 100;
          }
        }

        if (line.startsWith('bestmove')) {
          const bestMove = line.split(' ')[1];
          this.engine.stdout.off('data', onData);
          resolve({ eval: evalScore, bestMove });
        }
      }
    };

    this.engine.stdout.on('data', onData);

    this.engine.stdin.write(`position fen ${fen}\n`);
    this.engine.stdin.write(`go depth ${depth}\n`);
  });
}


}
