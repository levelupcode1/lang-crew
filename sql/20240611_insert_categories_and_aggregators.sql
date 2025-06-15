-- 서버 구현 카테고리 및 애그리게이터 프로젝트 입력 migration

-- 1. 카테고리 입력
INSERT INTO categories (name, title, status, created_at) VALUES
('aggregators', '애그리게이터', 'active', NOW()),
('browser-automation', '브라우저 자동화', 'active', NOW()),
('art-and-culture', '예술 및 문화', 'active', NOW()),
('cloud-platforms', '클라우드 플랫폼', 'active', NOW()),
('command-line', '커맨드 라인', 'active', NOW()),
('communication', '커뮤니케이션', 'active', NOW()),
('customer-data-platforms', '고객 데이터 플랫폼', 'active', NOW()),
('databases', '데이터베이스', 'active', NOW()),
('data-platforms', '데이터 플랫폼', 'active', NOW()),
('developer-tools', '개발자 도구', 'active', NOW()),
('file-systems', '파일 시스템', 'active', NOW()),
('finance--fintech', '금융 및 핀테크', 'active', NOW()),
('gaming', '게임', 'active', NOW()),
('knowledge--memory', '지식 및 메모리', 'active', NOW()),
('location-services', '위치 서비스', 'active', NOW()),
('marketing', '마케팅', 'active', NOW()),
('monitoring', '모니터링', 'active', NOW()),
('search', '검색', 'active', NOW()),
('security', '보안', 'active', NOW()),
('sports', '스포츠', 'active', NOW()),
('translation-services', '번역 서비스', 'active', NOW()),
('travel-and-transportation', '여행 및 교통', 'active', NOW()),
('version-control', '버전 관리', 'active', NOW()),
('other-tools-and-integrations', '기타 도구 및 통합', 'active', NOW())
ON CONFLICT (name) DO NOTHING;

-- 2. 애그리게이터 프로젝트 입력
INSERT INTO projects (
  uuid, name, title, description, created_at, category, status, url
) VALUES
(gen_random_uuid(), 'openmcp', 'OpenMCP', '웹 API를 10초 만에 MCP 서버로 전환하고 오픈 소스 레지스트리에 추가하세요: https://open-mcp.org', NOW(), 'aggregators', 'active', 'https://github.com/wegotdocs/open-mcp'),
(gen_random_uuid(), 'mcgravity', 'mcgravity', '여러 MCP 서버를 단일 연결 포인트로 통합하여 프록시하는 도구로, 요청 부하를 분산하여 AI 도구를 확장합니다.', NOW(), 'aggregators', 'active', 'https://github.com/krayniok/mcgravity'),
(gen_random_uuid(), 'metamcp', 'MetaMCP', 'MetaMCP는 GUI를 통해 MCP 연결을 관리하는 통합 미들웨어 MCP 서버입니다.', NOW(), 'aggregators', 'active', 'https://github.com/metatool-ai/metatool-app'),
(gen_random_uuid(), 'mcp-access-point', 'MCP Access Point', '서버 측 코드를 변경하지 않고 한 번의 클릭으로 웹 API를 MCP 서버로 변환합니다.', NOW(), 'aggregators', 'active', 'https://github.com/sxhxliang/mcp-access-point'),
(gen_random_uuid(), 'imagen3-mcp', 'hamflx/imagen3-mcp', 'MCP를 통해 Google의 Imagen 3.0 API를 사용하는 강력한 이미지 생성 도구. 고급 사진, 예술 및 사실적인 컨트롤로 텍스트 프롬프트에서 고품질 이미지를 생성합니다.', NOW(), 'aggregators', 'active', 'https://github.com/hamflx/imagen3-mcp')
ON CONFLICT (url) DO NOTHING; 