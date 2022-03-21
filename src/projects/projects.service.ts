import { User } from 'src/users/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectDto } from './dto/project.dto';
import { Project, Status } from './entities/project.entity';

interface Options {
  user?: User;
}
@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async findAll({ user }: Options): Promise<ProjectDto[]> {
    const userProjects = await this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'user')
      .where('user.id= :id', { id: user?.id })
      .getMany();

    const publicProjects = await this.findPublicProjects(user).getMany();

    const privateProjects = await this.findPrivateProjects(user).getMany();

    return [...userProjects, ...publicProjects, ...privateProjects];
  }

  async findByUserId(userId: number, { user }: Options): Promise<ProjectDto[]> {
    if (userId != user?.id) {
      const publicProjects = await this.findPublicProjects(
        { id: userId } as User,
        true,
      ).getMany();

      const privateProjects = await this.findPrivateProjects(
        { id: userId } as User,
        true,
      ).getMany();

      return [...publicProjects, ...privateProjects];
    } else {
      return await this.projectRepository
        .createQueryBuilder('project')
        .leftJoinAndSelect('project.members', 'user')
        .where('user.id= :id', { id: userId })
        .getMany();
    }
  }

  async findFinishedProjectByType(type: string, { user }: Options) {
    const publicProjects = await this.findPublicProjects(user)
      .andWhere('project.status= :status', { status: Status.FINISHED })
      .andWhere('project.type= :type', { type })
      .getMany();

    const privateProjects = await this.findPrivateProjects(user)
      .andWhere('project.status= :status', { status: Status.FINISHED })
      .andWhere('project.type= :type', { type })
      .getMany();

    return [...publicProjects, ...privateProjects];
  }

  findPublicProjects(user: User, shouldMatchUser = false) {
    const qb = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'user')
      .where('project.public = 1');

    if (user?.id) {
      return qb.andWhere(
        `user.id ${shouldMatchUser ? 'like' : 'not like'} :id`,
        {
          id: user?.id,
        },
      );
    } else {
      return qb;
    }
  }

  findPrivateProjects(user: User, shouldMatchUser = false) {
    const qb = this.projectRepository
      .createQueryBuilder('project')
      .leftJoinAndSelect('project.members', 'user')
      .where('project.public = 0')
      .select(['project.id', 'project.public', 'project.status']);

    if (user?.id) {
      return qb.andWhere(
        `user.id ${shouldMatchUser ? 'like' : 'not like'} :id`,
        {
          id: user?.id,
        },
      );
    } else {
      return qb;
    }
  }
}
