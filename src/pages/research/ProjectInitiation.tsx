import { Card, Form, Input, Button, Upload, Table, Space, Tag, message, DatePicker, Select, Modal, Timeline, Divider, Col } from 'antd'
import { UploadOutlined, PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, CheckOutlined, XOutlined, FileTextOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import SearchForm from '../../components/SearchForm/SearchForm'
import PageTitle from '../../components/PageTitle/PageTitle'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

export default function ProjectInitiation() {
  const [form] = Form.useForm()
  const [editForm] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [selectedProject, setSelectedProject] = useState<{ key: string; name: string; id: string; type: string; leader: string; department: string; date: string; status: string } | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<{ key: string; name: string } | null>(null)
  const [submitRecord, setSubmitRecord] = useState<{ key: string; name: string } | null>(null)
  const [auditResult, setAuditResult] = useState<string>('')
  const [tableData, setTableData] = useState([
    {
      key: '1',
      id: 'PRJ2026001',
      name: '肺癌早期诊断研究',
      type: '纵向项目',
      leader: '张医生',
      department: '肿瘤内科',
      date: '2026-05-10',
      status: '待提交',
    },
    {
      key: '2',
      id: 'PRJ2026002',
      name: '肿瘤免疫治疗临床研究',
      type: '横向项目',
      leader: '李医生',
      department: '放疗科',
      date: '2026-05-08',
      status: '审核中',
    },
    {
      key: '3',
      id: 'PRJ2026003',
      name: '基因检测技术研究',
      type: '校内项目',
      leader: '王医生',
      department: '病理科',
      date: '2026-05-05',
      status: '已通过',
    },
  ])

  useEffect(() => {
    if (tableData.length === 3) {
      const newData = Array.from({ length: 97 }, (_, i) => {
        const statuses = ['待提交', '审核中', '已通过', '已驳回']
        const types = ['纵向项目', '横向项目', '校内项目']
        const departments = ['肿瘤内科', '放疗科', '病理科', '检验科', '影像科', '外科', 'ICU', '药剂科']
        const leaders = ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生', '周医生', '吴医生']
        const projects = ['肝癌早筛研究', '免疫治疗新方案', '精准医学应用', '大数据分析平台', '新药临床试验', '手术机器人研发', '人工智能诊断', '远程医疗系统']
        return {
          key: String(i + 4),
          id: `PRJ2026${String(i + 4).padStart(4, '0')}`,
          name: projects[i % projects.length] + (i > 7 ? `${Math.floor(i / 8)}期` : ''),
          type: types[i % types.length],
          leader: leaders[i % leaders.length],
          department: departments[i % departments.length],
          date: `2026-05-${String(1 + (i % 28)).padStart(2, '0')}`,
          status: statuses[i % statuses.length],
        }
      })
      setTableData([...tableData, ...newData])
    }
  }, [])

  const columns = [
    { title: '序号', dataIndex: 'index', key: 'index', width: 80, render: (_: unknown, __: unknown, index: number) => index + 1 },
    { title: '项目名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '项目编号', dataIndex: 'id', key: 'id', width: 150 },
    { 
      title: '项目类型', 
      dataIndex: 'type', 
      key: 'type',
      width: 120,
      render: (type: string) => <Tag color="blue">{type}</Tag>
    },
    { title: '负责人', dataIndex: 'leader', key: 'leader', width: 120 },
    { title: '所属单位', dataIndex: 'department', key: 'department', width: 150 },
    { title: '申请日期', dataIndex: 'date', key: 'date', width: 140 },
    { 
      title: '项目状态', 
      dataIndex: 'status', 
      key: 'status',
      width: 120,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '待提交': 'default',
          '审核中': 'blue',
          '已通过': 'green',
          '已驳回': 'red',
        }
        return <Tag color={colorMap[status]}>{status}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 260,
      fixed: 'right' as const,
      render: (_: unknown, record: { key: string; status: string }) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
          {record.status === '待提交' && (
            <Button type="text" icon={<CheckOutlined />} onClick={() => handleSubmitAudit(record)}>提交审核</Button>
          )}
        </Space>
      ),
    },
  ]

  const auditHistory = [
    { time: '2026-05-12 14:30', user: '刘主任', opinion: '资料齐全，建议通过', result: '通过' },
    { time: '2026-05-11 10:15', user: '陈科长', opinion: '预算需要进一步核实', result: '驳回' },
    { time: '2026-05-10 16:45', user: '张医生', opinion: '提交项目申请', result: '提交' },
  ]

  const handleViewDetail = (record: any) => {
    setSelectedProject(record)
    setShowDetailModal(true)
  }

  const handleEdit = (record: any) => {
    setSelectedProject(record)
    editForm.setFieldsValue({
      name: record.name,
      id: record.id,
      type: record.type,
      leader: record.leader,
      department: record.department,
    })
    setShowEditModal(true)
  }

  const handleSubmit = (values: any) => {
    const newProject = {
      key: String(Date.now()),
      id: `PRJ2026${String(tableData.length + 1).padStart(4, '0')}`,
      name: values.name || '新项目',
      type: values.type || '纵向项目',
      leader: values.leader || '未知',
      department: values.department || '未知',
      date: new Date().toISOString().split('T')[0],
      status: '待提交',
    }
    setTableData(prevData => [newProject, ...prevData])
    message.success('项目申请已提交')
    form.resetFields()
    setShowCreateModal(false)
  }

  const handleEditSubmit = (values: any) => {
    if (selectedProject) {
      setTableData(prevData =>
        prevData.map(item =>
          item.key === selectedProject.key
            ? { ...item, ...values }
            : item
        )
      )
      message.success('项目信息已更新')
    }
    editForm.resetFields()
    setShowEditModal(false)
  }

  const handleAudit = (result: string) => {
    if (selectedProject) {
      setTableData(prevData =>
        prevData.map(item =>
          item.key === selectedProject.key
            ? { ...item, status: result === '通过' ? '已通过' : '已驳回' }
            : item
        )
      )
      message.success(`审核${result === '通过' ? '已通过' : '已驳回'}`)
    }
    setShowAuditModal(false)
    setShowDetailModal(false)
  }

  const handleDelete = (record: any) => {
    setDeleteRecord({ key: record.key, name: record.name })
    setShowDeleteModal(true)
  }

  const confirmDelete = () => {
    if (deleteRecord) {
      setTableData(prevData => prevData.filter(item => item.key !== deleteRecord.key))
      message.success('删除成功')
    }
    setShowDeleteModal(false)
    setDeleteRecord(null)
  }

  const cancelDelete = () => {
    setShowDeleteModal(false)
    setDeleteRecord(null)
  }

  const handleSubmitAudit = (record: any) => {
    setSubmitRecord({ key: record.key, name: record.name })
    setShowSubmitModal(true)
  }

  const confirmSubmit = () => {
    if (submitRecord) {
      setTableData(prevData => 
        prevData.map(item => 
          item.key === submitRecord.key 
            ? { ...item, status: '审核中' }
            : item
        )
      )
      message.success('已提交审核')
    }
    setShowSubmitModal(false)
    setSubmitRecord(null)
  }

  const cancelSubmit = () => {
    setShowSubmitModal(false)
    setSubmitRecord(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <PageTitle>项目立项</PageTitle>

      <SearchForm 
        onSearch={() => {}}
        onReset={() => searchForm.resetFields()}
        showExpandButton={false}
        expandedFields={
          <Col span={6}>
            <Form.Item label="申请时间" name="dateRange">
              <RangePicker style={{ width: '100%' }} />
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
              <Option value="pending">待提交</Option>
              <Option value="reviewing">审核中</Option>
              <Option value="approved">已通过</Option>
              <Option value="rejected">已驳回</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="项目类型" name="type">
            <Select placeholder="请选择类型">
              <Option value="all">全部</Option>
              <Option value="longitudinal">纵向项目</Option>
              <Option value="horizontal">横向项目</Option>
              <Option value="internal">校内项目</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
        </Col>
      </SearchForm>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Button type="primary" style={{ marginBottom: 16 }} onClick={() => setShowCreateModal(true)}>
          新建项目
        </Button>
        <Table 
          columns={columns} 
          dataSource={tableData} 
          scroll={{ x: 'max-content' }} 
          rowSelection={{
            type: 'checkbox',
          }}
        />
      </Card>

      <Modal
        title="项目详情"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={800}
      >
        {selectedProject && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 10 }}>基本信息</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><strong>项目名称：</strong>{selectedProject.name}</div>
                <div><strong>项目编号：</strong>{selectedProject.id}</div>
                <div><strong>项目类型：</strong>{selectedProject.type}</div>
                <div><strong>负责人：</strong>{selectedProject.leader}</div>
                <div><strong>所属单位：</strong>{selectedProject.department}</div>
                <div><strong>申请日期：</strong>{selectedProject.date}</div>
              </div>
            </div>

            <Divider />

            <div style={{ marginBottom: 20 }}>
              <h3 style={{ marginBottom: 10 }}>审核记录时间线</h3>
              <Timeline>
                {auditHistory.map((item, index) => (
                  <Timeline.Item key={index}>
                    <div>
                      <strong>{item.time}</strong>
                      <br />
                      <span>审核人：{item.user}</span>
                      <br />
                      <span>审核意见：{item.opinion}</span>
                      <br />
                      <Tag color={item.result === '通过' ? 'green' : item.result === '驳回' ? 'red' : 'blue'}>
                        {item.result}
                      </Tag>
                    </div>
                  </Timeline.Item>
                ))}
              </Timeline>
            </div>

            {selectedProject.status === '审核中' && (
              <>
                <Divider />
                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ marginBottom: 10 }}>审核操作</h3>
                  <Button type="primary" onClick={() => setShowAuditModal(true)} icon={<FileTextOutlined />}>
                    进行审核
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </Modal>

      <Modal
        title="审核操作"
        open={showAuditModal}
        onCancel={() => setShowAuditModal(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical">
          <Form.Item label="审核意见" required>
            <TextArea rows={4} placeholder="请输入审核意见" />
          </Form.Item>
          <Form.Item label="审核结果" required>
            <Select placeholder="请选择审核结果" onChange={(value) => setAuditResult(value)}>
              <Option value="通过">通过</Option>
              <Option value="驳回">驳回</Option>
            </Select>
          </Form.Item>
          <Form.Item label="驳回原因">
            <TextArea rows={3} placeholder="请输入驳回原因（选择驳回时必填）" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={() => handleAudit(auditResult)} icon={<CheckOutlined />}>提交审核意见</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setShowAuditModal(false)} icon={<XOutlined />}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑项目"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '1200px' }}
        bodyStyle={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Form form={editForm} layout="vertical" onFinish={handleEditSubmit} size="middle">
          <h3 style={{ marginBottom: 20 }}>基本信息</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 20 }}>
            <Form.Item label="项目名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入项目名称（限200字符）" />
            </Form.Item>
            <Form.Item label="项目编号" name="id" rules={[{ required: true }]}>
              <Input placeholder="项目编号（可自动生成）" />
            </Form.Item>
            <Form.Item label="项目类型" name="type" rules={[{ required: true }]}>
              <Select placeholder="请选择项目类型">
                <Option value="纵向项目">纵向项目</Option>
                <Option value="横向项目">横向项目</Option>
                <Option value="校内项目">校内项目</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
            <Form.Item label="项目类别" name="category">
              <Select placeholder="请选择项目类别">
                <Option value="国家级">国家级</Option>
                <Option value="省部级">省部级</Option>
                <Option value="市厅级">市厅级</Option>
                <Option value="校级">校级</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
            <Form.Item label="所属单位" name="department" rules={[{ required: true }]}>
              <Select placeholder="请选择所属单位">
                <Option value="肿瘤内科">肿瘤内科</Option>
                <Option value="放疗科">放疗科</Option>
                <Option value="病理科">病理科</Option>
              </Select>
            </Form.Item>
            <Form.Item label="项目负责人" name="leader" rules={[{ required: true }]}>
              <Select placeholder="请选择负责人">
                <Option value="张医生">张医生</Option>
                <Option value="李医生">李医生</Option>
                <Option value="王医生">王医生</Option>
              </Select>
            </Form.Item>
            <Form.Item label="联系电话" name="phone">
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item label="项目周期" name="period" rules={[{ required: true }]}>
              <RangePicker style={{ width: '100%' }} placeholder={['请选择开始日期', '请选择结束日期']} />
            </Form.Item>
            <Form.Item label="经费来源" name="fundSource" rules={[{ required: true }]}>
              <Input placeholder="请输入经费来源" />
            </Form.Item>
            <Form.Item label="项目预算金额" name="budget" rules={[{ required: true }]}>
              <Input placeholder="请输入项目预算金额" prefix="¥" />
            </Form.Item>
          </div>

          <Form.Item label="项目目标" name="goal" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入项目目标（限1000字符）" />
          </Form.Item>
          <Form.Item label="项目背景" name="background">
            <TextArea rows={3} placeholder="请输入项目背景" />
          </Form.Item>
          <Form.Item label="研究内容" name="content">
            <TextArea rows={4} placeholder="请输入研究内容" />
          </Form.Item>

          <Divider style={{ margin: '20px 0' }} />
          <h3 style={{ marginBottom: 20 }}>项目团队</h3>
          <Form.Item label="参与人员" name="members">
            <Select mode="multiple" placeholder="请选择参与人员">
              <Option value="张医生">张医生</Option>
              <Option value="李医生">李医生</Option>
              <Option value="王医生">王医生</Option>
              <Option value="赵医生">赵医生</Option>
            </Select>
          </Form.Item>
          <Form.Item label="参与单位" name="units">
            <Select mode="multiple" placeholder="请选择参与单位">
              <Option value="肿瘤医院">肿瘤医院</Option>
              <Option value="医学院">医学院</Option>
              <Option value="研究所">研究所</Option>
            </Select>
          </Form.Item>
          <Form.Item label="项目分工" name="division">
            <TextArea rows={3} placeholder="请输入项目分工" />
          </Form.Item>

          <Divider style={{ margin: '20px 0' }} />
          <h3 style={{ marginBottom: 20 }}>关键里程碑</h3>
          <Table 
            dataSource={[{ key: '1', milestone: '项目启动', date: '2026-06-01', leader: '张医生' }]}
            columns={[
              { title: '节点名称', dataIndex: 'milestone', key: 'milestone', render: () => <Input placeholder="请输入节点名称" /> },
              { title: '计划完成日期', dataIndex: 'date', key: 'date', render: () => <DatePicker placeholder="请选择完成日期" /> },
              { title: '负责人', dataIndex: 'leader', key: 'leader', render: () => <Select placeholder="请选择负责人"><Option value="张医生">张医生</Option></Select> },
              { title: '备注', dataIndex: 'remark', key: 'remark', render: () => <Input placeholder="请输入备注" /> },
              { title: '操作', key: 'action', render: () => <Button type="text" danger>删除</Button> },
            ]}
            pagination={false}
          />
          <Button type="dashed" icon={<PlusOutlined />} style={{ marginTop: 20, marginBottom: 20 }}>添加里程碑</Button>

          <Divider style={{ margin: '20px 0' }} />
          <h3 style={{ marginBottom: 20 }}>风险评估</h3>
          <Form.Item label="风险点" name="risks">
            <TextArea rows={3} placeholder="请输入风险点" />
          </Form.Item>
          <Form.Item label="应对措施" name="measures">
            <TextArea rows={3} placeholder="请输入应对措施" />
          </Form.Item>
          <Form.Item label="风险评估等级" name="riskLevel">
            <Select placeholder="请选择评估等级">
              <Option value="高">高</Option>
              <Option value="中">中</Option>
              <Option value="低">低</Option>
            </Select>
          </Form.Item>

          <Divider style={{ margin: '20px 0' }} />
          <h3 style={{ marginBottom: 20 }}>附件上传</h3>
          <Form.Item label="项目立项申请表">
            <Upload.Dragger>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="项目可行性报告">
            <Upload.Dragger>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="预算明细表">
            <Upload.Dragger>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="其他相关材料">
            <Upload.Dragger multiple>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传（支持多文件）</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
            <Button type="primary" htmlType="submit">保存修改</Button>
            <Button style={{ marginLeft: 10 }} onClick={() => setShowEditModal(false)}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="新建项目"
        open={showCreateModal}
        onCancel={() => setShowCreateModal(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '1200px' }}
        bodyStyle={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} size="middle">
          <h3 style={{ marginBottom: 20 }}>基本信息</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 20 }}>
            <Form.Item label="项目名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入项目名称（限200字符）" />
            </Form.Item>
            <Form.Item label="项目编号" name="id" rules={[{ required: true }]}>
              <Input placeholder="项目编号（可自动生成）" />
            </Form.Item>
            <Form.Item label="项目类型" name="type" rules={[{ required: true }]}>
              <Select placeholder="请选择项目类型">
                <Option value="纵向项目">纵向项目</Option>
                <Option value="横向项目">横向项目</Option>
                <Option value="校内项目">校内项目</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
            <Form.Item label="项目类别" name="category">
              <Select placeholder="请选择项目类别">
                <Option value="国家级">国家级</Option>
                <Option value="省部级">省部级</Option>
                <Option value="市厅级">市厅级</Option>
                <Option value="校级">校级</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
            <Form.Item label="所属单位" name="department" rules={[{ required: true }]}>
              <Select placeholder="请选择所属单位">
                <Option value="肿瘤内科">肿瘤内科</Option>
                <Option value="放疗科">放疗科</Option>
                <Option value="病理科">病理科</Option>
              </Select>
            </Form.Item>
            <Form.Item label="项目负责人" name="leader" rules={[{ required: true }]}>
              <Select placeholder="请选择负责人">
                <Option value="张医生">张医生</Option>
                <Option value="李医生">李医生</Option>
                <Option value="王医生">王医生</Option>
              </Select>
            </Form.Item>
            <Form.Item label="联系电话" name="phone">
              <Input placeholder="请输入联系电话" />
            </Form.Item>
            <Form.Item label="项目周期" name="period" rules={[{ required: true }]}>
              <RangePicker style={{ width: '100%' }} placeholder={['请选择开始日期', '请选择结束日期']} />
            </Form.Item>
            <Form.Item label="经费来源" name="fundSource" rules={[{ required: true }]}>
              <Input placeholder="请输入经费来源" />
            </Form.Item>
            <Form.Item label="项目预算金额" name="budget" rules={[{ required: true }]}>
              <Input placeholder="请输入项目预算金额" prefix="¥" />
            </Form.Item>
          </div>

          <Form.Item label="项目目标" name="goal" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入项目目标（限1000字符）" />
          </Form.Item>
          <Form.Item label="项目背景" name="background">
            <TextArea rows={3} placeholder="请输入项目背景" />
          </Form.Item>
          <Form.Item label="研究内容" name="content">
            <TextArea rows={4} placeholder="请输入研究内容" />
          </Form.Item>

          <Divider style={{ margin: '20px 0' }} />
          <h3 style={{ marginBottom: 20 }}>项目团队</h3>
          <Form.Item label="参与人员" name="members">
            <Select mode="multiple" placeholder="请选择参与人员">
              <Option value="张医生">张医生</Option>
              <Option value="李医生">李医生</Option>
              <Option value="王医生">王医生</Option>
              <Option value="赵医生">赵医生</Option>
            </Select>
          </Form.Item>
          <Form.Item label="参与单位" name="units">
            <Select mode="multiple" placeholder="请选择参与单位">
              <Option value="肿瘤医院">肿瘤医院</Option>
              <Option value="医学院">医学院</Option>
              <Option value="研究所">研究所</Option>
            </Select>
          </Form.Item>
          <Form.Item label="项目分工" name="division">
            <TextArea rows={3} placeholder="请输入项目分工" />
          </Form.Item>

          <Divider style={{ margin: '20px 0' }} />
          <h3 style={{ marginBottom: 20 }}>关键里程碑</h3>
          <Table 
            dataSource={[{ key: '1', milestone: '项目启动', date: '2026-06-01', leader: '张医生' }]}
            columns={[
              { title: '节点名称', dataIndex: 'milestone', key: 'milestone', render: () => <Input placeholder="请输入节点名称" /> },
              { title: '计划完成日期', dataIndex: 'date', key: 'date', render: () => <DatePicker placeholder="请选择完成日期" /> },
              { title: '负责人', dataIndex: 'leader', key: 'leader', render: () => <Select placeholder="请选择负责人"><Option value="张医生">张医生</Option></Select> },
              { title: '备注', dataIndex: 'remark', key: 'remark', render: () => <Input placeholder="请输入备注" /> },
              { title: '操作', key: 'action', render: () => <Button type="text" danger>删除</Button> },
            ]}
            pagination={false}
          />
          <Button type="dashed" icon={<PlusOutlined />} style={{ marginTop: 20, marginBottom: 20 }}>添加里程碑</Button>

          <Divider style={{ margin: '20px 0' }} />
          <h3 style={{ marginBottom: 20 }}>风险评估</h3>
          <Form.Item label="风险点" name="risks">
            <TextArea rows={3} placeholder="请输入风险点" />
          </Form.Item>
          <Form.Item label="应对措施" name="measures">
            <TextArea rows={3} placeholder="请输入应对措施" />
          </Form.Item>
          <Form.Item label="风险评估等级" name="riskLevel">
            <Select placeholder="请选择评估等级">
              <Option value="高">高</Option>
              <Option value="中">中</Option>
              <Option value="低">低</Option>
            </Select>
          </Form.Item>

          <Divider style={{ margin: '20px 0' }} />
          <h3 style={{ marginBottom: 20 }}>附件上传</h3>
          <Form.Item label="项目立项申请表">
            <Upload.Dragger>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="项目可行性报告">
            <Upload.Dragger>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="预算明细表">
            <Upload.Dragger>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="其他相关材料">
            <Upload.Dragger multiple>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传（支持多文件）</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
            <Button type="default">保存草稿</Button>
            <Button type="primary" htmlType="submit" style={{ marginLeft: 10 }}>提交审核</Button>
            <Button style={{ marginLeft: 10 }} onClick={() => setShowCreateModal(false)}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="确认删除"
        open={showDeleteModal}
        onCancel={cancelDelete}
        footer={null}
      >
        <p>确定删除该立项申请吗？删除后不可恢复。</p>
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <Button onClick={cancelDelete}>取消</Button>
          <Button type="primary" danger onClick={confirmDelete} style={{ marginLeft: 10 }}>
            确定删除
          </Button>
        </div>
      </Modal>

      <Modal
        title="确认提交审核"
        open={showSubmitModal}
        onCancel={cancelSubmit}
        footer={null}
      >
        <p>确定提交该立项申请进行审核吗？</p>
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <Button onClick={cancelSubmit}>取消</Button>
          <Button type="primary" onClick={confirmSubmit} style={{ marginLeft: 10 }}>
            确定提交
          </Button>
        </div>
      </Modal>
    </div>
  )
}