import { Card, Form, Input, Button, Select, Table, Modal, Tag, Space, message, Row, Col, DatePicker } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, CopyOutlined, SearchOutlined, UpOutlined, DownOutlined, EyeOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'

const { Option } = Select
const { TextArea } = Input
const { RangePicker } = DatePicker

export default function ElnTemplate() {
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<any>(null)
  const [deleteTemplate, setDeleteTemplate] = useState<any>(null)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [filteredData, setFilteredData] = useState<any[]>([])
  const [fields, setFields] = useState<any[]>([])
  const [tableData, setTableData] = useState([
    {
      key: '1',
      id: 'TMP2026001',
      name: '细胞培养模板',
      projects: ['肺癌研究项目', '肿瘤免疫治疗项目'],
      creator: '张医生',
      fieldCount: 15,
      permission: '公开',
      createTime: '2026-05-10',
    },
    {
      key: '2',
      id: 'TMP2026002',
      name: 'PCR实验模板',
      projects: ['基因检测技术项目'],
      creator: '李医生',
      fieldCount: 12,
      permission: '私有',
      createTime: '2026-05-08',
    },
  ])

  useEffect(() => {
    if (tableData.length === 2) {
      const newData = Array.from({ length: 98 }, (_, i) => {
        const permissions = ['公开', '私有', '公开', '私有', '公开']
        const names = ['Western Blot模板', '免疫组化模板', '动物实验模板', '临床样本处理模板', '数据统计分析模板', '试剂配制模板']
        const creators = ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生']
        return {
          key: String(i + 3),
          id: `TMP2026${String(i + 3).padStart(4, '0')}`,
          name: names[i % names.length] + (i > 5 ? `-${Math.floor(i / 6) + 1}` : ''),
          projects: ['项目A', '项目B'],
          creator: creators[i % creators.length],
          fieldCount: 8 + Math.floor(Math.random() * 15),
          permission: permissions[i % permissions.length],
          createTime: `2026-05-${String(1 + (i % 28)).padStart(2, '0')}`,
        }
      })
      const allData = [...tableData, ...newData]
      setTableData(allData)
      setFilteredData(allData)
    } else {
      setFilteredData(tableData)
    }
  }, [tableData])

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    let result = [...tableData]
    
    if (values.name) {
      result = result.filter(item => item.name.includes(values.name))
    }
    if (values.creator) {
      result = result.filter(item => item.creator.includes(values.creator))
    }
    if (values.permission && values.permission !== 'all') {
      result = result.filter(item => item.permission === values.permission)
    }
    if (values.dateRange && values.dateRange.length === 2) {
      const startDate = values.dateRange[0].format('YYYY-MM-DD')
      const endDate = values.dateRange[1].format('YYYY-MM-DD')
      result = result.filter(item => item.createTime >= startDate && item.createTime <= endDate)
    }
    
    setFilteredData(result)
    message.info(`搜索完成，共找到 ${result.length} 条记录`)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setFilteredData([...tableData])
  }

  const columns = [
    { title: '模板ID', dataIndex: 'id', key: 'id', width: 140 },
    { title: '模板名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '适用项目', dataIndex: 'projects', key: 'projects', width: 250, render: (projects: string[]) => projects.join(', ') },
    { title: '创建人', dataIndex: 'creator', key: 'creator', width: 120 },
    { title: '字段数量', dataIndex: 'fieldCount', key: 'fieldCount', width: 120 },
    { 
      title: '权限设置', 
      dataIndex: 'permission', 
      key: 'permission', 
      width: 120,
      render: (permission: string) => (
        <Tag color={permission === '公开' ? 'blue' : 'orange'}>
          {permission}
        </Tag>
      )
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 140 },
    { 
      title: '操作', 
      key: 'action', 
      width: 320, 
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" icon={<CopyOutlined />} onClick={() => handleCopy(record)}>复制</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      )
    },
  ]

  const handleViewDetail = (record: any) => {
    setCurrentTemplate(record)
    setDetailModalVisible(true)
  }

  const handleCreate = () => {
    form.resetFields()
    setFields([
      { key: String(Date.now()), fieldName: '', fieldType: 'text', required: false, order: 1, permission: '可编辑' },
    ])
    setCreateModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setCurrentTemplate(record)
    form.setFieldsValue({
      name: record.name,
      projects: record.projects.join(', '),
      permission: record.permission,
    })
    setFields([
      { key: '1', fieldName: '实验目的', fieldType: 'text', required: true, order: 1, permission: '可编辑' },
      { key: '2', fieldName: '实验步骤', fieldType: 'text', required: true, order: 2, permission: '可编辑' },
      { key: '3', fieldName: '实验数据', fieldType: 'text', required: false, order: 3, permission: '可编辑' },
      { key: '4', fieldName: '结果分析', fieldType: 'text', required: false, order: 4, permission: '可编辑' },
    ])
    setEditModalVisible(true)
  }

  const handleAddField = () => {
    const newField = {
      key: String(Date.now()),
      fieldName: '',
      fieldType: 'text',
      required: false,
      order: fields.length + 1,
      permission: '可编辑',
    }
    setFields(prev => [...prev, newField])
  }

  const handleDeleteField = (key: string) => {
    setFields(prev => {
      const updated = prev.filter(f => f.key !== key)
      return updated.map((f, index) => ({ ...f, order: index + 1 }))
    })
  }

  const handleFieldChange = (key: string, field: string, value: any) => {
    setFields(prev => prev.map(f => f.key === key ? { ...f, [field]: value } : f))
  }

  const handleCopy = (record: any) => {
    const newRecord = {
      ...record,
      key: String(Date.now()),
      id: `TMP${Date.now().toString().slice(-8)}`,
      name: `${record.name} - 副本`,
      createTime: new Date().toISOString().split('T')[0],
    }
    setTableData(prev => [...prev, newRecord])
    setFilteredData(prev => [...prev, newRecord])
    message.success('模板已复制')
  }

  const handleDelete = (record: any) => {
    setDeleteTemplate(record)
    setDeleteModalVisible(true)
  }

  const handleSubmit = (values: any) => {
    if (editModalVisible && currentTemplate) {
      const updatedRecord = {
        ...currentTemplate,
        name: values.name,
        projects: values.projects ? values.projects.split(',').map((p: string) => p.trim()).filter((p: string) => p) : [],
        permission: values.permission || '公开',
      }
      setTableData(prev => prev.map(item => item.key === currentTemplate.key ? updatedRecord : item))
      setFilteredData(prev => prev.map(item => item.key === currentTemplate.key ? updatedRecord : item))
      message.success('模板已更新')
      setEditModalVisible(false)
    } else {
      const now = new Date().toISOString().split('T')[0]
      const newRecord = {
        key: String(Date.now()),
        id: `TMP${Date.now().toString().slice(-8)}`,
        name: values.name,
        projects: values.projects ? values.projects.split(',').map((p: string) => p.trim()).filter((p: string) => p) : [],
        creator: '当前用户',
        fieldCount: 4,
        permission: values.permission || '公开',
        createTime: now,
      }
      setTableData(prev => [newRecord, ...prev])
      setFilteredData(prev => [newRecord, ...prev])
      message.success('模板已创建')
      setCreateModalVisible(false)
    }
    form.resetFields()
  }

  const confirmDelete = () => {
    setTableData(prev => prev.filter(item => item.key !== deleteTemplate.key))
    setFilteredData(prev => prev.filter(item => item.key !== deleteTemplate.key))
    message.success('删除成功')
    setDeleteModalVisible(false)
    setDeleteTemplate(null)
  }

  const fieldTypes = [
    { label: '文本输入', value: 'text' },
    { label: '数字', value: 'number' },
    { label: '日期', value: 'date' },
    { label: '下拉选择', value: 'select' },
    { label: '单选', value: 'radio' },
    { label: '多选', value: 'checkbox' },
    { label: '表格', value: 'table' },
    { label: '文件上传', value: 'upload' },
  ]

  const permissions = ['所有人', '项目成员', '仅自己']

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <PageTitle>模板管理</PageTitle>

      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16} style={{ height: '32px' }}>
            <Col span={6}>
              <Form.Item label="模板名称" name="name"><Input placeholder="请输入模板名称" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="创建人" name="creator"><Input placeholder="请输入创建人" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="权限设置" name="permission">
                <Select placeholder="请选择权限">
                  <Option value="all">全部</Option>
                  <Option value="公开">公开</Option>
                  <Option value="私有">私有</Option>
                </Select>
              </Form.Item>
            </Col>
            {expanded && (
              <Col span={6}>
                <Form.Item label="创建时间" name="dateRange">
                  <RangePicker style={{ width: '100%' }} />
                </Form.Item>
              </Col>
            )}
            {!expanded && (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset} className="reset-btn">重置</Button>
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
            <Row gutter={16} style={{ height: '32px', marginTop: '20px' }}>
              <Col span={6} offset={18}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset} className="reset-btn">重置</Button>
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

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Button type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />} onClick={handleCreate}>
          新建模板
        </Button>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          scroll={{ x: 'max-content' }}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      <Modal
        title="模板详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentTemplate && (
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>基本信息</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 24 }}>
              <div><strong>模板ID：</strong>{currentTemplate.id}</div>
              <div><strong>模板名称：</strong>{currentTemplate.name}</div>
              <div><strong>创建人：</strong>{currentTemplate.creator}</div>
              <div><strong>适用项目：</strong>{currentTemplate.projects.join(', ')}</div>
              <div><strong>字段数量：</strong>{currentTemplate.fieldCount} 个</div>
              <div><strong>权限设置：</strong><Tag color={currentTemplate.permission === '公开' ? 'blue' : 'orange'}>{currentTemplate.permission}</Tag></div>
              <div><strong>创建时间：</strong>{currentTemplate.createTime}</div>
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>模板字段配置</h3>
            <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
              <Table
                dataSource={[
                  { key: '1', fieldName: '实验目的', fieldType: '文本输入', required: '是', order: 1, permission: '可编辑' },
                  { key: '2', fieldName: '实验步骤', fieldType: '文本输入', required: '是', order: 2, permission: '可编辑' },
                  { key: '3', fieldName: '实验数据', fieldType: '文本输入', required: '否', order: 3, permission: '可编辑' },
                  { key: '4', fieldName: '结果分析', fieldType: '文本输入', required: '否', order: 4, permission: '可编辑' },
                ]}
                columns={[
                  { title: '字段名称', dataIndex: 'fieldName', key: 'fieldName' },
                  { title: '字段类型', dataIndex: 'fieldType', key: 'fieldType' },
                  { title: '是否必填', dataIndex: 'required', key: 'required' },
                  { title: '排序', dataIndex: 'order', key: 'order' },
                  { title: '权限', dataIndex: 'permission', key: 'permission' },
                ]}
                pagination={false}
                size="small"
              />
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="新建模板"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width="90%"
        style={{ maxWidth: '1200px' }}
        bodyStyle={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="模板名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item label="适用项目" name="projects">
            <TextArea rows={2} placeholder="请输入适用项目，多个项目用逗号分隔" />
          </Form.Item>
          
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 500 }}>模板字段配置</h4>
            <Table
              dataSource={fields}
              columns={[
                { 
                  title: '字段名称', 
                  dataIndex: 'fieldName', 
                  key: 'fieldName', 
                  render: (_, record: any) => (
                    <Input 
                      placeholder="请输入字段名称" 
                      value={record.fieldName}
                      onChange={(e) => handleFieldChange(record.key, 'fieldName', e.target.value)}
                    />
                  ) 
                },
                { 
                  title: '字段类型', 
                  dataIndex: 'fieldType', 
                  key: 'fieldType', 
                  render: (_, record: any) => (
                    <Select 
                      placeholder="请选择类型" 
                      value={record.fieldType}
                      onChange={(value) => handleFieldChange(record.key, 'fieldType', value)}
                    >
                      <Option value="text">文本输入</Option>
                      <Option value="number">数字</Option>
                      <Option value="date">日期</Option>
                      <Option value="select">下拉选择</Option>
                      <Option value="radio">单选</Option>
                      <Option value="checkbox">多选</Option>
                      <Option value="table">表格</Option>
                      <Option value="upload">文件上传</Option>
                    </Select>
                  ) 
                },
                { 
                  title: '是否必填', 
                  dataIndex: 'required', 
                  key: 'required', 
                  render: (_, record: any) => (
                    <Select 
                      placeholder="请选择" 
                      value={record.required}
                      onChange={(value) => handleFieldChange(record.key, 'required', value)}
                    >
                      <Option value={true}>是</Option>
                      <Option value={false}>否</Option>
                    </Select>
                  ) 
                },
                { 
                  title: '排序', 
                  dataIndex: 'order', 
                  key: 'order', 
                  render: (_, record: any) => (
                    <Input 
                      type="number" 
                      style={{ width: 80 }} 
                      value={record.order}
                      onChange={(e) => handleFieldChange(record.key, 'order', parseInt(e.target.value) || 0)}
                    />
                  ) 
                },
                { 
                  title: '权限', 
                  dataIndex: 'permission', 
                  key: 'permission', 
                  render: (_, record: any) => (
                    <Select 
                      placeholder="请选择" 
                      value={record.permission}
                      onChange={(value) => handleFieldChange(record.key, 'permission', value)}
                    >
                      <Option value="只读">只读</Option>
                      <Option value="可编辑">可编辑</Option>
                    </Select>
                  ) 
                },
                { 
                  title: '操作', 
                  key: 'action', 
                  render: (_, record: any) => (
                    <Button 
                      type="text" 
                      danger 
                      onClick={() => handleDeleteField(record.key)}
                      disabled={fields.length <= 1}
                    >删除</Button>
                  ) 
                },
              ]}
              pagination={false}
              size="small"
              rowKey="key"
            />
            <Button type="dashed" style={{ marginTop: 12, width: '100%' }} icon={<PlusOutlined />} onClick={handleAddField}>添加字段</Button>
          </div>

          <Form.Item label="权限设置" name="permission">
            <Select placeholder="请选择谁可以基于此模板创建记录">
              {permissions.map(p => <Option key={p} value={p}>{p}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button style={{ marginLeft: 10 }} onClick={() => {
              setCreateModalVisible(false)
              form.resetFields()
            }}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑模板"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width="90%"
        style={{ maxWidth: '1200px' }}
        bodyStyle={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="模板名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item label="适用项目" name="projects">
            <TextArea rows={2} placeholder="请输入适用项目，多个项目用逗号分隔" />
          </Form.Item>
          
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ marginBottom: 16, fontSize: 14, fontWeight: 500 }}>模板字段配置</h4>
            <Table
              dataSource={fields}
              columns={[
                { 
                  title: '字段名称', 
                  dataIndex: 'fieldName', 
                  key: 'fieldName', 
                  render: (_, record: any) => (
                    <Input 
                      placeholder="请输入字段名称" 
                      value={record.fieldName}
                      onChange={(e) => handleFieldChange(record.key, 'fieldName', e.target.value)}
                    />
                  ) 
                },
                { 
                  title: '字段类型', 
                  dataIndex: 'fieldType', 
                  key: 'fieldType', 
                  render: (_, record: any) => (
                    <Select 
                      placeholder="请选择类型" 
                      value={record.fieldType}
                      onChange={(value) => handleFieldChange(record.key, 'fieldType', value)}
                    >
                      <Option value="text">文本输入</Option>
                      <Option value="number">数字</Option>
                      <Option value="date">日期</Option>
                      <Option value="select">下拉选择</Option>
                      <Option value="radio">单选</Option>
                      <Option value="checkbox">多选</Option>
                      <Option value="table">表格</Option>
                      <Option value="upload">文件上传</Option>
                    </Select>
                  ) 
                },
                { 
                  title: '是否必填', 
                  dataIndex: 'required', 
                  key: 'required', 
                  render: (_, record: any) => (
                    <Select 
                      placeholder="请选择" 
                      value={record.required}
                      onChange={(value) => handleFieldChange(record.key, 'required', value)}
                    >
                      <Option value={true}>是</Option>
                      <Option value={false}>否</Option>
                    </Select>
                  ) 
                },
                { 
                  title: '排序', 
                  dataIndex: 'order', 
                  key: 'order', 
                  render: (_, record: any) => (
                    <Input 
                      type="number" 
                      style={{ width: 80 }} 
                      value={record.order}
                      onChange={(e) => handleFieldChange(record.key, 'order', parseInt(e.target.value) || 0)}
                    />
                  ) 
                },
                { 
                  title: '权限', 
                  dataIndex: 'permission', 
                  key: 'permission', 
                  render: (_, record: any) => (
                    <Select 
                      placeholder="请选择" 
                      value={record.permission}
                      onChange={(value) => handleFieldChange(record.key, 'permission', value)}
                    >
                      <Option value="只读">只读</Option>
                      <Option value="可编辑">可编辑</Option>
                    </Select>
                  ) 
                },
                { 
                  title: '操作', 
                  key: 'action', 
                  render: (_, record: any) => (
                    <Button 
                      type="text" 
                      danger 
                      onClick={() => handleDeleteField(record.key)}
                      disabled={fields.length <= 1}
                    >删除</Button>
                  ) 
                },
              ]}
              pagination={false}
              size="small"
              rowKey="key"
            />
            <Button type="dashed" style={{ marginTop: 12, width: '100%' }} icon={<PlusOutlined />} onClick={handleAddField}>添加字段</Button>
          </div>

          <Form.Item label="权限设置" name="permission">
            <Select placeholder="请选择谁可以基于此模板创建记录">
              {permissions.map(p => <Option key={p} value={p}>{p}</Option>)}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginTop: 20, marginBottom: 0 }}>
            <Button type="primary" htmlType="submit">保存</Button>
            <Button style={{ marginLeft: 10 }} onClick={() => {
              setEditModalVisible(false)
              form.resetFields()
            }}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false)
          setDeleteTemplate(null)
        }}
        footer={null}
      >
        <p>确定删除该模板吗？删除后不可恢复。</p>
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <Button onClick={() => {
            setDeleteModalVisible(false)
            setDeleteTemplate(null)
          }}>取消</Button>
          <Button type="primary" danger onClick={confirmDelete} style={{ marginLeft: 10 }}>
            确定删除
          </Button>
        </div>
      </Modal>
    </div>
  )
}
