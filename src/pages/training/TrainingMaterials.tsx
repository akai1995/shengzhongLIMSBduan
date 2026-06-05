import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, Upload, message, Popconfirm, Row, Col, DatePicker } from 'antd'
import { PlusOutlined, UploadOutlined, EyeOutlined, DeleteOutlined, EditOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'
import { useState } from 'react'


const { Option } = Select
const { RangePicker } = DatePicker

export default function TrainingMaterials() {
  const { isDark } = useThemeStore()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isLearningRecordVisible, setIsLearningRecordVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新建资料')
  const [expanded, setExpanded] = useState(false)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [learningForm] = Form.useForm()

  const handleCreate = () => {
    setModalTitle('新建资料')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setModalTitle('编辑资料')
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('表单数据:', values)
      message.success('保存成功')
      setIsModalVisible(false)
    })
  }

  

  const handleViewLearningRecord = (record: any) => {
    learningForm.setFieldsValue(record)
    setIsLearningRecordVisible(true)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: '缩略图',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 80,
      render: (text: string) => (
        <div style={{ width: 60, height: 40, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {text ? <img src={text} alt="缩略图" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '📄'}
        </div>
      ),
    },
    { title: '资料标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '资料分类', dataIndex: 'category', key: 'category', width: 100 },
    { title: '资料类型', dataIndex: 'type', key: 'type', width: 80, render: (type: string) => <Tag color="blue">{type}</Tag> },
    { title: '文件大小', dataIndex: 'fileSize', key: 'fileSize', width: 100 },
    { title: '学习时长', dataIndex: 'duration', key: 'duration', width: 100 },
    { title: '上传人', dataIndex: 'uploader', key: 'uploader', width: 100 },
    { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 120 },
    { title: '学习次数', dataIndex: 'learnCount', key: 'learnCount', width: 90 },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => (
        <Tag color={status === '启用' ? 'green' : 'default'}>{status}</Tag>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 280,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" onClick={() => {
            const newStatus = record.status === '启用' ? '禁用' : '启用'
            message.success(`已将资料"${record.title}"设为${newStatus}`)
          }}>
            {record.status === '启用' ? '下架' : '上架'}
          </Button>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handleViewLearningRecord(record)}>
            查看学习记录
          </Button>
          <Popconfirm title="确定删除该资料吗？" onConfirm={() => message.success('删除成功')}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const learningRecordColumns = [
    { title: '学员姓名', dataIndex: 'name', key: 'name' },
    { title: '所属部门', dataIndex: 'department', key: 'department' },
    { title: '学习进度', dataIndex: 'progress', key: 'progress', render: (val: number) => `${val}%` },
    { title: '学习时长', dataIndex: 'learnDuration', key: 'learnDuration' },
    { title: '首次学习时间', dataIndex: 'firstLearnTime', key: 'firstLearnTime' },
    { title: '最近学习时间', dataIndex: 'lastLearnTime', key: 'lastLearnTime' },
    {
      title: '完成状态',
      dataIndex: 'completeStatus',
      key: 'completeStatus',
      render: (status: string) => <Tag color={status === '已完成' ? 'green' : 'orange'}>{status}</Tag>,
    },
  ]

  const data = Array.from({ length: 20 }, (_, i) => {
    const categories = ['安全培训', '操作规程', '管理制度', '技术规范', '应急处理']
    const types = ['视频', '文档', 'PPT', 'PDF', '图片']
    const statuses = ['启用', '禁用']
    const titles = [
      '实验室安全操作规程', 'LIMS系统使用手册', '仪器设备操作指南', '试剂管理规范',
      '危险化学品处理', '生物安全培训', '辐射防护知识', '消防安全管理',
      '急救知识培训', '危化品安全手册', '实验室准入培训', '设备维护指南'
    ]
    return {
      key: String(i + 1),
      id: i + 1,
      title: titles[i % titles.length],
      category: categories[i % categories.length],
      type: types[i % types.length],
      fileSize: `${(Math.random() * 500 + 10).toFixed(1)} MB`,
      duration: `${Math.floor(Math.random() * 120) + 10} 分钟`,
      uploader: ['张三', '李四', '王五', '赵六'][i % 4],
      uploadTime: `2024-${String(Math.floor(i / 2) + 1).padStart(2, '0')}-${String((i % 28) + 1).padStart(2, '0')}`,
      learnCount: Math.floor(Math.random() * 500),
      status: statuses[i % 2],
      department: ['研发部', '测试部', '生产部', '质量部'][i % 4],
      progress: Math.floor(Math.random() * 100),
      learnDuration: `${Math.floor(Math.random() * 10)}小时${Math.floor(Math.random() * 60)}分`,
      firstLearnTime: `2024-0${(i % 6) + 1}-${String((i % 20) + 1).padStart(2, '0')} ${String(8 + (i % 8)).padStart(2, '0')}:00`,
      lastLearnTime: `2024-0${(i % 6) + 1}-${String((i % 20) + 1).padStart(2, '0')} ${String(14 + (i % 8)).padStart(2, '0')}:30`,
      completeStatus: Math.random() > 0.3 ? '已完成' : '学习中',
    }
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        培训资料
      </h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal">
          {expanded ? (
            <>
              <Row gutter={20} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="资料标题" name="title">
                    <Input placeholder="请输入资料标题" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="资料分类" name="category">
                    <Select placeholder="请选择资料分类" options={[
                      { value: 'security', label: '安全培训' },
                      { value: 'operation', label: '操作规程' },
                      { value: 'management', label: '管理制度' },
                      { value: 'technical', label: '技术规范' },
                      { value: 'emergency', label: '应急处理' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="资料类型" name="type">
                    <Select placeholder="请选择资料类型" options={[
                      { value: 'video', label: '视频' },
                      { value: 'document', label: '文档' },
                      { value: 'ppt', label: 'PPT' },
                      { value: 'pdf', label: 'PDF' },
                      { value: 'image', label: '图片' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="上传人" name="uploader">
                    <Input placeholder="请输入上传人" />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="状态" name="status">
                    <Select placeholder="请选择状态" options={[
                      { value: 'enabled', label: '启用' },
                      { value: 'disabled', label: '禁用' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="上传时间" name="uploadTime">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={12} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary">查询</Button>
                  <Button className="reset-btn">重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={20} style={{ height: 32 }}>
              <Col span={6}>
                <Form.Item label="资料标题" name="title">
                  <Input placeholder="请输入资料标题" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="资料分类" name="category">
                  <Select placeholder="请选择资料分类" options={[
                    { value: 'security', label: '安全培训' },
                    { value: 'operation', label: '操作规程' },
                    { value: 'management', label: '管理制度' },
                    { value: 'technical', label: '技术规范' },
                    { value: 'emergency', label: '应急处理' },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="资料类型" name="type">
                  <Select placeholder="请选择资料类型" options={[
                    { value: 'video', label: '视频' },
                    { value: 'document', label: '文档' },
                    { value: 'ppt', label: 'PPT' },
                    { value: 'pdf', label: 'PDF' },
                    { value: 'image', label: '图片' },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button type="primary">查询</Button>
                <Button className="reset-btn">重置</Button>
                <Button type="link" onClick={() => setExpanded(true)} style={{ padding: 0 }}>展开<DownOutlined /></Button>
              </Col>
            </Row>
          )}
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建资料
            </Button>
            <Button type="primary" disabled={selectedRows.length === 0} className="export-btn">批量删除</Button>
            <Button type="primary" disabled={selectedRows.length === 0} className="export-btn">批量上架</Button>
            <Button type="primary" disabled={selectedRows.length === 0} className="export-btn">批量下架</Button>
          </Space>
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
          <Form.Item label="资料标题" name="title" rules={[{ required: true, message: '请输入资料标题' }]}>
            <Input placeholder="请输入资料标题" />
          </Form.Item>
          <Form.Item label="资料分类" name="category" rules={[{ required: true, message: '请选择资料分类' }]}>
            <Select placeholder="请选择资料分类">
              <Option value="security">安全培训</Option>
              <Option value="operation">操作规程</Option>
              <Option value="management">管理制度</Option>
              <Option value="technical">技术规范</Option>
              <Option value="emergency">应急处理</Option>
            </Select>
          </Form.Item>
          <Form.Item label="资料类型" name="type" rules={[{ required: true, message: '请选择资料类型' }]}>
            <Select placeholder="请选择资料类型">
              <Option value="video">视频</Option>
              <Option value="document">文档</Option>
              <Option value="ppt">PPT</Option>
              <Option value="pdf">PDF</Option>
              <Option value="image">图片</Option>
            </Select>
          </Form.Item>
          <Form.Item label="上传文件" name="file" rules={[{ required: true, message: '请上传文件' }]}>
            <Upload accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi" maxCount={1}>
              <Button icon={<UploadOutlined />}>上传文件</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="封面图片" name="cover">
            <Upload accept="image/*" maxCount={1} listType="picture">
              <Button icon={<UploadOutlined />}>上传封面</Button>
            </Upload>
          </Form.Item>
          <Form.Item label="学习时长" name="duration">
            <Input placeholder="请输入学习时长，如：60分钟" />
          </Form.Item>
          <Form.Item label="资料简介" name="description">
            <Input.TextArea rows={3} placeholder="请输入资料简介" />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue="启用" rules={[{ required: true, message: '请选择状态' }]}>
            <Select>
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item label="排序权重" name="sortOrder">
            <Input type="number" placeholder="数值越大越靠前" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="查看学习记录"
        open={isLearningRecordVisible}
        onCancel={() => setIsLearningRecordVisible(false)}
        footer={null}
        width={1000}
      >
        <div style={{ marginBottom: 16 }}>
          <span>资料标题：{learningForm.getFieldValue('title')}</span>
        </div>
        <Table
          columns={learningRecordColumns}
          dataSource={data.slice(0, 5)}
          pagination={false}
        />
      </Modal>
    </div>
  )
}
