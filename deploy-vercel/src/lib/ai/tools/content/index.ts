import { PrismaClient } from '@prisma/client';
import type { AITool } from '../../types';
const prisma = new PrismaClient();

export const searchBlogPostsTool: AITool = {
  name: 'search_blog_posts',
  description: 'Search blog posts by keyword.',
  category: 'content',
  parameters: { keyword: { type: 'string', description: 'Keyword', required: true }, limit: { type: 'number', description: 'Limit' } },
  handler: async (args) => {
    try {
      const posts = await prisma.blogPost.findMany({ where: { OR: [{ title: { contains: args.keyword, mode: 'insensitive' } }, { content: { contains: args.keyword, mode: 'insensitive' } }], published: true }, take: args.limit || 5, orderBy: { createdAt: 'desc' }, select: { id: true, title: true, excerpt: true, slug: true, createdAt: true, imageUrl: true } });
      return { callId: '', success: true, data: posts };
    } catch (e: any) { return { callId: '', success: false, error: e.message }; }
  },
};

export const searchFAQsTool: AITool = {
  name: 'search_faqs',
  description: 'Search FAQs by keyword.',
  category: 'content',
  parameters: { keyword: { type: 'string', description: 'Keyword', required: true } },
  handler: async (args) => {
    try {
      const faqs = await (prisma as any).faq?.findMany({ where: { OR: [{ question: { contains: args.keyword, mode: 'insensitive' } }, { answer: { contains: args.keyword, mode: 'insensitive' } }] }, take: 5 }) || [];
      return { callId: '', success: true, data: faqs };
    } catch (e: any) { return { callId: '', success: false, error: e.message }; }
  },
};

export const contentTools = [searchBlogPostsTool, searchFAQsTool];
