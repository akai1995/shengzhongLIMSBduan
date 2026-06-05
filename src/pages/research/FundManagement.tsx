import { Card, Form, Input, Button, Table, Space, Tag, message, DatePicker, Select, Modal, Tabs, Statistic, Row, Col, Divider, Upload } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, CheckOutlined, XOutlined, FileTextOutlined, UploadOutlined } from '@ant-design/icons'
import { useState } from 'react'
import SearchForm from '../../components/SearchForm/SearchForm'
import PageTitle from '../../components/PageTitle/PageTitle'

const { Option } = Select
const { TextArea } = Input
const { RangePicker } = DatePicker

export default function FundManagement() {
  const [activeTab, setActiveTab] = useState('budget')
  const [showReimburseModal, setShowReimburseModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showAuditModal, setShowAuditModal] = useState(false)
  const [showSubjectDetailModal, setShowSubjectDetailModal] = useState(false)
  const [selectedSubject, setSelectedSubject] = useState('')
  const [subjectExpenses, setSubjectExpenses] = useState<typeof expenseData>([])
  const [reimburseForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [selectedItem, setSelectedItem] = useState<any>(null)
  const [selectedRows, setSelectedRows] = useState<string[]>([])

  const budgetColumns = [
    { title: '预算科目', dataIndex: 'subject', key: 'subject' },
    { title: '预算金额(元)', dataIndex: 'budget', key: 'budget', render: (val: string) => `¥${Number(val).toLocaleString()}` },
    { title: '已支出(元)', dataIndex: 'spent', key: 'spent', render: (val: string) => `¥${Number(val).toLocaleString()}` },
    { title: '剩余预算(元)', dataIndex: 'remaining', key: 'remaining', render: (val: string) => `¥${Number(val).toLocaleString()}` },
    { 
      title: '执行率', 
      dataIndex: 'rate', 
      key: 'rate',
      render: (rate: number) => `${rate}%`
    },
    {
      title: '操作',
      key: 'action',
      width: 140,
      fixed: 'right' as const,
      render: (_: unknown, record: { subject: string }) => <Button type="text" onClick={() => handleViewDetail(record.subject)}>查看支出明细</Button>,
    },
  ]

  const budgetData = Array.from({ length: 100 }, (_, i) => {
    const subjects = ['人员费用', '设备购置', '实验材料', '差旅费', '会议费', '专家咨询费', '资料费', '印刷费', '交通费', '通讯费', '试剂费', '耗材费', '维保费', '租赁费', '培训费', '鉴定费', '测试费', '加工费', '水电费', '其他']
    const budget = 100000 + Math.floor(Math.random() * 400000)
    const spent = Math.floor(budget * (0.1 + Math.random() * 0.8))
    return {
      key: String(i + 1),
      subject: subjects[i % subjects.length],
      budget: String(budget),
      spent: String(spent),
      remaining: String(budget - spent),
      rate: Math.floor((spent / budget) * 100),
    }
  })

  const expenseColumns = [
    { title: '支出编号', dataIndex: 'id', key: 'id' },
    { title: '支出科目', dataIndex: 'subject', key: 'subject' },
    { title: '支出金额(元)', dataIndex: 'amount', key: 'amount', render: (val: string) => `¥${Number(val).toLocaleString()}` },
    { title: '支出日期', dataIndex: 'date', key: 'date' },
    { title: '经办人', dataIndex: 'operator', key: 'operator' },
    { title: '摘要/事由', dataIndex: 'summary', key: 'summary' },
    { title: '凭证号', dataIndex: 'voucher', key: 'voucher' },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right' as const,
      render: (_: unknown, record: { key: string; id: string; subject: string; amount: string; date: string; operator: string; summary: string; voucher: string }) => <Button type="text" icon={<EyeOutlined />} onClick={() => handleExpenseDetail(record)}>详情</Button>,
    },
  ]

  const expenseData = Array.from({ length: 100 }, (_, i) => {
    const subjects = ['实验材料', '差旅费', '设备购置', '会议费', '专家咨询费', '资料费', '试剂费', '耗材费']
    const summaries = ['细胞培养试剂采购', '参加学术会议', '流式细胞仪', '实验室研讨会', '技术咨询费用', '论文资料购买', '抗体采购', '离心管采购']
    const operators = ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生', '周医生', '吴医生']
    return {
      key: String(i + 1),
      id: `EXP2026${String(i + 1).padStart(4, '0')}`,
      subject: subjects[i % subjects.length],
      amount: String(1000 + Math.floor(Math.random() * 100000)),
      date: `2026-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')}`,
      operator: operators[i % operators.length],
      summary: summaries[i % summaries.length],
      voucher: `V20260${1 + (i % 8)}${String(1000 + i).slice(1)}`,
    }
  })

  const reimbursementColumns = [
    { title: '申请编号', dataIndex: 'id', key: 'id' },
    { title: '申请事由', dataIndex: 'reason', key: 'reason' },
    { title: '申请金额(元)', dataIndex: 'amount', key: 'amount', render: (val: string) => `¥${Number(val).toLocaleString()}` },
    { title: '申请日期', dataIndex: 'date', key: 'date' },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant' },
    { 
      title: '当前状态', 
      dataIndex: 'status', 
      key: 'status',
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          '待审批': 'orange',
          '已通过': 'green',
          '已驳回': 'red',
        }
        return <Tag color={colorMap[status]}>{status}</Tag>
      }
    },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right' as const,
      render: (_: unknown, record: { key: string; id: string; reason: string; amount: string; date: string; applicant: string; status: string }) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleReimbursementDetail(record)}>详情</Button>
          {record.status === '待审批' && <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>}
          {record.status === '待审批' && <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>}
          {record.status === '待审批' && <Button type="text" icon={<FileTextOutlined />} onClick={() => handleAudit(record)}>审批</Button>}
        </Space>
      ),
    },
  ]

  const reimbursementData = Array.from({ length: 100 }, (_, i) => {
    const statuses = ['待审批', '已通过', '已驳回']
    const reasons = ['实验试剂采购报销', '差旅费报销', '设备维护费报销', '会议费报销', '资料费报销', '试剂费报销', '耗材费报销', '培训费报销']
    const applicants = ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生', '周医生', '吴医生']
    return {
      key: String(i + 1),
      id: `REIMB2026${String(i + 1).padStart(4, '0')}`,
      reason: reasons[i % reasons.length],
      amount: String(1000 + Math.floor(Math.random() * 50000)),
      date: `2026-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')}`,
      applicant: applicants[i % applicants.length],
      status: statuses[i % statuses.length],
    }
  })

  const handleExpenseDetail = (record: any) => {
    setSelectedItem(record)
    setShowDetailModal(true)
  }

  const handleViewDetail = (subject: string) => {
    setSelectedSubject(subject)
    setSubjectExpenses(expenseData.filter(item => item.subject === subject))
    setShowSubjectDetailModal(true)
  }

  const handleEdit = (record: any) => {
    setSelectedItem(record)
    editForm.setFieldsValue({
      project: record.project || '',
      reason: record.reason,
      amount: record.amount,
      subject: record.subject || '',
      applicant: record.applicant,
    })
    setShowEditModal(true)
  }

  const handleSaveEdit = () => {
    setShowEditModal(false)
    editForm.resetFields()
    message.success('编辑成功')
  }

  const handleReimbursementDetail = (record: any) => {
    setSelectedItem(record)
    setShowDetailModal(true)
  }

  const handleAudit = (record: any) => {
    setSelectedItem(record)
    setShowAuditModal(true)
  }

  const handleAddReimbursement = () => {
    reimburseForm.resetFields()
    setShowReimburseModal(true)
  }

  const handleSaveReimbursement = () => {
    message.success('报销申请已提交')
    setShowReimburseModal(false)
    reimburseForm.resetFields()
  }

  const handleSaveAudit = () => {
    message.success('审批完成')
    setShowAuditModal(false)
    setShowDetailModal(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <PageTitle>经费管理</PageTitle>

      <Row gutter={16}>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <Statistic title="总预算" value={1300000} precision={2} prefix="¥" />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <Statistic title="已支出" value={770000} precision={2} prefix="¥" />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <Statistic title="剩余预算" value={530000} precision={2} prefix="¥" />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
            <Statistic title="待审批金额" value={20600} precision={2} prefix="¥" />
          </Card>
        </Col>
      </Row>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ width: '100%' }}>
          <Tabs.TabPane tab="预算明细" key="budget">
            <Table 
  columns={budgetColumns} 
  dataSource={budgetData} 
  components={{
    header: {
      cell: (props) => <th {...props} style={{ ...props.style, fontWeight: 500 }}>{props.children}</th>,
    },
  }}
  rowSelection={{
    type: 'checkbox',
    onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
  }}
