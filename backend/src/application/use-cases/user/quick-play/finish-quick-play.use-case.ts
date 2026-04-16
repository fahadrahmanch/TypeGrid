import { ICompetitionRepository } from '../../../../domain/interfaces/repository/user/competition-repository.interface';
import { IResultRepository } from '../../../../domain/interfaces/repository/result-repository.interface';
import { ResultEntity } from '../../../../domain/entities/result.entity';
import { CompetitionEntity } from '../../../../domain/entities/competition.entity';
import { QuicKPlayResult } from '../../../DTOs/user/competition-quick-play.dto';
import { IStatsRepository } from '../../../../domain/interfaces/repository/user/stats-repository.interface';
import { ILessonRepository } from '../../../../domain/interfaces/repository/admin/lesson-repository.interface';
import { updateUserStats } from '../../../services/user-stats.service';
import { StatsEntity } from '../../../../domain/entities/stats.entity';

export class FinishQuickPlayUseCase {
  constructor(
    private competitionRepository: ICompetitionRepository,
    private resultRepository: IResultRepository,
    private statsRepository: IStatsRepository,
    private lessonRepository: ILessonRepository
  ) {}
  async execute(gameId: string, resultArray: QuicKPlayResult[]): Promise<void> {
    const competition = await this.competitionRepository.findById(gameId);
    if (!competition) return;

    const competitionEntity = new CompetitionEntity({
      ...(competition as any),
      id: (competition as any)._id,
    });
    competitionEntity.setStatus('completed');
    await this.competitionRepository.update(competitionEntity);

    const lesson = await this.lessonRepository.findById(competitionEntity.getTextId()!.toString());

    let difficulty: 'easy' | 'medium' | 'hard' = 'medium';
    if (lesson) {
      if (lesson.level === 'beginner') difficulty = 'easy';
      else if (lesson.level === 'intermediate') difficulty = 'medium';
      else if (lesson.level === 'advanced') difficulty = 'hard';
    }

    for (const result of resultArray) {
      const resultEntity = new ResultEntity({
        userId: result.userId,
        competitionId: gameId,
        type: 'quick',
        result: {
          wpm: result.wpm,
          accuracy: Number(result.accuracy),
          errors: result.errors,
          time: result.timeTaken,
          rank: result.rank,
        },
      });

      let stats = await this.statsRepository.findByUserId(result.userId);
      if (!stats) {
        stats = new StatsEntity({
          userId: result.userId,
        });
      }

      const score = await updateUserStats(result.wpm, Number(result.accuracy), difficulty, 'quick');

      stats.incrementCompetitions();
      stats.updateScores(score);
      stats.updatePerformance(result.wpm, Number(result.accuracy));

      if (stats.getId()) {
        await this.statsRepository.updateStats(result.userId, stats.toObject());
      } else {
        await this.statsRepository.create(stats.toObject());
      }

      const resultObject = resultEntity.toObject();
      await this.resultRepository.create(resultObject);
    }
  }
}
