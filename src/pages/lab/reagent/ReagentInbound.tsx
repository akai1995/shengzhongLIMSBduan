import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Row, Col, InputNumber, Space, message, Upload } from 'antd'
import { PlusOutlined, EyeOutlined, UploadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState, useRef, useEffect } from 'react'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

export default function ReagentInbound() {
  const { isDark } = useThemeStore()
  const [searchForm] = Form.useForm()
  const [addForm] = Form.useForm()
  const [detailForm] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  
  // Modal states
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  
  const barcodeInputRef = useRef<HTMLInputElement>(null)

  const columns = [
    { title: '入库单号', dataIndex: 'id', key: 'id' },
    { title: '条码', dataIndex: 'barcode', key: 'barcode' },
    { title: '名称', dataIndex: 'name', key: 'name' },
    { title: '批次', dataIndex: 'batch', key: 'batch' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier' },
    { title: '有效期', dataIndex: 'expiryDate', key: 'expiryDate' },
    { title: '存放位置', dataIndex: 'location', key: 'location' },
    { title: '入库时间', dataIndex: 'inboundTime', key: 'inboundTime' },
    { title: '操作员', dataIndex: 'operator', key: 'operator' },
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 100, render: (_: any, record: any) => (
      <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
    )},
  ]

  const data = Array.from({ length: 50 }, (_, i) => {
    const suppliers = ['西格玛奥德里奇', '赛默飞世尔', '碧云天', '阿拉丁试剂', '麦克林']
    const locations = ['货架A01', '货架A02', '冰箱2号', '危化品柜', '常温库B01']
    const materials = ['DMEM培养基', '胎牛血清', '胰蛋白酶', 'PBS缓冲液', '青霉素-链霉素', 'DMSO', '甘油']
    return {
      key: String(i + 1),
      id: `IB2024${String(i + 1).padStart(5, '0')}`,
      barcode: `BC${100000 + i}`,
      name: materials[i % materials.length],
      batch: `BATCH${202400 + i}`,
      quantity: 10 + Math.floor(Math.random() * 50),
      supplier: suppliers[i % suppliers.length],
      expiryDate: `2025-0${(i % 9) + 1}-${String(10 + (i % 18)).padStart(2, '0')}`,
      location: locations[i % locations.length],
      inboundTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:${String((i % 6) * 10).padStart(2, '0')}`,
      operator: ['张三', '李四', '王五'][i % 3],
    }
  })

  const handleAdd = () => {
    addForm.resetFields()
    setAddModalVisible(true)
  }

  const handleViewDetail = (record: any) => {
    setCurrentRecord(record)
    setDetailModalVisible(true)
  }

  const handleManualInbound = () => {
    addForm.validateFields().then(values => {
      message.success('入库成功')
      setAddModalVisible(false)
    })
  }

  const handleExport = () => {
    message.success('导出成功')
  }

  // Focus on barcode input when modal opens
  useEffect(() => {
    if (addModalVisible && barcodeInputRef.current) {
      setTimeout(() => {
        barcodeInputRef.current?.focus()
      }, 100)
    }
  }, [addModalVisible])

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>入库管理</h1>
      
      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="物料名称" name="name"><Input placeholder="请输入物料名称" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="条码" name="barcode"><Input placeholder="请输入条码" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="供应商" name="supplier">
                    <Select placeholder="请选择供应商" style={{ width: '100%' }} allowClear>
                      <Option value="all">全部</Option>
                      <Option value="sigma">西格玛奥德里奇</Option>
                      <Option value="thermo">赛默飞世尔</Option>
                      <Option value="biyuntian">碧云天</Option>
                      <Option value="aladdin">阿拉丁试剂</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="批次" name="batch"><Input placeholder="请输入批次" /></Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="入库时间" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
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
                <Form.Item label="物料名称" name="name"><Input placeholder="请输入物料名称" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="条码" name="barcode"><Input placeholder="请输入条码" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="供应商" name="supplier">
                  <Select placeholder="请选择供应商" style={{ width: '100%' }} allowClear>
                    <Option value="all">全部</Option>
                    <Option value="sigma">西格玛奥德里奇</Option>
                    <Option value="thermo">赛默飞世尔</Option>
                    <Option value="biyuntian">碧云天</Option>
                    <Option value="aladdin">阿拉丁试剂</Option>
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
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16, gap: 8 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>手动入库</Button>
          <Button icon={<UploadOutlined />} onClick={handleExport}>导出</Button>
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

      {/* Manual Inbound Modal */}
      <Modal
        title="手动入库"
        open={addModalVisible}
        onCancel={() => setAddModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setAddModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleManualInbound}>保存</Button>,
        ]}
        width={700}
      >
        <Form form={addForm} layout="vertical" initialValues={{ quantity: 1 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="扫描条码" name="barcode" rules={[{ required: true, message: '请扫描或输入条码' }]}>
                <Input 
                  ref={barcodeInputRef}
                  placeholder="请扫描条码" 
                  prefix={<span style={{ color: '#8C8C8C' }}>📷</span>}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="试剂/耗材名称" name="name" rules={[{ required: true, message: '请输入或选择名称' }]}>
                <Select placeholder="请选择或输入" showSearch allowClear>
                  <Option value="dmem">DMEM培养基</Option>
                  <Option value="fbs">胎牛血清</Option>
                  <Option value="trypsin">胰蛋白酶</Option>
                  <Option value="pbs">PBS缓冲液</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="批次号" name="batch">
                <Input placeholder="请输入批次号" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="供应商" name="supplier">
                <Select placeholder="请选择供应商">
                  <Option value="sigma">西格玛奥德里奇</Option>
                  <Option value="thermo">赛默飞世尔</Option>
                  <Option value="biyuntian">碧云天</Option>
                  <Option value="aladdin">阿拉丁试剂</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="生产日期" name="productionDate">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="有效期至" name="expiryDate" rules={[{ required: true, message: '请选择有效期' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="入库数量" name="quantity" rules={[{ required: true, message: '请输入入库数量' }]}>
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="存放位置" name="location" rules={[{ required: true, message: '请选择存放位置' }]}>
                <Select placeholder="请选择">
                  <Option value="A01">货架A01</Option>
                  <Option value="A02">货架A02</Option>
                  <Option value="fridge2">冰箱2号</Option>
                  <Option value="hazardous">危化品柜</Option>
                  <Option value="B01">货架B01</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

      {/* Detail Modal */}
      <Modal
        title="入库详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {currentRecord && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}>
              <div><span style={{ color: '#8C8C8C' }}>入库单号：</span><span style={{ color: '#262626' }}>{currentRecord.id}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>条码：</span><span style={{ color: '#262626' }}>{currentRecord.barcode}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>名称：</span><span style={{ color: '#262626' }}>{currentRecord.name}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>批次：</span><span style={{ color: '#262626' }}>{currentRecord.batch}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>数量：</span><span style={{ color: '#262626' }}>{currentRecord.quantity}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>供应商：</span><span style={{ color: '#262626' }}>{currentRecord.supplier}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>有效期：</span><span style={{ color: '#262626' }}>{currentRecord.expiryDate}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>存放位置：</span><span style={{ color: '#262626' }}>{currentRecord.location}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>入库时间：</span><span style={{ color: '#262626' }}>{currentRecord.inboundTime}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>操作员：</span><span style={{ color: '#262626' }}>{currentRecord.operator}</span></div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}