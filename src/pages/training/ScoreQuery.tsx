import { Card, Table, Progress, Button, Input, Select, Statistic, Row, Col, Form, DatePicker } from 'antd'
import { DownloadOutlined, ArrowUpOutlined, ArrowDownOutlined, DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { RangePicker } = DatePicker

export default function ScoreQuery() {
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [searchForm] = Form.useForm()

  const columns = [
    { title: '学员姓名', dataIndex: 'name', key: 'name', width: 100 },
    { title: '工号', dataIndex: 'employeeId', key: 'employeeId', width: 120 },
    { title: '所属部门', dataIndex: 'department', key: 'department', width: 120 },
    { title: '考试名称', dataIndex: 'examName', key: 'examName', ellipsis: true },
    { title: '得分', dataIndex: 'score', key: 'score', width: 80 },
    { title: '正确率', dataIndex: 'accuracy', key: 'accuracy', width: 90, render: (val: number) => `${val}%` },
    { title: '用时', dataIndex: 'duration', key: 'duration', width: 100 },
    { title: '考试时间', dataIndex: 'examTime', key: 'examTime', width: 160 },
    {
      title: '是否通过',
      dataIndex: 'passed',
      key: 'passed',
      width: 100,
      render: (passed: boolean) => (
        <span style={{ color: passed ? '#52c41a' : '#ff4d4f', fontWeight: passed ? 'normal' : 'bold' }}>
          {passed ? '通过' : '未通过'}
        </span>
      ),
    },
    { title: '证书编号', dataIndex: 'certificateNo', key: 'certificateNo', width: 150 },
  ]

  const data = Array.from({ length: 50 }, (_, i) => {
    const names = ['张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十']
    const departments = ['研发部', '测试部', '生产部', '质量部', '采购部', '财务部']
    const exams = [
      '实验室安全知识考试', '仪器操作考核', '试剂管理考核', '危险化学品考试',
      '生物安全考核', '辐射防护考试', '消防考核', '急救知识考试'
    ]
    const score = 40 + Math.floor(Math.random() * 60)
    const passed = score >= 60
    return {
      key: String(i + 1),
      name: names[i % names.length],
      employeeId: `EMP${String(i + 1).padStart(4, '0')}`,
      department: departments[i % departments.length],
      examName: exams[i % exams.length],
      score: score,
      accuracy: Math.floor(Math.random() * 40 + 60),
      duration: `${Math.floor(Math.random() * 60) + 10}分钟`,
      examTime: `2024-0${(i % 6) + 1}-${String((i % 20) + 1).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:00:00`,
      passed: passed,
      certificateNo: passed ? `CERT${new Date().getFullYear()}${String(i + 1).padStart(6, '0')}` : '-',
    }
  })

  return (
    <div style={{ padding: 0 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>成绩查询</h1>
      <Card style={{ borderRadius: 10, marginBottom: 16 }}>
        <Row gutter={24}>
          <Col span={6}>
            <Card style={{ borderRadius: 8, background: '#f6ffed', border: '1px solid #b7eb8f' }}>
              <Statistic
                title={<span style={{ fontSize: 16 }}>参考总人数</span>}
                value={156}
                suffix="人"
                valueStyle={{ color: '#52c41a', fontSize: 32, fontWeight: 'bold' }}
                prefix={<ArrowUpOutlined style={{ color: '#52c41a' }} />}
              />
              <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12 }}>
                较上月 <span style={{ color: '#52c41a' }}>+12.5%</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ borderRadius: 8, background: '#f0f5ff', border: '1px solid #adc6ff' }}>
              <Statistic
                title={<span style={{ fontSize: 16 }}>参考总人次</span>}
                value={328}
                suffix="次"
                valueStyle={{ color: '#1890ff', fontSize: 32, fontWeight: 'bold' }}
                prefix={<ArrowUpOutlined style={{ color: '#1890ff' }} />}
              />
              <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12 }}>
                含补考 <span style={{ color: '#1890ff' }}>+8.3%</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ borderRadius: 8, background: '#fff7e6', border: '1px solid #ffd591' }}>
              <Statistic
                title={<span style={{ fontSize: 16 }}>平均分</span>}
                value={78.5}
                suffix="分"
                valueStyle={{ color: '#faad14', fontSize: 32, fontWeight: 'bold' }}
                prefix={<ArrowDownOutlined style={{ color: '#fa8c16' }} />}
              />
              <div style={{ marginTop: 8, color: '#8c8c8c', fontSize: 12 }}>
                较上次考试 <span style={{ color: '#fa8c16' }}>-2.3分</span>
              </div>
            </Card>
          </Col>
          <Col span={6}>
            <Card style={{ borderRadius: 8, background: '#f9f0ff', border: '1px solid #d3adf7' }}>
              <Statistic
                title={<span style={{ fontSize: 16 }}>合格率</span>}
                value={85.2}
                suffix="%"
                valueStyle={{ color: '#722ed1', fontSize: 32, fontWeight: 'bold' }}
              />
              <Progress
                percent={85.2}
                size="small"
                strokeColor="#722ed1"
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
        </Row>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal">
          {expanded ? (
            <>
              <Row gutter={20} style={{ height: 32 }}>
                <Col span={6}>
                  <Form.Item label="学员姓名" name="name">
                    <Input placeholder="请输入学员姓名" />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="所属部门" name="department">
                    <Select placeholder="请选择" options={[
                      { value: 'rd', label: '研发部' },
                      { value: 'qa', label: '测试部' },
                      { value: 'prod', label: '生产部' },
                      { value: 'qc', label: '质量部' },
                      { value: 'purchase', label: '采购部' },
                      { value: 'finance', label: '财务部' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="考试名称" name="examName">
                    <Select placeholder="请选择" options={[
                      { value: 'security', label: '实验室安全知识考试' },
                      { value: 'equipment', label: '仪器操作考核' },
                      { value: 'reagent', label: '试剂管理考核' },
                      { value: 'hazardous', label: '危险化学品考试' },
                      { value: 'bio', label: '生物安全考核' },
                      { value: 'radiation', label: '辐射防护考试' },
                      { value: 'fire', label: '消防考核' },
                      { value: 'firstAid', label: '急救知识考试' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="成绩范围" name="scoreRange">
                    <Select placeholder="请选择" options={[
                      { value: 'excellent', label: '优秀 (90-100分)' },
                      { value: 'good', label: '良好 (80-89分)' },
                      { value: 'medium', label: '中等 (70-79分)' },
                      { value: 'pass', label: '及格 (60-69分)' },
                      { value: 'fail', label: '不及格 (60分以下)' },
                    ]} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={20} style={{ height: 32, marginTop: 20 }}>
                <Col span={6}>
                  <Form.Item label="是否通过" name="passed">
                    <Select placeholder="请选择" options={[
                      { value: 'passed', label: '通过' },
                      { value: 'failed', label: '未通过' },
                    ]} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item label="考试时间" name="examTime">
                    <RangePicker style={{ width: '100%' }} />
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
                <Form.Item label="学员姓名" name="name">
                  <Input placeholder="请输入学员姓名" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="所属部门" name="department">
                  <Select placeholder="请选择" options={[
                    { value: 'rd', label: '研发部' },
                    { value: 'qa', label: '测试部' },
                    { value: 'prod', label: '生产部' },
                    { value: 'qc', label: '质量部' },
                    { value: 'purchase', label: '采购部' },
                    { value: 'finance', label: '财务部' },
                  ]} />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="考试名称" name="examName">
                  <Select placeholder="请选择" options={[
                    { value: 'security', label: '实验室安全知识考试' },
                    { value: 'equipment', label: '仪器操作考核' },
                    { value: 'reagent', label: '试剂管理考核' },
                    { value: 'hazardous', label: '危险化学品考试' },
                    { value: 'bio', label: '生物安全考核' },
                    { value: 'radiation', label: '辐射防护考试' },
                    { value: 'fire', label: '消防考核' },
                    { value: 'firstAid', label: '急救知识考试' },
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
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Button type="primary" icon={<DownloadOutlined />} disabled={selectedRows.length === 0} className="export-btn">导出成绩</Button>
        </div>

        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 'max-content' }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条记录` }}
        />
      </Card>
    </div>
  )
}
