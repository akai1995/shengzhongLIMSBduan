import { Layout as AntLayout, Menu, Avatar, Button } from 'antd'
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
} from '@ant-design/icons'
import { useThemeStore } from '../store/themeStore'
import { useSidebarStore } from '../store/sidebarStore'
import { useState, useEffect, type ReactNode } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

const { Header, Sider, Content } = AntLayout

interface LayoutProps {
  children: ReactNode
}

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
      { key: '/research/achievements', label: '成果管理', icon: <TrophyOutlined /> },
      { key: '/research/funds', label: '经费管理', icon: <DollarOutlined /> },
    ],
  },
  {
    key: 'approval',
    label: '流程审批中心',
    icon: <FileTextOutlined />,
    children: [
      { key: '/approval/pending', label: '待办事项', icon: <FileTextOutlined /> },
      { key: '/approval/done', label: '已办事项', icon: <FileTextOutlined /> },
      { key: '/approval/cc', label: '抄送管理', icon: <ShareAltOutlined /> },
    ],
  },
  {
    key: 'training',
    label: '培训与考试管理',
    icon: <BookOutlined />,
    children: [
      { key: '/training/materials', label: '培训资料', icon: <VideoCameraOutlined /> },
      { key: '/training/learning', label: '在线学习', icon: <ReadOutlined /> },
      { key: '/training/question-bank', label: '题库管理', icon: <BookOutlined /> },
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
        { key: '/lab/safety/visit', label: '来访申请', icon: <UserOutlined /> },
        { key: '/lab/safety/notice', label: '安全须知', icon: <SafetyCertificateOutlined /> },
        { key: '/lab/safety/records', label: '来访记录', icon: <HistoryOutlined /> },
      ],
    },
  {
    key: 'equipment',
    label: '仪器设备管理',
    icon: <ExperimentOutlined />,
    children: [
      { key: '/lab/equipment/archive', label: '仪器档案', icon: <FileSearchOutlined /> },
      { key: '/lab/equipment/reservation', label: '预约登记', icon: <CalendarOutlined /> },
      { key: '/lab/equipment/usage', label: '使用记录', icon: <HistoryOutlined /> },
      { key: '/lab/equipment/maintenance', label: '维护提醒', icon: <AlertOutlined /> },
      { key: '/lab/equipment/monitor', label: '状态监控', icon: <MonitorOutlined /> },
    ],
  },
  {
    key: 'reagent',
    label: '试剂耗材管理',
    icon: <ScanOutlined />,
    children: [
      { key: '/lab/reagent/purchase', label: '采购登记', icon: <ShoppingCartOutlined /> },
      { key: '/lab/reagent/inbound', label: '入库管理（扫码入库）', icon: <InboxOutlined /> },
      { key: '/lab/reagent/stock', label: '库存查询', icon: <BarChartOutlined /> },
      { key: '/lab/reagent/borrow', label: '领用归还', icon: <FileSyncOutlined /> },
      { key: '/lab/reagent/warning', label: '库存预警', icon: <WarningOutlined /> },
    ],
  },
  {
    key: 'hazardous',
    label: '危化品与废弃物管理',
    icon: <WarningOutlined />,
    children: [
      { key: '/lab/hazardous/purchase', label: '采购登记', icon: <ShoppingCartOutlined /> },
      { key: '/lab/hazardous/inbound', label: '入库管理', icon: <InboxOutlined /> },
      { key: '/lab/hazardous/borrow', label: '领用归还', icon: <FileSyncOutlined /> },
      { key: '/lab/hazardous/stock', label: '库存查询', icon: <FileTextOutlined /> },
      { key: '/lab/hazardous/warning', label: '库存预警', icon: <WarningOutlined /> },
      { key: '/lab/hazardous/waste', label: '废弃物申请', icon: <SendOutlined /> },
      { key: '/lab/hazardous/process', label: '处理记录', icon: <HistoryOutlined /> },
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
    key: 'eln',
    label: '电子实验记录本',
    icon: <EditOutlined />,
    children: [
      { key: '/lab/eln/ai-assistant', label: 'AI助手', icon: <RobotOutlined /> },
      { key: '/lab/eln/record', label: '实验记录', icon: <EditOutlined /> },
      { key: '/lab/eln/template', label: '实验模板管理', icon: <FileExcelOutlined /> },
      { key: '/lab/eln/signature', label: '电子签名', icon: <SafetyCertificateOutlined /> },
      { key: '/lab/eln/report', label: '报告生成', icon: <FilePdfOutlined /> },
      { key: '/lab/eln/report-template', label: '报告模板管理', icon: <FileTextOutlined /> },
      { key: '/lab/eln/share', label: '共享协作', icon: <ShareIcon /> },
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
      { key: '/iot/temperature-humidity', label: '温湿度监控', icon: <MonitorOutlined /> },
      { key: '/iot/device-status', label: '设备状态监控', icon: <ClockCircleOutlined /> },
      { key: '/iot/abnormal-alarm', label: '异常报警', icon: <AlertOutlined /> },
      { key: '/iot/alarm-records', label: '报警记录', icon: <HistoryOutlined /> },
    ],
  },
  {
    key: 'uvc',
    label: '紫外线消毒灯',
    icon: <BulbOutlined />,
    children: [
      { key: '/iot/uvc', label: '紫外线灯管理', icon: <MonitorOutlined /> },
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
      { key: '/ai/knowledge/search', label: '全文检索', icon: <SearchOutlined /> },
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

  const sidebarItems = currentNav === 'research' ? researchMenuItems : 
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
              <div
                onClick={() => handleNavChange('home')}
                className={`nav-item ${currentNav === 'home' ? 'active' : ''}`}
              >
                <HomeOutlined style={{ fontSize: 18 }} />
                <span>首页</span>
              </div>
              <div
                onClick={() => handleNavChange('research')}
                className={`nav-item ${currentNav === 'research' ? 'active' : ''}`}
              >
                <FolderOpenOutlined style={{ fontSize: 18 }} />
                <span>科研管理</span>
              </div>
              <div
                onClick={() => handleNavChange('lab')}
                className={`nav-item ${currentNav === 'lab' ? 'active' : ''}`}
              >
                <ExperimentOutlined style={{ fontSize: 18 }} />
                <span>实验室业务</span>
              </div>
              <div
                onClick={() => handleNavChange('iot')}
                className={`nav-item ${currentNav === 'iot' ? 'active' : ''}`}
              >
                <CiOutlined style={{ fontSize: 18 }} />
                <span>智能物联</span>
              </div>
              <div
                onClick={() => handleNavChange('ai')}
                className={`nav-item ${currentNav === 'ai' ? 'active' : ''}`}
              >
                <RobotOutlined style={{ fontSize: 18 }} />
                <span>AI智能辅助</span>
              </div>
            </div>
          </div>

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
    </>
  )
}