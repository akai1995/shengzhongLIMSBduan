import { Card, Statistic, Row, Col, Tag, Table, Button, Modal, Form, Input, Select, DatePicker, Space, Popconfirm, message, Switch, Checkbox } from 'antd'
import { PlusOutlined, SearchOutlined, ReloadOutlined, ChromeOutlined, WarningOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UpOutlined, DownOutlined, PoweroffOutlined, PlayCircleOutlined, PauseCircleOutlined, HistoryOutlined } from '@ant-design/icons'
import { useState, useEffect, useMemo } from 'react'

const generateDeviceData = () => {
  const locations = ['实验室A101', '实验室A102', '实验室A103', '实验室A104', '实验室B101', '实验室B102', '实验室B103', '实验室B104', '冰箱B01', '冰箱B02', '冰箱B03', '冰箱B04', '冷库C01', '冷库C02', '液氮罐D01', '液氮罐D02']
  const types = ['冰箱', '冷库', '液氮罐', '温湿度传感器', '空调', '通风设备']
  const brands = ['海尔', '美的', '西门子', '松下', '格力', '海信']
  const data = []
  
  for (let i = 1; i <= 50; i++) {
    const location = locations[Math.floor(Math.random() * locations.length)]
    const deviceType = location.includes('冰箱') ? '冰箱' : location.includes('冷库') ? '冷库' : location.includes('液氮') ? '液氮罐' : '温湿度传感器'
    const temperatureBase = location.includes('冰箱') ? 4 : location.includes('冷库') ? -18 : location.includes('液氮') ? -196 : 25
    const temperature = Number((temperatureBase + (Math.random() - 0.5) * 10).toFixed(1))
    const humidity = deviceType === '液氮罐' ? Number((10 + Math.random() * 10).toFixed(0)) : Number((50 + Math.random() * 30).toFixed(0))
    const loadRate = Number((30 + Math.random() * 50).toFixed(0))
    const runHours = Math.floor(1000 + Math.random() * 5000)
    
    const onlineStatus = Math.random() > 0.15 ? '在线' : '离线'
    const runStatus = onlineStatus === '离线' ? '停机' : ['运行中', '待机', '故障', '停机'][Math.floor(Math.random() * 4)]
    const switchStatus = runStatus === '运行中' ? '开启' : Math.random() > 0.3 ? '关闭' : '开启'
    
    data.push({
      id: `DEV${String(i).padStart(4, '0')}`,
      name: `${deviceType}${String(i).padStart(3, '0')}`,
      deviceNo: `DEV-${String(i).padStart(4, '0')}`,
      type: deviceType,
      brand: brands[Math.floor(Math.random() * brands.length)],
      model: `Model-${String(i).padStart(3, '0')}`,
      serialNo: `SN${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
      location,
      onlineStatus,
      runStatus,
      switchStatus,
      temperature,
      humidity,
      loadRate,
      runHours,
      purchaseDate: `202${2 + Math.floor(Math.random() * 3)}-${String(1 + Math.floor(Math.random() * 12)).padStart(2, '0')}-${String(1 + Math.floor(Math.random() * 28)).padStart(2, '0')}`,
      responsible: ['张三', '李四', '王五', '赵六', '钱七'][Math.floor(Math.random() * 5)],
      contact: `13800${String(Math.floor(Math.random() * 10000)).padStart(4, '0')}`,
      updateTime: `2024-01-15 14:${String(Math.floor(Math.random() * 30)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`
    })
  }
  return data
}

const generateStatusHistory = () => {
  const types = ['在线离线', '运行状态', '开关']
  const triggers = ['自动', '手动']
  const operators = ['张三', '李四', '王五', '系统']
  const statuses = ['在线', '离线', '运行中', '待机', '故障', '停机', '开启', '关闭']
  const data = []
  
  for (let i = 1; i <= 20; i++) {
    const type = types[Math.floor(Math.random() * types.length)]
    const beforeStatus = statuses[Math.floor(Math.random() * statuses.length)]
    let afterStatus = statuses[Math.floor(Math.random() * statuses.length)]
    while (afterStatus === beforeStatus) {
      afterStatus = statuses[Math.floor(Math.random() * statuses.length)]
    }
    
    data.push({
      id: `H${String(i).padStart(4, '0')}`,
      time: `2024-01-${String(10 + Math.floor(Math.random() * 6)).padStart(2, '0')} ${String(8 + Math.floor(Math.random() * 8)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      beforeStatus,
      afterStatus,
      type,
      trigger: triggers[Math.floor(Math.random() * triggers.length)],
      operator: operators[Math.floor(Math.random() * operators.length)],
      remark: type === '手动' ? '用户手动操作' : '系统自动检测'
    })
  }
  return data.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
}

export default function EnvironmentMonitor() {
  const [devices, setDevices] = useState(generateDeviceData())
  const [activeTab, setActiveTab] = useState<'list' | 'chart'>('list')
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card')
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [remoteControlModalVisible, setRemoteControlModalVisible] = useState(false)
  const [historyModalVisible, setHistoryModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<any>(null)
  const [statusHistory, setStatusHistory] = useState<any[]>([])
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [searchForm] = Form.useForm()
  const [controlForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [filterValues, setFilterValues] = useState({})
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (autoRefresh) {
      interval = setInterval(() => {
        setDevices(prev => prev.map(device => {
          if (device.onlineStatus === '离线') return device
          const tempChange = (Math.random() - 0.5) * 2
          return {
            ...device,
            temperature: Number((device.temperature + tempChange).toFixed(1)),
            humidity: Math.max(10, Math.min(90, device.humidity + Math.floor((Math.random() - 0.5) * 4))),
            loadRate: Math.max(0, Math.min(100, device.loadRate + Math.floor((Math.random() - 0.5) * 10))),
            updateTime: new Date().toLocaleString('zh-CN', { hour12: false })
          }
        }))
      }, 10000)
    }
    return () => clearInterval(interval)
  }, [autoRefresh])

  const filteredDevices = useMemo(() => {
    return devices.filter(device => {
      if (filterValues.deviceName && !device.name.includes(filterValues.deviceName)) {
        return false
      }
      if (filterValues.deviceNo && !device.deviceNo.includes(filterValues.deviceNo)) {
        return false
      }
      if (filterValues.location && filterValues.location !== '全部' && device.location !== filterValues.location) {
        return false
      }
      if (filterValues.type && filterValues.type !== '全部' && device.type !== filterValues.type) {
        return false
      }
      if (filterValues.onlineStatus && filterValues.onlineStatus !== '全部' && device.onlineStatus !== filterValues.onlineStatus) {
        return false
      }
      if (filterValues.runStatus && filterValues.runStatus !== '全部' && device.runStatus !== filterValues.runStatus) {
        return false
      }
      return true
    })
  }, [devices, filterValues])

  const totalCount = devices.length
  const onlineCount = devices.filter(d => d.onlineStatus === '在线').length
  const offlineCount = devices.filter(d => d.onlineStatus === '离线').length
  const faultCount = devices.filter(d => d.runStatus === '故障').length
  const runningCount = devices.filter(d => d.runStatus === '运行中').length
  const onlineRate = totalCount > 0 ? ((onlineCount / totalCount) * 100).toFixed(1) : '0'
  const runningRate = totalCount > 0 ? ((runningCount / totalCount) * 100).toFixed(1) : '0'

  const handleViewDetail = (device: any) => {
    setSelectedDevice(device)
    setStatusHistory(generateStatusHistory())
    setDetailModalVisible(true)
  }

  const handleRemoteControl = () => {
    controlForm.setFieldsValue({
      targetAction: selectedDevice?.switchStatus === '开启' ? '关闭' : '开启',
      reason: '',
      confirm: false
    })
    setRemoteControlModalVisible(true)
  }

  const handleConfirmControl = () => {
    controlForm.validateFields().then(values => {
      if (!values.confirm) {
        message.warning('请勾选二次确认')
        return
      }
      setDevices(prev => prev.map(d => 
        d.id === selectedDevice.id ? {
          ...d,
          switchStatus: values.targetAction,
          runStatus: values.targetAction === '开启' ? '运行中' : '待机',
          updateTime: new Date().toLocaleString('zh-CN', { hour12: false })
        } : d
      ))
      setSelectedDevice(prev => ({
        ...prev,
        switchStatus: values.targetAction,
        runStatus: values.targetAction === '开启' ? '运行中' : '待机'
      }))
      setRemoteControlModalVisible(false)
      controlForm.resetFields()
      message.success('操作成功')
    }).catch(() => {
      message.error('请填写完整信息')
    })
  }

  const handleEdit = () => {
    editForm.setFieldsValue({
      name: selectedDevice?.name,
      responsible: selectedDevice?.responsible,
      contact: selectedDevice?.contact,
      location: selectedDevice?.location
    })
    setEditModalVisible(true)
  }

  const handleSaveEdit = () => {
    editForm.validateFields().then(values => {
      setDevices(prev => prev.map(d => 
        d.id === selectedDevice.id ? {
          ...d,
          ...values,
          updateTime: new Date().toLocaleString('zh-CN', { hour12: false })
        } : d
      ))
      setSelectedDevice(prev => ({
        ...prev,
        ...values
      }))
      setEditModalVisible(false)
      editForm.resetFields()
      message.success('修改成功')
    })
  }

  const handleBatchControl = (action: string) => {
    if (selectedRows.length === 0) {
      message.warning('请先选择设备')
      return
    }
    Modal.confirm({
      title: `批量${action === '开启' ? '开启' : '关闭'}设备`,
      content: `确认${action === '开启' ? '开启' : '关闭'}选中的 ${selectedRows.length} 台设备？`,
      onOk: () => {
        setDevices(prev => prev.map(d => 
          selectedRows.includes(d.id) ? {
            ...d,
            switchStatus: action,
            runStatus: action === '开启' ? '运行中' : '待机',
            updateTime: new Date().toLocaleString('zh-CN', { hour12: false })
          } : d
        ))
        setSelectedRows([])
        message.success(`已${action === '开启' ? '开启' : '关闭'} ${selectedRows.length} 台设备`)
      }
    })
  }

  const handleSearch = (values: any) => {
    setFilterValues(values)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setFilterValues({})
  }

  const handleRefresh = () => {
    setDevices(generateDeviceData())
    message.success('数据已刷新')
  }

  const getOnlineStatusColor = (status: string) => {
    return status === '在线' ? '#52C41A' : '#999999'
  }

  const getRunStatusColor = (status: string) => {
    switch(status) {
      case '运行中': return '#1890ff'
      case '待机': return '#FAAD14'
      case '故障': return '#F53F3F'
      default: return '#999999'
    }
  }

  const getOnlineStatusTagColor = (status: string) => {
    return status === '在线' ? 'green' : 'default'
  }

  const getRunStatusTagColor = (status: string) => {
    switch(status) {
      case '运行中': return 'blue'
      case '待机': return 'orange'
      case '故障': return 'red'
      default: return 'default'
    }
  }

  const tableColumns = [
    {
      title: '',
      key: 'checkbox',
      width: 50,
      render: (_, record) => (
        <Checkbox checked={selectedRows.includes(record.id)} onChange={(e) => {
          if (e.target.checked) {
            setSelectedRows([...selectedRows, record.id])
          } else {
            setSelectedRows(selectedRows.filter(id => id !== record.id))
          }
        }} />
      )
    },
    { title: '设备名称', dataIndex: 'name', key: 'name', width: 120 },
    { title: '设备编号', dataIndex: 'deviceNo', key: 'deviceNo', width: 120 },
    { title: '设备类型', dataIndex: 'type', key: 'type', width: 100 },
    { title: '安装位置', dataIndex: 'location', key: 'location', width: 120 },
    { 
      title: '在线状态', 
      dataIndex: 'onlineStatus', 
      key: 'onlineStatus', 
      width: 100,
      render: (status) => (
        <Tag color={getOnlineStatusTagColor(status)}>{status}</Tag>
      )
    },
    { 
      title: '运行状态', 
      dataIndex: 'runStatus', 
      key: 'runStatus', 
      width: 100,
      render: (status) => (
        <Tag color={getRunStatusTagColor(status)}>{status}</Tag>
      )
    },
    { 
      title: '开关状态', 
      dataIndex: 'switchStatus', 
      key: 'switchStatus', 
      width: 100,
      render: (status) => (
        <Tag color={status === '开启' ? 'green' : 'default'}>{status}</Tag>
      )
    },
    { 
      title: '温度', 
      dataIndex: 'temperature', 
      key: 'temperature', 
      width: 80,
      render: (value) => `${value}°C`
    },
    { 
      title: '湿度', 
      dataIndex: 'humidity', 
      key: 'humidity', 
      width: 80,
      render: (value) => `${value}%`
    },
    { 
      title: '更新时间', 
      dataIndex: 'updateTime', 
      key: 'updateTime', 
      width: 160 
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => {
            setSelectedDevice(record)
            handleEdit()
          }}>编辑</Button>
          <Button 
            type="text" 
            icon={<PoweroffOutlined />} 
            onClick={() => {
              setSelectedDevice(record)
              handleRemoteControl()
            }}
            disabled={record.onlineStatus === '离线'}
          >
            {record.switchStatus === '开启' ? '关闭' : '开启'}
          </Button>
        </div>
      )
    }
  ]

  const locations = [...new Set(devices.map(d => d.location))]
  const types = [...new Set(devices.map(d => d.type))]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: '100%', padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h1 style={{ fontSize: 20, fontWeight: 500 }}>设备状态监控</h1>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, color: '#666' }}>自动刷新</span>
            <Switch checked={autoRefresh} onChange={setAutoRefresh} />
            <span style={{ fontSize: 12, color: '#999' }}>每10秒</span>
          </div>
          <Button icon={<ReloadOutlined />} onClick={handleRefresh}>手动刷新</Button>
          <div style={{ display: 'flex', border: '1px solid #E5E5E5', borderRadius: 6, overflow: 'hidden' }}>
            <Button 
              type={activeTab === 'list' ? 'primary' : 'default'} 
              onClick={() => setActiveTab('list')}
              style={{ borderRight: activeTab === 'list' ? 'none' : '1px solid #E5E5E5' }}
            >
              设备列表
            </Button>
            <Button 
              type={activeTab === 'chart' ? 'primary' : 'default'} 
              onClick={() => setActiveTab('chart')}
            >
              状态图表
            </Button>
          </div>
        </div>
      </div>

      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={4}>
          <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <ChromeOutlined style={{ fontSize: 28, color: '#1890ff' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#1890ff' }}>{totalCount}</div>
                <div style={{ fontSize: 12, color: '#999' }}>设备总数</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={5}>
          <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PlayCircleOutlined style={{ fontSize: 28, color: '#52C41A' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#52C41A' }}>{onlineCount}</div>
                <div style={{ fontSize: 12, color: '#999' }}>在线设备 ({onlineRate}%)</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={5}>
          <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PauseCircleOutlined style={{ fontSize: 28, color: '#999' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#999' }}>{offlineCount}</div>
                <div style={{ fontSize: 12, color: '#999' }}>离线设备</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={5}>
          <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <WarningOutlined style={{ fontSize: 28, color: '#F53F3F' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#F53F3F' }}>{faultCount}</div>
                <div style={{ fontSize: 12, color: '#999' }}>故障设备</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={5}>
          <Card bodyStyle={{ padding: 20 }} style={{ borderRadius: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <PoweroffOutlined style={{ fontSize: 28, color: '#1890ff' }} />
              <div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#1890ff' }}>{runningCount}</div>
                <div style={{ fontSize: 12, color: '#999' }}>运行中设备</div>
                <div style={{ fontSize: 12, color: '#1890ff', marginTop: 4 }}>占比 {runningRate}%</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {activeTab === 'list' && (
        <>
          <Card style={{ borderRadius: 10, marginBottom: 16 }} bodyStyle={{ padding: 16 }}>
            <Form form={searchForm} layout="inline" onFinish={handleSearch}>
              <Form.Item label="设备名称" name="deviceName">
                <Input placeholder="请输入设备名称" style={{ width: 180 }} />
              </Form.Item>
              <Form.Item label="设备编号" name="deviceNo">
                <Input placeholder="请输入设备编号" style={{ width: 180 }} />
              </Form.Item>
              <Form.Item label="安装位置" name="location">
                <Select placeholder="请选择位置" allowClear style={{ width: 180 }}>
                  <Select.Option value="全部">全部</Select.Option>
                  {locations.map(l => (
                    <Select.Option key={l} value={l}>{l}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              {showAdvancedFilter && (
                <>
                  <Form.Item label="设备类型" name="type">
                    <Select placeholder="请选择类型" allowClear style={{ width: 120 }}>
                      <Select.Option value="全部">全部</Select.Option>
                      {types.map(t => (
                        <Select.Option key={t} value={t}>{t}</Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item label="在线状态" name="onlineStatus">
                    <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
                      <Select.Option value="全部">全部</Select.Option>
                      <Select.Option value="在线">在线</Select.Option>
                      <Select.Option value="离线">离线</Select.Option>
                    </Select>
                  </Form.Item>
                  <Form.Item label="运行状态" name="runStatus">
                    <Select placeholder="请选择状态" allowClear style={{ width: 120 }}>
                      <Select.Option value="全部">全部</Select.Option>
                      <Select.Option value="运行中">运行中</Select.Option>
                      <Select.Option value="待机">待机</Select.Option>
                      <Select.Option value="故障">故障</Select.Option>
                      <Select.Option value="停机">停机</Select.Option>
                    </Select>
                  </Form.Item>
                </>
              )}
              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>查询</Button>
                  <Button onClick={handleReset}>重置</Button>
                  <Button type="link" onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}>
                    {showAdvancedFilter ? '收起筛选' : '高级筛选'}
                    {showAdvancedFilter ? <UpOutlined /> : <DownOutlined />}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>

          {selectedRows.length > 0 && (
            <Card style={{ borderRadius: 10, marginBottom: 16, borderColor: '#1890ff' }} bodyStyle={{ padding: 12 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span>已选择 {selectedRows.length} 台设备</span>
                <Button 
                  type="primary" 
                  onClick={() => handleBatchControl('开启')}
                  disabled={selectedRows.some(id => devices.find(d => d.id === id)?.onlineStatus === '离线')}
                >
                  批量开启
                </Button>
                <Button 
                  type="danger" 
                  onClick={() => handleBatchControl('关闭')}
                  disabled={selectedRows.some(id => devices.find(d => d.id === id)?.onlineStatus === '离线')}
                >
                  批量关闭
                </Button>
                <Button onClick={() => setSelectedRows([])}>取消选择</Button>
              </div>
            </Card>
          )}

          <Card style={{ borderRadius: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <Button 
                  type={viewMode === 'card' ? 'primary' : 'default'} 
                  onClick={() => setViewMode('card')}
                >
                  卡片视图
                </Button>
                <Button 
                  type={viewMode === 'table' ? 'primary' : 'default'} 
                  onClick={() => setViewMode('table')}
                >
                  列表视图
                </Button>
              </div>
              <div style={{ color: '#999', fontSize: 12 }}>
                共 {filteredDevices.length} 条记录
              </div>
            </div>

            {viewMode === 'card' ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
                {filteredDevices.map(device => (
                  <Card 
                    key={device.id} 
                    style={{ 
                      borderRadius: 10, 
                      cursor: 'pointer',
                      borderColor: device.runStatus === '故障' ? '#F53F3F' : '#E5E5E5',
                      backgroundColor: device.runStatus === '故障' ? '#FFF5F5' : device.onlineStatus === '离线' ? '#FAFAFA' : '#FFFFFF'
                    }}
                    hoverable
                    onClick={() => handleViewDetail(device)}
                  >
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                        <span style={{ fontSize: 16, fontWeight: 500 }}>{device.name}</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: getOnlineStatusColor(device.onlineStatus) }}></span>
                          <span style={{ fontSize: 12, color: getOnlineStatusColor(device.onlineStatus) }}>{device.onlineStatus}</span>
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>{device.deviceNo}</div>
                    </div>
                    
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>当前位置</div>
                      <div style={{ fontSize: 13 }}>{device.location}</div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>运行状态</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                          <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: getRunStatusColor(device.runStatus) }}></span>
                          <span style={{ fontSize: 13, color: getRunStatusColor(device.runStatus) }}>{device.runStatus}</span>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: 12, color: '#999', marginBottom: 4 }}>开关状态</div>
                        <Tag color={device.switchStatus === '开启' ? 'green' : 'default'}>{device.switchStatus}</Tag>
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <ChromeOutlined style={{ fontSize: 16, color: '#1890ff' }} />
                        <span style={{ fontSize: 14, fontWeight: 500, color: '#1890ff' }}>{device.temperature}°C</span>
                      </div>
                      <div style={{ fontSize: 12, color: '#999' }}>更新于 {device.updateTime}</div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Table
                columns={tableColumns}
                dataSource={filteredDevices}
                rowKey="id"
                scroll={{ x: 'max-content' }}
                pagination={{ 
                  pageSize: 10, 
                  showSizeChanger: true, 
                  showQuickJumper: true, 
                  showTotal: (total) => `共 ${total} 条记录` 
                }}
              />
            )}
          </Card>
        </>
      )}

      {activeTab === 'chart' && (
        <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
          <div style={{ marginBottom: 20 }}>
            <Form layout="inline">
              <Form.Item label="选择设备">
                <Select style={{ width: 200 }} placeholder="请选择设备">
                  <Select.Option value="all">全部设备</Select.Option>
                  {devices.map(d => (
                    <Select.Option key={d.id} value={d.id}>{d.name} - {d.deviceNo}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="时间范围">
                <DatePicker.RangePicker style={{ width: 300 }} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" icon={<SearchOutlined />}>查询</Button>
              </Form.Item>
            </Form>
          </div>
          <div style={{ height: 300, background: '#f5f5f5', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#8C8C8C' }}>
            <div style={{ textAlign: 'center' }}>
              <HistoryOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <div>最近24小时状态变更时间线</div>
              <div style={{ fontSize: 12, marginTop: 8 }}>选择设备后显示状态变更历史</div>
            </div>
          </div>
        </Card>
      )}

      <Modal
        title="设备详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedDevice && (
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500, paddingBottom: 12, borderBottom: '1px solid #E5E5E5' }}>基本信息</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div><span style={{ color: '#8C8C8C' }}>设备ID：</span>{selectedDevice.id}</div>
                <div><span style={{ color: '#8C8C8C' }}>设备名称：</span>{selectedDevice.name}</div>
                <div><span style={{ color: '#8C8C8C' }}>设备编号：</span>{selectedDevice.deviceNo}</div>
                <div><span style={{ color: '#8C8C8C' }}>设备类型：</span>{selectedDevice.type}</div>
                <div><span style={{ color: '#8C8C8C' }}>品牌型号：</span>{selectedDevice.brand} {selectedDevice.model}</div>
                <div><span style={{ color: '#8C8C8C' }}>序列号：</span>{selectedDevice.serialNo}</div>
                <div><span style={{ color: '#8C8C8C' }}>购置日期：</span>{selectedDevice.purchaseDate}</div>
                <div><span style={{ color: '#8C8C8C' }}>安装位置：</span>{selectedDevice.location}</div>
                <div><span style={{ color: '#8C8C8C' }}>责任人：</span>{selectedDevice.responsible}</div>
                <div><span style={{ color: '#8C8C8C' }}>联系电话：</span>{selectedDevice.contact}</div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500, paddingBottom: 12, borderBottom: '1px solid #E5E5E5' }}>实时状态</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: getOnlineStatusColor(selectedDevice.onlineStatus) }}></span>
                    <span style={{ fontSize: 14, color: '#666' }}>在线状态</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: getOnlineStatusColor(selectedDevice.onlineStatus) }}>{selectedDevice.onlineStatus}</div>
                </div>
                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: getRunStatusColor(selectedDevice.runStatus) }}></span>
                    <span style={{ fontSize: 14, color: '#666' }}>运行状态</span>
                  </div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: getRunStatusColor(selectedDevice.runStatus) }}>{selectedDevice.runStatus}</div>
                </div>
                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>开关状态</div>
                  <Tag color={selectedDevice.switchStatus === '开启' ? 'green' : 'default'} style={{ fontSize: 16, padding: '4px 16px' }}>
                    {selectedDevice.switchStatus}
                  </Tag>
                </div>
                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>当前温度</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#1890ff' }}>{selectedDevice.temperature}°C</div>
                </div>
                {selectedDevice.humidity && (
                  <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                    <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>当前湿度</div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: '#1890ff' }}>{selectedDevice.humidity}%</div>
                  </div>
                )}
                {selectedDevice.loadRate !== undefined && (
                  <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                    <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>负载率</div>
                    <div style={{ fontSize: 20, fontWeight: 600, color: '#52C41A' }}>{selectedDevice.loadRate}%</div>
                  </div>
                )}
                <div style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
                  <div style={{ fontSize: 14, color: '#666', marginBottom: 8 }}>累计运行时长</div>
                  <div style={{ fontSize: 20, fontWeight: 600, color: '#1890ff' }}>{selectedDevice.runHours}小时</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <Button icon={<EditOutlined />} onClick={handleEdit}>编辑信息</Button>
              <Button icon={<HistoryOutlined />} onClick={() => setHistoryModalVisible(true)}>查看状态变更历史</Button>
              <Button 
                type="primary" 
                icon={<PoweroffOutlined />} 
                onClick={handleRemoteControl}
                disabled={selectedDevice.onlineStatus === '离线'}
              >
                远程开关
              </Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="远程开关"
        open={remoteControlModalVisible}
        onCancel={() => setRemoteControlModalVisible(false)}
        footer={null}
        width={500}
      >
        {selectedDevice && (
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{selectedDevice.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ color: '#8C8C8C' }}>当前开关状态：</span>
                <Tag color={selectedDevice.switchStatus === '开启' ? 'green' : 'default'}>{selectedDevice.switchStatus}</Tag>
              </div>
            </div>
            
            <Form form={controlForm} layout="vertical">
              <Form.Item label="目标操作" name="targetAction" rules={[{ required: true, message: '请选择目标操作' }]}>
                <Select style={{ width: '100%' }}>
                  <Select.Option value="开启">开启设备</Select.Option>
                  <Select.Option value="关闭">关闭设备</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item label="操作原因" name="reason" rules={[{ required: true, message: '请输入操作原因' }]}>
                <Input.TextArea rows={3} placeholder="请输入操作原因" />
              </Form.Item>
              <Form.Item name="confirm" valuePropName="checked">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Checkbox />
                  <span>我已确认操作，了解可能的影响</span>
                </div>
              </Form.Item>
            </Form>
            
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
              <Button onClick={() => setRemoteControlModalVisible(false)}>取消</Button>
              <Button type="primary" onClick={handleConfirmControl}>确认执行</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="状态变更历史"
        open={historyModalVisible}
        onCancel={() => setHistoryModalVisible(false)}
        footer={null}
        width={800}
      >
        {selectedDevice && (
          <div style={{ padding: 20 }}>
            <div style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 16, fontWeight: 500 }}>{selectedDevice.name}</span>
              <span style={{ color: '#999', marginLeft: 8 }}>- 状态变更历史记录</span>
            </div>
            <Table
              columns={[
                { title: '变更时间', dataIndex: 'time', key: 'time' },
                { title: '变更前状态', dataIndex: 'beforeStatus', key: 'beforeStatus' },
                { title: '变更后状态', dataIndex: 'afterStatus', key: 'afterStatus' },
                { title: '变更类型', dataIndex: 'type', key: 'type' },
                { title: '触发方式', dataIndex: 'trigger', key: 'trigger' },
                { title: '操作人', dataIndex: 'operator', key: 'operator' },
                { title: '备注', dataIndex: 'remark', key: 'remark' },
              ]}
              dataSource={statusHistory}
              rowKey="id"
              pagination={{ pageSize: 10 }}
            />
          </div>
        )}
      </Modal>

      <Modal
        title="编辑设备信息"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={500}
      >
        <div style={{ padding: 20 }}>
          <Form form={editForm} layout="vertical">
            <Form.Item label="设备名称" name="name" rules={[{ required: true, message: '请输入设备名称' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="责任人" name="responsible" rules={[{ required: true, message: '请输入责任人' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="联系电话" name="contact" rules={[{ required: true, message: '请输入联系电话' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="安装位置" name="location" rules={[{ required: true, message: '请选择安装位置' }]}>
              <Select>
                {locations.map(l => (
                  <Select.Option key={l} value={l}>{l}</Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 20 }}>
            <Button onClick={() => setEditModalVisible(false)}>取消</Button>
            <Button type="primary" onClick={handleSaveEdit}>保存</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
