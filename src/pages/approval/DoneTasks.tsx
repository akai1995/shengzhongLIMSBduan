import { useState } from 'react'
import { Card, Table, Tag, Form, Row, Col, Select, DatePicker, Input, Button, Modal } from 'antd'
import { DownOutlined, UpOutlined, ExportOutlined, EyeOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'

const { RangePicker } = DatePicker

export default function DoneTasks() {
  const { isDark } = useThemeStore()
  const [expanded, setExpanded] = useState(false)
  const [form] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<any>(null)

  const columns = [
    { title: '流程名称', dataIndex: 'flowName', key: 'flowName', width: 150 },
    { title: '业务编号', dataIndex: 'businessNo', key: 'businessNo', width: 120 },
    { title: '业务名称', dataIndex: 'businessName', key: 'businessName', width: 180 },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 100 },
    { title: '申请部门', dataIndex: 'department', key: 'department', width: 120 },
    { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 180 },
    { title: '我的处理节点', dataIndex: 'myNode', key: 'myNode', width: 120 },
    { title: '我的处理操作', dataIndex: 'myAction', key: 'myAction', width: 100 },
    { title: '我的处理时间', dataIndex: 'handleTime', key: 'handleTime', width: 180 },
    { title: '处理意见', dataIndex: 'comment', key: 'comment', width: 150 },
    { title: '最终审批结果', dataIndex: 'result', key: 'result', width: 100, render: (r: string) => <Tag color={r === '通过' ? 'green' : 'red'}>{r}</Tag> },
    { title: '紧急程度', dataIndex: 'priority', key: 'priority', width: 100, render: (p: string) => <Tag color={p === '加急' ? 'red' : p === '紧急' ? 'orange' : 'blue'}>{p}</Tag> },
    {
      title: '操作',
      key: 'action',
      fixed: 'right' as const,
      width: 100,
      render: (_: unknown, record: any) => (
        <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看详情</Button>
      ),
    },
  ]

  const data = Array.from({ length: 100 }, (_, i) => {
    const results = ['通过', '通过', '通过', '驳回']
    const flowNames = ['科研项目立项审批', '经费支出审批', '科研项目变更审批', '结项验收审批', '设备采购审批', '试剂采购审批', '外出学习审批', '会议预约审批']
    const applicants = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
    const departments = ['科研部', '实验部', '管理部', '财务部', '人事部']
    const myNodes = ['科研处处长审批', '分管领导审批', '财务审核', '主任审批']
    const myActions = ['通过', '驳回', '转签', '加签']
    const comments = ['同意申请，符合相关规定', '材料齐全，同意通过', '请补充相关证明材料', '不符合申请条件']
    const priorities = ['普通', '紧急', '加急']
    return {
      key: String(i + 1),
      flowName: flowNames[i % flowNames.length],
      businessNo: `YW${2024}${String(i + 1).padStart(6, '0')}`,
      businessName: flowNames[i % flowNames.length] + (i > 7 ? `-${Math.floor(i / 8) + 1}` : ''),
      applicant: applicants[i % applicants.length],
      department: departments[i % departments.length],
      applyTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(8 + (i % 10)).padStart(2, '0')}:00`,
      myNode: myNodes[i % myNodes.length],
      myAction: myActions[i % myActions.length],
      handleTime: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')} ${String(10 + (i % 10)).padStart(2, '0')}:00`,
      comment: comments[i % comments.length],
      result: results[i % results.length],
      priority: priorities[i % priorities.length],
    }
  })

  const handleViewDetail = (record: any) => {
    setCurrentRecord(record)
    setDetailModalVisible(true)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>已办事项</h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={form} layout="horizontal">
          {expanded ? (
            <>
              <Row gutter={20} style={{ height: 32 }}>
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
                    <Select placeholder="请选择" options={[
                      { value: 'all', label: '全部' },
                      { value: 'research', label: '科研部' },
                      { value: 'lab', label: '实验部' },
                      { value: 'admin', label: '管理部' },
                      { value: 'finance', label: '财务部' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="申请时间" name="applyDateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="我的处理时间" name="handleDateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="我的处理操作" name="myAction">
                    <Select placeholder="请选择" options={[
                      { value: 'all', label: '全部' },
                      { value: 'pass', label: '通过' },
                      { value: 'reject', label: '驳回' },
                      { value: 'transfer', label: '转签' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="最终审批结果" name="result">
                    <Select placeholder="请选择" options={[
                      { value: 'all', label: '全部' },
                      { value: 'pass', label: '通过' },
                      { value: 'reject', label: '驳回' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                  <Button type="primary">查询</Button>
                  <Button className="reset-btn">重置</Button>
                  <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
                  <Button icon={<ExportOutlined />}>导出</Button>
                </Col>
              </Row>
            </>
          ) : (
            <Row gutter={20} style={{ height: 32 }}>
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
                <Form.Item label="最终审批结果" name="result">
                  <Select placeholder="请选择" options={[
                    { value: 'all', label: '全部' },
                    { value: 'pass', label: '通过' },
                    { value: 'reject', label: '驳回' },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <Button type="primary">查询</Button>
                <Button className="reset-btn">重置</Button>
                <Button type="link" onClick={() => setExpanded(true)} style={{ padding: 0 }}>展开<DownOutlined /></Button>
                <Button icon={<ExportOutlined />}>导出</Button>
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
        title="审批详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentRecord && (
          <div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div><strong>流程名称：</strong>{currentRecord.flowName}</div>
                <div><strong>业务编号：</strong>{currentRecord.businessNo}</div>
                <div><strong>业务名称：</strong>{currentRecord.businessName}</div>
                <div><strong>申请人：</strong>{currentRecord.applicant}</div>
                <div><strong>申请部门：</strong>{currentRecord.department}</div>
                <div><strong>申请时间：</strong>{currentRecord.applyTime}</div>
                <div><strong>我的处理节点：</strong>{currentRecord.myNode}</div>
                <div><strong>我的处理操作：</strong><Tag color={currentRecord.myAction === '通过' ? 'green' : currentRecord.myAction === '驳回' ? 'red' : 'blue'}>{currentRecord.myAction}</Tag></div>
                <div><strong>我的处理时间：</strong>{currentRecord.handleTime}</div>
                <div><strong>处理意见：</strong>{currentRecord.comment}</div>
                <div><strong>最终审批结果：</strong><Tag color={currentRecord.result === '通过' ? 'green' : 'red'}>{currentRecord.result}</Tag></div>
                <div><strong>紧急程度：</strong><Tag color={currentRecord.priority === '加急' ? 'red' : currentRecord.priority === '紧急' ? 'orange' : 'blue'}>{currentRecord.priority}</Tag></div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}