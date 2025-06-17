// 한글 주석: MCP 서버 등록 페이지
"use client";

import RegisterMcpPage from '@/components/RegisterMcpModal';
import { useRouter } from 'next/navigation';
import { Project } from '@/types/project';

export default function RegisterMcpRoutePage() {
  const router = useRouter();

  // 한글 주석: 서버 등록 처리 함수
  const handleSubmitProject = async (projectData: Project) => {
    const response = await fetch('/api/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(projectData),
    });
    if (!response.ok) {
      const errorData = await response.json();
      alert(errorData.error || '프로젝트 등록에 실패했습니다.');
      return;
    }
    // 한글 주석: 등록 성공 시 메인 페이지로 이동
    router.push('/');
  };

  return <RegisterMcpPage onSubmit={handleSubmitProject} />;
} 