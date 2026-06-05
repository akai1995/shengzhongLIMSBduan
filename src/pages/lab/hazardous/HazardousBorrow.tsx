import { useState } from 'react'
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Space,
  Card,
  Row,
  Col,
  Tag,
  InputNumber
} from 'antd'
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  DownOutlined,
  UpOutlined,
  UndoOutlined
} from '@ant-design/icons'
import { useThemeStore } from '../../../store/themeStore'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

interface BorrowRecord {
  id: string
  recordNo: string
  borrower: string
  chemicalName: string
  specification: string
  borrowQuantity: number
  unit: string
  borrowDate: string
  expectedReturnDate: string
  actualReturnDate?: string
  verificationStatus: '待核销' | '已核销' | '部分归还'
  firstSigner: string
  secondSigner: string
}

interface ChemicalStock {
  id: string
  chemicalName: string
  specification: string
  casNumber: string
  currentStock: number
  unit: string
}

const mockStock: ChemicalStock[] = [
  { id: '1', chemicalName: '丙酮', specification: 'AR, 500mL', casNumber: '67-64-1', currentStock: 50, unit: 'L' },
  { id: '2', chemicalName: '浓硫酸', specification: 'GR, 2.5L', casNumber: '7664-93-9', currentStock: 30, unit: 'L' },
  { id: '3', chemicalName: '硝酸钾', specification: 'AR, 500g', casNumber: '7757-79-1', currentStock: 100, unit: 'kg' },
  { id: '4', chemicalName: '乙醇', specification: 'AR, 500mL', casNumber: '64-17-5', currentStock: 80, unit: 'L' }
]

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

const generateMockData = (): BorrowRecord[] => {
  const borrowers = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
  const chemicals = [
    { name: '丙酮', spec: 'AR, 500mL', unit: 'L' },
    { name: '浓硫酸', spec: 'GR, 2.5L', unit: 'L' },
    { name: '硝酸钾', spec: 'AR, 500g', unit: 'kg' },
    { name: '乙醇', spec: 'AR, 500mL', unit: 'L' },
    { name: '甲醇', spec: 'AR, 500mL', unit: 'L' },
    { name: '氢氧化钠', spec: 'AR, 500g', unit: 'kg' }
  ]
  const statuses: ('待核销' | '已核销' | '部分归还')[] = ['待核销', '已核销', '部分归还']

  return Array.from({ length: 50 }, (_, i) => {
    const chemical = chemicals[i % chemicals.length]
    const status = statuses[i % statuses.length]
    const month = 1 + (i % 12)
    const day = 10 + (i % 15)
    
    return {
      id: `${i + 1}`,
      recordNo: `LY-2024-${String(i + 1).padStart(3, '0')}`,
      borrower: borrowers[i % borrowers.length],
      chemicalName: chemical.name,
      specification: chemical.spec,
      borrowQuantity: Math.floor(Math.random() * 20) + 1,
      unit: chemical.unit,
      borrowDate: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
      expectedReturnDate: `2024-${String(month).padStart(2, '0')}-${String(Math.min(day + 10, 28)).padStart(2, '0')}`,
      actualReturnDate: status !== '待核销' ? `2024-${String(month).padStart(2, '0')}-${String(Math.min(day + 8, 28)).padStart(2, '0')}` : undefined,
      verificationStatus: status,
      firstSigner: borrowers[i % borrowers.length],
      secondSigner: borrowers[(i + 1) % borrowers.length]
    }
  })
}

const mockData: BorrowRecord[] = generateMockData()

const statusMap: Record<string, { label: string; color: string }> = {
  '待核销': { label: '待核销', color: 'orange' },
  '已核销': { label: '已核销', color: 'green' },
  '部分归还': { label: '部分归还', color: 'blue' }
}

const unitOptions = ['kg', 'L', '瓶', 'g', 'mL']

