import { Card, Form, Input, Button, Table, Space, Tag, message, DatePicker, Select, Modal, Avatar, Checkbox, Divider, Col } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UserOutlined, SettingOutlined, CheckOutlined, XOutlined } from '@ant-design/icons'
import { useState } from 'react'
import SearchForm from '../../components/SearchForm/SearchForm'
import PageTitle from '../../components/PageTitle/PageTitle'

const { Option } = Select
const { TextArea } = Input

export default function MemberManagement() {
  const [searchForm] = Form.useForm()
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [addForm] = Form.useForm()
  const [editForm] = Form.useForm()
  const [selectedMember, setSelectedMember] = useState<any>(null)
  const [selectedProject, setSelectedProject] = useState('PRJ2026001')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [tableData, setTableData] = useState(Array.from({ length: 100 }, (_, i) => {
    const roles = ['项目负责人', '核心成员', '共同负责人', '学生', '顾问', '技术专家']
    const departments = ['肿瘤内科', '放疗科', '病理科', '检验科', '影像科', '外科', 'ICU', '药剂科', '医学院', '数据中心']
    const permissions = ['全部', '部分', '只读']
    const divisions = ['负责项目整体规划和协调', '负责临床数据收集和分析', '负责病理样本检测', '协助数据录入和整理', '提供技术支持', '负责数据统计分析', '负责论文撰写', '负责设备维护']
    return {
      key: String(i + 1),
      name: ['张医生', '李医生', '王医生', '赵医生', '钱医生', '孙医生', '周医生', '吴医生', '郑医生', '陈医生'][i % 10],
      department: departments[i % departments.length],
      role: roles[i % roles.length],
      division: divisions[i % divisions.length],
      permission: permissions[i % permissions.length],
      joinDate: `2026-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')}`,
    }
  }))

  const columns = [
    { 
      title: '姓名', 
      dataIndex: 'name', 
      key: 'name', 
    },
    { title: '所属单位', dataIndex: 'department', key: 'department' },
    { 
      title: '角色', 
      dataIndex: 'role', 
      key: 'role',
      render: (role: string) => {
        const colorMap: Record<string, string> = {
          '项目负责人': 'red',
          '共同负责人': 'orange',
          '核心成员': 'blue',
          '参与成员': 'cyan',
          '顾问': 'purple',
          '学生': 'green',
        }
        return <Tag color={colorMap[role]}>{role}</Tag>
      }
    },
    { title: '分工描述', dataIndex: 'division', key: 'division' },
    { 
      title: '数据权限', 
      dataIndex: 'permission', 
      key: 'permission',
      render: (permission: string) => <Tag color={permission === '全部' ? 'green' : permission === '部分' ? 'blue' : 'default'}>{permission}</Tag>
    },
    { title: '加入时间', dataIndex: 'joinDate', key: 'joinDate' },
    {
      title: '操作',
      key: 'action',
      width: 240,
      fixed: 'right' as const,
      render: (_: unknown, record: { key: string; name: string; role: string; department: string; permission: string; joinDate: string }) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" icon={<SettingOutlined />} onClick={() => handleSetPermission(record)}>设置权限</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ]

  const permissionModules = [
    { name: '项目基本信息', permissions: ['查看', '编辑', '无权限'] },
    { name: '进度管理', permissions: ['查看', '编辑', '审批', '无权限'] },
    { name: '经费管理', permissions: ['查看', '编辑', '审批', '无权限'] },
    { name: '成果管理', permissions: ['查看', '上传', '编辑', '删除', '无权限'] },
    { name: '成员管理', permissions: ['查看', '编辑', '无权限'] },
    { name: '附件管理', permissions: ['查看', '上传', '下载', '删除', '无权限'] },
  ]

  const handleEdit = (record: any) => {
    setSelectedMember(record)
    editForm.setFieldsValue({
      role: record.role,
      division: record.division,
    })
    setShowEditModal(true)
  }

  const handleSetPermission = (record: any) => {
    setSelectedMember(record)
    setShowPermissionModal(true)
  }

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认移除',
      content: `确定将【${record.name}】从项目中移除吗？`,
      onOk: () => {
        setTableData(prevData => prevData.filter(item => item.key !== record.key))
        message.success('成员已移除')
      }
    })
  }

  const handleAdd = () => {
    addForm.resetFields()
    setShowAddModal(true)
  }

  const handleSaveAdd = () => {
    addForm.validateFields().then(values => {
      const newMember = {
        key: String(Date.now()),
        name: values.name || '未知成员',
        department: '肿瘤内科',
        role: values.role || '参与成员',
        division: values.division || '',
        permission: '全部',
        joinDate: values.joinDate || new Date().toISOString().split('T')[0],
      }
      setTableData(prevData => [newMember, ...prevData])
      message.success('成员添加成功')
      setShowAddModal(false)
      addForm.resetFields()
    }).catch(() => {
      message.error('请填写必填项')
    })
  }

  const handleSaveEdit = () => {
    editForm.validateFields().then(values => {
      if (selectedMember) {
        setTableData(prevData =>
          prevData.map(item =>
            item.key === selectedMember.key
              ? { ...item, role: values.role, division: values.division }
              : item
          )
        )
        message.success('成员信息已更新')
      }
      setShowEditModal(false)
      editForm.resetFields()
    }).catch(() => {
      message.error('请填写必填项')
    })
  }

  const handleSavePermission = () => {
    message.success('权限设置成功')
    setShowPermissionModal(false)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <PageTitle>成员管理</PageTitle>

      <SearchForm 
        onSearch={() => {}}
        onReset={() => searchForm.resetFields()}
      >
        <Col span={6}>
          <Form.Item label="项目名称" name="project">
            <Select 
              placeholder="请选择项目"
              value={selectedProject}
              onChange={(value) => setSelectedProject(value)}
            >
              <Option value="PRJ2026001">肺癌早期诊断研究</Option>
              <Option value="PRJ2026002">肿瘤免疫治疗临床研究</Option>
              <Option value="PRJ2026003">基因检测技术研究</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="成员姓名" name="name"><Input placeholder="请输入姓名" /></Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="角色" name="role">
            <Select placeholder="请选择角色">
              <Option value="all">全部</Option>
              <Option value="leader">项目负责人</Option>
              <Option value="co-leader">共同负责人</Option>
              <Option value="core">核心成员</Option>
              <Option value="participant">参与成员</Option>
              <Option value="consultant">顾问</Option>
              <Option value="student">学生</Option>
            </Select>
          </Form.Item>
        </Col>
      </SearchForm>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={handleAdd}>
          添加成员
        </Button>
        <Table 
          columns={columns} 
          dataSource={tableData}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
        />
      </Card>

      <Modal
        title="添加成员"
        open={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
        width={500}
      >
        <Form form={addForm} layout="vertical">
          <Form.Item label="项目名称">
            <Input disabled value="肺癌早期诊断研究" />
          </Form.Item>
          <Form.Item label="成员姓名" name="name" rules={[{ required: true }]}>
            <Select placeholder="请选择成员">
              <Option value="张医生">张医生</Option>
              <Option value="李医生">李医生</Option>
              <Option value="王医生">王医生</Option>
              <Option value="赵医生">赵医生</Option>
            </Select>
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Select placeholder="请选择角色">
              <Option value="项目负责人">项目负责人</Option>
              <Option value="共同负责人">共同负责人</Option>
              <Option value="核心成员">核心成员</Option>
              <Option value="参与成员">参与成员</Option>
              <Option value="顾问">顾问</Option>
              <Option value="学生">学生</Option>
            </Select>
          </Form.Item>
          <Form.Item label="分工描述" name="division" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入分工描述" />
          </Form.Item>
          <Form.Item label="加入时间" name="joinDate">
            <DatePicker style={{ width: '100%' }} valueFormat="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSaveAdd} icon={<CheckOutlined />}>确定</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setShowAddModal(false)} icon={<XOutlined />}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑成员"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        width={500}
      >
        <Form form={editForm} layout="vertical">
          <Form.Item label="项目名称">
            <Input disabled value="肺癌早期诊断研究" />
          </Form.Item>
          <Form.Item label="成员姓名">
            <Input disabled value={selectedMember?.name} />
          </Form.Item>
          <Form.Item label="角色" name="role" rules={[{ required: true }]}>
            <Select placeholder="请选择角色">
              <Option value="项目负责人">项目负责人</Option>
              <Option value="共同负责人">共同负责人</Option>
              <Option value="核心成员">核心成员</Option>
              <Option value="参与成员">参与成员</Option>
              <Option value="顾问">顾问</Option>
              <Option value="学生">学生</Option>
            </Select>
          </Form.Item>
          <Form.Item label="分工描述" name="division" rules={[{ required: true }]}>
            <TextArea rows={3} placeholder="请输入分工描述" />
          </Form.Item>
          <Form.Item label="加入时间">
            <Input disabled value={selectedMember?.joinDate} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <TextArea rows={2} placeholder="请输入备注" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" onClick={handleSaveEdit} icon={<CheckOutlined />}>确定</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setShowEditModal(false)} icon={<XOutlined />}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="设置权限"
        open={showPermissionModal}
        onCancel={() => setShowPermissionModal(false)}
        footer={null}
        width={700}
      >
        <div style={{ padding: 0 }}>
          <div style={{ marginBottom: 20 }}>
            <h3 style={{ marginBottom: 8 }}>成员信息</h3>
            <div><strong>姓名：</strong>{selectedMember?.name}</div>
            <div><strong>角色：</strong>{selectedMember?.role}</div>
          </div>

          <Divider />

          <h3 style={{ marginBottom: 16 }}>权限设置</h3>
          <Table
            dataSource={permissionModules}
            columns={[
              { title: '模块', dataIndex: 'name', key: 'name' },
              { 
                title: '权限', 
                dataIndex: 'permissions', 
                key: 'permissions',
                render: (permissions: string[]) => (
                  <Checkbox.Group options={permissions} />
                )
              },
            ]}
            pagination={false}
          />

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" onClick={handleSavePermission} icon={<CheckOutlined />}>保存</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setShowPermissionModal(false)} icon={<XOutlined />}>取消</Button>
          </Form.Item>
        </div>
      </Modal>
    </div>
  )
}