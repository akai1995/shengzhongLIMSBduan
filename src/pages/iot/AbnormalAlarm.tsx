import { useState, useMemo } from 'react'
import { Card, Row, Col, Table, Form, Button, Input, Select, DatePicker, Space, Modal, Tag, message, Checkbox } from 'antd'
import { SearchOutlined, EyeOutlined, CheckCircleOutlined, AlertOutlined, CloseCircleOutlined, EditOutlined, DownloadOutlined, PlayCircleOutlined, PauseCircleOutlined, BellOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import PageTitle from '../../components/PageTitle/PageTitle'
import { useThemeStore } from '../../store/themeStore'

const { RangePicker } = DatePicker

const generateAlarmData = () => {
  const locations = ['实验室A101', '实验室A102', '冰箱B01', '冰箱B02', '冷库C01', '液氮罐D01', '洁净室E01', '培养室F01']
  const alarmTypes = ['温度过高', '温度过低', '湿度过高', '湿度过低', '设备离线', '设备故障', '压力异常', '气体泄漏', '门禁异常']
  const levels = ['紧急', '重要', '一般']
  const statuses = ['未处理', '已确认', '处理中', '已恢复', '已忽略']
  
  const data = []
  for (let i = 1; i <= 50; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)]
    const alarmType = alarmTypes[Math.floor(Math.random() * alarmTypes.length)]
    const level = levels[Math.floor(Math.random() * levels.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    
    const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0')
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    
    const alarmTime = `2024-01-15 ${hours}:${minutes}:${seconds}`
    const confirmTime = (status === '已确认' || status === '处理中' || status === '已恢复') ? alarmTime : null
    const handleStartTime = (status === '处理中' || status === '已恢复') ? `2024-01-15 ${String((parseInt(hours) + 1) % 24).padStart(2, '0')}:${minutes}:${seconds}` : null
    const handleEndTime = status === '已恢复' ? `2024-01-15 ${String((parseInt(hours) + 2) % 24).padStart(2, '0')}:${minutes}:${seconds}` : null
    
    data.push({
      id: `ALM-${String(i).padStart(6, '0')}`,
      alarmTime,
      location,
      device: `设备-${String(i).padStart(4, '0')}`,
      sensorId: `SN-${String(i).padStart(6, '0')}`,
      alarmType,
      alarmContent: `${alarmType}报警：监测值超出设定阈值范围`,
      threshold: alarmType.includes('温度') ? '温度: 20-30°C' : alarmType.includes('湿度') ? '湿度: 40%-60%' : alarmType.includes('压力') ? '压力: 0.1-0.5MPa' : '正常范围',
      currentValue: alarmType.includes('温度') ? `${(25 + (Math.random() - 0.5) * 20).toFixed(1)}°C` : alarmType.includes('湿度') ? `${(60 + (Math.random() - 0.5) * 40).toFixed(0)}%` : alarmType.includes('压力') ? `${(0.3 + (Math.random() - 0.5) * 0.4).toFixed(2)}MPa` : '异常',
      level,
      status,
      confirmer: status !== '未处理' && status !== '已忽略' ? ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)] : null,
      confirmTime,
      handler: status === '处理中' || status === '已恢复' ? ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)] : null,
      handleStartTime,
      handleEndTime,
      handleResult: status === '已恢复' ? ['已解决', '已修复', '已调整'][Math.floor(Math.random() * 3)] : null,
      handleNote: status === '已恢复' ? '已完成设备检查和参数调整，设备运行正常' : null,
      ignoreReason: status === '已忽略' ? ['误报', '已手动处理', '计划内维护'][Math.floor(Math.random() * 3)] : null,
      flowHistory: [
        { type: 'alarm', time: alarmTime, operator: '系统', description: `${alarmType}报警触发`, status: '触发' }
      ].concat(confirmTime ? [{ type: 'confirm', time: confirmTime, operator: status !== '未处理' && status !== '已忽略' ? ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)] : null, description: '确认报警', status: '已确认' }] : []).concat(handleStartTime ? [{ type: 'handle_start', time: handleStartTime, operator: status === '处理中' || status === '已恢复' ? ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)] : null, description: '开始处理', status: '处理中' }] : []).concat(handleEndTime ? [{ type: 'handle_end', time: handleEndTime, operator: status === '已恢复' ? ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)] : null, description: `处理完成: ${['已解决', '已修复', '已调整'][Math.floor(Math.random() * 3)]}`, status: '已恢复' }] : []),
    })
  }
  return data
}

