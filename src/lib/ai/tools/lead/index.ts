import { PrismaClient } from '@prisma/client';
import type { AITool } from '../../types';
const prisma = new PrismaClient();

export const createLeadTool: AITool = {
  name: 'create_lead',
  description: 'Create a new lead in CRM.',
  category: 'lead',
  parameters: {
    name: { type: 'string', description: 'Lead name', required: true },
    phone: { type: 'string', description: 'Phone' },
    email: { type: 'string', description: 'Email' },
    interest: { type: 'string', description: 'Interest' },
    source: { type: 'string', description: 'Source', enum: ['ai-chat', 'website', 'referral'] },
  },
  handler: async (args) => {
    try {
      const lead = await prisma.lead.create({ data: { name: args.name, phone: args.phone || null, email: args.email || null, message: args.interest || null, source: args.source || 'ai-chat', status: 'new', type: 'buyer' } });
      return { callId: '', success: true, data: { id: lead.id, message: 'Lead created. An agent will contact you within 24 hours.' } };
    } catch (e: any) { return { callId: '', success: false, error: e.message }; }
  },
};

export const searchLeadsTool: AITool = {
  name: 'search_leads',
  description: 'Search leads in CRM.',
  category: 'lead',
  parameters: { status: { type: 'string', description: 'Status' }, name: { type: 'string', description: 'Name' }, limit: { type: 'number', description: 'Limit' } },
  handler: async (args) => {
    try {
      const where: any = {};
      if (args.status) where.status = args.status;
      if (args.name) where.name = { contains: args.name, mode: 'insensitive' };
      const leads = await prisma.lead.findMany({ where, take: args.limit || 10, orderBy: { createdAt: 'desc' } });
      return { callId: '', success: true, data: leads };
    } catch (e: any) { return { callId: '', success: false, error: e.message }; }
  },
};

export const leadTools = [createLeadTool, searchLeadsTool];
