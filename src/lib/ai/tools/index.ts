/**
 * RJ AI — Tool Registry (Phase 4)
 * --------------------------------
 * Central registry for all AI tools.
 * Tools are isolated, typed, and permission-checked.
 * The AI calls tools by name — the registry routes to the correct implementation.
 *
 * SECURITY: Tools access the database internally but the AI NEVER sees Prisma directly.
 * Architecture: AI → Tool Registry → Tool Implementation → Business Logic → Prisma → DB
 */

import type { ToolDefinition, ToolContext, ToolResult, AIToolDefinition } from "../types";
import { checkToolPermission } from "../security";

// ─── Tool Registry ────────────────────────────────────────────────────

const toolRegistry = new Map<string, ToolDefinition>();

/**
 * Register a tool in the registry.
 * Called by each tool module on import.
 */
export function registerTool(tool: ToolDefinition): void {
  if (toolRegistry.has(tool.name)) {
    console.warn(`[Tool Registry] Tool "${tool.name}" is already registered. Overwriting.`);
  }
  toolRegistry.set(tool.name, tool);
}

/**
 * Get a tool by name.
 */
export function getTool(name: string): ToolDefinition | undefined {
  return toolRegistry.get(name);
}

/**
 * List all registered tools.
 */
export function listTools(): ToolDefinition[] {
  return Array.from(toolRegistry.values());
}

/**
 * Get tools available for a specific AI module + user role.
 * Returns both the tool definitions (for the AI) and the implementations (for execution).
 */
export function getAvailableTools(
  module: string,
  userRole: "customer" | "agent" | "admin" | undefined
): ToolDefinition[] {
  return listTools().filter((tool) => {
    // Check if the tool is allowed for this user role
    const effectiveRole = userRole || "customer";
    if (!tool.allowedRoles.includes(effectiveRole)) return false;

    // Module-specific filtering:
    // - Customer module: only property, lead, appointment tools
    // - Agent module: property, lead, appointment, content, crm tools
    // - Admin module: all tools
    // - Marketing module: content, marketing tools
    // - Analytics module: analytics tools
    if (module === "customer") {
      return ["property", "lead", "appointment"].includes(tool.category);
    }
    if (module === "agent") {
      return ["property", "lead", "appointment", "content", "crm"].includes(tool.category);
    }
    if (module === "marketing") {
      return ["content", "marketing"].includes(tool.category);
    }
    if (module === "analytics") {
      return ["analytics"].includes(tool.category);
    }
    // Admin has access to all tools
    return true;
  });
}

/**
 * Convert tool definitions to the format expected by AI providers (OpenAI function calling format).
 */
export function toolsToAISchema(tools: ToolDefinition[]): AIToolDefinition[] {
  return tools.map((tool) => ({
    type: "function" as const,
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.parameters,
    },
  }));
}

/**
 * Execute a tool by name with arguments.
 * Performs permission check before execution.
 */
export async function executeTool(
  name: string,
  args: Record<string, any>,
  ctx: ToolContext
): Promise<ToolResult> {
  const tool = getTool(name);

  if (!tool) {
    return {
      success: false,
      error: `Tool "${name}" not found.`,
      summary: `The requested tool "${name}" does not exist.`,
    };
  }

  // Permission check
  const permCheck = checkToolPermission(tool.allowedRoles, ctx);
  if (!permCheck.allowed) {
    return {
      success: false,
      error: permCheck.reason,
      summary: `Permission denied: ${permCheck.reason}`,
    };
  }

  try {
    // Execute the tool
    const result = await tool.execute(args, ctx);
    return result;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Tool execution failed",
      summary: `Tool execution error: ${error.message || "Unknown error"}`,
    };
  }
}
