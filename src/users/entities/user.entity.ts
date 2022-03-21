import { Project } from './../../projects/entities/project.entity';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @ManyToMany(() => Project, (project) => project.members, {
    cascade: true,
  })
  @JoinTable()
  projects: Project[];
}
