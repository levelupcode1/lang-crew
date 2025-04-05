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

export async function POST(request: Request) {
  try {
    const { servers } = await request.json();
    
    // 유효성 검사
    if (!servers || !servers.projects || !Array.isArray(servers.projects)) {
      return NextResponse.json(
        { error: "유효하지 않은 서버 데이터 형식입니다." },
        { status: 400 }
      );
    }
    
    const { projects, serverConfigs } = servers;
    
    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 결과 추적용 변수
    const results = {
      imported: 0,
      failed: 0,
      errors: [] as string[],
    };
    
    // 각 프로젝트를 데이터베이스에 upsert
    for (const project of projects) {
      // project_id가 없는 경우 새 UUID 생성
      if (!project.id) {
        project.id = crypto.randomUUID();
      }
      
      // 프로젝트에 필수 필드가 있는지 확인
      if (!project.title || !project.description) {
        results.failed++;
        results.errors.push(`누락된 필수 필드: ${project.title || '제목 없음'}`);
        continue;
      }
      
      // created_at 및 updated_at이 없는 경우 현재 시간 설정
      const now = new Date().toISOString();
      if (!project.created_at) project.created_at = now;
      if (!project.updated_at) project.updated_at = now;
      
      // 프로젝트 삽입 또는 업데이트
      const { error: projectError } = await supabase
        .from("projects")
        .upsert(project, { onConflict: "id" });
      
      if (projectError) {
        console.error("프로젝트 업로드 오류:", projectError);
        results.failed++;
        results.errors.push(`프로젝트 업로드 실패: ${project.title}`);
      } else {
        results.imported++;
      }
    }
    
    // 서버 구성 데이터가 있는 경우 처리
    if (serverConfigs && Array.isArray(serverConfigs)) {
      for (const config of serverConfigs) {
        if (!config.project_id) {
          results.errors.push("서버 구성에 project_id가 없습니다.");
          continue;
        }
        
        // created_at 및 updated_at이 없는 경우 현재 시간 설정
        const now = new Date().toISOString();
        if (!config.created_at) config.created_at = now;
        if (!config.updated_at) config.updated_at = now;
        
        // 서버 구성 삽입 또는 업데이트
        const { error: configError } = await supabase
          .from("server_configs")
          .upsert(config, { onConflict: "project_id" });
        
        if (configError) {
          console.error("서버 구성 업로드 오류:", configError);
          results.errors.push(`서버 구성 업로드 실패: ${config.project_id}`);
        }
      }
    }
    
    return NextResponse.json({
      message: "서버 정보가 성공적으로 가져와졌습니다.",
      imported: results.imported,
      failed: results.failed,
      errors: results.errors,
    }, { status: 200 });
  } catch (error) {
    console.error("서버 정보 가져오기 오류:", error);
    return NextResponse.json(
      { error: "서버 정보를 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
} 