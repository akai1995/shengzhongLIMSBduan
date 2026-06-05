import { useState, useMemo } from 'react'
import { Card, Row, Col, Table, Form, Button, Input, Select, DatePicker, Space, Modal, Tag, message, Checkbox } from 'antd'
import { SearchOutlined, EyeOutlined, DownloadOutlined, BarChartOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import PageTitle from '../../components/PageTitle/PageTitle'

const { RangePicker } = DatePicker

const generateAlarmRecords = () => {
  const locations = ['实验室A101', '实验室A102', '冰箱B01', '冰箱B02', '冷库C01', '液氮罐D01']
  const alarmTypes = ['温度过高', '温度过低', '湿度过高', '湿度过低', '设备离线', '设备故障', '其他']
  const levels = ['紧急', '重要', '一般']
  const statuses = ['已处理', '已恢复', '已确认', '已忽略']
  const handlers = ['张三', '李四', '王五', '赵六', null]
  const confirmers = ['张三', '李四', '王五', '赵六', null]
  const results = ['已解决', '已忽略', '待观察', '需现场查看', null]

  const data = []
  for (let i = 1; i <= 80; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)]
    const alarmType = alarmTypes[Math.floor(Math.random() * alarmTypes.length)]
    const level = levels[Math.floor(Math.random() * levels.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const handler = handlers[Math.floor(Math.random() * handlers.length)]
    const confirmer = confirmers[Math.floor(Math.random() * confirmers.length)]
    const result = results[Math.floor(Math.random() * results.length)]

    const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0')
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0')

    const alarmTime = `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${hours}:${minutes}:${seconds}`
    const confirmTime = confirmer ? `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${hours}:${minutes}:${seconds}` : null
    const handleTime = handler ? `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${hours}:${minutes}:${seconds}` : null
    const recoverTime = status === '已恢复' ? `2024-01-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')} ${hours}:${minutes}:${seconds}` : null

    data.push({
      id: `ALM-${String(i).padStart(6, '0')}`,
      alarmTime,
      location,
      device: `设备-${String(i).padStart(4, '0')}`,
      alarmType,
      alarmContent: `${alarmType}报警`,
      currentValue: alarmType.includes('温度') ? `${(25 + (Math.random() - 0.5) * 20).toFixed(1)}°C` : `${(60 + (Math.random() - 0.5) * 40).toFixed(0)}%`,
      level,
      status,
      confirmer,
      confirmTime,
      handler,
      handleTime,
      result,
      recoverTime,
    })
  }
  return data
}

export default function AlarmRecords() {
  const [alarmData, setAlarmData] = useState(generateAlarmRecords())
  const [searchForm] = Form.useForm()
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [reportModalVisible, setReportModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchParams, setSearchParams] = useState<any>({})

  const filteredData = useMemo(() => {
    let result = [...alarmData]

    if (searchParams.location && searchParams.location !== '全部') {
      result = result.filter(item => item.location.includes(searchParams.location))
    }
    if (searchParams.alarmType && searchParams.alarmType.length > 0) {
      result = result.filter(item => searchParams.alarmType.includes(item.alarmType))
    }
    if (searchParams.level && searchParams.level !== '全部') {
      result = result.filter(item => item.level === searchParams.level)
    }
    if (searchParams.status && searchParams.status !== '全部') {
      result = result.filter(item => item.status === searchParams.status)
    }
    if (searchParams.handler) {
      result = result.filter(item => item.handler && item.handler.includes(searchParams.handler))
    }
    if (searchParams.confirmer) {
      result = result.filter(item => item.confirmer && item.confirmer.includes(searchParams.confirmer))
    }
    if (searchParams.dateRange && searchParams.dateRange.length === 2) {
      const startDate = searchParams.dateRange[0].format('YYYY-MM-DD')
      const endDate = searchParams.dateRange[1].format('YYYY-MM-DD')
      result = result.filter(item => {
        const alarmDate = item.alarmTime.split(' ')[0]
        return alarmDate >= startDate && alarmDate <= endDate
      })
    }

    return result
  }, [alarmData, searchParams])

  const handleViewDetail = (record) => {
    setSelectedRecord(record)
    setDetailModalVisible(true)
  }

  const handleExport = () => {
    const dataToExport = selectedRows.length > 0 
      ? filteredData.filter(item => selectedRows.includes(item.id))
      : filteredData
      
    if (dataToExport.length === 0) {
      message.warning('请选择要导出的数据')
      return
    }
    
    const exportData = dataToExport.map(item => ({
      '报警ID': item.id,
      '报警时间': item.alarmTime,
      '位置': item.location,
      '设备/监测点': item.device,
      '报警类型': item.alarmType,
      '报警内容': item.alarmContent,
      '当前值': item.currentValue,
      '报警级别': item.level,
      '状态': item.status,
      '确认人': item.confirmer || '-',
      '确认时间': item.confirmTime || '-',
      '处理人': item.handler || '-',
      '处理时间': item.handleTime || '-',
      '处理结果': item.result || '-',
      '恢复时间': item.recoverTime || '-',
    }))

    const headers = Object.keys(exportData[0])
    const csvContent = [headers.join(','), ...exportData.map(row => headers.map(h => `"${row[h]}"`).join(','))].join('\n')
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `报警记录_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    message.success('导出成功')
  }

  const handleGenerateReport = () => {
    setReportModalVisible(true)
  }

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    setSearchParams(values)
    setSelectedRows([])
  }

  const handleReset = () => {
    searchForm.resetFields()
    setSearchParams({})
    setSelectedRows([])
  }

  const getAlarmTypeColor = (type) => {
    if (type.includes('温度')) return 'red'
    if (type.includes('湿度')) return 'orange'
    if (type.includes('离线') || type.includes('故障')) return 'volcano'
    return 'blue'
  }

  const getLevelColor = (level) => {
    if (level === '紧急') return 'red'
    if (level === '重要') return 'orange'
    return 'blue'
  }

  const getStatusColor = (status) => {
    if (status === '已处理' || status === '已恢复') return 'green'
    if (status === '已确认') return 'blue'
    return 'default'
  }

  const columns = [
    { 
      title: (
        <Checkbox 
          checked={selectedRows.length > 0 && selectedRows.length === filteredData.length}
          indeterminate={selectedRows.length > 0 && selectedRows.length < filteredData.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(filteredData.map(d => d.id))
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
    { title: '报警ID', dataIndex: 'id', key: 'id', width: 130 },
    { title: '报警时间', dataIndex: 'alarmTime', key: 'alarmTime', width: 180 },
    { title: '位置', dataIndex: 'location', key: 'location', width: 120 },
    { title: '设备/监测点', dataIndex: 'device', key: 'device', width: 130 },
    {
      title: '报警类型',
      dataIndex: 'alarmType',
      key: 'alarmType',
      width: 120,
      render: (type) => <Tag color={getAlarmTypeColor(type)}>{type}</Tag>
    },
    { title: '报警内容', dataIndex: 'alarmContent', key: 'alarmContent', width: 120 },
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
    { title: '处理时间', dataIndex: 'handleTime', key: 'handleTime', width: 180 },
    { title: '处理结果', dataIndex: 'result', key: 'result', width: 120 },
    { title: '恢复时间', dataIndex: 'recoverTime', key: 'recoverTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
      ),
    },
  ]

  const statistics = useMemo(() => {
    const total = alarmData.length
    const byLevel = { '紧急': 0, '重要': 0, '一般': 0 }
    const byStatus = { '已处理': 0, '已恢复': 0, '已确认': 0, '已忽略': 0 }
    const byType = {}

    alarmData.forEach(item => {
      byLevel[item.level]++
      byStatus[item.status]++
      byType[item.alarmType] = (byType[item.alarmType] || 0) + 1
    })

    return { total, byLevel, byStatus, byType }
  }, [alarmData])

  return (
    <div>
      <PageTitle title="报警记录" />

      <Card style={{ marginBottom: 20, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16} style={{ height: '32px' }}>
            <Col span={6}>
              <Form.Item label="位置" name="location">
                <Select placeholder="请选择位置">
                  <Select.Option value="全部">全部</Select.Option>
                  <Select.Option value="实验室">实验室</Select.Option>
                  <Select.Option value="冰箱">冰箱</Select.Option>
                  <Select.Option value="冷库">冷库</Select.Option>
                  <Select.Option value="液氮罐">液氮罐</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="报警类型" name="alarmType">
                <Select placeholder="请选择报警类型" mode="multiple">
                  <Select.Option value="温度过高">温度过高</Select.Option>
                  <Select.Option value="温度过低">温度过低</Select.Option>
                  <Select.Option value="湿度过高">湿度过高</Select.Option>
                  <Select.Option value="湿度过低">湿度过低</Select.Option>
                  <Select.Option value="设备离线">设备离线</Select.Option>
                  <Select.Option value="设备故障">设备故障</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
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
              <Col span={6}>
                <Form.Item label="状态" name="status">
                  <Select placeholder="请选择状态">
                    <Select.Option value="全部">全部</Select.Option>
                    <Select.Option value="已处理">已处理</Select.Option>
                    <Select.Option value="已恢复">已恢复</Select.Option>
                    <Select.Option value="已忽略">已忽略</Select.Option>
                    <Select.Option value="已确认">已确认</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            ) : (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', height: '32px' }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset}>重置</Button>
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
              <Col span={6}>
                <Form.Item label="处理人" name="handler">
                  <Input placeholder="请输入处理人" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="确认人" name="confirmer">
                  <Input placeholder="请输入确认人" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="时间范围" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', height: '32px' }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset}>重置</Button>
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

      <Card style={{ marginBottom: 20, borderRadius: 10 }}>
        <Row gutter={16}>
          <Col span={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
              <span style={{ fontSize: 14, color: '#666' }}>总报警数</span>
              <span style={{ fontSize: 24, fontWeight: 600, color: '#1890FF' }}>{statistics.total}</span>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#FFF1F0', borderRadius: 8 }}>
              <Tag color="red">紧急</Tag>
              <span style={{ fontSize: 24, fontWeight: 600, color: '#F53F3F' }}>{statistics.byLevel['紧急']}</span>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#FFFBE6', borderRadius: 8 }}>
              <Tag color="orange">重要</Tag>
              <span style={{ fontSize: 24, fontWeight: 600, color: '#FAAD14' }}>{statistics.byLevel['重要']}</span>
            </div>
          </Col>
          <Col span={6}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 12, backgroundColor: '#E6F7FF', borderRadius: 8 }}>
              <Tag color="blue">一般</Tag>
              <span style={{ fontSize: 24, fontWeight: 600, color: '#1890FF' }}>{statistics.byLevel['一般']}</span>
            </div>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 12, marginBottom: 16 }}>
          <Button type="primary" icon={<DownloadOutlined />} onClick={handleExport} disabled={selectedRows.length === 0}>导出</Button>
          <Button type="primary" icon={<BarChartOutlined />} onClick={handleGenerateReport}>生成统计报表</Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredData}
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
        width={800}
      >
        {selectedRecord && (
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500, paddingBottom: 12, borderBottom: '1px solid #E5E5E5' }}>报警详情</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 14 }}>
              <div><span style={{ color: '#8C8C8C' }}>报警ID：</span>{selectedRecord.id}</div>
              <div><span style={{ color: '#8C8C8C' }}>报警时间：</span>{selectedRecord.alarmTime}</div>
              <div><span style={{ color: '#8C8C8C' }}>位置：</span>{selectedRecord.location}</div>
              <div><span style={{ color: '#8C8C8C' }}>设备/监测点：</span>{selectedRecord.device}</div>
              <div><span style={{ color: '#8C8C8C' }}>报警类型：</span>{selectedRecord.alarmType}</div>
              <div><span style={{ color: '#8C8C8C' }}>报警内容：</span>{selectedRecord.alarmContent}</div>
              <div><span style={{ color: '#8C8C8C' }}>当前值：</span>{selectedRecord.currentValue}</div>
              <div><span style={{ color: '#8C8C8C' }}>报警级别：</span><Tag color={getLevelColor(selectedRecord.level)}>{selectedRecord.level}</Tag></div>
              <div><span style={{ color: '#8C8C8C' }}>状态：</span><Tag color={getStatusColor(selectedRecord.status)}>{selectedRecord.status}</Tag></div>
              <div><span style={{ color: '#8C8C8C' }}>确认人：</span>{selectedRecord.confirmer || '-'}</div>
              <div><span style={{ color: '#8C8C8C' }}>确认时间：</span>{selectedRecord.confirmTime || '-'}</div>
              <div><span style={{ color: '#8C8C8C' }}>处理人：</span>{selectedRecord.handler || '-'}</div>
              <div><span style={{ color: '#8C8C8C' }}>处理时间：</span>{selectedRecord.handleTime || '-'}</div>
              <div><span style={{ color: '#8C8C8C' }}>处理结果：</span>{selectedRecord.result || '-'}</div>
              <div><span style={{ color: '#8C8C8C' }}>恢复时间：</span>{selectedRecord.recoverTime || '-'}</div>
            </div>

            <h3 style={{ marginBottom: 16, marginTop: 24, fontSize: 16, fontWeight: 500, paddingBottom: 12, borderBottom: '1px solid #E5E5E5' }}>处置流程</h3>
            <div style={{ paddingLeft: 20, borderLeft: '2px solid #E5E5E5' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 500 }}>报警触发</div>
                <div style={{ color: '#8C8C8C', fontSize: 13 }}>{selectedRecord.alarmTime}</div>
              </div>
              {selectedRecord.confirmTime && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 500 }}>确认处理</div>
                  <div style={{ color: '#8C8C8C', fontSize: 13 }}>{selectedRecord.confirmTime} - {selectedRecord.confirmer}</div>
                </div>
              )}
              {selectedRecord.handleTime && (
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontWeight: 500 }}>处理完成</div>
                  <div style={{ color: '#8C8C8C', fontSize: 13 }}>{selectedRecord.handleTime} - {selectedRecord.handler}，结果：{selectedRecord.result}</div>
                </div>
              )}
              {selectedRecord.recoverTime && (
                <div>
                  <div style={{ fontWeight: 500 }}>系统恢复</div>
                  <div style={{ color: '#8C8C8C', fontSize: 13 }}>{selectedRecord.recoverTime}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="生成统计报表"
        open={reportModalVisible}
        onCancel={() => setReportModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setReportModalVisible(false)}>关闭</Button>,
          <Button key="export" type="primary" onClick={() => {
            message.success('报表生成成功')
            setReportModalVisible(false)
          }}>导出报表</Button>
        ]}
        width={900}
      >
        <div>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="时间范围">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="统计维度">
                  <Select placeholder="请选择统计维度">
                    <Select.Option value="type">按报警类型</Select.Option>
                    <Select.Option value="location">按位置</Select.Option>
                    <Select.Option value="level">按报警级别</Select.Option>
                    <Select.Option value="handler">按处理人</Select.Option>
                    <Select.Option value="confirmer">按确认人</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>
          </Form>

          <div style={{ marginTop: 24 }}>
            <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 500 }}>统计摘要</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#1890FF' }}>{statistics.total}</div>
                <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>总报警数</div>
              </div>
              <div style={{ padding: 12, backgroundColor: '#FFF1F0', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#F53F3F' }}>{statistics.byStatus['已处理'] + statistics.byStatus['已恢复']}</div>
                <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>已解决</div>
              </div>
              <div style={{ padding: 12, backgroundColor: '#FFFBE6', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#FAAD14' }}>{statistics.byStatus['已确认']}</div>
                <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>处理中</div>
              </div>
              <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 600, color: '#8C8C8C' }}>{statistics.byStatus['已忽略']}</div>
                <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>已忽略</div>
              </div>
            </div>

            <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 500 }}>报警级别分布</h4>
            <div style={{ display: 'flex', gap: 16, marginBottom: 24 }}>
              {Object.entries(statistics.byLevel).map(([level, count]) => (
                <div key={level} style={{ flex: 1, padding: 12, borderRadius: 8, backgroundColor: level === '紧急' ? '#FFF1F0' : level === '重要' ? '#FFFBE6' : '#E6F7FF' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Tag color={getLevelColor(level)}>{level}</Tag>
                    <span style={{ fontSize: 18, fontWeight: 600, color: level === '紧急' ? '#F53F3F' : level === '重要' ? '#FAAD14' : '#1890FF' }}>{count}</span>
                  </div>
                  <div style={{ height: 8, backgroundColor: 'rgba(0,0,0,0.1)', borderRadius: 4, overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        height: '100%', 
                        width: `${(count / statistics.total) * 100}%`, 
                        backgroundColor: level === '紧急' ? '#F53F3F' : level === '重要' ? '#FAAD14' : '#1890FF',
                        borderRadius: 4
                      }} 
                    />
                  </div>
                </div>
              ))}
            </div>

            <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 500 }}>报警类型统计</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {Object.entries(statistics.byType).slice(0, 6).map(([type, count]) => (
                <div key={type} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 8, backgroundColor: '#F5F5F5', borderRadius: 6 }}>
                  <span style={{ fontSize: 13 }}>{type}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, color: '#1890FF' }}>{count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}