/>
          </Tabs.TabPane>
          <Tabs.TabPane tab="支出记录" key="expense">
            <Table 
              columns={expenseColumns} 
              dataSource={expenseData}
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="报销申请" key="reimbursement">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <SearchForm 
                onSearch={() => {}}
                onReset={() => searchForm.resetFields()}
                expandedFields={
                  <Col span={6}>
                    <Form.Item label="申请时间" name="dateRange">
                      <RangePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                }
              >
                <Col span={6}>
                  <Form.Item label="申请事由" name="reason"><Input placeholder="请输入事由" /></Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="申请状态" name="status">
                    <Select placeholder="请选择状态">
                      <Option value="all">全部</Option>
                      <Option value="pending">待审批</Option>
                      <Option value="approved">已通过</Option>
                      <Option value="rejected">已驳回</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="申请人" name="applicant"><Input placeholder="请输入申请人" /></Form.Item>
                </Col>
              </SearchForm>
              <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
                <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={handleAddReimbursement}>
                  新增报销
                </Button>
                <Table 
                  columns={reimbursementColumns} 
                  dataSource={reimbursementData}
                  components={{
                    header: {
                      cell: (props) => <th {...props} style={{ ...props.style, fontWeight: 500 }}>{props.children}</th>,
                    },
                  }}
                  rowSelection={{
                    type: 'checkbox',
                    onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
                  }}
                />
              </Card>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title="新增报销申请"
        open={showReimburseModal}
        onCancel={() => setShowReimburseModal(false)}
        footer={null}
        width={600}
      >
        <Form form={reimburseForm} layout="vertical">
          <Form.Item label="项目名称" name="project" rules={[{ required: true }]}>
            <Select placeholder="请选择项目名称">
              <Option value="PRJ2026001">肺癌早期诊断研究</Option>
              <Option value="PRJ2026002">肿瘤免疫治疗临床研究</Option>
              <Option value="PRJ2026003">基因检测技术研究</Option>
            </Select>
          </Form.Item>
          <Form.Item label="申请事由" name="reason" rules={[{ required: true }]}>
            <Input placeholder="请输入申请事由（限200字符）" />
          </Form.Item>
          <Form.Item label="申请金额" name="amount" rules={[{ required: true }]}>
            <Input type="number" placeholder="单位：元" prefix="¥" />
          </Form.Item>
          <Form.Item label="支出科目" name="subject" rules={[{ required: true }]}>
            <Select placeholder="请选择支出科目">
              <Option value="人员费用">人员费用</Option>
              <Option value="设备购置">设备购置</Option>
              <Option value="实验材料">实验材料</Option>
              <Option value="差旅费">差旅费</Option>
              <Option value="会议费">会议费</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item label="支出日期" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="申请人" name="applicant">
            <Input disabled value="当前用户" />
          </Form.Item>
          <Form.Item label="附件（凭证）">
            <p style={{ marginBottom: 8, color: '#ff4d4f' }}>每份报销必须上传至少一个凭证</p>
            <Upload.Dragger>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传（支持PDF/Word/图片）</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSaveReimbursement} icon={<CheckOutlined />}>提交</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setShowReimburseModal(false)} icon={<XOutlined />}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑报销"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        width={600}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="所属项目" name="project">
            <Select placeholder="请选择项目">
              <Option value="PRJ2026001">肺癌早期诊断研究</Option>
              <Option value="PRJ2026002">肿瘤免疫治疗临床研究</Option>
              <Option value="PRJ2026003">基因检测技术研究</Option>
            </Select>
          </Form.Item>
          <Form.Item label="申请事由" name="reason" rules={[{ required: true }]}>
            <Input placeholder="请输入申请事由（限200字符）" />
          </Form.Item>
          <Form.Item label="申请金额" name="amount" rules={[{ required: true }]}>
            <Input type="number" placeholder="单位：元" prefix="¥" />
          </Form.Item>
          <Form.Item label="支出科目" name="subject" rules={[{ required: true }]}>
            <Select placeholder="请选择支出科目">
              <Option value="人员费用">人员费用</Option>
              <Option value="设备购置">设备购置</Option>
              <Option value="实验材料">实验材料</Option>
              <Option value="差旅费">差旅费</Option>
              <Option value="会议费">会议费</Option>
              <Option value="其他">其他</Option>
            </Select>
          </Form.Item>
          <Form.Item label="支出日期" name="date" rules={[{ required: true }]}>
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="申请人" name="applicant">
            <Input disabled value="当前用户" />
          </Form.Item>
          <Form.Item label="附件（凭证）">
            <p style={{ marginBottom: 8, color: '#ff4d4f' }}>每份报销必须上传至少一个凭证</p>
            <Upload.Dragger>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传（支持PDF/Word/图片）</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSaveEdit} icon={<CheckOutlined />}>保存</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setShowEditModal(false)} icon={<XOutlined />}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`${selectedItem?.id} - 详情`}
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: 20 }}>
          {selectedItem && selectedItem.reason ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><strong>申请编号：</strong>{selectedItem.id}</div>
                <div><strong>申请事由：</strong>{selectedItem.reason}</div>
                <div><strong>申请金额：</strong>¥{Number(selectedItem.amount).toLocaleString()}</div>
                <div><strong>申请日期：</strong>{selectedItem.date}</div>
                <div><strong>申请人：</strong>{selectedItem.applicant}</div>
                <div><strong>当前状态：</strong><Tag color={selectedItem.status === '待审批' ? 'orange' : selectedItem.status === '已通过' ? 'green' : 'red'}>{selectedItem.status}</Tag></div>
              </div>
              <Divider />
              <div>
                <strong>附件：</strong>
                <Button type="text">下载凭证</Button>
              </div>
            </>
          ) : selectedItem ? (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><strong>支出编号：</strong>{selectedItem.id}</div>
                <div><strong>支出科目：</strong>{selectedItem.subject}</div>
                <div><strong>支出金额：</strong>¥{Number(selectedItem.amount).toLocaleString()}</div>
                <div><strong>支出日期：</strong>{selectedItem.date}</div>
                <div><strong>经办人：</strong>{selectedItem.operator}</div>
                <div><strong>凭证号：</strong>{selectedItem.voucher}</div>
              </div>
              <Divider />
              <div>
                <strong>摘要/事由：</strong>{selectedItem.summary}
              </div>
              <Divider />
              <div>
                <strong>凭证文件：</strong>
                <Button type="primary">预览下载</Button>
              </div>
            </>
          ) : null}
        </div>
      </Modal>

      <Modal
        title={`${selectedSubject} - 支出明细`}
        open={showSubjectDetailModal}
        onCancel={() => setShowSubjectDetailModal(false)}
        footer={null}
        width={800}
      >
        <div style={{ padding: 20 }}>
          <Table 
            columns={[
              { title: '支出编号', dataIndex: 'id', key: 'id' },
              { title: '支出金额(元)', dataIndex: 'amount', key: 'amount', render: (val: string) => `¥${Number(val).toLocaleString()}` },
              { title: '支出日期', dataIndex: 'date', key: 'date' },
              { title: '经办人', dataIndex: 'operator', key: 'operator' },
              { title: '摘要/事由', dataIndex: 'summary', key: 'summary' },
              { title: '凭证号', dataIndex: 'voucher', key: 'voucher' },
            ]}
            dataSource={subjectExpenses}
            pagination={false}
            components={{
              header: {
                cell: (props) => <th {...props} style={{ ...props.style, fontWeight: 500 }}>{props.children}</th>,
              },
            }}
          />
        </div>
      </Modal>

      <Modal
        title="审批"
        open={showAuditModal}
        onCancel={() => setShowAuditModal(false)}
        footer={null}
        width={500}
      >
        <div style={{ padding: 20 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 10 }}>申请信息摘要</h3>
            <div><strong>申请事由：</strong>{selectedItem?.reason}</div>
            <div><strong>申请金额：</strong>¥{Number(selectedItem?.amount).toLocaleString()}</div>
            <div><strong>支出科目：</strong>实验材料</div>
          </div>

          <Divider />

          <Form layout="vertical">
            <Form.Item label="审批意见" required>
              <TextArea rows={4} placeholder="请输入审批意见" />
            </Form.Item>
            <Form.Item label="审批结果" required>
              <Select placeholder="请选择审批结果">
                <Option value="通过">通过</Option>
                <Option value="驳回">驳回</Option>
              </Select>
            </Form.Item>
            <Form.Item label="驳回原因">
              <TextArea rows={2} placeholder="请输入驳回原因（选择驳回时必填）" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={handleSaveAudit} icon={<CheckOutlined />}>提交</Button>
              <Button style={{ marginLeft: 8 }} onClick={() => setShowAuditModal(false)} icon={<XOutlined />}>取消</Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}