import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Popconfirm, Row, Col, DatePicker, Tabs } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined, EditOutlined, PlayCircleOutlined, FileTextOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'
import { useState } from 'react'

const { Search } = Input
const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

export default function DataCollection() {
  const { isDark } = useThemeStore()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLogVisible, setIsLogVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新建任务')
  const [form] = Form.useForm()

  const handleCreate = () => {
    setModalTitle('新建任务')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setModalTitle('编辑任务')
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleExecute = (record: any) => {
    message.success(`任务 "${record.name}" 已执行`)
  }

  const handleViewLog = (record: any) => {
    setIsLogVisible(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('表单数据:', values)
      message.success('保存成功')
      setIsModalVisible(false)
    })
  }

  const taskColumns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: 'FTP地址', dataIndex: 'ftp', key: 'ftp', ellipsis: true },
    { title: '远程目录', dataIndex: 'remoteDir', key: 'remoteDir', ellipsis: true },
    { title: '采集频率', dataIndex: 'frequency', key: 'frequency', width: 100, render: (val: string) => <Tag color="blue">{val}</Tag> },
    { title: '上次执行', dataIndex: 'lastExecute', key: 'lastExecute', width: 130 },
    { title: '下次执行', dataIndex: 'nextExecute', key: 'nextExecute', width: 130 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => <Tag color={status === '启用' ? 'green' : 'default'}>{status}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" size="small" icon={<PlayCircleOutlined />} onClick={() => handleExecute(record)}>立即执行</Button>
          <Button type="text" size="small" icon={<FileTextOutlined />} onClick={() => handleViewLog(record)}>执行日志</Button>
          <Popconfirm title="确定删除该任务吗？" onConfirm={() => message.success('删除成功')}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const logColumns = [
    { title: '执行时间', dataIndex: 'time', key: 'time' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (status: string) => <Tag color={status === '成功' ? 'green' : 'red'}>{status}</Tag> },
    { title: '错误信息', dataIndex: 'error', key: 'error', ellipsis: true },
  ]

  const parseColumns = [
    { title: '原始文件名', dataIndex: 'fileName', key: 'fileName', ellipsis: true },
    { title: '所属任务', dataIndex: 'taskName', key: 'taskName', width: 120 },
    { title: '采集时间', dataIndex: 'collectTime', key: 'collectTime', width: 130 },
    { title: '文件大小', dataIndex: 'size', key: 'size', width: 100 },
    { title: 'MD5', dataIndex: 'md5', key: 'md5', width: 160 },
    {
      title: '解析状态',
      dataIndex: 'parseStatus',
      key: 'parseStatus',
      width: 100,
      render: (status: string) => <Tag color={status === '成功' ? 'green' : status === '失败' ? 'red' : 'orange'}>{status}</Tag>,
    },
    { title: '解析耗时', dataIndex: 'parseTime', key: 'parseTime', width: 100 },
    { title: '归档路径', dataIndex: 'archivePath', key: 'archivePath', ellipsis: true },
    { title: '存储格式', dataIndex: 'format', key: 'format', width: 100, render: (val: string) => <Tag color="blue">{val}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EyeOutlined />}>查看详情</Button>
          <Popconfirm title="确定删除该记录吗？" onConfirm={() => message.success('删除成功')}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const taskData = Array.from({ length: 10 }, (_, i) => ({
    key: String(i + 1),
    name: [`仪器数据采集任务${i + 1}`, '实验日志同步', '设备状态采集', '温度数据采集'][i % 4],
    ftp: `ftp://192.168.1.${100 + i}/data`,
    remoteDir: `/remote/data/${i + 1}`,
    frequency: ['每小时', '每天', '每周', '每月'][i % 4],
    lastExecute: `2024-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:00:00`,
    nextExecute: `2024-0${(i % 6) + 1}-${String(((i % 28) + 2) % 28 || 28).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:00:00`,
    status: i % 3 === 0 ? '禁用' : '启用',
  }))

  const logData = Array.from({ length: 10 }, (_, i) => ({
    key: String(i + 1),
    time: `2024-05-1${i + 1} ${String(8 + (i % 12)).padStart(2, '0')}:${String(10 + i).padStart(2, '0')}:00`,
    status: i % 5 === 0 ? '失败' : '成功',
    error: i % 5 === 0 ? `连接超时，重试${i + 1}次` : '-',
  }))

  const parseData = Array.from({ length: 15 }, (_, i) => ({
    key: String(i + 1),
    fileName: `data_${String(i + 1).padStart(4, '0')}.csv`,
    taskName: [`仪器数据采集任务${(i % 4) + 1}`, '实验日志同步', '设备状态采集'][i % 3],
    collectTime: `2024-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:00:00`,
    size: `${(Math.random() * 500 + 10).toFixed(1)} MB`,
    md5: `${Math.random().toString(16).substr(2, 32)}`,
    parseStatus: i % 7 === 0 ? '失败' : i % 3 === 0 ? '解析中' : '成功',
    parseTime: `${(Math.random() * 10 + 1).toFixed(1)}秒`,
    archivePath: `/data/archive/2024/${String((i % 12) + 1).padStart(2, '0')}/`,
    format: ['Parquet', 'CSV', 'JSON'][i % 3],
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        数据采集
      </h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Tabs defaultActiveKey="tasks">
          <TabPane tab="任务列表" key="tasks">
            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
              <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
                新建任务
              </Button>
            </div>
            <Table
              columns={taskColumns}
              dataSource={taskData}
              scroll={{ x: 'max-content' }}
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
              }}
              pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
            />
          </TabPane>
          <TabPane tab="解析记录" key="parse">
            <Table
              columns={parseColumns}
              dataSource={parseData}
              scroll={{ x: 'max-content' }}
              pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
            />
          </TabPane>
        </Tabs>
      </Card>

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="任务名称" name="name" rules={[{ required: true, message: '请输入任务名称' }]}>
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <Form.Item label="FTP地址" name="ftp" rules={[{ required: true, message: '请输入FTP地址' }]}>
            <Input placeholder="请输入FTP地址" />
          </Form.Item>
          <Form.Item label="远程目录" name="remoteDir" rules={[{ required: true, message: '请输入远程目录' }]}>
            <Input placeholder="请输入远程目录" />
          </Form.Item>
          <Form.Item label="采集频率" name="frequency" rules={[{ required: true, message: '请选择采集频率' }]}>
            <Select placeholder="请选择采集频率">
              <Option value="hourly">每小时</Option>
              <Option value="daily">每天</Option>
              <Option value="weekly">每周</Option>
              <Option value="monthly">每月</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue="启用">
            <Select>
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="执行日志"
        open={isLogVisible}
        onCancel={() => setIsLogVisible(false)}
        width={800}
      >
        <Table
          columns={logColumns}
          dataSource={logData}
          pagination={false}
        />
      </Modal>
    </div>
  )
}