import { Card, Form, Input, Button, Select, Table, Tag, Space, Modal, message, Row, Col, Checkbox } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, SaveOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import PageTitle from '../../components/PageTitle/PageTitle'

const { Option } = Select

interface AccessPermission {
  key: string
  id: string
  department: string
  name: string
  employeeId: string
  areas: string[]
  status: 'active' | 'inactive'
  createTime: string
}

interface Employee {
  key: string
  name: string
  employeeId: string
  department: string
}

export default function AccessControl() {
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [permissionList, setPermissionList] = useState<AccessPermission[]>([])
  const [filteredList, setFilteredList] = useState<AccessPermission[]>([])
  const [modalVisible, setModalVisible] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [currentPermission, setCurrentPermission] = useState<AccessPermission | null>(null)

  const departments = ['科研部', '实验室', '行政部', '财务部', '设备部', '人事部']
  const areas = ['A区-研发实验室', 'B区-办公区', 'C区-仓库', 'D区-会议室', 'E区-接待区', 'F区-机房']

  const employees: Employee[] = [
    { key: '1', name: '张医生', employeeId: 'EMP2026001', department: '科研部' },
    { key: '2', name: '李医生', employeeId: 'EMP2026002', department: '实验室' },
    { key: '3', name: '王医生', employeeId: 'EMP2026003', department: '行政部' },
    { key: '4', name: '赵医生', employeeId: 'EMP2026004', department: '财务部' },
    { key: '5', name: '钱医生', employeeId: 'EMP2026005', department: '设备部' },
    { key: '6', name: '孙医生', employeeId: 'EMP2026006', department: '人事部' },
    { key: '7', name: '周医生', employeeId: 'EMP2026007', department: '科研部' },
    { key: '8', name: '吴医生', employeeId: 'EMP2026008', department: '实验室' },
  ]

  const initialPermissions: AccessPermission[] = [
    {
      key: '1',
      id: 'AP00001',
      department: '科研部',
      name: '张医生',
      employeeId: 'EMP2026001',
      areas: ['A区-研发实验室', 'B区-办公区'],
      status: 'active',
      createTime: '2026-05-01 09:00:00',
    },
    {
      key: '2',
      id: 'AP00002',
      department: '实验室',
      name: '李医生',
      employeeId: 'EMP2026002',
      areas: ['A区-研发实验室', 'C区-仓库'],
      status: 'active',
      createTime: '2026-05-02 10:30:00',
    },
    {
      key: '3',
      id: 'AP00003',
      department: '行政部',
      name: '王医生',
      employeeId: 'EMP2026003',
      areas: ['B区-办公区', 'D区-会议室', 'E区-接待区'],
      status: 'active',
      createTime: '2026-05-03 14:00:00',
    },
    {
      key: '4',
      id: 'AP00004',
      department: '设备部',
      name: '钱医生',
      employeeId: 'EMP2026005',
      areas: ['C区-仓库', 'F区-机房'],
      status: 'inactive',
      createTime: '2026-05-05 11:00:00',
    },
  ]

  useEffect(() => {
    setPermissionList(initialPermissions)
    setFilteredList(initialPermissions)
  }, [])

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    let result = [...permissionList]

    if (values.department && values.department !== 'all') {
      result = result.filter(item => item.department === values.department)
    }
    if (values.name) {
      result = result.filter(item => item.name.includes(values.name) || item.employeeId.includes(values.name))
    }
    if (values.status && values.status !== 'all') {
      result = result.filter(item => item.status === values.status)
    }

    setFilteredList(result)
    message.info(`搜索完成，共找到 ${result.length} 条记录`)
  }

  const handleCreate = () => {
    form.resetFields()
    setIsEditing(false)
    setCurrentPermission(null)
    setModalVisible(true)
  }

  const handleEdit = (permission: AccessPermission) => {
    setCurrentPermission(permission)
    setIsEditing(true)
    form.setFieldsValue({
      department: permission.department,
      employeeId: permission.employeeId,
      areas: permission.areas,
      status: permission.status,
    })
    setModalVisible(true)
  }

  const handleDelete = (permission: AccessPermission) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定删除「${permission.name}」的门禁授权吗？`,
      onOk: () => {
        setPermissionList(prev => prev.filter(item => item.key !== permission.key))
        setFilteredList(prev => prev.filter(item => item.key !== permission.key))
        message.success('删除成功')
      },
    })
  }

  const handleSubmit = () => {
    form.validateFields().then(values => {
      if (isEditing && currentPermission) {
        const employee = employees.find(e => e.employeeId === values.employeeId)
        setPermissionList(prev => prev.map(item => item.key === currentPermission.key ? {
          ...item,
          ...values,
          name: employee?.name || item.name,
          department: employee?.department || item.department,
        } : item))
        setFilteredList(prev => prev.map(item => item.key === currentPermission.key ? {
          ...item,
          ...values,
          name: employee?.name || item.name,
          department: employee?.department || item.department,
        } : item))
        message.success('修改成功')
      } else {
        const employee = employees.find(e => e.employeeId === values.employeeId)
        const newPermission: AccessPermission = {
          key: String(Date.now()),
          id: `AP${String(Date.now()).slice(-5)}`,
          ...values,
          name: employee?.name || '',
          department: employee?.department || '',
          createTime: new Date().toLocaleString('zh-CN').replace(/\//g, '-'),
        }
        setPermissionList(prev => [newPermission, ...prev])
        setFilteredList(prev => [newPermission, ...prev])
        message.success('创建成功')
      }
      setModalVisible(false)
      form.resetFields()
    })
  }

  const handleDepartmentChange = (value: string) => {
    form.setFieldsValue({ employeeId: undefined })
  }

  const filteredEmployees = (department: string) => {
    if (!department || department === 'all') return employees
    return employees.filter(e => e.department === department)
  }

  const columns = [
    { title: '部门', dataIndex: 'department', key: 'department', width: 100 },
    { title: '工号', dataIndex: 'employeeId', key: 'employeeId', width: 120 },
    { title: '姓名', dataIndex: 'name', key: 'name', width: 80 },
    { 
      title: '授权区域', 
      dataIndex: 'areas', 
      key: 'areas', 
      width: 250,
      render: (areas: string[]) => (
        <Space wrap>
          {areas.map((area, index) => (
            <Tag key={index} color="blue">{area}</Tag>
          ))}
        </Space>
      )
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 80,
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? '生效中' : '已停用'}
        </Tag>
      )
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
    { 
      title: '操作', 
      key: 'action', 
      width: 160,
      render: (_: any, record: AccessPermission) => (
        <Space size="small">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      )
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <PageTitle>授权管理</PageTitle>

      <Card style={{ borderRadius: 10 }} styles={{ body: { padding: 20 } }}>
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
              <Form.Item label="授权状态" name="status">
                <Select placeholder="请选择">
                  <Option value="all">全部</Option>
                  <Option value="active">生效中</Option>
                  <Option value="inactive">已停用</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button type="primary" onClick={handleSearch}>搜索</Button>
              <Button onClick={() => { searchForm.resetFields(); setFilteredList(permissionList) }}>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} styles={{ body: { padding: 20 } }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>新增授权</Button>
        </div>
        <Table
          columns={columns}
          dataSource={filteredList}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (total) => `共 ${total} 条记录` }}
        />
      </Card>

      <Modal
        title={isEditing ? '编辑授权' : '新增授权'}
        open={modalVisible}
        onCancel={() => { setModalVisible(false); form.resetFields() }}
        footer={null}
        width={500}
        styles={{ body: { padding: 24 } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="部门" name="department" rules={[{ required: true }]}>
            <Select placeholder="请选择部门" onChange={handleDepartmentChange}>
              {departments.map(dept => <Option key={dept} value={dept}>{dept}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item label="人员" name="employeeId" rules={[{ required: true }]}>
            <Select placeholder="请选择人员">
              {filteredEmployees(form.getFieldValue('department')).map(emp => (
                <Option key={emp.employeeId} value={emp.employeeId}>
                  {emp.name} ({emp.employeeId})
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="授权区域" name="areas" rules={[{ required: true }]}>
            <Checkbox.Group options={areas} />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue="active">
            <Select placeholder="请选择状态">
              <Option value="active">生效中</Option>
              <Option value="inactive">已停用</Option>
            </Select>
          </Form.Item>
          <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button onClick={() => { setModalVisible(false); form.resetFields() }}>取消</Button>
            <Button type="primary" onClick={handleSubmit} icon={<SaveOutlined />}>保存</Button>
          </div>
        </Form>
      </Modal>
    </div>
  )
}