import { useState } from 'react'
import { Card, Table, Button, Tag, Space, Form, Row, Col, Select, DatePicker, Input, Modal, Upload, message } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, DownOutlined, UpOutlined, ExportOutlined, SaveOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'

const { RangePicker } = DatePicker
const { TextArea } = Input

export default function PendingTasks() {
  const { isDark } = useThemeStore()
  const [expanded, setExpanded] = useState(false)
  const [form] = Form.useForm()
  const [approvalForm] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [approvalModalVisible, setApprovalModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)

  const columns = [
    { title: '流程名称', dataIndex: 'flowName', key: 'flowName', width: 150 },
    { title: '业务编号', dataIndex: 'businessNo', key: 'businessNo', width: 120 },
    { title: '业务名称', dataIndex: 'businessName', key: 'businessName', width: 180 },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 100 },
    { title: '申请部门', dataIndex: 'department', key: 'department', width: 120 },
    { title: '申请时间', dataIndex: 'time', key: 'time', width: 180 },
    { title: '当前节点', dataIndex: 'node', key: 'node', width: 120 },
    { title: '紧急程度', dataIndex: 'priority', key: 'priority', width: 100, render: (p: string) => <Tag color={p === '加急' ? 'red' : p === '紧急' ? 'orange' : 'blue'}>{p}</Tag> },
    { title: '停留时长', dataIndex: 'duration', key: 'duration', width: 100 },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 100,
      render: (_: unknown, record: any) => (
        <Button type="text" icon={<CheckCircleOutlined />} onClick={() => handleApproval(record)}>审批</Button>
      ),
    },
  ]

  const data = Array.from({ length: 100 }, (_, i) => {
    const priorities = ['普通', '紧急', '加急']
    const flowNames = ['科研项目立项审批', '经费支出审批', '科研项目变更审批', '结项验收审批', '设备采购审批', '试剂采购审批', '外出学习审批', '会议预约审批']
    const applicants = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
    const departments = ['科研部', '实验部', '管理部', '财务部', '人事部']
    const nodes = ['科研处处长审批', '分管领导审批', '财务审核', '主任审批', '部门负责人审批']
    const durations = ['0.5小时', '1小时', '2小时', '3小时', '1天', '2天', '3天', '5天']
    return {
      key: String(i + 1),
      flowName: flowNames[i % flowNames.length],
      businessNo: `YW${2024}${String(i + 1).padStart(6, '0')}`,
      businessName: flowNames[i % flowNames.length] + (i > 7 ? `-${Math.floor(i / 8) + 1}` : ''),
      applicant: applicants[i % applicants.length],
      department: departments[i % departments.length],
      time: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:00`,
      node: nodes[i % nodes.length],
      priority: priorities[i % priorities.length],
      duration: durations[i % durations.length],
    }
  })

  const handleApproval = (record: any) => {
    setCurrentRecord(record)
    approvalForm.resetFields()
    setApprovalModalVisible(true)
  }

  const handleApprovalSubmit = () => {
    approvalForm.validateFields().then(() => {
      message.success('审批通过')
      setApprovalModalVisible(false)
      approvalForm.resetFields()
    }).catch(() => {
      message.error('请填写必填项')
    })
  }

  const handleSaveDraft = () => {
    message.success('已暂存')
    setApprovalModalVisible(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>待办事项</h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={form} layout="horizontal">
          {expanded ? (
            <>
              <Row gutter={20} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="流程名称" name="flowName">
                    <Select placeholder="请选择流程名称" options={[
                      { value: 'all', label: '全部流程' },
                      { value: 'project', label: '科研项目立项审批' },
                      { value: 'fund', label: '经费支出审批' },
                      { value: 'change', label: '科研项目变更审批' },
                      { value: 'close', label: '结项验收审批' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="业务名称" name="businessName">
                    <Input placeholder="请输入业务名称" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="申请人" name="applicant">
                    <Input placeholder="请输入申请人" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="申请部门" name="department">
                    <Select placeholder="请选择申请部门" options={[
                      { value: 'all', label: '全部部门' },
                      { value: 'research', label: '科研部' },
                      { value: 'lab', label: '实验部' },
                      { value: 'admin', label: '管理部' },
                      { value: 'finance', label: '财务部' },
                    ]} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="申请时间" name="dateRange">
                    <RangePicker style={{ width: '100%' }} placeholder={['开始日期', '结束日期']} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="紧急程度" name="priority">
                    <Select placeholder="请选择紧急程度" mode="multiple" options={[
                      { value: 'normal', label: '普通' },
                      { value: 'urgent', label: '紧急' },
                      { value: 'rush', label: '加急' },
                    ]} />
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
                <Form.Item label="流程名称" name="flowName">
                  <Select placeholder="请选择流程名称" options={[
                    { value: 'all', label: '全部流程' },
                    { value: 'project', label: '科研项目立项审批' },
                    { value: 'fund', label: '经费支出审批' },
                    { value: 'change', label: '科研项目变更审批' },
                    { value: 'close', label: '结项验收审批' },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="业务名称" name="businessName">
                  <Input placeholder="请输入业务名称" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="申请人" name="applicant">
                  <Input placeholder="请输入申请人" />
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
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Button type="primary" icon={<ExportOutlined />} disabled={selectedRows.length === 0} className="export-btn">导出</Button>
        </div>
        <Table 
          columns={columns} 
          dataSource={data}
          scroll={{ x: 'max-content' }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
          components={{
            header: {
              cell: (props: any) => <th {...props} style={{ ...props.style, fontWeight: 500, background: isDark ? '#1D1D1D' : '#F5F5F5', color: isDark ? '#ADADAD' : '#595959' }}>{props.children}</th>,
            },
          }}
        />
      </Card>

      <Modal
        title="审批"
        open={approvalModalVisible}
        onCancel={() => setApprovalModalVisible(false)}
        footer={null}
        width={700}
      >
        {currentRecord && (
          <div>
            <div style={{ marginBottom: 24, padding: 16, backgroundColor: isDark ? '#141414' : '#F7F7F7', borderRadius: 8 }}>
              <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 12 }}>审批信息</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div><strong>流程名称：</strong>{currentRecord.flowName}</div>
                <div><strong>业务编号：</strong>{currentRecord.businessNo}</div>
                <div><strong>业务名称：</strong>{currentRecord.businessName}</div>
                <div><strong>申请人：</strong>{currentRecord.applicant}</div>
                <div><strong>申请部门：</strong>{currentRecord.department}</div>
                <div><strong>申请时间：</strong>{currentRecord.time}</div>
              </div>
            </div>

            <Form form={approvalForm} layout="vertical">
              <Form.Item 
                label="处理意见" 
                name="comment" 
                rules={[{ required: true, message: '请输入处理意见' }]}
              >
                <TextArea rows={4} placeholder="请输入处理意见" />
              </Form.Item>

              <Form.Item label="附件上传">
                <Upload.Dragger>
                  <p style={{ marginBottom: 8 }}>点击或拖拽文件到此处上传</p>
                  <p style={{ color: '#8C8C8C', fontSize: 12 }}>支持PDF、Word、图片等格式</p>
                </Upload.Dragger>
              </Form.Item>

              <Form.Item 
                label="抄送人员" 
                name="ccUsers" 
                rules={[{ required: true, message: '请选择抄送人员' }]}
              >
                <Select mode="multiple" placeholder="请选择抄送人员">
                  <Select.Option value="user1">张三</Select.Option>
                  <Select.Option value="user2">李四</Select.Option>
                  <Select.Option value="user3">王五</Select.Option>
                  <Select.Option value="user4">赵六</Select.Option>
                  <Select.Option value="user5">钱七</Select.Option>
                </Select>
              </Form.Item>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 24 }}>
                <Button onClick={() => setApprovalModalVisible(false)}>取消</Button>
                <Button icon={<SaveOutlined />} onClick={handleSaveDraft}>暂存</Button>
                <Button type="primary" onClick={handleApprovalSubmit}>审批通过</Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  )
}