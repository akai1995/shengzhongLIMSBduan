import { useState, useEffect } from 'react'
import { Card, Row, Col, Switch, Tabs, Select, Modal, Descriptions, Form, Input, Button, DatePicker, message } from 'antd'
import { SearchOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { TabPane } = Tabs
const { RangePicker } = DatePicker

export default function EquipmentMonitor() {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm()
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [activeTab, setActiveTab] = useState('list')
  const [selectedEquipment, setSelectedEquipment] = useState<string | null>(null)
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false)
  const [selectedDetailEquipment, setSelectedDetailEquipment] = useState<any>(null)
  const [expanded, setExpanded] = useState(false)

  const equipmentData = Array.from({ length: 8 }, (_, i) => {
    const statuses = ['在线', '运行', '故障', '离线', '在线', '运行', '在线', '离线']
    const names = ['离心机', 'PCR仪', '流式细胞仪', '显微镜', '分光光度计', '高压灭菌锅', 'CO2培养箱', '超低温冰箱']
    const temps = [35, 40, null, null, 32, 95, 37, -20]
    return {
      key: String(i + 1),
      id: `EQ-${String(i + 1).padStart(4, '0')}`,
      name: names[i],
      status: statuses[i],
      lastUpdate: '2024-04-15 10:' + String(20 + i).padStart(2, '0'),
      temperature: temps[i],
      runHours: 1200 + (i * 50),
      lastFault: i === 2 ? '2024-04-10 14:30' : null,
    }
  })

  const statusColors: Record<string, string> = {
    '在线': '#52c41a',
    '运行': '#1890ff',
    '故障': '#ff4d4f',
    '离线': '#bfbfbf'
  }

  const statusBgColors: Record<string, string> = {
    '在线': '#f6ffed',
    '运行': '#e6f7ff',
    '故障': '#fff2f0',
    '离线': '#fafafa'
  }

  const statusBorderColors: Record<string, string> = {
    '在线': '#b7eb8f',
    '运行': '#91d5ff',
    '故障': '#ffa39e',
    '离线': '#d9d9d9'
  }

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (autoRefresh) {
      interval = setInterval(() => {
        console.log('Auto refreshing device status...')
      }, 10000)
    }
    return () => clearInterval(interval)
  }, [autoRefresh])

  const handleSearch = () => {
    const values = form.getFieldsValue()
    message.success('搜索完成')
  }

  const handleReset = () => {
    form.resetFields()
  }

  const handleCardClick = (equipment: any) => {
    setSelectedDetailEquipment(equipment)
    setIsDetailModalVisible(true)
  }

  const handleSelectEquipment = (value: string) => {
    setSelectedEquipment(value)
  }

  const generateStatusHistory = (equipmentId: string) => {
    const statuses = ['在线', '运行', '在线', '运行', '故障', '在线', '运行']
    const now = new Date()
    const history = []
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000)
      const statusIndex = i % statuses.length
      history.push({
        time: time.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' }),
        status: statuses[statusIndex],
        timestamp: time.getTime()
      })
    }
    return history
  }

  const currentEquipment = equipmentData.find(eq => eq.id === selectedEquipment)
  const statusHistory = selectedEquipment ? generateStatusHistory(selectedEquipment) : []

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>设备状态监控</h1>

      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={form} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16} style={{ height: '32px' }}>
            <Col span={6}>
              <Form.Item label="设备名称" name="name"><Input placeholder="请输入设备名称" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="设备状态" name="status">
                <Select placeholder="请选择状态">
                  <Option value="all">全部</Option>
                  <Option value="online">在线</Option>
                  <Option value="running">运行</Option>
                  <Option value="fault">故障</Option>
                  <Option value="offline">离线</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="设备编号" name="id"><Input placeholder="请输入设备编号" /></Form.Item>
            </Col>
            {expanded && (
              <Col span={6}>
                <Form.Item label="更新时间" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            )}
            {!expanded && (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset} className="reset-btn">重置</Button>
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
            <Row gutter={16} style={{ marginTop: '20px', height: '32px' }}>
              <Col span={6} offset={18}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset} className="reset-btn">重置</Button>
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

      <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 8 }}>
        <span style={{ color: isDark ? '#aaa' : '#666' }}>自动刷新</span>
        <Switch checked={autoRefresh} onChange={setAutoRefresh} />
      </div>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="设备列表" key="list">
            <Row gutter={[16, 16]}>
              {equipmentData.map(equipment => (
                <Col xs={24} sm={12} md={8} lg={6} key={equipment.key}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: 8,
                      backgroundColor: statusBgColors[equipment.status],
                      borderColor: statusBorderColors[equipment.status],
                      borderWidth: 2,
                      borderStyle: 'solid'
                    }}
                    onClick={() => handleCardClick(equipment)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                      <div style={{ fontSize: 16, fontWeight: 600 }}>{equipment.name}</div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <div
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: '50%',
                            backgroundColor: statusColors[equipment.status],
                            boxShadow: `0 0 8px ${statusColors[equipment.status]}`
                          }}
                        />
                        <span style={{ fontSize: 12, color: statusColors[equipment.status] }}>{equipment.status}</span>
                      </div>
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      最后更新：{equipment.lastUpdate}
                    </div>
                    {equipment.temperature !== null && (
                      <div style={{ marginTop: 8, fontSize: 14, color: '#666' }}>
                        温度：{equipment.temperature}°C
                      </div>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          </TabPane>
          
          <TabPane tab="状态图表" key="chart">
            <div style={{ marginBottom: 20 }}>
              <Select
                placeholder="选择设备"
                style={{ width: 300 }}
                allowClear
                onChange={handleSelectEquipment}
                value={selectedEquipment}
              >
                {equipmentData.map(equipment => (
                  <Option key={equipment.id} value={equipment.id}>{equipment.name}</Option>
                ))}
              </Select>
            </div>
            
            {selectedEquipment && currentEquipment ? (
              <div>
                <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#f5f5f5', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: statusColors[currentEquipment.status],
                        boxShadow: `0 0 12px ${statusColors[currentEquipment.status]}`
                      }}
                    />
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 16 }}>{currentEquipment.name}</div>
                      <div style={{ color: '#666', fontSize: 14 }}>当前状态：<span style={{ color: statusColors[currentEquipment.status] }}>{currentEquipment.status}</span></div>
                    </div>
                  </div>
                </div>
                
                <div style={{ height: 300, border: '1px solid #e8e8e8', borderRadius: 8, padding: 20 }}>
                  <div style={{ marginBottom: 16, fontWeight: 500 }}>最近24小时状态变更时间线</div>
                  <div style={{ display: 'flex', alignItems: 'flex-end', height: 'calc(100% - 32px)', gap: 8 }}>
                    {statusHistory.map((item, index) => (
                      <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div
                          style={{
                            width: '100%',
                            height: 24,
                            backgroundColor: statusBgColors[item.status],
                            border: `1px solid ${statusBorderColors[item.status]}`,
                            borderRadius: 4,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            color: statusColors[item.status],
                            marginBottom: 8
                          }}
                          title={item.status}
                        >
                          <div
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: '50%',
                              backgroundColor: statusColors[item.status],
                              marginRight: 4
                            }}
                          />
                          {item.status}
                        </div>
                        <div style={{ fontSize: 10, color: '#999', writingMode: 'vertical-rl' }}>{item.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #d9d9d9', borderRadius: 8 }}>
                <div style={{ textAlign: 'center', color: '#999' }}>
                  <div style={{ fontSize: 48, marginBottom: 16 }}>📈</div>
                  <p>请选择设备查看状态图表</p>
                  <p style={{ fontSize: 12 }}>显示最近24小时状态变更时间线</p>
                </div>
              </div>
            )}
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title="设备详情"
        open={isDetailModalVisible}
        onCancel={() => setIsDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedDetailEquipment && (
          <div>
            <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>{selectedDetailEquipment.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div
                  style={{
                    width: 12,
                    height: 12,
                    borderRadius: '50%',
                    backgroundColor: statusColors[selectedDetailEquipment.status],
                    boxShadow: `0 0 10px ${statusColors[selectedDetailEquipment.status]}`
                  }}
                />
                <span style={{ color: statusColors[selectedDetailEquipment.status], fontWeight: 500 }}>{selectedDetailEquipment.status}</span>
              </div>
            </div>
            
            <Descriptions column={1} bordered>
              <Descriptions.Item label="设备ID">{selectedDetailEquipment.id}</Descriptions.Item>
              <Descriptions.Item label="最后更新">{selectedDetailEquipment.lastUpdate}</Descriptions.Item>
              <Descriptions.Item label="运行时长">{selectedDetailEquipment.runHours} 小时</Descriptions.Item>
              {selectedDetailEquipment.temperature !== null && (
                <Descriptions.Item label="当前温度">{selectedDetailEquipment.temperature}°C</Descriptions.Item>
              )}
              <Descriptions.Item label="最近故障">
                {selectedDetailEquipment.lastFault || '无'}
              </Descriptions.Item>
            </Descriptions>

            <div style={{ marginTop: 20, padding: '16px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
              <h4 style={{ marginBottom: 12 }}>最近故障记录</h4>
              {selectedDetailEquipment.lastFault ? (
                <div>
                  <p style={{ marginBottom: 4 }}>故障时间：{selectedDetailEquipment.lastFault}</p>
                  <p>故障描述：设备校准失败</p>
                </div>
              ) : (
                <p style={{ color: '#999', margin: 0 }}>该设备暂无故障记录</p>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
