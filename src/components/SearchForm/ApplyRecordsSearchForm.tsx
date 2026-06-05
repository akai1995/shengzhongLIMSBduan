import { Form, Select, Input, Button, Row, Col } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { Option } = Select

interface SearchParams {
  status: string
  applyType: string
  department: string
  keyword: string
}

interface ApplyRecordsSearchFormProps {
  searchParams: SearchParams
  onSearchParamsChange: (params: SearchParams) => void
  onSearch: () => void
  onReset: () => void
}

const statuses = ['全部状态', '待处理', '处理中', '已通过', '已驳回', '已归还']
const applyTypes = ['全部类型', '新设备申请', '外来设备临时使用', '跨部门借用', '设备分类变更']
const departments = ['全部部门', '检验科', '分子诊断室', '设备科', '质控组']

export default function ApplyRecordsSearchForm({
  searchParams,
  onSearchParamsChange,
  onSearch,
  onReset,
}: ApplyRecordsSearchFormProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Form layout="horizontal">
      {expanded ? (
        <>
          <Row gutter={20} style={{ height: 32 }}>
            <Col span={6}>
              <Form.Item label="处理状态" name="status">
                <Select 
                  placeholder="请选择处理状态" 
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
              <Form.Item label="申请类型" name="applyType">
                <Select 
                  placeholder="请选择申请类型" 
                  style={{ width: '100%' }}
                  value={searchParams.applyType}
                  onChange={(value) => onSearchParamsChange({ ...searchParams, applyType: value })}
                >
                  {applyTypes.map(type => (
                    <Option key={type} value={type}>{type}</Option>
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
              <Form.Item label="申请单号/申请人" name="keyword">
                <Input 
                  placeholder="请输入申请单号或申请人" 
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
            <Form.Item label="处理状态" name="status">
              <Select 
                placeholder="请选择处理状态" 
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
            <Form.Item label="申请类型" name="applyType">
              <Select 
                placeholder="请选择申请类型" 
                style={{ width: '100%' }}
                value={searchParams.applyType}
                onChange={(value) => onSearchParamsChange({ ...searchParams, applyType: value })}
              >
                {applyTypes.map(type => (
                  <Option key={type} value={type}>{type}</Option>
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