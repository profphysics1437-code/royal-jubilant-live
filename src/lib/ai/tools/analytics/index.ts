import { PrismaClient } from '@prisma/client';
import type { AITool } from '../../types';
const prisma = new PrismaClient();

export const getMarketStatsTool: AITool = {
  name: 'get_market_stats',
  description: 'Get market statistics.',
  category: 'analytics',
  parameters: { community: { type: 'string', description: 'Community' } },
  handler: async (args) => {
    try {
      const where: any = { status: 'active' };
      if (args.community) where.location = { contains: args.community, mode: 'insensitive' };
      const [total, avgPrice, byType] = await Promise.all([
        prisma.property.count({ where }),
        prisma.property.aggregate({ where, _avg: { price: true } }),
        prisma.property.groupBy({ by: ['type'], where, _count: true, _avg: { price: true } }),
      ]);
      return { callId: '', success: true, data: { totalListings: total, averagePrice: avgPrice._avg.price ? Math.round(avgPrice._avg.price) : null, byType: byType.map(t => ({ type: t.type, count: t._count, avgPrice: t._avg.price ? Math.round(t._avg.price) : null })), currency: 'AED' } };
    } catch (e: any) { return { callId: '', success: false, error: e.message }; }
  },
};

export const getAgentStatsTool: AITool = {
  name: 'get_agent_stats',
  description: 'Get agent performance stats.',
  category: 'analytics',
  parameters: { agentId: { type: 'string', description: 'Agent ID' } },
  handler: async (args) => {
    try {
      const [listings, leads] = await Promise.all([
        prisma.property.count({ where: { agentId: args.agentId } }),
        prisma.lead.count({ where: { assignedTo: args.agentId } }),
      ]);
      return { callId: '', success: true, data: { totalListings: listings, totalLeads: leads } };
    } catch (e: any) { return { callId: '', success: false, error: e.message }; }
  },
};

export const analyticsTools = [getMarketStatsTool, getAgentStatsTool];
