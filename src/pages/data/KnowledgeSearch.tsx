import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Row, Col, DatePicker } from 'antd'
import { EyeOutlined, DownloadOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'
import { useState } from 'react'

const { Option } = Select
const { RangePicker } = DatePicker

export default function KnowledgeSearch() {
  const { isDark } = useThemeStore()
  const [searchText, setSearchText] = useState('')
  const [searchForm] = Form.useForm()

  const columns = [
    { title: '知识标题', dataIndex: 'title', key: 'title', ellipsis: true },
    { title: '摘要片段', dataIndex: 'summary', key: 'summary', ellipsis: true },
    { 
      title: '文件类型', 
      dataIndex: 'fileType', 
      key: 'fileType', 
      width: 100,
      render: (val: string) => <Tag color="blue">{val}</Tag>
    },
    { title: '文件大小', dataIndex: 'size', key: 'size', width: 100 },
    { title: '所属分类', dataIndex: 'category', key: 'category', width: 120 },
    { 
      title: '标签', 
      dataIndex: 'tags', 
      key: 'tags', 
      width: 150,
      render: (tags: string[]) => tags.map((tag, i) => <Tag key={i}>{tag}</Tag>)
    },
    { title: '上传人', dataIndex: 'uploader', key: 'uploader', width: 100 },
    { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 130 },
    { title: '匹配位置', dataIndex: 'matchLocation', key: 'matchLocation', width: 120 },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EyeOutlined />}>查看详情</Button>
          <Button type="text" size="small" icon={<DownloadOutlined />}>下载</Button>
        </Space>
      ),
    },
  ]

  const data = Array.from({ length: 20 }, (_, i) => ({
    key: String(i + 1),
    title: [`实验室安全指南${i + 1}`, '实验操作规程', '仪器使用手册', '数据分析方法', '试剂管理规范', '设备维护指南'][i % 6],
    summary: `这是关于${['实验室安全', '实验操作', '仪器使用', '数据分析', '试剂管理', '设备维护'][i % 6]}的详细说明文档，包含了相关的操作步骤和注意事项...`,
    fileType: ['文档', '视频', 'PDF', '图片'][i % 4],
    size: `${(Math.random() * 500 + 10).toFixed(1)} MB`,
    category: ['安全培训', '操作规程', '技术文档', '数据管理'][i % 4],
    tags: [['安全', '实验室'], ['操作', '指南'], ['仪器', '手册'], ['数据', '分析']][i % 4],
    uploader: ['张三', '李四', '王五', '赵六'][i % 4],
    uploadTime: `2024-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
    matchLocation: ['标题+正文', '正文', '标题', '标题+正文+标签'][i % 4],
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        全文检索
      </h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <Input
            placeholder="输入关键词进行全文检索..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            size="large"
            style={{ width: '100%' }}
          />
        </div>
        <Form form={searchForm} layout="horizontal">
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item label="文件类型" name="fileType">
                <Select placeholder="请选择">
                  <Option value="all">全部类型</Option>
                  <Option value="document">文档</Option>
                  <Option value="video">视频</Option>
                  <Option value="pdf">PDF</Option>
                  <Option value="image">图片</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="所属分类" name="category">
                <Select placeholder="请选择">
                  <Option value="all">全部分类</Option>
                  <Option value="safety">安全培训</Option>
                  <Option value="operation">操作规程</Option>
                  <Option value="technical">技术文档</Option>
                  <Option value="data">数据管理</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="上传时间" name="dateRange">
                <RangePicker style={{ width: '100%' }} />
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
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 14, color: isDark ? '#ADADAD' : '#8C8C8C' }}>
            共找到 <strong style={{ color: isDark ? '#FFFFFF' : '#262626' }}>{data.length}</strong> 条匹配结果
          </span>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
        />
      </Card>
    </div>
  )
}