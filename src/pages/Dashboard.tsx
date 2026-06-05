import { Card, Row, Col, Button, Modal } from 'antd'
import { 
  FileTextOutlined, 
  MoreOutlined, 
  UserOutlined, 
  BarChartOutlined,
  DatabaseOutlined,
  FolderOpenOutlined
} from '@ant-design/icons'
import { useState } from 'react'
import { useThemeStore } from '../store/themeStore'

export default function Dashboard() {
  const { isDark } = useThemeStore()
  const [activeTab, setActiveTab] = useState<'pending' | 'inProgress' | 'completed'>('pending')
  const [showAnnouncementModal, setShowAnnouncementModal] = useState(false)
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<typeof announcements[0] | null>(null)
  const [showAllAnnouncements, setShowAllAnnouncements] = useState(false)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState<typeof pendingTasks[0] | null>(null)

  const stats = [
    { title: '设备总数', value: '1800', icon: <UserOutlined />, bgColor: '#1C80DD' },
    { title: '耗材库存', value: '350000', icon: <DatabaseOutlined />, bgColor: '#22C55E' },
    { title: '实验数量', value: '2100', icon: <FolderOpenOutlined />, bgColor: '#F97316' },
    { title: '项目数量', value: '18000', icon: <FileTextOutlined />, bgColor: '#06B6D4' },
  ]

  const quickEntries = [
    { label: '设备管理', icon: <BarChartOutlined />, color: '#3B82F6' },
    { label: '耗材管理', icon: <DatabaseOutlined />, color: '#22C55E' },
    { label: '实验记录', icon: <FolderOpenOutlined />, color: '#F97316' },
    { label: '项目管理', icon: <FileTextOutlined />, color: '#06B6D4' },
    { label: '人员管理', icon: <UserOutlined />, color: '#EC4899' },
    { label: '系统设置', icon: <MoreOutlined />, color: '#6B7280' },
  ]

  const pendingTasks = [
    { id: 1, title: '新设备采购审批', subtitle: '设备管理', time: '2025-01-01 10:20:30', unread: true, detail: '申请采购液相色谱仪一台，预算金额50万元，请审批。' },
    { id: 2, title: '试剂采购审批', subtitle: '耗材管理', time: '2025-01-01 10:15:00', unread: true, detail: '申请采购实验试剂一批，共计15种试剂，总金额8万元。' },
    { id: 3, title: '实验项目立项', subtitle: '项目管理', time: '2025-01-01 09:30:00', unread: false, detail: '申请开展新型抗癌药物筛选研究项目，预计周期2年。' },
    { id: 4, title: '实验室借用申请', subtitle: '场地管理', time: '2025-01-01 09:00:00', unread: false, detail: '申请借用分子生物学实验室进行PCR实验。' },
    { id: 5, title: '安全培训申请', subtitle: '安全管理', time: '2024-12-31 16:00:00', unread: false, detail: '申请参加下季度安全培训课程。' },
    { id: 6, title: '数据导出审批', subtitle: '数据管理', time: '2024-12-31 15:30:00', unread: false, detail: '申请导出2024年度实验数据进行统计分析。' },
    { id: 7, title: '仪器预约确认', subtitle: '设备管理', time: '2024-12-31 14:00:00', unread: false, detail: '预约质谱仪进行样品分析，请确认时间安排。' },
  ]

  const inProgressTasks = [
    { id: 8, title: '实验报告审核', subtitle: '实验管理', time: '2025-01-01 10:20:30', detail: '正在审核编号EXP-2025-001的实验报告。' },
    { id: 9, title: '设备维护申请', subtitle: '设备管理', time: '2025-01-01 10:20:30', detail: '离心机故障维护申请，技术人员正在处理中。' },
    { id: 10, title: '耗材采购审批', subtitle: '耗材管理', time: '2025-01-01 10:20:30', detail: '常规耗材采购申请，正在走审批流程。' },
  ]

  const completedTasks = [
    { id: 11, title: '项目结项审批', subtitle: '项目管理', time: '2025-01-01 10:20:30', detail: '项目已完成结项审批，感谢各位评审专家。' },
    { id: 12, title: '安全培训签到', subtitle: '安全管理', time: '2025-01-01 10:20:30', detail: '已完成安全培训并签到，培训成绩合格。' },
  ]

  const announcements = [
    { id: 1, title: '实验室安全检查通知', detail: '定于下周二上午9:00进行实验室安全大检查，请各实验室提前做好准备工作。', time: '2025-01-01 10:20:30', unread: true },
    { id: 2, title: '新设备到货通知', detail: '采购的气相色谱仪已到货，请相关人员前往仓库办理签收手续。', time: '2025-01-01 09:15:00', unread: true },
    { id: 3, title: '试剂采购公示', detail: '2025年第一季度试剂采购计划已公示，请各部门核对并反馈意见。', time: '2024-12-31 16:30:00', unread: false },
    { id: 4, title: '系统维护通知', detail: '本周末将进行系统维护升级，届时系统将暂停服务，请提前做好数据备份。', time: '2024-12-30 14:00:00', unread: false },
    { id: 5, title: '实验技术培训', detail: '下周五下午2:00将举办实验技术培训，欢迎各位科研人员参加。', time: '2024-12-28 10:00:00', unread: false },
    { id: 6, title: '耗材库存预警', detail: '部分常用实验耗材库存不足，请各实验室及时提交采购申请。', time: '2024-12-25 15:30:00', unread: false },
    { id: 7, title: '门禁系统升级', detail: '门禁系统将于本周四进行升级，升级期间门禁刷卡可能会有短暂延迟。', time: '2024-12-23 09:00:00', unread: false },
  ]

  return (
    <div style={{ padding: 0, width: '100%', minHeight: '100%', backgroundColor: isDark ? '#0D0D0D' : '#F5F5F5' }}>
      <Row gutter={[16, 16]} style={{ display: 'flex' }}>
        <Col xs={24} lg={16} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Row gutter={[16, 16]}>
            {stats.map((stat, index) => (
              <Col xs={24} sm={12} md={6} key={index}>
                <div
                  style={{
                    backgroundColor: stat.bgColor,
                    borderRadius: 8,
                    padding: 20,
                    transition: 'all 0.2s',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ fontSize: 32, fontWeight: 600, color: '#FFFFFF', marginBottom: 4 }}>
                        {stat.value}
                      </div>
                      <div style={{ fontSize: 14, color: '#FFFFFF' }}>{stat.title}</div>
                    </div>
                    <div
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 8,
                        backgroundColor: 'rgba(255,255,255,0.2)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: 24, color: '#FFFFFF' }}>{stat.icon}</span>
                    </div>
                  </div>
                </div>
              </Col>
            ))}
          </Row>

          <Card style={{ borderRadius: 8, border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`, backgroundColor: isDark ? '#141414' : '#FFFFFF' }} bodyStyle={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#FFFFFF' : '#000000', margin: 0 }}>快捷入口</h3>
            </div>
            <Row gutter={[16, 16]} style={{ padding: 20 }}>
              {quickEntries.map((entry, index) => (
                <Col xs={8} key={index}>
                  <button
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: 8,
                      padding: '16px 8px',
                      borderRadius: 8,
                      backgroundColor: isDark ? '#1F1F1F' : '#F7F7F7',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      width: '100%',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(255,255,255,0.1)' : '0 4px 12px rgba(0,0,0,0.1)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = 'none'
                    }}
                  >
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 8,
                        backgroundColor: entry.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span style={{ fontSize: 20, color: '#FFFFFF' }}>{entry.icon}</span>
                    </div>
                    <span style={{ fontSize: 13, color: isDark ? '#DCDCDC' : '#262626' }}>{entry.label}</span>
                  </button>
                </Col>
              ))}
            </Row>
          </Card>

          <Card style={{ borderRadius: 8, border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`, backgroundColor: isDark ? '#141414' : '#FFFFFF' }} bodyStyle={{ padding: 0 }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#FFFFFF' : '#000000', margin: 0 }}>系统公告</h3>
              <Button type="text" style={{ color: '#177DDC', fontSize: 12, padding: 0, height: 'auto' }} onClick={() => setShowAllAnnouncements(true)}>查看全部</Button>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 0 }}>
              {announcements.slice(0, 5).map((announcement) => (
                <div
                  key={announcement.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '12px 16px',
                    borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#F0F0F0'}`,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? '#262626' : '#F7F7F7'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => {
                    setSelectedAnnouncement(announcement)
                    setShowAnnouncementModal(true)
                  }}
                >
                  <div>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: announcement.unread ? '#F53F3F' : (isDark ? '#5B5B5B' : '#D9D9D9'),
                      }}
                    />
                  </div>
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: 14, color: announcement.unread ? (isDark ? '#DCDCDC' : '#262626') : (isDark ? '#ADADAD' : '#595959') }}>
                      {announcement.title}
                    </span>
                    <span style={{ fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C' }}>{announcement.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>

        <Col xs={24} lg={8} style={{ height: '100%' }}>
          <Card style={{ borderRadius: 8, border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`, backgroundColor: isDark ? '#141414' : '#FFFFFF', height: '100%', display: 'flex', flexDirection: 'column' }} bodyStyle={{ padding: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
            <div style={{ padding: '16px 20px', borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}` }}>
              <h3 style={{ fontSize: 16, fontWeight: 600, color: isDark ? '#FFFFFF' : '#000000', margin: 0 }}>待办事项</h3>
            </div>
            <div style={{ display: 'flex', borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}` }}>
              <Button
                type="text"
                onClick={() => setActiveTab('pending')}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  fontSize: 13,
                  color: activeTab === 'pending' ? '#177DDC' : (isDark ? '#ADADAD' : '#595959'),
                  position: 'relative',
                  fontWeight: activeTab === 'pending' ? 500 : 400,
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4 }}>
                  待办审批
                  {pendingTasks.filter(t => t.unread).length > 0 && (
                    <span style={{ backgroundColor: '#F53F3F', color: '#FFFFFF', fontSize: 10, padding: '1px 5px', borderRadius: 10, minWidth: 16, textAlign: 'center' }}>
                      {pendingTasks.filter(t => t.unread).length}
                    </span>
                  )}
                </span>
                {activeTab === 'pending' && (
                  <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, backgroundColor: '#177DDC', borderRadius: 1 }} />
                )}
              </Button>
              <Button
                type="text"
                onClick={() => setActiveTab('inProgress')}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  fontSize: 13,
                  color: activeTab === 'inProgress' ? '#177DDC' : (isDark ? '#ADADAD' : '#595959'),
                  position: 'relative',
                  fontWeight: activeTab === 'inProgress' ? 500 : 400,
                }}
              >
                在办流程
                {activeTab === 'inProgress' && (
                  <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, backgroundColor: '#177DDC', borderRadius: 1 }} />
                )}
              </Button>
              <Button
                type="text"
                onClick={() => setActiveTab('completed')}
                style={{
                  flex: 1,
                  padding: '12px 0',
                  fontSize: 13,
                  color: activeTab === 'completed' ? '#177DDC' : (isDark ? '#ADADAD' : '#595959'),
                  position: 'relative',
                  fontWeight: activeTab === 'completed' ? 500 : 400,
                }}
              >
                已办事项
                {activeTab === 'completed' && (
                  <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 20, height: 2, backgroundColor: '#177DDC', borderRadius: 1 }} />
                )}
              </Button>
            </div>
            <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 0, flex: 1, overflowY: 'auto' }}>
              {(activeTab === 'pending' ? pendingTasks : activeTab === 'inProgress' ? inProgressTasks : completedTasks).map((task) => (
                <div
                  key={task.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: 12,
                    padding: '12px 16px',
                    borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#F0F0F0'}`,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = isDark ? '#262626' : '#F7F7F7'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  onClick={() => {
                    setSelectedTask(task)
                    setShowTaskModal(true)
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 6,
                        height: 6,
                        borderRadius: '50%',
                        backgroundColor: task.unread ? '#F53F3F' : (isDark ? '#5B5B5B' : '#D9D9D9'),
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, color: task.unread ? (isDark ? '#DCDCDC' : '#262626') : (isDark ? '#ADADAD' : '#595959'), marginBottom: 2 }}>{task.title}</div>
                      <div style={{ fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C' }}>{task.subtitle}</div>
                    </div>
                  </div>
                  <span style={{ fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C', whiteSpace: 'nowrap' }}>{task.time}</span>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      <Modal
        title={selectedAnnouncement?.title}
        visible={showAnnouncementModal}
        onCancel={() => setShowAnnouncementModal(false)}
        footer={null}
        width={480}
      >
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 14, color: isDark ? '#DCDCDC' : '#262626', lineHeight: 1.8 }}>
            {selectedAnnouncement?.detail}
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C' }}>
            发布时间：{selectedAnnouncement?.time}
          </div>
        </div>
      </Modal>

      <Modal
        title="系统公告"
        visible={showAllAnnouncements}
        onCancel={() => setShowAllAnnouncements(false)}
        footer={null}
        width={600}
      >
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {announcements.map((item) => (
            <div
              key={item.id}
              style={{
                padding: '16px',
                borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#F0F0F0'}`,
                cursor: 'pointer',
                transition: 'background-color 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = isDark ? '#262626' : '#F7F7F7'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              onClick={() => {
                setSelectedAnnouncement(item)
                setShowAnnouncementModal(true)
                setShowAllAnnouncements(false)
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 500, color: isDark ? '#DCDCDC' : '#262626', marginBottom: 8 }}>
                <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: item.unread ? '#F53F3F' : 'transparent', marginRight: 8 }} />
                {item.title}
              </div>
              <div style={{ fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C' }}>{item.time}</div>
            </div>
          ))}
        </div>
      </Modal>

      <Modal
        title={selectedTask?.title}
        visible={showTaskModal}
        onCancel={() => setShowTaskModal(false)}
        footer={null}
        width={480}
      >
        <div style={{ padding: 16 }}>
          <div style={{ fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C', marginBottom: 12 }}>
            分类：{selectedTask?.subtitle}
          </div>
          <div style={{ fontSize: 14, color: isDark ? '#DCDCDC' : '#262626', lineHeight: 1.8 }}>
            {selectedTask?.detail}
          </div>
          <div style={{ marginTop: 16, fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C' }}>
            提交时间：{selectedTask?.time}
          </div>
        </div>
      </Modal>
    </div>
  )
}