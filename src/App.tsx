import { ConfigProvider, theme } from 'antd'
import { useThemeStore } from './store/themeStore'
import MainLayout from './components/Layout'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'

import ProjectInitiation from './pages/research/ProjectInitiation'
import ProgressManagement from './pages/research/ProgressManagement'
import MemberManagement from './pages/research/MemberManagement'
import AchievementManagement from './pages/research/AchievementManagement'
import FundManagement from './pages/research/FundManagement'
import PendingTasks from './pages/approval/PendingTasks'
import DoneTasks from './pages/approval/DoneTasks'
import ApprovalOperation from './pages/approval/ApprovalOperation'
import CcManagement from './pages/approval/CcManagement'
import TrainingMaterials from './pages/training/TrainingMaterials'
import OnlineLearning from './pages/training/OnlineLearning'
import QuestionBank from './pages/training/QuestionBank'
import OnlineExam from './pages/training/OnlineExam'
import ScoreQuery from './pages/training/ScoreQuery'

import VisitRequest from './pages/lab/safety/VisitRequest'
import SafetyNotice from './pages/lab/safety/SafetyNotice'
import VisitRecords from './pages/lab/safety/VisitRecords'

import EquipmentArchive from './pages/lab/equipment/EquipmentArchive'
import EquipmentReservation from './pages/lab/equipment/EquipmentReservation'
import EquipmentUsage from './pages/lab/equipment/EquipmentUsage'
import EquipmentMaintenance from './pages/lab/equipment/EquipmentMaintenance'
import EquipmentMonitor from './pages/lab/equipment/EquipmentMonitor'

import ReagentPurchase from './pages/lab/reagent/ReagentPurchase'
import ReagentInbound from './pages/lab/reagent/ReagentInbound'
import ReagentStock from './pages/lab/reagent/ReagentStock'
import ReagentBorrow from './pages/lab/reagent/ReagentBorrow'
import ReagentWarning from './pages/lab/reagent/ReagentWarning'

import HazardousPurchase from './pages/lab/hazardous/HazardousPurchase'
import HazardousInbound from './pages/lab/hazardous/HazardousInbound'
import HazardousBorrow from './pages/lab/hazardous/HazardousBorrow'
import HazardousStock from './pages/lab/hazardous/HazardousStock'
import HazardousWarning from './pages/lab/hazardous/HazardousWarning'
import WasteRequest from './pages/lab/hazardous/WasteRequest'
import WasteProcess from './pages/lab/hazardous/WasteProcess'

import ElnRecord from './pages/lab/eln/ElnRecord'
import ElnTemplate from './pages/lab/eln/ElnTemplate'
import ElnReportTemplate from './pages/lab/eln/ElnReportTemplate'
import ElnSignature from './pages/lab/eln/ElnSignature'
import ElnReport from './pages/lab/eln/ElnReport'
import ElnShare from './pages/lab/eln/ElnShare'
import ElnAIAssistant from './pages/lab/eln/ElnAIAssistant'

import UsbData from './pages/lab/data/UsbData'
import ExperimentData from './pages/lab/data/ExperimentData'
import SoftwareManagement from './pages/lab/software/SoftwareManagement'

import EnvironmentMonitor from './pages/iot/EnvironmentMonitor'
import TemperatureHumidityMonitor from './pages/iot/TemperatureHumidityMonitor'
import AbnormalAlarm from './pages/iot/AbnormalAlarm'
import AlarmRecords from './pages/iot/AlarmRecords'
import UVCManagement from './pages/iot/UVCManagement'
import UVCControl from './pages/iot/UVCControl'
import UVCDisinfection from './pages/iot/UVCDisinfection'
import UVCReport from './pages/iot/UVCReport'
import UVCAlarm from './pages/iot/UVCAlarm'
import SmartAnalysis from './pages/iot/SmartAnalysis'
import AccessControl from './pages/iot/AccessControl'
import AccessRecords from './pages/iot/AccessRecords'

import DataCollection from './pages/data/DataCollection'
import StorageManagement from './pages/data/StorageManagement'
import DataBackup from './pages/data/DataBackup'
import DataQuery from './pages/data/DataQuery'
import KnowledgeUpload from './pages/data/KnowledgeUpload'
import KnowledgeCategory from './pages/data/KnowledgeCategory'
import KnowledgeSearch from './pages/data/KnowledgeSearch'
import KnowledgePermission from './pages/data/KnowledgePermission'

