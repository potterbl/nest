import { Module } from '@nestjs/common'
import { ProjectController } from './controller/project.controller'
import { ProjectService } from './service/project.service'
import { PrismaService } from '../lib/prisma'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'

@Module({
  imports: [],
  controllers: [ProjectController],
  providers: [ProjectService, PrismaService, JwtService, ConfigService],
})
export class ProjectModule {}
