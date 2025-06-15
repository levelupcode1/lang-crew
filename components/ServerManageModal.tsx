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

"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useState, useRef, useCallback, useEffect } from "react";
import { FaDownload, FaUpload, FaSpinner, FaTrash, FaLock, FaEdit } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { Project } from "@/types/project";

interface ServerManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServerInfo {
  id: string;
  title: string;
  description: string;
  created_at: string;
  // 수정 기능을 위한 추가 필드
  name?: string;
  url?: string;
  author_name?: string;
  tags?: string;
  category?: string;
  content?: string;
}

// 서버 수정 모달 컴포넌트
interface EditServerModalProps {
  isOpen: boolean;
  onClose: () => void;
  server: ServerInfo | null;
  onSubmit: (server: Project) => Promise<void>;
}

function EditServerModal({ isOpen, onClose, server, onSubmit }: EditServerModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({
    name: '',
    title: '',
    description: '',
    url: '',
    author_name: '',
    tags: '',
    category: 'file-systems',
  });
  
  const [serverConfig, setServerConfig] = useState<string>('');
  const [categories, setCategories] = useState<{name: string, title: string}[]>([]);

  // 카테고리 목록 로드
  useEffect(() => {
    async function loadCategories() {
      try {
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.categories || []);
        } else {
          console.error('카테고리 로드 실패');
        }
      } catch (error) {
        console.error('카테고리 로드 오류:', error);
      }
    }
    
    loadCategories();
  }, []);

  // 서버 정보가 변경될 때 폼 데이터 초기화
  useEffect(() => {
    if (server) {
      // 설명에서 JSON 구성 추출
      let description = server.description || '';
      let config = '';
      
      const jsonMatch = description.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        config = jsonMatch[1];
        description = description.replace(/```json\n[\s\S]*?\n```/, '').trim();
      }
      
      console.log('서버 정보:', server);
      
      setFormData({
        // 중요: uuid에 id 값을 그대로 유지
        uuid: server.id,
        id: server.id, // id 필드도 추가
        name: server.name || '',
        title: server.title || '',
        description: description,
        url: server.url || '',
        author_name: server.author_name || '',
        tags: server.tags || '',
        category: server.category || 'file-systems',
      });
      
      setServerConfig(config);
    }
  }, [server]);

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
        toast.error('서버 구성 JSON 형식이 올바르지 않습니다.');
        setIsLoading(false);
        return;
      }
      
      // 설명에 JSON 구성 추가
      const fullDescription = `${formData.description || ''}\n\n\`\`\`json\n${serverConfig}\n\`\`\``;
      
      // 필요한 필드 추가
      const projectData: Project = {
        ...formData,
        description: fullDescription,
        status: 'active',
      } as Project;
      
      await onSubmit(projectData);
      onClose();
    } catch (error) {
      console.error('수정 중 오류 발생:', error);
      toast.error('서버 수정 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/25 dark:bg-black/60" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-zinc-900 p-6 text-left align-middle shadow-xl transition-all border border-gray-200 dark:border-zinc-700">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100"
                >
                  MCP 서버 수정
                </Dialog.Title>
                
                <form onSubmit={handleSubmit} className="mt-4">
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      서버 이름 (고유값) *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="mcp-server-name"
                    />
                    <p className="text-xs text-gray-500 mt-1">영문, 숫자, 하이픈만 사용 가능합니다.</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      서버 제목 *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="MCP 파일 검색 서버"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      설명 *
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="MCP 서버에 대한 간단한 설명을 입력하세요."
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      서버 구성 (Cursor SSE 형식) *
                    </label>
                    <div className="bg-gray-100 p-2 rounded-t-md border-t border-l border-r border-gray-300">
                      <code className="text-xs text-gray-700">JSON 형식으로 서버 구성을 입력하세요</code>
                    </div>
                    <textarea
                      value={serverConfig}
                      onChange={handleConfigChange}
                      required
                      rows={8}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-b-md font-mono text-sm bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100"
                      placeholder='{"server-name": {"url": "http://localhost:3000/sse", "env": {"API_KEY": "value"}}}'
                    />
                    <p className="text-xs text-gray-500 mt-1">유효한 JSON 형식이어야 합니다. 이 정보는 서버 연결에 필수적입니다.</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      저장소 URL *
                    </label>
                    <input
                      type="url"
                      name="url"
                      value={formData.url}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="https://github.com/username/repo"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      작성자 이름
                    </label>
                    <input
                      type="text"
                      name="author_name"
                      value={formData.author_name}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="작성자 이름"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      태그 (쉼표로 구분)
                    </label>
                    <input
                      type="text"
                      name="tags"
                      value={formData.tags}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="태그1, 태그2, 태그3"
                    />
                    <p className="text-xs text-gray-500 mt-1">쉼표로 구분하여 여러 태그를 입력할 수 있습니다.</p>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      카테고리
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-zinc-700 rounded-md bg-white dark:bg-zinc-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {categories.length > 0 ? (
                        categories.map((category) => (
                          <option key={category.name} value={category.name}>
                            {category.title}
                          </option>
                        ))
                      ) : (
                        <>
                          <option value="file-systems">파일 시스템</option>
                          <option value="search">검색</option>
                          <option value="content-generation">콘텐츠 생성</option>
                          <option value="code-analysis">코드 분석</option>
                          <option value="data-processing">데이터 처리</option>
                          <option value="other">기타</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div className="flex justify-end space-x-2 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                    >
                      취소
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md flex items-center"
                    >
                      {isLoading ? (
                        <>
                          <FaSpinner className="animate-spin mr-2" /> 처리 중...
                        </>
                      ) : (
                        "저장"
                      )}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}

export default function ServerManageModal({
  isOpen,
  onClose,
}: ServerManageModalProps) {
  const [isDownloading, setIsDownloading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState("");
  const [servers, setServers] = useState<ServerInfo[]>([]);
  const [selectedServers, setSelectedServers] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // 서버 수정 관련 상태 추가
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedServer, setSelectedServer] = useState<ServerInfo | null>(null);

  // 서버 목록 로드
  const loadServers = async () => {
    if (!isOpen) return;
    
    try {
      setIsLoading(true);
      const response = await fetch("/api/servers/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("서버 목록을 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      setServers(data.projects || []);
    } catch (error) {
      console.error("서버 목록 로드 오류:", error);
      toast.error("서버 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 모달이 열릴 때 서버 목록 로드
  useEffect(() => {
    if (isOpen) {
      loadServers();
      setSelectedServers([]);
    }
  }, [isOpen]);

  // 체크박스 변경 처리
  const handleCheckboxChange = (serverId: string) => {
    setSelectedServers(prev => {
      if (prev.includes(serverId)) {
        return prev.filter(id => id !== serverId);
      } else {
        return [...prev, serverId];
      }
    });
  };

  // 모든 체크박스 선택/해제
  const handleSelectAllChange = () => {
    if (selectedServers.length === servers.length) {
      setSelectedServers([]);
    } else {
      setSelectedServers(servers.map(server => server.id));
    }
  };

  // 서버 수정을 위해 항목 선택
  const handleServerEdit = (server: ServerInfo) => {
    setSelectedServer(server);
    setEditModalOpen(true);
  };

  // 서버 수정 폼 제출 처리
  const handleEditSubmit = async (projectData: Project) => {
    try {
      console.log('수정할 프로젝트 데이터:', projectData);
      
      // id 필드와 uuid 필드가 동일한지 확인
      if (projectData.id && projectData.uuid && projectData.id !== projectData.uuid) {
        console.warn('id와 uuid가 다릅니다. id를 사용합니다.');
        projectData.uuid = projectData.id;
      }
      
      const response = await fetch('/api/servers/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(projectData),
      });
      
      // 응답이 JSON이 아닌 경우 텍스트로 처리
      if (!response.headers.get('content-type')?.includes('application/json')) {
        const text = await response.text();
        console.error('서버 응답이 JSON이 아닙니다:', text);
        throw new Error('서버에서 잘못된 응답 형식을 반환했습니다.');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '서버 수정에 실패했습니다.');
      }
      
      const result = await response.json();
      console.log('수정 결과:', result);
      toast.success('서버가 성공적으로 수정되었습니다.');
      
      // 서버 목록 새로고침
      loadServers();
    } catch (error: any) {
      console.error("서버 수정 오류:", error);
      toast.error(error.message || "서버 수정 중 오류가 발생했습니다.");
    }
  };

  // 서버 수정 모달 닫기
  const closeEditModal = () => {
    setEditModalOpen(false);
    setSelectedServer(null);
  };
  
  // 모든 서버 정보 다운로드
  const downloadAllServers = async () => {
    try {
      setIsDownloading(true);
      const response = await fetch("/api/servers/export", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("서버 정보를 가져오는데 실패했습니다.");
      }

      const data = await response.json();
      
      // 다운로드 파일 생성
      const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `mcp-servers-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("모든 서버 정보가 성공적으로 다운로드 되었습니다.");
    } catch (error) {
      console.error("서버 다운로드 오류:", error);
      toast.error("서버 정보 다운로드 중 오류가 발생했습니다.");
    } finally {
      setIsDownloading(false);
    }
  };

  // 파일 선택 핸들러
  const handleFileSelect = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // 파일 업로드 핸들러
  const handleFileUpload = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        setIsUploading(true);
        
        // 파일 내용 읽기
        const fileContent = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsText(file);
        });

        // JSON 파싱 검증
        let serversData;
        try {
          serversData = JSON.parse(fileContent);
        } catch (e) {
          throw new Error("유효하지 않은 JSON 파일입니다.");
        }

        // 서버에 업로드
        const response = await fetch("/api/servers/import", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ servers: serversData }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "서버 등록에 실패했습니다.");
        }

        const result = await response.json();
        toast.success(`${result.imported} 개의 서버가 성공적으로 등록되었습니다.`);
        
        // 파일 입력 초기화
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        
        // 서버 목록 새로고침
        loadServers();
      } catch (error: any) {
        console.error("서버 업로드 오류:", error);
        toast.error(error.message || "서버 등록 중 오류가 발생했습니다.");
      } finally {
        setIsUploading(false);
      }
    },
    [loadServers]
  );

  // 서버 삭제 확인 대화상자 표시
  const showDeleteConfirmDialog = () => {
    if (selectedServers.length === 0) {
      toast.error("삭제할 서버를 선택해주세요.");
      return;
    }
    setShowDeleteConfirm(true);
  };

  // 서버 삭제 취소
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeletePassword("");
  };

  // 서버 삭제 실행
  const confirmDelete = async () => {
    if (!deletePassword) {
      toast.error("비밀번호를 입력해주세요.");
      return;
    }

    if (selectedServers.length === 0) {
      toast.error("삭제할 서버를 선택해주세요.");
      return;
    }

    try {
      setIsDeleting(true);
      
      // 서버 삭제 API 호출
      const response = await fetch("/api/servers/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          password: deletePassword,
          serverIds: selectedServers
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "서버 삭제에 실패했습니다.");
      }

      const result = await response.json();
      toast.success(result.message || `${selectedServers.length}개의 서버가 삭제되었습니다.`);
      
      // 삭제 완료 후 초기화
      setShowDeleteConfirm(false);
      setDeletePassword("");
      setSelectedServers([]);
      
      // 서버 목록 새로고침
      loadServers();
    } catch (error: any) {
      console.error("서버 삭제 오류:", error);
      toast.error(error.message || "서버 삭제 중 오류가 발생했습니다.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-2xl card text-left align-middle transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-bold mb-4"
                  >
                    서버 일괄 관리
                  </Dialog.Title>
                  
                  <div className="mt-4">
                    <p className="text-sm text-muted mb-6">
                      시스템에 등록된 서버를 관리하고, JSON 형식으로 다운로드하거나,
                      JSON 파일을 업로드하여 여러 서버를 한 번에 등록할 수 있습니다.
                    </p>

                    <div className="flex flex-col gap-4 mb-6">
                      <button
                        type="button"
                        className="button-primary flex items-center justify-center"
                        onClick={downloadAllServers}
                        disabled={isDownloading}
                      >
                        {isDownloading ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            다운로드 중...
                          </>
                        ) : (
                          <>
                            <FaDownload className="mr-2" />
                            모든 서버 정보 다운로드
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        className="button-secondary flex items-center justify-center"
                        onClick={handleFileSelect}
                        disabled={isUploading}
                      >
                        {isUploading ? (
                          <>
                            <FaSpinner className="animate-spin mr-2" />
                            업로드 중...
                          </>
                        ) : (
                          <>
                            <FaUpload className="mr-2" />
                            JSON 파일로 서버 등록
                          </>
                        )}
                      </button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".json"
                        onChange={handleFileUpload}
                      />
                    </div>

                    {/* 서버 목록 */}
                    <div className="border rounded-xl overflow-hidden bg-secondary">
                      <div className="p-3 border-b flex items-center">
                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            className="input h-4 w-4 mr-2"
                            checked={servers.length > 0 && selectedServers.length === servers.length}
                            onChange={handleSelectAllChange}
                            id="select-all"
                          />
                          <label htmlFor="select-all" className="label m-0">전체 선택</label>
                        </div>
                        <div className="ml-auto">
                          <button
                            type="button"
                            className="button-secondary flex items-center"
                            onClick={showDeleteConfirmDialog}
                            disabled={isDeleting || showDeleteConfirm || selectedServers.length === 0}
                          >
                            <FaTrash className="mr-1" />
                            선택 삭제
                          </button>
                        </div>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {isLoading ? (
                          <div className="flex justify-center items-center p-8">
                            <FaSpinner className="animate-spin text-primary mr-2" />
                            <span>서버 목록 로딩 중...</span>
                          </div>
                        ) : servers.length === 0 ? (
                          <div className="p-4 text-center text-muted">
                            등록된 서버가 없습니다.
                          </div>
                        ) : (
                          <ul className="divide-y divide-border">
                            {servers.map((server) => (
                              <li key={server.id} className="p-3 hover:bg-secondary cursor-pointer rounded-xl transition-all">
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    id={`server-${server.id}`}
                                    className="input h-4 w-4 mr-2"
                                    checked={selectedServers.includes(server.id)}
                                    onChange={() => handleCheckboxChange(server.id)}
                                    onClick={(e) => e.stopPropagation()}
                                  />
                                  <div 
                                    className="ml-3 flex-grow flex justify-between items-center"
                                    onClick={() => handleServerEdit(server)}
                                  >
                                    <div>
                                      <div className="font-medium text-foreground">
                                        {server.title}
                                      </div>
                                      <div className="text-xs text-muted mt-1">
                                        {server.created_at.split('T')[0]} 등록
                                      </div>
                                    </div>
                                    <FaEdit className="text-primary" />
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>

                    {/* 삭제 확인 대화상자 */}
                    {showDeleteConfirm && (
                      <div className="mt-4 p-4 border border-accent rounded-xl bg-accent/10">
                        <h4 className="text-accent font-medium mb-2 flex items-center">
                          <FaLock className="mr-2" /> 서버 삭제 확인
                        </h4>
                        <p className="text-sm text-accent mb-3">
                          선택한 {selectedServers.length}개의 서버가 영구적으로 삭제됩니다. 계속하시려면 관리자 비밀번호를 입력하세요.
                        </p>
                        <div className="mb-3">
                          <input
                            type="password"
                            value={deletePassword}
                            onChange={(e) => setDeletePassword(e.target.value)}
                            placeholder="관리자 비밀번호"
                            className="input"
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={cancelDelete}
                            className="button-secondary"
                          >
                            취소
                          </button>
                          <button
                            type="button"
                            onClick={confirmDelete}
                            disabled={isDeleting}
                            className="button-primary flex items-center"
                          >
                            {isDeleting ? (
                              <>
                                <FaSpinner className="animate-spin mr-1" /> 처리 중...
                              </>
                            ) : (
                              "삭제 확인"
                            )}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6">
                    <button
                      type="button"
                      className="button-secondary"
                      onClick={onClose}
                    >
                      닫기
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      {/* 서버 수정 모달 */}
      <EditServerModal
        isOpen={editModalOpen}
        onClose={closeEditModal}
        server={selectedServer}
        onSubmit={handleEditSubmit}
      />
    </>
  );
} 