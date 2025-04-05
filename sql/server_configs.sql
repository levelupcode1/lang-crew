-- server_configs 테이블 생성
CREATE TABLE IF NOT EXISTS public.server_configs (
  id SERIAL PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(uuid) ON DELETE CASCADE,
  config_data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 기본 권한 설정
ALTER TABLE public.server_configs ENABLE ROW LEVEL SECURITY;

-- 인덱스 생성
CREATE INDEX IF NOT EXISTS idx_server_configs_project_id ON public.server_configs(project_id);

-- 중복 방지 인덱스
CREATE UNIQUE INDEX IF NOT EXISTS idx_server_configs_project_id_unique ON public.server_configs(project_id);

-- 서비스 역할에 대한 정책 생성
CREATE POLICY "서비스 역할만 전체 권한" ON public.server_configs
  USING (true)
  WITH CHECK (true);

-- 사용자는 읽기만 가능하도록 정책 생성
CREATE POLICY "인증된 사용자는 조회만 가능" ON public.server_configs 
  FOR SELECT
  USING (auth.role() = 'authenticated'); 