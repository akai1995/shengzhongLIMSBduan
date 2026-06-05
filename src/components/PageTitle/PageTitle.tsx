import { useThemeStore } from '../../store/themeStore'

interface PageTitleProps {
  children: React.ReactNode
}

export default function PageTitle({ children }: PageTitleProps) {
  const { isDark } = useThemeStore()
  
  return (
    <h1 
      style={{ 
        fontSize: 20, 
        fontWeight: 500, 
        color: isDark ? '#FFFFFF' : '#000000', 
        lineHeight: 1.5 
      }}
    >
      {children}
    </h1>
  )
}