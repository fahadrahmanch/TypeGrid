import { ICreatePostUseCase } from '../../interfaces/user/create-post.interface';
import { IDiscussionRepository } from '../../../../domain/interfaces/repository/user/discussion-repository.interface';
import { DiscussionEntity } from '../../../../domain/entities/user/discussion.entity';

export class CreatePostUseCase implements ICreatePostUseCase {
  constructor(private _discussionRepository: IDiscussionRepository) {}

  async execute(userId: string, data: { title: string; content: string }): Promise<void> {
    const discussion = new DiscussionEntity({
      title: data.title,
      content: data.content,
      userId: userId,
    });

     await this._discussionRepository.create(discussion);
  }
}
