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
const deletePassword = process.env.SERVER_DELETE_PASSWORD!;

export async function DELETE(request: Request) {
  try {
    const { password, serverIds } = await request.json();
    
    // 비밀번호 확인
    if (!password || password !== deletePassword) {
      return NextResponse.json(
        { error: "비밀번호가 일치하지 않습니다." },
        { status: 401 }
      );
    }
    
    // 서버 ID 확인
    if (!serverIds || !Array.isArray(serverIds) || serverIds.length === 0) {
      return NextResponse.json(
        { error: "삭제할 서버가 선택되지 않았습니다." },
        { status: 400 }
      );
    }
    
    // Supabase 클라이언트 생성
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // 1. 서버 구성 데이터 삭제 시도 (테이블이 없어도 오류 무시)
    try {
      await supabase
        .from("server_configs")
        .delete()
        .in("project_id", serverIds);
    } catch (configError) {
      console.error("서버 구성 데이터 삭제 오류:", configError);
      // 테이블이 없는 경우는 무시하고 계속 진행
    }
    
    // 2. 선택된 프로젝트 데이터 삭제
    const { error: projectsError } = await supabase
      .from("projects")
      .delete()
      .in("id", serverIds);
    
    if (projectsError) {
      console.error("프로젝트 데이터 삭제 오류:", projectsError);
      return NextResponse.json(
        { error: "프로젝트 데이터 삭제 중 오류가 발생했습니다." },
        { status: 500 }
      );
    }
    
    return NextResponse.json({
      message: `${serverIds.length}개의 서버가 성공적으로 삭제되었습니다.`,
      count: serverIds.length
    }, { status: 200 });
  } catch (error) {
    console.error("서버 삭제 오류:", error);
    return NextResponse.json(
      { error: "서버 정보를 삭제하는데 실패했습니다." },
      { status: 500 }
    );
  }
} 