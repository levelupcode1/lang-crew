import { NextRequest, NextResponse } from 'next/server';
import { getSupabaseClient } from '@/models/db';

// 한글 주석: 댓글 목록 조회 (GET)
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const project_uuid = searchParams.get('project_uuid');
  if (!project_uuid) return NextResponse.json({ error: 'project_uuid required' }, { status: 400 });

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('project_uuid', project_uuid)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comments: data });
}

// 한글 주석: 댓글 등록 (POST)
export async function POST(req: NextRequest) {
  const { project_uuid, author, text } = await req.json();
  if (!project_uuid || !text || !author) return NextResponse.json({ error: '필수값 누락' }, { status: 400 });

  const supabase = getSupabaseClient();
  const { data, error } = await supabase
    .from('comments')
    .insert([{ project_uuid, author, text }])
    .select();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ comment: data[0] });
} 