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
  InputNumber
} from 'antd'
import {
  PlusOutlined,
  EyeOutlined,
  PrinterOutlined,
  ScanOutlined,
  DownOutlined,
  UpOutlined
} from '@ant-design/icons'
import { useThemeStore } from '../../../store/themeStore'

const { RangePicker } = DatePicker
const { Option } = Select

interface InboundRecord {
  id: string
  inboundNo: string
  barcode: string
  chemicalName: string
  casNumber: string
  batchNo: string
  quantity: number
  unit: string
  supplier: string
  validUntil: string
  storageLocation: string
  inboundTime: string
  firstSigner: string
  secondSigner: string
  operator: string
}

const generateMockData = (): InboundRecord[] => {
  const operators = ['张三', '李四', '王五', '赵六', '钱七', '孙八']
  const suppliers = ['国药集团', '阿拉丁', 'Sigma', '默克', '百灵威']
  const storageLocations = ['危化品柜A01', '危化品柜A02', '危化品柜B01', '危化品柜B02', '危化品柜C01', '危化品柜C02']
  const units = ['kg', 'L', '瓶', 'g', 'mL']
  const chemicals = [
    { name: '丙酮', cas: '67-64-1' },
    { name: '浓硫酸', cas: '7664-93-9' },
    { name: '硝酸钾', cas: '7757-79-1' },
    { name: '乙醇', cas: '64-17-5' },
    { name: '甲醇', cas: '67-56-1' },
    { name: '氢氧化钠', cas: '1310-73-2' },
    { name: '盐酸', cas: '7647-01-0' },
    { name: '过氧化氢', cas: '7722-84-1' },
    { name: '甲苯', cas: '108-88-3' },
    { name: '乙醚', cas: '60-29-7' },
    { name: '高锰酸钾', cas: '7722-64-7' },
    { name: '氨水', cas: '1336-21-6' },
    { name: '甲醛', cas: '50-00-0' },
    { name: '氯仿', cas: '67-66-3' },
    { name: '四氢呋喃', cas: '109-99-9' },
    { name: '乙酸乙酯', cas: '141-78-6' },
    { name: '正己烷', cas: '110-54-3' },
    { name: '三氯甲烷', cas: '67-66-3' },
    { name: '硝酸', cas: '7697-37-2' },
    { name: '硫酸亚铁', cas: '7720-78-7' }
  ]

  return Array.from({ length: 100 }, (_, i) => {
    const chemical = chemicals[i % chemicals.length]
    const month = 1 + (i % 12)
    const day = 10 + (i % 15)
    const hour = 9 + (i % 6)
    const minute = Math.floor(Math.random() * 60)
    
    return {
      id: `${i + 1}`,
      inboundNo: `RK-2024-${String(i + 1).padStart(3, '0')}`,
      barcode: `BAR-${String(i + 1).padStart(3, '0')}-0001`,
      chemicalName: chemical.name,
      casNumber: chemical.cas,
      batchNo: `B2024${String(month).padStart(2, '0')}${String(day).padStart(2, '0')}`,
      quantity: Math.floor(Math.random() * 50) + 1,
      unit: units[i % units.length],
      supplier: suppliers[i % suppliers.length],
      validUntil: `2025-${String(month).padStart(2, '0')}-${String(Math.min(day + 15, 28)).padStart(2, '0')}`,
      storageLocation: storageLocations[i % storageLocations.length],
      inboundTime: `2024-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')} ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}:00`,
      firstSigner: operators[i % operators.length],
      secondSigner: operators[(i + 1) % operators.length],
      operator: operators[(i + 2) % operators.length]
    }
  })
}

const mockData: InboundRecord[] = generateMockData()

const storageLocations = ['危化品柜A01', '危化品柜A02', '危化品柜B01', '危化品柜B02', '危化品柜C01', '危化品柜C02']

const unitOptions = ['kg', 'L', '瓶', 'g', 'mL']

const suppliers = ['国药集团', '阿拉丁', 'Sigma', '默克', '百灵威']

