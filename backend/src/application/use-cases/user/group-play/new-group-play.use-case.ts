import { INewGroupPlayUseCase } from '../../interfaces/user/group-play/new-group-play.interface';
import { IGroupRepository } from '../../../../domain/interfaces/repository/user/group-repository.interface';
import { MESSAGES } from '../../../../domain/constants/messages';
import { CustomError } from '../../../../domain/entities/custom-error.entity';
import { HttpStatusCodes } from '../../../../domain/enums/http-status-codes.enum';
import { IUserRepository } from '../../../../domain/interfaces/repository/user/user-repository.interface';
import { ICompetitionRepository } from '../../../../domain/interfaces/repository/user/competition-repository.interface';
import { ILessonRepository } from '../../../../domain/interfaces/repository/admin/lesson-repository.interface';
import { CompetitionEntity } from '../../../../domain/entities/competition.entity';
import { mapCompetitionToDTOGroupPlay } from '../../../mappers/user/competition-group-play.mapper';
import { CompetitionDTOGroupPlay } from '../../../DTOs/user/competition-group-play.dto';
import { mapLessonDTOforGroupPlay } from '../../../mappers/admin/lesson-management.mapper';

export class NewGroupPlayUseCase implements INewGroupPlayUseCase {
  constructor(
    private readonly _groupRepository: IGroupRepository,
    private readonly _userRepository: IUserRepository,
    private readonly _competitionRepository: ICompetitionRepository,
    private readonly _lessonRepository: ILessonRepository
  ) {}

  async execute(gameId: string, users: string[]): Promise<CompetitionDTOGroupPlay> {
    const competition = await this._competitionRepository.findById(gameId);
    if (!competition) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.COMPETITION_NOT_FOUND);
    }

    if (competition.getStatus() !== 'completed') {
      throw new CustomError(HttpStatusCodes.BAD_REQUEST, MESSAGES.SOMETHING_WENT_WRONG);
    }

    const groupId = competition.getGroupId();
    if (!groupId) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }

    const group = await this._groupRepository.findById(groupId);
    if (!group) {
      throw new CustomError(HttpStatusCodes.NOT_FOUND, MESSAGES.GROUP_NOT_FOUND);
    }

    group.setGroupMembers(users);
    group.setStatus('started');
    await this._groupRepository.update(group.toObject());

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

    const newCompetitionEntity = new CompetitionEntity({
      type: 'group',
      mode: 'global',
      textId: selectedLesson.id!.toString(),
      participants: users,
      groupId,
      duration: 100,
      status: 'ongoing',
      countDown: competition.getCountDown() ?? 10,
    });

    const newCompetition = await this._competitionRepository.create(newCompetitionEntity.toObject());

    const populatedParticipants = (
      await Promise.all(
        newCompetition.getParticipants().map((memberId: string) => this._userRepository.findById(memberId))
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
        ...newCompetition.toObject(),
        participants: populatedParticipants,
        lesson: selectedLesson,
        joinLink: group.getJoinLink() ?? undefined,
      },
      group.getOwnerId()
    );
  }
}
