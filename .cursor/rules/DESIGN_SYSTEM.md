# LangCrew 디자인 시스템
## langcrew.kr - AI를 위한 연결의 새로운 표준

---

## 📖 개요

LangCrew는 Model Context Protocol (MCP) 서버들을 발견하고, 공유하고, 구축할 수 있는 커뮤니티 플랫폼입니다. Canva의 현대적이고 생동감 있는 디자인 철학을 기반으로 하여, 사용자들이 "와!"라고 감탄할 만한 시각적 경험을 제공합니다.

### 핵심 디자인 원칙
- **Bold & Vibrant**: 대담하고 생동감 있는 색상과 그라데이션
- **Interactive & Alive**: 정적이지 않은, 살아있는 인터페이스
- **Modern & Cutting-edge**: 최신 웹 디자인 트렌드 반영
- **User-centric**: 사용자 경험을 최우선으로 하는 설계

---

## 🎨 색상 시스템

### 주요 브랜드 색상
```css
:root {
  /* Primary Colors - Vibrant & Modern */
  --primary-purple: #8B5CF6;    /* 메인 브랜드 색상 */
  --primary-blue: #3B82F6;       /* 보조 브랜드 색상 */
  --primary-green: #10B981;      /* 성공/긍정 */
  --primary-pink: #EC4899;       /* 액션/강조 */
  --primary-orange: #F59E0B;     /* 경고/주의 */
  --primary-red: #EF4444;        /* 에러/중요 */
}
```

### 그라데이션 팔레트
```css
/* Signature Gradients */
--gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
--gradient-energy: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
--gradient-ocean: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
--gradient-nature: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
--gradient-sunset: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
```

### 중성 색상
```css
/* Neutral Colors */
--text-dark: #1a1a1a;          /* 주요 텍스트 */
--text-light: #ffffff;         /* 밝은 배경용 텍스트 */
--text-gray: #6b7280;          /* 보조 텍스트 */
--bg-light: #f8fafc;          /* 밝은 배경 */
--bg-white: #ffffff;           /* 흰색 배경 */
--border-light: #e5e7eb;       /* 경계선 */
```

### 색상 사용 지침
- **Primary Purple**: 로고, CTA 버튼, 주요 네비게이션
- **Primary Blue**: 링크, 정보성 요소
- **Primary Green**: 성공 메시지, 완료 상태
- **Primary Pink**: 인터랙티브 요소, 하이라이트
- **Gradients**: 히어로 섹션, 카드 호버 효과, 배경 장식

---

## 🔤 타이포그래피

### 폰트 패밀리
```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
```

### 폰트 스케일
```css
/* Heading Styles */
--text-5xl: clamp(2.5rem, 8vw, 5rem);    /* Hero 제목 */
--text-3xl: 3rem;                        /* 섹션 제목 */
--text-2xl: 1.8rem;                      /* 서브 제목 */
--text-xl: 1.3rem;                       /* 카드 제목 */
--text-lg: 1.1rem;                       /* 버튼, 중요 텍스트 */
--text-base: 1rem;                       /* 기본 본문 */
--text-sm: 0.9rem;                       /* 작은 텍스트 */
--text-xs: 0.8rem;                       /* 태그, 라벨 */
```

### 폰트 가중치
```css
--font-black: 900;     /* Hero 제목 */
--font-bold: 800;      /* 섹션 제목 */
--font-semibold: 700;  /* 카드 제목 */
--font-medium: 600;    /* 버튼 */
--font-normal: 500;    /* 네비게이션 */
--font-regular: 400;   /* 본문 */
```

### 타이포그래피 사용 예시
```css
/* Hero Title */
.hero-title {
  font-size: var(--text-5xl);
  font-weight: var(--font-black);
  line-height: 1.1;
  background: linear-gradient(135deg, var(--primary-purple), var(--primary-blue), var(--primary-green));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Section Title */
.section-title {
  font-size: var(--text-3xl);
  font-weight: var(--font-bold);
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## 📏 간격 시스템

### 스케일 기반 간격
```css
/* Spacing Scale */
--space-1: 0.25rem;    /* 4px */
--space-2: 0.5rem;     /* 8px */
--space-3: 0.75rem;    /* 12px */
--space-4: 1rem;       /* 16px */
--space-5: 1.25rem;    /* 20px */
--space-6: 1.5rem;     /* 24px */
--space-8: 2rem;       /* 32px */
--space-10: 2.5rem;    /* 40px */
--space-12: 3rem;      /* 48px */
--space-16: 4rem;      /* 64px */
--space-20: 5rem;      /* 80px */
--space-24: 6rem;      /* 96px */
```

### 컴포넌트별 간격 가이드
- **Section Padding**: `6rem 2rem` (상하 96px, 좌우 32px)
- **Card Padding**: `2rem` (32px)
- **Button Padding**: `1rem 2rem` (16px 32px)
- **Input Padding**: `1.5rem 2rem` (24px 32px)

---

## 🎯 컴포넌트 시스템

### 버튼
```css
/* Primary Button */
.btn-primary {
  background: var(--gradient-primary);
  color: var(--text-light);
  padding: 1rem 2rem;
  border-radius: var(--radius-lg);
  font-weight: var(--font-medium);
  font-size: var(--text-lg);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: var(--shadow-xl);
}

