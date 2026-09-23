import { Card, Table, Tag, Button, Space, Input, Select, Modal, Form, DatePicker, InputNumber, message, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, QrcodeOutlined, HistoryOutlined, DownOutlined, UpOutlined, ExportOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../../store/themeStore'
import { useState, useEffect } from 'react'

const { Option } = Select

export default function EquipmentArchive() {
  const { isDark } = useThemeStore()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isQrModalVisible, setIsQrModalVisible] = useState(false)
  const [isHistoryModalVisible, setIsHistoryModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增设备')
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [expanded, setExpanded] = useState(false)

  const columns = [
    { title: '设备ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '型号', dataIndex: 'model', key: 'model' },
    { title: '序列号', dataIndex: 'serialNumber', key: 'serialNumber' },
    { title: '生产厂商', dataIndex: 'manufacturer', key: 'manufacturer' },
    { title: '购置日期', dataIndex: 'purchaseDate', key: 'purchaseDate' },
    { title: '位置', dataIndex: 'location', key: 'location' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => {
      const colors: Record<string, string> = { '正常': 'green', '维修': 'orange', '报废': 'red', '闲置': 'gray' }
      return <Tag color={colors[s] || 'default'}>{s}</Tag>
    }},
    { title: '二维码', dataIndex: 'qrcode', key: 'qrcode', render: () => <QrcodeOutlined style={{ cursor: 'pointer' }} /> },
    { title: '操作', key: 'action', fixed: 'right' as const, width: 280, render: (_: any, record: any) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
        <Button type="text" icon={<DeleteOutlined />} style={{ color: '#FF4D4F' }} onClick={() => handleDelete(record)}>删除</Button>
        <Button type="text" icon={<QrcodeOutlined />} onClick={() => handleViewQrcode()}>查看二维码</Button>
        <Button type="text" icon={<HistoryOutlined />} onClick={() => handleViewHistory()}>状态变更历史</Button>
      </div>
    )},
  ]

  const historyColumns = [
    { title: '变更时间', dataIndex: 'changeTime', key: 'changeTime' },
    { title: '变更前状态', dataIndex: 'oldStatus', key: 'oldStatus' },
    { title: '变更后状态', dataIndex: 'newStatus', key: 'newStatus' },
    { title: '变更人', dataIndex: 'operator', key: 'operator' },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
  ]

  const data = Array.from({ length: 20 }, (_, i) => {
    const statuses = ['正常', '维修', '报废', '闲置']
    const names = ['离心机', 'PCR仪', '流式细胞仪', '显微镜', '分光光度计', '高压灭菌锅', 'CO2培养箱', '超低温冰箱']
    const models = ['Centrifuge-900', 'PCR-1000', 'FACS-Calibur', 'BX53', 'NanoDrop-2000', 'HVE-50', 'HERAcell-240i', 'DW-86L626']
    const locations = ['实验室A101', '实验室A102', '实验室B201', '实验室B202', '中心实验室']
    const manufacturers = ['Thermo Fisher', 'Bio-Rad', 'BD', 'Olympus', 'Eppendorf', 'SANYO']
    return {
      key: String(i + 1),
      id: `EQ-${String(i + 1).padStart(4, '0')}`,
      name: names[i % names.length] + (i > 7 ? `${Math.floor(i / 8) + 1}号` : ''),
      model: models[i % models.length] + (i > 7 ? `-${Math.floor(i / 8) + 1}` : ''),
      serialNumber: `SN${10000 + i}`,
      manufacturer: manufacturers[i % manufacturers.length],
      purchaseDate: `2024-${String(1 + (i % 12)).padStart(2, '0')}-${String(10 + (i % 20)).padStart(2, '0')}`,
      location: locations[i % locations.length],
      status: statuses[i % statuses.length],
    }
  })

  const historyData = Array.from({ length: 5 }, (_, i) => {
    const statuses = ['正常', '维修', '报废', '闲置']
    return {
      key: String(i + 1),
      changeTime: `2024-${String(1 + (i % 12)).padStart(2, '0')}-${String(10 + (i % 20)).padStart(2, '0')} 10:30:00`,
      oldStatus: statuses[i % statuses.length],
      newStatus: statuses[(i + 1) % statuses.length],
      operator: '管理员',
      remark: i % 2 === 0 ? '定期维护' : '设备检修',
    }
  })

  const handleCreate = () => {
    setModalTitle('新增设备')
    form.resetFields()
    setIsModalVisible(true)
  }

  const [editRecord, setEditRecord] = useState<any>(null)

  useEffect(() => {
    if (editRecord && isModalVisible) {
      form.resetFields()
      setTimeout(() => {
        const dataToSet = {
          ...editRecord,
          purchaseDate: editRecord.purchaseDate ? new Date(editRecord.purchaseDate) : null,
        }
        form.setFieldsValue(dataToSet)
      }, 100)
    }
  }, [editRecord, isModalVisible, form])

  const handleEdit = (record: any) => {
    setModalTitle('编辑设备')
    setEditRecord(record)
    setIsModalVisible(true)
  }

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定删除设备【${record.name}】吗？`,
      onOk: () => message.success('删除成功'),
    })
  }

  const handleViewQrcode = () => {
    setIsQrModalVisible(true)
  }

  const handleViewHistory = () => {
    setIsHistoryModalVisible(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(_values => {
      message.success('保存成功')
      setIsModalVisible(false)
    })
  }

  const handleExport = () => {
    message.success('导出设备清单')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>设备档案</h1>
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="设备名称" name="name"><Input placeholder="请输入设备名称" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="设备编号" name="code"><Input placeholder="请输入设备编号" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="设备状态" name="status">
                    <Select placeholder="请选择设备状态" options={[
                      { value: '正常', label: '正常' },
                      { value: '维修', label: '维修' },
                      { value: '报废', label: '报废' },
                      { value: '闲置', label: '闲置' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="位置" name="location">
                    <Select placeholder="请选择位置" options={[
                      { value: '实验室A101', label: '实验室A101' },
                      { value: '实验室A102', label: '实验室A102' },
                      { value: '实验室B201', label: '实验室B201' },
                      { value: '实验室B202', label: '实验室B202' },
                      { value: '中心实验室', label: '中心实验室' },
                    ]} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="生产厂商" name="manufacturer">
                    <Select placeholder="请选择生产厂商" options={[
                      { value: 'Thermo Fisher', label: 'Thermo Fisher' },
                      { value: 'Bio-Rad', label: 'Bio-Rad' },
                      { value: 'BD', label: 'BD' },
                      { value: 'Olympus', label: 'Olympus' },
                      { value: 'Eppendorf', label: 'Eppendorf' },
                      { value: 'SANYO', label: 'SANYO' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="购置日期" name="purchaseDate">
                    <DatePicker style={{ width: '100%' }} />
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
                <Form.Item label="设备名称" name="name"><Input placeholder="请输入设备名称" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="设备编号" name="code"><Input placeholder="请输入设备编号" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="设备状态" name="status">
                  <Select placeholder="请选择设备状态" options={[
                    { value: '正常', label: '正常' },
                    { value: '维修', label: '维修' },
                    { value: '报废', label: '报废' },
                    { value: '闲置', label: '闲置' },
                  ]} />
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

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增设备</Button>
            <Button type="primary" icon={<ExportOutlined />} disabled={selectedRows.length === 0} className="export-btn" onClick={handleExport}>导出设备清单</Button>
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={data}
          scroll={{ x: 'max-content' }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
        />
      </Card>

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false)
          setEditRecord(null)
        }}
        width={600}
      >
        <Form 
          form={form} 
          layout="vertical"
        >
          <Form.Item label="设备名称" name="name" rules={[{ required: true, message: '请输入设备名称' }]}>
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item label="型号" name="model" rules={[{ required: true, message: '请输入型号' }]}>
            <Input placeholder="请输入型号" />
          </Form.Item>
          <Form.Item label="序列号" name="serialNumber" rules={[{ required: true, message: '请输入序列号' }]}>
            <Input placeholder="请输入序列号" />
          </Form.Item>
          <Form.Item label="生产厂商" name="manufacturer" rules={[{ required: true, message: '请输入生产厂商' }]}>
            <Input placeholder="请输入生产厂商" />
          </Form.Item>
          <Form.Item label="购置日期" name="purchaseDate" rules={[{ required: true, message: '请选择购置日期' }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="位置" name="location" rules={[{ required: true, message: '请选择位置' }]}>
            <Select placeholder="请选择位置">
              <Option value="实验室A101">实验室A101</Option>
              <Option value="实验室A102">实验室A102</Option>
              <Option value="实验室B201">实验室B201</Option>
              <Option value="实验室B202">实验室B202</Option>
              <Option value="中心实验室">中心实验室</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue="正常">
            <Select placeholder="请选择状态">
              <Option value="正常">正常</Option>
              <Option value="维修">维修</Option>
              <Option value="报废">报废</Option>
              <Option value="闲置">闲置</Option>
            </Select>
          </Form.Item>
          <Form.Item label="设备参数" name="params">
            <Input.TextArea placeholder="请输入设备参数" rows={3} />
          </Form.Item>
          <Form.Item label="维护周期" name="maintenanceCycle">
            <InputNumber placeholder="请输入维护周期（天）" style={{ width: '100%' }} min={1} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="查看二维码"
        open={isQrModalVisible}
        onCancel={() => setIsQrModalVisible(false)}
        footer={[
          <Button key="download">下载二维码</Button>,
          <Button key="close" onClick={() => setIsQrModalVisible(false)}>关闭</Button>,
        ]}
      >
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ width: 200, height: 200, backgroundColor: '#f0f0f0', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <QrcodeOutlined style={{ fontSize: 120, color: '#999' }} />
          </div>
          <p style={{ marginTop: 16, color: '#666' }}>设备二维码（示例）</p>
        </div>
      </Modal>

      <Modal
        title="状态变更历史"
        open={isHistoryModalVisible}
        onCancel={() => setIsHistoryModalVisible(false)}
        footer={null}
        width={800}
      >
        <Table columns={historyColumns} dataSource={historyData} pagination={false} />
      </Modal>
    </div>
  )
}
