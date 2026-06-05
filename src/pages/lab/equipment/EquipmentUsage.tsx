import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space, Tag, message, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker

export default function EquipmentUsage() {
  const { isDark } = useThemeStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('手动录入')
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [_selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)

  const statusColors: Record<string, string> = {
    '正常': 'green',
    '异常': 'red'
  }

  const columns = [
    { title: '记录ID', dataIndex: 'id', key: 'id' },
    { title: '设备名称', dataIndex: 'equipmentName', key: 'equipmentName' },
    { title: '使用人', dataIndex: 'user', key: 'user' },
    { title: '项目名称', dataIndex: 'projectName', key: 'projectName' },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime' },
    { 
      title: '运行状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: (s: string) => <Tag color={statusColors[s] || 'default'}>{s}</Tag> 
    },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
    { 
      title: '操作', 
      key: 'action', 
      fixed: 'right' as const,
      width: 160,
      render: (_, record: any) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" icon={<DeleteOutlined />} style={{ color: '#FF4D4F' }} onClick={() => handleDelete(record)}>删除</Button>
        </div>
      ) 
    },
  ]

  const equipmentList = Array.from({ length: 8 }, (_, i) => {
    const names = ['离心机', 'PCR仪', '流式细胞仪', '显微镜', '分光光度计', '高压灭菌锅', 'CO2培养箱', '超低温冰箱']
    return {
      key: String(i + 1),
      id: `EQ-${String(i + 1).padStart(4, '0')}`,
      name: names[i]
    }
  })

  const data = Array.from({ length: 30 }, (_, i) => {
    const statuses = ['正常', '正常', '正常', '正常', '异常']
    const users = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
    const projects = ['肿瘤标志物研究', '基因测序', '细胞培养实验', '药物筛选', 'PCR扩增']
    const hour = 8 + (i % 10)
    return {
      key: String(i + 1),
      id: `USE-${String(i + 1).padStart(4, '0')}`,
      equipmentId: `EQ-${String((i % 8) + 1).padStart(4, '0')}`,
      equipmentName: equipmentList[i % 8].name,
      user: users[i % users.length],
      projectName: projects[i % projects.length],
      startTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(hour).padStart(2, '0')}:00`,
      endTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(hour + 2 + (i % 4)).padStart(2, '0')}:00`,
      status: statuses[i % statuses.length],
      remark: i % 3 === 0 ? '设备运行良好' : '',
    }
  })

  const handleCreate = () => {
    setModalTitle('手动录入')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setModalTitle('编辑使用记录')
    form.resetFields()
    form.setFieldsValue({
      equipment: record.equipmentId,
      user: record.user,
      projectName: record.projectName,
      startTime: record.startTime ? new Date(record.startTime) : null,
      endTime: record.endTime ? new Date(record.endTime) : null,
      status: record.status,
      remark: record.remark,
    })
    setIsModalVisible(true)
  }

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定删除使用记录【${record.id}】吗？`,
      onOk: () => message.success('删除成功'),
    })
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      message.success('保存成功')
      setIsModalVisible(false)
    })
  }

  const handleExport = () => {
    message.success('导出使用记录')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>使用记录</h1>
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="设备名称" name="equipment">
                    <Select placeholder="请选择设备" style={{ width: '100%' }} allowClear>
                      {equipmentList.map(eq => (
                        <Option key={eq.id} value={eq.id}>{eq.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="使用人" name="user">
                    <Input placeholder="请输入使用人" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="使用日期" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="关联项目" name="project">
                    <Input placeholder="请输入关联项目" />
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
                <Form.Item label="设备名称" name="equipment">
                  <Select placeholder="请选择设备" style={{ width: '100%' }} allowClear>
                    {equipmentList.map(eq => (
                      <Option key={eq.id} value={eq.id}>{eq.name}</Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="使用人" name="user">
                  <Input placeholder="请输入使用人" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="使用日期" name="dateRange">
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

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>手动录入</Button>
            <Button onClick={handleExport}>导出</Button>
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
        onCancel={() => setIsModalVisible(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="设备" name="equipment" rules={[{ required: true, message: '请选择设备' }]}>
            <Select placeholder="请选择设备">
              {equipmentList.map(eq => (
                <Option key={eq.id} value={eq.id}>{eq.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="使用人" name="user" rules={[{ required: true, message: '请输入使用人' }]}>
            <Input placeholder="请输入使用人" />
          </Form.Item>
          <Form.Item label="项目名称" name="projectName" rules={[{ required: true, message: '请输入项目名称' }]}>
            <Input placeholder="请输入项目名称" />
          </Form.Item>
          <Form.Item label="开始时间" name="startTime" rules={[{ required: true, message: '请选择开始时间' }]}>
            <DatePicker showTime style={{ width: '100%' }} placeholder="请选择开始时间" />
          </Form.Item>
          <Form.Item label="结束时间" name="endTime" rules={[{ required: true, message: '请选择结束时间' }]}>
            <DatePicker showTime style={{ width: '100%' }} placeholder="请选择结束时间" />
          </Form.Item>
          <Form.Item label="运行状态" name="status" rules={[{ required: true, message: '请选择运行状态' }]} initialValue="正常">
            <Select placeholder="请选择运行状态">
              <Option value="正常">正常</Option>
              <Option value="异常">异常</Option>
            </Select>
          </Form.Item>
          <Form.Item label="异常描述" name="exceptionDesc">
            <Input.TextArea placeholder="请输入异常描述" rows={3} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入备注" rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
