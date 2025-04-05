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

export async function GET() {
  try {
    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 모든 프로젝트 데이터 가져오기
    const { data: projects, error: projectsError } = await supabase
      .from("projects")
      .select("id, title, description, created_at")
      .order("created_at", { ascending: false });
    
    if (projectsError) {
      console.error("프로젝트 데이터 가져오기 오류:", projectsError);
      return NextResponse.json(
        { error: "프로젝트 데이터를 가져오는데 실패했습니다." },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ projects }, { status: 200 });
  } catch (error) {
    console.error("서버 목록 가져오기 오류:", error);
    return NextResponse.json(
      { error: "서버 목록을 가져오는데 실패했습니다." },
      { status: 500 }
    );
  }
} 