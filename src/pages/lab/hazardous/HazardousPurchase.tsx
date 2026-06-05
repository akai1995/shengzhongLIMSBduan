import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Row, Col, Steps, InputNumber, Upload, Space, message } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CheckOutlined, CloseOutlined, DownOutlined, UpOutlined, UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker
const { Step } = Steps
const { TextArea } = Input

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

interface PurchaseRecord {
  id: string
  chemicalName: string
  casNumber: string
  hazardLevel: string
  applicant: string
  applyDate: string
  totalAmount: number
  status: '待审批' | '已批准' | '已拒绝' | '已验收'
  acceptor: string
  acceptDate: string
  subject: string
  expectedDate: string
  department: string
  budgetCode: string
  items: Array<{
    key: number
    chemicalName: string
    casNumber: string
    hazardLevel: string
    quantity: number
    unit: string
    price: number
    total: number
  }>
}

const generateMockData = (): PurchaseRecord[] => {
  const statuses: ('待审批' | '已批准' | '已拒绝' | '已验收')[] = ['待审批', '已批准', '已拒绝', '已验收']
  const applicants = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
  
  return Array.from({ length: 50 }, (_, i) => {
    const status = statuses[i % statuses.length]
    const chemical = chemicals[i % chemicals.length]
    const quantity = Math.floor(Math.random() * 50) + 1
    const price = Math.floor(Math.random() * 1000) + 50
    
    return {
      id: `PCG-2024-${String(i + 1).padStart(5, '0')}`,
      chemicalName: chemical.name,
      casNumber: chemical.cas,
      hazardLevel: chemical.hazard,
      applicant: applicants[i % applicants.length],
      applyDate: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')}`,
      totalAmount: quantity * price,
      status,
      acceptor: status === '已验收' ? '管理员' : '',
      acceptDate: status === '已验收' ? `2024-0${1 + (i % 8)}-${String(12 + (i % 10)).padStart(2, '0')}` : '',
      subject: `${chemical.name}采购`,
      expectedDate: `2024-0${1 + (i % 8)}-${String(20 + (i % 10)).padStart(2, '0')}`,
      department: '化学实验室',
      budgetCode: Math.random() > 0.3 ? `BG-2024-${String(Math.floor(Math.random() * 50) + 1).padStart(3, '0')}` : '',
      items: [{
        key: 0,
        chemicalName: chemical.name,
        casNumber: chemical.cas,
        hazardLevel: chemical.hazard,
        quantity,
        unit: chemical.unit,
        price,
        total: quantity * price
      }]
    }
  })
}

