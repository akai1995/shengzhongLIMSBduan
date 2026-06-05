import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Popconfirm, Row, Col, DatePicker, Tabs, Switch } from 'antd'
import { PlusOutlined, PlayCircleOutlined, EyeOutlined, DeleteOutlined, FileTextOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'
import { useState } from 'react'

const { Option } = Select
const { RangePicker } = DatePicker
const { TabPane } = Tabs

export default function DataBackup() {
  const { isDark } = useThemeStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true)
  const [incrementalBackupEnabled, setIncrementalBackupEnabled] = useState(true)
  const [fullBackupEnabled, setFullBackupEnabled] = useState(true)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  const handleExecute = (record: any) => {
    message.success(`备份任务 "${record.name}" 已执行`)
  }

  const handleViewReport = (record: any) => {
    message.info(`查看备份报告: ${record.name}`)
  }

  const backupTaskColumns = [
    { title: '任务名称', dataIndex: 'name', key: 'name', ellipsis: true },
    {
      title: '备份类型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (val: string) => <Tag color={val === '增量备份' ? 'blue' : 'green'}>{val}</Tag>,
    },
    { title: '源路径', dataIndex: 'sourcePath', key: 'sourcePath', ellipsis: true },
    { title: '目标路径', dataIndex: 'targetPath', key: 'targetPath', ellipsis: true },
    { title: '执行时间', dataIndex: 'scheduleTime', key: 'scheduleTime', width: 120 },
    { title: '上次执行', dataIndex: 'lastExecute', key: 'lastExecute', width: 130 },
    { title: '下次执行', dataIndex: 'nextExecute', key: 'nextExecute', width: 130 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => <Tag color={status === '成功' ? 'green' : status === '失败' ? 'red' : 'orange'}>{status}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" size="small" icon={<PlayCircleOutlined />} onClick={() => handleExecute(record)}>立即执行</Button>
          <Button type="text" size="small" icon={<FileTextOutlined />} onClick={() => handleViewReport(record)}>查看报告</Button>
          <Popconfirm title="确定删除该任务吗？" onConfirm={() => message.success('删除成功')}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const backupLogColumns = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 170 },
    { title: '任务', dataIndex: 'taskName', key: 'taskName', ellipsis: true },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => <Tag color={status === '成功' ? 'green' : 'red'}>{status}</Tag>,
    },
    { title: '详情', dataIndex: 'detail', key: 'detail', ellipsis: true },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_: any, record: any) => (
        <Button type="text" size="small" icon={<EyeOutlined />}>查看详细报告</Button>
      ),
    },
  ]

  const backupTaskData = Array.from({ length: 8 }, (_, i) => ({
    key: String(i + 1),
    name: [`每日增量备份`, '每周全量备份', '数据库备份', '配置文件备份', '日志备份', '用户数据备份', '系统备份', '定时快照'][i],
    type: i % 3 === 0 ? '全量备份' : '增量备份',
    sourcePath: `/data/source/${i + 1}`,
    targetPath: `/backup/target/${i + 1}`,
    scheduleTime: i % 3 === 0 ? '每周日 02:00' : '每天 01:00',
    lastExecute: `2024-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')} ${String(1 + (i % 3)).padStart(2, '0')}:00:00`,
    nextExecute: `2024-0${(i % 6) + 1}-${String(((i % 28) + 2) % 28 || 28).padStart(2, '0')} ${String(1 + (i % 3)).padStart(2, '0')}:00:00`,
    status: i % 7 === 0 ? '失败' : i % 5 === 0 ? '执行中' : '成功',
  }))

  const backupLogData = Array.from({ length: 15 }, (_, i) => ({
    key: String(i + 1),
    time: `2024-05-1${(i % 9) + 1} ${String(1 + (i % 23)).padStart(2, '0')}:${String(10 + (i % 50)).padStart(2, '0')}:00`,
    taskName: [`每日增量备份`, '每周全量备份', '数据库备份', '配置文件备份'][i % 4],
    status: i % 8 === 0 ? '失败' : '成功',
    detail: i % 8 === 0 ? `备份失败：磁盘空间不足` : `备份文件数${Math.floor(Math.random() * 1000) + 500}，总大小${(Math.random() * 5 + 0.5).toFixed(1)}GB，耗时${Math.floor(Math.random() * 10) + 1}分${Math.floor(Math.random() * 60)}秒`,
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        数据备份
      </h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Tabs defaultActiveKey="config">
          <TabPane tab="备份策略配置" key="config">
            <div style={{ padding: 20, background: isDark ? '#1D1D1D' : '#F9F9F9', borderRadius: 8, marginBottom: 20 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>全局备份设置</h3>
              <Row gutter={32}>
                <Col span={8}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: isDark ? '#DCDCDC' : '#595959' }}>启用自动备份</span>
                    <Switch checked={autoBackupEnabled} onChange={setAutoBackupEnabled} />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: isDark ? '#DCDCDC' : '#595959' }}>增量备份（每天 01:00）</span>
                    <Switch checked={incrementalBackupEnabled} onChange={setIncrementalBackupEnabled} />
                  </div>
                </Col>
                <Col span={8}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: 14, color: isDark ? '#DCDCDC' : '#595959' }}>全量备份（每周日 02:00）</span>
                    <Switch checked={fullBackupEnabled} onChange={setFullBackupEnabled} />
                  </div>
                </Col>
              </Row>
            </div>

            <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
              <Button type="primary" icon={<PlusOutlined />}>
                新建备份任务
              </Button>
            </div>
            <Table
              columns={backupTaskColumns}
              dataSource={backupTaskData}
              scroll={{ x: 'max-content' }}
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
              }}
              pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
            />
          </TabPane>
          <TabPane tab="备份日志" key="logs">
            <Form form={searchForm} layout="horizontal" style={{ marginBottom: 16 }}>
              <Row gutter={20}>
                <Col span={6}>
                  <Form.Item label="备份任务" name="task">
                    <Select placeholder="请选择备份任务">
                      <Option value="all">全部任务</Option>
                      {backupTaskData.map(task => (
                        <Option key={task.key} value={task.name}>{task.name}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="状态" name="status">
                    <Select placeholder="请选择状态">
                      <Option value="all">全部状态</Option>
                      <Option value="success">成功</Option>
                      <Option value="failed">失败</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item label="日期范围" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={4} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary">查询</Button>
                  <Button>重置</Button>
                </Col>
              </Row>
            </Form>
            <Table
              columns={backupLogColumns}
              dataSource={backupLogData}
              scroll={{ x: 'max-content' }}
              pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
            />
          </TabPane>
        </Tabs>
      </Card>
    </div>
  )
}