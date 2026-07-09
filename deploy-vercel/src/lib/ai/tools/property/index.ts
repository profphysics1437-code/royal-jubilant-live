import { PrismaClient } from '@prisma/client';
import type { AITool } from '../../types';
const prisma = new PrismaClient();

export const searchPropertiesTool: AITool = {
  name: 'search_properties',
  description: 'Search properties with filters.',
  category: 'property',
  parameters: {
    purpose: { type: 'string', description: 'sale/rent/commercial/off-plan', enum: ['sale', 'rent', 'commercial', 'off-plan'] },
    location: { type: 'string', description: 'Community name' },
    type: { type: 'string', description: 'Property type' },
    minPrice: { type: 'number', description: 'Min price AED' },
    maxPrice: { type: 'number', description: 'Max price AED' },
    beds: { type: 'number', description: 'Bedrooms' },
    limit: { type: 'number', description: 'Max results' },
  },
  handler: async (args) => {
    try {
      const where: any = { status: 'active' };
      if (args.purpose) where.purpose = args.purpose;
      if (args.location) where.location = { contains: args.location, mode: 'insensitive' };
      if (args.type) where.type = { contains: args.type, mode: 'insensitive' };
      if (args.beds) where.bedrooms = args.beds;
      if (args.minPrice || args.maxPrice) {
        where.price = {};
        if (args.minPrice) where.price.gte = args.minPrice;
        if (args.maxPrice) where.price.lte = args.maxPrice;
      }
      const properties = await prisma.property.findMany({ where, take: args.limit || 6, orderBy: { createdAt: 'desc' }, include: { agent: true } });
      return { callId: '', success: true, data: properties.map(p => ({ id: p.id, title: p.title, type: p.type, purpose: p.purpose, price: p.price, location: p.location, bedrooms: p.bedrooms, bathrooms: p.bathrooms, area: p.area, agent: p.agent ? { name: p.agent.name, phone: p.agent.phone } : null })) };
    } catch (e: any) { return { callId: '', success: false, error: e.message }; }
  },
};

export const getPropertyDetailsTool: AITool = {
  name: 'get_property_details',
  description: 'Get property details by ID.',
  category: 'property',
  parameters: { id: { type: 'string', description: 'Property ID', required: true } },
  handler: async (args) => {
    try {
      const p = await prisma.property.findUnique({ where: { id: args.id }, include: { agent: true, community: true, developer: true } });
      if (!p) return { callId: '', success: false, error: 'Property not found' };
      return { callId: '', success: true, data: p };
    } catch (e: any) { return { callId: '', success: false, error: e.message }; }
  },
};

export const estimateValuationTool: AITool = {
  name: 'estimate_valuation',
  description: 'Estimate property valuation.',
  category: 'property',
  parameters: {
    location: { type: 'string', description: 'Community', required: true },
    type: { type: 'string', description: 'Property type', required: true },
    area: { type: 'number', description: 'Area sqft', required: true },
    beds: { type: 'number', description: 'Bedrooms' },
  },
  handler: async (args) => {
    try {
      const comparable = await prisma.property.findMany({ where: { location: { contains: args.location, mode: 'insensitive' }, type: { contains: args.type, mode: 'insensitive' }, status: 'active' }, take: 10, select: { price: true, area: true } });
      if (comparable.length === 0) return { callId: '', success: true, data: { estimatedValue: null, message: 'No comparables found. Contact agent for accurate valuation.' } };
      const avgPricePerSqft = comparable.reduce((s, p) => s + (p.price / (p.area || 1000)), 0) / comparable.length;
      return { callId: '', success: true, data: { estimatedValue: Math.round(avgPricePerSqft * args.area), pricePerSqft: Math.round(avgPricePerSqft), comparables: comparable.length, currency: 'AED' } };
    } catch (e: any) { return { callId: '', success: false, error: e.message }; }
  },
};

export const propertyTools = [searchPropertiesTool, getPropertyDetailsTool, estimateValuationTool];
