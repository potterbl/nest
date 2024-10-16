import { ProjectStatus } from '@prisma/client'

export type ProjectListItem = {
  id: number
  name: string
  url: string
  status: ProjectStatus
  expiredAt?: Date
  createdAt: Date
  updatedAt?: Date
}

export type ProjectListResponse = ProjectListItem[]
