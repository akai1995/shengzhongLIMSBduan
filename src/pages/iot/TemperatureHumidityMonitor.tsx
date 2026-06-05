import React, { useState, useMemo } from 'react'
import { Card, Row, Col, Table, Form, Button, Input, Select, DatePicker, Space, Modal, Tag, message, Divider } from 'antd'
import { SearchOutlined, ReloadOutlined, EyeOutlined, EditOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'

const { RangePicker } = DatePicker

const generateMonitoringData = () => {
  const locations = ['实验室A101', '实验室A102', '冰箱B01', '冰箱B02', '冷库C01', '液氮罐D01']
  const data = []
  
  for (let i = 1; i <= 100; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)]
    const deviceType = '温湿度传感器'
    
    let temperature = 25
    if (location.includes('冰箱')) {
      temperature = Number((4 + (Math.random() - 0.5) * 4).toFixed(1))
    } else if (location.includes('冷库')) {
      temperature = Number((-18 + (Math.random() - 0.5) * 6).toFixed(1))
    } else if (location.includes('液氮')) {
      temperature = Number((-196 + (Math.random() - 0.5) * 10).toFixed(1))
    } else {
      temperature = Number((25 + (Math.random() - 0.5) * 10).toFixed(1))
    }
    
    let humidity = 60
    if (location.includes('液氮罐')) {
      humidity = Number((10 + Math.random() * 10).toFixed(0))
    } else if (location.includes('冰箱') || location.includes('冷库')) {
      humidity = Number((30 + Math.random() * 20).toFixed(0))
    } else {
      humidity = Number((50 + Math.random() * 30).toFixed(0))
    }
    
    const tempRange = location.includes('冰箱') ? { min: 2, max: 6 } :
                     location.includes('冷库') ? { min: -22, max: -14 } :
                     location.includes('液氮') ? { min: -200, max: -190 } :
                     { min: 20, max: 30 }
    const humidityRange = location.includes('冰箱') || location.includes('冷库') ? { min: 25, max: 45 } :
                         location.includes('液氮罐') ? { min: 5, max: 20 } :
                         { min: 40, max: 70 }
    
    let tempStatus = '正常'
    if (temperature < tempRange.min - 2 || temperature > tempRange.max + 2) {
      tempStatus = '报警'
    } else if (temperature < tempRange.min || temperature > tempRange.max) {
      tempStatus = '预警'
    }
    
    let humidityStatus = '正常'
    if (humidity < humidityRange.min - 5 || humidity > humidityRange.max + 5) {
      humidityStatus = '报警'
    } else if (humidity < humidityRange.min || humidity > humidityRange.max) {
      humidityStatus = '预警'
    }
    
    let dataStatus = '正常'
    if (tempStatus === '报警' || humidityStatus === '报警') {
      dataStatus = '报警'
    } else if (tempStatus === '预警' || humidityStatus === '预警') {
      dataStatus = '预警'
    }

    const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0')
    const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0')
    
    data.push({
      id: `MON-${String(i).padStart(4, '0')}`,
      location,
      deviceNo: `DEV-${String(i).padStart(4, '0')}`,
      deviceType,
      temperature,
      humidity,
      tempRange,
      humidityRange,
      tempStatus,
      humidityStatus,
      dataStatus,
      updateTime: `2024-01-15 ${hours}:${minutes}:${seconds}`,
      installTime: `2023-${String(6 + Math.floor(Math.random() * 6)).padStart(2, '0')}-${String(10 + Math.floor(Math.random() * 15)).padStart(2, '0')}`,
      responsiblePerson: ['张三', '李四', '王五', '赵六'][Math.floor(Math.random() * 4)],
      phone: `138****${String(1000 + Math.floor(Math.random() * 9000)).padStart(4, '0')}`,
    })
  }
  return data
}

