import { Card, Row, Col, Statistic, Table, Tag, Button, Space, Progress, Tooltip } from 'antd'
import { useThemeStore } from '../../../store/themeStore'
import { UpOutlined, WarningOutlined, DeleteOutlined, HomeOutlined, UserOutlined, FolderOpenOutlined } from '@ant-design/icons'
import { useState } from 'react'

interface UsbDevice {
  key: string
  name: string
  deviceId: string
  capacity: string
  location: string
  status: 'normal' | 'warning'
  warningTime: string
}

interface FileOperation {
  key: string
  name: string
  user: string
  deletedFiles: string
  deviceId: string
  time: string
}

export default function UsbData() {
  const { isDark } = useThemeStore()

  const [usbDevices] = useState<UsbDevice[]>([
    { key: '1', name: 'USB-2024-001', deviceId: 'UD-88271', capacity: '128GB', location: '检验科3号工作站', status: 'warning', warningTime: '2024-01-15 10:35:22' },
    { key: '2', name: 'USB-2024-002', deviceId: 'UD-88272', capacity: '64GB', location: 'PCR实验室A区', status: 'warning', warningTime: '2024-01-15 09:20:18' },
    { key: '3', name: 'USB-2024-003', deviceId: 'UD-88273', capacity: '32GB', location: '样本处理室', status: 'warning', warningTime: '2024-01-14 17:15:30' },
  ])

  const [fileOperations] = useState<FileOperation[]>([
    { key: '1', name: '实验数据导出.zip', user: '张三', deletedFiles: '3个文件', deviceId: 'UD-88271', time: '2024-01-15 10:30:25' },
    { key: '2', name: '分析报告.xlsx', user: '李四', deletedFiles: '1个文件', deviceId: 'UD-88272', time: '2024-01-15 09:15:42' },
    { key: '3', name: '原始数据.csv', user: '王五', deletedFiles: '2个文件', deviceId: 'UD-88271', time: '2024-01-14 16:45:10' },
  ])

  const usbColumns = [
    { title: '设备名称', dataIndex: 'name', key: 'name', render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '设备ID', dataIndex: 'deviceId', key: 'deviceId' },
    { title: '容量', dataIndex: 'capacity', key: 'capacity' },
    { title: '位置', dataIndex: 'location', key: 'location', render: (text: string) => <span><FolderOpenOutlined style={{ marginRight: 4 }} />{text}</span> },
    { title: '发生预警时间', dataIndex: 'warningTime', key: 'warningTime' },
  ]

  const fileColumns = [
    { title: '文件名', dataIndex: 'name', key: 'name' },
    { title: '操作人', dataIndex: 'user', key: 'user', render: (text: string) => <span><UserOutlined style={{ marginRight: 4 }} />{text}</span> },
    { title: '复制文件数', dataIndex: 'deletedFiles', key: 'deletedFiles', render: (text: string) => <Tag color="red">{text}</Tag> },
    { title: '设备ID', dataIndex: 'deviceId', key: 'deviceId' },
    { title: '发生预警时间', dataIndex: 'time', key: 'time' },
  ]

  const hourlyData = [
    { hour: '00:00', count: 12 },
    { hour: '02:00', count: 8 },
    { hour: '04:00', count: 5 },
    { hour: '06:00', count: 15 },
    { hour: '08:00', count: 45 },
    { hour: '10:00', count: 68 },
    { hour: '12:00', count: 35 },
    { hour: '14:00', count: 52 },
    { hour: '16:00', count: 48 },
    { hour: '18:00', count: 32 },
    { hour: '20:00', count: 25 },
    { hour: '22:00', count: 18 },
  ]

  const maxCount = Math.max(...hourlyData.map(d => d.count))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        USB管控
      </h1>

      <Row gutter={20}>
        <Col span={8}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <HomeOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <span style={{ fontSize: 14, color: isDark ? '#999' : '#666' }}>设备接入次数</span>
            </div>
            <Statistic
              value={156}
              suffix={'次'}
              valueStyle={{ fontSize: 32, fontWeight: 600 }}
              prefix={<UpOutlined style={{ color: '#52c41a' }} />}
              suffixStyle={{ fontSize: 16 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>较昨日增长 12.5%</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <DeleteOutlined style={{ fontSize: 24, color: '#fa8c16' }} />
              <span style={{ fontSize: 14, color: isDark ? '#999' : '#666' }}>数据传输总量</span>
            </div>
            <Statistic
              value={2.8}
              suffix={'GB'}
              valueStyle={{ fontSize: 32, fontWeight: 600 }}
              prefix={<UpOutlined style={{ color: '#52c41a' }} />}
              suffixStyle={{ fontSize: 16 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#52c41a' }}>较昨日增长 8.3%</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <WarningOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
              <span style={{ fontSize: 14, color: isDark ? '#999' : '#666' }}>预警总数</span>
            </div>
            <Statistic
              value={12}
              suffix={'条'}
              valueStyle={{ fontSize: 32, fontWeight: 600 }}
              suffixStyle={{ fontSize: 16 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#ff4d4f' }}>包含外来U盘和异常操作</div>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>接入次数趋势（今日）</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 200, gap: 8 }}>
          {hourlyData.map(item => (
            <Tooltip key={item.hour} title={`${item.hour}: ${item.count} 次接入`} placement="top">
              <div key={item.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer' }}>
                <div 
                  style={{ 
                    width: '100%', 
                    background: 'linear-gradient(180deg, #1890ff 0%, #91caff 100%)',
                    borderRadius: '4px 4px 0 0',
                    minHeight: 20,
                    transition: 'height 0.3s, opacity 0.2s',
                    opacity: 0.8,
                    height: `${(item.count / maxCount) * 150}px`
                  }} 
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0.8'
                  }}
                >
                </div>
                <span style={{ fontSize: 10, marginTop: 8, color: isDark ? '#999' : '#666' }}>{item.hour}</span>
              </div>
            </Tooltip>
          ))}
        </div>
      </Card>

      <Row gutter={20}>
        <Col span={12}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500 }}>
                <WarningOutlined style={{ marginRight: 8, color: '#fa8c16' }} />
                外来U盘预警
              </h3>
              <span style={{ fontSize: 12, color: '#fa8c16' }}>共 {usbDevices.length} 条预警</span>
            </div>
            <Table
              columns={usbColumns}
              dataSource={usbDevices}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500 }}>
                <DeleteOutlined style={{ marginRight: 8, color: '#ff4d4f' }} />
                文件异常操作预警
              </h3>
              <span style={{ fontSize: 12, color: '#ff4d4f' }}>共 {fileOperations.length} 条预警</span>
            </div>
            <Table
              columns={fileColumns}
              dataSource={fileOperations}
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}