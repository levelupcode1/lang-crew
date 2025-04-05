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

import { NextResponse } from 'next/server';
import { saveProject } from '@/services/project';
import { Project } from '@/types/project';
import { genUuid } from '@/utils';
import { getIsoTimestr } from '@/utils/time';

export async function POST(request: Request) {
  try {
    const projectData: Project = await request.json();
    
    // 기본 유효성 검사
    if (!projectData.name || !projectData.title || !projectData.description) {
      return NextResponse.json(
        { error: '필수 필드가 누락되었습니다.' },
        { status: 400 }
      );
    }
    
    // UUID 및 시간 추가
    projectData.uuid = genUuid();
    const currentTime = getIsoTimestr();
    projectData.created_at = currentTime;
    projectData.updated_at = currentTime;
    
    // 프로젝트 저장
    const project = await saveProject(projectData);
    
    return NextResponse.json(
      { success: true, project },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('프로젝트 등록 오류:', error);
    return NextResponse.json(
      { error: error.message || '프로젝트 등록 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 