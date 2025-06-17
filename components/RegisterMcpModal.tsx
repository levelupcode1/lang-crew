"use client";

import { useState } from 'react';
import { Project } from '@/types/project';
import { createPortal } from 'react-dom';

interface RegisterMcpPageProps {
  onSubmit: (project: Project) => Promise<void>;
}

export default function RegisterMcpPage({ onSubmit }: RegisterMcpPageProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    title: '',
    description: '',
    url: '',
    author_name: '',
    tags: '',
    category: 'file-systems', // 기본 카테고리
  });
  
  const [serverConfig, setServerConfig] = useState<string>(`{
  "server-name": {
    "url": "http://localhost:3000/sse",
    "env": {
      "API_KEY": "value"
    }
  }
}`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleConfigChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setServerConfig(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // JSON 형식 검증
      try {
        JSON.parse(serverConfig);
      } catch (error) {
        alert('서버 구성 JSON 형식이 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }
      
      // 설명에 JSON 구성 추가
      const fullDescription = `${formData.description || ''}\n\n\`\`\`json\n${serverConfig}\n\`\`\``;
      
      // 필요한 필드 추가
      const projectData: Project = {
        ...formData,
        description: fullDescription,
        status: 'created',
        is_featured: false,
        sort: 0,
        target: '_self',
      } as Project;
      
      await onSubmit(projectData);
      // 한글 주석: 등록 후 이동 등 추가 처리 필요시 여기에 작성
    } catch (error) {
      console.error('등록 중 오류 발생:', error);
      alert('서버 등록 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 한글 주석: 전체 페이지로 렌더링
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="card w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50">
        <h2 className="text-2xl font-bold mb-4">MCP 서버 등록</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="label">서버 이름 (고유값) *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="input"
              placeholder="mcp-server-name"
            />
            <p className="text-xs text-muted mt-1">영문, 숫자, 하이픈만 사용 가능합니다.</p>
          </div>
          <div className="mb-4">
            <label className="label">서버 제목 *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="input"
              placeholder="MCP 파일 검색 서버"
            />
          </div>
          <div className="mb-4">
            <label className="label">설명 *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={3}
              className="input"
              placeholder="MCP 서버에 대한 간단한 설명을 입력하세요."
            />
          </div>
          <div className="mb-4">
            <label className="label">서버 구성 (Cursor SSE 형식) *</label>
            <textarea
              value={serverConfig}
              onChange={handleConfigChange}
              required
              rows={8}
              className="input font-mono text-sm"
              placeholder='{"server-name": {"url": "http://localhost:3000/sse", "env": {"API_KEY": "value"}}}'
            />
            <p className="text-xs text-muted mt-1">유효한 JSON 형식이어야 합니다. 이 정보는 서버 연결에 필수적입니다.</p>
          </div>
          <div className="mb-4">
            <label className="label">저장소 URL *</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              className="input"
              placeholder="https://github.com/username/repo"
            />
          </div>
          <div className="mb-4">
            <label className="label">작성자 이름</label>
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              className="input"
              placeholder="작성자 이름"
            />
          </div>
          <div className="mb-4">
            <label className="label">태그</label>
            <input
              type="text"
              name="tags"
              value={formData.tags}
              onChange={handleChange}
              className="input"
              placeholder="태그1,태그2,태그3 (쉼표로 구분)"
            />
          </div>
          <div className="mb-6">
            <label className="label">카테고리 *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="input"
            >
              <option value="file-systems">파일 시스템</option>
              <option value="developer-tools">개발자 도구</option>
              <option value="ai-chatbot">AI 챗봇</option>
              <option value="browser-automation">브라우저 자동화</option>
              <option value="cloud-platforms">클라우드 플랫폼</option>
              <option value="databases">데이터베이스</option>
              <option value="knowledge-and-memory">지식 및 기억</option>
              <option value="communication">커뮤니케이션</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="submit"
              className="button-primary"
              disabled={isLoading}
            >
              {isLoading ? '등록 중...' : '등록하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 