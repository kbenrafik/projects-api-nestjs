import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Param, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ProjectsService } from './projects.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('projects')
@Controller('projects')
@ApiBearerAuth()
@UseGuards(AuthGuard(['jwt', 'anonymous']))
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get('/')
  async findAll(@Request() req): Promise<any> {
    return await this.projectsService.findAll({ user: req.user });
  }

  @Get('user/:userId')
  findByUserId(@Request() req, @Param('userId') userId: number) {
    return this.projectsService.findByUserId(userId, { user: req.user });
  }

  @Get('finished/:type')
  findFinishedProjectByType(@Request() req, @Param('type') type: string) {
    return this.projectsService.findFinishedProjectByType(type, {
      user: req.user,
    });
  }
}
