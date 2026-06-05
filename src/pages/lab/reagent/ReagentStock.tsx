import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Row, Col, InputNumber, Space, message } from 'antd'
import { SearchOutlined, EditOutlined, EyeOutlined, UpOutlined, DownOutlined, ExportOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { TextArea } = Input

export default function ReagentStock() {
  const { isDark } = useThemeStore()
  const [searchForm] = Form.useForm()
  const [adjustForm] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  
  // Modal states
  const [adjustModalVisible, setAdjustModalVisible] = useState(false)

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      '正常': 'green',
      '低库存': 'orange',
      '过期': 'red',
      '临期': 'gold'
    }
    return colorMap[status] || 'default'
  }

  const columns = [
    { title: '物料ID', dataIndex: 'id', key: 'id' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '规格', dataIndex: 'spec', key: 'spec' },
    { title: '批次号', dataIndex: 'batch', key: 'batch' },
    { title: '当前库存', dataIndex: 'stock', key: 'stock', render: (val: number, record: any) => (
      <span style={{ fontWeight: val <= record.threshold ? 600 : 400, color: val <= record.threshold ? '#faad14' : 'inherit' }}>
        {val}
      </span>
    ) },
    { title: '单位', dataIndex: 'unit', key: 'unit' },
    { title: '存放位置', dataIndex: 'location', key: 'location' },
    { title: '有效期', dataIndex: 'expiryDate', key: 'expiryDate' },
    { title: '库存状态', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Tag color={getStatusColor(status)}>{status}</Tag>
    ) },
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 120, render: (_: any, record: any) => (
      <Button type="text" icon={<EditOutlined />} onClick={() => handleAdjust(record)}>调整库存</Button>
    ) },
  ]

  const data = Array.from({ length: 50 }, (_, i) => {
    const statuses = ['正常', '正常', '正常', '低库存', '过期', '临期']
    const materials = ['DMEM培养基', '胎牛血清', '胰蛋白酶', 'PBS缓冲液', '青霉素-链霉素', 'DMSO', '甘油']
    const specs = ['500ml', '100ml', '100mg', '1L', '250ml', '50ml', '10mg', '500g']
    const units = ['瓶', '瓶', '支', '瓶', '瓶', '盒', 'ml', 'g']
    const locations = ['货架A01', '货架A02', '冰箱2号', '危化品柜', '常温库B01']
    const stock = 5 + Math.floor(Math.random() * 50)
    const threshold = 10 + Math.floor(Math.random() * 20)
    return {
      key: String(i + 1),
      id: `MAT${String(i + 1).padStart(6, '0')}`,
      name: materials[i % materials.length],
      spec: specs[i % specs.length],
      batch: `BATCH${202400 + i}`,
      stock,
      threshold,
      unit: units[i % units.length],
      location: locations[i % locations.length],
      expiryDate: `2025-0${(i % 9) + 1}-${String(10 + (i % 18)).padStart(2, '0')}`,
      status: statuses[i % statuses.length],
    }
  })

  const handleAdjust = (record: any) => {
    setCurrentRecord(record)
    adjustForm.resetFields()
    adjustForm.setFieldsValue({
      type: 'increase',
      quantity: 1,
      reason: ''
    })
    setAdjustModalVisible(true)
  }

  const handleAdjustSubmit = () => {
    adjustForm.validateFields().then(values => {
      message.success('库存调整成功')
      setAdjustModalVisible(false)
    })
  }

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>库存查询</h1>
      
      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="物料名称/条码" name="name"><Input placeholder="请输入物料名称或条码" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="存放位置" name="location">
                    <Select placeholder="请选择位置" style={{ width: '100%' }} allowClear>
                      <Option value="all">全部</Option>
                      <Option value="A01">货架A01</Option>
                      <Option value="A02">货架A02</Option>
                      <Option value="fridge2">冰箱2号</Option>
                      <Option value="hazardous">危化品柜</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="供应商" name="supplier">
                    <Select placeholder="请选择供应商" style={{ width: '100%' }} allowClear>
                      <Option value="supplier1">供应商A</Option>
                      <Option value="supplier2">供应商B</Option>
                      <Option value="supplier3">供应商C</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="批次号" name="batch"><Input placeholder="请输入批次号" /></Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="库存状态" name="status">
                    <Select placeholder="请选择库存状态" style={{ width: '100%' }} allowClear>
                      <Option value="normal">正常</Option>
                      <Option value="low">低库存</Option>
                      <Option value="expired">过期</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={18} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, alignItems: 'center' }}>
                  <Button type="primary">查询</Button>
                  <Button onClick={() => searchForm.resetFields()} className="reset-btn">重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={16} style={{ height: 32 }}>
              <Col span={6}>
                <Form.Item label="物料名称/条码" name="name"><Input placeholder="请输入物料名称或条码" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="存放位置" name="location">
                  <Select placeholder="请选择位置" style={{ width: '100%' }} allowClear>
                    <Option value="all">全部</Option>
                    <Option value="A01">货架A01</Option>
                    <Option value="A02">货架A02</Option>
                    <Option value="fridge2">冰箱2号</Option>
                    <Option value="hazardous">危化品柜</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="供应商" name="supplier">
                  <Select placeholder="请选择供应商" style={{ width: '100%' }} allowClear>
                    <Option value="supplier1">供应商A</Option>
                    <Option value="supplier2">供应商B</Option>
                    <Option value="supplier3">供应商C</Option>
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
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', overflowX: 'auto' }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Button type="primary" icon={<ExportOutlined />} disabled={selectedRows.length === 0} className="export-btn" onClick={() => message.success('导出成功')}>导出</Button>
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

      {/* Adjust Stock Modal */}
      <Modal
        title="调整库存"
        open={adjustModalVisible}
        onCancel={() => setAdjustModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setAdjustModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleAdjustSubmit}>保存</Button>,
        ]}
        width={500}
      >
        {currentRecord && (
          <div>
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#FAFAFA', borderRadius: 6 }}>
              <p style={{ margin: 0 }}><strong>物料名称：</strong>{currentRecord.name}</p>
              <p style={{ margin: 0 }}><strong>规格：</strong>{currentRecord.spec}</p>
              <p style={{ margin: 0 }}><strong>当前库存：</strong><span style={{ fontWeight: 600 }}>{currentRecord.stock}</span> {currentRecord.unit}</p>
            </div>
            <Form form={adjustForm} layout="vertical">
              <Form.Item label="调整类型" name="type" rules={[{ required: true, message: '请选择调整类型' }]}>
                <Select placeholder="请选择">
                  <Option value="increase">增加库存</Option>
                  <Option value="decrease">减少库存</Option>
                </Select>
              </Form.Item>
              <Form.Item label="调整数量" name="quantity" rules={[{ required: true, message: '请输入调整数量' }]}>
                <InputNumber min={1} style={{ width: '100%' }} placeholder="请输入数量" />
              </Form.Item>
              <Form.Item label="调整原因" name="reason" rules={[{ required: true, message: '请输入调整原因' }]}>
                <TextArea rows={4} placeholder="例如：盘盈、盘亏、领用、报损等" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}