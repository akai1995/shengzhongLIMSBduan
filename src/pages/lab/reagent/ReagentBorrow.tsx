import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Row, Col, InputNumber, Space, message } from 'antd'
import { PlusOutlined, DownOutlined, UpOutlined, EditOutlined, DeleteOutlined, UndoOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

export default function ReagentBorrow() {
  const { isDark } = useThemeStore()
  const [searchForm] = Form.useForm()
  const [borrowForm] = Form.useForm()
  const [returnForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [modalType, setModalType] = useState<'borrow' | 'return'>('borrow')
  
  // Modal states
  const [borrowModalVisible, setBorrowModalVisible] = useState(false)
  const [returnModalVisible, setReturnModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  
  // Borrow items for dynamic table
  const [borrowItems, setBorrowItems] = useState<any[]>([
    { key: 0, materialId: '', materialName: '', spec: '', quantity: 0, unit: '', stock: 0 }
  ])

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      '已核销': 'green',
      '待归还': 'orange',
      '未核销': 'red'
    }
    return colorMap[status] || 'default'
  }

  const columns = [
    { title: '记录ID', dataIndex: 'id', key: 'id' },
    { title: '领用人', dataIndex: 'borrower', key: 'borrower' },
    { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格', dataIndex: 'spec', key: 'spec' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '领用日期', dataIndex: 'borrowDate', key: 'borrowDate' },
    { title: '预计归还日期', dataIndex: 'expectedReturnDate', key: 'expectedReturnDate' },
    { title: '实际归还日期', dataIndex: 'actualReturnDate', key: 'actualReturnDate', render: (val: string) => val || '-' },
    { title: '核销状态', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Tag color={getStatusColor(status)}>{status}</Tag>
    ) },
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 200, render: (_: any, record: any) => (
      <Space size="small">
        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
        {record.status === '待归还' && (
          <Button type="text" style={{ color: '#52c41a' }} onClick={() => handleReturn(record)}>归还</Button>
        )}
        <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
      </Space>
    ) },
  ]

  const data = Array.from({ length: 50 }, (_, i) => {
    const statuses = ['待归还', '已核销', '未核销']
    const borrowers = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
    const materials = ['DMEM培养基', '胎牛血清', '胰蛋白酶', 'PBS缓冲液', '青霉素-链霉素', 'DMSO', '甘油']
    const specs = ['500ml', '100ml', '100mg', '1L', '250ml', '50ml', '10mg', '500g']
    const units = ['瓶', '瓶', '支', '瓶', '瓶', '盒', 'ml', 'g']
    const status = statuses[i % statuses.length]
    return {
      key: String(i + 1),
      id: `BR2024${String(i + 1).padStart(5, '0')}`,
      borrower: borrowers[i % borrowers.length],
      materialName: materials[i % materials.length],
      spec: specs[i % specs.length],
      quantity: 1 + (i % 5),
      unit: units[i % units.length],
      borrowDate: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')}`,
      expectedReturnDate: `2024-0${1 + (i % 8)}-${String(20 + (i % 8)).padStart(2, '0')}`,
      actualReturnDate: status === '已核销' ? `2024-0${1 + (i % 8)}-${String(15 + (i % 10)).padStart(2, '0')}` : '',
      status,
      project: '细胞培养项目'
    }
  })

  const materials = [
    { id: '1', name: 'DMEM培养基', spec: '500ml', unit: '瓶', stock: 10 },
    { id: '2', name: '胎牛血清', spec: '100ml', unit: '瓶', stock: 5 },
    { id: '3', name: '胰蛋白酶', spec: '100mg', unit: '支', stock: 8 },
    { id: '4', name: 'PBS缓冲液', spec: '1L', unit: '瓶', stock: 15 },
    { id: '5', name: '青霉素-链霉素', spec: '100ml', unit: '瓶', stock: 6 }
  ]

  const unreturnedRecords = data.filter(item => item.status === '待归还')

  const handleAddBorrow = () => {
    setBorrowItems([{ key: 0, materialId: '', materialName: '', spec: '', quantity: 0, unit: '', stock: 0 }])
    borrowForm.resetFields()
    setBorrowModalVisible(true)
  }

  const handleAddReturn = () => {
    returnForm.resetFields()
    setReturnModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setCurrentRecord(record)
    editForm.resetFields()
    // 根据物料名称查找物料ID
    const matchedMaterial = materials.find(m => m.name === record.materialName && m.spec === record.spec)
    // 设置物料明细（根据当前记录创建物料列表）
    setBorrowItems([{ 
      key: 0, 
      materialId: matchedMaterial?.id || '', 
      materialName: record.materialName, 
      spec: record.spec, 
      quantity: record.quantity, 
      unit: record.unit, 
      stock: matchedMaterial?.stock || 0 
    }])
    // 设置所有表单字段值
    setTimeout(() => {
      editForm.setFieldsValue({
        borrower: record.borrower,
        project: record.project,
        [`material-0`]: matchedMaterial?.id || '',
        [`quantity-0`]: record.quantity
      })
    }, 0)
    setEditModalVisible(true)
  }

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除领用记录【${record.id}】吗？`,
      onOk: () => message.success('删除成功')
    })
  }

  const handleReturn = (record: any) => {
    setCurrentRecord(record)
    returnForm.resetFields()
    returnForm.setFieldsValue({
      recordId: record.id,
      quantity: record.quantity,
      status: 'good'
    })
    setReturnModalVisible(true)
  }

  const addBorrowItem = () => {
    const newKey = borrowItems.length
    setBorrowItems([...borrowItems, { key: newKey, materialId: '', materialName: '', spec: '', quantity: 0, unit: '', stock: 0 }])
  }

  const removeBorrowItem = (key: number) => {
    if (borrowItems.length > 1) {
      setBorrowItems(borrowItems.filter(item => item.key !== key))
    }
  }

  const handleBorrowSubmit = () => {
    borrowForm.validateFields().then(values => {
      message.success('领用登记成功')
      setBorrowModalVisible(false)
    })
  }

  const handleReturnSubmit = () => {
    returnForm.validateFields().then(values => {
      message.success('归还登记成功')
      setReturnModalVisible(false)
    })
  }

  const handleEditSubmit = () => {
    editForm.validateFields().then(values => {
      message.success('修改成功')
      setEditModalVisible(false)
    })
  }

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>领用归还</h1>
      
      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} styles={{ body: { padding: 20 } }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="领用人" name="borrower"><Input placeholder="请输入领用人" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="物料名称" name="materialName"><Input placeholder="请输入物料名称" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="记录类型" name="type">
                <Select placeholder="请选择类型">
                  <Option value="all">全部</Option>
                  <Option value="borrow">领用</Option>
                  <Option value="return">归还</Option>
                </Select>
              </Form.Item>
            </Col>
            {expanded && (
              <Col span={6}>
                <Form.Item label="领用日期" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            )}
            {!expanded && (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
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
            <Row gutter={16}>
              <Col span={6} offset={18}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
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
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', overflowX: 'auto' }} styles={{ body: { padding: 20 } }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16, gap: 8 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAddBorrow}>新增领用</Button>
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

      {/* Borrow Modal */}
      <Modal
        title="新增领用"
        open={borrowModalVisible}
        onCancel={() => setBorrowModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setBorrowModalVisible(false)}>取消</Button>,
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
                <span style={{ fontWeight: 500 }}>物料清单</span>
                <Button type="dashed" size="small" onClick={addBorrowItem} icon={<PlusOutlined />}>添加物料</Button>
              </div>
              {borrowItems.map((item, idx) => (
                <div key={item.key} style={{ display: 'flex', gap: 8, marginBottom: idx < borrowItems.length - 1 ? 8 : 0, alignItems: 'flex-end' }}>
                  <Form.Item
                    name={`material-${item.key}`}
                    rules={[{ required: true, message: '请选择物料' }]}
                    style={{ flex: 2, marginBottom: 0 }}
                  >
                    <Select placeholder="选择物料" showSearch>
                      {materials.map(m => (
                        <Option key={m.id} value={m.id}>
                          {m.name} ({m.spec}) - 库存: {m.stock}
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
        </Form>
      </Modal>

      {/* Return Modal */}
      <Modal
        title="新增归还"
        open={returnModalVisible}
        onCancel={() => setReturnModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setReturnModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleReturnSubmit}>保存</Button>,
        ]}
        width={600}
      >
        <Form form={returnForm} layout="vertical">
          <Form.Item label="选择领用记录" name="recordId" rules={[{ required: true, message: '请选择领用记录' }]}>
            <Select placeholder="请选择未归还的领用记录">
              {unreturnedRecords.map(record => (
                <Option key={record.id} value={record.id}>
                  {record.id} - {record.borrower} - {record.materialName} ({record.quantity}{record.unit})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="实际归还日期" name="actualReturnDate" rules={[{ required: true, message: '请选择归还日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="归还数量" name="quantity" rules={[{ required: true, message: '请输入归还数量' }]}>
            <InputNumber min={1} max={currentRecord?.quantity} style={{ width: '100%' }} placeholder="归还数量" />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select placeholder="请选择状态">
              <Option value="good">完好</Option>
              <Option value="damaged">损坏</Option>
              <Option value="partial">部分消耗</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        title="编辑领用记录"
        open={editModalVisible}
        onCancel={() => { setEditModalVisible(false); setBorrowItems([{ key: 0, materialId: '', materialName: '', spec: '', quantity: 0, unit: '', stock: 0 }]) }}
        footer={[
          <Button key="back" onClick={() => { setEditModalVisible(false); setBorrowItems([{ key: 0, materialId: '', materialName: '', spec: '', quantity: 0, unit: '', stock: 0 }]) }}>取消</Button>,
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
                <span style={{ fontWeight: 500 }}>物料清单</span>
                <Button type="dashed" size="small" onClick={addBorrowItem} icon={<PlusOutlined />}>添加物料</Button>
              </div>
              {borrowItems.map((item, idx) => (
                <div key={item.key} style={{ display: 'flex', gap: 8, marginBottom: idx < borrowItems.length - 1 ? 8 : 0, alignItems: 'flex-end' }}>
                  <Form.Item
                    name={`material-${item.key}`}
                    rules={[{ required: true, message: '请选择物料' }]}
                    style={{ flex: 2, marginBottom: 0 }}
                  >
                    <Select placeholder="选择物料" showSearch>
                      {materials.map(m => (
                        <Option key={m.id} value={m.id}>
                          {m.name} ({m.spec}) - 库存: {m.stock}
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
        </Form>
      </Modal>
    </div>
  )
}