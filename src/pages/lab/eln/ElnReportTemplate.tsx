import { Card, Table, Form, Select, Input, Button, Tag, Space, Modal, Upload, message } from 'antd'
import { useState } from 'react'
import { EditOutlined, CopyOutlined, DeleteOutlined, EyeOutlined, CheckOutlined, UploadOutlined, PlusOutlined } from '@ant-design/icons'
import PageTitle from '../../../components/PageTitle/PageTitle'
import ReportTemplateSearchForm from '../../../components/SearchForm/ReportTemplateSearchForm'

const { Option } = Select
const { TextArea } = Input

interface ReportTemplate {
  key: string
  id: string
  name: string
  thumbnail: string
  isDefault: boolean
  status: string
  creator: string
  createTime: string
  description?: string
  headerContent?: string
  footerContent?: string
}

export default function ElnReportTemplate() {
  const [searchParams, setSearchParams] = useState({
    name: '',
    status: '',
    creator: '',
  })
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [previewModalVisible, setPreviewModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<ReportTemplate | null>(null)
  const [form] = Form.useForm()
  const [importForm] = Form.useForm()

  const generateInitialData = (): ReportTemplate[] => {
    const data: ReportTemplate[] = []
    const creators = ['张医生', '李医生', '王医生', '赵医生']
    const statuses = ['启用', '禁用']
    
    for (let i = 1; i <= 50; i++) {
      data.push({
        key: String(i),
        id: `RT${String(i).padStart(4, '0')}`,
        name: `实验报告模板${i}`,
        thumbnail: '',
        isDefault: i === 1,
        status: statuses[i % statuses.length],
        creator: creators[i % creators.length],
        createTime: `2026-05-${String(Math.floor(Math.random() * 25) + 1).padStart(2, '0')}`,
        description: `这是实验报告模板${i}的说明文档`,
        headerContent: 'XX省肿瘤医院病理科',
        footerContent: '第 1 页，共 1 页 | XX省肿瘤医院病理科',
      })
    }
    return data
  }

  const [tableData, setTableData] = useState<ReportTemplate[]>(generateInitialData())

  const filteredData = tableData.filter(item => {
    const matchName = !searchParams.name || item.name.toLowerCase().includes(searchParams.name.toLowerCase())
    const matchStatus = !searchParams.status || item.status === searchParams.status
    const matchCreator = !searchParams.creator || item.creator.toLowerCase().includes(searchParams.creator.toLowerCase())
    return matchName && matchStatus && matchCreator
  })

  const handleSearch = () => {
    message.info('搜索条件已应用')
  }

  const handleReset = () => {
    setSearchParams({ name: '', status: '', creator: '' })
  }

  const handleCreate = () => {
    form.resetFields()
    setCreateModalVisible(true)
  }

  const handleEdit = (record: ReportTemplate) => {
    setCurrentTemplate(record)
    form.setFieldsValue({
      name: record.name,
      status: record.status,
      description: record.description || '',
      headerContent: record.headerContent || '',
      footerContent: record.footerContent || '',
    })
    setEditModalVisible(true)
  }

  const handleCopy = (record: ReportTemplate) => {
    const newTemplate: ReportTemplate = {
      ...record,
      key: String(Date.now()),
      id: `RT${String(tableData.length + 1).padStart(4, '0')}`,
      name: `${record.name}(副本)`,
      isDefault: false,
      createTime: new Date().toISOString().split('T')[0],
    }
    setTableData([newTemplate, ...tableData])
    message.success(`已复制模板: ${record.name}`)
  }

  const handleDelete = (record: ReportTemplate) => {
    if (record.isDefault) {
      message.warning('默认模板不能删除，请先将其他模板设为默认')
      return
    }
    setCurrentTemplate(record)
    setDeleteModalVisible(true)
  }

  const confirmDelete = () => {
    if (currentTemplate) {
      setTableData(tableData.filter(item => item.key !== currentTemplate.key))
      message.success(`已删除模板: ${currentTemplate.name}`)
    }
    setDeleteModalVisible(false)
    setCurrentTemplate(null)
  }

  const handleSetDefault = (record: ReportTemplate) => {
    if (record.isDefault) {
      message.info('该模板已经是默认模板')
      return
    }
    setTableData(tableData.map(item => ({
      ...item,
      isDefault: item.key === record.key
    })))
    message.success(`已将 ${record.name} 设置为默认模板`)
  }

  const handlePreview = (record: ReportTemplate) => {
    setCurrentTemplate(record)
    setPreviewModalVisible(true)
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (currentTemplate) {
        setTableData(tableData.map(item => 
          item.key === currentTemplate.key 
            ? { ...item, ...values, key: item.key, id: item.id, thumbnail: item.thumbnail, isDefault: item.isDefault, creator: item.creator, createTime: item.createTime }
            : item
        ))
        message.success('模板编辑成功')
      } else {
        const newTemplate: ReportTemplate = {
          key: String(Date.now()),
          id: `RT${String(tableData.length + 1).padStart(4, '0')}`,
          name: values.name,
          thumbnail: '',
          isDefault: false,
          status: values.status,
          creator: '当前用户',
          createTime: new Date().toISOString().split('T')[0],
          description: values.description,
          headerContent: values.headerContent,
          footerContent: values.footerContent,
        }
        setTableData([newTemplate, ...tableData])
        message.success('模板新增成功')
      }
      setCreateModalVisible(false)
      setEditModalVisible(false)
      setCurrentTemplate(null)
      form.resetFields()
    }).catch(errorInfo => {
      message.error('表单验证失败，请检查必填项')
    })
  }

  const handleImport = () => {
    importForm.resetFields()
    setImportModalVisible(true)
  }

  const handleImportSubmit = () => {
    importForm.validateFields().then(values => {
      const newTemplate: ReportTemplate = {
        key: String(Date.now()),
        id: `RT${String(tableData.length + 1).padStart(4, '0')}`,
        name: values.name,
        thumbnail: '',
        isDefault: false,
        status: values.status || '启用',
        creator: '当前用户',
        createTime: new Date().toISOString().split('T')[0],
        description: '',
        headerContent: '',
        footerContent: '',
      }
      setTableData([newTemplate, ...tableData])
      message.success('模板导入成功')
      setImportModalVisible(false)
      importForm.resetFields()
    }).catch(errorInfo => {
      message.error('表单验证失败，请检查必填项')
    })
  }

  const columns = [
    { title: '模板ID', dataIndex: 'id', key: 'id', width: 120 },
    { 
      title: '预览', 
      dataIndex: 'thumbnail', 
      key: 'thumbnail', 
      width: 100,
      render: () => (
        <div style={{ width: 80, height: 100, backgroundColor: '#f5f5f5', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#999' }}>预览图</span>
        </div>
      )
    },
    { title: '模板名称', dataIndex: 'name', key: 'name', width: 200 },
    { 
      title: '是否默认', 
      dataIndex: 'isDefault', 
      key: 'isDefault', 
      width: 100,
      render: (isDefault: boolean) => (
        <Tag color={isDefault ? 'green' : 'gray'}>
          {isDefault ? '是' : '否'}
        </Tag>
      )
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 100,
      render: (status: string) => (
        <Tag color={status === '启用' ? 'green' : 'red'}>
          {status}
        </Tag>
      )
    },
    { title: '创建人', dataIndex: 'creator', key: 'creator', width: 120 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 140 },
    { 
      title: '操作', 
      key: 'action', 
      width: 280,
      fixed: 'right' as const,
      render: (_: any, record: ReportTemplate) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handlePreview(record)}>预览</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" icon={<CopyOutlined />} onClick={() => handleCopy(record)}>复制</Button>
          {!record.isDefault && (
            <Button type="text" icon={<CheckOutlined />} onClick={() => handleSetDefault(record)}>设为默认</Button>
          )}
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      )
    },
  ]

  return (
    <div>
      <PageTitle>报告模板管理</PageTitle>

      <Card style={{ borderRadius: 10, marginBottom: 16, marginTop: 20 }} bodyStyle={{ padding: 20 }}>
        <ReportTemplateSearchForm 
          searchParams={searchParams}
          onSearchParamsChange={setSearchParams}
          onSearch={handleSearch}
          onReset={handleReset}
        />
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: 16 }}>
          <Space>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增模板</Button>
            <Button icon={<UploadOutlined />} onClick={handleImport}>导入模板</Button>
          </Space>
        </div>

        <Table 
          columns={columns} 
          dataSource={filteredData} 
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true, showTotal: (total) => `共 ${total} 条记录` }}
          scroll={{ x: 1400 }}
          rowKey="key"
        />
      </Card>

      <Modal
        title={currentTemplate ? '编辑模板' : '新增模板'}
        open={createModalVisible || editModalVisible}
        onCancel={() => {
          setCreateModalVisible(false)
          setEditModalVisible(false)
          setCurrentTemplate(null)
          form.resetFields()
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item label="模板名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item label="状态" name="status" rules={[{ required: true, message: '请选择状态' }]}>
            <Select placeholder="请选择状态">
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item label="模板说明" name="description">
            <TextArea rows={3} placeholder="请输入模板说明" />
          </Form.Item>
          <Form.Item label="封面设置">
            <Upload.Dragger accept=".png,.jpg,.jpeg">
              <p className="ant-upload-text">点击或拖拽上传封面图片</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="页眉内容" name="headerContent">
            <Input placeholder="请输入页眉内容" />
          </Form.Item>
          <Form.Item label="页脚内容" name="footerContent">
            <Input placeholder="请输入页脚内容" />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => {
                setCreateModalVisible(false)
                setEditModalVisible(false)
                setCurrentTemplate(null)
                form.resetFields()
              }}>取消</Button>
              <Button type="primary" htmlType="submit">{currentTemplate ? '保存修改' : '保存'}</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`预览: ${currentTemplate?.name}`}
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={null}
        width={800}
      >
        <div style={{ padding: 40, backgroundColor: '#fff', minHeight: 400 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <h1 style={{ fontSize: 20, fontWeight: 'bold' }}>{currentTemplate?.name || '实验报告'}</h1>
            <p style={{ color: '#666', marginTop: 8 }}>{currentTemplate?.headerContent || 'XX省肿瘤医院病理科'}</p>
          </div>
          <div style={{ borderTop: '1px solid #ddd', paddingTop: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16 }}>一、实验目的</h2>
            <p style={{ lineHeight: '1.8', color: '#333' }}>
              本实验旨在研究XXX的相关特性，通过XXX方法进行实验，获取相关数据并进行分析。
            </p>
            <h2 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, marginTop: 20 }}>二、实验材料与方法</h2>
            <p style={{ lineHeight: '1.8', color: '#333' }}>
              实验材料包括XXX、XXX等，实验方法参照XXX标准操作规程进行。
            </p>
            <h2 style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 16, marginTop: 20 }}>三、实验结果</h2>
            <p style={{ lineHeight: '1.8', color: '#333' }}>
              实验结果表明XXX，详见下表所示。
            </p>
          </div>
          <div style={{ borderTop: '1px solid #ddd', paddingTop: 10, marginTop: 30, textAlign: 'center', fontSize: 12, color: '#999' }}>
            {currentTemplate?.footerContent || '第 1 页，共 1 页 | XX省肿瘤医院病理科'}
          </div>
        </div>
      </Modal>

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false)
          setCurrentTemplate(null)
        }}
        footer={null}
      >
        <p>确定删除模板「{currentTemplate?.name}」吗？删除后不可恢复。</p>
        <Space style={{ marginTop: 20 }}>
          <Button onClick={() => {
            setDeleteModalVisible(false)
            setCurrentTemplate(null)
          }}>取消</Button>
          <Button type="primary" danger onClick={confirmDelete}>确认删除</Button>
        </Space>
      </Modal>

      <Modal
        title="导入模板"
        open={importModalVisible}
        onCancel={() => {
          setImportModalVisible(false)
          importForm.resetFields()
        }}
        footer={null}
        width={500}
      >
        <Form form={importForm} layout="vertical">
          <Form.Item label="模板文件">
            <Upload.Dragger accept=".zip,.json">
              <p className="ant-upload-text">点击或拖拽上传模板文件</p>
              <p className="ant-upload-hint">支持 .zip 和 .json 格式的模板文件</p>
            </Upload.Dragger>
          </Form.Item>
          <Form.Item label="模板名称" name="name" rules={[{ required: true, message: '请输入模板名称' }]}>
            <Input placeholder="请输入模板名称" />
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Select placeholder="请选择状态" defaultValue="启用">
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Space>
              <Button onClick={() => {
                setImportModalVisible(false)
                importForm.resetFields()
              }}>取消</Button>
              <Button type="primary" htmlType="submit" onClick={handleImportSubmit}>导入</Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}