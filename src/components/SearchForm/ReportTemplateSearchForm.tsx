import { Form, Select, Input, Button, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

const { Option } = Select

interface SearchParams {
  name: string
  status: string
  creator: string
}

interface ReportTemplateSearchFormProps {
  searchParams: SearchParams
  onSearchParamsChange: (params: SearchParams) => void
  onSearch: () => void
  onReset: () => void
}

export default function ReportTemplateSearchForm({
  searchParams,
  onSearchParamsChange,
  onSearch,
  onReset,
}: ReportTemplateSearchFormProps) {
  return (
    <Form layout="horizontal" style={{ width: '100%' }}>
      <div style={{ display: 'flex', gap: 16, width: '100%', height: 32 }}>
        <Form.Item label="模板名称" style={{ flex: 1, marginBottom: 0 }} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Input 
            placeholder="请输入模板名称" 
            value={searchParams.name}
            onChange={(e) => onSearchParamsChange({ ...searchParams, name: e.target.value })}
          />
        </Form.Item>
        <Form.Item label="状态" style={{ flex: 1, marginBottom: 0 }} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Select 
            placeholder="请选择状态" 
            value={searchParams.status}
            onChange={(value) => onSearchParamsChange({ ...searchParams, status: value })}
          >
            <Option value="">全部</Option>
            <Option value="启用">启用</Option>
            <Option value="禁用">禁用</Option>
          </Select>
        </Form.Item>
        <Form.Item label="创建人" style={{ flex: 1, marginBottom: 0 }} labelCol={{ span: 6 }} wrapperCol={{ span: 18 }}>
          <Input 
            placeholder="请输入创建人" 
            value={searchParams.creator}
            onChange={(e) => onSearchParamsChange({ ...searchParams, creator: e.target.value })}
          />
        </Form.Item>
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          <Space>
            <Button type="primary" icon={<SearchOutlined />} onClick={onSearch}>查询</Button>
            <Button icon={<ReloadOutlined />} onClick={onReset}>重置</Button>
          </Space>
        </div>
      </div>
    </Form>
  )
}