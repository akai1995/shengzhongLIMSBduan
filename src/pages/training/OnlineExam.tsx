import { Card, Table, Button, Tag, Input, Select, Space, Modal, Form, Switch, message, Popconfirm, Steps, DatePicker, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SendOutlined, BarChartOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'
import type { StepsProps } from 'antd'

const { RangePicker } = DatePicker
const { Option } = Select

export default function OnlineExam() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false)
  const [isPublishModalVisible, setIsPublishModalVisible] = useState(false)
  const [isScoreModalVisible, setIsScoreModalVisible] = useState(false)
  const [createModalTitle, setCreateModalTitle] = useState('新建试卷')
  const [currentStep, setCurrentStep] = useState(0)
  const [createForm] = Form.useForm()
  const [publishForm] = Form.useForm()
  const [expanded, setExpanded] = useState(false)
  const [searchForm] = Form.useForm()

  const handleCreate = () => {
    setCreateModalTitle('新建试卷')
    createForm.resetFields()
    setCurrentStep(0)
    setIsCreateModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setCreateModalTitle('编辑试卷')
    createForm.setFieldsValue(record)
    setIsCreateModalVisible(true)
  }

  const handlePublish = (record: any) => {
    publishForm.setFieldsValue({
      examName: record.name,
      duration: parseInt(record.duration),
    })
    setIsPublishModalVisible(true)
  }

  const handleScoreManagement = (record: any) => {
    setIsScoreModalVisible(true)
  }

  const handleCreateModalOk = () => {
    if (currentStep === 0) {
      createForm.validateFields().then(() => {
        setCurrentStep(1)
      })
    } else if (currentStep === 1) {
      createForm.validateFields().then(() => {
        setCurrentStep(2)
      })
    }
  }

  const handlePublishModalOk = () => {
    publishForm.validateFields().then(values => {
      console.log('发布考试数据:', values)
      message.success('考试发布成功')
      setIsPublishModalVisible(false)
    })
  }

  const handleDelete = (record: any) => {
    message.success(`已删除试卷：${record.name}`)
  }

  const stepItems: StepsProps['items'] = [
    { title: '基本信息', description: '设置试卷基础信息' },
    { title: '组卷设置', description: '设置题型、知识点、难度' },
    { title: '完成', description: '确认并保存' },
  ]

  const columns = [
    { title: 'ID', dataIndex: 'id', key: 'id', width: 60 },
    { title: '试卷名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '总分', dataIndex: 'totalScore', key: 'totalScore', width: 80 },
    { title: '题目数量', dataIndex: 'questionCount', key: 'questionCount', width: 90 },
    { title: '考试时长', dataIndex: 'duration', key: 'duration', width: 100, render: (val: string) => val },
    { title: '通过分数', dataIndex: 'passScore', key: 'passScore', width: 90 },
    { title: '创建人', dataIndex: 'creator', key: 'creator', width: 100 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 120 },
    {
      title: '考试状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === '未发布' ? 'default' : status === '已发布' ? 'green' : 'blue'}>{status}</Tag>
      ),
    },
    { title: '参加人数', dataIndex: 'participantCount', key: 'participantCount', width: 90 },
    {
      title: '通过率',
      dataIndex: 'passRate',
      key: 'passRate',
      width: 90,
      render: (rate: number) => <span style={{ color: rate >= 70 ? '#52c41a' : rate >= 60 ? '#faad14' : '#ff4d4f' }}>{rate}%</span>
    },
    {
      title: '操作',
      key: 'action',
      width: 300,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="link" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>
            编辑
          </Button>
          <Button type="link" size="small" icon={<SendOutlined />} onClick={() => handlePublish(record)}>
            发布
          </Button>
          <Button type="link" size="small" icon={<BarChartOutlined />} onClick={() => handleScoreManagement(record)}>
            成绩管理
          </Button>
          <Popconfirm title="确定删除该试卷吗？" onConfirm={() => handleDelete(record)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />}>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const scoreColumns = [
    { title: '学员姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '所属部门', dataIndex: 'department', key: 'department', width: 120 },
    { title: '得分', dataIndex: 'score', key: 'score', width: 80 },
    { title: '正确率', dataIndex: 'accuracy', key: 'accuracy', width: 90, render: (val: number) => `${val}%` },
    { title: '用时', dataIndex: 'duration', key: 'duration', width: 100 },
    { title: '交卷时间', dataIndex: 'submitTime', key: 'submitTime', width: 160 },
    {
      title: '是否通过',
      dataIndex: 'passed',
      key: 'passed',
      width: 100,
      render: (passed: boolean) => <Tag color={passed ? 'green' : 'red'}>{passed ? '通过' : '未通过'}</Tag>
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={status === '已完成' ? 'green' : status === '进行中' ? 'blue' : 'default'}>{status}</Tag>
      )
    },
  ]

  const data = Array.from({ length: 20 }, (_, i) => {
    const statuses = ['未发布', '已发布', '进行中']
    const names = [
      '实验室安全知识考试', '仪器操作考核', '试剂管理考核', '危险化学品考试',
      '生物安全考核', '辐射防护考试', '消防考核', '急救知识考试'
    ]
    const creators = ['张三', '李四', '王五', '赵六']
    const passRate = 60 + Math.floor(Math.random() * 40)
    return {
      key: String(i + 1),
      id: i + 1,
      name: names[i % names.length],
      totalScore: 100,
      questionCount: 20 + Math.floor(Math.random() * 30),
      duration: `${30 + Math.floor(Math.random() * 90)}分钟`,
      passScore: 60,
      creator: creators[i % creators.length],
      createTime: `2024-0${(i % 6) + 1}-${String((i % 20) + 1).padStart(2, '0')}`,
      status: statuses[i % statuses.length],
      participantCount: Math.floor(Math.random() * 100),
      passRate: passRate,
    }
  })

  const scoreData = Array.from({ length: 15 }, (_, i) => {
    const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
    const departments = ['研发部', '测试部', '生产部', '质量部']
    const score = 40 + Math.floor(Math.random() * 60)
    const passed = score >= 60
    return {
      key: String(i + 1),
      name: names[i % names.length],
      department: departments[i % departments.length],
      score: score,
      accuracy: Math.floor(Math.random() * 40 + 60),
      duration: `${Math.floor(Math.random() * 60) + 10}分钟`,
      submitTime: `2024-05-${String((i % 20) + 1).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
      passed: passed,
      status: i % 5 === 0 ? '进行中' : '已完成',
    }
  })

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>在线考试</h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal">
          {expanded ? (
            <>
              <Row gutter={20} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="试卷名称" name="name">
                    <Input placeholder="请输入试卷名称" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="考试状态" name="status">
                    <Select placeholder="请选择" options={[
                      { value: 'unpublished', label: '未发布' },
                      { value: 'published', label: '已发布' },
                      { value: 'ongoing', label: '进行中' },
                    ]} />
                  </Form.Item>
                </Col>
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
                  <Form.Item label="题目数量" name="questionCount">
                    <Select placeholder="请选择" options={[
                      { value: '10', label: '10题以内' },
                      { value: '20', label: '10-20题' },
                      { value: '50', label: '20-50题' },
                      { value: '100', label: '50题以上' },
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
                <Form.Item label="试卷名称" name="name">
                  <Input placeholder="请输入试卷名称" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="考试状态" name="status">
                  <Select placeholder="请选择" options={[
                    { value: 'unpublished', label: '未发布' },
                    { value: 'published', label: '已发布' },
                    { value: 'ongoing', label: '进行中' },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="创建人" name="creator">
                  <Input placeholder="请输入创建人" />
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
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建试卷
            </Button>
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
        title={createModalTitle}
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        width={800}
        footer={currentStep === 2 ? (
          <div style={{ display: 'flex', gap: 12 }}>
            <Button onClick={() => { message.success('已保存草稿'); setIsCreateModalVisible(false); }}>保存草稿</Button>
            <Button type="primary" onClick={() => { message.success('试卷发布成功'); setIsCreateModalVisible(false); }}>发布考试</Button>
            <Button onClick={() => setIsCreateModalVisible(false)}>取消</Button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 12 }}>
            <Button onClick={() => { message.success('已保存草稿'); setIsCreateModalVisible(false); }}>保存草稿</Button>
            <Button type="primary" onClick={handleCreateModalOk}>
              {currentStep === 0 ? '下一步' : '完成'}
            </Button>
            <Button onClick={() => setIsCreateModalVisible(false)}>取消</Button>
          </div>
        )}
      >
        <Steps current={currentStep} items={stepItems} style={{ marginBottom: 24 }} />
        
        <Form form={createForm} layout="vertical">
          {currentStep === 0 && (
            <>
              <Form.Item label="试卷名称" name="name" rules={[{ required: true, message: '请输入试卷名称' }]}>
                <Input placeholder="请输入试卷名称" />
              </Form.Item>
              <Form.Item label="考试时长（分钟）" name="duration" rules={[{ required: true, message: '请输入考试时长' }]}>
                <Input type="number" placeholder="请输入考试时长" />
              </Form.Item>
              <Form.Item label="总分" name="totalScore" rules={[{ required: true, message: '请输入总分' }]}>
                <Input type="number" placeholder="请输入总分" />
              </Form.Item>
              <Form.Item label="通过分数" name="passScore" rules={[{ required: true, message: '请输入通过分数' }]}>
                <Input type="number" placeholder="请输入通过分数" />
              </Form.Item>
              <Form.Item label="考试说明" name="description">
                <Input.TextArea rows={3} placeholder="请输入考试说明（选填）" />
              </Form.Item>
              <Form.Item label="是否显示答案" name="showAnswer" valuePropName="checked" initialValue={true}>
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
              <Form.Item label="是否随机出题" name="randomQuestion" valuePropName="checked" initialValue={false}>
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
              <Form.Item label="是否防切屏" name="preventSwitch" valuePropName="checked" initialValue={false}>
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </>
          )}
          {currentStep === 1 && (
            <div>
              <h3>组卷设置</h3>
              <p style={{ color: '#666', marginBottom: 16 }}>请设置试卷的题目组成</p>
              
              <div style={{ marginBottom: 24 }}>
                <h4>题型设置</h4>
                <p style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>设置各题型数量（如单选10题、多选5题）</p>
                <Row gutter={16}>
                  <Col span={6}>
                    <Form.Item label="单选题数量" name="singleCount" rules={[{ required: true, message: '请输入单选题数量' }]}>
                      <Input type="number" placeholder="单选题数量" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="多选题数量" name="multiCount" rules={[{ required: true, message: '请输入多选题数量' }]}>
                      <Input type="number" placeholder="多选题数量" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="判断题数量" name="judgeCount" rules={[{ required: true, message: '请输入判断题数量' }]}>
                      <Input type="number" placeholder="判断题数量" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item label="填空题数量" name="fillCount">
                      <Input type="number" placeholder="填空题数量（选填）" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 16 }}>
                  <Col span={6}>
                    <Form.Item label="问答题数量" name="essayCount">
                      <Input type="number" placeholder="问答题数量（选填）" />
                    </Form.Item>
                  </Col>
                </Row>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4>知识点设置</h4>
                <p style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>设置各知识点抽题数量</p>
                <Form.Item label="知识点" name="knowledgePoints">
                  <Select mode="multiple" placeholder="请选择知识点并设置数量">
                    <Option value="security">安全规范</Option>
                    <Option value="reagent">试剂管理</Option>
                    <Option value="equipment">设备操作</Option>
                    <Option value="hazardous">危化品管理</Option>
                    <Option value="bio">生物安全</Option>
                    <Option value="radiation">辐射防护</Option>
                    <Option value="fire">消防知识</Option>
                    <Option value="firstAid">急救技能</Option>
                  </Select>
                </Form.Item>
              </div>

              <div style={{ marginBottom: 24 }}>
                <h4>难度设置</h4>
                <p style={{ color: '#888', fontSize: 12, marginBottom: 12 }}>设置简单/中等/困难题目比例</p>
                <Row gutter={16}>
                  <Col span={8}>
                    <Form.Item label="简单题比例" name="easyRatio">
                      <Input type="number" placeholder="0-100" />
                      <span style={{ marginLeft: 8 }}>%</span>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="中等题比例" name="mediumRatio">
                      <Input type="number" placeholder="0-100" />
                      <span style={{ marginLeft: 8 }}>%</span>
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item label="困难题比例" name="hardRatio">
                      <Input type="number" placeholder="0-100" />
                      <span style={{ marginLeft: 8 }}>%</span>
                    </Form.Item>
                  </Col>
                </Row>
              </div>
            </div>
          )}
          {currentStep === 2 && (
            <div style={{ textAlign: 'center', padding: 40 }}>
              <h2>试卷创建完成</h2>
              <p style={{ color: '#666', marginTop: 16 }}>试卷已保存，您可以在列表中编辑或发布考试</p>
            </div>
          )}
        </Form>
      </Modal>

      <Modal
        title="发布考试"
        open={isPublishModalVisible}
        onOk={handlePublishModalOk}
        onCancel={() => setIsPublishModalVisible(false)}
        width={600}
        okText="发布"
        cancelText="取消"
      >
        <Form form={publishForm} layout="vertical">
          <Form.Item label="考试名称" name="examName" rules={[{ required: true, message: '请输入考试名称' }]}>
            <Input placeholder="请输入考试名称" />
          </Form.Item>
          <Form.Item label="考试时间" name="examTime" rules={[{ required: true, message: '请选择考试时间' }]}>
            <RangePicker showTime style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="考试时长（分钟）" name="duration" rules={[{ required: true, message: '请输入考试时长' }]}>
            <Input type="number" placeholder="请输入考试时长" />
          </Form.Item>
          <Form.Item label="参考人员" name="participants" rules={[{ required: true, message: '请选择参考人员' }]}>
            <Select mode="multiple" placeholder="请选择参考人员（支持按角色、标签筛选）">
              <Option value="rd">研发部全员</Option>
              <Option value="qa">测试部全员</Option>
              <Option value="prod">生产部全员</Option>
              <Option value="qc">质量部全员</Option>
            </Select>
          </Form.Item>
          <Form.Item label="是否限时" name="timeLimit" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="限时" unCheckedChildren="不限时" />
          </Form.Item>
          <Form.Item label="考试通知" name="notification">
            <Select placeholder="请选择通知方式">
              <Option value="email">发送邮件通知</Option>
              <Option value="sms">发送短信通知</Option>
              <Option value="none">均不发送</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="成绩管理"
        open={isScoreModalVisible}
        onCancel={() => setIsScoreModalVisible(false)}
        footer={null}
        width={1200}
      >
        <div style={{ marginBottom: 16 }}>
          <h3>考试信息</h3>
          <p><strong>考试名称：</strong>实验室安全知识考试</p>
          <p><strong>考试时间：</strong>2024-05-15 09:00 - 2024-05-15 11:00</p>
        </div>
        <Table
          columns={scoreColumns}
          dataSource={scoreData}
          pagination={{ pageSize: 10 }}
        />
      </Modal>
    </div>
  )
}
