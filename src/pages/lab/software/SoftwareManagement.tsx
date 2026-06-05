import { Card, Table, Button, Space, Input, Select, Modal, Form, message, Row, Col } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../../store/themeStore'
import { useState, useEffect } from 'react'

const { Option } = Select

interface Software {
  id: string
  name: string
  purpose: string
  address: string
  category: string
  createTime: string
}

const categories = ['数据分析', '图像处理', '模拟仿真', '办公软件', '其他']

const generateMockData = (): Software[] => [
  { id: 'SW001', name: 'GraphPad Prism', purpose: '统计分析', address: 'D:\\Software\\GraphPad', category: '数据分析', createTime: '2024-01-15' },
  { id: 'SW002', name: 'ImageJ', purpose: '图像分析', address: 'C:\\Program Files\\ImageJ', category: '图像处理', createTime: '2024-02-20' },
  { id: 'SW003', name: 'MATLAB', purpose: '数值计算', address: 'D:\\MATLAB\\R2024a', category: '模拟仿真', createTime: '2024-03-05' },
  { id: 'SW004', name: 'OriginPro', purpose: '数据可视化', address: 'C:\\Origin\\2024', category: '数据分析', createTime: '2024-01-25' },
  { id: 'SW005', name: 'SPSS', purpose: '数据分析', address: 'D:\\SPSS\\29', category: '数据分析', createTime: '2024-04-10' },
  { id: 'SW006', name: 'LabVIEW', purpose: '仪器控制', address: 'C:\\LabVIEW\\2023', category: '模拟仿真', createTime: '2024-02-10' },
  { id: 'SW007', name: 'Python', purpose: '编程开发', address: 'C:\\Python\\3.11', category: '办公软件', createTime: '2024-01-05' },
  { id: 'SW008', name: 'R Studio', purpose: '统计建模', address: 'D:\\RStudio', category: '数据分析', createTime: '2024-03-20' },
  { id: 'SW009', name: 'AutoCAD', purpose: '绘图设计', address: 'C:\\AutoCAD\\2024', category: '图像处理', createTime: '2024-05-01' },
  { id: 'SW010', name: 'ChemDraw', purpose: '化学绘图', address: 'D:\\ChemDraw\\2023', category: '图像处理', createTime: '2024-04-15' },
]

const STORAGE_KEY = 'lims_software_data'

const loadData = (): Software[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch {
    console.warn('Failed to load software data from localStorage')
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(generateMockData()))
  return generateMockData()
}

const saveData = (data: Software[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export default function SoftwareManagement() {
  const { isDark } = useThemeStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增软件')
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [softwareList, setSoftwareList] = useState<Software[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setSoftwareList(loadData())
  }, [])

  const columns = [
    { title: '软件名称', dataIndex: 'name', key: 'name' },
    { title: '用途', dataIndex: 'purpose', key: 'purpose' },
    { title: '软件地址', dataIndex: 'address', key: 'address' },
    { title: '分类', dataIndex: 'category', key: 'category' },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
    { title: '操作', key: 'action', fixed: 'right' as const, width: 140, render: (_: unknown, record: Software) => (
      <div style={{ display: 'flex', gap: 8 }}>
        <Button type="text" onClick={() => handleEdit(record)}>编辑</Button>
        <Button type="text" style={{ color: '#FF4D4F' }} onClick={() => handleDelete(record)}>删除</Button>
      </div>
    )},
  ]

  const filteredData = softwareList.filter(item => {
    const values = searchForm.getFieldsValue() as Record<string, string>
    if (values.name && !item.name.includes(values.name)) return false
    if (values.category && item.category !== values.category) return false
    return true
  })

  const handleCreate = () => {
    setModalTitle('新增软件')
    form.resetFields()
    setIsModalVisible(true)
  }

  const [editRecord, setEditRecord] = useState<Software | null>(null)

  useEffect(() => {
    if (editRecord && isModalVisible) {
      form.resetFields()
      setTimeout(() => {
        form.setFieldsValue(editRecord)
      }, 100)
    }
  }, [editRecord, isModalVisible, form])

  const handleEdit = (record: Software) => {
    setModalTitle('编辑软件')
    setEditRecord(record)
    setIsModalVisible(true)
  }

  const handleDelete = (record: Software) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定删除软件【${record.name}】吗？删除后不可恢复。`,
      onOk: () => {
        setLoading(true)
        setTimeout(() => {
          const updated = softwareList.filter(item => item.id !== record.id)
          setSoftwareList(updated)
          saveData(updated)
          message.success('删除成功')
          setLoading(false)
        }, 300)
      },
    })
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      setLoading(true)
      setTimeout(() => {
        const now = new Date().toISOString().split('T')[0]
        if (editRecord) {
          const updated = softwareList.map(item => 
            item.id === editRecord.id 
              ? { ...values, id: item.id, createTime: item.createTime } 
              : item
          )
          setSoftwareList(updated)
          saveData(updated)
          message.success('修改成功')
        } else {
          const newId = `SW${String(softwareList.length + 1).padStart(3, '0')}`
          const newItem: Software = { ...values, id: newId, createTime: now } as Software
          const updated = [...softwareList, newItem]
          setSoftwareList(updated)
          saveData(updated)
          message.success('新增成功')
        }
        setIsModalVisible(false)
        setEditRecord(null)
        setLoading(false)
      }, 300)
    })
  }

  const handleSearch = () => {
    message.info('搜索条件已应用')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>软件管理</h1>
      
      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16} style={{ height: 32 }}>
            <Col span={8}>
              <Form.Item label="软件名称" name="name"><Input placeholder="请输入软件名称" /></Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="分类" name="category">
                <Select placeholder="请选择分类">
                  {categories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button type="primary" onClick={handleSearch}>查询</Button>
              <Button onClick={() => searchForm.resetFields()} className="reset-btn">重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增软件</Button>
          </Space>
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredData}
          scroll={{ x: 'max-content' }}
          loading={loading}
        />
      </Card>

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          setIsModalVisible(false)
          setEditRecord(null)
        }}
        width={500}
        confirmLoading={loading}
      >
        <Form 
          form={form} 
          layout="vertical"
        >
          <Form.Item label="软件名称" name="name" rules={[{ required: true, message: '请输入软件名称' }]}>
            <Input placeholder="请输入软件名称" />
          </Form.Item>
          <Form.Item label="用途" name="purpose" rules={[{ required: true, message: '请输入用途' }]}>
            <Input placeholder="请输入用途" />
          </Form.Item>
          <Form.Item label="软件地址" name="address" rules={[{ required: true, message: '请输入软件地址' }]}>
            <Input placeholder="请输入软件地址" />
          </Form.Item>
          <Form.Item label="分类" name="category" rules={[{ required: true, message: '请选择分类' }]}>
            <Select placeholder="请选择分类">
              {categories.map(cat => <Option key={cat} value={cat}>{cat}</Option>)}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}