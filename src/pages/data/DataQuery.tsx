import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Row, Col, DatePicker } from 'antd'
import { EyeOutlined, DownloadOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'
import { useState } from 'react'

const { Option } = Select
const { RangePicker } = DatePicker

export default function DataQuery() {
  const { isDark } = useThemeStore()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [searchForm] = Form.useForm()

  const handleViewDetail = (record: any) => {
    message.info(`查看文件详情: ${record.fileName}`)
  }

  const columns = [
    { title: '文件名', dataIndex: 'fileName', key: 'fileName', ellipsis: true },
    { title: '设备', dataIndex: 'equipment', key: 'equipment', width: 150 },
    { title: '采集时间', dataIndex: 'collectTime', key: 'collectTime', width: 160 },
    { title: '大小', dataIndex: 'size', key: 'size', width: 100 },
    { title: '存储格式', dataIndex: 'format', key: 'format', width: 100, render: (val: string) => <Tag color="blue">{val}</Tag> },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
      ),
    },
  ]

  const data = Array.from({ length: 20 }, (_, i) => ({
    key: String(i + 1),
    fileName: `experiment_data_${String(i + 1).padStart(4, '0')}.parquet`,
    equipment: [`质谱仪A01`, '测序仪B02', 'PCR仪C03', '流式细胞仪D04', '显微镜E05'][i % 5],
    collectTime: `2024-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String((i % 60)).padStart(2, '0')}:00`,
    size: `${(Math.random() * 100 + 10).toFixed(1)} MB`,
    format: ['Parquet', 'CSV', 'JSON', 'AVRO'][i % 4],
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        数据查询
      </h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal">
          {expanded ? (
            <>
              <Row gutter={20} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="时间范围" name="timeRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="仪器/设备" name="equipment">
                    <Select placeholder="请选择设备" mode="multiple">
                      <Option value="mass">质谱仪A01</Option>
                      <Option value="sequencer">测序仪B02</Option>
                      <Option value="pcr">PCR仪C03</Option>
                      <Option value="flow">流式细胞仪D04</Option>
                      <Option value="microscope">显微镜E05</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="数据类型" name="dataType">
                    <Select placeholder="请选择" mode="multiple">
                      <Option value="raw">原始数据</Option>
                      <Option value="standard">标准化数据</Option>
                      <Option value="log">解析日志</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="文件名称" name="fileName">
                    <Input placeholder="请输入文件名" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20} style={{ height: 32, marginTop: 20 }}>
                <Col span={18}></Col>
                <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary">查询</Button>
                  <Button>重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={20} style={{ height: 32 }}>
              <Col span={6}>
                <Form.Item label="时间范围" name="timeRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="仪器/设备" name="equipment">
                  <Select placeholder="请选择设备" mode="multiple">
                    <Option value="mass">质谱仪A01</Option>
                    <Option value="sequencer">测序仪B02</Option>
                    <Option value="pcr">PCR仪C03</Option>
                    <Option value="flow">流式细胞仪D04</Option>
                    <Option value="microscope">显微镜E05</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="数据类型" name="dataType">
                  <Select placeholder="请选择" mode="multiple">
                    <Option value="raw">原始数据</Option>
                    <Option value="standard">标准化数据</Option>
                    <Option value="log">解析日志</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button type="primary">查询</Button>
                <Button>重置</Button>
                <Button type="link" onClick={() => setExpanded(true)} style={{ padding: 0 }}>展开<DownOutlined /></Button>
              </Col>
            </Row>
          )}
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
          <Button type="primary" disabled={selectedRows.length === 0} icon={<DownloadOutlined />}>
            导出
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 'max-content' }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
        />
      </Card>
    </div>
  )
}