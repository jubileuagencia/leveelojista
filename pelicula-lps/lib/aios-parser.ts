import fs from "fs";
import path from "path";

export type AgentData = {
  id: string;
  name: string;
  title: string;
  icon: string;
  archetype: string;
  role: string;
  style: string;
  focus: string;
  whenToUse: string;
  commands: { name: string; description: string }[];
  greeting: string;
  fileName: string;
};

export type WorkflowData = {
  id: string;
  name: string;
  version: string;
  description: string;
  type: string;
  phaseCount: number;
  stepCount: number;
  fileName: string;
};

function getProjectRoot(): string {
  // pelicula-lps is inside the monorepo root
  return path.resolve(process.cwd(), "..");
}

function extractYamlField(content: string, field: string): string {
  const regex = new RegExp(`^\\s*${field}:\\s*['"]?(.+?)['"]?\\s*$`, "m");
  const match = content.match(regex);
  return match ? match[1].trim() : "";
}

function extractYamlMultilineField(content: string, field: string): string {
  const regex = new RegExp(`^\\s*${field}:\\s*>-?\\s*\\n((?:[ \\t]+.+\\n?)+)`, "m");
  const match = content.match(regex);
  if (!match) return extractYamlField(content, field);
  return match[1]
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .join(" ");
}

function extractCommands(content: string): { name: string; description: string }[] {
  const commands: { name: string; description: string }[] = [];
  const cmdRegex = /- name:\s*(.+)\n\s+(?:visibility:[^\n]+\n\s+)?description:\s*['"]?(.+?)['"]?\s*$/gm;
  let match;
  while ((match = cmdRegex.exec(content)) !== null) {
    commands.push({
      name: match[1].trim(),
      description: match[2].trim(),
    });
  }
  return commands;
}

export function parseAgentFiles(): AgentData[] {
  const root = getProjectRoot();
  const agentsDir = path.join(root, ".aios-core", "development", "agents");

  if (!fs.existsSync(agentsDir)) return [];

  const files = fs.readdirSync(agentsDir).filter((f) => f.endsWith(".md"));
  const agents: AgentData[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(agentsDir, file), "utf-8");

      // Extract from YAML code fence
      const yamlMatch = content.match(/```yaml\n([\s\S]+?)```/);
      if (!yamlMatch) continue;
      const yaml = yamlMatch[1];

      const id = extractYamlField(yaml, "id");
      const name = extractYamlField(yaml, "name");
      const title = extractYamlField(yaml, "title");
      const icon = extractYamlField(yaml, "icon");
      const archetype = extractYamlField(yaml, "archetype");
      const role = extractYamlField(yaml, "role");
      const style = extractYamlField(yaml, "style");
      const focus = extractYamlField(yaml, "focus");
      const whenToUse = extractYamlField(yaml, "whenToUse");
      const greeting = extractYamlField(yaml, "minimal") || extractYamlField(yaml, "named");
      const commands = extractCommands(yaml);

      if (!id || !name) continue;

      agents.push({
        id,
        name,
        title: title || id,
        icon: icon || "🤖",
        archetype: archetype || "Agent",
        role: role || "",
        style: style || "",
        focus: focus || "",
        whenToUse: whenToUse || "",
        commands,
        greeting: greeting || "",
        fileName: file,
      });
    } catch {
      // skip files that fail to parse
    }
  }

  return agents.sort((a, b) => a.name.localeCompare(b.name));
}

export function parseWorkflowFiles(): WorkflowData[] {
  const root = getProjectRoot();
  const workflowsDir = path.join(root, ".aios-core", "development", "workflows");

  if (!fs.existsSync(workflowsDir)) return [];

  const files = fs.readdirSync(workflowsDir).filter((f) => f.endsWith(".yaml"));
  const workflows: WorkflowData[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(workflowsDir, file), "utf-8");

      const id = extractYamlField(content, "id");
      const name = extractYamlField(content, "name");
      const version = extractYamlField(content, "version") || "1.0";
      const description = extractYamlMultilineField(content, "description");
      const type = extractYamlField(content, "type") || "workflow";

      // Count phases and steps
      const phaseMatches = content.match(/phase_name:/g);
      const stepMatches = content.match(/- step:/g);
      const phaseCount = phaseMatches ? phaseMatches.length : 0;
      const stepCount = stepMatches ? stepMatches.length : 0;

      if (!id && !name) continue;

      workflows.push({
        id: id || file.replace(".yaml", ""),
        name: name || file.replace(".yaml", ""),
        version,
        description: description || "",
        type,
        phaseCount,
        stepCount,
        fileName: file,
      });
    } catch {
      // skip files that fail to parse
    }
  }

  return workflows.sort((a, b) => a.name.localeCompare(b.name));
}
