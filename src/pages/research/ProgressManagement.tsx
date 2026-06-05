import { Card, Form, Input, Button, Table, Space, Tag, message, DatePicker, Select, Progress, Slider, Drawer, Timeline, Divider, Col } from 'antd'
import { EditOutlined, EyeOutlined, PlusOutlined, SaveOutlined, XOutlined } from '@ant-design/icons'
import { useState } from 'react'
import SearchForm from '../../components/SearchForm/SearchForm'
import PageTitle from '../../components/PageTitle/PageTitle'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

export default function ProgressManagement() {
  const [searchForm] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [showUpdateDrawer, setShowUpdateDrawer] = useState(false)
  const [showDetailDrawer, setShowDetailDrawer] = useState(false)
  const [selectedProject, setSelectedProject] = useState<{ id: string; name: string; leader: string; period: string; progress: number; status: string } | null>(null)
  const [progressForm] = Form.useForm()

  const columns = [
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 200, onClick: (_: unknown, record: { id: string; name: string; leader: string; period: string; progress: number; status: string }) => handleViewDetail(record) },
    { title: '项目编号', dataIndex: 'id', key: 'id', width: 150 },
    { title: '项目负责人', dataIndex: 'leader', key: 'leader', width: 120 },
    { title: '计划起止时间', dataIndex: 'period', key: 'period', width: 220 },
    { 
      title: '整体完成度', 
      dataIndex: 'progress', 
      key: 'progress',
      width: 200,
      render: (percent: number) => (
        <div>
          <Progress percent={percent} size="small" />
          <span style={{ marginLeft: 8 }}>{percent}%</span>
        </div>
      )
    },
    { 
      title: '项目状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '未开始': 'default',
          '进行中': 'blue',
          '延期': 'red',
          '已完成': 'green',
          '已暂停': 'orange',
        }
        return <Tag color={colorMap[status]}>{status}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right' as const,
      render: (_: unknown, record: { id: string; name: string; leader: string; period: string; progress: number; status: string }) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleUpdateProgress(record)}>更新进度</Button>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
        </Space>
      ),
    },
  ]

  const data = Array.from({ length: 100 }, (_, i) => {
    const statuses = ['进行中', '已完成', '已暂停']
    const leaders = ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生', '周医生', '吴医生']
    const projects = ['肺癌早期诊断研究', '肿瘤免疫治疗临床研究', '基因检测技术研究', '肝癌早筛研究', '免疫治疗新方案', '精准医学应用', '大数据分析平台', '新药临床试验']
    return {
      key: String(i + 1),
      id: `PRJ2026${String(i + 1).padStart(4, '0')}`,
      name: projects[i % projects.length],
      leader: leaders[i % leaders.length],
      period: `2026-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ~ 2026-1${String((i % 4) + 2)}-${String(10 + (i % 15)).padStart(2, '0')}`,
      progress: 10 + (i * 7) % 90,
      status: statuses[i % statuses.length],
    }
  })

  const progressHistory = [
    { time: '2026-05-15 10:30', user: '张医生', progress: 65, status: '进行中', description: '完成了第三批临床数据收集', problem: '部分患者随访困难', plan: '下周继续数据整理' },
    { time: '2026-04-20 14:15', user: '张医生', progress: 45, status: '进行中', description: '完成了第二批临床数据收集', problem: '暂无', plan: '继续收集第三批数据' },
    { time: '2026-03-15 09:00', user: '张医生', progress: 25, status: '进行中', description: '完成了第一批临床数据收集', problem: '数据录入工作量大', plan: '增加录入人员' },
  ]

  const nodeProgress = [
    { key: '1', name: '项目启动', planDate: '2026-01-15', actualDate: '2026-01-15', status: '已完成', description: '项目正式启动' },
    { key: '2', name: '伦理审批', planDate: '2026-02-28', actualDate: '2026-03-10', status: '已完成', description: '伦理审查通过' },
    { key: '3', name: '临床数据收集', planDate: '2026-06-30', actualDate: '', status: '进行中', description: '正在进行中' },
    { key: '4', name: '数据分析', planDate: '2026-09-30', actualDate: '', status: '未开始', description: '' },
    { key: '5', name: '报告撰写', planDate: '2026-12-15', actualDate: '', status: '未开始', description: '' },
  ]

  const handleUpdateProgress = (record: any) => {
    setSelectedProject(record)
    progressForm.setFieldsValue({
      progress: record.progress,
      status: record.status,
    })
    setShowUpdateDrawer(true)
  }

  const handleViewDetail = (record: any) => {
    setSelectedProject(record)
    setShowDetailDrawer(true)
  }

  const handleSaveProgress = () => {
    message.success('进度更新成功')
    setShowUpdateDrawer(false)
    progressForm.resetFields()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <PageTitle>进度管理</PageTitle>

      <SearchForm 
        onSearch={() => {}}
        onReset={() => searchForm.resetFields()}
        expandedFields={
          <Col span={6}>
            <Form.Item label="完成度范围" name="progressRange">
              <Select placeholder="请选择范围">
                <Option value="all">全部</Option>
                <Option value="0-20">0-20%</Option>
                <Option value="21-40">21-40%</Option>
                <Option value="41-60">41-60%</Option>
                <Option value="61-80">61-80%</Option>
                <Option value="81-100">81-100%</Option>
              </Select>
            </Form.Item>
          </Col>
        }
      >
        <Col span={6}>
          <Form.Item label="项目名称" name="name"><Input placeholder="请输入项目名称" /></Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="项目状态" name="status">
            <Select placeholder="请选择状态">
              <Option value="all">全部</Option>
              <Option value="not-started">未开始</Option>
              <Option value="in-progress">进行中</Option>
              <Option value="delayed">延期</Option>
              <Option value="completed">已完成</Option>
              <Option value="paused">已暂停</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="项目负责人" name="leader">
            <Select placeholder="请选择负责人">
              <Option value="all">全部</Option>
              <Option value="张医生">张医生</Option>
              <Option value="李医生">李医生</Option>
              <Option value="王医生">王医生</Option>
            </Select>
          </Form.Item>
        </Col>
      </SearchForm>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Table 
          columns={columns} 
          dataSource={data} 
          scroll={{ x: 'max-content' }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
        />
      </Card>

      <Drawer
        title={`更新进度 - ${selectedProject?.name}`}
        placement="right"
        open={showUpdateDrawer}
        onClose={() => setShowUpdateDrawer(false)}
        width={600}
      >
        <div style={{ padding: 0 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 10, fontSize: 16, fontWeight: 500 }}>项目信息</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div><strong>项目名称：</strong>{selectedProject?.name}</div>
              <div><strong>项目编号：</strong>{selectedProject?.id}</div>
              <div><strong>负责人：</strong>{selectedProject?.leader}</div>
              <div><strong>当前进度：</strong>{selectedProject?.progress}%</div>
            </div>
          </div>

          <Divider />

          <Form form={progressForm} layout="vertical">
            <Form.Item label="整体完成度" name="progress" rules={[{ required: true }]}>
              <div>
                <Slider min={0} max={100} />
                <div style={{ textAlign: 'right', marginTop: 8 }}>
                  <Input type="number" min={0} max={100} style={{ width: 80 }} />%
                </div>
              </div>
            </Form.Item>

            <Form.Item label="项目状态" name="status" rules={[{ required: true }]}>
              <Select placeholder="请选择项目状态">
                <Option value="未开始">未开始</Option>
                <Option value="进行中">进行中</Option>
                <Option value="延期">延期</Option>
                <Option value="已完成">已完成</Option>
                <Option value="已暂停">已暂停</Option>
              </Select>
            </Form.Item>

            <Form.Item label="进度描述" name="description" rules={[{ required: true }]}>
              <TextArea rows={3} placeholder="本期完成工作" />
            </Form.Item>

            <Form.Item label="存在问题" name="problem">
              <TextArea rows={3} placeholder="当前存在的问题" />
            </Form.Item>

            <Form.Item label="下一步计划" name="plan">
              <TextArea rows={3} placeholder="下一步工作计划" />
            </Form.Item>

            <Divider />

            <h4 style={{ marginBottom: 12 }}>项目节点进度</h4>
            <Table 
              dataSource={nodeProgress.slice(0, 3)}
              columns={[
                { title: '节点名称', dataIndex: 'name', key: 'name' },
                { title: '计划完成日期', dataIndex: 'planDate', key: 'planDate' },
                { title: '实际完成日期', dataIndex: 'actualDate', key: 'actualDate' },
                { 
                  title: '完成状态', 
                  dataIndex: 'status', 
                  key: 'status',
                  render: (status: string) => <Tag color={status === '已完成' ? 'green' : status === '进行中' ? 'blue' : status === '延期' ? 'red' : 'default'}>{status}</Tag>
                },
                { title: '完成说明', dataIndex: 'description', key: 'description' },
              ]}
              pagination={false}
              size="small"
            />
            <Button type="dashed" icon={<PlusOutlined />} style={{ margin: '12px 0' }}>添加节点</Button>

            <Form.Item>
              <Button type="primary" onClick={handleSaveProgress} icon={<SaveOutlined />}>保存</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => setShowUpdateDrawer(false)} icon={<XOutlined />}>取消</Button>
            </Form.Item>
          </Form>
        </div>
      </Drawer>

      <Drawer
        title={`进度详情 - ${selectedProject?.name}`}
        placement="right"
        open={showDetailDrawer}
        onClose={() => setShowDetailDrawer(false)}
        width={700}
      >
        <div style={{ padding: 20 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 10 }}>进度更新历史</h3>
            <Timeline>
              {progressHistory.map((item, index) => (
                <Timeline.Item key={index}>
                  <div>
                    <strong>{item.time}</strong>
                    <br />
                    <span>更新人：{item.user}</span>
                    <br />
                    <span>完成度：{item.progress}% | 状态：{item.status}</span>
                    <br />
                    <p style={{ marginTop: 8 }}><strong>进度描述：</strong>{item.description}</p>
                    <p><strong>存在问题：</strong>{item.problem}</p>
                    <p><strong>下一步计划：</strong>{item.plan}</p>
                  </div>
                </Timeline.Item>
              ))}
            </Timeline>
          </div>

          <Divider />

          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 10 }}>节点完成情况</h3>
            <Table 
              dataSource={nodeProgress}
              columns={[
                { title: '节点名称', dataIndex: 'name', key: 'name' },
                { title: '计划日期', dataIndex: 'planDate', key: 'planDate' },
                { title: '实际日期', dataIndex: 'actualDate', key: 'actualDate' },
                { 
                  title: '完成状态', 
                  dataIndex: 'status', 
                  key: 'status',
                  render: (status: string) => <Tag color={status === '已完成' ? 'green' : status === '进行中' ? 'blue' : status === '延期' ? 'red' : 'default'}>{status}</Tag>
                },
                { title: '说明', dataIndex: 'description', key: 'description' },
              ]}
              pagination={false}
              size="small"
            />
          </div>
        </div>
      </Drawer>
    </div>
  )
}