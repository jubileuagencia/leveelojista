import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: product, error } = await supabase
    .from('products')
    .select('*, categories(*)')
    .eq('id', productId)
    .is('deleted_at', null)
    .single();

  if (error || !product) {
    return NextResponse.json({ error: 'Produto nao encontrado' }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
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
  const updates: Record<string, unknown> = {};

  if (body.name !== undefined) updates.name = body.name;
  if (body.description !== undefined) updates.description = body.description;
  if (body.price !== undefined) updates.price = body.price;
  if (body.unit !== undefined) updates.unit = body.unit;
  if (body.image_url !== undefined) updates.image_url = body.image_url;
  if (body.category_id !== undefined) updates.category_id = body.category_id || null;
  if (body.is_active !== undefined) updates.is_active = body.is_active;

  const { data: product, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', productId)
    .is('deleted_at', null)
    .select('*, categories(*)')
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(product);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ productId: string }> },
) {
  const { productId } = await params;
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

  // Soft-delete
  const { error } = await supabase
    .from('products')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', productId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true });
}