export default function AbnormalAlarm() {
  const { isDark } = useThemeStore()
  const [alarmData, setAlarmData] = useState(generateAlarmData())
  const [searchForm] = Form.useForm()
  const [expanded, setExpanded] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [startHandleModalVisible, setStartHandleModalVisible] = useState(false)
  const [finishHandleModalVisible, setFinishHandleModalVisible] = useState(false)
  const [ignoreModalVisible, setIgnoreModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [ignoreReason, setIgnoreReason] = useState('')
  const [handleNote, setHandleNote] = useState('')
  const [handleResult, setHandleResult] = useState('')

  const stats = useMemo(() => {
    const unhandled = alarmData.filter(d => d.status === '未处理').length
    const confirmed = alarmData.filter(d => d.status === '已确认').length
    const handling = alarmData.filter(d => d.status === '处理中').length
    const recovered = alarmData.filter(d => d.status === '已恢复').length
    const ignored = alarmData.filter(d => d.status === '已忽略').length
    
    const todayAlarms = alarmData.filter(d => d.alarmTime.startsWith('2024-01-15')).length
    
    const levelStats = {
      urgent: alarmData.filter(d => d.level === '紧急' && d.status !== '已恢复' && d.status !== '已忽略').length,
      important: alarmData.filter(d => d.level === '重要' && d.status !== '已恢复' && d.status !== '已忽略').length,
      normal: alarmData.filter(d => d.level === '一般' && d.status !== '已恢复' && d.status !== '已忽略').length,
    }
    
    return { unhandled, confirmed, handling, recovered, ignored, todayAlarms, levelStats }
  }, [alarmData])

  const handleViewDetail = (record) => {
    setSelectedRecord(record)
    setDetailModalVisible(true)
  }

  const handleConfirm = (record) => {
    setSelectedRecord(record)
    setConfirmModalVisible(true)
  }

  const handleStartHandle = (record) => {
    setSelectedRecord(record)
    setHandleNote('')
    setStartHandleModalVisible(true)
  }

  const handleFinishHandle = (record) => {
    setSelectedRecord(record)
    setHandleNote('')
    setHandleResult('')
    setFinishHandleModalVisible(true)
  }

  const handleIgnore = (record) => {
    setSelectedRecord(record)
    setIgnoreReason('')
    setIgnoreModalVisible(true)
  }

  const handleConfirmSubmit = () => {
    const now = new Date().toLocaleString('zh-CN')
    setAlarmData(prev => prev.map(d => 
      d.id === selectedRecord.id ? { 
        ...d, 
        status: '已确认', 
        confirmer: '当前用户', 
        confirmTime: now,
        flowHistory: [...d.flowHistory, { type: 'confirm', time: now, operator: '当前用户', description: '确认报警', status: '已确认' }]
      } : d
    ))
    setConfirmModalVisible(false)
    message.success('确认成功')
  }

  const handleStartHandleSubmit = () => {
    const now = new Date().toLocaleString('zh-CN')
    setAlarmData(prev => prev.map(d => 
      d.id === selectedRecord.id ? { 
        ...d, 
        status: '处理中', 
        handler: '当前用户', 
        handleStartTime: now,
        handleNote: handleNote,
        flowHistory: [...d.flowHistory, { type: 'handle_start', time: now, operator: '当前用户', description: `开始处理: ${handleNote || '开始处理报警'}`, status: '处理中' }]
      } : d
    ))
    setStartHandleModalVisible(false)
    message.success('已开始处理')
  }

  const handleFinishHandleSubmit = () => {
    if (!handleResult) {
      message.error('请选择处理结果')
      return
    }
    const now = new Date().toLocaleString('zh-CN')
    setAlarmData(prev => prev.map(d => 
      d.id === selectedRecord.id ? { 
        ...d, 
        status: '已恢复', 
        handleEndTime: now,
        handleResult,
        handleNote: handleNote,
        flowHistory: [...d.flowHistory, { type: 'handle_end', time: now, operator: '当前用户', description: `处理完成: ${handleResult}`, status: '已恢复' }]
      } : d
    ))
    setFinishHandleModalVisible(false)
    message.success('处理完成')
  }

  const handleIgnoreSubmit = () => {
    if (!ignoreReason.trim()) {
      message.error('请输入忽略原因')
      return
    }
    const now = new Date().toLocaleString('zh-CN')
    setAlarmData(prev => prev.map(d => 
      d.id === selectedRecord.id ? { 
        ...d, 
        status: '已忽略', 
        ignoreReason,
        flowHistory: [...d.flowHistory, { type: 'ignore', time: now, operator: '当前用户', description: `忽略报警: ${ignoreReason}`, status: '已忽略' }]
      } : d
    ))
    setIgnoreModalVisible(false)
    message.success('已忽略')
  }

  const handleBatchConfirm = () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要确认的报警')
      return
    }
    const now = new Date().toLocaleString('zh-CN')
    setAlarmData(prev => prev.map(d => 
      selectedRows.includes(d.id) && d.status === '未处理' ? { 
        ...d, 
        status: '已确认', 
        confirmer: '当前用户', 
        confirmTime: now,
        flowHistory: [...d.flowHistory, { type: 'confirm', time: now, operator: '当前用户', description: '批量确认报警', status: '已确认' }]
      } : d
    ))
    setSelectedRows([])
    message.success(`已批量确认 ${selectedRows.length} 条报警`)
  }

  const handleBatchIgnore = () => {
    if (selectedRows.length === 0) {
      message.warning('请选择要忽略的报警')
      return
    }
    Modal.confirm({
      title: '批量忽略报警',
      content: `确定要忽略选中的 ${selectedRows.length} 条报警吗？`,
      okText: '确认忽略',
      cancelText: '取消',
      onOk: () => {
        const now = new Date().toLocaleString('zh-CN')
        setAlarmData(prev => prev.map(d => 
          selectedRows.includes(d.id) ? { 
            ...d, 
            status: '已忽略', 
            ignoreReason: '批量忽略',
            flowHistory: [...d.flowHistory, { type: 'ignore', time: now, operator: '当前用户', description: '批量忽略报警', status: '已忽略' }]
          } : d
        ))
        setSelectedRows([])
        message.success(`已批量忽略 ${selectedRows.length} 条报警`)
      }
    })
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  const getStatusColor = (status) => {
    const colorMap = {
      '未处理': 'red',
      '已确认': 'blue',
      '处理中': 'orange',
      '已恢复': 'green',
      '已忽略': 'default'
    }
    return colorMap[status] || 'gray'
  }

  const getLevelColor = (level) => {
    const colorMap = {
      '紧急': 'red',
      '重要': 'orange',
      '一般': 'blue'
    }
    return colorMap[level] || 'gray'
  }

  const getAlarmTypeColor = (type) => {
    if (type.includes('温度')) return 'red'
    if (type.includes('湿度')) return 'orange'
    if (type.includes('压力')) return 'purple'
    if (type.includes('气体')) return 'magenta'
    if (type.includes('离线')) return 'gray'
    if (type.includes('故障')) return 'red'
    return 'blue'
  }

  const columns = [
    { 
      title: (
        <Checkbox 
          checked={selectedRows.length > 0 && selectedRows.length === alarmData.length}
          indeterminate={selectedRows.length > 0 && selectedRows.length < alarmData.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(alarmData.map(d => d.id))
            } else {
              setSelectedRows([])
            }
          }}
        />
      ), 
      key: 'selection',
      width: 60,
      render: (_, record) => (
        <Checkbox 
          checked={selectedRows.includes(record.id)} 
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows([...selectedRows, record.id])
            } else {
              setSelectedRows(selectedRows.filter(id => id !== record.id))
            }
          }}
        />
      )
    },
    { title: '报警ID', dataIndex: 'id', key: 'id', width: 120 },
    { title: '报警时间', dataIndex: 'alarmTime', key: 'alarmTime', width: 180 },
    { title: '位置', dataIndex: 'location', key: 'location', width: 150 },
    { title: '设备/监测点', dataIndex: 'device', key: 'device', width: 150 },
    { title: '传感器编号', dataIndex: 'sensorId', key: 'sensorId', width: 130 },
    { 
      title: '报警类型', 
      dataIndex: 'alarmType', 
      key: 'alarmType', 
      width: 130,
      render: (type) => <Tag color={getAlarmTypeColor(type)}>{type}</Tag>
    },
    { title: '报警内容', dataIndex: 'alarmContent', key: 'alarmContent', width: 200, ellipsis: true },
    { title: '阈值配置', dataIndex: 'threshold', key: 'threshold', width: 150 },
    { title: '当前值', dataIndex: 'currentValue', key: 'currentValue', width: 100 },
    { 
      title: '报警级别', 
      dataIndex: 'level', 
      key: 'level', 
      width: 100,
      render: (level) => <Tag color={getLevelColor(level)}>{level}</Tag>
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status) => <Tag color={getStatusColor(status)}>{status}</Tag>
    },
    { title: '确认人', dataIndex: 'confirmer', key: 'confirmer', width: 100 },
    { title: '确认时间', dataIndex: 'confirmTime', key: 'confirmTime', width: 180 },
    { title: '处理人', dataIndex: 'handler', key: 'handler', width: 100 },
    { title: '处理结果', dataIndex: 'handleResult', key: 'handleResult', width: 120 },
    { 
      title: '操作', 
      key: 'action', 
      width: 320,
      fixed: 'right' as const,
      render: (_, record) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
          {record.status === '未处理' && (
            <>
              <Button type="text" icon={<CheckCircleOutlined />} onClick={() => handleConfirm(record)}>确认</Button>
              <Button type="text" icon={<PlayCircleOutlined />} onClick={() => handleStartHandle(record)}>开始处理</Button>
            </>
          )}
          {record.status === '已确认' && (
            <Button type="text" icon={<PlayCircleOutlined />} onClick={() => handleStartHandle(record)}>开始处理</Button>
          )}
          {record.status === '处理中' && (
            <Button type="text" icon={<PauseCircleOutlined />} onClick={() => handleFinishHandle(record)}>完成处理</Button>
          )}
          {record.status !== '已恢复' && (
            <Button type="text" danger icon={<CloseCircleOutlined />} onClick={() => handleIgnore(record)}>忽略</Button>
          )}
        </Space>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>异常报警</h1>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card hoverable style={{ cursor: 'pointer', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, backgroundColor: '#FFF1F0', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BellOutlined style={{ fontSize: 24, color: '#F53F3F' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#8C8C8C' }}>未处理报警</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#F53F3F' }}>{stats.unhandled}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable style={{ cursor: 'pointer', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, backgroundColor: '#E6F7FF', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircleOutlined style={{ fontSize: 24, color: '#1890FF' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#8C8C8C' }}>已确认报警</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#1890FF' }}>{stats.confirmed}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable style={{ cursor: 'pointer', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, backgroundColor: '#FFFBE6', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AlertOutlined style={{ fontSize: 24, color: '#FAAD14' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#8C8C8C' }}>处理中</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#FAAD14' }}>{stats.handling}</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card hoverable style={{ cursor: 'pointer', borderRadius: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 48, height: 48, backgroundColor: '#F6FFED', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <BellOutlined style={{ fontSize: 24, color: '#52C41A' }} />
              </div>
              <div>
                <div style={{ fontSize: 12, color: '#8C8C8C' }}>今日新增</div>
                <div style={{ fontSize: 28, fontWeight: 600, color: '#52C41A' }}>{stats.todayAlarms}</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>



      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16}>
            <Col span={6} style={{ height: '32px' }}>
              <Form.Item label="位置" name="location">
                <Select placeholder="请选择位置">
                  <Select.Option value="全部">全部</Select.Option>
                  <Select.Option value="实验室A101">实验室A101</Select.Option>
                  <Select.Option value="实验室A102">实验室A102</Select.Option>
                  <Select.Option value="冰箱B01">冰箱B01</Select.Option>
                  <Select.Option value="冰箱B02">冰箱B02</Select.Option>
                  <Select.Option value="冷库C01">冷库C01</Select.Option>
                  <Select.Option value="液氮罐D01">液氮罐D01</Select.Option>
                  <Select.Option value="洁净室E01">洁净室E01</Select.Option>
                  <Select.Option value="培养室F01">培养室F01</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} style={{ height: '32px' }}>
              <Form.Item label="报警类型" name="alarmType">
                <Select placeholder="请选择报警类型">
                  <Select.Option value="全部">全部</Select.Option>
                  <Select.Option value="温度过高">温度过高</Select.Option>
                  <Select.Option value="温度过低">温度过低</Select.Option>
                  <Select.Option value="湿度过高">湿度过高</Select.Option>
                  <Select.Option value="湿度过低">湿度过低</Select.Option>
                  <Select.Option value="设备离线">设备离线</Select.Option>
                  <Select.Option value="设备故障">设备故障</Select.Option>
                  <Select.Option value="压力异常">压力异常</Select.Option>
                  <Select.Option value="气体泄漏">气体泄漏</Select.Option>
                  <Select.Option value="门禁异常">门禁异常</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} style={{ height: '32px' }}>
              <Form.Item label="报警级别" name="level">
                <Select placeholder="请选择报警级别">
                  <Select.Option value="全部">全部</Select.Option>
                  <Select.Option value="紧急">紧急</Select.Option>
                  <Select.Option value="重要">重要</Select.Option>
                  <Select.Option value="一般">一般</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {expanded ? (
              <Col span={6} style={{ height: '32px' }}>
                <Form.Item label="状态" name="status">
                  <Select placeholder="请选择状态">
                    <Select.Option value="全部">全部</Select.Option>
                    <Select.Option value="未处理">未处理</Select.Option>
                    <Select.Option value="已确认">已确认</Select.Option>
                    <Select.Option value="处理中">处理中</Select.Option>
                    <Select.Option value="已恢复">已恢复</Select.Option>
                    <Select.Option value="已忽略">已忽略</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            ) : (
              <Col span={6} style={{ height: '32px' }}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', height: '32px' }}>
                    <Button type="primary">查询</Button>
                    <Button onClick={() => searchForm.resetFields()} className="reset-btn">重置</Button>
                    <Button type="link" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
                      {expanded ? '收起' : '展开'}
                      {expanded ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            )}
          </Row>
          
          {expanded && (
            <Row gutter={16} style={{ height: '32px', marginTop: '20px' }}>
              <Col span={6} style={{ height: '32px' }}>
                <Form.Item label="时间范围" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={18} style={{ height: '32px' }}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', height: '32px' }}>
                    <Button type="primary">查询</Button>
                    <Button onClick={() => searchForm.resetFields()} className="reset-btn">重置</Button>
                    <Button type="link" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
                      {expanded ? '收起' : '展开'}
                      {expanded ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          )}
          
        </Form>
      </Card>

      <Card style={{ borderRadius: '10px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, marginBottom: 16 }}>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport}>导出</Button>
          <Button type="primary" icon={<CheckCircleOutlined />} onClick={handleBatchConfirm} disabled={selectedRows.length === 0}>批量确认</Button>
          <Button danger icon={<CloseCircleOutlined />} onClick={handleBatchIgnore} disabled={selectedRows.length === 0}>批量忽略</Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={alarmData} 
          rowKey="id" 
          pagination={{ showSizeChanger: true, showQuickJumper: true, showTotal: (t) => `共 ${t} 条`, pageSize: 15 }} 
          scroll={{ x: 2200 }} 
        />
      </Card>

      <Modal 
        title="报警详情" 
        open={detailModalVisible} 
        onCancel={() => setDetailModalVisible(false)} 
        footer={[<Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>]} 
        width={850}
      >
        {selectedRecord && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #E5E5E5' }}>
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 600 }}>{selectedRecord.alarmType}</h3>
                <p style={{ color: '#8C8C8C', marginTop: 4 }}>报警ID: {selectedRecord.id}</p>
              </div>
              <Tag color={getStatusColor(selectedRecord.status)} style={{ fontSize: 14, padding: '4px 16px' }}>{selectedRecord.status}</Tag>
            </div>

            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <div style={{ padding: 16, backgroundColor: '#F7F7F7', borderRadius: 8 }}>
                  <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 500 }}>基本信息</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, fontSize: 13 }}>
                    <div><span style={{ color: '#8C8C8C' }}>报警时间：</span>{selectedRecord.alarmTime}</div>
                    <div><span style={{ color: '#8C8C8C' }}>位置：</span>{selectedRecord.location}</div>
                    <div><span style={{ color: '#8C8C8C' }}>设备：</span>{selectedRecord.device}</div>
                    <div><span style={{ color: '#8C8C8C' }}>传感器：</span>{selectedRecord.sensorId}</div>
                    <div><span style={{ color: '#8C8C8C' }}>报警级别：</span><Tag color={getLevelColor(selectedRecord.level)}>{selectedRecord.level}</Tag></div>
                    <div><span style={{ color: '#8C8C8C' }}>当前值：</span><span style={{ color: selectedRecord.level === '紧急' ? '#F53F3F' : '#333' }}>{selectedRecord.currentValue}</span></div>
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ padding: 16, backgroundColor: '#FFFBE6', borderRadius: 8 }}>
                  <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 500 }}>阈值信息</h4>
                  <div style={{ fontSize: 13 }}>
                    <div style={{ marginBottom: 8 }}><span style={{ color: '#8C8C8C' }}>阈值配置：</span>{selectedRecord.threshold}</div>
                    <div style={{ marginBottom: 8 }}><span style={{ color: '#8C8C8C' }}>报警内容：</span>{selectedRecord.alarmContent}</div>
                    {selectedRecord.ignoreReason && (
                      <div><span style={{ color: '#8C8C8C' }}>忽略原因：</span>{selectedRecord.ignoreReason}</div>
                    )}
                  </div>
                </div>
              </Col>
            </Row>

            <div style={{ paddingBottom: 16, borderBottom: '1px solid #E5E5E5' }}>
              <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>处理进度</h4>
              <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
                {['未处理', '已确认', '处理中', '已恢复'].map((step, index) => {
                  const isCompleted = ['未处理', '已确认', '处理中', '已恢复'].indexOf(selectedRecord.status) >= index
                  const isCurrent = selectedRecord.status === step
                  return (
                    <div key={step} style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
                        <div style={{ 
                          width: 32, 
                          height: 32, 
                          borderRadius: '50%', 
                          backgroundColor: isCompleted ? '#52C41A' : '#E5E5E5',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginBottom: 8
                        }}>
                          {isCurrent ? (
                            <EditOutlined style={{ color: '#fff', fontSize: 14 }} />
                          ) : isCompleted ? (
                            <CheckCircleOutlined style={{ color: '#fff', fontSize: 14 }} />
                          ) : (
                            <span style={{ color: '#8C8C8C', fontSize: 14 }}>{index + 1}</span>
                          )}
                        </div>
                        <span style={{ fontSize: 12, color: isCompleted ? '#333' : '#8C8C8C' }}>{step}</span>
                      </div>
                      {index < 3 && (
                        <div style={{ 
                          width: '100%', 
                          height: 2, 
                          backgroundColor: isCompleted ? '#52C41A' : '#E5E5E5'
                        }} />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <h4 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>处置流程记录</h4>
              <div style={{ paddingLeft: 20, borderLeft: '2px solid #E5E5E5' }}>
                {selectedRecord.flowHistory.map((item, index) => (
                  <div key={index} style={{ marginBottom: 20, position: 'relative' }}>
                    <div style={{ 
                      position: 'absolute', 
                      left: -24, 
                      top: 4, 
                      width: 10, 
                      height: 10, 
                      borderRadius: '50%',
                      backgroundColor: item.type === 'alarm' ? '#F53F3F' : 
                                       item.type === 'confirm' ? '#1890FF' :
                                       item.type === 'handle_start' ? '#FAAD14' :
                                       item.type === 'handle_end' ? '#52C41A' : '#D9D9D9'
                    }} />
                    <div style={{ fontWeight: 500, marginBottom: 4 }}>{item.description}</div>
                    <div style={{ color: '#8C8C8C', fontSize: 13 }}>
                      {item.time} {item.operator && <span> - {item.operator}</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              {selectedRecord.status === '未处理' && (
                <>
                  <Button type="primary" icon={<CheckCircleOutlined />} onClick={() => { setDetailModalVisible(false); handleConfirm(selectedRecord) }}>确认报警</Button>
                  <Button icon={<PlayCircleOutlined />} onClick={() => { setDetailModalVisible(false); handleStartHandle(selectedRecord) }}>开始处理</Button>
                </>
              )}
              {selectedRecord.status === '已确认' && (
                <Button type="primary" icon={<PlayCircleOutlined />} onClick={() => { setDetailModalVisible(false); handleStartHandle(selectedRecord) }}>开始处理</Button>
              )}
              {selectedRecord.status === '处理中' && (
                <Button type="primary" icon={<PauseCircleOutlined />} onClick={() => { setDetailModalVisible(false); handleFinishHandle(selectedRecord) }}>完成处理</Button>
              )}
              {selectedRecord.status !== '已恢复' && (
                <Button danger icon={<CloseCircleOutlined />} onClick={() => { setDetailModalVisible(false); handleIgnore(selectedRecord) }}>忽略报警</Button>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal 
        title="确认报警" 
        open={confirmModalVisible} 
        onCancel={() => setConfirmModalVisible(false)} 
        footer={[
          <Button key="cancel" onClick={() => setConfirmModalVisible(false)}>取消</Button>,
          <Button key="confirm" type="primary" onClick={handleConfirmSubmit}>确认报警</Button>
        ]} 
        width={500}
      >
        {selectedRecord && (
          <div>
            <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#F7F7F7', borderRadius: 8 }}>
              <div style={{ marginBottom: 8 }}><span style={{ color: '#8C8C8C' }}>报警ID：</span>{selectedRecord.id}</div>
              <div style={{ marginBottom: 8 }}><span style={{ color: '#8C8C8C' }}>报警时间：</span>{selectedRecord.alarmTime}</div>
              <div style={{ marginBottom: 8 }}><span style={{ color: '#8C8C8C' }}>报警类型：</span>{selectedRecord.alarmType}</div>
              <div><span style={{ color: '#8C8C8C' }}>报警级别：</span><Tag color={getLevelColor(selectedRecord.level)}>{selectedRecord.level}</Tag></div>
            </div>
            <Form>
              <Form.Item label="确认人" name="confirmer" initialValue="当前用户">
                <Input disabled />
              </Form.Item>
              <Form.Item label="确认意见">
                <Input.TextArea placeholder="请输入确认意见（选填）" rows={3} />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      <Modal 
        title="开始处理" 
        open={startHandleModalVisible} 
        onCancel={() => setStartHandleModalVisible(false)} 
        footer={[
          <Button key="cancel" onClick={() => setStartHandleModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleStartHandleSubmit}>开始处理</Button>
        ]} 
        width={500}
      >
        {selectedRecord && (
          <div>
            <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#FFFBE6', borderRadius: 8 }}>
              <div style={{ marginBottom: 8 }}><span style={{ color: '#8C8C8C' }}>报警ID：</span>{selectedRecord.id}</div>
              <div style={{ marginBottom: 8 }}><span style={{ color: '#8C8C8C' }}>报警类型：</span>{selectedRecord.alarmType}</div>
              <div><span style={{ color: '#8C8C8C' }}>当前值：</span><span style={{ color: '#F53F3F' }}>{selectedRecord.currentValue}</span></div>
            </div>
            <Form>
              <Form.Item label="处理人" name="handler" initialValue="当前用户">
                <Input disabled />
              </Form.Item>
              <Form.Item label="处理说明">
                <Input.TextArea 
                  placeholder="请简要描述处理计划（选填）" 
                  rows={4}
                  value={handleNote}
                  onChange={(e) => setHandleNote(e.target.value)}
                />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      <Modal 
        title="完成处理" 
        open={finishHandleModalVisible} 
        onCancel={() => setFinishHandleModalVisible(false)} 
        footer={[
          <Button key="cancel" onClick={() => setFinishHandleModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleFinishHandleSubmit}>提交处理结果</Button>
        ]} 
        width={550}
      >
        {selectedRecord && (
          <div>
            <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#F6FFED', borderRadius: 8 }}>
              <div style={{ marginBottom: 8 }}><span style={{ color: '#8C8C8C' }}>报警ID：</span>{selectedRecord.id}</div>
              <div style={{ marginBottom: 8 }}><span style={{ color: '#8C8C8C' }}>报警类型：</span>{selectedRecord.alarmType}</div>
              <div><span style={{ color: '#8C8C8C' }}>开始时间：</span>{selectedRecord.handleStartTime}</div>
            </div>
            <Form>
              <Form.Item label="处理人" name="handler" initialValue="当前用户">
                <Input disabled />
              </Form.Item>
              <Form.Item label="处理结果" required>
                <Select 
                  placeholder="请选择处理结果" 
                  value={handleResult}
                  onChange={(value) => setHandleResult(value)}
                >
                  <Select.Option value="已解决">已解决</Select.Option>
                  <Select.Option value="已修复">已修复</Select.Option>
                  <Select.Option value="已调整">已调整</Select.Option>
                  <Select.Option value="待观察">待观察</Select.Option>
                  <Select.Option value="需更换">需更换部件</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="处理详情" required>
                <Input.TextArea 
                  placeholder="请详细描述处理过程和措施" 
                  rows={4}
                  value={handleNote}
                  onChange={(e) => setHandleNote(e.target.value)}
                />
              </Form.Item>
              <Form.Item label="上传附件">
                <Button type="dashed" block>点击上传处理照片/报告（可选）</Button>
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      <Modal 
        title="忽略报警" 
        open={ignoreModalVisible} 
        onCancel={() => setIgnoreModalVisible(false)} 
        footer={[
          <Button key="cancel" onClick={() => setIgnoreModalVisible(false)}>取消</Button>,
          <Button key="confirm" type="danger" onClick={handleIgnoreSubmit}>确认忽略</Button>
        ]} 
        width={500}
      >
        <div>
          <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#FFF7E6', borderRadius: 8 }}>
            <AlertOutlined style={{ color: '#FAAD14', fontSize: 24, marginBottom: 8, display: 'block' }} />
            <div style={{ fontWeight: 500, color: '#FAAD14' }}>确定忽略该报警吗？</div>
            <div style={{ color: '#8C8C8C', fontSize: 13, marginTop: 8 }}>忽略后该报警将移入"已忽略"状态，请确认。</div>
          </div>
          <Form>
            <Form.Item label="忽略原因" required>
              <Select 
                placeholder="请选择忽略原因" 
                value={ignoreReason}
                onChange={(value) => setIgnoreReason(value)}
              >
                <Select.Option value="误报">误报</Select.Option>
                <Select.Option value="已手动处理">已手动处理</Select.Option>
                <Select.Option value="计划内维护">计划内维护</Select.Option>
                <Select.Option value="其他">其他（请说明）</Select.Option>
              </Select>
            </Form.Item>
            {ignoreReason === '其他' && (
              <Form.Item label="说明">
                <Input.TextArea placeholder="请说明忽略原因" rows={3} onChange={(e) => setIgnoreReason('其他: ' + e.target.value)} />
              </Form.Item>
            )}
          </Form>
        </div>
      </Modal>
    </div>
  )
}