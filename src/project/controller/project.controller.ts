import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common'
import { ProjectService } from '../service/project.service'
import { AuthGuard } from '../../auth/guard/auth.guard'
import {
  ProjectListItem,
  ProjectListResponse,
} from '../dto/project-list-response.dto'
import { User } from '../../user/decorator/user.decorator'
import { ProjectCreateUpdateDto } from '../dto/project-create-update.dto'
import { UserPayload } from '../../auth/dto/user-payload.dto'

@UseGuards(AuthGuard)
@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Get()
  async list(
    @User() user: UserPayload,
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
    @Query('search') search: string = '',
  ): Promise<ProjectListResponse> {
    const userId = user.sub as number

    return await this.projectService.getList(userId, search, offset, limit)
  }

  @Post()
  async create(
    @User() user: UserPayload,
    @Body() project: ProjectCreateUpdateDto,
  ): Promise<ProjectListItem> {
    return await this.projectService.createProject({
      ...project,
      userId: user.sub,
    })
  }

  @Patch('/:projectId')
  async update(
    @Param('projectId') projectId: number,
    @Body() project: ProjectCreateUpdateDto,
  ): Promise<ProjectListItem> {
    return await this.projectService.updateProject(Number(projectId), project)
  }

  @Delete('/:projectId')
  async delete(
    @Param('projectId') projectId: number,
  ): Promise<ProjectListItem> {
    return await this.projectService.deleteProject(Number(projectId))
  }
}
