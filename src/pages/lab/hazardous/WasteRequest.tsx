import { Card, Form, Input, Button, Select, Table, Modal, Tag, DatePicker, message, Row, Col, Upload } from 'antd'
import { PlusOutlined, EyeOutlined, CheckOutlined, CloseOutlined, DownOutlined, UpOutlined, SearchOutlined, FileTextOutlined } from '@ant-design/icons'
import { useState } from 'react'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker

export default function WasteRequest() {
  const { isDark } = useThemeStore()
  const [form] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [approveModalVisible, setApproveModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [expanded, setExpanded] = useState(false)

  const columns = [
    { title: '申请单号', dataIndex: 'id', key: 'id' },
    { title: '废弃物类型', dataIndex: 'type', key: 'type', render: (type: string) => {
      const colorMap: Record<string, string> = {
        '有机废液': 'blue',
        '无机废液': 'green',
        '固体废物': 'orange',
        '锐器': 'red',
        '生物废物': 'purple',
      }
      return <Tag color={colorMap[type] || 'gray'}>{type}</Tag>
    }},
    { title: '产生来源', dataIndex: 'source', key: 'source' },
    { title: '数量', dataIndex: 'quantity', key: 'quantity' },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
    { title: '申请时间', dataIndex: 'time', key: 'time' },
    { title: '审批状态', dataIndex: 'status', key: 'status', render: (status: string) => {
      const colorMap: Record<string, string> = {
        '待审批': 'orange',
        '已通过': 'green',
        '已拒绝': 'red',
        '处理中': 'blue',
      }
      return <Tag color={colorMap[status] || 'gray'}>{status}</Tag>
    }},
    { title: '处理单位', dataIndex: 'processor', key: 'processor' },
    { title: '操作', dataIndex: 'operation', key: 'operation', fixed: 'right' as const, width: 120, render: (_: any, record: any) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="text" icon={<EyeOutlined />} onClick={() => {
          setCurrentRecord(record)
          setDetailModalVisible(true)
        }}>查看</Button>
        {record.status === '待审批' && (
          <Button type="text" icon={<CheckOutlined />} onClick={() => {
            setCurrentRecord(record)
            setApproveModalVisible(true)
          }}>审批</Button>
        )}
      </div>
    )},
  ]

  const data = Array.from({ length: 100 }, (_, i) => {
    const types = ['有机废液', '无机废液', '固体废物', '锐器', '生物废物']
    const sources = ['实验项目A', '科研项目B', '测试项目C', '实验项目D']
    const applicants = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
    const statuses = ['待审批', '已通过', '已通过', '已拒绝', '处理中']
    const processors = ['环保处理公司A', '废弃物处理中心B', '专业处理机构C']
    const status = statuses[i % statuses.length]
    return {
      key: String(i + 1),
      id: `WR2024${String(i + 1).padStart(4, '0')}`,
      type: types[i % types.length],
      source: sources[i % sources.length],
      quantity: `${5 + Math.floor(Math.random() * 20)}kg`,
      applicant: applicants[i % applicants.length],
      time: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      status,
      processor: status !== '待审批' && status !== '已拒绝' ? processors[i % processors.length] : '-',
    }
  })

  const handleSubmit = () => {
    setDetailModalVisible(false)
    message.success('申请提交成功')
  }

  const handleApprove = (result: 'pass' | 'reject') => {
    setApproveModalVisible(false)
    message.success(result === 'pass' ? '审批通过' : '审批拒绝')
  }

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, marginBottom: 24, color: isDark ? '#FFFFFF' : '#000000' }}>废弃物申请</h1>
      
      <Card style={{ marginBottom: 24, borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={form} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          {expanded ? (
            <>
              <Row gutter={16} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="申请人" name="applicant"><Input placeholder="请输入申请人" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="废弃物类型" name="type">
                    <Select placeholder="请选择废弃物类型" style={{ width: '100%' }} allowClear>
                      <Option value="all">全部</Option>
                      <Option value="有机废液">有机废液</Option>
                      <Option value="无机废液">无机废液</Option>
                      <Option value="固体废物">固体废物</Option>
                      <Option value="锐器">锐器</Option>
                      <Option value="生物废物">生物废物</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="审批状态" name="status">
                    <Select placeholder="请选择审批状态" style={{ width: '100%' }} allowClear>
                      <Option value="all">全部</Option>
                      <Option value="待审批">待审批</Option>
                      <Option value="已通过">已通过</Option>
                      <Option value="已拒绝">已拒绝</Option>
                      <Option value="处理中">处理中</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="申请时间" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
                <Col span={18}></Col>
                <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary">查询</Button>
                  <Button onClick={() => form.resetFields()} className="reset-btn">重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={16} style={{ height: 32 }}>
              <Col span={6}>
                <Form.Item label="申请人" name="applicant"><Input placeholder="请输入申请人" /></Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="废弃物类型" name="type">
                  <Select placeholder="请选择废弃物类型" style={{ width: '100%' }} allowClear>
                    <Option value="all">全部</Option>
                    <Option value="有机废液">有机废液</Option>
                    <Option value="无机废液">无机废液</Option>
                    <Option value="固体废物">固体废物</Option>
                    <Option value="锐器">锐器</Option>
                    <Option value="生物废物">生物废物</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="审批状态" name="status">
                  <Select placeholder="请选择审批状态" style={{ width: '100%' }} allowClear>
                    <Option value="all">全部</Option>
                    <Option value="待审批">待审批</Option>
                    <Option value="已通过">已通过</Option>
                    <Option value="已拒绝">已拒绝</Option>
                    <Option value="处理中">处理中</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button type="primary">查询</Button>
                <Button onClick={() => form.resetFields()} className="reset-btn">重置</Button>
                <Button type="link" onClick={() => setExpanded(true)} style={{ padding: 0 }}>展开<DownOutlined /></Button>
              </Col>
            </Row>
          )}
        </Form>
      </Card>
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5', overflowX: 'auto' }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => {
            setCurrentRecord(null)
            setDetailModalVisible(true)
          }}>废弃物申请</Button>
        </div>
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
        title="废弃物申请"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setDetailModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSubmit}>提交申请</Button>,
        ]}
        width={600}
      >
        <Form layout="vertical" form={form} initialValues={currentRecord}>
          <Form.Item label="废弃物类型" name="type" rules={[{ required: true, message: '请选择废弃物类型' }]}>
            <Select placeholder="请选择">
              <Option value="有机废液">有机废液</Option>
              <Option value="无机废液">无机废液</Option>
              <Option value="固体废物">固体废物</Option>
              <Option value="锐器">锐器</Option>
              <Option value="生物废物">生物废物</Option>
            </Select>
          </Form.Item>
          <Form.Item label="产生来源" name="source" rules={[{ required: true, message: '请输入产生来源' }]}>
            <Input placeholder="如：某某实验" />
          </Form.Item>
          <Form.Item label="预估数量" name="quantity" rules={[{ required: true, message: '请输入预估数量' }]}>
            <Input placeholder="如：10kg" />
          </Form.Item>
          <Form.Item label="化学成分/主要成分" name="components">
            <Input.TextArea rows={3} placeholder="请描述主要化学成分" />
          </Form.Item>
          <Form.Item label="存储容器" name="container">
            <Select placeholder="请选择">
              <Option value="塑料桶">塑料桶</Option>
              <Option value="玻璃瓶">玻璃瓶</Option>
              <Option value="专用容器">专用容器</Option>
            </Select>
          </Form.Item>
          <Form.Item label="危险特性" name="hazards">
            <Select mode="multiple" placeholder="请选择">
              <Option value="毒性">毒性</Option>
              <Option value="腐蚀性">腐蚀性</Option>
              <Option value="易燃">易燃</Option>
              <Option value="易爆">易爆</Option>
            </Select>
          </Form.Item>
          <Form.Item label="附件">
            <Upload.Dragger accept=".pdf,.jpg,.png,.doc,.docx" multiple>
              <p className="ant-upload-drag-icon">
                <FileTextOutlined />
              </p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
              <p className="ant-upload-hint">支持图片、文档等格式</p>
            </Upload.Dragger>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="审批"
        open={approveModalVisible}
        onCancel={() => setApproveModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setApproveModalVisible(false)}>取消</Button>,
          <Button key="reject" danger icon={<CloseOutlined />} onClick={() => handleApprove('reject')}>拒绝</Button>,
          <Button key="submit" type="primary" icon={<CheckOutlined />} onClick={() => handleApprove('pass')}>通过</Button>,
        ]}
        width={600}
      >
        {currentRecord && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h4 style={{ marginBottom: 8 }}>申请信息</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 16px' }}>
                <div><span style={{ color: '#8C8C8C' }}>申请单号：</span>{currentRecord.id}</div>
                <div><span style={{ color: '#8C8C8C' }}>申请人：</span>{currentRecord.applicant}</div>
                <div><span style={{ color: '#8C8C8C' }}>废弃物类型：</span>{currentRecord.type}</div>
                <div><span style={{ color: '#8C8C8C' }}>数量：</span>{currentRecord.quantity}</div>
                <div><span style={{ color: '#8C8C8C' }}>产生来源：</span>{currentRecord.source}</div>
                <div><span style={{ color: '#8C8C8C' }}>申请时间：</span>{currentRecord.time}</div>
              </div>
            </div>
            <Form layout="vertical">
              <Form.Item label="审批意见" name="opinion" rules={[{ required: true, message: '请输入审批意见' }]}>
                <Input.TextArea rows={3} placeholder="请输入审批意见" />
              </Form.Item>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}
