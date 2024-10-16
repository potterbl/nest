import { ProjectStatus } from '@prisma/client'

export type ProjectCreateUpdateDto = {
  userId: number
  name: string
  url: string
  status: ProjectStatus
  expiredAt?: Date
}
