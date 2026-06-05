import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Row, Col } from 'antd'
import { FileTextOutlined, SearchOutlined, DownloadOutlined, EyeOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker

export default function VisitRecords() {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [expanded, setExpanded] = useState(false)

  const columns = [
    { title: '申请ID', dataIndex: 'id', key: 'id' },
    { title: '申请人', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    { title: '进入区域', dataIndex: 'area', key: 'area' },
    { title: '来访时间', dataIndex: 'visitTime', key: 'visitTime' },
    { title: '事由', dataIndex: 'reason', key: 'reason' },
    { title: '陪同人', dataIndex: 'escort', key: 'escort' },
    { title: '审核状态', dataIndex: 'status', key: 'status', render: (status: string) => {
      const colorMap: Record<string, string> = {
        '通过': 'green',
        '拒绝': 'red',
        '待审核': 'orange'
      }
      return <Tag color={colorMap[status] || 'gray'}>{status}</Tag>
    }},
    { title: '审核人', dataIndex: 'reviewer', key: 'reviewer' },
    { title: '审核时间', dataIndex: 'reviewTime', key: 'reviewTime' },
    { title: '签字文件', dataIndex: 'signature', key: 'signature', render: () => (
      <Button type="text" icon={<FileTextOutlined />} className="action-button" onClick={() => {}}>下载PDF</Button>
    )},
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 120, render: (_: any, record: any) => (
      <Button type="text" icon={<EyeOutlined />} className="action-button" onClick={() => {
        setCurrentRecord(record)
        setDetailModalVisible(true)
      }}>查看详情</Button>
    )},
  ]

  const data = Array.from({ length: 100 }, (_, i) => {
    const statuses = ['通过', '待审核', '拒绝']
    const status = statuses[i % 3]
    const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十', '郑一', '陈二']
    const areas = ['实验室A101', '实验室B202', '实验室C301', '实验室D402', '实验室E503']
    const reasons = ['设备参观', '技术交流', '项目合作洽谈', '学术交流', '设备维护']
    const escorts = ['李四', '赵六', '孙八', '周九', '吴十']
    return {
      key: String(i + 1),
      id: `VS202405${String(i + 1).padStart(3, '0')}`,
      name: names[i % names.length],
      phone: `138****${String(1000 + i).padStart(4, '0')}`,
      area: areas[i % areas.length],
      visitTime: `2024-05-${String(10 + (i % 20)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:00-${String(11 + (i % 8)).padStart(2, '0')}:00`,
      reason: reasons[i % reasons.length],
      escort: escorts[i % escorts.length],
      status,
      reviewer: status === '待审核' ? '-' : '管理员',
      reviewTime: status === '待审核' ? '-' : `2024-05-${String(9 + (i % 20)).padStart(2, '0')} ${String(10 + (i % 8)).padStart(2, '0')}:30`,
      signature: status === '通过' ? '已签' : '未签',
    }
  })

  const auditLogs = [
    { reviewer: '管理员', time: '2024-05-13 16:30', opinion: '审核通过', status: '通过' },
    { reviewer: '系统', time: '2024-05-13 10:00', opinion: '提交申请', status: '待审核' },
  ]

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>来访记录</h1>
      
      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={form} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16}>
            <Col span={6}>
              <Form.Item label="申请人" name="name"><Input placeholder="请输入申请人" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="手机号" name="phone"><Input placeholder="请输入手机号" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="进入区域" name="area">
                <Select placeholder="请选择区域">
                  <Option value="all">全部</Option>
                  <Option value="A">实验室A区</Option>
                  <Option value="B">实验室B区</Option>
                  <Option value="C">实验室C区</Option>
                </Select>
              </Form.Item>
            </Col>
            {expanded && (
              <>
                <Col span={6}>
                  <Form.Item label="申请时间" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </>
            )}
            {!expanded && (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary">查询</Button>
                    <Button onClick={() => form.resetFields()} className="reset-btn">重置</Button>
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
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="审核状态" name="status">
                  <Select placeholder="全部">
                    <Option value="all">全部</Option>
                    <Option value="pass">通过</Option>
                    <Option value="reject">拒绝</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} offset={12}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary">查询</Button>
                    <Button onClick={() => form.resetFields()} className="reset-btn">重置</Button>
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
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', overflowX: 'auto' }} bodyStyle={{ padding: 20 }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          scroll={{ x: 'max-content' }}
          rowKey="id" 
          pagination={{ pageSize: 10 }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
        />
      </Card>

      <Modal
        title="来访申请详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {currentRecord && (
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 500, color: '#000000', marginBottom: 16 }}>申请信息</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 24 }}>
              <div><span style={{ color: '#8C8C8C' }}>申请ID：</span><span style={{ color: '#262626' }}>{currentRecord.id}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>申请人：</span><span style={{ color: '#262626' }}>{currentRecord.name}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>手机号：</span><span style={{ color: '#262626' }}>{currentRecord.phone}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>进入区域：</span><span style={{ color: '#262626' }}>{currentRecord.area}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>来访时间：</span><span style={{ color: '#262626' }}>{currentRecord.visitTime}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>事由：</span><span style={{ color: '#262626' }}>{currentRecord.reason}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>陪同人：</span><span style={{ color: '#262626' }}>{currentRecord.escort}</span></div>
              <div><span style={{ color: '#8C8C8C' }}>审核状态：</span><Tag color={currentRecord.status === '通过' ? 'green' : currentRecord.status === '拒绝' ? 'red' : 'orange'}>{currentRecord.status}</Tag></div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ border: '1px solid #E5E5E5', borderRadius: 8, padding: 16, textAlign: 'center' }}>
                <p style={{ color: '#8C8C8C', marginBottom: 8 }}>电子签名</p>
                <div style={{ width: 150, height: 80, border: '1px dashed #E5E5E5', borderRadius: 4, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <span style={{ color: '#B2B2B2' }}>签名图片</span>
                </div>
              </div>
            </div>
            
            <h3 style={{ fontSize: 16, fontWeight: 500, color: '#000000', marginBottom: 16 }}>审核记录</h3>
            <Table
              columns={[
                { title: '审核人', dataIndex: 'reviewer', key: 'reviewer' },
                { title: '审核时间', dataIndex: 'time', key: 'time' },
                { title: '审核意见', dataIndex: 'opinion', key: 'opinion' },
                { title: '状态', dataIndex: 'status', key: 'status' },
              ]}
              dataSource={auditLogs}
              rowKey="time"
              pagination={false}
            />
          </div>
        )}
      </Modal>
    </div>
  )
}