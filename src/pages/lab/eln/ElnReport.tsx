import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Space, message, Row, Col } from 'antd'
import { SearchOutlined, DownOutlined, UpOutlined, FileTextOutlined, DownloadOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'

const { Option } = Select
const { RangePicker } = DatePicker

interface ReportItem {
  key: string
  id: string
  name: string
  recordId: string
  format: string
  createTime: string
  fileSize: string
}

export default function ElnReport() {
  const [searchForm] = Form.useForm()
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [deleteReport, setDeleteReport] = useState<ReportItem | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [tableData, setTableData] = useState<ReportItem[]>([])
  const [filteredData, setFilteredData] = useState<ReportItem[]>([])

  useEffect(() => {
    const initialData: ReportItem[] = Array.from({ length: 50 }, (_, i) => {
      const formats = ['PDF', 'Word', 'PDF', 'Word', 'PDF']
      return {
        key: String(i + 1),
        id: `RPT2026${String(i + 1).padStart(4, '0')}`,
        name: `实验记录汇总报告-${String(i + 1).padStart(3, '0')}`,
        recordId: `ELN2026${String(1001 + i).padStart(4, '0')}`,
        format: formats[i % formats.length],
        createTime: `2026-05-${String(1 + (i % 28)).padStart(2, '0')} 1${String(0 + (i % 24)).padStart(2, '0')}:30`,
        fileSize: `${(1.2 + Math.random() * 5).toFixed(2)} MB`,
      }
    })
    setTableData(initialData)
    setFilteredData(initialData)
  }, [])

  const columns = [
    { title: '报告名称', dataIndex: 'name', key: 'name', width: 220 },
    { title: '对应实验记录ID', dataIndex: 'recordId', key: 'recordId', width: 160 },
    { 
      title: '文件格式', 
      dataIndex: 'format', 
      key: 'format', 
      width: 100,
      render: (format: string) => (
        <Tag color={format === 'PDF' ? 'red' : 'blue'}>{format}</Tag>
      )
    },
    { title: '生成时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    { title: '文件大小', dataIndex: 'fileSize', key: 'fileSize', width: 100 },
    { 
      title: '操作', 
      key: 'action', 
      width: 160, 
      fixed: 'right' as const,
      render: (_: any, record: ReportItem) => (
        <Space size="middle">
          <Button type="text" icon={<DownloadOutlined />}>下载</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      )
    },
  ]

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    let result = [...tableData]
    
    if (values.name) {
      result = result.filter(item => item.name.includes(values.name))
    }
    if (values.recordId) {
      result = result.filter(item => item.recordId.includes(values.recordId))
    }
    if (values.format && values.format !== 'all') {
      result = result.filter(item => item.format === values.format)
    }
    if (values.dateRange && values.dateRange.length === 2) {
      const startDate = values.dateRange[0].format('YYYY-MM-DD')
      const endDate = values.dateRange[1].format('YYYY-MM-DD')
      result = result.filter(item => item.createTime.substring(0, 10) >= startDate && item.createTime.substring(0, 10) <= endDate)
    }
    
    setFilteredData(result)
    message.info(`搜索完成，共找到 ${result.length} 条记录`)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setFilteredData([...tableData])
  }

  const handleCreate = () => {
    setCreateModalVisible(true)
  }

  const handleDelete = (record: ReportItem) => {
    setDeleteReport(record)
    setDeleteModalVisible(true)
  }

  const confirmDelete = () => {
    if (!deleteReport) return
    
    setTableData(prev => prev.filter(item => item.key !== deleteReport.key))
    setFilteredData(prev => prev.filter(item => item.key !== deleteReport.key))
    message.success('删除成功')
    setDeleteModalVisible(false)
    setDeleteReport(null)
  }

  const handleGenerateReport = (values: any) => {
    const now = new Date()
    const newReport: ReportItem = {
      key: String(Date.now()),
      id: `RPT${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      name: values.name || `实验记录汇总报告-${Date.now()}`,
      recordId: values.recordId || `ELN2026${String(Math.floor(Math.random() * 1000) + 1000).padStart(4, '0')}`,
      format: values.format || 'PDF',
      createTime: now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-'),
      fileSize: `${(1.2 + Math.random() * 5).toFixed(2)} MB`,
    }
    
    setTableData(prev => [newReport, ...prev])
    setFilteredData(prev => [newReport, ...prev])
    message.success('报告生成成功')
    setCreateModalVisible(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <PageTitle>报告生成</PageTitle>

      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16} style={{ height: '32px' }}>
            <Col span={6}>
              <Form.Item label="报告名称" name="name"><Input placeholder="请输入报告名称" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="实验记录ID" name="recordId"><Input placeholder="请输入实验记录ID" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="文件格式" name="format">
                <Select placeholder="请选择格式">
                  <Option value="all">全部</Option>
                  <Option value="PDF">PDF</Option>
                  <Option value="Word">Word</Option>
                </Select>
              </Form.Item>
            </Col>
            {expanded && (
              <Col span={6}>
                <Form.Item label="生成时间" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            )}
            {!expanded && (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset} className="reset-btn">重置</Button>
                    <Button type="link" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
                      {expanded ? '收起' : '展开'}
                      {expanded ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            )}
          </Row>
          
          {expanded && (
            <Row gutter={16} style={{ height: '32px', marginTop: '20px' }}>
              <Col span={6} offset={18}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset} className="reset-btn">重置</Button>
                    <Button type="link" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
                      {expanded ? '收起' : '展开'}
                      {expanded ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Button type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />} onClick={handleCreate}>
          生成报告
        </Button>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          scroll={{ x: 'max-content' }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      <Modal
        title="生成报告"
        open={createModalVisible}
        onCancel={() => setCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" onFinish={handleGenerateReport}>
          <Form.Item label="报告名称" name="name">
            <Input placeholder="请输入报告名称" />
          </Form.Item>
          <Form.Item label="关联实验记录ID" name="recordId">
            <Input placeholder="请输入实验记录ID" />
          </Form.Item>
          <Form.Item label="报告模板" name="template" rules={[{ required: true, message: '请选择报告模板' }]}>
            <Select placeholder="请选择报告模板">
              <Option value="default">默认报告模板</Option>
              <Option value="detailed">详细报告模板</Option>
              <Option value="summary">摘要报告模板</Option>
              <Option value="custom">自定义报告模板</Option>
            </Select>
          </Form.Item>
          <Form.Item label="文件格式" name="format" rules={[{ required: true, message: '请选择文件格式' }]}>
            <Select placeholder="请选择文件格式">
              <Option value="PDF">PDF</Option>
              <Option value="Word">Word</Option>
            </Select>
          </Form.Item>
          <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
            <Button onClick={() => setCreateModalVisible(false)}>取消</Button>
            <Button type="primary" style={{ marginLeft: 10 }} htmlType="submit">生成报告</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false)
          setDeleteReport(null)
        }}
        footer={null}
      >
        <p>确定删除报告 <strong>{deleteReport?.name}</strong> 吗？</p>
        <p style={{ color: '#FF4D4F', marginTop: 12 }}>删除后将无法恢复，此操作不可逆。</p>
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <Button onClick={() => {
            setDeleteModalVisible(false)
            setDeleteReport(null)
          }}>取消</Button>
          <Button type="primary" danger onClick={confirmDelete} style={{ marginLeft: 10 }}>
            确定删除
          </Button>
        </div>
      </Modal>
    </div>
  )
}