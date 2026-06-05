import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, Upload, message, Popconfirm, Row, Col, DatePicker, Dropdown, Menu } from 'antd'
import { PlusOutlined, EyeOutlined, DownloadOutlined, DeleteOutlined, EditOutlined, MoreOutlined, UploadOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'
import { useState } from 'react'

const { Option } = Select
const { RangePicker } = DatePicker

export default function KnowledgeUpload() {
  const { isDark } = useThemeStore()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新建知识')
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  const handleCreate = () => {
    setModalTitle('新建知识')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setModalTitle('编辑知识')
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleViewDetail = (record: any) => {
    message.info(`查看知识详情: ${record.title}`)
  }

  const handleDownload = (record: any) => {
    message.info(`下载知识: ${record.title}`)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('表单数据:', values)
      message.success('保存成功')
      setIsModalVisible(false)
    })
  }

  const handleDelete = (record: any) => {
    message.success(`删除成功: ${record.title}`)
  }

  const columns = [
    {
      title: '',
      key: 'selection',
      width: 40,
      render: (_: any, record: any) => (
        <input type="checkbox" checked={selectedRows.includes(record.key)} onChange={(e) => {
          if (e.target.checked) {
            setSelectedRows([...selectedRows, record.key])
          } else {
            setSelectedRows(selectedRows.filter(k => k !== record.key))
          }
        }} />
      ),
    },
    { title: '知识标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '文件大小', dataIndex: 'size', key: 'size', width: 100 },
    { title: '所属分类', dataIndex: 'category', key: 'category', width: 120 },
    { title: '标签', dataIndex: 'tags', key: 'tags', width: 150, render: (tags: string[]) => tags.map((tag, i) => <Tag key={i}>{tag}</Tag>) },
    { title: '上传人', dataIndex: 'uploader', key: 'uploader', width: 100 },
    { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 130 },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" size="small" icon={<DownloadOutlined />} onClick={() => handleDownload(record)}>下载</Button>
          <Button type="text" size="small" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger>删除</Button>
        </Space>
      ),
    },
  ]

  const data = Array.from({ length: 20 }, (_, i) => ({
    key: String(i + 1),
    id: `KNO-${String(i + 1).padStart(4, '0')}`,
    title: [`实验室安全指南${i + 1}`, '实验操作规程', '仪器使用手册', '数据分析方法', '试剂管理规范', '设备维护指南'][i % 6],
    cover: '',
    fileType: ['文档', '视频', 'PDF', '图片'][i % 4],
    size: `${(Math.random() * 500 + 10).toFixed(1)} MB`,
    category: ['安全培训', '操作规程', '技术文档', '数据管理'][i % 4],
    tags: [['安全', '实验室'], ['操作', '指南'], ['仪器', '手册'], ['数据', '分析']][i % 4],
    version: `v${(i % 5) + 1}.${Math.floor(Math.random() * 10)}`,
    uploader: ['张三', '李四', '王五', '赵六'][i % 4],
    uploadTime: `2024-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    viewCount: Math.floor(Math.random() * 1000),
    downloadCount: Math.floor(Math.random() * 500),
    status: i % 3 === 0 ? '草稿' : i % 5 === 0 ? '已归档' : '已发布',
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        知识上传
      </h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal">
          <Row gutter={20} style={{ height: 32 }}>
            <Col span={6}>
              <Form.Item label="知识标题" name="title">
                <Input placeholder="请输入知识标题" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="文件类型" name="fileType">
                <Select placeholder="请选择" mode="multiple">
                  <Option value="document">文档</Option>
                  <Option value="video">视频</Option>
                  <Option value="pdf">PDF</Option>
                  <Option value="image">图片</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select placeholder="请选择">
                  <Option value="all">全部</Option>
                  <Option value="draft">草稿</Option>
                  <Option value="published">已发布</Option>
                  <Option value="archived">已归档</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button type="primary">搜索</Button>
              <Button>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建知识
            </Button>
            <Button type="primary" disabled={selectedRows.length === 0} icon={<DownloadOutlined />}>导出</Button>
          </Space>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
        />
      </Card>

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText="提交"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="知识标题" name="title" rules={[{ required: true, message: '请输入知识标题' }]}>
            <Input placeholder="请输入知识标题" />
          </Form.Item>
          <Form.Item label="知识类型" name="type" rules={[{ required: true, message: '请选择知识类型' }]}>
            <Select placeholder="请选择知识类型">
              <Option value="document">文档</Option>
              <Option value="video">视频</Option>
              <Option value="pdf">PDF</Option>
              <Option value="image">图片</Option>
            </Select>
          </Form.Item>
          <Form.Item label="文件上传" name="file" rules={[{ required: true, message: '请上传文件' }]}>
            <Upload.Dragger maxCount={1}>
              <p className="ant-upload-drag-icon">
                <UploadOutlined />
              </p>
              <p className="ant-upload-text">支持拖拽或点击上传</p>
              <p className="ant-upload-hint">单个文件不超过500MB</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="所属分类" name="category" rules={[{ required: true, message: '请选择所属分类' }]}>
            <Select placeholder="请选择所属分类">
              <Option value="safety">安全培训</Option>
              <Option value="operation">操作规程</Option>
              <Option value="technical">技术文档</Option>
              <Option value="data">数据管理</Option>
            </Select>
          </Form.Item>
          <Form.Item label="标签" name="tags">
            <Select mode="tags" placeholder="输入标签后回车添加" />
          </Form.Item>
          <Form.Item label="摘要/简介" name="summary">
            <Input.TextArea rows={3} placeholder="请填写知识内容的简要介绍，不超过500字" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}