import StorageAudit from './pages/data/usb/StorageAudit'
import FileRecords from './pages/data/usb/FileRecords'
import DeviceRecords from './pages/data/usb/DeviceRecords'
import ApplyRecords from './pages/data/usb/ApplyRecords'
import EncryptionRecords from './pages/data/usb/EncryptionRecords'

import OCRRecognition from './pages/ai/OCRRecognition'
import TextRecognition from './pages/ai/TextRecognition'
import AIExperiment from './pages/ai/AIExperiment'
import AIReportAnalysis from './pages/ai/AIReportAnalysis'
import FaceLibrary from './pages/ai/FaceLibrary'
import AttendanceManagement from './pages/ai/AttendanceManagement'

function App() {
  const { isDark } = useThemeStore()

  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#177DDC',
          colorSuccess: '#49AA19',
          colorWarning: '#D89614',
          colorError: '#F53F3F',
          borderRadius: 4,
          // 暗色模式颜色
          colorBgBase: isDark ? '#080808' : '#F7F7F7',
          colorBgContainer: isDark ? '#141414' : '#FFFFFF',
          colorBorder: isDark ? '#2C2C2C' : '#E5E5E5',
          colorBorderSecondary: isDark ? '#373737' : '#D9D9D9',
          colorText: isDark ? '#DCDCDC' : '#262626',
          colorTextSecondary: isDark ? '#ADADAD' : '#595959',
          colorTextPlaceholder: isDark ? '#7E7E7E' : '#8C8C8C',
          colorTextDisabled: isDark ? '#5B5B5B' : '#B2B2B2',
          colorTextHeading: isDark ? '#FFFFFF' : '#000000',
        },
        components: {
          Layout: {
            headerBg: '#177DDC',
            siderBg: isDark ? '#141414' : '#FFFFFF',
          },
          Menu: {
            itemBg: 'transparent',
            itemHoverBg: isDark ? '#1D1D1D' : '#F5F5F5',
            itemSelectedBg: isDark ? '#141F28' : '#E7F2FB',
            itemSelectedColor: '#177DDC',
            itemHeight: 40,
            borderRadius: 6,
            itemPaddingInline: 12,
            darkItemBg: 'transparent',
            darkItemHoverBg: '#1D1D1D',
            darkItemSelectedBg: '#141F28',
            darkItemSelectedColor: '#177DDC',
          },
          Tabs: {
            fontSize: 16,
          },
          Tag: {
            colorSuccess: '#49AA19',
            colorWarning: '#D89614',
            colorError: '#F53F3F',
            colorInfo: '#177DDC',
            colorBlue: '#177DDC',
            colorOrange: '#D89614',
            colorRed: '#F53F3F',
            colorGreen: '#49AA19',
          },
        },
      }}
      locale={{
        locale: 'zh_CN',
        DatePicker: {
          lang: {
            locale: 'zh_CN',
            placeholder: '请选择日期',
            rangePlaceholder: ['开始日期', '结束日期'],
            today: '今天',
            now: '现在',
            week: '周',
            time: '时间',
            confirm: '确定',
            cancel: '取消',
          },
          dateFormat: 'YYYY-MM-DD',
          dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
          monthFormat: 'YYYY-MM',
          previousMonth: '上个月',
          nextMonth: '下个月',
          previousYear: '上一年',
          nextYear: '下一年',
        },
      }}
    >
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          
          <Route path="/research/project-initiation" element={<ProjectInitiation />} />
          <Route path="/research/progress" element={<ProgressManagement />} />
          <Route path="/research/members" element={<MemberManagement />} />
          <Route path="/research/achievements" element={<AchievementManagement />} />
          <Route path="/research/funds" element={<FundManagement />} />
          
          <Route path="/approval/pending" element={<PendingTasks />} />
          <Route path="/approval/done" element={<DoneTasks />} />
          <Route path="/approval/operation" element={<ApprovalOperation />} />
          <Route path="/approval/cc" element={<CcManagement />} />
          
          <Route path="/training/materials" element={<TrainingMaterials />} />
          <Route path="/training/learning" element={<OnlineLearning />} />
          <Route path="/training/question-bank" element={<QuestionBank />} />
          <Route path="/training/exam" element={<OnlineExam />} />
          <Route path="/training/scores" element={<ScoreQuery />} />
          
          <Route path="/lab/safety/visit" element={<VisitRequest />} />
          <Route path="/lab/safety/notice" element={<SafetyNotice />} />
          <Route path="/lab/safety/records" element={<VisitRecords />} />
          
          <Route path="/lab/equipment/archive" element={<EquipmentArchive />} />
          <Route path="/lab/equipment/reservation" element={<EquipmentReservation />} />
          <Route path="/lab/equipment/usage" element={<EquipmentUsage />} />
          <Route path="/lab/equipment/maintenance" element={<EquipmentMaintenance />} />
          <Route path="/lab/equipment/monitor" element={<EquipmentMonitor />} />
          
          <Route path="/lab/reagent/purchase" element={<ReagentPurchase />} />
          <Route path="/lab/reagent/inbound" element={<ReagentInbound />} />
          <Route path="/lab/reagent/stock" element={<ReagentStock />} />
          <Route path="/lab/reagent/borrow" element={<ReagentBorrow />} />
          <Route path="/lab/reagent/warning" element={<ReagentWarning />} />
          
          <Route path="/lab/hazardous/purchase" element={<HazardousPurchase />} />
          <Route path="/lab/hazardous/inbound" element={<HazardousInbound />} />
          <Route path="/lab/hazardous/borrow" element={<HazardousBorrow />} />
          <Route path="/lab/hazardous/stock" element={<HazardousStock />} />
          <Route path="/lab/hazardous/warning" element={<HazardousWarning />} />
          <Route path="/lab/hazardous/waste" element={<WasteRequest />} />
          <Route path="/lab/hazardous/process" element={<WasteProcess />} />
          
          <Route path="/lab/data/usb" element={<UsbData />} />
          <Route path="/lab/data/experiment" element={<ExperimentData />} />
          <Route path="/lab/software" element={<SoftwareManagement />} />
          <Route path="/lab/eln/record" element={<ElnRecord />} />
          <Route path="/lab/eln/template" element={<ElnTemplate />} />
          <Route path="/lab/eln/report-template" element={<ElnReportTemplate />} />
          <Route path="/lab/eln/signature" element={<ElnSignature />} />
          <Route path="/lab/eln/report" element={<ElnReport />} />
          <Route path="/lab/eln/share" element={<ElnShare />} />
          <Route path="/lab/eln/ai-assistant" element={<ElnAIAssistant />} />
          
          <Route path="/iot/environment" element={<EnvironmentMonitor />} />
          <Route path="/iot/temperature-humidity" element={<TemperatureHumidityMonitor />} />
          <Route path="/iot/device-status" element={<EnvironmentMonitor />} />
          <Route path="/iot/abnormal-alarm" element={<AbnormalAlarm />} />
          <Route path="/iot/alarm-records" element={<AlarmRecords />} />
          <Route path="/iot/uvc" element={<UVCManagement />} />
          <Route path="/iot/uvc/schedule" element={<UVCDisinfection />} />
          <Route path="/iot/analysis" element={<SmartAnalysis />} />
          <Route path="/iot/access-control" element={<AccessControl />} />
          <Route path="/iot/access-control/records" element={<AccessRecords />} />
          
          <Route path="/data/collection" element={<DataCollection />} />
          <Route path="/data/storage" element={<StorageManagement />} />
          <Route path="/data/backup" element={<DataBackup />} />
          <Route path="/data/query" element={<DataQuery />} />
          <Route path="/data/knowledge/upload" element={<KnowledgeUpload />} />
          <Route path="/data/knowledge/category" element={<KnowledgeCategory />} />
          <Route path="/data/knowledge/search" element={<KnowledgeSearch />} />
          <Route path="/data/knowledge/permission" element={<KnowledgePermission />} />
          
          <Route path="/data/usb/audit" element={<StorageAudit />} />
          <Route path="/data/usb/file-records" element={<FileRecords />} />
          <Route path="/data/usb/device-records" element={<DeviceRecords />} />
          <Route path="/data/usb/apply-records" element={<ApplyRecords />} />
          <Route path="/data/usb/encryption-records" element={<EncryptionRecords />} />
          
          <Route path="/ai/ocr" element={<OCRRecognition />} />
          <Route path="/ai/text-recognition" element={<TextRecognition />} />
          <Route path="/ai/knowledge/upload" element={<KnowledgeUpload />} />
          <Route path="/ai/knowledge/category" element={<KnowledgeCategory />} />
          <Route path="/ai/knowledge/search" element={<KnowledgeSearch />} />
          <Route path="/ai/knowledge/permission" element={<KnowledgePermission />} />
          <Route path="/ai/experiment" element={<AIExperiment />} />
          <Route path="/ai/report-analysis" element={<AIReportAnalysis />} />
          <Route path="/ai/attendance/face-library" element={<FaceLibrary />} />
          <Route path="/ai/attendance/manage" element={<AttendanceManagement />} />
        </Routes>
      </MainLayout>
    </ConfigProvider>
  )
}

export default App
