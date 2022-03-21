import { User } from './../../users/entities/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

export enum Status {
  LAUNCHING = 'Launching',
  IN_PROGRESS = 'In progress',
  FINISHED = 'Finished',
}
export enum ProjectType {
  SHORT = 'Short Term Contract',
  LONG = 'Long Term Contract',
  OPEN_SOURCE = 'Open Source',
}

@Entity('project')
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    default: true,
  })
  public: boolean;

  @Column({
    enum: Status,
    default: Status.LAUNCHING,
  })
  status: string;

  @Column({
    enum: ProjectType,
    default: ProjectType.OPEN_SOURCE,
  })
  type: string;

  @ManyToMany(() => User, (user) => user.projects)
  members: User[];
}
