import { Form, Select, Input, Button, Row, Col } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { Option } = Select

interface SearchParams {
  category: string
  department: string
  status: string
  keyword: string
}

interface DeviceRecordsSearchFormProps {
  searchParams: SearchParams
  onSearchParamsChange: (params: SearchParams) => void
  onSearch: () => void
  onReset: () => void
}

const categories = ['全部分类', '授权U盘', '部门专盘', '临时使用', '加密U盘']
const departments = ['全部部门', '检验科', '分子诊断室', '质控组', '试剂科']
const statuses = ['全部状态', '在线', '离线', '已禁用']

export default function DeviceRecordsSearchForm({
  searchParams,
  onSearchParamsChange,
  onSearch,
  onReset,
}: DeviceRecordsSearchFormProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Form layout="horizontal">
      {expanded ? (
        <>
          <Row gutter={20} style={{ height: 32 }}>
            <Col span={6}>
              <Form.Item label="分类" name="category">
                <Select 
                  placeholder="请选择分类" 
                  style={{ width: '100%' }}
                  value={searchParams.category}
                  onChange={(value) => onSearchParamsChange({ ...searchParams, category: value })}
                >
                  {categories.map(cat => (
                    <Option key={cat} value={cat}>{cat}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="部门" name="department">
                <Select 
                  placeholder="请选择部门" 
                  style={{ width: '100%' }}
                  value={searchParams.department}
                  onChange={(value) => onSearchParamsChange({ ...searchParams, department: value })}
                >
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="状态" name="status">
                <Select 
                  placeholder="请选择状态" 
                  style={{ width: '100%' }}
                  value={searchParams.status}
                  onChange={(value) => onSearchParamsChange({ ...searchParams, status: value })}
                >
                  {statuses.map(st => (
                    <Option key={st} value={st}>{st}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="设备标识/卷标" name="keyword">
                <Input 
                  placeholder="请输入设备标识或卷标" 
                  style={{ width: '100%' }}
                  value={searchParams.keyword}
                  onChange={(e) => onSearchParamsChange({ ...searchParams, keyword: e.target.value })}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20} style={{ height: 32, marginTop: 16 }}>
            <Col span={18}></Col>
            <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button type="primary" onClick={onSearch}>查询</Button>
              <Button onClick={onReset}>重置</Button>
              <Button type="link" onClick={() => setExpanded(false)} style={{ padding: 0 }}>收起<UpOutlined /></Button>
            </Col>
          </Row>
        </>
      ) : (
        <Row gutter={20} style={{ height: 32 }}>
          <Col span={6}>
            <Form.Item label="分类" name="category">
              <Select 
                placeholder="请选择分类" 
                style={{ width: '100%' }}
                value={searchParams.category}
                onChange={(value) => onSearchParamsChange({ ...searchParams, category: value })}
              >
                {categories.map(cat => (
                  <Option key={cat} value={cat}>{cat}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="部门" name="department">
              <Select 
                placeholder="请选择部门" 
                style={{ width: '100%' }}
                value={searchParams.department}
                onChange={(value) => onSearchParamsChange({ ...searchParams, department: value })}
              >
                {departments.map(dept => (
                  <Option key={dept} value={dept}>{dept}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="状态" name="status">
              <Select 
                placeholder="请选择状态" 
                style={{ width: '100%' }}
                value={searchParams.status}
                onChange={(value) => onSearchParamsChange({ ...searchParams, status: value })}
              >
                {statuses.map(st => (
                  <Option key={st} value={st}>{st}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button type="primary" onClick={onSearch}>查询</Button>
            <Button onClick={onReset}>重置</Button>
            <Button type="link" onClick={() => setExpanded(true)} style={{ padding: 0 }}>展开<DownOutlined /></Button>
          </Col>
        </Row>
      )}
    </Form>
  )
}