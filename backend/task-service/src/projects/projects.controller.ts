import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles('user', 'admin')
  create(@Body() createProjectDto: CreateProjectDto, @Request() req) {
    return this.projectsService.create({
      ...createProjectDto,
      members: [...createProjectDto.members, req.user.id],
    });
  }

  @Get()
  @Roles('user', 'admin')
  findAll() {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @Roles('user', 'admin')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(id);
  }

  @Patch(':id')
  @Roles('user', 'admin')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(id, updateProjectDto);
  }

  @Delete(':id')
  @Roles('user', 'admin')
  remove(@Param('id') id: string) {
    return this.projectsService.remove(id);
  }

  @Get('user/me')
  @Roles('user', 'admin')
  findMyProjects(@Request() req) {
    return this.projectsService.findByMember(req.user.id);
  }
} 