import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Row, Col, DatePicker, Checkbox } from 'antd'
import { PlusOutlined, EyeOutlined, DeleteOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'
import { useState } from 'react'

const { Option } = Select
const { RangePicker } = DatePicker

export default function KnowledgePermission() {
  const { isDark } = useThemeStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增权限策略')
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()

  const handleCreate = () => {
    setModalTitle('新增权限策略')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('表单数据:', values)
      message.success('保存成功')
      setIsModalVisible(false)
    })
  }

  const columns = [
    { title: '策略名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { 
      title: '策略类型', 
      dataIndex: 'type', 
      key: 'type', 
      width: 140,
      render: (val: string) => {
        const color = val === '全局权限' ? 'green' : val === '分类级权限' ? 'blue' : 'orange'
        return <Tag color={color}>{val}</Tag>
      }
    },
    { 
      title: '授权对象类型', 
      dataIndex: 'objectType', 
      key: 'objectType', 
      width: 120,
      render: (val: string) => <Tag color="gray">{val}</Tag>
    },
    { title: '授权对象名称', dataIndex: 'objectName', key: 'objectName', width: 150 },
    { title: '授予权限', dataIndex: 'permissions', key: 'permissions', width: 180, render: (perms: string[]) => perms.map((p, i) => <Tag key={i}>{p}</Tag>) },
    { title: '生效时间范围', dataIndex: 'timeRange', key: 'timeRange', width: 160 },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 80,
      render: (status: string) => <Tag color={status === '启用' ? 'green' : 'default'}>{status}</Tag>
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EyeOutlined />}>编辑</Button>
          <Button type="text" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ]

  const data = Array.from({ length: 15 }, (_, i) => ({
    key: String(i + 1),
    name: [`管理员全局权限`, '普通用户权限', '访客只读权限', '编辑员权限', '部门A权限'][i % 5],
    type: ['全局权限', '分类级权限', '单知识权限'][i % 3],
    objectType: ['角色', '用户', '部门'][i % 3],
    objectName: ['管理员', '张三', '研发部', '访客', '编辑员'][i % 5],
    permissions: [['查看', '下载', '编辑', '删除'], ['查看', '下载'], ['查看'], ['查看', '下载', '编辑']][i % 4],
    timeRange: i % 3 === 0 ? '长期有效' : `2024-01-01 ~ 2024-12-31`,
    status: i % 5 === 0 ? '禁用' : '启用',
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        权限控制
      </h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal">
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item label="策略名称" name="name">
                <Input placeholder="请输入策略名称" />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="策略类型" name="type">
                <Select placeholder="请选择">
                  <Option value="all">全部</Option>
                  <Option value="global">全局权限</Option>
                  <Option value="category">分类级权限</Option>
                  <Option value="single">单知识权限</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="授权对象类型" name="objectType">
                <Select placeholder="请选择">
                  <Option value="all">全部</Option>
                  <Option value="user">用户</Option>
                  <Option value="role">角色</Option>
                  <Option value="department">部门</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={6} style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button type="primary">查询</Button>
              <Button>重置</Button>
            </Col>
          </Row>
        </Form>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新增权限策略
          </Button>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          scroll={{ x: 'max-content' }}
          pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
        />
      </Card>

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={600}
        okText="提交"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="策略名称" name="name" rules={[{ required: true, message: '请输入策略名称' }]}>
            <Input placeholder="请输入策略名称" />
          </Form.Item>
          <Form.Item label="策略类型" name="type" rules={[{ required: true, message: '请选择策略类型' }]}>
            <Select placeholder="请选择策略类型">
              <Option value="global">全局权限(作用于全部知识)</Option>
              <Option value="category">分类级权限(按分类授权)</Option>
              <Option value="single">单知识权限(指定某篇知识)</Option>
            </Select>
          </Form.Item>
          <Form.Item label="授权对象类型" name="objectType" rules={[{ required: true, message: '请选择授权对象类型' }]}>
            <Select placeholder="请选择授权对象类型">
              <Option value="user">用户</Option>
              <Option value="role">角色</Option>
              <Option value="department">部门</Option>
            </Select>
          </Form.Item>
          <Form.Item label="授权对象选择" name="object">
            <Select mode="multiple" placeholder="请选择授权对象">
              <Option value="admin">管理员</Option>
              <Option value="user1">张三</Option>
              <Option value="user2">李四</Option>
              <Option value="dept1">研发部</Option>
              <Option value="dept2">测试部</Option>
            </Select>
          </Form.Item>
          <Form.Item label="授予权限" name="permissions">
            <Checkbox.Group options={['查看', '下载', '编辑', '删除']} />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue="enabled">
            <Select>
              <Option value="enabled">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}