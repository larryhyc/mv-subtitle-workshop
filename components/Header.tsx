'use client';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

const Header = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  // 确保只在客户端渲染
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-between items-center p-4 font-bold">
        <h1>MV SUBTITLE WORKSHOP</h1>
        <Button variant="ghost" size="icon" disabled>
          <MoonIcon />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-center p-4 font-bold">
      <h1>MV SUBTITLE WORKSHOP</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
      </Button>
    </div>
  );
};

export default Header;