/* Secondary Button */
.btn-secondary {
  background: var(--bg-white);
  color: var(--text-dark);
  border: 2px solid var(--border-light);
  /* 나머지 스타일 동일 */
}

.btn-secondary:hover {
  background: var(--primary-purple);
  color: var(--text-light);
  border-color: var(--primary-purple);
}
```

### 카드
```css
.card {
  background: var(--bg-white);
  border-radius: var(--radius-xl);
  padding: 2rem;
  box-shadow: var(--shadow-md);
  border: 1px solid var(--border-light);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

/* Card with gradient accent */
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 4px;
  background: var(--gradient-primary);
}
```

### 입력 필드
```css
.input {
  width: 100%;
  padding: 1.5rem 2rem;
  font-size: var(--text-lg);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-xl);
  background: var(--bg-white);
  transition: all 0.3s ease;
  box-shadow: var(--shadow-md);
}

.input:focus {
  outline: none;
  border-color: var(--primary-purple);
  box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
}
```

---

## 🎭 애니메이션 시스템

### 기본 전환
```css
/* Smooth Transitions */
.transition-all { transition: all 0.3s ease; }
.transition-transform { transition: transform 0.3s ease; }
.transition-colors { transition: background-color 0.3s ease, color 0.3s ease; }
```

### 호버 효과
```css
/* Lift Effect */
.hover-lift:hover {
  transform: translateY(-5px);
  box-shadow: var(--shadow-xl);
}

/* Scale Effect */
.hover-scale:hover {
  transform: scale(1.05);
}

/* Glow Effect */
.hover-glow:hover {
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.3);
}
```

### 등장 애니메이션
```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-up {
  animation: fadeInUp 0.6s ease-out;
}

/* Scroll-triggered animations */
.reveal {
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.6s ease;
}

.reveal.active {
  opacity: 1;
  transform: translateY(0);
}
```

### 배경 애니메이션
```css
@keyframes float {
  0%, 100% { 
    transform: translateY(0px) rotate(0deg); 
  }
  33% { 
    transform: translateY(-20px) rotate(120deg); 
  }
  66% { 
    transform: translateY(10px) rotate(240deg); 
  }
}

