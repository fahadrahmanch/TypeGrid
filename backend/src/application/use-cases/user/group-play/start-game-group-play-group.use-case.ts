import { IStartGameGroupPlayGroupUseCase } from '../../interfaces/user/group-play/start-game-group-play-group.interface';
import { ICompetitionRepository } from '../../../../domain/interfaces/repository/user/competition-repository.interface';
import { IGroupRepository } from '../../../../domain/interfaces/repository/user/group-repository.interface';
import { ILessonRepository } from '../../../../domain/interfaces/repository/admin/lesson-repository.interface';
import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { CompetitionEntity } from '../../../../domain/entities/competition.entity';
import { mapLessonDTOforGroupPlay } from '../../../mappers/admin/lesson-management.mapper';
import { mapCompetitionToDTOGroupPlay } from '../../../mappers/user/competition-group-play.mapper';
import { CompetitionDTOGroupPlay } from '../../../DTOs/user/competition-group-play.dto';
import { MESSAGES } from '../../../../domain/constants/messages';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';

export class StartGameGroupPlayGroupUseCase implements IStartGameGroupPlayGroupUseCase {
  constructor(
    private readonly _competitionRepository: ICompetitionRepository,
    private readonly _groupRepository: IGroupRepository,
    private readonly _lessonRepository: ILessonRepository,
    private readonly _userRepository: IUserRepository
  ) {}

  async execute(groupId: string, countDown: number): Promise<CompetitionDTOGroupPlay> {
    const group = await this._groupRepository.findById(groupId);
    if (!group) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }

    const difficultyToLevelMap: Record<string, string> = {
      easy: 'beginner',
      medium: 'intermediate',
      hard: 'advanced',
    };

    const level = difficultyToLevelMap[group.getDifficulty()];

    const lessons = await this._lessonRepository.find({
      level,
      createdBy: 'admin',
    });
    if (!lessons.length) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.LESSON_NOT_FOUND);
    }

    const selectedLesson = mapLessonDTOforGroupPlay(lessons[Math.floor(Math.random() * lessons.length)]);

    const competitionEntity = new CompetitionEntity({
      type: 'group',
      mode: 'global',
      textId: selectedLesson.id,
      participants: group.getMembers(),
      groupId: group.getId()!,
      duration: 50,
      status: 'ongoing',
      countDown,
    });

    const competition = await this._competitionRepository.create(competitionEntity.toObject());

    const populatedParticipants = (
      await Promise.all(
        competition.getParticipants().map((memberId: string) => this._userRepository.findById(memberId))
      )
    )
      .filter((m): m is NonNullable<typeof m> => m !== null)
      .map((member) => ({
        _id: member._id,
        name: member.name,
        imageUrl: member.imageUrl,
      }));

    return mapCompetitionToDTOGroupPlay(
      {
        ...competition.toObject(),
        participants: populatedParticipants,
        lesson: selectedLesson,
        joinLink: group.getJoinLink() ?? undefined,
      },
      group.getOwnerId()
    );
  }
}
