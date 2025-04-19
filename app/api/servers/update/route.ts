/**
 * Copyright 2024 sungryeong lee
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * 
 * GitHub: https://github.com/sungreong
 * Email: leesungreong@gmail.com
 */

import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// Supabase 클라이언트 초기화
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_ANON_KEY!;

export async function PUT(request: Request) {
  try {
    const projectData = await request.json();
    console.log('받은 프로젝트 데이터:', projectData);
    
    // id 필드가 있으면 해당 ID를 사용하고, 없으면 uuid 사용
    const serverId = projectData.id || projectData.uuid;
    
    // 기본 유효성 검사
    if (!serverId || !projectData.title || !projectData.description) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다. (id 또는 uuid, title, description)' },
        { status: 400 }
      );
    }
    
    // 현재 시간 업데이트
    projectData.updated_at = new Date().toISOString();
    
    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 프로젝트 업데이트
    const { error: projectUpdateError } = await supabase
      .from("projects")
      .update({
        name: projectData.name,
        title: projectData.title,
        description: projectData.description,
        url: projectData.url,
        author_name: projectData.author_name,
        tags: projectData.tags,
        category: projectData.category,
        updated_at: projectData.updated_at,
        status: 'created'
      })
      .eq("id", serverId);
    
    if (projectUpdateError) {
      console.error("프로젝트 업데이트 오류:", projectUpdateError);
      return NextResponse.json(
        { error: "서버 정보 업데이트에 실패했습니다." },
        { status: 500 }
      );
    }
    
    // 업데이트 후 프로젝트 데이터 재조회하여 반환
    const { data: updatedProject, error: fetchError } = await supabase
      .from("projects")
      .select("*")
      .eq("id", serverId)
      .single();
      
    if (fetchError) {
      console.error("업데이트된 프로젝트 조회 오류:", fetchError);
    }
    
    return NextResponse.json({
      message: "서버 정보가 성공적으로 업데이트되었습니다.",
      project: updatedProject || {
        id: serverId,
        title: projectData.title
      }
    }, { status: 200 });
  } catch (error) {
    console.error("서버 업데이트 오류:", error);
    return NextResponse.json(
      { error: "서버 정보를 업데이트하는데 실패했습니다." },
      { status: 500 }
    );
  }
} 