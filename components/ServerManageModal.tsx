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
import { FaDownload, FaUpload, FaSpinner, FaTrash, FaLock } from "react-icons/fa";
import { toast } from "react-hot-toast";

interface ServerManageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ServerInfo {
  id: string;
  title: string;
  description: string;
  created_at: string;
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
          <div className="fixed inset-0 bg-black/25" />
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  서버 일괄 관리
                </Dialog.Title>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-6">
                    시스템에 등록된 서버를 관리하고, JSON 형식으로 다운로드하거나,
                    JSON 파일을 업로드하여 여러 서버를 한 번에 등록할 수 있습니다.
                  </p>

                  <div className="flex flex-col gap-4 mb-6">
                    <button
                      type="button"
                      className="inline-flex justify-center items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className="inline-flex justify-center items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                  <div className="border rounded-md overflow-hidden">
                    <div className="bg-gray-50 p-3 border-b flex items-center">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          checked={servers.length > 0 && selectedServers.length === servers.length}
                          onChange={handleSelectAllChange}
                          id="select-all"
                        />
                        <label htmlFor="select-all" className="ml-2 text-sm font-medium text-gray-700">
                          전체 선택
                        </label>
                      </div>
                      <div className="ml-auto">
                        <button
                          type="button"
                          className="inline-flex justify-center items-center rounded-md border border-transparent bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
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
                          <FaSpinner className="animate-spin text-blue-500 mr-2" />
                          <span>서버 목록 로딩 중...</span>
                        </div>
                      ) : servers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          등록된 서버가 없습니다.
                        </div>
                      ) : (
                        <ul className="divide-y divide-gray-200">
                          {servers.map((server) => (
                            <li key={server.id} className="p-3 hover:bg-gray-50">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`server-${server.id}`}
                                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                  checked={selectedServers.includes(server.id)}
                                  onChange={() => handleCheckboxChange(server.id)}
                                />
                                <label
                                  htmlFor={`server-${server.id}`}
                                  className="ml-3 block cursor-pointer"
                                >
                                  <div className="font-medium text-gray-900">
                                    {server.title}
                                  </div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    {server.created_at.split('T')[0]} 등록
                                  </div>
                                </label>
                              </div>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>

                  {/* 삭제 확인 대화상자 */}
                  {showDeleteConfirm && (
                    <div className="mt-4 p-4 border border-red-300 rounded-md bg-red-50">
                      <h4 className="text-red-700 font-medium mb-2 flex items-center">
                        <FaLock className="mr-2" /> 서버 삭제 확인
                      </h4>
                      <p className="text-sm text-red-600 mb-3">
                        선택한 {selectedServers.length}개의 서버가 영구적으로 삭제됩니다. 계속하시려면 관리자 비밀번호를 입력하세요.
                      </p>
                      <div className="mb-3">
                        <input
                          type="password"
                          value={deletePassword}
                          onChange={(e) => setDeletePassword(e.target.value)}
                          placeholder="관리자 비밀번호"
                          className="w-full p-2 border border-red-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <button
                          type="button"
                          onClick={cancelDelete}
                          className="px-3 py-1 bg-gray-200 text-gray-800 rounded-md"
                        >
                          취소
                        </button>
                        <button
                          type="button"
                          onClick={confirmDelete}
                          disabled={isDeleting}
                          className="px-3 py-1 bg-red-600 text-white rounded-md flex items-center"
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
                    className="inline-flex justify-center rounded-md border border-transparent bg-gray-200 px-4 py-2 text-sm font-medium text-gray-900 hover:bg-gray-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2"
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
  );
} 