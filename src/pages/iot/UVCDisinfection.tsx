import { Card, Button, Table, Row, Col, Modal, Form, Select, DatePicker, Checkbox, Tag, Space, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useState, useMemo } from 'react'
import dayjs from 'dayjs'

interface ScheduledTask {
  key: string
  deviceName: string
  location: string
  taskType: '开机' | '关机'
  operateTime: string
}

export default function UVCDisinfection() {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([])
  const [form] = Form.useForm()

  const [taskData] = useState<ScheduledTask[]>([
    { key: '1', deviceName: '紫外线消毒灯-001', location: '实验室A区', taskType: '开机', operateTime: '2026-05-28 08:00' },
    { key: '2', deviceName: '紫外线消毒灯-002', location: '实验室B区', taskType: '关机', operateTime: '2026-05-28 18:00' },
    { key: '3', deviceName: '紫外线消毒灯-003', location: 'PCR实验室', taskType: '开机', operateTime: '2026-05-28 07:30' },
    { key: '4', deviceName: '紫外线消毒灯-004', location: '样本处理室', taskType: '关机', operateTime: '2026-05-28 20:00' },
    { key: '5', deviceName: '紫外线消毒灯-005', location: '洁净区', taskType: '开机', operateTime: '2026-05-29 08:00' },
    { key: '6', deviceName: '紫外线消毒灯-006', location: '仪器室', taskType: '关机', operateTime: '2026-05-29 18:00' },
  ])

  const statistics = useMemo(() => {
    const total = taskData.length
    const powerOnTasks = taskData.filter(t => t.taskType === '开机').length
    const powerOffTasks = taskData.filter(t => t.taskType === '关机').length
    return { total, powerOnTasks, powerOffTasks }
  }, [taskData])

  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '设备位置',
      dataIndex: 'location',
      key: 'location',
    },
    {
      title: '任务类型',
      dataIndex: 'taskType',
      key: 'taskType',
      render: (text: string) => (
        <Tag color={text === '开机' ? 'blue' : 'default'}>
          {text}
        </Tag>
      ),
    },
    {
      title: '操作时间',
      dataIndex: 'operateTime',
      key: 'operateTime',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: ScheduledTask) => (
        <Space>
          <Button type="link" size="small">详情</Button>
          <Button type="link" size="small">编辑</Button>
          <Button type="link" danger size="small">删除</Button>
        </Space>
      ),
    },
  ]

  const rowSelection = {
    selectedRowKeys,
    onChange: (keys: React.Key[]) => setSelectedRowKeys(keys),
  }

  const handleCreateTask = () => {
    form.validateFields().then(values => {
      message.success('定时任务创建成功')
      setModalVisible(false)
      form.resetFields()
    })
  }

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 20 }}>定时开关</h1>

      <Row gutter={20} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ fontSize: 14, color: '#595959', marginBottom: 8 }}>定时任务总数</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: '#177DDC' }}>{statistics.total}</div>
            <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 8 }}>条已配置任务</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ fontSize: 14, color: '#595959', marginBottom: 8 }}>开机任务</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: '#52C41A' }}>{statistics.powerOnTasks}</div>
            <div style={{ fontSize: 12, color: '#52C41A', marginTop: 8 }}>自动开启</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ fontSize: 14, color: '#595959', marginBottom: 8 }}>关机任务</div>
            <div style={{ fontSize: 32, fontWeight: 600, color: '#8C8C8C' }}>{statistics.powerOffTasks}</div>
            <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 8 }}>自动关闭</div>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setModalVisible(true)}>
            新建定时任务
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={taskData}
          rowSelection={rowSelection}
          rowKey="key"
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="新建定时任务"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={[
          <Button key="cancel" onClick={() => setModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleCreateTask}>确认</Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="选择设备"
            name="device"
            rules={[{ required: true, message: '请选择设备' }]}
          >
            <Select placeholder="请选择设备">
              <Select.Option value="device1">紫外线消毒灯-001</Select.Option>
              <Select.Option value="device2">紫外线消毒灯-002</Select.Option>
              <Select.Option value="device3">紫外线消毒灯-003</Select.Option>
              <Select.Option value="device4">紫外线消毒灯-004</Select.Option>
              <Select.Option value="device5">紫外线消毒灯-005</Select.Option>
              <Select.Option value="device6">紫外线消毒灯-006</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="任务类型"
            name="taskType"
            rules={[{ required: true, message: '请选择任务类型' }]}
          >
            <Select placeholder="请选择任务类型">
              <Select.Option value="开机">开机</Select.Option>
              <Select.Option value="关机">关机</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            label="执行时间"
            name="executeTime"
            rules={[{ required: true, message: '请选择执行时间' }]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
              placeholder="请选择执行时间"
            />
          </Form.Item>

          <Form.Item
            label="重复周期"
            name="repeatCycle"
            rules={[{ required: true, message: '请选择重复周期' }]}
          >
            <Select placeholder="请选择重复周期">
              <Select.Option value="每天">每天</Select.Option>
              <Select.Option value="每周">每周</Select.Option>
              <Select.Option value="每月">每月</Select.Option>
              <Select.Option value="仅一次">仅一次</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
