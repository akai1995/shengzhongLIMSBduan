import { Layout as AntLayout, Menu, Avatar, Button, Dropdown, type MenuProps } from 'antd'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SearchOutlined,
  BellOutlined,
  MoonOutlined,
  SunOutlined,
  FolderOpenOutlined,
  PlusOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  TrophyOutlined,
  DollarOutlined,
  FileTextOutlined,
  ShareAltOutlined,
  VideoCameraOutlined,
  BookOutlined,
  FileProtectOutlined,
  UserOutlined,
  ReadOutlined,
  SafetyOutlined,
  ExperimentOutlined,
  ScanOutlined,
  WarningOutlined,
  SafetyCertificateOutlined,
  FileSearchOutlined,
  BarChartOutlined,
  HistoryOutlined,
  AlertOutlined,
  MonitorOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  FileExcelOutlined,
  SendOutlined,
  FileSyncOutlined,
  EditOutlined,
  FilePdfOutlined,
  ShareAltOutlined as ShareIcon,
  CalendarOutlined,
  HomeOutlined,
  CiOutlined,
  BulbOutlined,
  LineChartOutlined,
  DatabaseOutlined,
  CloudOutlined,
  UploadOutlined,
  LockOutlined,
  QrcodeOutlined,
  RobotOutlined,
  UserOutlined as FaceIcon,
  UsbOutlined,
  MessageOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { useThemeStore } from '../store/themeStore'
