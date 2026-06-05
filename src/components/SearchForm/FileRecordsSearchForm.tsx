import { Form, Select, Input, Button, Row, Col } from 'antd'

const { Option } = Select

interface SearchParams {
  operationType: string
  status: string
  keyword: string
}

interface FileRecordsSearchFormProps {
  searchParams: SearchParams
  onSearchParamsChange: (params: SearchParams) => void
  onSearch: () => void
  onReset: () => void
}

const operationTypes = ['全部类型', '拷贝入U盘', '从U盘拷出', '删除文件', '重命名', '格式化']
const statuses = ['全部状态', '成功', '已拦截', '失败']

export default function FileRecordsSearchForm({
  searchParams,
  onSearchParamsChange,
  onSearch,
  onReset,
}: FileRecordsSearchFormProps) {
  return (
    <Form layout="horizontal">
      <Row gutter={20} style={{ height: 32 }}>
        <Col span={6}>
          <Form.Item label="操作类型" name="operationType">
            <Select 
              placeholder="请选择操作类型" 
              style={{ width: '100%' }}
              value={searchParams.operationType}
              onChange={(value) => onSearchParamsChange({ ...searchParams, operationType: value })}
            >
              {operationTypes.map(type => (
                <Option key={type} value={type}>{type}</Option>
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
          <Form.Item label="文件路径/名称" name="keyword">
            <Input 
              placeholder="请输入文件路径或名称" 
              style={{ width: '100%' }}
              value={searchParams.keyword}
              onChange={(e) => onSearchParamsChange({ ...searchParams, keyword: e.target.value })}
            />
          </Form.Item>
        </Col>
        <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
          <Button type="primary" onClick={onSearch}>查询</Button>
          <Button onClick={onReset}>重置</Button>
        </Col>
      </Row>
    </Form>
  )
}