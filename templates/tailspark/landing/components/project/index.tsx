"use client";

import { BiCategory } from "react-icons/bi";
import { BsTags } from "react-icons/bs";
import { Category } from "@/types/category";
import Crumb from "./crumb";
import Markdown from "@/components/markdown";
import Preview from "./preview";
import { Project } from "@/types/project";
import Projects from "../projects";
import Stars from "../stars";
import moment from "moment";
import { useState } from "react";
import { FaCopy, FaCheck, FaDownload } from "react-icons/fa";

export default ({
  category,
  project,
  more_projects,
}: {
  category?: Category;
  project: Project;
  more_projects?: Project[];
}) => {
  const tagsArr = project.tags ? project.tags.split(",") : [];
  const [isCopied, setIsCopied] = useState(false);

  // description에서 JSON 부분과 일반 텍스트 부분을 분리
  const descriptionParts = project.description?.split('```json');
  const basicDescription = descriptionParts?.[0]?.trim() || '';
  
  // JSON 내용 추출 (코드 블록 마크다운 구문 제거)
  const jsonContent = descriptionParts && descriptionParts.length > 1 
    ? descriptionParts[1].replace(/```$/, '').trim()
    : '';

  // 클립보드에 JSON 복사하는 함수
  const copyToClipboard = () => {
    if (!jsonContent) return;
    
    navigator.clipboard.writeText(jsonContent)
      .then(() => {
        setIsCopied(true);
        // 2초 후 복사 상태 초기화
        setTimeout(() => setIsCopied(false), 2000);
      })
      .catch(err => {
        console.error('클립보드 복사 실패:', err);
      });
  };

  // JSON 파일로 다운로드하는 함수
  const downloadJson = () => {
    if (!jsonContent) return;

    try {
      // JSON 객체 파싱
      const jsonObject = JSON.parse(jsonContent);
      const blob = new Blob([JSON.stringify(jsonObject, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // 다운로드 링크 생성 및 클릭
      const a = document.createElement('a');
      a.href = url;
      a.download = `${project.title.replace(/\s+/g, '_')}_config.json`;
      document.body.appendChild(a);
      a.click();
      
      // 정리
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('JSON 다운로드 실패:', error);
      alert('유효한 JSON 형식이 아닙니다.');
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-5 py-4 md:px-10 md:py-4 lg:py-4">
      <Crumb category={category} project={project} />

      <div className="mx-auto w-full max-w-7xl py-8 md:py-8 lg:py-8">
        <div className="grid gap-12 sm:gap-20 lg:grid-cols-2 mt-8">
          <div className="flex flex-col items-start gap-2">
            <h1 className="text-4xl font-bold md:text-6xl">{project.title}</h1>

            <div className="flex items-center gap-2 mt-4">
              <p className="text-md sm:text-md">
                Created at{" "}
                <span className="text-primary">
                  {moment(project.updated_at).fromNow()}
                </span>
              </p>
              <p className="text-md sm:text-md">
                by <span className="text-primary">{project.author_name}</span>
              </p>
            </div>
            <div className="mt-4">
              <Stars />
            </div>
            <p className="text-sm text-[#808080] sm:text-xl mt-4">
              {basicDescription}
            </p>

            {/* JSON 구성 정보가 있으면 마크다운으로 렌더링 */}
            {descriptionParts && descriptionParts.length > 1 && (
              <div className="w-full mt-4 bg-gray-50 rounded-md border border-gray-200 overflow-hidden">
                <div className="flex justify-between items-center bg-gray-100 px-4 py-2 border-b border-gray-200">
                  <h3 className="text-sm font-medium">서버 구성 (Cursor SSE 형식)</h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={copyToClipboard}
                      className={`flex items-center text-xs px-2 py-1 rounded ${
                        isCopied ? 'bg-green-100 text-green-700' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                      title="JSON 구성 복사하기"
                    >
                      {isCopied ? (
                        <>
                          <FaCheck className="mr-1" /> 복사됨
                        </>
                      ) : (
                        <>
                          <FaCopy className="mr-1" /> 복사
                        </>
                      )}
                    </button>
                    <button 
                      onClick={downloadJson}
                      className="flex items-center text-xs px-2 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                      title="JSON 파일로 다운로드"
                    >
                      <FaDownload className="mr-1" /> 다운로드
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <Markdown content={`\`\`\`json${descriptionParts[1]}`} />
                </div>
              </div>
            )}

            <div className="mb-8 mt-8 h-px w-full bg-black"></div>
            <div className="mb-6 flex flex-col gap-2 text-sm text-[#808080] sm:text-base lg:mb-8">
              <p className="font-medium">
                <BiCategory className="inline-block mr-2" />
                Categories
              </p>
              <div className="flex flex-wrap gap-2 mt-1">
                <span className="text-primary text-xs border border-solid border-primary rounded-md px-2 py-1">
                  {project.category}
                </span>
              </div>
              <p className="font-medium mt-4">
                <BsTags className="inline-block mr-2" />
                Tags
              </p>
              {tagsArr &&
                tagsArr.map((tag) => (
                  <p key={tag}>
                    <input
                      type="checkbox"
                      className="mr-2"
                      readOnly
                      checked={tagsArr && tagsArr.includes(tag)}
                    />
                    {tag}
                  </p>
                ))}
            </div>

            <div className="flex flex-col gap-4 font-semibold sm:flex-row">
              <a
                href={project.url}
                target="_blank"
                className="flex items-center gap-2 rounded-md border border-solid bg-primary text-white px-6 py-3 truncate"
              >
                <span>Visit {project.title} 👉</span>
              </a>
            </div>
          </div>
          {(project.img_url || project.avatar_url) && (
            <div className="min-h-96 rounded-md overflow-hidden">
              <Preview project={project} />
            </div>
          )}
        </div>
      </div>

      {project.summary && (
        <div className="w-full md:max-w-7xl mx-auto px-8 py-4 mt-16 text-left border border-gray-200 rounded-lg">
          <Markdown content={project.summary || ""} />
        </div>
      )}

      <div className="w-full text-center">
        <p className="mx-auto font-bold text-3xl mt-16 mb-4">View More</p>
        {more_projects && <Projects projects={more_projects} />}
      </div>
    </div>
  );
};