.floating-shape {
  animation: float 6s ease-in-out infinite;
}
```

---

## 🔲 그림자 시스템

```css
/* Shadow Scale */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1);
--shadow-2xl: 0 25px 50px -12px rgb(0 0 0 / 0.25);
```

### 사용 지침
- **shadow-sm**: 작은 요소, 태그
- **shadow-md**: 기본 카드, 버튼
- **shadow-lg**: 중요한 카드, 모달
- **shadow-xl**: 호버 상태, 강조 요소
- **shadow-2xl**: 히어로 요소, 특별한 강조

---

## 🔄 둥근 모서리 시스템

```css
/* Border Radius Scale */
--radius-sm: 8px;      /* 작은 요소 */
--radius-md: 12px;     /* 일반 요소 */
--radius-lg: 16px;     /* 버튼, 입력 필드 */
--radius-xl: 24px;     /* 카드, 컨테이너 */
--radius-2xl: 32px;    /* 대형 컨테이너 */
--radius-full: 50%;    /* 원형 요소 */
```

---

## 📱 반응형 디자인

### 브레이크포인트
```css
/* Mobile First Approach */
@media (min-width: 640px) { /* sm */ }
@media (min-width: 768px) { /* md */ }
@media (min-width: 1024px) { /* lg */ }
@media (min-width: 1280px) { /* xl */ }
@media (min-width: 1536px) { /* 2xl */ }
```

### 그리드 시스템
```css
/* Responsive Grid */
.grid-responsive {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .grid-responsive {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
```

---

## 🏗️ 레이아웃 구조

### 헤더
```css
header {
  position: fixed;
  top: 0;
  width: 100%;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border-light);
  z-index: 1000;
  transition: all 0.3s ease;
}
```

### 네비게이션
```css
nav {
  max-width: 1200px;
  margin: 0 auto;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### 메인 컨테이너
```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

section {
  padding: 6rem 2rem;
}
```

---

## 🎪 특별 효과

### 글래스모피즘
```css
.glass {
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.18);
}
```

### 그라데이션 텍스트
```css
.gradient-text {
  background: var(--gradient-primary);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
```

### 홀로그램 효과
```css
.hologram {
  background: linear-gradient(45deg, 
    transparent 30%, 
    rgba(255, 255, 255, 0.5) 50%, 
    transparent 70%);
  background-size: 200% 200%;
  animation: hologram 2s linear infinite;
}

@keyframes hologram {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 🎯 페이지별 컴포넌트

### 상단 섹션
- **배경**: 애니메이션 도형들과 그라데이션
- **제목**: 대형 그라데이션 텍스트
- **버튼**: Primary와 Secondary 조합
- **높이**: 100vh (전체 화면)

### 검색 섹션
- **입력 필드**: 대형, 둥근 모서리
- **버튼**: 입력 필드 내부 우측
- **배경**: 미묘한 패턴 또는 그라데이션

### 카테고리 그리드
- **카드**: 호버 시 그라데이션 오버레이
- **아이콘**: 이모지 또는 아이콘 폰트
- **애니메이션**: Staggered entrance

### 서버 카드
- **아바타**: 그라데이션 배경
- **태그**: 둥근 모서리, 미묘한 배경
- **통계**: 아이콘과 함께 표시

---

## 🎨 브랜드 아이덴티티

### 로고
- **텍스트**: "LangCrew"
- **스타일**: 굵은 폰트, 그라데이션
- **크기**: 1.8rem (헤더), 다양한 크기 버전

### 브랜드 메시지
- **메인**: "AI를 위한 연결의 새로운 표준"
- **서브**: "Model Context Protocol 서버들을 발견하고, 공유하고, 구축하세요"

### 톤 앤 보이스
- **친근하고 전문적**
- **혁신적이고 미래지향적**
- **커뮤니티 중심적**

---

## 🔧 개발 가이드라인

### CSS 조직
```
styles/
├── base/
│   ├── reset.css
│   ├── typography.css
│   └── variables.css
├── components/
│   ├── buttons.css
│   ├── cards.css
│   ├── forms.css
│   └── navigation.css
├── layout/
│   ├── header.css
│   ├── footer.css
│   └── grid.css
└── utilities/
    ├── animations.css
    └── helpers.css
```

### 네이밍 컨벤션
- **BEM 방법론 사용**
- **컴포넌트**: `.component-name`
- **수정자**: `.component-name--modifier`
- **요소**: `.component-name__element`

### 성능 최적화
- **CSS 압축**
- **중요하지 않은 CSS 지연 로딩**
- **Critical CSS 인라인**

---

## 📋 체크리스트

### 디자인 구현 체크리스트
- [ ] 색상 팔레트 적용
- [ ] 타이포그래피 시스템 구현
- [ ] 컴포넌트 라이브러리 구축
- [ ] 애니메이션 효과 추가
- [ ] 반응형 디자인 테스트
- [ ] 접근성 검증
- [ ] 성능 최적화
- [ ] 브라우저 호환성 테스트

### 품질 보증
- [ ] 색상 대비 비율 확인 (4.5:1 이상)
- [ ] 키보드 네비게이션 테스트
- [ ] 스크린 리더 호환성
- [ ] 모바일 터치 대상 크기 (44px 이상)
- [ ] 로딩 성능 (LCP < 2.5s)

---

## 📚 참고 자료

### 영감을 받은 사이트
- [Canva.com](https://canva.com) - 전체적인 디자인 철학
- [Stripe.com](https://stripe.com) - 클린한 레이아웃
- [Linear.app](https://linear.app) - 모던한 인터페이스

### 도구 및 리소스
- **색상 도구**: Coolors.co, Adobe Color
- **그라데이션**: UIGradients, CSSGradient.io
- **아이콘**: Lucide Icons, Heroicons
- **폰트**: Google Fonts (Inter)

### 개발 도구
- **CSS 프리프로세서**: Sass/SCSS
- **빌드 도구**: Vite, Webpack
- **린터**: Stylelint
- **포맷터**: Prettier

---

*이 디자인 시스템은 LangCrew의 브랜드 아이덴티티와 사용자 경험을 일관되게 유지하기 위한 가이드입니다. 필요에 따라 업데이트하고 확장해 나가세요.*