export default function HazardousBorrow() {
  const { isDark } = useThemeStore()
  const [data, setData] = useState<BorrowRecord[]>(mockData)
  const [stock] = useState<ChemicalStock[]>(mockStock)
  const [borrowVisible, setBorrowVisible] = useState(false)
  const [returnVisible, setReturnVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<BorrowRecord | null>(null)
  const [borrowForm] = Form.useForm()
  const [returnForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [expanded, setExpanded] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [borrowItems, setBorrowItems] = useState<any[]>([
    { key: 0, chemicalId: '', chemicalName: '', specification: '', quantity: 0, unit: '', stock: 0 }
  ])
  const [selectedFirstSigner, setSelectedFirstSigner] = useState<Signer | null>(null)
  const [selectedSecondSigner, setSelectedSecondSigner] = useState<Signer | null>(null)
  const [returnFirstSigner, setReturnFirstSigner] = useState<Signer | null>(null)
  const [returnSecondSigner, setReturnSecondSigner] = useState<Signer | null>(null)

  const addBorrowItem = () => {
    const newKey = borrowItems.length
    setBorrowItems([...borrowItems, { key: newKey, chemicalId: '', chemicalName: '', specification: '', quantity: 0, unit: '', stock: 0 }])
  }

  const removeBorrowItem = (key: number) => {
    if (borrowItems.length > 1) {
      setBorrowItems(borrowItems.filter(item => item.key !== key))
    }
  }

  const handleBorrowSubmit = () => {
    borrowForm.validateFields().then(values => {
      const firstSignerName = selectedFirstSigner?.name || '待签字'
      const secondSignerName = selectedSecondSigner?.name || '待签字'
      
      let isValid = true
      const errors: string[] = []
      
      borrowItems.forEach((item, index) => {
        const chemicalId = values[`chemical-${item.key}`]
        const quantity = values[`quantity-${item.key}`]
        const chemical = stock.find(s => s.id === chemicalId)
        
        if (!chemical) {
          isValid = false
          errors.push(`第${index + 1}行：请选择危化品`)
          return
        }
        
        if (!quantity || quantity <= 0) {
          isValid = false
          errors.push(`第${index + 1}行：请输入有效的领用数量`)
          return
        }
        
        if (quantity > chemical.currentStock) {
          isValid = false
          errors.push(`第${index + 1}行：${chemical.chemicalName}库存不足，当前库存: ${chemical.currentStock}`)
          return
        }
      })
      
      if (!isValid) {
        message.error(errors.join('\n'))
        return
      }
      
      borrowItems.forEach((item, index) => {
        const chemicalId = values[`chemical-${item.key}`]
        const quantity = values[`quantity-${item.key}`]
        const chemical = stock.find(s => s.id === chemicalId)
        
        if (chemical) {
          const newRecord: BorrowRecord = {
            id: `${Date.now()}-${index}`,
            recordNo: `LY-${new Date().getFullYear()}-${String(data.length + index + 1).padStart(3, '0')}`,
            borrower: values.borrower,
            chemicalName: chemical.chemicalName,
            specification: chemical.specification,
            borrowQuantity: quantity,
            unit: chemical.unit,
            borrowDate: new Date().toISOString().split('T')[0],
            expectedReturnDate: values.expectedReturnDate,
            verificationStatus: '待核销',
            firstSigner: firstSignerName,
            secondSigner: secondSignerName
          }
          setData(prev => [newRecord, ...prev])
        }
      })
      
      setBorrowVisible(false)
      borrowForm.resetFields()
      setBorrowItems([{ key: 0, chemicalId: '', chemicalName: '', specification: '', quantity: 0, unit: '', stock: 0 }])
      setSelectedFirstSigner(null)
      setSelectedSecondSigner(null)
      message.success('领用成功')
    }).catch(err => {
      message.error('表单验证失败')
    })
  }

  const handleReturnSubmit = () => {
    returnForm.validateFields().then(values => {
      const recordId = values.recordId
      const returnQuantity = values.quantity
      const originalRecord = data.find(item => item.id === recordId)
      
      if (!originalRecord) {
        message.error('未找到对应的领用记录')
        return
      }
      
      if (!returnQuantity || returnQuantity <= 0) {
        message.error('请输入有效的归还数量')
        return
      }
      
      if (returnQuantity > originalRecord.borrowQuantity) {
        message.error(`归还数量不能超过领用数量(${originalRecord.borrowQuantity}${originalRecord.unit})`)
        return
      }
      
      let newStatus: '待核销' | '已核销' | '部分归还' = '已核销'
      if (returnQuantity < originalRecord.borrowQuantity) {
        newStatus = '部分归还'
      }
      
      const updatedData = data.map(item => {
        if (item.id === recordId) {
          return {
            ...item,
            actualReturnDate: values.actualReturnDate || new Date().toISOString().split('T')[0],
            verificationStatus: newStatus,
            firstSigner: returnFirstSigner?.name || originalRecord.firstSigner || '待签字',
            secondSigner: returnSecondSigner?.name || originalRecord.secondSigner || '待签字'
          }
        }
        return item
      })
      
      setData(updatedData)
      setReturnVisible(false)
      setCurrentRecord(null)
      returnForm.resetFields()
      setReturnFirstSigner(null)
      setReturnSecondSigner(null)
      message.success('归还成功')
    }).catch(err => {
      message.error('表单验证失败')
    })
  }

  const handleEditSubmit = () => {
    if (!currentRecord) return
    editForm.validateFields().then(values => {
      let isValid = true
      const errors: string[] = []
      
      borrowItems.forEach((item, index) => {
        const chemicalId = values[`chemical-${item.key}`]
        const quantity = values[`quantity-${item.key}`]
        const chemical = stock.find(s => s.id === chemicalId)
        
        if (!chemical) {
          isValid = false
          errors.push(`第${index + 1}行：请选择危化品`)
          return
        }
        
        if (!quantity || quantity <= 0) {
          isValid = false
          errors.push(`第${index + 1}行：请输入有效的领用数量`)
          return
        }
      })
      
      if (!isValid) {
        message.error(errors.join('\n'))
        return
      }
      
      const firstSignerName = selectedFirstSigner?.name || currentRecord.firstSigner || '待签字'
      const secondSignerName = selectedSecondSigner?.name || currentRecord.secondSigner || '待签字'
      
      const updatedData = data.map(item => {
        if (item.id === currentRecord.id) {
          const chemicalId = values[`chemical-0`]
          const quantity = values[`quantity-0`]
          const chemical = stock.find(s => s.id === chemicalId)
          
          return {
            ...item,
            borrower: values.borrower,
            chemicalName: chemical?.chemicalName || item.chemicalName,
            specification: chemical?.specification || item.specification,
            borrowQuantity: quantity,
            unit: chemical?.unit || item.unit,
            expectedReturnDate: values.expectedReturnDate,
            firstSigner: firstSignerName,
            secondSigner: secondSignerName
          }
        }
        return item
      })
      
      setData(updatedData)
      setEditVisible(false)
      setCurrentRecord(null)
      editForm.resetFields()
      setBorrowItems([{ key: 0, chemicalId: '', chemicalName: '', specification: '', quantity: 0, unit: '', stock: 0 }])
      setSelectedFirstSigner(null)
      setSelectedSecondSigner(null)
      message.success('编辑成功')
    }).catch(err => {
      message.error('表单验证失败')
    })
  }

  const handleDelete = (record: BorrowRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定删除领用记录 ${record.recordNo} 吗？`,
      onOk: () => {
        setData(data.filter(item => item.id !== record.id))
        message.success('删除成功')
      }
    })
  }

  const handleAddReturn = () => {
    returnForm.resetFields()
    setReturnVisible(true)
  }

  const columns = [
    { title: '记录编号', dataIndex: 'recordNo', key: 'recordNo', width: 120 },
    { title: '领用人', dataIndex: 'borrower', key: 'borrower', width: 100 },
    { title: '危化品名称', dataIndex: 'chemicalName', key: 'chemicalName' },
    { title: '规格', dataIndex: 'specification', key: 'specification', width: 120 },
    { title: '领用数量', dataIndex: 'borrowQuantity', key: 'borrowQuantity', width: 90, render: (qty: number, record: BorrowRecord) => `${qty} ${record.unit}` },
    { title: '领用日期', dataIndex: 'borrowDate', key: 'borrowDate', width: 100 },
    { title: '预计归还日期', dataIndex: 'expectedReturnDate', key: 'expectedReturnDate', width: 120 },
    { title: '实际归还日期', dataIndex: 'actualReturnDate', key: 'actualReturnDate', width: 120, render: (val: string) => val || '-' },
    {
      title: '核销状态',
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      width: 100,
      render: (status: string) => (
        <Tag color={statusMap[status]?.color}>{statusMap[status]?.label}</Tag>
      )
    },
    { title: '第一签字人', dataIndex: 'firstSigner', key: 'firstSigner', width: 100 },
    { title: '第二签字人', dataIndex: 'secondSigner', key: 'secondSigner', width: 100 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 280,
      render: (_, record: BorrowRecord) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => { 
              setCurrentRecord(record); 
              const matchedChemical = stock.find(s => s.chemicalName === record.chemicalName && s.specification === record.specification);
              setBorrowItems([{ 
                key: 0, 
                chemicalId: matchedChemical?.id || '', 
                chemicalName: record.chemicalName, 
                specification: record.specification, 
                quantity: record.borrowQuantity, 
                unit: record.unit, 
                stock: matchedChemical?.currentStock || 0 
              }]);
              const firstSigner = availableSigners.find(s => s.name === record.firstSigner);
              const secondSigner = availableSigners.find(s => s.name === record.secondSigner);
              setSelectedFirstSigner(firstSigner || null);
              setSelectedSecondSigner(secondSigner || null);
              setTimeout(() => {
                editForm.setFieldsValue({
                  borrower: record.borrower,
                  [`chemical-0`]: matchedChemical?.id || '',
                  [`quantity-0`]: record.borrowQuantity,
                  firstSignerId: firstSigner?.id || '',
                  secondSignerId: secondSigner?.id || ''
                });
              }, 0);
              setEditVisible(true); 
            }}>编辑</Button>
          {record.verificationStatus !== '已核销' && (
            <Button type="text" onClick={() => { 
              setCurrentRecord(record); 
              setReturnVisible(true); 
              returnForm.setFieldsValue({ recordId: record.id, quantity: record.borrowQuantity });
              setReturnFirstSigner(null);
              setReturnSecondSigner(null);
            }}>归还</Button>
          )}
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>领用归还</h1>

      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} styles={{ body: { padding: 20 } }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="记录编号" name="recordNo"><Input placeholder="请输入记录编号" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="领用人" name="borrower"><Input placeholder="请输入领用人" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="领用日期" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="核销状态" name="status">
                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                      <Option value="">全部</Option>
                      <Option value="待核销">待核销</Option>
                      <Option value="已核销">已核销</Option>
                      <Option value="部分归还">部分归还</Option>
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
                <Form.Item label="记录编号" name="recordNo"><Input placeholder="请输入记录编号" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="领用人" name="borrower"><Input placeholder="请输入领用人" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="领用日期" name="dateRange">
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

      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', overflowX: 'auto' }} styles={{ body: { padding: 20 } }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 8, marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setBorrowVisible(true)}>新增领用</Button>
          <Button type="primary" icon={<UndoOutlined />} onClick={handleAddReturn}>新增归还</Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 'max-content' }}
          rowKey="id"
          pagination={{ pageSize: 10 }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
        />
      </Card>

      {/* 新增领用弹窗 */}
      <Modal
        title="新增领用"
        open={borrowVisible}
        onCancel={() => { 
          setBorrowVisible(false); 
          borrowForm.resetFields(); 
          setBorrowItems([{ key: 0, chemicalId: '', chemicalName: '', specification: '', quantity: 0, unit: '', stock: 0 }]);
          setSelectedFirstSigner(null);
          setSelectedSecondSigner(null);
        }}
        footer={[
          <Button key="back" onClick={() => { 
            setBorrowVisible(false); 
            borrowForm.resetFields(); 
            setBorrowItems([{ key: 0, chemicalId: '', chemicalName: '', specification: '', quantity: 0, unit: '', stock: 0 }]);
            setSelectedFirstSigner(null);
            setSelectedSecondSigner(null);
          }}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleBorrowSubmit}>保存</Button>,
        ]}
        width={800}
      >
        <Form form={borrowForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="领用人" name="borrower" rules={[{ required: true, message: '请输入领用人' }]}>
                <Input placeholder="请输入领用人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="项目/实验" name="project" rules={[{ required: true, message: '请输入项目或实验名称' }]}>
                <Input placeholder="请输入项目或实验名称" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="领用明细">
            <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>危化品清单</span>
                <Button type="dashed" size="small" onClick={addBorrowItem} icon={<PlusOutlined />}>添加危化品</Button>
              </div>
              {borrowItems.map((item, idx) => (
                <div key={item.key} style={{ display: 'flex', gap: 8, marginBottom: idx < borrowItems.length - 1 ? 8 : 0, alignItems: 'flex-end' }}>
                  <Form.Item
                    name={`chemical-${item.key}`}
                    rules={[{ required: true, message: '请选择危化品' }]}
                    style={{ flex: 2, marginBottom: 0 }}
                  >
                    <Select placeholder="选择危化品" showSearch>
                      {stock.map(s => (
                        <Option key={s.id} value={s.id}>
                          {s.chemicalName} ({s.specification}) - 库存: {s.currentStock}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={`quantity-${item.key}`}
                    rules={[{ required: true, message: '请输入数量' }]}
                    style={{ width: 100, marginBottom: 0 }}
                  >
                    <InputNumber min={1} placeholder="数量" style={{ width: '100%' }} />
                  </Form.Item>
                  {borrowItems.length > 1 && (
                    <Button
                      type="text"
                      danger
                      onClick={() => removeBorrowItem(item.key)}
                      style={{ padding: '4px 8px' }}
                    >
                      删除
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Form.Item>

          <Form.Item label="预计归还日期" name="expectedReturnDate">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <TextArea rows={3} placeholder="请输入备注信息" />
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
      </Modal>

      {/* 新增归还弹窗 */}
      <Modal
        title="新增归还"
        open={returnVisible}
        onCancel={() => { 
          setReturnVisible(false); 
          setCurrentRecord(null); 
          returnForm.resetFields();
          setReturnFirstSigner(null);
          setReturnSecondSigner(null);
        }}
        footer={[
          <Button key="back" onClick={() => { 
            setReturnVisible(false); 
            setCurrentRecord(null); 
            returnForm.resetFields();
            setReturnFirstSigner(null);
            setReturnSecondSigner(null);
          }}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleReturnSubmit}>保存</Button>,
        ]}
        width={600}
      >
        <Form form={returnForm} layout="vertical">
          <Form.Item label="选择领用记录" name="recordId" rules={[{ required: true, message: '请选择领用记录' }]}>
            <Select placeholder="请选择未归还的领用记录">
              {data.filter(item => item.verificationStatus !== '已核销').map(record => (
                <Option key={record.id} value={record.id}>
                  {record.recordNo} - {record.borrower} - {record.chemicalName} ({record.borrowQuantity}{record.unit})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="实际归还日期" name="actualReturnDate" rules={[{ required: true, message: '请选择归还日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="归还数量" name="quantity" rules={[{ required: true, message: '请输入归还数量' }]}>
            <InputNumber min={1} style={{ width: '100%' }} placeholder="归还数量" />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select placeholder="请选择状态">
              <Option value="good">完好</Option>
              <Option value="damaged">损坏</Option>
              <Option value="partial">部分消耗</Option>
            </Select>
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item 
                label="第一签字人" 
                name="returnFirstSignerId" 
                rules={[{ required: true, message: '请选择第一签字人' }]}
              >
                <Select 
                  placeholder="请选择签字人" 
                  showSearch
                  optionFilterProp="children"
                  onChange={(value) => {
                    const signer = availableSigners.find(s => s.id === value)
                    setReturnFirstSigner(signer || null)
                  }}
                >
                  {availableSigners.map(signer => (
                    <Option key={signer.id} value={signer.id}>
                      {signer.name} - {signer.department}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {returnFirstSigner && (
                <div style={{ 
                  border: '1px solid #E5E5E5', 
                  borderRadius: 8, 
                  padding: 16, 
                  background: '#FAFAFA',
                  marginTop: 8
                }}>
                  <div style={{ fontSize: 12, color: '#8C8C8C', marginBottom: 8 }}>签字图片：</div>
                  <img 
                    src={returnFirstSigner.signatureImage} 
                    alt={`${returnFirstSigner.name}的签名`}
                    style={{ maxWidth: '100%', height: 60, objectFit: 'contain' }}
                  />
                  <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>{returnFirstSigner.name}</div>
                </div>
              )}
            </Col>
            <Col span={12}>
              <Form.Item 
                label="第二签字人" 
                name="returnSecondSignerId" 
                rules={[{ required: true, message: '请选择第二签字人' }]}
              >
                <Select 
                  placeholder="请选择签字人" 
                  showSearch
                  optionFilterProp="children"
                  onChange={(value) => {
                    const signer = availableSigners.find(s => s.id === value)
                    setReturnSecondSigner(signer || null)
                  }}
                >
                  {availableSigners.map(signer => (
                    <Option key={signer.id} value={signer.id}>
                      {signer.name} - {signer.department}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              {returnSecondSigner && (
                <div style={{ 
                  border: '1px solid #E5E5E5', 
                  borderRadius: 8, 
                  padding: 16, 
                  background: '#FAFAFA',
                  marginTop: 8
                }}>
                  <div style={{ fontSize: 12, color: '#8C8C8C', marginBottom: 8 }}>签字图片：</div>
                  <img 
                    src={returnSecondSigner.signatureImage} 
                    alt={`${returnSecondSigner.name}的签名`}
                    style={{ maxWidth: '100%', height: 60, objectFit: 'contain' }}
                  />
                  <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>{returnSecondSigner.name}</div>
                </div>
              )}
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* 编辑弹窗 */}
      <Modal
        title="编辑领用记录"
        open={editVisible}
        onCancel={() => { 
          setEditVisible(false); 
          setTimeout(() => {
            setCurrentRecord(null); 
            editForm.resetFields();
            setBorrowItems([{ key: 0, chemicalId: '', chemicalName: '', specification: '', quantity: 0, unit: '', stock: 0 }]);
            setSelectedFirstSigner(null);
            setSelectedSecondSigner(null);
          }, 100);
        }}
        footer={[
          <Button key="back" onClick={() => { 
            setEditVisible(false); 
            setTimeout(() => {
              setCurrentRecord(null); 
              editForm.resetFields();
              setBorrowItems([{ key: 0, chemicalId: '', chemicalName: '', specification: '', quantity: 0, unit: '', stock: 0 }]);
              setSelectedFirstSigner(null);
              setSelectedSecondSigner(null);
            }, 100);
          }}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleEditSubmit}>保存</Button>,
        ]}
        width={800}
      >
        <Form form={editForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="领用人" name="borrower" rules={[{ required: true, message: '请输入领用人' }]}>
                <Input placeholder="请输入领用人" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="项目/实验" name="project" rules={[{ required: true, message: '请输入项目或实验名称' }]}>
                <Input placeholder="请输入项目或实验名称" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="领用明细">
            <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <div style={{ marginBottom: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>危化品清单</span>
                <Button type="dashed" size="small" onClick={addBorrowItem} icon={<PlusOutlined />}>添加危化品</Button>
              </div>
              {borrowItems.map((item, idx) => (
                <div key={item.key} style={{ display: 'flex', gap: 8, marginBottom: idx < borrowItems.length - 1 ? 8 : 0, alignItems: 'flex-end' }}>
                  <Form.Item
                    name={`chemical-${item.key}`}
                    rules={[{ required: true, message: '请选择危化品' }]}
                    style={{ flex: 2, marginBottom: 0 }}
                  >
                    <Select placeholder="选择危化品" showSearch>
                      {stock.map(s => (
                        <Option key={s.id} value={s.id}>
                          {s.chemicalName} ({s.specification}) - 库存: {s.currentStock}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                  <Form.Item
                    name={`quantity-${item.key}`}
                    rules={[{ required: true, message: '请输入数量' }]}
                    style={{ width: 100, marginBottom: 0 }}
                  >
                    <InputNumber min={1} placeholder="数量" style={{ width: '100%' }} />
                  </Form.Item>
                  {borrowItems.length > 1 && (
                    <Button
                      type="text"
                      danger
                      onClick={() => removeBorrowItem(item.key)}
                      style={{ padding: '4px 8px' }}
                    >
                      删除
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Form.Item>

          <Form.Item label="预计归还日期" name="expectedReturnDate">
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <TextArea rows={3} placeholder="请输入备注信息" />
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
      </Modal>
    </div>
  )
}
