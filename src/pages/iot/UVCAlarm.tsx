import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space, Tag, Checkbox } from 'antd'
import { DownloadOutlined, EyeOutlined } from '@ant-design/icons'
import { useState } from 'react'

export default function UVCAlarm() {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [form] = Form.useForm()

  const columns = [
    { title: '', dataIndex: 'select', key: 'select', render: () => <Checkbox /> },
    { title: '告警时间', dataIndex: 'time', key: 'time' },
    { title: '设备名称', dataIndex: 'device', key: 'device' },
    { title: '安装区域', dataIndex: 'area', key: 'area' },
    { title: '告警类型', dataIndex: 'type', key: 'type' },
    { title: '告警等级', dataIndex: 'level', key: 'level', render: (l: string) => (
      <Tag color={l === '紧急告警' ? 'red' : l === '重要告警' ? 'orange' : 'blue'}>{l}</Tag>
    )},
    { title: '告警内容', dataIndex: 'content', key: 'content' },
    { title: '处理状态', dataIndex: 'status', key: 'status', render: (s: string) => (
      <Tag color={s === '未处理' ? 'red' : s === '处理中' ? 'orange' : s === '已处理' ? 'green' : 'gray'}>{s}</Tag>
    )},
    { title: '处理人', dataIndex: 'processor', key: 'processor' },
    { title: '处理时间', dataIndex: 'processTime', key: 'processTime' },
    { title: '操作', key: 'action', render: (_, record) => (
      <Space>
        <Button type="link" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
        <Button type="link" onClick={() => handleViewDetail(record)}>处理</Button>
        <Button type="link" danger>忽略</Button>
      </Space>
    )},
  ]

  const data = [
    { key: '1', time: '2024-01-15 14:30:00', device: '消毒灯B02', area: '实验室B102', type: '灯管故障', level: '紧急告警', content: '紫外线灯管损坏，请及时更换', status: '未处理', processor: '-', processTime: '-' },
    { key: '2', time: '2024-01-15 13:20:00', device: '消毒灯B02', area: '实验室B102', type: 'UV强度不足', level: '重要告警', content: 'UV强度低于阈值80 μW/cm²', status: '处理中', processor: '张三', processTime: '2024-01-15 13:30:00' },
    { key: '3', time: '2024-01-15 10:15:00', device: '消毒灯C01', area: '洁净区C01', type: '异常断电', level: '紧急告警', content: '设备断电，请检查电源', status: '已处理', processor: '李四', processTime: '2024-01-15 10:30:00' },
    { key: '4', time: '2024-01-15 09:00:00', device: '消毒灯D01', area: '走廊D01', type: '通信超时', level: '一般告警', content: '设备通信超时，请检查网络', status: '已处理', processor: '王五', processTime: '2024-01-15 09:15:00' },
    { key: '5', time: '2024-01-14 18:00:00', device: '消毒灯A01', area: '实验室A101', type: '灯管寿命到期', level: '重要告警', content: '灯管累计运行时长已达阈值，建议更换', status: '已忽略', processor: '-', processTime: '-' },
  ]

  const handleViewDetail = (record: any) => {
    setSelectedRecord(record)
    form.setFieldsValue(record)
    setModalVisible(true)
  }

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>紫外线消毒灯 - 异常报警记录</h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <Form layout="inline" style={{ gap: 16 }}>
            <Form.Item label="告警时间">
              <DatePicker.RangePicker style={{ width: 300 }} />
            </Form.Item>
            <Form.Item label="选择设备">
              <Select placeholder="请选择设备" style={{ width: 180 }}>
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="UVC-A01">消毒灯A01</Select.Option>
                <Select.Option value="UVC-A02">消毒灯A02</Select.Option>
                <Select.Option value="UVC-B01">消毒灯B01</Select.Option>
                <Select.Option value="UVC-B02">消毒灯B02</Select.Option>
                <Select.Option value="UVC-C01">消毒灯C01</Select.Option>
                <Select.Option value="UVC-D01">消毒灯D01</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="告警类型">
              <Select placeholder="请选择类型" style={{ width: 180 }} mode="multiple">
                <Select.Option value="异常断电">异常断电</Select.Option>
                <Select.Option value="灯管故障">灯管故障</Select.Option>
                <Select.Option value="UV强度不足">UV强度不足</Select.Option>
                <Select.Option value="通信超时">通信超时</Select.Option>
                <Select.Option value="灯管寿命到期">灯管寿命到期</Select.Option>
                <Select.Option value="温度异常">温度异常</Select.Option>
                <Select.Option value="电流异常">电流异常</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="告警等级">
              <Select placeholder="请选择等级" style={{ width: 180 }}>
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="紧急告警">紧急告警</Select.Option>
                <Select.Option value="重要告警">重要告警</Select.Option>
                <Select.Option value="一般告警">一般告警</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="处理状态">
              <Select placeholder="请选择状态" style={{ width: 180 }}>
                <Select.Option value="all">全部</Select.Option>
                <Select.Option value="未处理">未处理</Select.Option>
                <Select.Option value="处理中">处理中</Select.Option>
                <Select.Option value="已处理">已处理</Select.Option>
                <Select.Option value="已忽略">已忽略</Select.Option>
              </Select>
            </Form.Item>
            <Space>
              <Button type="primary">查询</Button>
              <Button>重置</Button>
            </Space>
          </Form>
          <Space>
            <Button icon={<DownloadOutlined />}>批量导出</Button>
            <Button>批量处理</Button>
            <Button danger>批量忽略</Button>
          </Space>
        </div>

        <Table columns={columns} dataSource={data} scroll={{ x: 'max-content' }} />
      </Card>

      <Modal
        title="告警详情/处理"
        visible={modalVisible}
        onCancel={() => { setModalVisible(false); form.resetFields(); }}
        footer={[
          <Button key="back" onClick={() => { setModalVisible(false); form.resetFields(); }}>关闭</Button>,
          <Button key="submit" type="primary" onClick={() => { setModalVisible(false); form.resetFields(); }}>保存</Button>,
        ]}
        width={600}
      >
        {selectedRecord && (
          <Form form={form} layout="vertical">
            <div style={{ marginBottom: 20, paddingBottom: 16, borderBottom: '1px solid #E5E5E5' }}>
              <Form.Item label="告警ID">
                <Input disabled value="ALM-UVC-001" />
              </Form.Item>
              <Form.Item label="告警时间">
                <Input disabled value={selectedRecord.time} />
              </Form.Item>
              <Form.Item label="设备信息">
                <Input disabled value={`${selectedRecord.device} - ${selectedRecord.area}`} />
              </Form.Item>
              <Form.Item label="告警类型">
                <Input disabled value={selectedRecord.type} />
              </Form.Item>
              <Form.Item label="告警等级">
                <Tag color={selectedRecord.level === '紧急告警' ? 'red' : selectedRecord.level === '重要告警' ? 'orange' : 'blue'}>
                  {selectedRecord.level}
                </Tag>
              </Form.Item>
              <Form.Item label="告警内容">
                <Input.TextArea disabled value={selectedRecord.content} rows={3} />
              </Form.Item>
              <Form.Item label="故障诊断建议">
                <Input.TextArea disabled value="建议检查设备电源、网络连接，如问题持续请联系维修人员。" rows={3} />
              </Form.Item>
            </div>
            <Form.Item label="处理状态">
              <Select>
                <Select.Option value="未处理">未处理</Select.Option>
                <Select.Option value="处理中">处理中</Select.Option>
                <Select.Option value="已处理">已处理</Select.Option>
                <Select.Option value="已忽略">已忽略</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="处理方式">
              <Input.TextArea placeholder="请输入处理方式" rows={3} />
            </Form.Item>
            <Form.Item label="处理人">
              <Select>
                <Select.Option value="张三">张三</Select.Option>
                <Select.Option value="李四">李四</Select.Option>
                <Select.Option value="王五">王五</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="备注">
              <Input.TextArea placeholder="请输入备注" rows={2} />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  )
}