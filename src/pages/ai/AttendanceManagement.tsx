import { Card, Form, Input, Button, Select, Table, Modal, Space, message, DatePicker, Tabs, Tag, Row, Col } from 'antd'
import { SearchOutlined, SendOutlined, EyeOutlined, CalendarOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import PageTitle from '../../components/PageTitle/PageTitle'

const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

interface AttendanceRecord {
  key: string
  employeeId: string
  name: string
  department: string
  date: string
  checkInTime: string
  checkOutTime: string
  leaveStartTime: string
  leaveEndTime: string
}

interface MonthlyRecord {
  key: string
  date: string
  weekDay: string
  checkInTime: string
  checkOutTime: string
  leaveDuration: string
  status: '正常' | '迟到' | '早退' | '缺勤' | '请假'
}

export default function AttendanceManagement() {
  const [form] = Form.useForm()
  const [records, setRecords] = useState<AttendanceRecord[]>([])
  const [filteredRecords, setFilteredRecords] = useState<AttendanceRecord[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<AttendanceRecord | null>(null)
  const [selectedRecords, setSelectedRecords] = useState<string[]>([])
  const [selectedMonth, setSelectedMonth] = useState(dayjs())
  const [monthlyRecords, setMonthlyRecords] = useState<MonthlyRecord[]>([])

  const departments = ['科研部', '实验室', '行政部', '财务部', '设备部', '人事部']

  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

  const initialRecords: AttendanceRecord[] = Array.from({ length: 30 }, (_, i) => {
    const hasLeave = Math.random() > 0.3
    return {
      key: String(i + 1),
      employeeId: `EMP${String(2026001 + (i % 20)).padStart(7, '0')}`,
      name: ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生', '周医生', '吴医生'][i % 8],
      department: departments[i % departments.length],
      date: `2026-05-${String(15 + (i % 15)).padStart(2, '0')}`,
      checkInTime: `0${8 + (i % 2)}:${String(10 + (i % 50)).padStart(2, '0')}:00`,
      checkOutTime: `${17 + (i % 2)}:${String(10 + (i % 50)).padStart(2, '0')}:00`,
      leaveStartTime: hasLeave ? `${11 + (i % 2)}:${String(30 + (i % 30)).padStart(2, '0')}:00` : '-',
      leaveEndTime: hasLeave ? `${12 + (i % 2)}:${String((i % 30)).padStart(2, '0')}:00` : '-',
    }
  })

  useEffect(() => {
    setRecords(initialRecords)
    setFilteredRecords(initialRecords)
  }, [])

  const generateMonthlyRecords = (employeeId: string, month: dayjs.Dayjs): MonthlyRecord[] => {
    const daysInMonth = month.daysInMonth()
    const result: MonthlyRecord[] = []
    const today = dayjs().date()

    for (let i = 1; i <= daysInMonth; i++) {
      const date = month.date(i)
      const weekDayIndex = date.day()
      const isWeekend = weekDayIndex === 0 || weekDayIndex === 6
      const isFuture = date.isAfter(dayjs(), 'date')

      let status: '正常' | '迟到' | '早退' | '缺勤' | '请假' = '正常'
      let checkInTime = ''
      let checkOutTime = ''
      let leaveDuration = '-'

      if (isFuture) {
        status = '正常'
      } else if (isWeekend) {
        status = '正常'
        checkInTime = '-'
        checkOutTime = '-'
      } else {
        const random = Math.random()
        if (random < 0.75) {
          status = '正常'
          const hour = 7 + (i % 2)
          const minute = Math.floor(Math.random() * 30)
          checkInTime = `${hour}:${String(minute).padStart(2, '0')}:00`
          
          const outHour = 17 + Math.floor(Math.random() * 2)
          const outMinute = Math.floor(Math.random() * 30)
          checkOutTime = `${outHour}:${String(outMinute).padStart(2, '0')}:00`

          if (Math.random() > 0.3) {
            const leaveStart = 11 + Math.floor(Math.random() * 2)
            const leaveMinute = Math.floor(Math.random() * 30)
            const leaveEnd = 12 + Math.floor(Math.random() * 2)
            const leaveEndMinute = Math.floor(Math.random() * 30)
            const duration = (leaveEnd - leaveStart) * 60 + (leaveEndMinute - leaveMinute)
            leaveDuration = `${duration}分钟`
          }
        } else if (random < 0.85) {
          status = '迟到'
          checkInTime = `${8 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`
          checkOutTime = '18:00:00'
        } else if (random < 0.92) {
          status = '早退'
          checkInTime = '08:00:00'
          checkOutTime = `${15 + Math.floor(Math.random() * 2)}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`
        } else if (random < 0.97) {
          status = '请假'
          checkInTime = '-'
          checkOutTime = '-'
        } else {
          status = '缺勤'
          checkInTime = '-'
          checkOutTime = '-'
        }
      }

      result.push({
        key: String(i),
        date: `${month.month() + 1}月${i}日`,
        weekDay: weekDays[weekDayIndex],
        checkInTime,
        checkOutTime,
        leaveDuration,
        status,
      })
    }

    return result
  }

  const handleSearch = () => {
    const values = form.getFieldsValue()
    let result = [...records]

    if (values.name) {
      result = result.filter(item => item.name.includes(values.name))
    }
    if (values.department && values.department !== 'all') {
      result = result.filter(item => item.department === values.department)
    }
    if (values.status && values.status !== 'all') {
      result = result.filter(item => item.status === values.status)
    }

    setFilteredRecords(result)
    message.info(`搜索完成，共找到 ${result.length} 条记录`)
  }

  const handleViewDetail = (record: AttendanceRecord) => {
    setCurrentRecord(record)
    const monthRecords = generateMonthlyRecords(record.employeeId, selectedMonth)
    setMonthlyRecords(monthRecords)
    setDetailModalVisible(true)
  }

  const handleMonthChange = (date: dayjs.Dayjs | null) => {
    if (date) {
      setSelectedMonth(date)
      if (currentRecord) {
        const monthRecords = generateMonthlyRecords(currentRecord.employeeId, date)
        setMonthlyRecords(monthRecords)
      }
    }
  }

  const handleBatchExport = () => {
    if (selectedRecords.length === 0) {
      message.warning('请先选择要导出的记录')
      return
    }
    message.success(`已导出 ${selectedRecords.length} 条记录`)
    setSelectedRecords([])
  }

  const getStatusTag = (status: string) => {
    const colorMap: Record<string, string> = {
      '正常': 'green',
      '迟到': 'orange',
      '早退': 'gold',
      '缺勤': 'red',
      '请假': 'blue',
    }
    return <Tag color={colorMap[status] || 'default'}>{status}</Tag>
  }

  const monthlyColumns = [
    { 
      title: '日期', 
      dataIndex: 'date', 
      key: 'date', 
      width: 100,
      render: (text: string, record: MonthlyRecord) => (
        <span>
          {text} <span style={{ color: '#8C8C8C', fontSize: 12 }}>{record.weekDay}</span>
        </span>
      )
    },
    { title: '签到时间', dataIndex: 'checkInTime', key: 'checkInTime', width: 120 },
    { title: '签退时间', dataIndex: 'checkOutTime', key: 'checkOutTime', width: 120 },
    { title: '中途离开', dataIndex: 'leaveDuration', key: 'leaveDuration', width: 100 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status: string) => getStatusTag(status)
    },
  ]

  const columns = [
    { title: '工号', dataIndex: 'employeeId', key: 'employeeId', width: 120 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 80 },
    { title: '部门', dataIndex: 'department', key: 'department', width: 100 },
    { title: '日期', dataIndex: 'date', key: 'date', width: 100 },
    { title: '签到时间', dataIndex: 'checkInTime', key: 'checkInTime', width: 120 },
    { title: '签退时间', dataIndex: 'checkOutTime', key: 'checkOutTime', width: 120 },
    { 
      title: '中途离开', 
      key: 'leaveDuration', 
      width: 100,
      render: (_: any, record: AttendanceRecord) => {
        if (record.leaveStartTime === '-' || record.leaveEndTime === '-') {
          return '-'
        }
        const start = record.leaveStartTime.split(':').map(Number)
        const end = record.leaveEndTime.split(':').map(Number)
        const startMinutes = start[0] * 60 + start[1]
        const endMinutes = end[0] * 60 + end[1]
        const duration = endMinutes - startMinutes
        if (duration <= 0) {
          return '-'
        }
        return `${duration}分钟`
      }
    },
    { 
      title: '操作', 
      key: 'action', 
      width: 120,
      render: (_: any, record: AttendanceRecord) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
        </Space>
      )
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <PageTitle>考勤管理</PageTitle>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={form} layout="horizontal">
          <Row gutter={20} style={{ height: 32 }}>
            <Col span={6}>
              <Form.Item label="日期范围" name="dateRange">
                <Input placeholder="请输入日期范围" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="所属部门" name="department">
                <Select placeholder="请选择">
                  <Option value="all">全部</Option>
                  {departments.map(dept => <Option key={dept} value={dept}>{dept}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="姓名/工号" name="name">
                <Input placeholder="请输入姓名或工号" />
              </Form.Item>
            </Col>
            <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button type="primary" onClick={handleSearch}>搜索</Button>
              <Button onClick={() => { form.resetFields(); setFilteredRecords(records) }}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, marginBottom: 16 }}>
          <Button icon={<SendOutlined />} onClick={handleBatchExport} disabled={selectedRecords.length === 0}>批量导出</Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredRecords}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条记录` }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys: selectedRecords,
            onChange: (selectedRowKeys) => setSelectedRecords(selectedRowKeys as string[])
          }}
        />
      </Card>

      <Modal
        title="考勤详情"
        open={detailModalVisible}
        onCancel={() => { setDetailModalVisible(false); setCurrentRecord(null) }}
        footer={null}
        width={900}
      >
        {currentRecord && (
          <div>
            <div style={{ marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #E5E5E5' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <h3 style={{ margin: '0 0 8px 0' }}>{currentRecord.name}</h3>
                  <div style={{ fontSize: 12, color: '#8C8C8C' }}>
                    <span>工号：{currentRecord.employeeId}</span>
                    <span style={{ margin: '0 12px' }}>·</span>
                    <span>部门：{currentRecord.department}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
                  <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, textAlign: 'center' }}>
                    <div style={{ fontSize: 12, color: '#8C8C8C', marginBottom: 4 }}>选择月份</div>
                    <DatePicker
                      picker="month"
                      value={selectedMonth}
                      onChange={handleMonthChange}
                      format="YYYY年MM月"
                      allowClear={false}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 16 }}>
              <div style={{ padding: 12, backgroundColor: '#F6FFED', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#52C41A' }}>
                  {monthlyRecords.filter(r => r.status === '正常').length}
                </div>
                <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>正常出勤</div>
              </div>
              <div style={{ padding: 12, backgroundColor: '#FFF7E6', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#FA8C16' }}>
                  {monthlyRecords.filter(r => r.status === '迟到').length}
                </div>
                <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>迟到</div>
              </div>
              <div style={{ padding: 12, backgroundColor: '#FFFBE6', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#D89614' }}>
                  {monthlyRecords.filter(r => r.status === '早退').length}
                </div>
                <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>早退</div>
              </div>
              <div style={{ padding: 12, backgroundColor: '#FFF1F0', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#F53F3F' }}>
                  {monthlyRecords.filter(r => r.status === '缺勤' || r.status === '请假').length}
                </div>
                <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>缺勤/请假</div>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
                <CalendarOutlined style={{ marginRight: 8 }} />
                <span style={{ fontWeight: 500 }}>{selectedMonth.format('YYYY年MM月')} 考勤记录</span>
                <span style={{ marginLeft: 8, color: '#8C8C8C', fontSize: 12 }}>
                  共 {monthlyRecords.length} 天
                </span>
              </div>
            </div>

            <Table
              columns={monthlyColumns}
              dataSource={monthlyRecords}
              pagination={false}
              scroll={{ y: 400 }}
              size="small"
            />

            <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}