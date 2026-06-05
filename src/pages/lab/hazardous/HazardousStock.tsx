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
  InboxOutlined,
  FileTextOutlined,
  DownOutlined,
  UpOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined
} from '@ant-design/icons'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker

interface Signer {
  id: string
  name: string
  signatureImage: string
  department: string
}

const availableSigners: Signer[] = [
  { id: '1', name: '张三', signatureImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjBmMCIvPjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSIjMzMzIj5cdTAwYWRcdTAwYTRcdTAwYWVcdTAwYTI8L3RleHQ+PC9zdmc+', department: '化学实验室' },
  { id: '2', name: '李四', signatureImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjBmMCIvPjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSIjMzMzIj5cdTAwYjNcdTAwYWVcdTAwYjNcdTAwYWU8L3RleHQ+PC9zdmc+', department: '生物实验室' },
  { id: '3', name: '王五', signatureImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjBmMCIvPjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSIjMzMzIj5cdTAwYzVcdTAwYjNcdTAwYzVcdTAwYjM8L3RleHQ+PC9zdmc+', department: '物理实验室' },
  { id: '4', name: '赵六', signatureImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjBmMCIvPjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSIjMzMzIj5cdTAwZDZcdTAwYzVcdTAwZDZcdTAwYzU8L3RleHQ+PC9zdmc+', department: '化学实验室' },
  { id: '5', name: '钱七', signatureImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y4ZjBmMCIvPjx0ZXh0IHg9IjUwIiB5PSI2MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjM2IiBmaWxsPSIjMzMzIj5cdTAwZTVcdTAwZDZcdTAwZTVcdTAwZDY8L3RleHQ+PC9zdmc+', department: '仪器室' }
]

interface StockRecord {
  id: string
  chemicalName: string
  casNumber: string
  hazardLevel: string
  batchNo: string
  currentStock: number
  unit: string
  storageLocation: string
  expiryDate: string
  stockStatus: '正常' | '低库存' | '已过期' | '即将过期'
}

const chemicals = [
  { name: '丙酮', cas: '67-64-1', hazard: '易燃', unit: 'L' },
  { name: '浓硫酸', cas: '7664-93-9', hazard: '腐蚀性', unit: 'L' },
  { name: '硝酸钾', cas: '7757-79-1', hazard: '氧化性', unit: 'kg' },
  { name: '甲醇', cas: '67-56-1', hazard: '易燃', unit: 'L' },
  { name: '乙醇', cas: '64-17-5', hazard: '易燃', unit: 'L' },
  { name: '氢氧化钠', cas: '1310-73-2', hazard: '腐蚀性', unit: 'kg' },
  { name: '盐酸', cas: '7647-01-0', hazard: '腐蚀性', unit: 'L' },
  { name: '过氧化氢', cas: '7722-84-1', hazard: '氧化性', unit: 'L' },
  { name: '甲苯', cas: '108-88-3', hazard: '易燃', unit: 'L' },
  { name: '乙醚', cas: '60-29-7', hazard: '易燃', unit: 'L' },
  { name: '高锰酸钾', cas: '7722-64-7', hazard: '氧化性', unit: 'kg' },
  { name: '氨水', cas: '1336-21-6', hazard: '腐蚀性', unit: 'L' },
  { name: '甲醛', cas: '50-00-0', hazard: '易燃', unit: 'L' },
  { name: '氯仿', cas: '67-66-3', hazard: '剧毒', unit: 'L' },
  { name: '四氢呋喃', cas: '109-99-9', hazard: '易燃', unit: 'L' },
  { name: '乙酸乙酯', cas: '141-78-6', hazard: '易燃', unit: 'L' },
  { name: '正己烷', cas: '110-54-3', hazard: '易燃', unit: 'L' },
  { name: '三氯甲烷', cas: '67-66-3', hazard: '剧毒', unit: 'L' },
  { name: '硝酸', cas: '7697-37-2', hazard: '腐蚀性', unit: 'L' },
  { name: '硫酸亚铁', cas: '7720-78-7', hazard: '氧化性', unit: 'kg' }
]

const generateMockData = (): StockRecord[] => {
  const statuses: ('正常' | '低库存' | '已过期' | '即将过期')[] = ['正常', '低库存', '已过期', '即将过期']
  const locations = ['危化品柜A01', '危化品柜A02', '危化品柜B01', '危化品柜B02', '危化品柜C01', '危化品柜C02']
  
  return Array.from({ length: 100 }, (_, i) => {
    const chemical = chemicals[i % chemicals.length]
    const month = 1 + (i % 12)
    const day = 10 + (i % 15)
    const year = 2024 + Math.floor(Math.random() * 2)
    const currentStock = Math.floor(Math.random() * 150) + 1
    const status = statuses[i % statuses.length]
    
    return {
      id: `${i + 1}`,
      chemicalName: chemical.name,
      casNumber: chemical.cas,
      hazardLevel: chemical.hazard,
      batchNo: `B${year}${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`,
      currentStock,
      unit: chemical.unit,
      storageLocation: locations[i % locations.length],
      expiryDate: `${year}-${String(month).padStart(2, '0')}-${String(Math.min(day + 30, 28)).padStart(2, '0')}`,
      stockStatus: status
    }
  })
}

const mockData: StockRecord[] = generateMockData()

const hazardLevelOptions = ['易燃', '易爆', '剧毒', '腐蚀性', '氧化性', '全部']
const stockStatusOptions = ['正常', '低库存', '已过期', '即将过期', '全部']
const storageLocations = ['危化品柜A01', '危化品柜A02', '危化品柜B01', '危化品柜B02', '危化品柜C01', '危化品柜C02', '全部']
const unitOptions = ['kg', 'L', '瓶', 'g', 'mL']

const statusColorMap: Record<string, string> = {
  '正常': 'green',
  '低库存': 'orange',
  '已过期': 'red',
  '即将过期': 'gold'
}

export default function HazardousStock() {
  const { isDark } = useThemeStore()
  const [data, setData] = useState<StockRecord[]>(mockData)
  const [adjustVisible, setAdjustVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<StockRecord | null>(null)
  const [adjustForm] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [expanded, setExpanded] = useState(false)
  const [selectedFirstSigner, setSelectedFirstSigner] = useState<Signer | null>(null)
  const [selectedSecondSigner, setSelectedSecondSigner] = useState<Signer | null>(null)
  const [inventoryVisible, setInventoryVisible] = useState(false)
  const [inventoryResult, setInventoryResult] = useState<any[]>([])

  const handleAdjustSubmit = () => {
    adjustForm.validateFields().then(values => {
      if (!currentRecord) return
      
      const { adjustType, adjustQuantity, reason, firstSignerId, secondSignerId } = values
      const firstSigner = availableSigners.find(s => s.id === firstSignerId)
      const secondSigner = availableSigners.find(s => s.id === secondSignerId)
      
      if (!firstSigner || !secondSigner) {
        message.error('请选择完整的签字人信息')
        return
      }
      
      let newStock: number
      if (adjustType === '增加') {
        newStock = currentRecord.currentStock + adjustQuantity
      } else {
        if (adjustQuantity > currentRecord.currentStock) {
          message.error('减少数量不能超过当前库存')
          return
        }
        newStock = currentRecord.currentStock - adjustQuantity
      }

      let newStatus = '正常'
      if (newStock < 10) {
        newStatus = '低库存'
      } else {
        const expiryDate = new Date(currentRecord.expiryDate)
        const today = new Date()
        const daysDiff = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff < 0) {
          newStatus = '已过期'
        } else if (daysDiff < 30) {
          newStatus = '即将过期'
        }
      }

      const updatedData = data.map(item => {
        if (item.id === currentRecord.id) {
          return {
            ...item,
            currentStock: newStock,
            stockStatus: newStatus as any,
            adjustHistory: [
              ...(item.adjustHistory || []),
              {
                id: `${Date.now()}`,
                adjustType,
                adjustQuantity,
                reason,
                adjustDate: new Date().toISOString().split('T')[0],
                firstSigner: firstSigner.name,
                secondSigner: secondSigner.name
              }
            ]
          }
        }
        return item
      })
      
      setData(updatedData)
      setAdjustVisible(false)
      setCurrentRecord(null)
      adjustForm.resetFields()
      setSelectedFirstSigner(null)
      setSelectedSecondSigner(null)
      message.success('库存调整成功')
    }).catch(err => {
      message.error('表单验证失败')
    })
  }

  const handleExport = () => {
    const exportData = data.map(item => ({
      '物料编号': `MAT-${item.id.padStart(4, '0')}`,
      '危化品名称': item.chemicalName,
      'CAS号': item.casNumber,
      '危险等级': item.hazardLevel,
      '批次号': item.batchNo,
      '当前库存': `${item.currentStock} ${item.unit}`,
      '存放位置': item.storageLocation,
      '有效期': item.expiryDate,
      '库存状态': item.stockStatus
    }))
    
    const headers = ['物料编号', '危化品名称', 'CAS号', '危险等级', '批次号', '当前库存', '存放位置', '有效期', '库存状态']
    const csvContent = [headers.join(','), ...exportData.map(row => headers.map(h => row[h]).join(','))].join('\n')
    
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `库存清单_${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    message.success('库存清单导出成功')
  }

  const handleInventory = () => {
    Modal.confirm({
      title: '库存盘点',
      content: '确定要进行库存盘点吗？盘点将比对系统库存与实际库存。',
      onOk: () => {
        const inventoryResult = data.map(item => {
          const actualStock = Math.floor(item.currentStock * (0.95 + Math.random() * 0.1))
          const discrepancy = item.currentStock - actualStock
          return {
            ...item,
            actualStock,
            discrepancy,
            status: discrepancy === 0 ? '相符' : discrepancy > 0 ? '盘亏' : '盘盈'
          }
        })
        
        const discrepancies = inventoryResult.filter(item => item.discrepancy !== 0)
        
        if (discrepancies.length === 0) {
          message.success('库存盘点完成，所有库存均相符')
        } else {
          message.warning(`库存盘点完成，发现 ${discrepancies.length} 项库存不符，请及时调整`)
        }
        
        setInventoryResult(inventoryResult)
        setInventoryVisible(true)
      }
    })
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
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo' },
    { title: '当前库存', dataIndex: 'currentStock', key: 'currentStock', render: (stock: number, record: StockRecord) => `${stock} ${record.unit}` },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '存放位置', dataIndex: 'storageLocation', key: 'storageLocation' },
    { title: '有效期', dataIndex: 'expiryDate', key: 'expiryDate' },
    { title: '库存状态', dataIndex: 'stockStatus', key: 'stockStatus', render: (status: string) => {
      const colorMap: Record<string, string> = {
        '正常': 'green',
        '低库存': 'orange',
        '已过期': 'red',
        '即将过期': 'gold'
      }
      return <Tag color={colorMap[status] || 'gray'}>{status}</Tag>
    }},
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 200, render: (_: any, record: StockRecord) => (
      <Space size="small">
        <Button type="text" icon={<EyeOutlined />} onClick={() => { setCurrentRecord(record); setDetailVisible(true) }}>查看详情</Button>
        <Button type="text" icon={<EditOutlined />} onClick={() => { setCurrentRecord(record); setAdjustVisible(true) }}>调整库存</Button>
      </Space>
    )},
  ]

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>库存查询</h1>

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
                  <Form.Item label="存放位置" name="storageLocation">
                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                      <Option value="">全部</Option>
                      {storageLocations.filter(l => l !== '全部').map(loc => (
                        <Option key={loc} value={loc}>{loc}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="库存状态" name="stockStatus">
                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                      <Option value="">全部</Option>
                      {stockStatusOptions.filter(s => s !== '全部').map(status => (
                        <Option key={status} value={status}>{status}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
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
                <Col span={6}>
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
                <Form.Item label="存放位置" name="storageLocation">
                  <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                    <Option value="">全部</Option>
                    {storageLocations.filter(l => l !== '全部').map(loc => (
                      <Option key={loc} value={loc}>{loc}</Option>
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
          <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>导出库存清单</Button>
          <Button type="primary" icon={<InboxOutlined />} onClick={handleInventory} style={{ marginLeft: 8 }}>库存盘点</Button>
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

      {/* 详情弹窗 */}
      <Modal
        title="库存详情"
        visible={detailVisible}
        onCancel={() => { setDetailVisible(false); setCurrentRecord(null) }}
        footer={[
          <Button key="back" onClick={() => { setDetailVisible(false); setCurrentRecord(null) }}>关闭</Button>,
        ]}
        width={600}
      >
        {currentRecord && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <p><strong>物料编号：</strong>{`MAT-${currentRecord.id.padStart(4, '0')}`}</p>
                <p><strong>危化品名称：</strong>{currentRecord.chemicalName}</p>
                <p><strong>CAS号：</strong>{currentRecord.casNumber}</p>
                <p><strong>危险等级：</strong><Tag color={{
                  '剧毒': 'red',
                  '腐蚀性': 'orange',
                  '易燃': 'yellow',
                  '易爆': 'purple',
                  '氧化性': 'blue'
                }[currentRecord.hazardLevel] || 'gray'}>{currentRecord.hazardLevel}</Tag></p>
              </Col>
              <Col span={12}>
                <p><strong>批次号：</strong>{currentRecord.batchNo}</p>
                <p><strong>当前库存：</strong>{currentRecord.currentStock} {currentRecord.unit}</p>
                <p><strong>存放位置：</strong>{currentRecord.storageLocation}</p>
                <p><strong>有效期：</strong>{currentRecord.expiryDate}</p>
                <p><strong>库存状态：</strong><Tag color={{
                  '正常': 'green',
                  '低库存': 'orange',
                  '已过期': 'red',
                  '即将过期': 'gold'
                }[currentRecord.stockStatus] || 'gray'}>{currentRecord.stockStatus}</Tag></p>
              </Col>
            </Row>
          </div>
        )}
      </Modal>

      {/* 调整库存弹窗 */}
      <Modal
        title="调整库存"
        visible={adjustVisible}
        onCancel={() => { 
          setAdjustVisible(false); 
          setCurrentRecord(null); 
          adjustForm.resetFields();
          setSelectedFirstSigner(null);
          setSelectedSecondSigner(null);
        }}
        footer={[
          <Button key="back" onClick={() => { 
            setAdjustVisible(false); 
            setCurrentRecord(null); 
            adjustForm.resetFields();
            setSelectedFirstSigner(null);
            setSelectedSecondSigner(null);
          }}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleAdjustSubmit}>确认调整</Button>,
        ]}
        width={800}
      >
        {currentRecord && (
          <Form form={adjustForm} layout="vertical" initialValues={{ adjustType: '增加' }}>
            <div style={{ marginBottom: 16, padding: 12, background: isDark ? '#333' : '#F5F5F5' }}>
              <p><strong>危化品名称：</strong>{currentRecord.chemicalName}</p>
              <p><strong>CAS号：</strong>{currentRecord.casNumber}</p>
              <p><strong>当前库存：</strong>{currentRecord.currentStock} {currentRecord.unit}</p>
            </div>

            <Form.Item name="adjustType" label="调整类型" rules={[{ required: true, message: '请选择调整类型' }]}>
              <Select placeholder="请选择调整类型">
                <Option value="增加">增加</Option>
                <Option value="减少">减少</Option>
              </Select>
            </Form.Item>

            <Form.Item name="adjustQuantity" label="调整数量" rules={[{ required: true, type: 'number', min: 0.1, message: '请输入调整数量' }]}>
              <InputNumber style={{ width: '100%' }} placeholder="请输入调整数量" min={0.1} />
            </Form.Item>

            <Form.Item name="reason" label="原因" rules={[{ required: true, message: '请输入原因' }]}>
              <Input.TextArea rows={3} placeholder="请输入原因（如：盘盈、盘亏、领用等）" />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item 
                  label="第一签字人" 
                  name="firstSignerId" 
                  rules={[{ required: true, message: '请选择第一签字人' }]}
                >
                  <Select 
                    placeholder="请选择签字人" 
                    showSearch
                    optionFilterProp="children"
                    onChange={(value) => {
                      const signer = availableSigners.find(s => s.id === value)
                      setSelectedFirstSigner(signer || null)
                    }}
                  >
                    {availableSigners.map(signer => (
                      <Option key={signer.id} value={signer.id}>
                        {signer.name} - {signer.department}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {selectedFirstSigner && (
                  <div style={{ 
                    border: '1px solid #E5E5E5', 
                    borderRadius: 8, 
                    padding: 16, 
                    background: '#FAFAFA',
                    marginTop: 8
                  }}>
                    <div style={{ fontSize: 12, color: '#8C8C8C', marginBottom: 8 }}>签字图片：</div>
                    <img 
                      src={selectedFirstSigner.signatureImage} 
                      alt={`${selectedFirstSigner.name}的签名`}
                      style={{ maxWidth: '100%', height: 60, objectFit: 'contain' }}
                    />
                    <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>{selectedFirstSigner.name}</div>
                  </div>
                )}
              </Col>
              <Col span={12}>
                <Form.Item 
                  label="第二签字人" 
                  name="secondSignerId" 
                  rules={[{ required: true, message: '请选择第二签字人' }]}
                >
                  <Select 
                    placeholder="请选择签字人" 
                    showSearch
                    optionFilterProp="children"
                    onChange={(value) => {
                      const signer = availableSigners.find(s => s.id === value)
                      setSelectedSecondSigner(signer || null)
                    }}
                  >
                    {availableSigners.map(signer => (
                      <Option key={signer.id} value={signer.id}>
                        {signer.name} - {signer.department}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                {selectedSecondSigner && (
                  <div style={{ 
                    border: '1px solid #E5E5E5', 
                    borderRadius: 8, 
                    padding: 16, 
                    background: '#FAFAFA',
                    marginTop: 8
                  }}>
                    <div style={{ fontSize: 12, color: '#8C8C8C', marginBottom: 8 }}>签字图片：</div>
                    <img 
                      src={selectedSecondSigner.signatureImage} 
                      alt={`${selectedSecondSigner.name}的签名`}
                      style={{ maxWidth: '100%', height: 60, objectFit: 'contain' }}
                    />
                    <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>{selectedSecondSigner.name}</div>
                  </div>
                )}
              </Col>
            </Row>
          </Form>
        )}
      </Modal>

      {/* 库存盘点结果弹窗 */}
      <Modal
        title="库存盘点结果"
        visible={inventoryVisible}
        onCancel={() => setInventoryVisible(false)}
        footer={[
          <Button key="back" onClick={() => setInventoryVisible(false)}>关闭</Button>,
        ]}
        width={1000}
      >
        <Table
          dataSource={inventoryResult}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          scroll={{ x: 'max-content' }}
          columns={[
            { title: '物料编号', dataIndex: 'id', key: 'id', render: (id: string) => `MAT-${id.padStart(4, '0')}` },
            { title: '危化品名称', dataIndex: 'chemicalName', key: 'chemicalName' },
            { title: '系统库存', dataIndex: 'currentStock', key: 'currentStock', render: (stock: number, record: any) => `${stock} ${record.unit}` },
            { title: '实际库存', dataIndex: 'actualStock', key: 'actualStock', render: (stock: number, record: any) => `${stock} ${record.unit}` },
            { title: '差异', dataIndex: 'discrepancy', key: 'discrepancy', render: (val: number) => (
              <span style={{ color: val > 0 ? 'red' : val < 0 ? 'green' : 'black' }}>
                {val > 0 ? `-` : val < 0 ? `+` : ''}{Math.abs(val)}
              </span>
            )},
            { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => {
              const colorMap: Record<string, string> = {
                '相符': 'green',
                '盘亏': 'red',
                '盘盈': 'orange'
              }
              return <Tag color={colorMap[status] || 'gray'}>{status}</Tag>
            }},
            { title: '操作', key: 'action', render: (_: any, record: any) => (
              record.discrepancy !== 0 && (
                <Button type="text" onClick={() => {
                  setCurrentRecord(record)
                  setInventoryVisible(false)
                  setAdjustVisible(true)
                }}>调整库存</Button>
              )
            )}
          ]}
        />
      </Modal>
    </div>
  )
}