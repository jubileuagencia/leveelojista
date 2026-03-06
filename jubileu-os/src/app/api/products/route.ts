import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'member'].includes(profile.role)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || '20', 10);
  const search = searchParams.get('search') || '';
  const status = searchParams.get('status') || 'active'; // active | inactive | all
  const categoryId = searchParams.get('categoryId') || '';

  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from('products')
    .select('*, categories(*)', { count: 'exact' })
    .is('deleted_at', null)
    .order('display_id', { ascending: true })
    .range(from, to);

  // Status filter
  if (status === 'active') {
    query = query.eq('is_active', true);
  } else if (status === 'inactive') {
    query = query.eq('is_active', false);
  }

  // Category filter
  if (categoryId) {
    query = query.eq('category_id', categoryId);
  }

  // Search filter
  if (search) {
    const isNumeric = /^\d+$/.test(search);
    if (isNumeric) {
      query = query.eq('display_id', parseInt(search, 10));
    } else {
      query = query.ilike('name', `%${search}%`);
    }
  }

  const { data: products, error, count } = await query;

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({
    data: products,
    total: count ?? 0,
    page,
    pageSize,
    totalPages: Math.ceil((count ?? 0) / pageSize),
  });
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (profile?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const body = await request.json();
  const { name, description, price, unit, image_url, category_id, is_active } = body;

  if (!name || name.length < 2) {
    return NextResponse.json({ error: 'Nome obrigatorio (min 2 caracteres)' }, { status: 400 });
  }
  if (price === undefined || price === null || price < 0) {
    return NextResponse.json({ error: 'Preco obrigatorio (>= 0)' }, { status: 400 });
  }
  if (!unit) {
    return NextResponse.json({ error: 'Unidade obrigatoria' }, { status: 400 });
  }

  const { data: product, error } = await supabase
    .from('products')
    .insert({
      name,
      description: description || null,
      price,
      unit,
      image_url: image_url || null,
      category_id: category_id || null,
      is_active: is_active !== undefined ? is_active : true,
    })
    .select('*, categories(*)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(product, { status: 201 });
}
