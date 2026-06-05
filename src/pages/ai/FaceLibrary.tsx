import { Card, Form, Input, Button, Select, Table, Modal, Tag, Space, Upload, message, Row, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, UploadOutlined, EyeOutlined, UserOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import PageTitle from '../../components/PageTitle/PageTitle'

const { Option } = Select

interface Person {
  key: string
  id: string
  name: string
  employeeId: string
  department: string
  position: string
  faceLibrary: string
  faceStatus: 'registered' | 'unregistered'
  updateTime: string
  photoUrl?: string
}

export default function FaceLibrary() {
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [personList, setPersonList] = useState<Person[]>([])
  const [filteredList, setFilteredList] = useState<Person[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPerson, setCurrentPerson] = useState<Person | null>(null)
  const [previewModalVisible, setPreviewModalVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState<string>('')

  const departments = ['科研部', '实验室', '行政部', '财务部', '设备部', '人事部']
  const positions = ['研究员', '高级研究员', '技术员', '主任', '管理员', '助理']
  const faceLibraries = ['默认人脸库', '门禁人脸库', '考勤人脸库', '访客人脸库']

  const initialPersons: Person[] = Array.from({ length: 20 }, (_, i) => ({
    key: String(i + 1),
    id: `P${String(10001 + i).padStart(5, '0')}`,
    name: ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生', '周医生', '吴医生'][i % 8],
    employeeId: `EMP${String(2026001 + i).padStart(7, '0')}`,
    department: departments[i % departments.length],
    position: positions[i % positions.length],
    faceLibrary: faceLibraries[i % faceLibraries.length],
    faceStatus: i % 5 === 0 ? 'unregistered' : 'registered',
    updateTime: `2026-05-${String(1 + (i % 30)).padStart(2, '0')} ${String(8 + (i % 12)).padStart(2, '0')}:00:00`,
    photoUrl: i % 5 !== 0 ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}` : undefined,
  }))

  useEffect(() => {
    setPersonList(initialPersons)
    setFilteredList(initialPersons)
  }, [])

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    let result = [...personList]

    if (values.department && values.department !== 'all') {
      result = result.filter(item => item.department === values.department)
    }
    if (values.name) {
      result = result.filter(item => item.name.includes(values.name))
    }
    if (values.employeeId) {
      result = result.filter(item => item.employeeId.includes(values.employeeId))
    }
    if (values.status && values.status !== 'all') {
      result = result.filter(item => item.faceStatus === values.status)
    }

    setFilteredList(result)
    message.info(`搜索完成，共找到 ${result.length} 条记录`)
  }

  const handleCreate = () => {
    form.resetFields()
    setIsEditing(false)
    setCurrentPerson(null)
    setModalVisible(true)
  }

  const handleEdit = (person: Person) => {
    setCurrentPerson(person)
    setIsEditing(true)
    form.setFieldsValue({
      name: person.name,
      employeeId: person.employeeId,
      department: person.department,
    })
    setModalVisible(true)
  }

  const handleDelete = (person: Person) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定删除人员「${person.name}」吗？`,
      onOk: () => {
        setPersonList(prev => prev.filter(item => item.key !== person.key))
        setFilteredList(prev => prev.filter(item => item.key !== person.key))
        message.success('删除成功')
      },
    })
  }

  const handleUpdateFace = (person: Person) => {
    Modal.info({
      title: '更新人脸',
      content: (
        <div>
          <p>请上传新的人脸照片</p>
          <Upload.Dragger
            beforeUpload={() => false}
            fileList={[]}
            accept="image/*"
            style={{ marginTop: 16 }}
          >
            <p className="ant-upload-drag-icon">
              <UploadOutlined />
            </p>
            <p className="ant-upload-text">点击或拖拽上传人脸照片</p>
          </Upload.Dragger>
        </div>
      ),
      onOk: () => {
        setPersonList(prev => prev.map(item => item.key === person.key ? { ...item, faceStatus: 'registered', updateTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-') } : item))
        setFilteredList(prev => prev.map(item => item.key === person.key ? { ...item, faceStatus: 'registered', updateTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-') } : item))
        message.success('人脸更新成功')
      },
    })
  }

  const handleRegisterFace = (person: Person) => {
    const modal = Modal.info({
      title: '录入人脸',
      closable: true,
      content: (
        <div>
          <p>为「{person.name}」录入人脸信息</p>
          <div style={{ marginTop: 16, display: 'flex', gap: 16 }}>
            <div style={{ flex: 1 }}>
              <p style={{ marginBottom: 8, fontSize: 12, color: '#595959' }}>方式一：上传照片</p>
              <Upload.Dragger
                beforeUpload={() => false}
                fileList={[]}
                accept="image/*"
                style={{ height: 160 }}
              >
                <p className="ant-upload-text">点击或拖拽上传</p>
              </Upload.Dragger>
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ marginBottom: 8, fontSize: 12, color: '#595959' }}>方式二：摄像头采集</p>
              <div style={{ height: 160, border: '1px dashed #d9d9d9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' }}>
                <div style={{ textAlign: 'center', color: '#8C8C8C' }}>
                  <UserOutlined style={{ fontSize: 48, marginBottom: 8 }} />
                  <p>摄像头采集区域</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ),
      okText: '确认',
      cancelText: '取消',
      footer: (
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <Button onClick={() => modal.destroy()}>取消</Button>
          <Button type="primary" onClick={() => {
            setPersonList(prev => prev.map(item => item.key === person.key ? { ...item, faceStatus: 'registered', updateTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-') } : item))
            setFilteredList(prev => prev.map(item => item.key === person.key ? { ...item, faceStatus: 'registered', updateTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-') } : item))
            message.success('人脸录入成功')
            modal.destroy()
          }}>确认</Button>
        </div>
      ),
    })
  }

  const handlePreview = (person: Person) => {
    if (person.photoUrl) {
      setPreviewImage(person.photoUrl)
      setPreviewModalVisible(true)
    }
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (isEditing && currentPerson) {
        setPersonList(prev => prev.map(item => item.key === currentPerson.key ? { ...item, ...values, updateTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-') } : item))
        setFilteredList(prev => prev.map(item => item.key === currentPerson.key ? { ...item, ...values, updateTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-') } : item))
        message.success('修改成功')
      } else {
        const newPerson: Person = {
          key: String(Date.now()),
          id: `P${Date.now().toString().slice(-5)}`,
          ...values,
          faceStatus: 'unregistered',
          updateTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-'),
        }
        setPersonList(prev => [newPerson, ...prev])
        setFilteredList(prev => [newPerson, ...prev])
        message.success('新建成功')
      }
      setModalVisible(false)
      form.resetFields()
    })
  }

  const columns = [
    { title: '工号', dataIndex: 'employeeId', key: 'employeeId', width: 120 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 80 },
    { title: '所属部门', dataIndex: 'department', key: 'department', width: 100 },
    { 
      title: '录入状态', 
      dataIndex: 'faceStatus', 
      key: 'faceStatus', 
      width: 100,
      render: (status: string) => (
        <Tag color={status === 'registered' ? 'green' : 'orange'}>
          {status === 'registered' ? '已录入' : '未录入'}
        </Tag>
      )
    },
    { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 160 },
    { 
      title: '操作', 
      key: 'action', 
      width: 300,
      render: (_: any, record: Person) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" icon={<EyeOutlined />} onClick={() => handlePreview(record)} disabled={record.faceStatus !== 'registered'}>查看</Button>
          <Button type="primary" size="small" onClick={() => handleRegisterFace(record)} disabled={record.faceStatus === 'registered'}>录入</Button>
          <Button type="text" onClick={() => handleUpdateFace(record)} disabled={record.faceStatus !== 'registered'}>更新</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      )
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <PageTitle>人脸库管理</PageTitle>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal">
          <Row gutter={20} style={{ height: 32 }}>
            <Col span={6}>
              <Form.Item label="姓名/工号" name="name">
                <Input placeholder="请输入姓名或工号" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="所属部门" name="department">
                <Select placeholder="请选择">
                  <Option value="all">全部</Option>
                  {departments.map(dept => (
                    <Option key={dept} value={dept}>{dept}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="录入状态" name="status">
                <Select placeholder="请选择">
                  <Option value="all">全部</Option>
                  <Option value="registered">已录入</Option>
                  <Option value="unregistered">未录入</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button type="primary" onClick={handleSearch}>搜索</Button>
              <Button onClick={() => { searchForm.resetFields(); setFilteredList(personList) }}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 16 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start', gap: 12 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新建人员</Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredList}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条记录` }}
        />
      </Card>

      <Modal
        title={isEditing ? '编辑人员信息' : '新建人员'}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); form.resetFields() }}
        footer={null}
        width={500}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="姓名" name="name" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item label="工号" name="employeeId" rules={[{ required: true }]}>
            <Input placeholder="请输入工号" />
          </Form.Item>
          <Form.Item label="所属部门" name="department" rules={[{ required: true }]}>
            <Select placeholder="请选择部门">
              {departments.map(dept => <Option key={dept} value={dept}>{dept}</Option>)}
            </Select>
          </Form.Item>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button onClick={() => { setModalVisible(false); form.resetFields() }}>取消</Button>
            <Button type="primary" onClick={handleSubmit}>{isEditing ? '保存' : '创建'}</Button>
          </div>
        </Form>
      </Modal>

      <Modal
        title="人脸照片预览"
        open={previewModalVisible}
        onCancel={() => setPreviewModalVisible(false)}
        footer={null}
        width={400}
      >
        <div style={{ display: 'flex', justifyContent: 'center', padding: 20 }}>
          <img src={previewImage} alt="人脸照片" style={{ maxWidth: '100%', maxHeight: 300, borderRadius: 8 }} />
        </div>
      </Modal>
    </div>
  )
}