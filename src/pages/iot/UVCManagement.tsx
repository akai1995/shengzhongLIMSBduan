import { Card, Statistic, Row, Col, Tag, Table, Button, Modal, Form, Input, Select, Checkbox, message } from 'antd'
import { PlusOutlined, PoweroffOutlined, PlayCircleOutlined } from '@ant-design/icons'
import { useState, useMemo } from 'react'

const { Option } = Select

interface DeviceData {
  key: string
  name: string
  location: string
  status: 'running' | 'closed'
  startTime: string
  closeTime: string
  runDuration: string
}

export default function UVCManagement() {
  const [modalVisible, setModalVisible] = useState(false)
  const [form] = Form.useForm()
  const [selectedKeys, setSelectedKeys] = useState<string[]>([])

  const [deviceData] = useState<DeviceData[]>([
    { key: '1', name: '紫外线消毒灯-001', location: '实验室A区', status: 'running', startTime: '08:00', closeTime: '-', runDuration: '4.5小时' },
    { key: '2', name: '紫外线消毒灯-002', location: '实验室B区', status: 'running', startTime: '09:30', closeTime: '-', runDuration: '3.0小时' },
    { key: '3', name: '紫外线消毒灯-003', location: 'PCR实验室', status: 'closed', startTime: '07:00', closeTime: '09:00', runDuration: '2.0小时' },
    { key: '4', name: '紫外线消毒灯-004', location: '样本处理室', status: 'running', startTime: '10:00', closeTime: '-', runDuration: '1.5小时' },
    { key: '5', name: '紫外线消毒灯-005', location: '洁净区', status: 'closed', startTime: '06:00', closeTime: '08:30', runDuration: '2.5小时' },
    { key: '6', name: '紫外线消毒灯-006', location: '仪器室', status: 'running', startTime: '11:00', closeTime: '-', runDuration: '0.5小时' },
  ])

  const statistics = useMemo(() => {
    const total = deviceData.length
    const running = deviceData.filter(d => d.status === 'running').length
    const closed = deviceData.filter(d => d.status === 'closed').length
    const runningRate = ((running / total) * 100).toFixed(1)
    const todayDuration = deviceData.reduce((acc, d) => {
      const hours = parseFloat(d.runDuration)
      return acc + hours
    }, 0).toFixed(1)
    return { total, running, runningRate, closed, todayDuration }
  }, [deviceData])

  const handleAdd = () => {
    form.resetFields()
    setModalVisible(true)
  }

  const handleSave = () => {
    form.validateFields().then(values => {
      message.success('设备添加成功')
      setModalVisible(false)
      form.resetFields()
    }).catch(err => {
      console.error('表单验证失败:', err)
    })
  }

  const handlePower = (key: string, action: 'on' | 'off') => {
    message.success(action === 'on' ? '设备已开机' : '设备已关机')
  }

  const columns = [
    {
      title: <Checkbox onChange={(e) => {
        if (e.target.checked) {
          setSelectedKeys(deviceData.map(d => d.key))
        } else {
          setSelectedKeys([])
        }
      }} />,
      key: 'selection',
      render: (_, record) => <Checkbox checked={selectedKeys.includes(record.key)} onChange={(e) => {
        if (e.target.checked) {
          setSelectedKeys([...selectedKeys, record.key])
        } else {
          setSelectedKeys(selectedKeys.filter(k => k !== record.key))
        }
      }} />
    },
    { title: '设备名称', dataIndex: 'name', key: 'name' },
    { title: '设备位置', dataIndex: 'location', key: 'location' },
    { 
      title: '状态', 
      key: 'status', 
      render: (_, record) => (
        <Tag color={record.status === 'running' ? 'green' : 'gray'}>
          {record.status === 'running' ? '运行中' : '已关闭'}
        </Tag>
      ) 
    },
    { title: '开启时间', dataIndex: 'startTime', key: 'startTime' },
    { title: '关闭时间', dataIndex: 'closeTime', key: 'closeTime' },
    { title: '累计运行时长', dataIndex: 'runDuration', key: 'runDuration' },
    { 
      title: '操作', 
      key: 'action', 
      render: (_, record) => (
        <Button.Group>
          {record.status === 'running' ? (
            <Button onClick={() => handlePower(record.key, 'off')} type="danger" ghost icon={<PoweroffOutlined />}>关机</Button>
          ) : (
            <Button onClick={() => handlePower(record.key, 'on')} type="primary" ghost icon={<PlayCircleOutlined />}>开机</Button>
          )}
        </Button.Group>
      ) 
    },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 20 }}>紫外线灯管理</h1>

      <Row gutter={20} style={{ marginBottom: 20 }}>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <Statistic
              title="设备总数"
              value={statistics.total}
              valueStyle={{ fontSize: 32, fontWeight: 600 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#8c8c8c' }}>台紫外线消毒灯</div>
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <Statistic
              title="运行中"
              value={statistics.running}
              valueStyle={{ fontSize: 32, fontWeight: 600, color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <Statistic
              title="已关闭"
              value={statistics.closed}
              valueStyle={{ fontSize: 32, fontWeight: 600, color: '#8c8c8c' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <Statistic
              title="今日累计时长"
              value={statistics.todayDuration}
              valueStyle={{ fontSize: 32, fontWeight: 600, color: '#1890ff' }}
            />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>添加设备</Button>
        </div>

        <Table
          columns={columns}
          dataSource={deviceData}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="添加设备"
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSave}>确认</Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="设备名称"
            name="name"
            rules={[{ required: true, message: '请输入设备名称' }]}
          >
            <Input placeholder="请输入设备名称" />
          </Form.Item>
          <Form.Item
            label="设备位置"
            name="location"
            rules={[{ required: true, message: '请选择设备位置' }]}
          >
            <Select placeholder="请选择设备位置">
              <Option value="实验室A区">实验室A区</Option>
              <Option value="实验室B区">实验室B区</Option>
              <Option value="PCR实验室">PCR实验室</Option>
              <Option value="样本处理室">样本处理室</Option>
              <Option value="洁净区">洁净区</Option>
              <Option value="仪器室">仪器室</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}