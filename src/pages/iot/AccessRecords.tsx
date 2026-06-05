import { Card, Form, Input, Button, Select, Table, Tag, Space, message, Row, Col, DatePicker } from 'antd'
import { SearchOutlined, UpOutlined, DownOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import PageTitle from '../../components/PageTitle/PageTitle'

const { Option } = Select
const { RangePicker } = DatePicker

interface AccessRecord {
  key: string
  id: string
  time: string
  department: string
  name: string
  employeeId: string
  area: string
  type: 'enter' | 'leave'
}

export default function AccessRecords() {
  const [searchForm] = Form.useForm()
  const [recordList, setRecordList] = useState<AccessRecord[]>([])
  const [filteredList, setFilteredList] = useState<AccessRecord[]>([])
  const [expanded, setExpanded] = useState(false)

  const departments = ['科研部', '实验室', '行政部', '财务部', '设备部', '人事部']
  const areas = ['A区-研发实验室', 'B区-办公区', 'C区-仓库', 'D区-会议室', 'E区-接待区', 'F区-机房']

  const initialRecords: AccessRecord[] = Array.from({ length: 30 }, (_, i) => ({
    key: String(i + 1),
    id: `AR${String(10001 + i).padStart(5, '0')}`,
    time: `2026-05-${String(1 + (i % 30)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:${String(10 + (i % 50)).padStart(2, '0')}:00`,
    department: departments[i % departments.length],
    name: ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生'][i % 6],
    employeeId: `EMP${String(2026001 + i).padStart(7, '0')}`,
    area: areas[i % areas.length],
    type: i % 2 === 0 ? 'enter' : 'leave',
  }))

  useEffect(() => {
    setRecordList(initialRecords)
    setFilteredList(initialRecords)
  }, [])

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    let result = [...recordList]

    if (values.department && values.department !== 'all') {
      result = result.filter(item => item.department === values.department)
    }
    if (values.name) {
      result = result.filter(item => item.name.includes(values.name) || item.employeeId.includes(values.name))
    }
    if (values.area && values.area !== 'all') {
      result = result.filter(item => item.area === values.area)
    }
    if (values.type && values.type !== 'all') {
      result = result.filter(item => item.type === values.type)
    }
    if (values.dateRange) {
      const [start, end] = values.dateRange
      result = result.filter(item => {
        const itemDate = new Date(item.time.replace(/-/g, '/'))
        return itemDate >= start && itemDate <= end
      })
    }

    setFilteredList(result)
    message.info(`搜索完成，共找到 ${result.length} 条记录`)
  }

  const columns = [
    { title: '时间', dataIndex: 'time', key: 'time', width: 180 },
    { title: '部门', dataIndex: 'department', key: 'department', width: 100 },
    { title: '工号', dataIndex: 'employeeId', key: 'employeeId', width: 120 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 80 },
    { title: '区域', dataIndex: 'area', key: 'area', width: 150 },
    { 
      title: '类型', 
      dataIndex: 'type', 
      key: 'type', 
      width: 80,
      render: (type: string) => (
        <Tag color={type === 'enter' ? 'green' : 'orange'}>
          {type === 'enter' ? '进入' : '离开'}
        </Tag>
      )
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <PageTitle>进出记录管理</PageTitle>

      <Card style={{ borderRadius: 10 }} styles={{ body: { padding: 20 } }}>
        <Form form={searchForm} layout="horizontal">
          <Row gutter={16}>
            <Col span={6} style={{ height: 32 }}>
              <Form.Item label="姓名/工号" name="name">
                <Input placeholder="请输入姓名或工号" />
              </Form.Item>
            </Col>
            <Col span={6} style={{ height: 32 }}>
              <Form.Item label="所属部门" name="department">
                <Select placeholder="请选择">
                  <Option value="all">全部</Option>
                  {departments.map(dept => <Option key={dept} value={dept}>{dept}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} style={{ height: 32 }}>
              <Form.Item label="区域" name="area">
                <Select placeholder="请选择">
                  <Option value="all">全部</Option>
                  {areas.map(area => <Option key={area} value={area}>{area}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            {expanded ? (
              <Col span={6} style={{ height: 32 }}>
                <Form.Item label="进出类型" name="type">
                  <Select placeholder="请选择">
                    <Option value="all">全部</Option>
                    <Option value="enter">进入</Option>
                    <Option value="leave">离开</Option>
                  </Select>
                </Form.Item>
              </Col>
            ) : (
              <Col span={6} style={{ height: 32 }}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', height: 32 }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={() => { searchForm.resetFields(); setFilteredList(recordList) }}>重置</Button>
                    <Button type="link" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
                      {expanded ? '收起' : '展开'}
                      {expanded ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            )}
          </Row>
          
          {expanded && (
            <Row gutter={16} style={{ height: 32, marginTop: 20 }}>
              <Col span={6} style={{ height: 32 }}>
                <Form.Item label="时间范围" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={18} style={{ height: 32 }}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end', height: 32 }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={() => { searchForm.resetFields(); setFilteredList(recordList) }}>重置</Button>
                    <Button type="link" onClick={() => setExpanded(!expanded)} style={{ padding: 0 }}>
                      {expanded ? '收起' : '展开'}
                      {expanded ? <UpOutlined /> : <DownOutlined />}
                    </Button>
                  </div>
                </Form.Item>
              </Col>
            </Row>
          )}
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} styles={{ body: { padding: 20 } }}>
        <Table
          columns={columns}
          dataSource={filteredList}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条记录` }}
        />
      </Card>
    </div>
  )
}