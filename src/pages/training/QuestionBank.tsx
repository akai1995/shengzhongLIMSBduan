import { Card, Table, Button, Tag, Input, Select, Space, Modal, Form, message, Popconfirm, Switch, Row, Col, DatePicker } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { RangePicker } = DatePicker

export default function QuestionBank() {
  const [, setSelectedRows] = useState<string[]>([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [isPreviewVisible, setIsPreviewVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新建试题')
  const [form] = Form.useForm()
  const [previewData, setPreviewData] = useState<any>(null)
  const [expanded, setExpanded] = useState(false)
  const [searchForm] = Form.useForm()

  const handleCreate = () => {
    setModalTitle('新建试题')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setModalTitle('编辑试题')
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handlePreview = (record: any) => {
    setPreviewData(record)
    setIsPreviewVisible(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('试题数据:', values)
      message.success('保存成功')
      setIsModalVisible(false)
    })
  }

  const handleDelete = (record: any) => {
    message.success(`已删除试题：${record.question.substring(0, 20)}...`)
  }

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    {
      title: '试题内容',
      dataIndex: 'question',
      key: 'question',
      ellipsis: true,
      render: (text: string) => <span title={text}>{text.substring(0, 50)}...</span>
    },
    {
      title: '题型',
      dataIndex: 'type',
      key: 'type',
      width: 100,
      render: (t: string) => <Tag color="blue">{t}</Tag>
    },
    { title: '知识点', dataIndex: 'knowledge', key: 'knowledge', width: 120 },
    {
      title: '难度',
      dataIndex: 'level',
      key: 'level',
      width: 80,
      render: (l: string) => <Tag color={l === '简单' ? 'green' : l === '中等' ? 'orange' : 'red'}>{l}</Tag>
    },
    { title: '分值', dataIndex: 'score', key: 'score', width: 70 },
    { title: '创建人', dataIndex: 'creator', key: 'creator', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120 },
    { title: '使用次数', dataIndex: 'usageCount', key: 'usageCount', width: 90 },
    { title: '正确率', dataIndex: 'accuracy', key: 'accuracy', width: 90, render: (val: number) => `${val}%` },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: boolean) => <Switch checked={status} checkedChildren="启用" unCheckedChildren="禁用" />
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>
            预览
          </Button>
          <Popconfirm title="确定删除该试题吗？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const data = Array.from({ length: 30 }, (_, i) => {
    const types = ['单选题', '多选题', '判断题', '填空题', '问答题']
    const levels = ['简单', '中等', '困难']
    const knowledges = ['安全规范', '试剂管理', '设备操作', '危化品管理', '生物安全', '辐射防护', '消防知识', '急救技能']
    const creators = ['张三', '李四', '王五', '赵六']
    const questions = [
      '实验室安全的基本原则是什么？',
      '以下哪种试剂需要特殊储存条件？',
      '遇到危化品泄漏应如何处理？',
      '生物安全柜的使用注意事项有哪些？',
      '辐射防护的基本原则是什么？',
      '消防通道堵塞会有什么危害？',
      '心肺复苏的正确步骤是什么？',
      '实验室废液应如何分类处理？',
      '个人防护设备包括哪些？',
      '实验室紧急疏散的注意事项？',
    ]
    return {
      key: String(i + 1),
      id: i + 1,
      question: questions[i % questions.length],
      type: types[i % types.length],
      level: levels[i % levels.length],
      knowledge: knowledges[i % knowledges.length],
      score: 5 + Math.floor(Math.random() * 15),
      creator: creators[i % creators.length],
      createTime: `2024-0${(i % 6) + 1}-${String((i % 20) + 1).padStart(2, '0')}`,
      usageCount: Math.floor(Math.random() * 100),
      accuracy: 60 + Math.floor(Math.random() * 40),
      status: i % 3 !== 0,
      answer: '正确答案是选项A',
      analysis: '本题考察学员对安全知识的掌握程度',
      tags: knowledges[i % knowledges.length],
    }
  })

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>题库管理</h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal">
          {expanded ? (
            <>
              <Row gutter={20} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="试题内容" name="question">
                    <Input placeholder="请输入试题内容" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="题型" name="type">
                    <Select placeholder="请选择" options={[
                      { value: 'single', label: '单选题' },
                      { value: 'multiple', label: '多选题' },
                      { value: 'judge', label: '判断题' },
                      { value: 'fill', label: '填空题' },
                      { value: 'essay', label: '问答题' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="知识点" name="knowledge">
                    <Select placeholder="请选择" options={[
                      { value: 'security', label: '安全规范' },
                      { value: 'reagent', label: '试剂管理' },
                      { value: 'equipment', label: '设备操作' },
                      { value: 'hazardous', label: '危化品管理' },
                      { value: 'bio', label: '生物安全' },
                      { value: 'radiation', label: '辐射防护' },
                      { value: 'fire', label: '消防知识' },
                      { value: 'firstAid', label: '急救技能' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="难度等级" name="level">
                    <Select placeholder="请选择" options={[
                      { value: 'easy', label: '简单' },
                      { value: 'medium', label: '中等' },
                      { value: 'hard', label: '困难' },
                    ]} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="创建人" name="creator">
                    <Input placeholder="请输入创建人" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="创建时间" name="createTime">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="状态" name="status">
                    <Select placeholder="请选择" options={[
                      { value: 'enabled', label: '启用' },
                      { value: 'disabled', label: '禁用' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={18} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary">查询</Button>
                  <Button className="reset-btn">重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={20} style={{ height: 32 }}>
              <Col span={6}>
                <Form.Item label="试题内容" name="question">
                  <Input placeholder="请输入试题内容" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="题型" name="type">
                  <Select placeholder="请选择" options={[
                    { value: 'single', label: '单选题' },
                    { value: 'multiple', label: '多选题' },
                    { value: 'judge', label: '判断题' },
                    { value: 'fill', label: '填空题' },
                    { value: 'essay', label: '问答题' },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="知识点" name="knowledge">
                  <Select placeholder="请选择" options={[
                    { value: 'security', label: '安全规范' },
                    { value: 'reagent', label: '试剂管理' },
                    { value: 'equipment', label: '设备操作' },
                    { value: 'hazardous', label: '危化品管理' },
                    { value: 'bio', label: '生物安全' },
                    { value: 'radiation', label: '辐射防护' },
                    { value: 'fire', label: '消防知识' },
                    { value: 'firstAid', label: '急救技能' },
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

      <Card style={{ borderRadius: 10, marginTop: 20 }}>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建试题
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

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={700}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="题型" name="type" rules={[{ required: true, message: '请选择题型' }]}>
            <Select placeholder="请选择题型">
              <Select.Option value="单选题">单选题</Select.Option>
              <Select.Option value="多选题">多选题</Select.Option>
              <Select.Option value="判断题">判断题</Select.Option>
              <Select.Option value="填空题">填空题</Select.Option>
              <Select.Option value="问答题">问答题</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="知识点" name="knowledge" rules={[{ required: true, message: '请选择知识点' }]}>
            <Select placeholder="请选择知识点">
              <Select.Option value="安全规范">安全规范</Select.Option>
              <Select.Option value="试剂管理">试剂管理</Select.Option>
              <Select.Option value="设备操作">设备操作</Select.Option>
              <Select.Option value="危化品管理">危化品管理</Select.Option>
              <Select.Option value="生物安全">生物安全</Select.Option>
              <Select.Option value="辐射防护">辐射防护</Select.Option>
              <Select.Option value="消防知识">消防知识</Select.Option>
              <Select.Option value="急救技能">急救技能</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="难度等级" name="level" rules={[{ required: true, message: '请选择难度等级' }]}>
            <Select placeholder="请选择难度等级">
              <Select.Option value="简单">简单</Select.Option>
              <Select.Option value="中等">中等</Select.Option>
              <Select.Option value="困难">困难</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item label="默认分值" name="score" rules={[{ required: true, message: '请输入默认分值' }]}>
            <Input type="number" placeholder="请输入默认分值" />
          </Form.Item>
          <Form.Item label="试题内容" name="question" rules={[{ required: true, message: '请输入试题内容' }]}>
            <Input.TextArea rows={4} placeholder="请输入试题内容" />
          </Form.Item>
          <Form.Item label="正确答案" name="answer" rules={[{ required: true, message: '请输入正确答案' }]}>
            <Input.TextArea rows={2} placeholder="请输入正确答案" />
          </Form.Item>
          <Form.Item label="试题解析" name="analysis">
            <Input.TextArea rows={3} placeholder="请输入试题解析（选填）" />
          </Form.Item>
          <Form.Item label="标签" name="tags">
            <Input placeholder="请输入标签，多个标签用逗号分隔" />
          </Form.Item>
          <Form.Item label="状态" name="status" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="启用" unCheckedChildren="禁用" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="试题预览"
        open={isPreviewVisible}
        onCancel={() => setIsPreviewVisible(false)}
        footer={null}
        width={600}
      >
        {previewData && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <h3>试题信息</h3>
              <p><strong>题型：</strong><Tag color="blue">{previewData.type}</Tag></p>
              <p><strong>知识点：</strong>{previewData.knowledge}</p>
              <p><strong>难度：</strong><Tag color={previewData.level === '简单' ? 'green' : previewData.level === '中等' ? 'orange' : 'red'}>{previewData.level}</Tag></p>
              <p><strong>分值：</strong>{previewData.score}分</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <h3>试题内容</h3>
              <p style={{ padding: 12, background: '#f5f5f5', borderRadius: 4 }}>{previewData.question}</p>
            </div>
            <div style={{ marginBottom: 16 }}>
              <h3>正确答案</h3>
              <p style={{ color: '#52c41a', fontWeight: 'bold' }}>{previewData.answer}</p>
            </div>
            {previewData.analysis && (
              <div style={{ marginBottom: 16 }}>
                <h3>试题解析</h3>
                <p style={{ color: '#666' }}>{previewData.analysis}</p>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  )
}
