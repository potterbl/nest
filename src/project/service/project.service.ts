import { Injectable } from '@nestjs/common'
import { PrismaService } from '../../lib/prisma'
import { Project } from '@prisma/client'
import {
  ProjectListItem,
  ProjectListResponse,
} from '../dto/project-list-response.dto'
import { ProjectCreateUpdateDto } from '../dto/project-create-update.dto'
import * as cron from 'node-cron'

@Injectable()
export class ProjectService {
  constructor(private readonly prismaService: PrismaService) {
    this.scheduleExpiredProjectsJob()
  }

  scheduleExpiredProjectsJob() {
    cron.schedule('*/1 * * * *', async () => {
      console.log('Running the job to update expired projects...')
      await this.updateExpiredProjects()
    })
  }

  async updateExpiredProjects(): Promise<void> {
    await this.prismaService.project.updateMany({
      where: {
        expiredAt: {
          lt: new Date(),
        },
        status: {
          not: 'expired',
        },
      },
      data: {
        status: 'expired',
      },
    })
    console.log('Expired projects have been updated.')
  }

  async getList(
    userId: number,
    search: string,
    offset: number,
    limit: number,
  ): Promise<ProjectListResponse> {
    const list = await this.prismaService.project.findMany({
      where: {
        userId,
        deletedAt: null,
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { url: { contains: search, mode: 'insensitive' } },
        ],
      },
      skip: offset,
      take: limit,
    })

    return list.map((x: Project) => x as ProjectListItem)
  }

  async createProject(
    project: ProjectCreateUpdateDto,
  ): Promise<ProjectListItem> {
    const newProject = await this.prismaService.project.create({
      data: {
        user: { connect: { id: project.userId } },
        name: project.name,
        url: project.url,
        status: project.status,
        expiredAt: project.expiredAt,
      },
    })

    return newProject
  }

  async updateProject(
    projectId: number,
    project: ProjectCreateUpdateDto,
  ): Promise<ProjectListItem> {
    const updatedProject = await this.prismaService.project.update({
      where: {
        id: projectId,
        deletedAt: null,
      },
      data: {
        user: { connect: { id: project.userId } },
        name: project.name,
        url: project.url,
        status: project.status,
        expiredAt: project.expiredAt,
      },
    })

    return updatedProject
  }

  async deleteProject(projectId: number): Promise<ProjectListItem> {
    const deletedProject = await this.prismaService.project.update({
      where: {
        id: projectId,
      },
      data: {
        deletedAt: new Date(),
      },
    })

    return deletedProject
  }
}
