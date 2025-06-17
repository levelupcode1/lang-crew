// 한글 주석: MCP 서버 관리 페이지
"use client";

import ServerManageModal from '@/components/ServerManageModal';

export default function ServerManagePage() {
  // 한글 주석: 모달 prop 없이 항상 열려있는 상태로 전체 페이지에 렌더링
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4">
      <div className="card w-full max-w-4xl p-8 bg-white shadow-lg rounded-2xl">
        {/* 한글 주석: ServerManageModal을 카드 스타일로 감싸서 가독성 향상 */}
        <ServerManageModal />
      </div>
    </div>
  );
} 