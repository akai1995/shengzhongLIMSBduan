import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space, Tag, message, Tabs, Radio, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, CloseOutlined, CalendarOutlined, UnorderedListOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

export default function EquipmentReservation() {
  const { isDark } = useThemeStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增预约')
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list')
  const [calendarView, setCalendarView] = useState<'month' | 'week'>('month')
  const [conflictMessage, setConflictMessage] = useState<string | null>(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [editRecord, setEditRecord] = useState<any>(null)

  const statusColors: Record<string, string> = {
    '待使用': 'blue',
    '使用中': 'green',
    '已完成': 'default',
    '已取消': 'red'
  }

  const columns = [
    { title: '预约ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'equipmentName', key: 'equipmentName' },
    { title: '预约人', dataIndex: 'reserver', key: 'reserver' },
    { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: (s: string) => <Tag color={statusColors[s] || 'default'}>{s}</Tag> 
    },
    {
      title: '操作', 
      key: 'action', 
      fixed: 'right' as const,
      width: 160,
      render: (_, record: any) => (
        <div style={{ display: 'flex', gap: 8 }}>
          {record.status === '待使用' && <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>}
          {record.status === '待使用' && <Button type="text" icon={<CloseOutlined />} style={{ color: '#FF4D4F' }} onClick={() => handleCancel(record)}>取消</Button>}
        </div>
      ) 
    },
  ]

  const equipmentList = Array.from({ length: 8 }, (_, i) => {
    const names = ['离心机', 'PCR仪', '流式细胞仪', '显微镜', '分光光度计', '高压灭菌锅', 'CO2培养箱', '超低温冰箱']
    const codes = ['EQ-0001', 'EQ-0002', 'EQ-0003', 'EQ-0004', 'EQ-0005', 'EQ-0006', 'EQ-0007', 'EQ-0008']
    return {
      key: String(i + 1),
      id: codes[i],
      name: names[i],
      code: codes[i]
    }
  })

  const data = Array.from({ length: 30 }, (_, i) => {
    const statuses = ['待使用', '使用中', '已完成', '已取消']
    const reservers = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
    const projects = ['肿瘤标志物研究', '基因测序', '细胞培养实验', '药物筛选', 'PCR扩增']
    const hour = 8 + (i % 10)
    return {
      key: String(i + 1),
      id: `RES-${String(i + 1).padStart(4, '0')}`,
      equipmentId: `EQ-${String((i % 8) + 1).padStart(4, '0')}`,
      equipmentName: equipmentList[i % 8].name,
      reserver: reservers[i % reservers.length],
      projectName: projects[i % projects.length],
      startTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00`,
      endTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(hour + 2).padStart(2, '0')}:00`,
      status: statuses[i % statuses.length],
    }
  })

  const handleCreate = () => {
    setModalTitle('新增预约')
    setConflictMessage(null)
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setModalTitle('编辑预约')
    setEditRecord(record)
    form.resetFields()
    form.setFieldsValue({
      equipment: record.equipmentId,
      reserver: record.reserver,
      projectName: record.projectName,
      startTime: record.startTime ? new Date(record.startTime) : null,
      endTime: record.endTime ? new Date(record.endTime) : null,
    })
    setIsModalVisible(true)
  }

  const handleCancel = (record: any) => {
    Modal.confirm({
      title: '确认取消',
      content: `确定取消预约【${record.id}】吗？`,
      onOk: () => message.success('取消成功'),
    })
  }

  const handleCheckConflict = () => {
    form.validateFields().then(values => {
      const randomConflict = Math.random() > 0.7
      if (randomConflict) {
        setConflictMessage(`与预约ID RES-${String(Math.floor(Math.random() * 100)).padStart(4, '0')} 冲突`)
      } else {
        setConflictMessage(null)
        message.success('当前时段可用')
      }
    })
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const randomConflict = Math.random() > 0.7
      if (randomConflict) {
        setConflictMessage(`与预约ID RES-${String(Math.floor(Math.random() * 100)).padStart(4, '0')} 冲突`)
        message.error('预约时段冲突，请重新选择')
      } else {
        setConflictMessage(null)
        message.success('保存成功')
        setIsModalVisible(false)
      }
    })
  }

  const handleExport = () => {
    message.success('导出预约记录')
  }

  const handleCalendarSlotClick = () => {
    handleCreate()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>预约登记</h1>
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="设备名称" name="equipment">
                    <Select placeholder="请选择设备" style={{ width: '100%' }} allowClear>
                      {equipmentList.map(eq => (
                        <Option key={eq.id} value={eq.id}>{eq.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="预约人" name="reserver">
                    <Input placeholder="请输入预约人" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="预约日期" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="状态" name="status">
                    <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
                      <Option value="待使用">待使用</Option>
                      <Option value="使用中">使用中</Option>
                      <Option value="已完成">已完成</Option>
                      <Option value="已取消">已取消</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
                <Col span={24} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary">查询</Button>
                  <Button onClick={() => searchForm.resetFields()} className="reset-btn">重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={16} style={{ height: 32 }}>
              <Col span={6}>
                <Form.Item label="设备名称" name="equipment">
                  <Select placeholder="请选择设备" style={{ width: '100%' }} allowClear>
                    {equipmentList.map(eq => (
                      <Option key={eq.id} value={eq.id}>{eq.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="预约人" name="reserver">
                  <Input placeholder="请输入预约人" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="预约日期" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button type="primary">查询</Button>
                <Button onClick={() => searchForm.resetFields()} className="reset-btn">重置</Button>
                <Button type="link" onClick={() => setExpanded(true)} style={{ padding: 0 }}>展开<DownOutlined /></Button>
              </Col>
            </Row>
          )}
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space wrap>
            <Radio.Group value={viewMode} onChange={(e) => setViewMode(e.target.value)}>
              <Radio.Button value="list" icon={<UnorderedListOutlined />}>列表视图</Radio.Button>
              <Radio.Button value="calendar" icon={<CalendarOutlined />}>日历视图</Radio.Button>
            </Radio.Group>
            {viewMode === 'calendar' && (
              <Radio.Group value={calendarView} onChange={(e) => setCalendarView(e.target.value)}>
                <Radio.Button value="month">月</Radio.Button>
                <Radio.Button value="week">周</Radio.Button>
              </Radio.Group>
            )}
          </Space>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增预约</Button>
            <Button onClick={handleExport}>导出</Button>
          </Space>
        </div>

        {viewMode === 'list' ? (
          <Table 
            columns={columns} 
            dataSource={data}
            scroll={{ x: 'max-content' }}
            rowSelection={{
              type: 'checkbox',
              onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
            }}
          />
        ) : (
          <div style={{ minHeight: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d9d9d9', borderRadius: 8 }}>
            <div style={{ textAlign: 'center', color: '#999' }}>
              <CalendarOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <p>日历视图占位（点击任意时段可新增预约）</p>
              <Button type="primary" style={{ marginTop: 16 }} onClick={handleCalendarSlotClick}>新增预约</Button>
            </div>
          </div>
        )}
      </Card>

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false)
          setEditRecord(null)
        }}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => {
            setIsModalVisible(false)
            setEditRecord(null)
          }}>取消</Button>,
          <Button key="check" onClick={handleCheckConflict}>检测冲突</Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>保存</Button>,
        ]}
      >
        {conflictMessage && (
          <div style={{ color: '#ff4d4f', marginBottom: 16, padding: '8px 12px', backgroundColor: '#fff2f0', border: '1px solid #ffccc7', borderRadius: 4 }}>
            {conflictMessage}
          </div>
        )}
        <Form 
          form={form} 
          layout="vertical"
        >
          <Form.Item label="设备" name="equipment" rules={[{ required: true, message: '请选择设备' }]}>
            <Select placeholder="请选择设备">
              {equipmentList.map(eq => (
                <Option key={eq.id} value={eq.id}>{eq.name} ({eq.code})</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="预约人" name="reserver" rules={[{ required: true, message: '请输入预约人' }]}>
            <Input placeholder="请输入预约人" />
          </Form.Item>
          <Form.Item label="项目名称" name="projectName" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item label="开始时间" name="startTime" rules={[{ required: true, message: '请选择开始时间' }]}>
            <DatePicker showTime={{ minuteStep: 30 }} style={{ width: '100%' }} placeholder="请选择开始时间" />
          </Form.Item>
          <Form.Item label="结束时间" name="endTime" rules={[{ required: true, message: '请选择结束时间' }]}>
            <DatePicker showTime={{ minuteStep: 30 }} style={{ width: '100%' }} placeholder="请选择结束时间" />
          </Form.Item>
          <Form.Item label="陪同人/协助人" name="assistant">
            <Input placeholder="请输入陪同人/协助人" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入备注" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