import { useSidebarStore } from '../store/sidebarStore'
import { useState, useEffect, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import AIExperiment from '../pages/ai/AIExperiment'
import OCRRecognition from '../pages/ai/OCRRecognition'

const { Header, Sider, Content } = AntLayout

interface LayoutProps {
  children: ReactNode
}

// 首页的侧边栏菜单
const homeMenuItems = [
  {
    key: '/',
    label: '首页',
    icon: <HomeOutlined />,
  },
]

// 科研管理的侧边栏菜单
const researchMenuItems = [
  {
    key: 'project',
    label: '科研项目管理',
    icon: <FolderOpenOutlined />,
    children: [
      { key: '/research/project-initiation', label: '项目立项', icon: <PlusOutlined /> },
      { key: '/research/progress', label: '进度管理', icon: <ClockCircleOutlined /> },
      { key: '/research/members', label: '成员管理', icon: <TeamOutlined /> },
      { key: '/research/funds', label: '经费管理', icon: <DollarOutlined /> },
      { key: '/research/achievements', label: '成果管理', icon: <TrophyOutlined /> },
      { key: '/research/sample', label: '样本管理', icon: <InboxOutlined /> },
      { key: '/research/project-approval', label: '项目立项审批', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: 'training',
    label: '培训与考试管理',
    icon: <BookOutlined />,
    children: [
      { key: '/training/materials', label: '培训资料', icon: <VideoCameraOutlined /> },
      { key: '/training/question-bank', label: '题库管理', icon: <BookOutlined /> },
      { key: '/training/paper', label: '试卷管理', icon: <FileExcelOutlined /> },
      { key: '/training/learning', label: '在线学习', icon: <ReadOutlined /> },
      { key: '/training/exam', label: '在线考试', icon: <FileProtectOutlined /> },
      { key: '/training/scores', label: '成绩查询', icon: <FileTextOutlined /> },
    ],
  },
]

// 实验室业务的侧边栏菜单
const labMenuItems = [
  {
    key: 'safety',
    label: '安全准入',
    icon: <SafetyOutlined />,
    children: [
      { key: '/lab/safety/info', label: '实验室信息', icon: <MonitorOutlined /> },
      { key: '/lab/safety/notice', label: '安全须知', icon: <SafetyCertificateOutlined /> },
      { key: '/lab/safety/visit', label: '来访申请', icon: <UserOutlined /> },
      { key: '/lab/safety/visit-approval', label: '来访申请审批', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: 'equipment',
    label: '仪器设备管理',
    icon: <ExperimentOutlined />,
    children: [
      { key: '/lab/equipment/archive', label: '仪器档案', icon: <FileSearchOutlined /> },
      { key: '/lab/equipment/reservation-config', label: '预约配置', icon: <SettingOutlined /> },
      { key: '/lab/equipment/reservation', label: '预约登记', icon: <CalendarOutlined /> },
      { key: '/lab/equipment/usage', label: '使用记录', icon: <HistoryOutlined /> },
      { key: '/lab/equipment/maintenance', label: '维护提醒', icon: <AlertOutlined /> },
      { key: '/lab/equipment/approval', label: '设备预约审批', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: 'reagent',
    label: '试剂耗材管理',
    icon: <ScanOutlined />,
    children: [
      { key: '/lab/reagent/purchase', label: '采购登记', icon: <ShoppingCartOutlined /> },
      { key: '/lab/reagent/inbound', label: '入库管理', icon: <InboxOutlined /> },
      { key: '/lab/reagent/stock', label: '库存查询', icon: <BarChartOutlined /> },
      { key: '/lab/reagent/outbound', label: '出库管理', icon: <SendOutlined /> },
      { key: '/lab/reagent/approval', label: '试剂耗材审批', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: 'hazardous',
    label: '危化品管理',
    icon: <WarningOutlined />,
    children: [
      { key: '/lab/hazardous/purchase', label: '采购管理', icon: <ShoppingCartOutlined /> },
      { key: '/lab/hazardous/inbound', label: '入库管理', icon: <InboxOutlined /> },
      { key: '/lab/hazardous/stock', label: '库存管理', icon: <BarChartOutlined /> },
      { key: '/lab/hazardous/outbound', label: '出库管理', icon: <SendOutlined /> },
      { key: '/lab/hazardous/approval', label: '危化品审批', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: 'eln',
    label: '电子实验记录本',
    icon: <EditOutlined />,
    children: [
      { key: '/lab/eln/ai-assistant', label: 'AI助手', icon: <RobotOutlined /> },
      { key: '/lab/eln/record', label: '实验记录', icon: <EditOutlined /> },
      { key: '/lab/eln/template', label: '实验模板', icon: <FileExcelOutlined /> },
      { key: '/lab/eln/report-template', label: '报告模板', icon: <FileTextOutlined /> },
      { key: '/lab/eln/report', label: '报告生成', icon: <FilePdfOutlined /> },
    ],
  },
  {
    key: 'data',
    label: '数据管理',
    icon: <DatabaseOutlined />,
    children: [
      { key: '/lab/data/usb', label: 'USB管控', icon: <UsbOutlined /> },
      { key: '/lab/data/experiment', label: '实验数据', icon: <BarChartOutlined /> },
    ],
  },
  {
    key: 'purchase',
    label: '采购管理',
    icon: <ShoppingCartOutlined />,
    children: [
      { key: '/lab/purchase/supplier', label: '供应商管理', icon: <TeamOutlined /> },
      { key: '/lab/purchase/category', label: '商品类目管理', icon: <FolderOpenOutlined /> },
    ],
  },
  {
    key: 'software',
    label: '软件管理',
    icon: <CloudOutlined />,
    children: [
      { key: '/lab/software', label: '软件管理', icon: <CloudOutlined /> },
    ],
  },
]

// 智能物联的侧边栏菜单
const iotMenuItems = [
  {
    key: 'environment',
    label: '环境与设备监控',
    icon: <AlertOutlined />,
    children: [
      { key: '/iot/device-status', label: '设备状态监控', icon: <MonitorOutlined /> },
      { key: '/iot/abnormal-alarm', label: '异常报警', icon: <AlertOutlined /> },
    ],
  },
  {
    key: 'uvc',
    label: '紫外线消毒灯',
    icon: <BulbOutlined />,
    children: [
      { key: '/iot/uvc', label: '紫外线灯', icon: <BulbOutlined /> },
      { key: '/iot/uvc/schedule', label: '定时开关', icon: <ClockCircleOutlined /> },
    ],
  },
  {
    key: 'access-control',
    label: '门禁管理',
    icon: <LockOutlined />,
    children: [
      { key: '/iot/access-control', label: '授权管理', icon: <MonitorOutlined /> },
      { key: '/iot/access-control/records', label: '进出记录管理', icon: <HistoryOutlined /> },
    ],
  },
]



// AI智能辅助的侧边栏菜单
const aiMenuItems = [
  {
    key: 'ocr',
    label: '智能识别',
    icon: <QrcodeOutlined />,
    children: [
      { key: '/ai/ocr', label: 'OCR识别', icon: <QrcodeOutlined /> },
      { key: '/ai/text-recognition', label: '超文本识别', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: 'knowledge',
    label: '知识库',
    icon: <BookOutlined />,
    children: [
      { key: '/ai/knowledge/upload', label: '知识上传', icon: <UploadOutlined /> },
      { key: '/ai/knowledge/category', label: '分类管理', icon: <FolderOpenOutlined /> },
      { key: '/ai/knowledge/search', label: '知识检索', icon: <SearchOutlined /> },
      { key: '/ai/knowledge/permission', label: '权限控制', icon: <LockOutlined /> },
    ],
  },
  {
    key: 'ai-experiment',
    label: 'AI实验',
    icon: <RobotOutlined />,
    children: [
      { key: '/ai/experiment', label: '智能问答', icon: <RobotOutlined /> },
      { key: '/ai/report-analysis', label: 'AI报告解读', icon: <FileTextOutlined /> },
    ],
  },
  {
    key: 'attendance',
    label: 'AI考勤',
    icon: <FaceIcon />,
    children: [
      { key: '/ai/attendance/camera', label: '摄像头管理', icon: <MonitorOutlined /> },
      { key: '/ai/attendance/face-library', label: '人脸库管理', icon: <FaceIcon /> },
      { key: '/ai/attendance/manage', label: '考勤管理', icon: <ClockCircleOutlined /> },
    ],
  },
]

// 根据路径获取需要展开的二级菜单key
const getOpenKeys = (path: string) => {
  if (path.startsWith('/research')) {
    if (path.includes('project')) return ['project']
    if (path.includes('approval')) return ['approval']
    if (path.includes('training')) return ['training']
  }
  if (path.startsWith('/lab')) {
    if (path.includes('safety')) return ['safety']
    if (path.includes('equipment')) return ['equipment']
    if (path.includes('reagent')) return ['reagent']
    if (path.includes('hazardous')) return ['hazardous']
    if (path.includes('software')) return ['software']
    if (path.includes('eln')) return ['eln']
  }
  if (path.startsWith('/iot')) {
    if (path.includes('environment')) return ['environment']
    if (path.includes('uvc')) return ['uvc']
    if (path.includes('analysis')) return ['analysis']
    if (path.includes('operation')) return ['operation']
  }
  if (path.startsWith('/ai')) {
    if (path.includes('ocr') || path.includes('text-recognition')) return ['ocr']
    if (path.includes('knowledge')) return ['knowledge']
    if (path.includes('report-analysis') || path.includes('experiment')) return ['ai-experiment']
    if (path.includes('attendance')) return ['attendance']
  }
  return []
}

// 根据路径判断当前一级导航
const getCurrentNav = (path: string) => {
  if (path === '/') return 'home'
  if (path.startsWith('/research')) return 'research'
  if (path.startsWith('/lab')) return 'lab'
  if (path.startsWith('/iot')) return 'iot'
  if (path.startsWith('/ai')) return 'ai'
  return 'research'
}

export default function MainLayout({ children }: LayoutProps) {
  const { isDark, toggle: toggleTheme } = useThemeStore()
  const { collapsed, toggle: toggleSidebar } = useSidebarStore()
  const navigate = useNavigate()
  const location = useLocation()
  const [openKeys, setOpenKeys] = useState<string[]>(getOpenKeys(location.pathname))
  const [currentNav, setCurrentNav] = useState<string>(getCurrentNav(location.pathname))
  const [aiExpanded, setAiExpanded] = useState(false)
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false)
  const [ocrDrawerOpen, setOcrDrawerOpen] = useState(false)
  const [hoverNav, setHoverNav] = useState<string | null>(null)

  // 路径变化时更新当前导航
  useEffect(() => {
    setCurrentNav(getCurrentNav(location.pathname))
  }, [location.pathname])

  // 在body上同步添加/移除dark-mode类
  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [isDark])

  // 点击侧边栏菜单
  const handleSidebarClick = ({ key }: { key: string }) => {
    navigate(key)
  }

  // 处理菜单展开/收起
  const handleOpenChange = (keys: string[]) => {
    setOpenKeys(keys)
  }

  // 切换一级导航
  const handleNavChange = (nav: string) => {
    setCurrentNav(nav)
    switch (nav) {
      case 'home':
        navigate('/')
        break
      case 'research':
        navigate('/research/project-initiation')
        break
      case 'lab':
        navigate('/lab/safety/visit')
        break
      case 'iot':
        navigate('/iot/environment')
        break
      case 'ai':
        navigate('/ai/ocr')
        break
    }
  }

  const sidebarItems = currentNav === 'home' ? homeMenuItems : 
                       currentNav === 'research' ? researchMenuItems : 
                       currentNav === 'lab' ? labMenuItems : 
                       currentNav === 'iot' ? iotMenuItems : aiMenuItems

  return (
    <>
      <style>{`
        .ant-menu-item, .ant-menu-submenu-title {
          padding-inline: 12px !important;
        }
        .ant-menu-sub {
          padding-inline: 0 !important;
        }
        .ant-menu-sub .ant-menu-item {
          padding-inline: 36px !important;
        }
        /* 左侧导航栏图标统一设置为18px */
        .ant-menu-item .anticon,
        .ant-menu-submenu-title .anticon,
        .ant-menu-item-icon,
        .ant-menu-submenu-icon {
          font-size: 18px !important;
          width: 18px !important;
          height: 18px !important;
          line-height: 18px !important;
        }
        /* 收起状态下的图标大小 */
        .ant-layout-sider-collapsed .ant-menu-item .anticon,
        .ant-layout-sider-collapsed .ant-menu-submenu-title .anticon {
          font-size: 18px !important;
          width: 18px !important;
          height: 18px !important;
          line-height: 18px !important;
        }
        .nav-item {
          padding: 0 20px;
          height: 50px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 16px;
          font-weight: 400;
          cursor: pointer;
          transition: all 0.2s;
          color: #FFFFFF;
          background-color: transparent;
        }
        .nav-item:hover {
          background-color: #5CA4E6;
        }
        .nav-item:active {
          background-color: #0D5CAC;
        }
        .nav-item.active {
          background-color: #FFFFFF;
          color: #177DDC;
          border-bottom: 2px solid #177DDC;
        }
        .light-sidebar .ant-menu-item:hover,
        .light-sidebar .ant-menu-submenu-title:hover {
          background-color: #E7F2FB !important;
          color: #177DDC !important;
        }
        .dark-sidebar .ant-menu-item:hover,
        .dark-sidebar .ant-menu-submenu-title:hover {
          background-color: #1D1D1D !important;
          color: #DCDCDC !important;
        }
        .light-sidebar .ant-menu-item,
        .light-sidebar .ant-menu-submenu-title {
          color: #262626 !important;
        }
        .dark-sidebar .ant-menu-item,
        .dark-sidebar .ant-menu-submenu-title {
          color: #DCDCDC !important;
        }
        .light-sidebar .ant-menu-item-selected,
        .light-sidebar .ant-menu-submenu-title-selected {
          background-color: #E7F2FB !important;
          color: #177DDC !important;
        }
        .dark-sidebar .ant-menu-item-selected,
        .dark-sidebar .ant-menu-submenu-title-selected {
          background-color: #141F28 !important;
          color: #177DDC !important;
        }
        /* 展开状态下三级弹出菜单样式 */
        .ant-layout-sider:not(.ant-layout-sider-collapsed) .ant-menu-submenu-popup {
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .ant-layout-sider:not(.ant-layout-sider-collapsed) .ant-menu-submenu-popup .ant-menu {
          background: transparent !important;
        }
        .ant-layout-sider:not(.ant-layout-sider-collapsed) .ant-menu-submenu-popup .ant-menu-item {
          background-color: transparent !important;
        }
        .ant-layout-sider:not(.ant-layout-sider-collapsed) .ant-menu-submenu-popup .ant-menu-item:hover {
          background-color: #E7F2FB !important;
        }
        .ant-layout-sider:not(.ant-layout-sider-collapsed).dark-sidebar .ant-menu-submenu-popup .ant-menu-item:hover {
          background-color: #141F28 !important;
        }
        /* 针对深色主题下三级子菜单的精确选择器 */
        .ant-layout-sider:not(.ant-layout-sider-collapsed).dark-sidebar .ant-menu-submenu-popup .ant-menu.ant-menu-sub.ant-menu-inline {
          background-color: transparent !important;
          background: transparent !important;
        }
        .ant-layout-sider:not(.ant-layout-sider-collapsed) .ant-menu-submenu-popup ul.ant-menu.ant-menu-sub.ant-menu-inline {
          background-color: transparent !important;
          background: transparent !important;
        }
        /* 收起状态下三级导航置顶，背景色去除透明度 - 使用最高优先级选择器 */
        [class*="ant-layout-sider-collapsed"] [class*="ant-menu-submenu-popup"],
        [class*="ant-layout-sider-collapsed"] > .ant-menu > .ant-menu-submenu > [class*="ant-menu-submenu-popup"],
        [class*="ant-layout-sider-collapsed"] > .ant-menu.ant-menu-root > .ant-menu-submenu > .ant-menu-submenu-popup {
          position: fixed !important;
          top: 60px !important;
          left: 74px !important;
          right: auto !important;
          bottom: auto !important;
          transform: none !important;
          border: 1px solid #E5E5E5 !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
          background: #FFFFFF !important;
          background-color: #FFFFFF !important;
          background-image: none !important;
          opacity: 1 !important;
          border-radius: 8px !important;
          padding: 8px !important;
          z-index: 9999 !important;
          filter: none !important;
          pointer-events: auto !important;
        }
        [class*="ant-layout-sider-collapsed"].dark-sidebar [class*="ant-menu-submenu-popup"],
        [class*="ant-layout-sider-collapsed"].dark-sidebar > .ant-menu > .ant-menu-submenu > [class*="ant-menu-submenu-popup"],
        [class*="ant-layout-sider-collapsed"].dark-sidebar > .ant-menu.ant-menu-root > .ant-menu-submenu > .ant-menu-submenu-popup {
          background: #141414 !important;
          background-color: #141414 !important;
          background-image: none !important;
          border-color: #2C2C2C !important;
        }
        [class*="ant-layout-sider-collapsed"] [class*="ant-menu-submenu-popup"] .ant-menu,
        [class*="ant-layout-sider-collapsed"] [class*="ant-menu-submenu-popup"] > .ant-menu,
        [class*="ant-layout-sider-collapsed"] [class*="ant-menu-submenu-popup"] ul.ant-menu {
          background: #FFFFFF !important;
          background-color: #FFFFFF !important;
          background-image: none !important;
          opacity: 1 !important;
          border-radius: 8px !important;
          box-shadow: none !important;
          padding: 4px !important;
          border: none !important;
          filter: none !important;
          position: static !important;
        }
        [class*="ant-layout-sider-collapsed"].dark-sidebar [class*="ant-menu-submenu-popup"] .ant-menu,
        [class*="ant-layout-sider-collapsed"].dark-sidebar [class*="ant-menu-submenu-popup"] > .ant-menu,
        [class*="ant-layout-sider-collapsed"].dark-sidebar [class*="ant-menu-submenu-popup"] ul.ant-menu {
          background: #141414 !important;
          background-color: #141414 !important;
          background-image: none !important;
        }
        [class*="ant-layout-sider-collapsed"] [class*="ant-menu-submenu-popup"] * {
          background: #FFFFFF !important;
          background-color: #FFFFFF !important;
          background-image: none !important;
          opacity: 1 !important;
          filter: none !important;
        }
        [class*="ant-layout-sider-collapsed"].dark-sidebar [class*="ant-menu-submenu-popup"] * {
          background: #141414 !important;
          background-color: #141414 !important;
          background-image: none !important;
        }
        [class*="ant-layout-sider-collapsed"] [class*="ant-menu-submenu-popup"] .ant-menu-item {
          background-color: #FFFFFF !important;
          background-image: none !important;
          opacity: 1 !important;
          margin-bottom: 2px !important;
          border-radius: 4px !important;
          padding: 8px 12px !important;
          margin: 2px !important;
          filter: none !important;
          position: static !important;
        }
        [class*="ant-layout-sider-collapsed"].dark-sidebar [class*="ant-menu-submenu-popup"] .ant-menu-item {
          background-color: #141414 !important;
        }
        [class*="ant-layout-sider-collapsed"] [class*="ant-menu-submenu-popup"] .ant-menu-item:hover {
          background-color: #E7F2FB !important;
        }
        [class*="ant-layout-sider-collapsed"].dark-sidebar [class*="ant-menu-submenu-popup"] .ant-menu-item:hover {
          background-color: #1D1D1D !important;
        }
        /* 暗色模式表单组件背景 */
        .ant-layout-content.dark-mode .ant-input,
        .ant-layout-content.dark-mode .ant-input-affix-wrapper,
        .ant-layout-content.dark-mode .ant-select-selector,
        .ant-layout-content.dark-mode .ant-picker {
          background-color: #141414 !important;
          border-color: #373737 !important;
        }
        .ant-layout-content.dark-mode .ant-input::placeholder,
        .ant-layout-content.dark-mode .ant-input-affix-wrapper::placeholder,
        .ant-layout-content.dark-mode .ant-select-selection-placeholder,
        .ant-layout-content.dark-mode .ant-picker input::placeholder {
          color: #7E7E7E !important;
        }
        .ant-layout-content.dark-mode .ant-select-arrow,
        .ant-layout-content.dark-mode .ant-picker-suffix {
          color: #ADADAD !important;
        }
        .ant-layout-content.dark-mode .ant-form-item-label > label {
          color: #DCDCDC !important;
        }
        .ant-layout-content.dark-mode .ant-form-item {
          margin-bottom: 20px;
        }
        /* 暗色模式按钮样式 */
        .ant-layout-content.dark-mode .ant-btn-default {
          background-color: #262626 !important;
          border-color: #373737 !important;
          color: #DCDCDC !important;
        }
        .ant-layout-content.dark-mode .ant-btn-default:hover {
          background-color: #373737 !important;
          border-color: #434343 !important;
          color: #FFFFFF !important;
        }
        .ant-layout-content.dark-mode .ant-btn-primary {
          background-color: #177DDC !important;
          border-color: #177DDC !important;
        }
        /* 亮色模式卡片（规范文档模块/卡片色） */
        .ant-layout-content:not(.dark-mode) .ant-card {
          background-color: #FFFFFF !important;
          border-color: #E5E5E5 !important;
        }
        .ant-layout-content:not(.dark-mode) .ant-card-head {
          border-color: #E5E5E5 !important;
        }
        /* 暗色模式卡片（规范文档模块/卡片色） */
        .ant-layout-content.dark-mode .ant-card {
          background-color: #141414 !important;
          border-color: #2C2C2C !important;
        }
        .ant-layout-content.dark-mode .ant-card-head {
          border-color: #2C2C2C !important;
        }
        .ant-layout-content.dark-mode .ant-card-head-title {
          color: #FFFFFF !important;
        }
        /* 亮色模式表格（规范文档） */
        .ant-layout-content:not(.dark-mode) .ant-table {
          background-color: #FFFFFF !important;
          color: #262626 !important;
        }
        .ant-layout-content:not(.dark-mode) .ant-table-thead > tr > th {
          background-color: #F5F5F5 !important;
          color: #595959 !important;
          border-color: #E5E5E5 !important;
        }
        .ant-layout-content:not(.dark-mode) .ant-table-tbody > tr > td {
          background-color: #FFFFFF !important;
          border-color: #E5E5E5 !important;
          color: #262626 !important;
        }
        .ant-layout-content:not(.dark-mode) .ant-table-tbody > tr:hover > td {
          background-color: #F5F5F5 !important;
        }
        /* 暗色模式表格（规范文档） */
        .ant-layout-content.dark-mode .ant-table {
          background-color: #141414 !important;
          color: #DCDCDC !important;
        }
        .ant-layout-content.dark-mode .ant-table-thead > tr > th {
          background-color: #1D1D1D !important;
          color: #ADADAD !important;
          border-color: #2C2C2C !important;
        }
        .ant-layout-content.dark-mode .ant-table-tbody > tr > td {
          background-color: #141414 !important;
          border-color: #2C2C2C !important;
          color: #DCDCDC !important;
        }
        .ant-layout-content.dark-mode .ant-table-tbody > tr:hover > td {
          background-color: #1D1D1D !important;
        }
        .ant-layout-content.dark-mode .ant-table-wrapper .ant-table-pagination {
          background: transparent !important;
        }
        /* 操作列按钮样式（规范文档） */
        .ant-table .ant-btn-text {
          padding: 0 !important;
          background-color: transparent !important;
          border: none !important;
          box-shadow: none !important;
          height: auto !important;
        }
        .ant-table .ant-btn-text:hover {
          background-color: transparent !important;
        }
        .ant-table .ant-btn-text .ant-btn-icon {
          margin-right: 4px !important;
        }
        /* 亮色模式模态框（规范文档模块/卡片色） */
        body:not(.dark-mode) .ant-modal-content {
          background-color: #FFFFFF !important;
        }
        body:not(.dark-mode) .ant-modal-header {
          background-color: #FFFFFF !important;
        }
        /* 暗色模式模态框（规范文档模块/卡片色） */
        body.dark-mode .ant-modal-content {
          background-color: #141414 !important;
        }
        body.dark-mode .ant-modal-header {
          background-color: #141414 !important;
          border-color: #2C2C2C !important;
        }
        body.dark-mode .ant-modal-title {
          color: #FFFFFF !important;
        }
        body.dark-mode .ant-modal-body {
          color: #DCDCDC !important;
        }
        body.dark-mode .ant-modal-footer {
          border-color: #2C2C2C !important;
        }
        /* 统一遮罩层（#000000 50%透明度） */
        .ant-modal-mask {
          background-color: rgba(0, 0, 0, 0.5) !important;
        }
        /* 暗色模式标签 - 保持与浅色模式一致的配色 */
        .ant-layout-content.dark-mode .ant-tag {
          background-color: transparent !important;
          border-width: 1px !important;
          border-style: solid !important;
        }
        .ant-layout-content.dark-mode .ant-tag-red,
        .ant-layout-content.dark-mode .ant-tag-color-error {
          color: #F53F3F !important;
          border-color: #F53F3F !important;
          background-color: rgba(245, 63, 63, 0.1) !important;
        }
        .ant-layout-content.dark-mode .ant-tag-orange,
        .ant-layout-content.dark-mode .ant-tag-color-warning {
          color: #D89614 !important;
          border-color: #D89614 !important;
          background-color: rgba(216, 150, 20, 0.1) !important;
        }
        .ant-layout-content.dark-mode .ant-tag-blue,
        .ant-layout-content.dark-mode .ant-tag-color-info {
          color: #177DDC !important;
          border-color: #177DDC !important;
          background-color: rgba(23, 125, 220, 0.1) !important;
        }
        .ant-layout-content.dark-mode .ant-tag-green,
        .ant-layout-content.dark-mode .ant-tag-color-success {
          color: #49AA19 !important;
          border-color: #49AA19 !important;
          background-color: rgba(73, 170, 25, 0.1) !important;
        }
        .ant-layout-content.dark-mode .ant-tag-gray,
        .ant-layout-content.dark-mode .ant-tag-color-default {
          color: #595959 !important;
          border-color: #D9D9D9 !important;
          background-color: rgba(217, 217, 217, 0.3) !important;
        }
        /* 去除表头竖线 */
        .ant-table-wrapper .ant-table-thead > tr > th,
        .ant-table-wrapper .ant-table-thead > tr > th.ant-table-cell {
          border-right: none !important;
          border-left: none !important;
          border-inline-end: none !important;
          border-inline-start: none !important;
        }
        /* 暗色模式分页 */
        .ant-layout-content.dark-mode .ant-pagination-item {
          background-color: #262626 !important;
          border-color: #373737 !important;
        }
        .ant-layout-content.dark-mode .ant-pagination-item a {
          color: #DCDCDC !important;
        }
        .ant-layout-content.dark-mode .ant-pagination-item-active {
          background-color: #177DDC !important;
          border-color: #177DDC !important;
        }
        .ant-layout-content.dark-mode .ant-pagination-prev .ant-pagination-item-link,
        .ant-layout-content.dark-mode .ant-pagination-next .ant-pagination-item-link {
          background-color: #262626 !important;
          border-color: #373737 !important;
          color: #DCDCDC !important;
        }
        /* 顶部导航下拉菜单样式 */
        .ant-dropdown-menu {
          padding: 8px !important;
          border-radius: 8px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        }
        body:not(.dark-mode) .ant-dropdown-menu {
          background-color: #FFFFFF !important;
          border: 1px solid #E5E5E5 !important;
        }
        body.dark-mode .ant-dropdown-menu {
          background-color: #141414 !important;
          border: 1px solid #2C2C2C !important;
        }
        .ant-dropdown-menu-item,
        .ant-dropdown-menu-submenu-title {
          border-radius: 6px !important;
          padding: 10px 16px !important;
          font-size: 14px !important;
          transition: all 0.2s ease !important;
        }
        body:not(.dark-mode) .ant-dropdown-menu-item,
        body:not(.dark-mode) .ant-dropdown-menu-submenu-title {
          color: #262626 !important;
        }
        body.dark-mode .ant-dropdown-menu-item,
        body.dark-mode .ant-dropdown-menu-submenu-title {
          color: #DCDCDC !important;
        }
        .ant-dropdown-menu-item:hover,
        .ant-dropdown-menu-submenu-title:hover {
          background-color: #E7F2FB !important;
          color: #177DDC !important;
        }
        body.dark-mode .ant-dropdown-menu-item:hover,
        body.dark-mode .ant-dropdown-menu-submenu-title:hover {
          background-color: #1D1D1D !important;
          color: #177DDC !important;
        }
        .ant-dropdown-menu-submenu {
          position: relative !important;
        }
        /* 三级菜单弹出层样式 */
        .ant-dropdown-menu-submenu-popup {
          border-radius: 8px !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15) !important;
        }
        body:not(.dark-mode) .ant-dropdown-menu-submenu-popup {
          background-color: #FFFFFF !important;
          border: 1px solid #E5E5E5 !important;
        }
        body.dark-mode .ant-dropdown-menu-submenu-popup {
          background-color: #141414 !important;
          border: 1px solid #2C2C2C !important;
        }
        body:not(.dark-mode) .ant-dropdown-menu-submenu-popup .ant-dropdown-menu {
          background-color: #FFFFFF !important;
          border: none !important;
        }
        body.dark-mode .ant-dropdown-menu-submenu-popup .ant-dropdown-menu {
          background-color: #141414 !important;
          border: none !important;
        }
        .ant-dropdown-menu-submenu-popup .ant-dropdown-menu-item {
          padding: 8px 14px !important;
          font-size: 13px !important;
        }
        /* 下拉菜单图标样式 */
        .ant-dropdown-menu-item .anticon,
        .ant-dropdown-menu-submenu-title .anticon {
          font-size: 16px !important;
          margin-right: 10px !important;
        }
      `}</style>
      <AntLayout style={{ height: '100vh' }}>
        <Header
          style={{
            height: 50,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#177DDC',
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          {/* 左侧 */}
          <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
            <div style={{ width: 240, padding: '0 16px', height: '100%', display: 'flex', alignItems: 'center', borderRight: `1px solid rgba(255,255,255,0.2)` }}>
              <span style={{ color: '#FFFFFF', fontSize: 16, fontWeight: 500 }}>
                省肿LIMS管理系统
              </span>
            </div>

            {/* 一级导航 */}
            <div style={{ display: 'flex', height: '100%' }}>
              <div style={{ padding: '0 12px', height: '100%', display: 'flex', alignItems: 'center' }}>
                <div
                  onClick={toggleSidebar}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    backgroundColor: '#177DDC',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: 20,
                    color: '#FFFFFF',
                  }}
                >
                  {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                </div>
              </div>
              {/* 首页 - 无子菜单 */}
              <div
                onClick={() => handleNavChange('home')}
                className={`nav-item ${currentNav === 'home' ? 'active' : ''}`}
              >
                <HomeOutlined style={{ fontSize: 18 }} />
                <span>首页</span>
              </div>
              {/* 科研管理 */}
              <div
                onClick={() => handleNavChange('research')}
                onMouseEnter={() => setHoverNav('research')}
                onMouseLeave={() => setHoverNav(null)}
                className={`nav-item ${currentNav === 'research' ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                <FolderOpenOutlined style={{ fontSize: 18 }} />
                <span>科研管理</span>
              </div>
              {/* 实验室业务 */}
              <div
                onClick={() => handleNavChange('lab')}
                onMouseEnter={() => setHoverNav('lab')}
                onMouseLeave={() => setHoverNav(null)}
                className={`nav-item ${currentNav === 'lab' ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                <ExperimentOutlined style={{ fontSize: 18 }} />
                <span>实验室业务</span>
              </div>
              {/* 智能物联 */}
              <div
                onClick={() => handleNavChange('iot')}
                onMouseEnter={() => setHoverNav('iot')}
                onMouseLeave={() => setHoverNav(null)}
                className={`nav-item ${currentNav === 'iot' ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                <CiOutlined style={{ fontSize: 18 }} />
                <span>智能物联</span>
              </div>
              {/* AI智能辅助 */}
              <div
                onClick={() => handleNavChange('ai')}
                onMouseEnter={() => setHoverNav('ai')}
                onMouseLeave={() => setHoverNav(null)}
                className={`nav-item ${currentNav === 'ai' ? 'active' : ''}`}
                style={{ position: 'relative' }}
              >
                <RobotOutlined style={{ fontSize: 18 }} />
                <span>AI智能辅助</span>
              </div>
            </div>
          </div>

          {/* 悬停菜单面板 - 显示所有二级和三级菜单 */}
          {hoverNav && (
            <div
              onMouseEnter={() => setHoverNav(hoverNav)}
              onMouseLeave={() => setHoverNav(null)}
              style={{
                position: 'fixed',
                top: 50,
                left: 240,
                right: 0,
                backgroundColor: isDark ? '#141414' : '#FFFFFF',
                borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
                zIndex: 999,
                padding: '16px 24px',
                display: 'grid',
                gridTemplateColumns: 'max-content 1fr',
                gap: '16px 24px',
                maxHeight: 'calc(100vh - 50px)',
                overflowY: 'auto',
              }}
            >
              {/* 科研管理 */}
              <div style={{
                border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
                borderRadius: 8,
                padding: '12px 16px',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#177DDC', height: 30, display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  科研管理
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px' }}>
                  {researchMenuItems.map((secondLevel: any) => (
                    <div key={secondLevel.key}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#49AA19', height: 30, display: 'flex', alignItems: 'center' }}>
                        {secondLevel.label}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {secondLevel.children.map((thirdLevel: any) => (
                          <div
                            key={thirdLevel.key}
                            onClick={() => { navigate(thirdLevel.key); setHoverNav(null) }}
                            style={{
                              fontSize: 12,
                              color: isDark ? '#ADADAD' : '#595959',
                              height: 30,
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0 8px',
                              borderRadius: 4,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? '#1D1D1D' : '#E7F2FB'
                              e.currentTarget.style.color = '#177DDC'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = isDark ? '#ADADAD' : '#595959'
                            }}
                          >
                            {thirdLevel.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 实验室业务 */}
              <div style={{
                border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
                borderRadius: 8,
                padding: '12px 16px',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#177DDC', height: 30, display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  实验室业务
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px' }}>
                  {labMenuItems.map((secondLevel: any) => (
                    <div key={secondLevel.key}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#49AA19', height: 30, display: 'flex', alignItems: 'center' }}>
                        {secondLevel.label}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {secondLevel.children.map((thirdLevel: any) => (
                          <div
                            key={thirdLevel.key}
                            onClick={() => { navigate(thirdLevel.key); setHoverNav(null) }}
                            style={{
                              fontSize: 12,
                              color: isDark ? '#ADADAD' : '#595959',
                              height: 30,
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0 8px',
                              borderRadius: 4,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? '#1D1D1D' : '#E7F2FB'
                              e.currentTarget.style.color = '#177DDC'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = isDark ? '#ADADAD' : '#595959'
                            }}
                          >
                            {thirdLevel.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 智能物联 */}
              <div style={{
                border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
                borderRadius: 8,
                padding: '12px 16px',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#177DDC', height: 30, display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  智能物联
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px' }}>
                  {iotMenuItems.map((secondLevel: any) => (
                    <div key={secondLevel.key}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#49AA19', height: 30, display: 'flex', alignItems: 'center' }}>
                        {secondLevel.label}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {secondLevel.children.map((thirdLevel: any) => (
                          <div
                            key={thirdLevel.key}
                            onClick={() => { navigate(thirdLevel.key); setHoverNav(null) }}
                            style={{
                              fontSize: 12,
                              color: isDark ? '#ADADAD' : '#595959',
                              height: 30,
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0 8px',
                              borderRadius: 4,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? '#1D1D1D' : '#E7F2FB'
                              e.currentTarget.style.color = '#177DDC'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = isDark ? '#ADADAD' : '#595959'
                            }}
                          >
                            {thirdLevel.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI智能辅助 */}
              <div style={{
                border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
                borderRadius: 8,
                padding: '12px 16px',
              }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: '#177DDC', height: 30, display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                  AI智能辅助
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px 32px' }}>
                  {aiMenuItems.map((secondLevel: any) => (
                    <div key={secondLevel.key}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#49AA19', height: 30, display: 'flex', alignItems: 'center' }}>
                        {secondLevel.label}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                        {secondLevel.children.map((thirdLevel: any) => (
                          <div
                            key={thirdLevel.key}
                            onClick={() => { navigate(thirdLevel.key); setHoverNav(null) }}
                            style={{
                              fontSize: 12,
                              color: isDark ? '#ADADAD' : '#595959',
                              height: 30,
                              display: 'flex',
                              alignItems: 'center',
                              padding: '0 8px',
                              borderRadius: 4,
                              cursor: 'pointer',
                              whiteSpace: 'nowrap',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDark ? '#1D1D1D' : '#E7F2FB'
                              e.currentTarget.style.color = '#177DDC'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                              e.currentTarget.style.color = isDark ? '#ADADAD' : '#595959'
                            }}
                          >
                            {thirdLevel.label}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 右侧 */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '0 16px', height: '100%' }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: '#177DDC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 20,
                color: '#FFFFFF',
              }}
            >
              <SearchOutlined />
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: '#177DDC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 20,
                color: '#FFFFFF',
              }}
              onClick={toggleTheme}
            >
              {isDark ? <SunOutlined /> : <MoonOutlined />}
            </div>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 6,
                backgroundColor: '#177DDC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                fontSize: 20,
                color: '#FFFFFF',
              }}
            >
              <BellOutlined />
            </div>
            <Avatar size={32} icon={<UserOutlined />} />
          </div>
        </Header>

        <AntLayout>
          <Sider
            width={240}
            collapsed={collapsed}
            trigger={null}
            className={isDark ? 'dark-sidebar' : 'light-sidebar'}
            style={{
              height: 'calc(100vh - 50px)',
              overflow: 'auto',
              backgroundColor: isDark ? '#141414' : '#FFFFFF',
              borderRight: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[location.pathname]}
              openKeys={openKeys}
              onOpenChange={handleOpenChange}
              items={sidebarItems}
              onClick={handleSidebarClick}
              style={{ padding: '10px', height: '100%', backgroundColor: 'transparent' }}
              theme={isDark ? 'dark' : 'light'}
              inlineIndent={24}
            />
          </Sider>

          <Content
            className={isDark ? 'dark-mode' : ''}
            style={{
              background: isDark ? '#080808' : '#F7F7F7',
              padding: 20,
              overflowX: 'auto',
              minHeight: 'calc(100vh - 50px)',
              width: '100%',
              boxSizing: 'border-box',
            }}
          >
            {children}
          </Content>
        </AntLayout>
      </AntLayout>

      {/* AI智能助手悬浮图标 */}
      {aiExpanded && (
        <div 
          onClick={() => setAiExpanded(false)}
          style={{ position: 'fixed', inset: 0, zIndex: 998 }}
        />
      )}
      <div style={{ 
        position: 'fixed', 
        bottom: 40, 
        right: 40, 
        zIndex: 1001, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'flex-end', 
        gap: 12 
      }}>
        {aiExpanded && (
          <>
            <div 
              className="ai-action-btn"
              style={{ 
                transform: 'translateY(12px)', 
                opacity: aiExpanded ? 1 : 0, 
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)' 
              }}
            >
              <button
                onClick={() => { setAiDrawerOpen(true); setOcrDrawerOpen(false); setAiExpanded(false); }}
                style={{
                  padding: '12px 20px',
                  borderRadius: 24,
                  backgroundColor: isDark ? '#141414' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isDark ? '#DCDCDC' : '#262626',
                  transition: 'all 0.2s ease',
                  marginBottom: 8
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#177DDC';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#177DDC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDark ? '#2C2C2C' : '#E5E5E5';
                  e.currentTarget.style.backgroundColor = isDark ? '#141414' : '#FFFFFF';
                  e.currentTarget.style.color = isDark ? '#DCDCDC' : '#262626';
                }}
              >
                <MessageOutlined style={{ fontSize: 16, color: '#177DDC' }} />
                智能问答
              </button>
              <button
                onClick={() => { setOcrDrawerOpen(true); setAiDrawerOpen(false); setAiExpanded(false); }}
                style={{
                  padding: '12px 20px',
                  borderRadius: 24,
                  backgroundColor: isDark ? '#141414' : '#FFFFFF',
                  border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: isDark ? '#DCDCDC' : '#262626',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#177DDC';
                  e.currentTarget.style.backgroundColor = '#FFFFFF';
                  e.currentTarget.style.color = '#177DDC';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = isDark ? '#2C2C2C' : '#E5E5E5';
                  e.currentTarget.style.backgroundColor = isDark ? '#141414' : '#FFFFFF';
                  e.currentTarget.style.color = isDark ? '#DCDCDC' : '#262626';
                }}
              >
                <ScanOutlined style={{ fontSize: 16, color: '#177DDC' }} />
                OCR识别
              </button>
            </div>
          </>
        )}
        <button
          className="ai-floating-btn"
          onClick={() => {
            if (location.pathname.includes('/lab/eln/record/create') || location.pathname.includes('/lab/eln/record/edit')) {
              window.dispatchEvent(new CustomEvent('open-ai-modal'))
            } else {
              setAiExpanded(!aiExpanded)
            }
          }}
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #177DDC 0%, #0F5AA6 100%)',
            border: 'none',
            boxShadow: '0 4px 20px rgba(23, 125, 220, 0.4)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.12)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
          }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 天线 */}
            <rect x="11" y="0" width="2" height="3" rx="1" fill="#FFFFFF"/>
            <circle cx="12" cy="0" r="2" fill="#FFFFFF"/>
            {/* 左右侧耳 */}
            <rect x="0" y="7" width="3" height="8" rx="1.5" fill="#FFFFFF"/>
            <rect x="21" y="7" width="3" height="8" rx="1.5" fill="#FFFFFF"/>
            {/* 头部外框 */}
            <rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="#FFFFFF" strokeWidth="2"/>
            {/* 脸部屏幕 */}
            <rect x="6" y="8" width="12" height="9" rx="2" fill="#FFFFFF" opacity="0.2"/>
            {/* 眼睛 */}
            <circle cx="9.5" cy="12.5" r="1.5" fill="#FFFFFF"/>
            <circle cx="14.5" cy="12.5" r="1.5" fill="#FFFFFF"/>
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes aiPulse {
          0%, 100% { box-shadow: 0 4px 20px rgba(23, 125, 220, 0.4); }
          50% { box-shadow: 0 4px 28px rgba(23, 125, 220, 0.6); }
        }
        
        @keyframes aiSlideUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .ai-floating-btn {
          animation: aiPulse 2.5s ease-in-out infinite;
        }
        
        .ai-floating-btn:hover {
          animation: none;
        }
        
        .ai-action-btn {
          animation: aiSlideUp 0.35s cubic-bezier(0.4, 0, 0.2, 1) both;
        }
        
        .ai-action-btn:nth-child(2) {
          animation-delay: 0.05s;
        }
      `}</style>

      {/* 智能问答右下角弹窗 */}
      {aiDrawerOpen && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          right: 40,
          width: 400,
          maxHeight: 'calc(100vh - 140px)',
          height: 600,
          zIndex: 1000,
          backgroundColor: isDark ? '#141414' : '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#DCDCDC' : '#262626' }}>智能问答</span>
            <Button type="text" size="small" onClick={() => setAiDrawerOpen(false)} style={{ color: isDark ? '#ADADAD' : '#8C8C8C' }}>✕</Button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 0 }}>
            <AIExperiment />
          </div>
        </div>
      )}

      {/* OCR识别右下角弹窗 */}
      {ocrDrawerOpen && (
        <div style={{
          position: 'fixed',
          bottom: 100,
          right: 40,
          width: 400,
          maxHeight: 'calc(100vh - 140px)',
          height: 600,
          zIndex: 1000,
          backgroundColor: isDark ? '#141414' : '#FFFFFF',
          borderRadius: 12,
          boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#DCDCDC' : '#262626' }}>OCR识别</span>
            <Button type="text" size="small" onClick={() => setOcrDrawerOpen(false)} style={{ color: isDark ? '#ADADAD' : '#8C8C8C' }}>✕</Button>
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: 0 }}>
            <OCRRecognition compact />
          </div>
        </div>
      )}
    </>
  )
}