import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod/v4';

const stepSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  type: z.enum(['manual', 'automated', 'approval', 'agent']),
  assignee: z.string().optional(),
  estimatedMinutes: z.number().positive().optional(),
  dependsOn: z.array(z.string()).optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

const createWorkflowSchema = z.object({
  name: z.string().min(1, 'Nome obrigatorio'),
  description: z.string().optional(),
  icon: z.string().default('📋'),
  category: z.enum(['content', 'client', 'development', 'operations', 'custom']),
  steps: z.array(stepSchema).min(1, 'Pelo menos 1 step obrigatorio'),
  is_template: z.boolean().default(false),
});

function isDevMode(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  return !url.includes('supabase.co') && !url.includes('supabase.in');
}

// In-memory store for dev mode
const devWorkflows: Record<string, Record<string, unknown>> = {};

// GET /api/workflows?category=xxx&is_active=true
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');
  const isActive = searchParams.get('is_active');

  if (isDevMode()) {
    let results = Object.values(devWorkflows);
    if (category) results = results.filter((w) => w.category === category);
    if (isActive !== null) results = results.filter((w) => w.is_active === (isActive !== 'false'));
    return NextResponse.json(results);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let query = supabase
    .from('workflow_definitions')
    .select('*')
    .order('created_at', { ascending: false });

  if (category) query = query.eq('category', category);
  if (isActive !== null) query = query.eq('is_active', isActive !== 'false');

  const { data, error } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/workflows — create new workflow definition
export async function POST(request: Request) {
  const body = await request.json();
  const parsed = createWorkflowSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.issues },
      { status: 400 }
    );
  }

  if (isDevMode()) {
    const id = `dev-wf-${Date.now()}`;
    const workflow = {
      id,
      ...parsed.data,
      is_active: true,
      created_by: 'dev-user-001',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    devWorkflows[id] = workflow;
    return NextResponse.json(workflow, { status: 201 });
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data, error } = await supabase
    .from('workflow_definitions')
    .insert({
      ...parsed.data,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