const chemicalList = [
  { name: '丙酮', cas: '67-64-1' },
  { name: '浓硫酸', cas: '7664-93-9' },
  { name: '硝酸钾', cas: '7757-79-1' },
  { name: '乙醇', cas: '64-17-5' },
  { name: '甲醇', cas: '67-56-1' },
  { name: '氢氧化钠', cas: '1310-73-2' }
]

export default function HazardousInbound() {
  const { isDark } = useThemeStore()
  const [data, setData] = useState<InboundRecord[]>(mockData)
  const [visible, setVisible] = useState(false)
  const [detailVisible, setDetailVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<InboundRecord | null>(null)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [scannedBarcode, setScannedBarcode] = useState('')
  const [expanded, setExpanded] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const handleBarcodeScan = (value: string) => {
    setScannedBarcode(value)
    const matchedChemical = chemicalList[Math.floor(Math.random() * chemicalList.length)]
    form.setFieldValue('chemicalName', matchedChemical.name)
    form.setFieldValue('casNumber', matchedChemical.cas)
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      const newRecord: InboundRecord = {
        id: `${Date.now()}`,
        inboundNo: `RK-${new Date().getFullYear()}-${String(data.length + 1).padStart(3, '0')}`,
        barcode: values.barcode || `BAR-${String(data.length + 1).padStart(3, '0')}-0001`,
        chemicalName: values.chemicalName,
        casNumber: values.casNumber,
        batchNo: values.batchNo || `B${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}`,
        quantity: values.quantity,
        unit: values.unit,
        supplier: values.supplier,
        validUntil: values.validUntil,
        storageLocation: values.storageLocation,
        inboundTime: new Date().toLocaleString('zh-CN'),
        firstSigner: '当前用户',
        secondSigner: '另一签字人',
        operator: '当前用户'
      }
      setData([newRecord, ...data])
      setVisible(false)
      form.resetFields()
      setScannedBarcode('')
      message.success('入库成功')
    }).catch(err => {
      message.error('表单验证失败')
    })
  }

  const handlePrintLabel = (record: InboundRecord) => {
    message.info(`打印标签: ${record.inboundNo}`)
  }

  const columns = [
    { title: '入库单号', dataIndex: 'inboundNo', key: 'inboundNo', width: 120 },
    { title: '条码', dataIndex: 'barcode', key: 'barcode', width: 130 },
    { title: '危化品名称', dataIndex: 'chemicalName', key: 'chemicalName' },
    { title: 'CAS号', dataIndex: 'casNumber', key: 'casNumber', width: 100 },
    { title: '批次号', dataIndex: 'batchNo', key: 'batchNo', width: 100 },
    { title: '数量', dataIndex: 'quantity', key: 'quantity', width: 80, render: (qty: number, record: InboundRecord) => `${qty} ${record.unit}` },
    { title: '供应商', dataIndex: 'supplier', key: 'supplier', width: 120 },
    { title: '有效期至', dataIndex: 'validUntil', key: 'validUntil', width: 100 },
    { title: '存放位置', dataIndex: 'storageLocation', key: 'storageLocation', width: 100 },
    { title: '入库时间', dataIndex: 'inboundTime', key: 'inboundTime', width: 150 },
    { title: '第一签字人', dataIndex: 'firstSigner', key: 'firstSigner', width: 90 },
    { title: '第二签字人', dataIndex: 'secondSigner', key: 'secondSigner', width: 90 },
    { title: '操作员', dataIndex: 'operator', key: 'operator', width: 80 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 280,
      render: (_, record: InboundRecord) => (
        <Space size="small">
          <Button type="text" icon={<EyeOutlined />} onClick={() => { setCurrentRecord(record); setDetailVisible(true) }}>查看详情</Button>
          <Button type="text" icon={<PrinterOutlined />} onClick={() => handlePrintLabel(record)}>打印标签</Button>
        </Space>
      )
    }
  ]

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>入库管理</h1>

      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="入库单号" name="inboundNo"><Input placeholder="请输入入库单号" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="危化品名称" name="chemicalName"><Input placeholder="请输入危化品名称" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="入库日期" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="存放位置" name="storageLocation">
                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                      <Option value="">全部</Option>
                      {storageLocations.map(location => (
                        <Option key={location} value={location}>{location}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="供应商" name="supplier">
                    <Select placeholder="请选择" style={{ width: '100%' }} allowClear>
                      <Option value="">全部</Option>
                      {suppliers.map(supplier => (
                        <Option key={supplier} value={supplier}>{supplier}</Option>
                      ))}
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
                <Form.Item label="入库单号" name="inboundNo"><Input placeholder="请输入入库单号" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="危化品名称" name="chemicalName"><Input placeholder="请输入危化品名称" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="入库日期" name="dateRange">
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
        <div style={{ display: 'flex', justifyContent: 'flex-start', gap: 10, marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setVisible(true)}>手动入库</Button>
          <Button disabled={selectedRows.length === 0} onClick={() => message.info('导出选中数据')}>导出</Button>
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

      <Modal
        title="手动入库"
        visible={visible}
        onCancel={() => { setVisible(false); form.resetFields(); setScannedBarcode('') }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="barcode" label="扫描条码">
            <Input
              placeholder="扫描条码（自动聚焦，支持连续扫码）"
              autoFocus
              value={scannedBarcode}
              onChange={(e) => handleBarcodeScan(e.target.value)}
              prefix={<ScanOutlined />}
            />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="chemicalName" label="危化品名称" rules={[{ required: true, message: '请选择危化品名称' }]}>
                <Select placeholder="请选择或手动输入">
                  {chemicalList.map(chemical => (
                    <Option key={chemical.cas} value={chemical.name}>{chemical.name}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="casNumber" label="CAS号" rules={[{ required: true, message: '请输入CAS号' }]}>
                <Input placeholder="CAS号" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="batchNo" label="批次号">
                <Input placeholder="自动生成或手动输入" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="supplier" label="供应商" rules={[{ required: true, message: '请选择供应商' }]}>
                <Select placeholder="请选择供应商">
                  {suppliers.map(supplier => (
                    <Option key={supplier} value={supplier}>{supplier}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="productionDate" label="生产日期">
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="validUntil" label="有效期至" rules={[{ required: true, message: '请选择有效期至' }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="quantity" label="入库数量" rules={[{ required: true, type: 'number', min: 1, message: '请输入入库数量' }]}>
                <InputNumber placeholder="数量" />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="unit" label="单位" rules={[{ required: true, message: '请选择单位' }]}>
                <Select placeholder="请选择单位">
                  {unitOptions.map(unit => (
                    <Option key={unit} value={unit}>{unit}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="storageLocation" label="存放位置" rules={[{ required: true, message: '请选择存放位置' }]}>
                <Select placeholder="请选择存放位置">
                  {storageLocations.map(location => (
                    <Option key={location} value={location}>{location}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 16, marginTop: 24 }}>
            <Button onClick={() => { setVisible(false); form.resetFields(); setScannedBarcode('') }}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>确认入库</Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="查看详情"
        visible={detailVisible}
        onCancel={() => setDetailVisible(false)}
        footer={null}
        width={600}
      >
        {currentRecord && (
          <div>
            <Row gutter={16}>
              <Col span={12}>入库单号：{currentRecord.inboundNo}</Col>
              <Col span={12}>条码：{currentRecord.barcode}</Col>
              <Col span={12}>危化品名称：{currentRecord.chemicalName}</Col>
              <Col span={12}>CAS号：{currentRecord.casNumber}</Col>
              <Col span={12}>批次号：{currentRecord.batchNo}</Col>
              <Col span={12}>数量：{currentRecord.quantity} {currentRecord.unit}</Col>
              <Col span={12}>供应商：{currentRecord.supplier}</Col>
              <Col span={12}>有效期至：{currentRecord.validUntil}</Col>
              <Col span={12}>存放位置：{currentRecord.storageLocation}</Col>
              <Col span={12}>入库时间：{currentRecord.inboundTime}</Col>
              <Col span={12}>第一签字人：{currentRecord.firstSigner}</Col>
              <Col span={12}>第二签字人：{currentRecord.secondSigner}</Col>
              <Col span={12}>操作员：{currentRecord.operator}</Col>
            </Row>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
              <Button icon={<PrinterOutlined />} onClick={() => handlePrintLabel(currentRecord)}>打印标签</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
