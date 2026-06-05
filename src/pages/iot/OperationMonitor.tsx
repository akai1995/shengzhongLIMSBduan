import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space, Tag, Progress, Switch, Tabs } from 'antd'
import { EyeOutlined, ReloadOutlined, EditOutlined, DownloadOutlined, CopyOutlined } from '@ant-design/icons'
import { useState } from 'react'

export default function OperationMonitor() {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedRecord, setSelectedRecord] = useState<any>(null)
  const [activeTab, setActiveTab] = useState('service')
  const [form] = Form.useForm()

  const serviceColumns = [
    { title: '服务名称', dataIndex: 'name', key: 'name' },
    { title: '服务类型', dataIndex: 'type', key: 'type', render: (t: string) => (
      <Tag color={t === '应用服务' ? 'blue' : t === '接口' ? 'green' : 'orange'}>{t}</Tag>
    )},
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => (
      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: s === '正常' ? '#52C41A' : s === '异常' ? '#F53F3F' : '#D89614' }} />
        {s}
      </span>
    )},
    { title: '健康检查时间', dataIndex: 'checkTime', key: 'checkTime' },
    { title: '最近响应时间(ms)', dataIndex: 'responseTime', key: 'responseTime' },
    { title: '操作', key: 'action', render: () => (
      <Space>
        <Button type="link" icon={<EyeOutlined />}>查看详情</Button>
        <Button type="link" icon={<ReloadOutlined />}>手动检查</Button>
        <Button type="link" icon={<EditOutlined />}>编辑配置</Button>
      </Space>
    )},
  ]

  const serviceData = [
    { key: '1', name: 'LIMS核心服务', type: '应用服务', status: '正常', checkTime: '2024-01-15 14:30:00', responseTime: 120 },
    { key: '2', name: '设备管理API', type: '接口', status: '正常', checkTime: '2024-01-15 14:30:00', responseTime: 85 },
    { key: '3', name: '数据库服务', type: '中间件', status: '正常', checkTime: '2024-01-15 14:30:00', responseTime: 45 },
    { key: '4', name: '消息队列', type: '中间件', status: '警告', checkTime: '2024-01-15 14:28:00', responseTime: 256 },
    { key: '5', name: '文件存储服务', type: '应用服务', status: '正常', checkTime: '2024-01-15 14:30:00', responseTime: 156 },
    { key: '6', name: '认证服务', type: '应用服务', status: '异常', checkTime: '2024-01-15 14:25:00', responseTime: -1 },
  ]

  const resourceColumns = [
    { title: '主机名', dataIndex: 'hostname', key: 'hostname' },
    { title: 'CPU使用率', dataIndex: 'cpu', key: 'cpu', render: (c: number) => (
      <div>
        <Progress percent={c} strokeColor={c > 80 ? '#F53F3F' : c > 60 ? '#D89614' : '#52C41A'} />
        <span style={{ marginLeft: 8 }}>{c}%</span>
      </div>
    )},
    { title: '内存使用率', dataIndex: 'memory', key: 'memory', render: (m: number) => (
      <div>
        <Progress percent={m} strokeColor={m > 80 ? '#F53F3F' : m > 60 ? '#D89614' : '#52C41A'} />
        <span style={{ marginLeft: 8 }}>{m}%</span>
      </div>
    )},
    { title: '磁盘使用率', dataIndex: 'disk', key: 'disk', render: (d: number) => (
      <div>
        <Progress percent={d} strokeColor={d > 80 ? '#F53F3F' : d > 60 ? '#D89614' : '#52C41A'} />
        <span style={{ marginLeft: 8 }}>{d}%</span>
      </div>
    )},
    { title: '网络(Mbps)', dataIndex: 'network', key: 'network', render: (n: { in: number; out: number }) => (
      <span>入:{n.in} / 出:{n.out}</span>
    )},
    { title: '最后更新时间', dataIndex: 'updateTime', key: 'updateTime' },
    { title: '操作', key: 'action', render: () => (
      <Space>
        <Button type="link" icon={<EyeOutlined />}>查看详情</Button>
        <Button type="link" icon={<EditOutlined />}>设置阈值告警</Button>
        <Button type="link" icon={<ReloadOutlined />}>刷新数据</Button>
      </Space>
    )},
  ]

  const resourceData = [
    { key: '1', hostname: 'lims-server-01', cpu: 45, memory: 62, disk: 78, network: { in: 120, out: 85 }, updateTime: '2024-01-15 14:30:00' },
    { key: '2', hostname: 'lims-server-02', cpu: 78, memory: 55, disk: 65, network: { in: 95, out: 110 }, updateTime: '2024-01-15 14:30:00' },
    { key: '3', hostname: 'lims-db-01', cpu: 32, memory: 48, disk: 82, network: { in: 45, out: 230 }, updateTime: '2024-01-15 14:30:00' },
    { key: '4', hostname: 'lims-iot-01', cpu: 85, memory: 72, disk: 58, network: { in: 250, out: 180 }, updateTime: '2024-01-15 14:30:00' },
  ]

  const logColumns = [
    { title: '时间', dataIndex: 'time', key: 'time' },
    { title: '级别', dataIndex: 'level', key: 'level', render: (l: string) => (
      <Tag color={l === 'INFO' ? 'blue' : l === 'WARN' ? 'orange' : l === 'ERROR' ? 'red' : 'gray'}>{l}</Tag>
    )},
    { title: '服务名', dataIndex: 'service', key: 'service' },
    { title: '内容摘要', dataIndex: 'content', key: 'content' },
    { title: '操作', key: 'action', render: () => (
      <Space>
        <Button type="link" icon={<EyeOutlined />}>查看详情</Button>
        <Button type="link" icon={<CopyOutlined />}>复制日志</Button>
      </Space>
    )},
  ]

  const logData = [
    { key: '1', time: '2024-01-15 14:30:25', level: 'INFO', service: 'LIMS核心服务', content: '用户登录成功，用户ID: 1001' },
    { key: '2', time: '2024-01-15 14:30:20', level: 'WARN', service: '消息队列', content: '队列消息堆积超过阈值，当前队列长度: 1500' },
    { key: '3', time: '2024-01-15 14:30:15', level: 'ERROR', service: '认证服务', content: '数据库连接失败，重试次数: 3' },
    { key: '4', time: '2024-01-15 14:30:10', level: 'INFO', service: '设备管理API', content: '设备状态更新成功，设备ID: D001' },
    { key: '5', time: '2024-01-15 14:30:05', level: 'DEBUG', service: '文件存储服务', content: '文件上传完成，文件ID: F001' },
    { key: '6', time: '2024-01-15 14:30:00', level: 'INFO', service: '数据库服务', content: '备份任务开始执行' },
  ]

  const alarmColumns = [
    { title: '告警时间', dataIndex: 'time', key: 'time' },
    { title: '级别', dataIndex: 'level', key: 'level', render: (l: string) => (
      <Tag color={l === '严重' ? 'red' : l === '警告' ? 'orange' : 'blue'}>{l}</Tag>
    )},
    { title: '对象类型', dataIndex: 'objectType', key: 'objectType' },
    { title: '对象名称', dataIndex: 'objectName', key: 'objectName' },
    { title: '告警内容', dataIndex: 'content', key: 'content' },
    { title: '状态', dataIndex: 'status', key: 'status', render: (s: string) => (
      <Tag color={s === '未处理' ? 'red' : s === '已读' ? 'orange' : s === '已确认' ? 'blue' : 'gray'}>{s}</Tag>
    )},
    { title: '操作', key: 'action', render: () => (
      <Space>
        <Button type="link" icon={<EyeOutlined />}>查看详情</Button>
        <Button type="link">标记已读/确认</Button>
      </Space>
    )},
  ]

  const alarmData = [
    { key: '1', time: '2024-01-15 14:30:00', level: '严重', objectType: '应用服务', objectName: '认证服务', content: '服务异常，无法正常响应请求', status: '未处理' },
    { key: '2', time: '2024-01-15 14:28:00', level: '警告', objectType: '中间件', objectName: '消息队列', content: '消息堆积超过阈值', status: '已读' },
    { key: '3', time: '2024-01-15 14:25:00', level: '提示', objectType: '服务器', objectName: 'lims-iot-01', content: 'CPU使用率超过80%', status: '已确认' },
    { key: '4', time: '2024-01-15 14:20:00', level: '警告', objectType: '服务器', objectName: 'lims-db-01', content: '磁盘使用率超过80%', status: '已确认' },
  ]

  return (
    <div style={{ padding: 20 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>运维监控</h1>

      <Tabs activeKey={activeTab} onChange={setActiveTab}>
        <Tabs.TabPane tab="服务状态" key="service">
          <Card style={{ borderRadius: 10, marginTop: 16 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Form layout="inline" style={{ gap: 16 }}>
                <Form.Item label="服务名称">
                  <Input placeholder="请输入服务名称" style={{ width: 180 }} />
                </Form.Item>
                <Form.Item label="状态">
                  <Select placeholder="请选择状态" style={{ width: 180 }}>
                    <Select.Option value="all">全部</Select.Option>
                    <Select.Option value="正常">正常</Select.Option>
                    <Select.Option value="异常">异常</Select.Option>
                    <Select.Option value="警告">警告</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="服务类型">
                  <Select placeholder="请选择类型" style={{ width: 180 }}>
                    <Select.Option value="all">全部</Select.Option>
                    <Select.Option value="应用服务">应用服务</Select.Option>
                    <Select.Option value="接口">接口</Select.Option>
                    <Select.Option value="中间件">中间件</Select.Option>
                  </Select>
                </Form.Item>
                <Space>
                  <Button type="primary">查询</Button>
                  <Button>重置</Button>
                </Space>
              </Form>
            </div>
            <Table columns={serviceColumns} dataSource={serviceData} />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="资源监控" key="resource">
          <Card style={{ borderRadius: 10, marginTop: 16 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Form layout="inline" style={{ gap: 16 }}>
                <Form.Item label="资源实例">
                  <Input placeholder="请输入主机名" style={{ width: 180 }} />
                </Form.Item>
                <Form.Item label="资源类型">
                  <Select placeholder="请选择类型" style={{ width: 180 }}>
                    <Select.Option value="all">全部</Select.Option>
                    <Select.Option value="CPU">CPU</Select.Option>
                    <Select.Option value="内存">内存</Select.Option>
                    <Select.Option value="磁盘">磁盘</Select.Option>
                    <Select.Option value="网络">网络</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="时间范围">
                  <DatePicker.RangePicker style={{ width: 300 }} />
                </Form.Item>
                <Space>
                  <Button type="primary">查询</Button>
                  <Button>重置</Button>
                </Space>
              </Form>
            </div>
            <Table columns={resourceColumns} dataSource={resourceData} />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="日志查看" key="logs">
          <Card style={{ borderRadius: 10, marginTop: 16 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Form layout="inline" style={{ gap: 16 }}>
                <Form.Item label="时间范围">
                  <DatePicker.RangePicker style={{ width: 300 }} />
                </Form.Item>
                <Form.Item label="日志级别">
                  <Select placeholder="请选择级别" style={{ width: 180 }} mode="multiple">
                    <Select.Option value="INFO">INFO</Select.Option>
                    <Select.Option value="WARN">WARN</Select.Option>
                    <Select.Option value="ERROR">ERROR</Select.Option>
                    <Select.Option value="DEBUG">DEBUG</Select.Option>
                    <Select.Option value="FATAL">FATAL</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="服务/模块">
                  <Input placeholder="请输入服务名" style={{ width: 180 }} />
                </Form.Item>
                <Form.Item label="关键词">
                  <Input placeholder="请输入关键词" style={{ width: 180 }} />
                </Form.Item>
                <Space>
                  <Button type="primary">查询</Button>
                  <Button>重置</Button>
                </Space>
              </Form>
              <Button icon={<DownloadOutlined />}>导出</Button>
            </div>
            <Table columns={logColumns} dataSource={logData} />
          </Card>
        </Tabs.TabPane>

        <Tabs.TabPane tab="异常告警" key="alarm">
          <Card style={{ borderRadius: 10, marginTop: 16 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <Form layout="inline" style={{ gap: 16 }}>
                <Form.Item label="告警时间">
                  <DatePicker.RangePicker style={{ width: 300 }} />
                </Form.Item>
                <Form.Item label="告警级别">
                  <Select placeholder="请选择级别" style={{ width: 180 }} mode="multiple">
                    <Select.Option value="严重">严重</Select.Option>
                    <Select.Option value="警告">警告</Select.Option>
                    <Select.Option value="提示">提示</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="状态">
                  <Select placeholder="请选择状态" style={{ width: 180 }}>
                    <Select.Option value="all">全部</Select.Option>
                    <Select.Option value="未处理">未处理</Select.Option>
                    <Select.Option value="已读">已读</Select.Option>
                    <Select.Option value="已确认">已确认</Select.Option>
                    <Select.Option value="已忽略">已忽略</Select.Option>
                  </Select>
                </Form.Item>
                <Form.Item label="对象名称">
                  <Input placeholder="请输入对象名称" style={{ width: 180 }} />
                </Form.Item>
                <Space>
                  <Button type="primary">查询</Button>
                  <Button>重置</Button>
                </Space>
              </Form>
            </div>
            <Table columns={alarmColumns} dataSource={alarmData} />
          </Card>
        </Tabs.TabPane>
      </Tabs>
    </div>
  )
}