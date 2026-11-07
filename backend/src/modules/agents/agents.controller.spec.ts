import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AgentsController } from './agents.controller.js';
import { OrchestratorService } from './orchestrator.service.js';
import { AgentType } from '@prisma/client';

describe('AgentsController', () => {
  let controller: AgentsController;
  let orchestrator: OrchestratorService;

  beforeEach(() => {
    orchestrator = {
      processUserPrompt: vi.fn().mockResolvedValue({
        answer: 'Financial overview generated',
        intentIdentified: 'TEST_INTENT',
        delegatedAgents: [AgentType.FINANCIAL_ANALYST],
        reasoningSteps: ['Step 1', 'Step 2'],
        supportingData: { runwayMonths: 14.8 },
        actionItems: ['Review AWS nodes'],
      }),
      getAgentsStatus: vi.fn().mockResolvedValue([
        {
          agentType: AgentType.FINANCIAL_ANALYST,
          name: 'Agent 1: Financial Analyst',
          status: 'ONLINE',
          tasksCompleted: 36,
          averageLatencyMs: 140,
        },
      ]),
      getTasks: vi.fn().mockResolvedValue([]),
      approveTask: vi.fn().mockResolvedValue({ id: 'task-1', status: 'COMPLETED' }),
      rejectTask: vi.fn().mockResolvedValue({ id: 'task-1', status: 'CANCELLED' }),
      runAgentDirect: vi.fn().mockResolvedValue({ status: 'ok' }),
    } as unknown as OrchestratorService;

    controller = new AgentsController(orchestrator);
  });

  it('should process user prompt via orchestrator', async () => {
    const res = await controller.chat({ prompt: 'What is our runway?' });
    expect(res.answer).toBe('Financial overview generated');
    expect(res.intentIdentified).toBe('TEST_INTENT');
    expect(orchestrator.processUserPrompt).toHaveBeenCalledWith('What is our runway?');
  });

  it('should return agent statuses', async () => {
    const res = await controller.getStatus();
    expect(res.length).toBe(1);
    expect(res[0].name).toContain('Financial Analyst');
  });

  it('should approve task with human actor', async () => {
    const res = await controller.approveTask('task-1', { approvedBy: 'CFO' });
    expect(res.status).toBe('COMPLETED');
    expect(orchestrator.approveTask).toHaveBeenCalledWith('task-1', 'CFO');
  });
});
