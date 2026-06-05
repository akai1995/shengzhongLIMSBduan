import { useState } from 'react'
import { Card, Table, Button, Tag, Form, Row, Col, Select, Input, Tabs, Modal } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'

export default function CcManagement() {
  const { isDark } = useThemeStore()
  const [activeTab, setActiveTab] = useState('received')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showRuleModal, setShowRuleModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)
  const [form] = Form.useForm()

  const receivedColumns = [
    { title: '审批事项', dataIndex: 'title', key: 'title', width: 180 },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 100 },
    { title: '当前审批人', dataIndex: 'currentApprover', key: 'currentApprover', width: 120 },
    { title: '抄送时间', dataIndex: 'ccTime', key: 'ccTime', width: 180 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (s: string) => <Tag color={s === '已读' ? 'green' : 'orange'}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 100,
      render: (_: unknown, record: any) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
      ),
    },
  ]

  const ruleColumns = [
    { title: '规则名称', dataIndex: 'ruleName', key: 'ruleName', width: 150 },
    { title: '触发条件', dataIndex: 'condition', key: 'condition', width: 150 },
    { title: '抄送人员', dataIndex: 'users', key: 'users', width: 180 },
    { title: '通知方式', dataIndex: 'notifyType', key: 'notifyType', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100, render: (s: string) => <Tag color={s === '启用' ? 'green' : 'red'}>{s}</Tag> },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 140,
      render: (_: unknown, record: any) => (
        <div style={{ display: 'flex', gap: 20 }}>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditRule(record)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
        </div>
      ),
    },
  ]

  const receivedData = Array.from({ length: 100 }, (_, i) => {
    const titles = ['科研项目立项审批', '经费支出审批', '设备采购审批', '试剂采购审批', '外出学习审批']
    const applicants = ['张三', '李四', '王五', '赵六', '钱七']
    const approvers = ['刘主任', '陈部长', '周经理', '吴科长', '郑主管']
    const ccUsers = ['李四', '王五', '赵六', '钱七', '孙八']
    const departments = ['科研部', '实验部', '管理部', '财务部', '人事部']
    const statuses = ['已读', '未读']
    return {
      key: String(i + 1),
      title: titles[i % titles.length] + (i > 4 ? `-${Math.floor(i / 5) + 1}` : ''),
      applicant: applicants[i % applicants.length],
      department: departments[i % departments.length],
      currentApprover: approvers[i % approvers.length],
      ccTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:00`,
      status: statuses[i % statuses.length],
      ccUser: ccUsers[i % ccUsers.length],
      businessNo: `YW2024${String(i + 1).padStart(6, '0')}`,
    }
  })

  const ruleData = Array.from({ length: 100 }, (_, i) => {
    const ruleNames = ['项目审批抄送规则', '经费审批抄送规则', '设备采购抄送规则', '试剂采购抄送规则', '外出审批抄送规则']
    const conditions = ['所有节点', '指定节点', '首次审批', '终审节点']
    const users = ['张三, 李四', '王五, 赵六', '钱七, 孙八', '周九, 吴十', '张三, 王五']
    const notifyTypes = ['系统消息', '邮件', '短信', '系统消息+邮件']
    const statuses = ['启用', '禁用']
    return {
      key: String(i + 1),
      ruleName: ruleNames[i % ruleNames.length] + (i > 4 ? `-${Math.floor(i / 5) + 1}` : ''),
      condition: conditions[i % conditions.length],
      users: users[i % users.length],
      notifyType: notifyTypes[i % notifyTypes.length],
      status: statuses[i % statuses.length],
    }
  })

  const handleViewDetail = (record: any) => {
    setCurrentRecord(record)
    setShowDetailModal(true)
  }

  const handleAddRule = () => {
    setIsEdit(false)
    setCurrentRecord(null)
    form.resetFields()
    setShowRuleModal(true)
  }

  const handleEditRule = (record: any) => {
    setIsEdit(true)
    setCurrentRecord(record)
    form.setFieldsValue({
      ruleName: record.ruleName,
      condition: record.condition,
      users: record.users,
      notifyType: record.notifyType,
    })
    setShowRuleModal(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>抄送管理</h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Tabs activeKey={activeTab} onChange={setActiveTab} style={{ width: '100%' }}>
          <Tabs.TabPane tab="收到的抄送" key="received">
            <Table 
              columns={receivedColumns} 
              dataSource={receivedData}
              scroll={{ x: 'max-content' }}
              components={{
                header: {
                  cell: (props: any) => <th {...props} style={{ ...props.style, fontWeight: 500, background: isDark ? '#1D1D1D' : '#F5F5F5', color: isDark ? '#ADADAD' : '#595959' }}>{props.children}</th>,
                },
              }}
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
              }}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="抄送规则" key="rules">
            <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={handleAddRule}>
              新增规则
            </Button>
            <Table 
              columns={ruleColumns} 
              dataSource={ruleData}
              scroll={{ x: 'max-content' }}
              components={{
                header: {
                  cell: (props: any) => <th {...props} style={{ ...props.style, fontWeight: 500, background: isDark ? '#1D1D1D' : '#F5F5F5', color: isDark ? '#ADADAD' : '#595959' }}>{props.children}</th>,
                },
              }}
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
              }}
            />
          </Tabs.TabPane>
        </Tabs>
      </Card>

      <Modal
        title="抄送详情"
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={600}
      >
        {currentRecord && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><strong>审批事项：</strong>{currentRecord.title}</div>
            <div><strong>业务编号：</strong>{currentRecord.businessNo}</div>
            <div><strong>申请人：</strong>{currentRecord.applicant}</div>
            <div><strong>申请部门：</strong>{currentRecord.department}</div>
            <div><strong>当前审批人：</strong>{currentRecord.currentApprover}</div>
            <div><strong>抄送时间：</strong>{currentRecord.ccTime}</div>
            <div><strong>状态：</strong><Tag color={currentRecord.status === '已读' ? 'green' : 'orange'}>{currentRecord.status}</Tag></div>
            <div><strong>抄送人：</strong>{currentRecord.ccUser}</div>
          </div>
        )}
      </Modal>

      <Modal
        title={isEdit ? '编辑规则' : '新增规则'}
        open={showRuleModal}
        onCancel={() => setShowRuleModal(false)}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" size="middle">
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="规则名称" name="ruleName" rules={[{ required: true, message: '请输入规则名称' }]}>
                <Input placeholder="请输入规则名称" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="触发条件" name="condition" rules={[{ required: true, message: '请选择触发条件' }]}>
                <Select placeholder="请选择" options={[
                  { value: 'all', label: '所有节点' },
                  { value: 'specific', label: '指定节点' },
                  { value: 'first', label: '首次审批' },
                  { value: 'final', label: '终审节点' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={12}>
              <Form.Item label="抄送人员" name="users" rules={[{ required: true, message: '请选择抄送人员' }]}>
                <Select placeholder="请选择" mode="multiple" options={[
                  { value: 'user1', label: '张三' },
                  { value: 'user2', label: '李四' },
                  { value: 'user3', label: '王五' },
                  { value: 'user4', label: '赵六' },
                ]} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="通知方式" name="notifyType" rules={[{ required: true, message: '请选择通知方式' }]}>
                <Select placeholder="请选择" mode="multiple" options={[
                  { value: 'system', label: '系统消息' },
                  { value: 'email', label: '邮件' },
                  { value: 'sms', label: '短信' },
                ]} />
              </Form.Item>
            </Col>
          </Row>
          <Row justify="flex-end" gutter={10}>
            <Col><Button onClick={() => setShowRuleModal(false)}>取消</Button></Col>
            <Col><Button type="primary">保存</Button></Col>
          </Row>
        </Form>
      </Modal>
    </div>
  )
}
