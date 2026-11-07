import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { OrchestratorService } from './orchestrator.service.js';
import { AgentType } from '@prisma/client';
import { IsString, IsOptional } from 'class-validator';

export class ChatQueryDto {
  @IsString()
  prompt!: string;
}

export class ApprovalActionDto {
  @IsString()
  @IsOptional()
  approvedBy?: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

@Controller('agents')
export class AgentsController {
  constructor(private readonly orchestrator: OrchestratorService) {}

  @Post('chat')
  async chat(@Body() dto: ChatQueryDto) {
    return this.orchestrator.processUserPrompt(dto.prompt);
  }

  @Get('status')
  async getStatus() {
    return this.orchestrator.getAgentsStatus();
  }

  @Get('tasks')
  async getTasks(@Query('limit') limit?: string) {
    return this.orchestrator.getTasks(limit ? parseInt(limit, 10) : 20);
  }

  @Post('tasks/:id/approve')
  async approveTask(@Param('id') id: string, @Body() dto: ApprovalActionDto) {
    return this.orchestrator.approveTask(id, dto.approvedBy);
  }

  @Post('tasks/:id/reject')
  async rejectTask(@Param('id') id: string, @Body() dto: ApprovalActionDto) {
    return this.orchestrator.rejectTask(id, dto.approvedBy, dto.reason);
  }

  @Post('run/:agentType')
  async runAgentDirect(@Param('agentType') agentType: AgentType) {
    return this.orchestrator.runAgentDirect(agentType);
  }
}
