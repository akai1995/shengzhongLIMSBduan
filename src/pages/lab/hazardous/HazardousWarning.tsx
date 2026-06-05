import { useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Card,
  Row,
  Col,
  InputNumber,
  DatePicker,
  Tag
} from 'antd'
import {
  PlusOutlined,
  ExportOutlined,
  SettingOutlined,
  FileTextOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker

interface WarningRecord {
  id: string
  chemicalName: string
  casNumber: string
  hazardLevel: string
  currentStock: number
  unit: string
  threshold: number
  stockShortage: number
  recommendedPurchase: number
  expiryDate: string
  daysRemaining: number
  lastPurchaseDate: string
  warningType: '低库存' | '即将过期' | '已过期'
}

const chemicals = [
  { name: '浓硫酸', cas: '7664-93-9', level: '腐蚀性', unit: 'L' },
  { name: '浓盐酸', cas: '7647-01-0', level: '腐蚀性', unit: 'L' },
  { name: '浓硝酸', cas: '7697-37-2', level: '腐蚀性', unit: 'L' },
  { name: '氢氧化钠', cas: '1310-73-2', level: '腐蚀性', unit: 'kg' },
  { name: '氢氧化钾', cas: '1310-58-3', level: '腐蚀性', unit: 'kg' },
  { name: '乙醇', cas: '64-17-5', level: '易燃', unit: 'L' },
  { name: '甲醇', cas: '67-56-1', level: '易燃', unit: 'L' },
  { name: '丙酮', cas: '67-64-1', level: '易燃', unit: 'L' },
  { name: '乙醚', cas: '60-29-7', level: '易燃', unit: 'L' },
  { name: '甲苯', cas: '108-88-3', level: '易燃', unit: 'L' },
  { name: '乙酸乙酯', cas: '141-78-6', level: '易燃', unit: 'L' },
  { name: '正己烷', cas: '110-54-3', level: '易燃', unit: 'L' },
  { name: '硝酸钾', cas: '7757-79-1', level: '氧化性', unit: 'kg' },
  { name: '高锰酸钾', cas: '7722-64-7', level: '氧化性', unit: 'kg' },
  { name: '过氧化氢', cas: '7722-84-1', level: '氧化性', unit: 'L' },
  { name: '重铬酸钾', cas: '7778-50-9', level: '氧化性', unit: 'kg' },
  { name: '氰化钾', cas: '151-50-8', level: '剧毒', unit: 'g' },
  { name: '氰化钠', cas: '143-33-9', level: '剧毒', unit: 'g' },
  { name: '砷酸钠', cas: '7778-39-4', level: '剧毒', unit: 'g' },
  { name: '汞', cas: '7439-97-6', level: '剧毒', unit: 'g' },
  { name: '硝酸银', cas: '7761-88-8', level: '氧化性', unit: 'g' },
  { name: '氯化钡', cas: '10361-37-2', level: '剧毒', unit: 'g' },
  { name: '四氯化碳', cas: '56-23-5', level: '腐蚀性', unit: 'L' },
  { name: '三氯甲烷', cas: '67-66-3', level: '腐蚀性', unit: 'L' },
  { name: '二甲苯', cas: '1330-20-7', level: '易燃', unit: 'L' },
  { name: '异丙醇', cas: '67-63-0', level: '易燃', unit: 'L' },
  { name: '乙二醇', cas: '107-21-1', level: '易燃', unit: 'L' },
  { name: '甲醛', cas: '50-00-0', level: '腐蚀性', unit: 'L' },
  { name: '氨水', cas: '1336-21-6', level: '腐蚀性', unit: 'L' },
  { name: '氟化钠', cas: '7681-49-4', level: '剧毒', unit: 'g' },
  { name: '白磷', cas: '7723-14-0', level: '易燃', unit: 'g' },
  { name: '黄磷', cas: '7723-14-0', level: '易燃', unit: 'g' },
  { name: '硫磺', cas: '7704-34-9', level: '易燃', unit: 'kg' },
  { name: '镁粉', cas: '7439-95-4', level: '易燃', unit: 'g' },
  { name: '铝粉', cas: '7429-90-5', level: '易燃', unit: 'g' },
  { name: '过氧化钠', cas: '1313-60-6', level: '氧化性', unit: 'g' },
  { name: '过氧化钡', cas: '1304-29-6', level: '氧化性', unit: 'g' },
  { name: '硝酸铵', cas: '6484-52-2', level: '易爆', unit: 'kg' },
  { name: '氯酸钾', cas: '3811-04-9', level: '易爆', unit: 'kg' },
  { name: '高氯酸钾', cas: '7778-74-7', level: '易爆', unit: 'kg' }
]

function generateMockData(): WarningRecord[] {
  const data: WarningRecord[] = []
  const today = new Date()
  
  for (let i = 1; i <= 100; i++) {
    const chemical = chemicals[i % chemicals.length]
    const threshold = Math.floor(Math.random() * 50) + 10
    const currentStock = Math.floor(Math.random() * 100) + 1
    
    const expiryDays = Math.floor(Math.random() * 730) - 60
    const expiryDate = new Date(today)
    expiryDate.setDate(expiryDate.getDate() + expiryDays)
    
    const lastPurchaseDays = Math.floor(Math.random() * 90) + 1
    const lastPurchaseDate = new Date(today)
    lastPurchaseDate.setDate(lastPurchaseDate.getDate() - lastPurchaseDays)
    
    const stockShortage = currentStock < threshold ? threshold - currentStock : 0
    const recommendedPurchase = stockShortage > 0 ? stockShortage + Math.floor(Math.random() * 20) : 0
    
    let warningType = '正常'
    if (expiryDays < 0) {
      warningType = '已过期'
    } else if (expiryDays < 30) {
      warningType = '即将过期'
    } else if (currentStock < threshold) {
      warningType = '低库存'
    }
    
    data.push({
      id: String(i),
      chemicalName: chemical.name,
      casNumber: chemical.cas,
      hazardLevel: chemical.level,
      currentStock,
      unit: chemical.unit,
      threshold,
      stockShortage,
      recommendedPurchase,
      expiryDate: expiryDate.toISOString().split('T')[0],
      daysRemaining: expiryDays,
      lastPurchaseDate: lastPurchaseDate.toISOString().split('T')[0],
      warningType
    })
  }
  
  return data
}

const mockData: WarningRecord[] = generateMockData()

const hazardLevelOptions = ['易燃', '易爆', '剧毒', '腐蚀性', '氧化性', '全部']
const warningTypeOptions = ['全部', '低库存', '即将过期', '已过期']

const warningTypeColorMap: Record<string, string> = {
  '低库存': 'orange',
  '即将过期': 'gold',
  '已过期': 'red'
}

export default function HazardousWarning() {
  const { isDark } = useThemeStore()
  const [data, setData] = useState<WarningRecord[]>(mockData)
  const [settingVisible, setSettingVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<WarningRecord | null>(null)
  const [settingForm] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [expanded, setExpanded] = useState(false)

  const handleSettingSubmit = () => {
    settingForm.validateFields().then(values => {
      if (!currentRecord) return
      
      const updatedData = data.map(item => {
        if (item.id === currentRecord.id) {
          return {
            ...item,
            threshold: values.threshold,
            stockShortage: values.threshold > item.currentStock ? values.threshold - item.currentStock : 0,
            recommendedPurchase: values.threshold > item.currentStock ? values.threshold * 1.5 : 0
          }
        }
        return item
      })
      
      setData(updatedData)
      setSettingVisible(false)
      setCurrentRecord(null)
      settingForm.resetFields()
      message.success('阈值设置成功')
    }).catch(err => {
      message.error('表单验证失败')
    })
  }

  const handleQuickPurchase = (record: WarningRecord) => {
    Modal.confirm({
      title: '一键生成采购申请',
      content: `确定为${record.chemicalName}生成采购申请吗？建议采购${record.recommendedPurchase}${record.unit}。`,
      onOk: () => {
        message.success('采购申请已生成')
      }
    })
  }

  const handleExport = () => {
    message.success('正在导出预警记录...')
  }

  const columns = [
    { title: '物料编号', dataIndex: 'id', key: 'id', render: (id: string) => `MAT-${id.padStart(4, '0')}` },
    { title: '危化品名称', dataIndex: 'chemicalName', key: 'chemicalName' },
    { title: 'CAS号', dataIndex: 'casNumber', key: 'casNumber' },
    { title: '危险等级', dataIndex: 'hazardLevel', key: 'hazardLevel', render: (level: string) => {
      const colorMap: Record<string, string> = {
        '剧毒': 'red',
        '腐蚀性': 'orange',
        '易燃': 'yellow',
        '易爆': 'purple',
        '氧化性': 'blue'
      }
      return <Tag color={colorMap[level] || 'gray'}>{level}</Tag>
    }},
    { title: '当前库存', dataIndex: 'currentStock', key: 'currentStock', render: (stock: number, record: WarningRecord) => `${stock} ${record.unit}` },
    { title: '阈值下限', dataIndex: 'threshold', key: 'threshold', render: (threshold: number, record: WarningRecord) => `${threshold} ${record.unit}` },
    { title: '缺货数量', dataIndex: 'stockShortage', key: 'stockShortage', render: (shortage: number, record: WarningRecord) => shortage > 0 ? `${shortage} ${record.unit}` : '-' },
    { title: '建议采购量', dataIndex: 'recommendedPurchase', key: 'recommendedPurchase', render: (purchase: number, record: WarningRecord) => purchase > 0 ? `${purchase} ${record.unit}` : '-' },
    { title: '有效期', dataIndex: 'expiryDate', key: 'expiryDate' },
    { title: '剩余天数', dataIndex: 'daysRemaining', key: 'daysRemaining', render: (days: number) => (
      <span style={{ color: days < 0 ? 'red' : days < 30 ? 'gold' : 'green' }}>
        {days < 0 ? `已过期${-days}天` : `${days}天`}
      </span>
    )},
    { title: '最后采购日期', dataIndex: 'lastPurchaseDate', key: 'lastPurchaseDate' },
    { title: '预警类型', dataIndex: 'warningType', key: 'warningType', render: (type: string) => {
      const colorMap: Record<string, string> = {
        '低库存': 'orange',
        '即将过期': 'gold',
        '已过期': 'red'
      }
      return <Tag color={colorMap[type] || 'gray'}>{type}</Tag>
    }},
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 220, render: (_: any, record: WarningRecord) => (
      <Space size="small">
        <Button type="text" icon={<SettingOutlined />} onClick={() => { setCurrentRecord(record); setSettingVisible(true) }}>阈值设置</Button>
        {record.warningType === '低库存' && (
          <Button type="text" icon={<PlusOutlined />} onClick={() => handleQuickPurchase(record)}>一键采购</Button>
        )}
      </Space>
    )},
  ]

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>库存预警</h1>

      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} styles={{ body: { padding: 20 } }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="物料编号" name="id"><Input placeholder="请输入物料编号" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="危化品名称" name="chemicalName"><Input placeholder="请输入危化品名称" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="预警类型" name="warningType">
                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                      <Option value="">全部</Option>
                      {warningTypeOptions.filter(t => t !== '全部').map(type => (
                        <Option key={type} value={type}>{type}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="危险等级" name="hazardLevel">
                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                      <Option value="">全部</Option>
                      {hazardLevelOptions.filter(h => h !== '全部').map(level => (
                        <Option key={level} value={level}>{level}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
                <Col span={12}>
                  <Form.Item label="有效期" name="expiryDateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary">查询</Button>
                  <Button onClick={() => searchForm.resetFields()} className="reset-btn">重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={16} style={{ height: 32 }}>
              <Col span={6}>
                <Form.Item label="物料编号" name="id"><Input placeholder="请输入物料编号" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="危化品名称" name="chemicalName"><Input placeholder="请输入危化品名称" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="预警类型" name="warningType">
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    <Option value="">全部</Option>
                    {warningTypeOptions.filter(t => t !== '全部').map(type => (
                      <Option key={type} value={type}>{type}</Option>
                    ))}
                  </Select>
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

      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', overflowX: 'auto' }} styles={{ body: { padding: 20 } }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>导出预警记录</Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 'max-content' }}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => {}
          }}
        />
      </Card>

      {/* 阈值设置弹窗 */}
      <Modal
        title="阈值设置"
        visible={settingVisible}
        onCancel={() => { setSettingVisible(false); setCurrentRecord(null); settingForm.resetFields() }}
        footer={null}
        width={500}
      >
        {currentRecord && (
          <Form form={settingForm} layout="vertical" initialValues={{ threshold: currentRecord.threshold }}>
            <div style={{ marginBottom: 16, padding: 12, background: isDark ? '#333' : '#F5F5F5' }}>
              <p><strong>危化品名称：</strong>{currentRecord.chemicalName}</p>
              <p><strong>CAS号：</strong>{currentRecord.casNumber}</p>
              <p><strong>当前库存：</strong>{currentRecord.currentStock} {currentRecord.unit}</p>
              <p><strong>当前阈值：</strong>{currentRecord.threshold} {currentRecord.unit}</p>
            </div>

            <Form.Item name="threshold" label="阈值下限" rules={[{ required: true, type: 'number', min: 0.1, message: '请输入阈值下限' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="请输入阈值下限" min={0.1} />
            </Form.Item>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 24 }}>
              <Button onClick={() => { setSettingVisible(false); setCurrentRecord(null); settingForm.resetFields() }}>取消</Button>
              <Button type="primary" onClick={handleSettingSubmit}>保存</Button>
            </div>
          </Form>
        )}
      </Modal>
    </div>
  )
}