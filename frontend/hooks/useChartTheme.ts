import { useThemeStore } from '@/store/themeStore';

export const useChartTheme = () => {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  return {
    isDark,
    grid:        isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)',
    axis:        isDark ? 'rgba(255,255,255,0.2)'  : 'rgba(0,0,0,0.2)',
    tick:        isDark ? 'rgba(255,255,255,0.4)'  : '#475569',
    legendColor: isDark ? 'rgba(255,255,255,0.5)'  : '#475569',
    tooltip: {
      backgroundColor: isDark ? '#1a1d27'  : '#ffffff',
      border:          isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #e2e8f0',
      borderRadius:    '8px',
      color:           isDark ? '#f1f5f9'  : '#0f172a',
      boxShadow:       isDark ? 'none' : '0 4px 12px rgba(0,0,0,0.1)',
    },
  };
};
