import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Row, Col, InputNumber, Space, message, Statistic } from 'antd'
import { SearchOutlined, ShoppingCartOutlined, DownOutlined, UpOutlined, ExportOutlined, WarningOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker

export default function ReagentWarning() {
  const { isDark } = useThemeStore()
  const [searchForm] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<any[]>([])
  const [expanded, setExpanded] = useState(false)
  const [purchaseModalVisible, setPurchaseModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)

  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      '低于阈值': 'orange',
      '严重缺货': 'red',
      '已过期': 'red',
      '即将过期': 'gold'
    }
    return colorMap[status] || 'default'
  }

  const columns = [
    { title: '物料名称', dataIndex: 'materialName', key: 'materialName' },
    { title: '规格', dataIndex: 'spec', key: 'spec' },
    { title: '当前库存', dataIndex: 'stock', key: 'stock', render: (val: number, record: any) => (
      <span style={{ 
        color: val <= record.threshold * 0.5 ? '#ff4d4f' : val <= record.threshold ? '#faad14' : 'inherit',
        fontWeight: 600 
      }}>
        {val}
      </span>
    ) },
    { title: '阈值', dataIndex: 'threshold', key: 'threshold' },
    { title: '缺货数量', dataIndex: 'shortage', key: 'shortage', render: (val: number) => (
      val > 0 ? <span style={{ color: '#ff4d4f', fontWeight: 600 }}>{val}</span> : '-'
    ) },
    { title: '建议采购量', dataIndex: 'suggestedPurchase', key: 'suggestedPurchase', render: (val: number) => (
      val > 0 ? <span style={{ color: '#52c41a', fontWeight: 600 }}>{val}</span> : '-'
    ) },
    { title: '最后采购日期', dataIndex: 'lastPurchaseDate', key: 'lastPurchaseDate' },
    { title: '库存状态', dataIndex: 'status', key: 'status', render: (status: string) => (
      <Tag color={getStatusColor(status)}>{status}</Tag>
    ) },
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 180, render: (_: any, record: any) => (
      <Button 
        type="text" 
        icon={<ShoppingCartOutlined />} 
        style={{ color: '#1890ff' }}
        onClick={() => handleGeneratePurchase(record)}
      >
        一键生成采购申请
      </Button>
    ) },
  ]

  const data = Array.from({ length: 50 }, (_, i) => {
    const statuses = ['低于阈值', '严重缺货', '即将过期', '已过期']
    const materials = ['胰蛋白酶', '胎牛血清', 'DMEM培养基', '青霉素-链霉素', 'PBS缓冲液', 'L-谷氨酰胺', 'DMSO', '甘油']
    const specs = ['100mg', '100ml', '500ml', '100ml', '1L', '250ml', '50ml', '10mg']
    const units = ['支', '瓶', '瓶', '瓶', '瓶', '瓶', 'ml', 'g']
    const locations = ['货架A01', '货架A02', '冰箱2号', '危化品柜', '常温库B01']
    const threshold = 10 + Math.floor(Math.random() * 15)
    const stock = 1 + Math.floor(Math.random() * (threshold - 1))
    const shortage = Math.max(0, threshold - stock)
    const suggestedPurchase = shortage > 0 ? Math.max(threshold * 2, shortage + 5) : 0
    return {
      key: String(i + 1),
      id: `MAT${String(i + 1).padStart(6, '0')}`,
      materialName: materials[i % materials.length],
      spec: specs[i % specs.length],
      unit: units[i % units.length],
      stock,
      threshold,
      shortage,
      suggestedPurchase,
      lastPurchaseDate: `2024-0${1 + (i % 8)}-${String(5 + (i % 15)).padStart(2, '0')}`,
      status: statuses[i % statuses.length],
      location: locations[i % locations.length],
      supplier: ['西格玛奥德里奇', '赛默飞世尔', '碧云天'][i % 3],
      category: ['试剂', '耗材', '试剂'][i % 3]
    }
  })

  const stats = {
    totalWarning: data.length,
    lowStock: data.filter(item => item.status === '低于阈值').length,
    criticalStock: data.filter(item => item.status === '严重缺货').length,
    expiring: data.filter(item => item.status === '即将过期' || item.status === '已过期').length
  }

  const handleGeneratePurchase = (record: any) => {
    setCurrentRecord(record)
    setPurchaseModalVisible(true)
  }

  const handleGeneratePurchaseSubmit = () => {
    message.success('采购申请已生成')
    setPurchaseModalVisible(false)
  }

  const handleExport = () => {
    if (selectedRows.length === 0) {
      message.warning('请先选择要导出的记录')
      return
    }
    message.success(`已导出 ${selectedRows.length} 条记录`)
  }

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>库存预警</h1>
      
      {/* Statistics Cards */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic 
              title="预警总数" 
              value={stats.totalWarning} 
              prefix={<WarningOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic 
              title="低于阈值" 
              value={stats.lowStock} 
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic 
              title="严重缺货" 
              value={stats.criticalStock} 
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 8, textAlign: 'center' }}>
            <Statistic 
              title="即将/已过期" 
              value={stats.expiring} 
              valueStyle={{ color: '#ff4d4f' }}
            />
          </Card>
        </Col>
      </Row>
      
      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="物料名称" name="materialName"><Input placeholder="请输入物料名称" /></Form.Item>
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
                  <Form.Item label="库存状态" name="status">
                    <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
                      <Option value="all">全部</Option>
                      <Option value="low">低于阈值</Option>
                      <Option value="critical">严重缺货</Option>
                      <Option value="expired">已过期</Option>
                      <Option value="expiring">即将过期</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="物料分类" name="category">
                    <Select placeholder="请选择分类" style={{ width: '100%' }} allowClear>
                      <Option value="all">全部</Option>
                      <Option value="reagent">试剂</Option>
                      <Option value="consumable">耗材</Option>
                      <Option value="hazardous">危化品</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="供应商" name="supplier">
                    <Select placeholder="请选择供应商" style={{ width: '100%' }} allowClear>
                      <Option value="all">全部</Option>
                      <Option value="sigma">西格玛奥德里奇</Option>
                      <Option value="thermo">赛默飞世尔</Option>
                      <Option value="biyuntian">碧云天</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={18} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary">查询</Button>
                  <Button onClick={() => searchForm.resetFields()} className="reset-btn">重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={16} style={{ height: 32 }}>
              <Col span={6}>
                <Form.Item label="物料名称" name="materialName"><Input placeholder="请输入物料名称" /></Form.Item>
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
                <Form.Item label="库存状态" name="status">
                  <Select placeholder="请选择状态" style={{ width: '100%' }} allowClear>
                    <Option value="all">全部</Option>
                    <Option value="low">低于阈值</Option>
                    <Option value="critical">严重缺货</Option>
                    <Option value="expired">已过期</Option>
                    <Option value="expiring">即将过期</Option>
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
          rowKey="key" 
          pagination={{ pageSize: 10 }}
          rowSelection={{
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRows(selectedRows)
            }
          }}
        />
      </Card>

      {/* Generate Purchase Modal */}
      <Modal
        title="生成采购申请"
        open={purchaseModalVisible}
        onCancel={() => setPurchaseModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setPurchaseModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleGeneratePurchaseSubmit}>保存</Button>,
        ]}
        width={600}
      >
        {currentRecord && (
          <Form layout="vertical">
            <div style={{ marginBottom: 16, padding: 12, backgroundColor: '#FAFAFA', borderRadius: 6 }}>
              <p style={{ margin: 0 }}><strong>物料名称：</strong>{currentRecord.materialName}</p>
              <p style={{ margin: 0 }}><strong>规格：</strong>{currentRecord.spec}</p>
              <p style={{ margin: 0 }}><strong>当前库存：</strong>{currentRecord.stock} {currentRecord.unit}</p>
              <p style={{ margin: 0 }}><strong>阈值：</strong>{currentRecord.threshold} {currentRecord.unit}</p>
              <p style={{ margin: 0 }}><strong>缺货数量：</strong><span style={{ color: '#ff4d4f', fontWeight: 600 }}>{currentRecord.shortage}</span> {currentRecord.unit}</p>
              <p style={{ margin: 0 }}><strong>建议采购量：</strong><span style={{ color: '#52c41a', fontWeight: 600 }}>{currentRecord.suggestedPurchase}</span> {currentRecord.unit}</p>
            </div>
            
            <Form.Item label="采购主题" name="subject" initialValue={`${currentRecord.materialName} 采购`} rules={[{ required: true, message: '请输入采购主题' }]}>
              <Input placeholder="请输入采购主题" />
            </Form.Item>
            
            <Form.Item label="采购数量" name="quantity" initialValue={currentRecord.suggestedPurchase} rules={[{ required: true, message: '请输入采购数量' }]}>
              <InputNumber min={1} style={{ width: '100%' }} placeholder="采购数量" />
            </Form.Item>
            
            <Form.Item label="期望到货日期" name="expectedDate">
              <DatePicker style={{ width: '100%' }} />
            </Form.Item>
            
            <Form.Item label="备注" name="remark">
              <Input.TextArea rows={3} placeholder="请输入备注" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}