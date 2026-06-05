import { Form, Select, Input, Button, Row, Col } from 'antd'
import { DownOutlined, UpOutlined } from '@ant-design/icons'
import { useState } from 'react'

const { Option } = Select

interface SearchParams {
  encryptionStatus: string
  keyStatus: string
  department: string
  keyword: string
}

interface EncryptionRecordsSearchFormProps {
  searchParams: SearchParams
  onSearchParamsChange: (params: SearchParams) => void
  onSearch: () => void
  onReset: () => void
}

const encryptionStatuses = ['全部状态', '已加密', '未加密', '加密中', '解密中']
const keyStatuses = ['全部状态', '正常', '即将过期', '已过期']
const departments = ['全部部门', '检验科', '分子诊断室', '质控组', '试剂科']

export default function EncryptionRecordsSearchForm({
  searchParams,
  onSearchParamsChange,
  onSearch,
  onReset,
}: EncryptionRecordsSearchFormProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <Form layout="horizontal">
      {expanded ? (
        <>
          <Row gutter={20} style={{ height: 32 }}>
            <Col span={6}>
              <Form.Item label="加密状态" name="encryptionStatus">
                <Select 
                  placeholder="请选择加密状态" 
                  style={{ width: '100%' }}
                  value={searchParams.encryptionStatus}
                  onChange={(value) => onSearchParamsChange({ ...searchParams, encryptionStatus: value })}
                >
                  {encryptionStatuses.map(st => (
                    <Option key={st} value={st}>{st}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="密钥状态" name="keyStatus">
                <Select 
                  placeholder="请选择密钥状态" 
                  style={{ width: '100%' }}
                  value={searchParams.keyStatus}
                  onChange={(value) => onSearchParamsChange({ ...searchParams, keyStatus: value })}
                >
                  {keyStatuses.map(st => (
                    <Option key={st} value={st}>{st}</Option>
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
            <Form.Item label="加密状态" name="encryptionStatus">
              <Select 
                placeholder="请选择加密状态" 
                style={{ width: '100%' }}
                value={searchParams.encryptionStatus}
                onChange={(value) => onSearchParamsChange({ ...searchParams, encryptionStatus: value })}
              >
                {encryptionStatuses.map(st => (
                  <Option key={st} value={st}>{st}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item label="密钥状态" name="keyStatus">
              <Select 
                placeholder="请选择密钥状态" 
                style={{ width: '100%' }}
                value={searchParams.keyStatus}
                onChange={(value) => onSearchParamsChange({ ...searchParams, keyStatus: value })}
              >
                {keyStatuses.map(st => (
                  <Option key={st} value={st}>{st}</Option>
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