export default function TemperatureHumidityMonitor() {
  const { isDark } = useThemeStore()
  const [monitoringData] = useState(generateMonitoringData())
  const [searchForm] = Form.useForm()
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [thresholdModalVisible, setThresholdModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState(null)
  const [editingThreshold, setEditingThreshold] = useState({ tempMin: 0, tempMax: 0, humidityMin: 0, humidityMax: 0 })
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [filterValues, setFilterValues] = useState({})

  const filteredData = useMemo(() => {
    return monitoringData.filter(item => {
      if (filterValues.location && filterValues.location !== '全部' && item.location !== filterValues.location) {
        return false
      }
      if (filterValues.deviceNo && !item.deviceNo.includes(filterValues.deviceNo)) {
        return false
      }
      if (filterValues.dataStatus && item.dataStatus !== filterValues.dataStatus) {
        return false
      }
      return true
    })
  }, [monitoringData, filterValues])

  const totalCount = filteredData.length
  const normalCount = filteredData.filter(d => d.dataStatus === '正常').length
  const warningCount = filteredData.filter(d => d.dataStatus === '预警').length
  const alarmCount = filteredData.filter(d => d.dataStatus === '报警').length

  const handleViewDetail = (record) => {
    setSelectedRecord(record)
    setEditingThreshold({
      tempMin: record.tempRange.min,
      tempMax: record.tempRange.max,
      humidityMin: record.humidityRange.min,
      humidityMax: record.humidityRange.max
    })
    setDetailModalVisible(true)
  }

  const handleSearch = (values) => {
    setFilterValues(values)
    message.success(`查询到 ${filteredData.length} 条记录`)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setFilterValues({})
    message.success('已重置筛选条件')
  }

  const handleThresholdSave = () => {
    if (editingThreshold.tempMin >= editingThreshold.tempMax) {
      message.error('温度最小值必须小于最大值')
      return
    }
    if (editingThreshold.humidityMin >= editingThreshold.humidityMax) {
      message.error('湿度最小值必须小于最大值')
      return
    }
    message.success('阈值配置已更新')
    setThresholdModalVisible(false)
  }

  const handleRefresh = () => {
    message.success('数据已刷新')
  }

  const columns = [
    { title: '监测点ID', dataIndex: 'id', key: 'id', width: 120 },
    { title: '监测位置', dataIndex: 'location', key: 'location', width: 150 },
    { title: '设备编号', dataIndex: 'deviceNo', key: 'deviceNo', width: 130 },
    {
      title: '温度',
      dataIndex: 'temperature',
      key: 'temperature',
      width: 120,
      render: (value, record) => {
        let color = '#52C41A'
        if (record.tempStatus === '预警') color = '#FAAD14'
        if (record.tempStatus === '报警') color = '#F53F3F'
        return <span style={{ color, fontWeight: 500 }}>{value}°C</span>
      },
    },
    {
      title: '湿度',
      dataIndex: 'humidity',
      key: 'humidity',
      width: 120,
      render: (value, record) => {
        let color = '#52C41A'
        if (record.humidityStatus === '预警') color = '#FAAD14'
        if (record.humidityStatus === '报警') color = '#F53F3F'
        return <span style={{ color, fontWeight: 500 }}>{value}%</span>
      },
    },
    {
      title: '数据状态',
      dataIndex: 'dataStatus',
      key: 'dataStatus',
      width: 100,
      render: (value) => {
        const colorMap: Record<string, string> = {
          '正常': 'green',
          '预警': 'orange',
          '报警': 'red',
        }
        return <Tag color={colorMap[value] || 'default'}>{value}</Tag>
      },
    },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 180 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 150,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000' }}>温湿度监控</h1>
        <Space>
          <Button 
            type="default" 
            icon={<ReloadOutlined />} 
            onClick={handleRefresh}
            loading={autoRefresh}
          >
            手动刷新
          </Button>
          <Button 
            type={autoRefresh ? 'primary' : 'default'} 
            onClick={() => setAutoRefresh(!autoRefresh)}
          >
            {autoRefresh ? '停止自动刷新' : '开启自动刷新'}
          </Button>
        </Space>
      </div>
      
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>总监测点数</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#1890ff' }}>{totalCount}</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>正常点数</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#52C41A' }}>{normalCount}</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>预警点数</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#FAAD14' }}>{warningCount}</div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>报警点数</div>
              <div style={{ fontSize: 32, fontWeight: 600, color: '#F53F3F' }}>{alarmCount}</div>
            </div>
          </Card>
        </Col>
      </Row>

      <Card style={{ marginBottom: 20, borderRadius: 10 }}>
        <Form form={searchForm} layout="inline" onFinish={handleSearch} style={{ height: '32px' }}>
          <Form.Item label="监测位置" name="location">
            <Select placeholder="请选择监测位置" allowClear style={{ width: 200 }}>
              <Select.Option value="实验室A101">实验室A101</Select.Option>
              <Select.Option value="实验室A102">实验室A102</Select.Option>
              <Select.Option value="冰箱B01">冰箱B01</Select.Option>
              <Select.Option value="冰箱B02">冰箱B02</Select.Option>
              <Select.Option value="冷库C01">冷库C01</Select.Option>
              <Select.Option value="液氮罐D01">液氮罐D01</Select.Option>
              <Select.Option value="全部">全部</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="设备编号" name="deviceNo">
            <Input placeholder="请输入设备编号" style={{ width: 200 }} />
          </Form.Item>
          <Form.Item label="数据状态" name="dataStatus">
            <Select placeholder="请选择数据状态" allowClear style={{ width: 150 }}>
              <Select.Option value="正常">正常</Select.Option>
              <Select.Option value="预警">预警</Select.Option>
              <Select.Option value="报警">报警</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginLeft: 'auto' }}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
              <Button htmlType="button" icon={<ReloadOutlined />} onClick={handleReset}>重置</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }}>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          rowKey="id" 
          pagination={{ 
            pageSize: 10, 
            showSizeChanger: true, 
            showQuickJumper: true, 
            showTotal: (total) => `共 ${total} 条记录`,
            size: 'small',
          }} 
          scroll={{ x: 'max-content' }} 
        />
      </Card>

      <Modal 
        title="监测点详情" 
        open={detailModalVisible} 
        onCancel={() => setDetailModalVisible(false)} 
        footer={[<Button key="close" onClick={() => setDetailModalVisible(false)}>关闭</Button>]} 
        width={700}
      >
        <div>
          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500, paddingBottom: 12, borderBottom: '1px solid #E5E5E5' }}>基本信息</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 14 }}>
            <div><span style={{ color: '#8C8C8C' }}>监测点ID：</span>{selectedRecord?.id}</div>
            <div><span style={{ color: '#8C8C8C' }}>监测位置：</span>{selectedRecord?.location}</div>
            <div><span style={{ color: '#8C8C8C' }}>设备编号：</span>{selectedRecord?.deviceNo}</div>
            <div><span style={{ color: '#8C8C8C' }}>设备类型：</span>{selectedRecord?.deviceType}</div>
            <div><span style={{ color: '#8C8C8C' }}>安装时间：</span>{selectedRecord?.installTime}</div>
            <div><span style={{ color: '#8C8C8C' }}>责任人：</span>{selectedRecord?.responsiblePerson}</div>
          </div>

          <Divider />

          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500, paddingBottom: 12, borderBottom: '1px solid #E5E5E5' }}>实时数据</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, fontSize: 14 }}>
            <div>
              <span style={{ color: '#8C8C8C' }}>当前温度：</span>
              <span style={{ 
                color: selectedRecord?.tempStatus === '报警' ? '#F53F3F' : selectedRecord?.tempStatus === '预警' ? '#FAAD14' : '#52C41A',
                fontWeight: 500 
              }}>{selectedRecord?.temperature}°C</span>
              <span style={{ color: '#8C8C8C', marginLeft: 8 }}>({selectedRecord?.tempRange.min}~{selectedRecord?.tempRange.max}°C)</span>
            </div>
            <div>
              <span style={{ color: '#8C8C8C' }}>当前湿度：</span>
              <span style={{ 
                color: selectedRecord?.humidityStatus === '报警' ? '#F53F3F' : selectedRecord?.humidityStatus === '预警' ? '#FAAD14' : '#52C41A',
                fontWeight: 500 
              }}>{selectedRecord?.humidity}%</span>
              <span style={{ color: '#8C8C8C', marginLeft: 8 }}>({selectedRecord?.humidityRange.min}~{selectedRecord?.humidityRange.max}%)</span>
            </div>
            <div><span style={{ color: '#8C8C8C' }}>数据状态：</span><Tag color={selectedRecord?.dataStatus === '报警' ? 'red' : selectedRecord?.dataStatus === '预警' ? 'orange' : 'green'}>{selectedRecord?.dataStatus}</Tag></div>
            <div><span style={{ color: '#8C8C8C' }}>最后更新：</span>{selectedRecord?.updateTime}</div>
          </div>

          <Divider />

          <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500, paddingBottom: 12, borderBottom: '1px solid #E5E5E5' }}>联系方式</h3>
          <div style={{ fontSize: 14 }}>
            <div><span style={{ color: '#8C8C8C' }}>责任人电话：</span>{selectedRecord?.phone}</div>
          </div>
        </div>
      </Modal>

      <Modal 
        title="阈值配置" 
        open={thresholdModalVisible} 
        onCancel={() => setThresholdModalVisible(false)} 
        footer={[
          <Button key="cancel" onClick={() => setThresholdModalVisible(false)}>取消</Button>,
          <Button key="save" type="primary" onClick={handleThresholdSave}>保存配置</Button>
        ]} 
        width={500}
      >
        <div>
          <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 500 }}>{selectedRecord?.id} - {selectedRecord?.location}</h4>
          <Form layout="vertical">
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="温度最小值 (°C)">
                  <Input 
                    type="number" 
                    value={editingThreshold.tempMin} 
                    onChange={(e) => setEditingThreshold({...editingThreshold, tempMin: Number(e.target.value)})}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="温度最大值 (°C)">
                  <Input 
                    type="number" 
                    value={editingThreshold.tempMax} 
                    onChange={(e) => setEditingThreshold({...editingThreshold, tempMax: Number(e.target.value)})}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="湿度最小值 (%)">
                  <Input 
                    type="number" 
                    value={editingThreshold.humidityMin} 
                    onChange={(e) => setEditingThreshold({...editingThreshold, humidityMin: Number(e.target.value)})}
                  />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="湿度最大值 (%)">
                  <Input 
                    type="number" 
                    value={editingThreshold.humidityMax} 
                    onChange={(e) => setEditingThreshold({...editingThreshold, humidityMax: Number(e.target.value)})}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
          <div style={{ marginTop: 16, padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8 }}>
            <p style={{ fontSize: 13, color: '#666' }}><strong>提示：</strong>配置的阈值将用于判断监测数据是否处于正常范围，超出范围将触发预警或报警。</p>
          </div>
        </div>
      </Modal>
    </div>
  )
}
