"use client";

import { createContext, useContext, useEffect, useState } from 'react';

// 테마 컨텍스트 타입 정의
type Theme = 'light' | 'dark';
type ThemeContext = {
  theme: Theme;
  toggleTheme: () => void;
};

// 테마 컨텍스트 생성
const ThemeContext = createContext<ThemeContext | null>(null);

// 테마 컨텍스트 훅
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// 테마 프로바이더 props 타입
type ThemeProviderProps = {
  children: React.ReactNode;
};

// 테마 프로바이더 컴포넌트
export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>('light');

  // 테마 변경 함수
  const toggleTheme = () => {
    setTheme(prev => {
      const newTheme = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      return newTheme;
    });
  };

  useEffect(() => {
    // 로컬 스토리지에서 테마 설정 불러오기
    const savedTheme = localStorage.getItem('theme') as Theme | null;
    
    if (savedTheme) {
      setTheme(savedTheme);
    } else {
      // 시스템 다크 모드 설정 확인
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setTheme(prefersDark ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    // theme 변경시 HTML class 업데이트
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
} 