export default function HazardousPurchase() {
  const { isDark } = useThemeStore()
  const [searchForm] = Form.useForm()
  const [addForm] = Form.useForm()
  const [auditForm] = Form.useForm()
  const [acceptForm] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<PurchaseRecord | null>(null)
  
  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [auditModalVisible, setAuditModalVisible] = useState(false)
  const [acceptModalVisible, setAcceptModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  
  // Step state
  const [currentStep, setCurrentStep] = useState(0)
  
  // Data state
  const [purchaseData, setPurchaseData] = useState<PurchaseRecord[]>(generateMockData())

  const columns = [
    { title: '采购单号', dataIndex: 'id', key: 'id' },
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
    { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
    { title: '申请日期', dataIndex: 'applyDate', key: 'applyDate' },
    { title: '总金额', dataIndex: 'totalAmount', key: 'totalAmount', render: (amount: number) => `¥${amount.toFixed(2)}` },
    { title: '审批状态', dataIndex: 'status', key: 'status', render: (status: string) => {
      const colorMap: Record<string, string> = {
        '待审批': 'orange',
        '已批准': 'green',
        '已拒绝': 'red',
        '已验收': 'blue'
      }
      return <Tag color={colorMap[status] || 'gray'}>{status}</Tag>
    }},
    { title: '验收人', dataIndex: 'acceptor', key: 'acceptor', render: (val: string) => val || '-' },
    { title: '验收日期', dataIndex: 'acceptDate', key: 'acceptDate', render: (val: string) => val || '-' },
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 280, render: (_: any, record: PurchaseRecord) => (
      <Space size="small">
        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
        {(record.status === '待审批' || record.status === '已拒绝') && (
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
        )}
        {record.status === '待审批' && (
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        )}
        {record.status === '待审批' && (
          <Button type="text" onClick={() => handleAudit(record)}>审批</Button>
        )}
        {record.status === '已批准' && (
          <Button type="text" onClick={() => handleAccept(record)}>验收</Button>
        )}
      </Space>
    )},
  ]

  const handleAdd = () => {
    setCurrentStep(0)
    addForm.resetFields()
    setAddModalVisible(true)
  }

  const handleEdit = (record: PurchaseRecord) => {
    setCurrentRecord(record)
    setCurrentStep(0)
    addForm.setFieldsValue({
      subject: record.subject,
      expectedDate: record.expectedDate,
      department: record.department,
      budgetCode: record.budgetCode,
      items: record.items.map((item, index) => ({
        key: index,
        chemicalName: item.chemicalName,
        casNumber: item.casNumber,
        hazardLevel: item.hazardLevel,
        quantity: item.quantity,
        unit: item.unit,
        price: item.price,
        total: item.total
      }))
    })
    setEditModalVisible(true)
  }

  const handleDelete = (record: PurchaseRecord) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定删除采购申请【${record.id}】吗？删除后不可恢复。`,
      onOk: () => {
        setPurchaseData(purchaseData.filter(item => item.id !== record.id))
        message.success('删除成功')
      },
    })
  }

  const handleViewDetail = (record: PurchaseRecord) => {
    setCurrentRecord(record)
    setDetailModalVisible(true)
  }

  const handleAudit = (record: PurchaseRecord) => {
    setCurrentRecord(record)
    auditForm.resetFields()
    setAuditModalVisible(true)
  }

  const handleAccept = (record: PurchaseRecord) => {
    setCurrentRecord(record)
    acceptForm.resetFields()
    setAcceptModalVisible(true)
  }

  const handleStepNext = () => {
    if (currentStep === 0) {
      addForm.validateFields(['subject', 'expectedDate', 'department']).then(() => {
        setCurrentStep(currentStep + 1)
      }).catch(() => {
        message.error('请填写必填项')
      })
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleStepPrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmitApproval = () => {
    addForm.validateFields().then(values => {
      const items = values.items || []
      const totalAmount = items.reduce((sum, item) => sum + (item.quantity * item.price), 0)
      
      if (editModalVisible && currentRecord) {
        setPurchaseData(purchaseData.map(item => {
          if (item.id === currentRecord.id) {
            return {
              ...item,
              subject: values.subject,
              expectedDate: values.expectedDate,
              department: values.department,
              budgetCode: values.budgetCode,
              items: items.map((item, index) => ({ key: index, ...item })),
              totalAmount,
              chemicalName: items[0]?.chemicalName || '',
              casNumber: items[0]?.casNumber || '',
              hazardLevel: items[0]?.hazardLevel || ''
            }
          }
          return item
        }))
        message.success('保存成功')
        setEditModalVisible(false)
      } else {
        const newRecord: PurchaseRecord = {
          id: `PCG-2024-${String(purchaseData.length + 1).padStart(5, '0')}`,
          subject: values.subject,
          expectedDate: values.expectedDate,
          department: values.department,
          budgetCode: values.budgetCode,
          items: items.map((item, index) => ({ key: index, ...item })),
          totalAmount,
          chemicalName: items[0]?.chemicalName || '',
          casNumber: items[0]?.casNumber || '',
          hazardLevel: items[0]?.hazardLevel || '',
          applicant: '当前用户',
          applyDate: new Date().toISOString().split('T')[0],
          status: '待审批',
          acceptor: '',
          acceptDate: ''
        }
        setPurchaseData([newRecord, ...purchaseData])
        message.success('采购申请已提交审批')
        setAddModalVisible(false)
      }
      addForm.resetFields()
      setCurrentStep(0)
    }).catch(err => {
      message.error('请填写完整信息')
    })
  }

  const handleAuditSubmit = () => {
    auditForm.validateFields().then(values => {
      if (!currentRecord) return
      
      const newStatus: PurchaseRecord['status'] = values.result === 'approve' ? '已批准' : '已拒绝'
      
      setPurchaseData(purchaseData.map(item => {
        if (item.id === currentRecord.id) {
          return { ...item, status: newStatus }
        }
        return item
      }))
      
      message.success(values.result === 'approve' ? '审批通过' : '已拒绝')
      setAuditModalVisible(false)
      auditForm.resetFields()
    })
  }

  const handleAcceptSubmit = () => {
    acceptForm.validateFields().then(values => {
      if (!currentRecord) return
      
      const newStatus: PurchaseRecord['status'] = values.result === 'qualified' ? '已验收' : '已批准'
      const now = new Date().toISOString().split('T')[0]
      
      setPurchaseData(purchaseData.map(item => {
        if (item.id === currentRecord.id) {
          return {
            ...item,
            status: newStatus,
            acceptor: '当前用户',
            acceptDate: now
          }
        }
        return item
      }))
      
      message.success('验收完成')
      setAcceptModalVisible(false)
      acceptForm.resetFields()
    })
  }

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>采购登记</h1>
      
      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="采购单号" name="id"><Input placeholder="请输入采购单号" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="危化品名称" name="chemicalName"><Input placeholder="请输入危化品名称" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="申请日期" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="审批状态" name="status">
                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                      <Option value="">全部</Option>
                      <Option value="待审批">待审批</Option>
                      <Option value="已批准">已批准</Option>
                      <Option value="已拒绝">已拒绝</Option>
                      <Option value="已验收">已验收</Option>
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
                <Form.Item label="采购单号" name="id"><Input placeholder="请输入采购单号" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="危化品名称" name="chemicalName"><Input placeholder="请输入危化品名称" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="申请日期" name="dateRange">
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
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', overflowX: 'auto' }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>新增采购申请</Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={purchaseData} 
          scroll={{ x: 'max-content' }}
          rowKey="id" 
          pagination={{ pageSize: 10 }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
        />
      </Card>

      {/* Add Purchase Modal */}
      <Modal
        title={editModalVisible ? '编辑采购申请' : '新增采购申请'}
        open={addModalVisible || editModalVisible}
        onCancel={() => {
          setAddModalVisible(false)
          setEditModalVisible(false)
          addForm.resetFields()
          setCurrentStep(0)
        }}
        width={800}
        footer={currentStep > 0 ? [
          <Button key="cancel" onClick={() => {
            setAddModalVisible(false)
            setEditModalVisible(false)
            addForm.resetFields()
            setCurrentStep(0)
          }}>取消</Button>,
          <Button key="prev" onClick={handleStepPrev}>上一步</Button>,
          <Button key="submit" type="primary" onClick={currentStep < 2 ? handleStepNext : handleSubmitApproval}>
            {currentStep < 2 ? '下一步' : (editModalVisible ? '保存' : '添加')}
          </Button>,
        ] : [
          <Button key="cancel" onClick={() => {
            setAddModalVisible(false)
            setEditModalVisible(false)
            addForm.resetFields()
            setCurrentStep(0)
          }}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleStepNext}>下一步</Button>,
        ]}
      >
        <Steps current={currentStep} style={{ marginBottom: 24 }}>
          <Step title="申请信息" />
          <Step title="采购明细" />
          <Step title="附件上传" />
        </Steps>

        <Form form={addForm} layout="vertical">
          {currentStep === 0 && (
            <div>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="采购主题" name="subject" rules={[{ required: true, message: '请输入采购主题' }]}>
                    <Input placeholder="请输入采购主题" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="期望到货日期" name="expectedDate" rules={[{ required: true, message: '请选择期望到货日期' }]}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item label="申请部门" name="department" rules={[{ required: true, message: '请输入或选择申请部门' }]}>
                    <Select placeholder="请选择申请部门">
                      <Option value="化学实验室">化学实验室</Option>
                      <Option value="材料实验室">材料实验室</Option>
                      <Option value="分析实验室">分析实验室</Option>
                      <Option value="生物实验室">生物实验室</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item label="预算编号" name="budgetCode">
                    <Input placeholder="请输入预算编号" />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          )}

          {currentStep === 1 && (
            <div>
              <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 500 }}>采购明细</span>
                <Button type="dashed" onClick={() => {
                  const items = addForm.getFieldValue('items') || []
                  addForm.setFieldValue('items', [...items, {
                    key: items.length,
                    chemicalName: '',
                    casNumber: '',
                    hazardLevel: '',
                    quantity: 1,
                    unit: 'kg',
                    price: 0,
                    total: 0
                  }])
                }} icon={<PlusOutlined />}>添加明细</Button>
              </div>
              <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '150px 100px 100px 80px 60px 80px 80px 60px', backgroundColor: '#FAFAFA', padding: '12px 8px', fontWeight: 500, borderBottom: '1px solid #E5E5E5' }}>
                  <span>危化品名称</span>
                  <span>CAS号</span>
                  <span>危险等级</span>
                  <span>数量</span>
                  <span>单位</span>
                  <span>单价</span>
                  <span>预计总价</span>
                  <span>操作</span>
                </div>
                <Form.List name="items">
                  {(fields, { add, remove }) => (
                    <>
                      {fields.map((field, idx) => (
                        <div key={field.key} style={{ display: 'grid', gridTemplateColumns: '150px 100px 100px 80px 60px 80px 80px 60px', padding: '8px', borderBottom: idx < fields.length - 1 ? '1px solid #E5E5E5' : 'none', alignItems: 'center', gap: '8px' }}>
                          <Form.Item {...field} name={[field.name, 'chemicalName']} rules={[{ required: true, message: '请输入危化品名称' }]}>
                            <Input placeholder="名称" />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'casNumber']} rules={[{ required: true, message: '请输入CAS号' }]}>
                            <Input placeholder="CAS号" />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'hazardLevel']} rules={[{ required: true, message: '请选择危险等级' }]}>
                            <Select placeholder="危险等级">
                              <Option value="易燃">易燃</Option>
                              <Option value="易爆">易爆</Option>
                              <Option value="剧毒">剧毒</Option>
                              <Option value="腐蚀性">腐蚀性</Option>
                              <Option value="氧化性">氧化性</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'quantity']} rules={[{ required: true, type: 'number', min: 1, message: '请输入数量' }]}>
                            <InputNumber min={1} style={{ width: '100%' }} />
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'unit']} rules={[{ required: true, message: '请选择单位' }]}>
                            <Select placeholder="单位">
                              <Option value="kg">kg</Option>
                              <Option value="L">L</Option>
                              <Option value="瓶">瓶</Option>
                              <Option value="g">g</Option>
                              <Option value="mL">mL</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item {...field} name={[field.name, 'price']} rules={[{ required: true, type: 'number', min: 0, message: '请输入单价' }]}>
                            <InputNumber min={0} precision={2} style={{ width: '100%' }} />
                          </Form.Item>
                          <span>¥{(addForm.getFieldValue(['items', idx, 'quantity']) * addForm.getFieldValue(['items', idx, 'price'])).toFixed(2)}</span>
                          {fields.length > 1 && (
                            <Button type="text" danger size="small" onClick={() => remove(field.name)}>删除</Button>
                          )}
                        </div>
                      ))}
                    </>
                  )}
                </Form.List>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <Form.Item label="MSDS文件（必传）">
                <Upload listType="text">
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </Form.Item>
              <Form.Item label="其他相关材料">
                <Upload listType="text" multiple>
                  <Button icon={<UploadOutlined />}>选择文件</Button>
                </Upload>
              </Form.Item>
            </div>
          )}
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="采购申请详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentRecord && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div><span style={{ color: '#8C8C8C' }}>采购单号：</span><span style={{ color: '#262626' }}>{currentRecord.id}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>采购主题：</span><span style={{ color: '#262626' }}>{currentRecord.subject}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>危化品名称：</span><span style={{ color: '#262626' }}>{currentRecord.chemicalName}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>CAS号：</span><span style={{ color: '#262626' }}>{currentRecord.casNumber}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>危险等级：</span><span style={{ color: '#262626' }}>{currentRecord.hazardLevel}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>申请部门：</span><span style={{ color: '#262626' }}>{currentRecord.department}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>申请人：</span><span style={{ color: '#262626' }}>{currentRecord.applicant}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>申请日期：</span><span style={{ color: '#262626' }}>{currentRecord.applyDate}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>期望到货日期：</span><span style={{ color: '#262626' }}>{currentRecord.expectedDate}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>预算编号：</span><span style={{ color: '#262626' }}>{currentRecord.budgetCode || '-'}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>状态：</span><Tag color={currentRecord.status === '已批准' ? 'green' : currentRecord.status === '已拒绝' ? 'red' : currentRecord.status === '已验收' ? 'blue' : 'orange'}>{currentRecord.status}</Tag></div>
              <div><span style={{ color: '#8C8C8C' }}>总金额：</span><span style={{ color: '#262626' }}>¥{currentRecord.totalAmount.toFixed(2)}</span></div>
            </div>

            <h4 style={{ marginBottom: 12, fontWeight: 500 }}>采购明细</h4>
            <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, overflow: 'hidden', marginBottom: 24 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '150px 100px 100px 80px 60px 80px 80px', backgroundColor: '#FAFAFA', padding: '12px 8px', fontWeight: 500, borderBottom: '1px solid #E5E5E5' }}>
                <span>危化品名称</span>
                <span>CAS号</span>
                <span>危险等级</span>
                <span>数量</span>
                <span>单位</span>
                <span>单价</span>
                <span>总价</span>
              </div>
              {currentRecord.items.map((item: any, idx: number) => (
                <div key={item.key || idx} style={{ display: 'grid', gridTemplateColumns: '150px 100px 100px 80px 60px 80px 80px', padding: '8px', borderBottom: idx < currentRecord.items.length - 1 ? '1px solid #E5E5E5' : 'none', alignItems: 'center', gap: '8px' }}>
                  <span>{item.chemicalName}</span>
                  <span>{item.casNumber}</span>
                  <Tag color={item.hazardLevel === '剧毒' ? 'red' : item.hazardLevel === '腐蚀性' ? 'orange' : item.hazardLevel === '易燃' ? 'yellow' : item.hazardLevel === '易爆' ? 'purple' : 'blue'}>{item.hazardLevel}</Tag>
                  <span>{item.quantity}</span>
                  <span>{item.unit}</span>
                  <span>¥{item.price.toFixed(2)}</span>
                  <span>¥{item.total.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <h4 style={{ marginBottom: 12, fontWeight: 500 }}>审批记录</h4>
            <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: 16 }}>
              <div style={{ display: 'flex', gap: 16, padding: '8px 0', borderBottom: '1px solid #E5E5E5' }}>
                <span style={{ width: 100, color: '#8C8C8C' }}>节点</span>
                <span style={{ width: 100, color: '#8C8C8C' }}>审批人</span>
                <span style={{ width: 150, color: '#8C8C8C' }}>审批时间</span>
                <span style={{ flex: 1, color: '#8C8C8C' }}>审批意见</span>
                <span style={{ width: 80, color: '#8C8C8C' }}>结果</span>
              </div>
              <div style={{ display: 'flex', gap: 16, padding: '8px 0' }}>
                <span style={{ width: 100 }}>提交申请</span>
                <span style={{ width: 100 }}>{currentRecord.applicant}</span>
                <span style={{ width: 150 }}>{currentRecord.applyDate}</span>
                <span style={{ flex: 1 }}>提交采购申请</span>
                <span style={{ width: 80 }}><Tag color="blue">提交</Tag></span>
              </div>
              {currentRecord.status === '已批准' && (
                <div style={{ display: 'flex', gap: 16, padding: '8px 0', borderTop: '1px dashed #E5E5E5', marginTop: 8 }}>
                  <span style={{ width: 100 }}>审批通过</span>
                  <span style={{ width: 100 }}>管理员</span>
                  <span style={{ width: 150 }}>-</span>
                  <span style={{ flex: 1 }}>审批通过</span>
                  <span style={{ width: 80 }}><Tag color="green">通过</Tag></span>
                </div>
              )}
              {currentRecord.status === '已拒绝' && (
                <div style={{ display: 'flex', gap: 16, padding: '8px 0', borderTop: '1px dashed #E5E5E5', marginTop: 8 }}>
                  <span style={{ width: 100 }}>审批拒绝</span>
                  <span style={{ width: 100 }}>管理员</span>
                  <span style={{ width: 150 }}>-</span>
                  <span style={{ flex: 1 }}>审批拒绝</span>
                  <span style={{ width: 80 }}><Tag color="red">拒绝</Tag></span>
                </div>
              )}
              {currentRecord.status === '已验收' && (
                <>
                  <div style={{ display: 'flex', gap: 16, padding: '8px 0', borderTop: '1px dashed #E5E5E5', marginTop: 8 }}>
                    <span style={{ width: 100 }}>审批通过</span>
                    <span style={{ width: 100 }}>管理员</span>
                    <span style={{ width: 150 }}>-</span>
                    <span style={{ flex: 1 }}>审批通过</span>
                    <span style={{ width: 80 }}><Tag color="green">通过</Tag></span>
                  </div>
                  <div style={{ display: 'flex', gap: 16, padding: '8px 0', borderTop: '1px dashed #E5E5E5', marginTop: 8 }}>
                    <span style={{ width: 100 }}>验收完成</span>
                    <span style={{ width: 100 }}>{currentRecord.acceptor}</span>
                    <span style={{ width: 150 }}>{currentRecord.acceptDate}</span>
                    <span style={{ flex: 1 }}>验收合格</span>
                    <span style={{ width: 80 }}><Tag color="blue">验收</Tag></span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* Audit Modal */}
      <Modal
        title="审批采购申请"
        open={auditModalVisible}
        onCancel={() => {
          setAuditModalVisible(false)
          auditForm.resetFields()
        }}
        onOk={handleAuditSubmit}
        width={600}
      >
        {currentRecord && (
          <div>
            <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#FAFAFA', borderRadius: 8 }}>
              <p><strong>采购单号：</strong>{currentRecord.id}</p>
              <p><strong>危化品名称：</strong>{currentRecord.chemicalName}</p>
              <p><strong>CAS号：</strong>{currentRecord.casNumber}</p>
              <p><strong>危险等级：</strong>{currentRecord.hazardLevel}</p>
              <p><strong>总金额：</strong>¥{currentRecord.totalAmount.toFixed(2)}</p>
            </div>

            <Form form={auditForm} layout="vertical">
              <Form.Item label="审批结果" name="result" rules={[{ required: true, message: '请选择审批结果' }]}>
                <Select placeholder="请选择审批结果">
                  <Option value="approve">通过</Option>
                  <Option value="reject">拒绝</Option>
                </Select>
              </Form.Item>
              <Form.Item noStyle shouldUpdate={(prev, curr) => prev.result !== curr.result}>
                {({ getFieldValue }) =>
                  getFieldValue('result') === 'reject' && (
                    <Form.Item label="驳回原因" name="rejectReason" rules={[{ required: true, message: '请输入驳回原因' }]}>
                      <TextArea rows={4} placeholder="请输入驳回原因" />
                    </Form.Item>
                  )
                }
              </Form.Item>
              <Form.Item label="审批意见" name="opinion">
                <TextArea rows={3} placeholder="请输入审批意见" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>

      {/* Accept Modal */}
      <Modal
        title="验收登记"
        open={acceptModalVisible}
        onCancel={() => {
          setAcceptModalVisible(false)
          acceptForm.resetFields()
        }}
        onOk={handleAcceptSubmit}
        width={600}
      >
        {currentRecord && (
          <Form form={acceptForm} layout="vertical">
            <div style={{ marginBottom: 16, padding: 16, backgroundColor: '#FAFAFA', borderRadius: 8 }}>
              <p><strong>采购单号：</strong>{currentRecord.id}</p>
              <p><strong>危化品名称：</strong>{currentRecord.chemicalName}</p>
              <p><strong>申请数量：</strong>{currentRecord.items.reduce((sum: number, item: any) => sum + item.quantity, 0)} {currentRecord.items[0]?.unit}</p>
            </div>
            <Form.Item label="验收结果" name="result" rules={[{ required: true, message: '请选择验收结果' }]}>
              <Select placeholder="请选择验收结果">
                <Option value="qualified">合格</Option>
                <Option value="unqualified">不合格</Option>
              </Select>
            </Form.Item>
            <Form.Item label="实际到货日期" name="actualDate" rules={[{ required: true, message: '请选择实际到货日期' }]}>
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item label="实际数量" name="actualQuantity" rules={[{ required: true, type: 'number', min: 0, message: '请输入实际数量' }]}>
              <InputNumber style={{ width: '100%' }} min={0} />
            </Form.Item>
            <Form.Item label="存储位置" name="storageLocation">
              <Select placeholder="请选择存储位置">
                <Option value="危化品柜A01">危化品柜A01</Option>
                <Option value="危化品柜A02">危化品柜A02</Option>
                <Option value="危化品柜B01">危化品柜B01</Option>
                <Option value="危化品柜B02">危化品柜B02</Option>
              </Select>
            </Form.Item>
            <Form.Item label="备注" name="remark">
              <TextArea rows={3} placeholder="请输入备注" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}
