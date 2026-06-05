import { Card, Row, Col, Statistic, Table, Tag, Button, Progress, Tooltip } from 'antd'
import { useThemeStore } from '../../../store/themeStore'
import { DatabaseOutlined, CheckCircleOutlined, ClockCircleOutlined, AlertOutlined, UpOutlined, FolderOpenOutlined, BarChartOutlined } from '@ant-design/icons'
import { useState } from 'react'

interface DeviceData {
  key: string
  name: string
  deviceId: string
  department: string
  status: 'updated' | 'not_updated'
  hasIncrement: boolean
  dataSize: string
}

interface StorageInfo {
  key: string
  name: string
  addedCapacity: string
  usedCapacity: string
  totalCapacity: string
  usageRate: number
}

export default function ExperimentData() {
  const { isDark } = useThemeStore()

  const [deviceData] = useState<DeviceData[]>([
    { key: '1', name: '质谱仪-A1', deviceId: 'DEV-001', department: '检验科', status: 'updated', hasIncrement: true, dataSize: '2.4 GB' },
    { key: '2', name: 'PCR仪-B2', deviceId: 'DEV-002', department: '分子生物学', status: 'updated', hasIncrement: true, dataSize: '1.8 GB' },
    { key: '3', name: '流式细胞仪-C1', deviceId: 'DEV-003', department: '细胞室', status: 'not_updated', hasIncrement: false, dataSize: '0 KB' },
    { key: '4', name: '测序仪-D1', deviceId: 'DEV-004', department: '测序中心', status: 'updated', hasIncrement: true, dataSize: '5.2 GB' },
    { key: '5', name: '离心机-E1', deviceId: 'DEV-005', department: '检验科', status: 'not_updated', hasIncrement: false, dataSize: '0 KB' },
    { key: '6', name: '生化分析仪-F1', deviceId: 'DEV-006', department: '生化室', status: 'updated', hasIncrement: true, dataSize: '3.1 GB' },
  ])

  const [storageInfo] = useState<StorageInfo[]>([
    { key: '1', name: '存储服务器-01', addedCapacity: '+2.5GB', usedCapacity: '456GB', totalCapacity: '500GB', usageRate: 91 },
    { key: '2', name: '存储服务器-02', addedCapacity: '+1.8GB', usedCapacity: '320GB', totalCapacity: '400GB', usageRate: 80 },
    { key: '3', name: '存储服务器-03', addedCapacity: '+3.2GB', usedCapacity: '280GB', totalCapacity: '300GB', usageRate: 93 },
    { key: '4', name: '存储服务器-04', addedCapacity: '+0.5GB', usedCapacity: '150GB', totalCapacity: '200GB', usageRate: 75 },
  ])

  const updatedCount = deviceData.filter(d => d.status === 'updated').length
  const notUpdatedCount = deviceData.filter(d => d.status === 'not_updated').length
  const hasIncrementCount = deviceData.filter(d => d.hasIncrement).length
  const noIncrementCount = deviceData.filter(d => !d.hasIncrement).length

  const deviceColumns = [
    { title: '设备名称', dataIndex: 'name', key: 'name', render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '设备ID', dataIndex: 'deviceId', key: 'deviceId' },
    { title: '科室', dataIndex: 'department', key: 'department', render: (text: string) => <span><FolderOpenOutlined style={{ marginRight: 4 }} />{text}</span> },
    { title: '状态', key: 'status', render: (_: any, record: DeviceData) => (
      <Tag color={record.status === 'updated' ? 'green' : 'orange'}>
        {record.status === 'updated' ? '已更新' : '未更新'}
      </Tag>
    )},
    { title: '数据大小', dataIndex: 'dataSize', key: 'dataSize' },
    { title: '数据增量', key: 'hasIncrement', render: (_: any, record: DeviceData) => (
      record.hasIncrement ? (
        <Tag color="blue">有数据增量</Tag>
      ) : (
        <Tag 
          style={{ 
            backgroundColor: isDark ? '#262626' : '#EBEBEB', 
            color: isDark ? '#ADADAD' : '#595959',
            border: 'none'
          }}
        >
          无数据增量
        </Tag>
      )
    )},
  ]

  const storageColumns = [
    { title: '存储设备', dataIndex: 'name', key: 'name', render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span> },
    { title: '今日增加', dataIndex: 'addedCapacity', key: 'addedCapacity', render: (text: string) => <Tag color="green">{text}</Tag> },
    { title: '已用容量', dataIndex: 'usedCapacity', key: 'usedCapacity' },
    { title: '总容量', dataIndex: 'totalCapacity', key: 'totalCapacity' },
    { 
      title: '使用率', 
      key: 'usageRate', 
      render: (_: any, record: StorageInfo) => (
        <Progress 
          percent={record.usageRate} 
          size="small" 
          strokeColor={record.usageRate > 90 ? '#ff4d4f' : record.usageRate > 70 ? '#faad14' : '#52c41a'}
        />
      ) 
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        实验数据
      </h1>

      <Row gutter={20}>
        <Col span={4}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <span style={{ fontSize: 14, color: isDark ? '#999' : '#666' }}>已更新设备</span>
            </div>
            <Statistic
              value={updatedCount}
              suffix={'台'}
              valueStyle={{ fontSize: 32, fontWeight: 600, color: '#52c41a' }}
              suffixStyle={{ fontSize: 16 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: isDark ? '#666' : '#999' }}>共 {deviceData.length} 台设备</div>
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <ClockCircleOutlined style={{ fontSize: 24, color: '#faad14' }} />
              <span style={{ fontSize: 14, color: isDark ? '#999' : '#666' }}>未更新设备</span>
            </div>
            <Statistic
              value={notUpdatedCount}
              suffix={'台'}
              valueStyle={{ fontSize: 32, fontWeight: 600, color: '#faad14' }}
              suffixStyle={{ fontSize: 16 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: isDark ? '#666' : '#999' }}>需关注数据同步</div>
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <UpOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <span style={{ fontSize: 14, color: isDark ? '#999' : '#666' }}>有数据增量</span>
            </div>
            <Statistic
              value={hasIncrementCount}
              suffix={'台'}
              valueStyle={{ fontSize: 32, fontWeight: 600, color: '#1890ff' }}
              suffixStyle={{ fontSize: 16 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: isDark ? '#666' : '#999' }}>数据正常采集</div>
          </Card>
        </Col>
        <Col span={4}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <AlertOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
              <span style={{ fontSize: 14, color: isDark ? '#999' : '#666' }}>无数据增量</span>
            </div>
            <Statistic
              value={noIncrementCount}
              suffix={'台'}
              valueStyle={{ fontSize: 32, fontWeight: 600, color: '#ff4d4f' }}
              suffixStyle={{ fontSize: 16 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: isDark ? '#666' : '#999' }}>需检查设备状态</div>
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
              <BarChartOutlined style={{ fontSize: 24, color: '#722ED1' }} />
              <span style={{ fontSize: 14, color: isDark ? '#999' : '#666' }}>今日增量</span>
            </div>
            <Statistic
              value={5.2}
              suffix={'GB'}
              valueStyle={{ fontSize: 32, fontWeight: 600, color: '#722ED1' }}
              suffixStyle={{ fontSize: 16 }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: isDark ? '#666' : '#999' }}>累计 128.6 GB</div>
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>
          <DatabaseOutlined style={{ marginRight: 8, color: '#1890ff' }} />
          今日实验室设备数据增量
        </h3>
        <Table
          columns={deviceColumns}
          dataSource={deviceData}
          pagination={false}
          size="small"
        />
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 20 }}>
          <DatabaseOutlined style={{ marginRight: 8, color: '#722ED1' }} />
          今日硬盘容量变化
        </h3>
        <Table
          columns={storageColumns}
          dataSource={storageInfo}
          pagination={false}
          size="small"
        />
      </Card>
    </div>
  )
}