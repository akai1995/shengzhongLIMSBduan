import { useState } from 'react'
import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space, Tag, message, InputNumber, Upload, Collapse } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { Panel } = Collapse

export default function EquipmentMaintenance() {
  const { isDark } = useThemeStore()
  const [isRuleModalVisible, setIsRuleModalVisible] = useState(false)
  const [isCompleteModalVisible, setIsCompleteModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增提醒规则')
  const [ruleForm] = Form.useForm()
  const [completeForm] = Form.useForm()
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [_selectedRows, _setSelectedRows] = useState<string[]>([])
  const [activeCollapseKeys, setActiveCollapseKeys] = useState<string[]>(['1', '2'])

  const statusColors: Record<string, string> = {
    '待执行': 'blue',
    '已完成': 'green',
    '逾期': 'red'
  }

  const maintenanceTypeColors: Record<string, string> = {
    '定期保养': 'blue',
    '校准': 'orange',
    '维修': 'red'
  }

  const ruleColumns = [
    { title: '设备名称', dataIndex: 'equipmentName', key: 'equipmentName' },
    { 
      title: '维护类型', 
      dataIndex: 'maintenanceType', 
      key: 'maintenanceType', 
      render: (t: string) => <Tag color={maintenanceTypeColors[t] || 'default'}>{t}</Tag> 
    },
    { title: '周期天数', dataIndex: 'cycleDays', key: 'cycleDays' },
    { title: '下次维护日期', dataIndex: 'nextDate', key: 'nextDate' },
    { title: '负责部门', dataIndex: 'department', key: 'department' },
    { 
      title: '操作', 
      key: 'action', 
      fixed: 'right' as const,
      width: 160,
      render: (_, record: any) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleEditRule(record)} icon={<EditOutlined />}>编辑</Button>
          <Button type="link" danger onClick={() => handleDeleteRule(record)} icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ) 
    },
  ]

  const taskColumns = [
    { title: '设备名称', dataIndex: 'equipmentName', key: 'equipmentName' },
    { title: '维护内容', dataIndex: 'content', key: 'content' },
    { title: '计划维护日期', dataIndex: 'planDate', key: 'planDate' },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      render: (s: string) => <Tag color={statusColors[s] || 'default'}>{s}</Tag> 
    },
    { 
      title: '操作', 
      key: 'action', 
      fixed: 'right' as const,
      width: 120,
      render: (_, record: any) => (
        <Space size="middle">
          {record.status === '待执行' || record.status === '逾期' ? (
            <Button type="link" onClick={() => handleCompleteTask(record)}>完成维护</Button>
          ) : null}
        </Space>
      ) 
    },
  ]

  const equipmentList = Array.from({ length: 8 }, (_, i) => {
    const names = ['离心机', 'PCR仪', '流式细胞仪', '显微镜', '分光光度计', '高压灭菌锅', 'CO2培养箱', '超低温冰箱']
    return {
      key: String(i + 1),
      id: `EQ-${String(i + 1).padStart(4, '0')}`,
      name: names[i]
    }
  })

  const ruleData = Array.from({ length: 8 }, (_, i) => {
    const types = ['定期保养', '校准', '维修']
    const departments = ['设备科', '检验科', '病理科', '中心实验室']
    return {
      key: String(i + 1),
      id: `RULE-${String(i + 1).padStart(4, '0')}`,
      equipmentId: `EQ-${String((i % 8) + 1).padStart(4, '0')}`,
      equipmentName: equipmentList[i % 8].name,
      maintenanceType: types[i % types.length],
      cycleDays: 7 + (i * 7),
      nextDate: `2024-0${1 + ((i + 1) % 8)}-${String(10 + (i % 15)).padStart(2, '0')}`,
      department: departments[i % departments.length],
    }
  })

  const taskData = Array.from({ length: 15 }, (_, i) => {
    const statuses = ['待执行', '待执行', '待执行', '已完成', '逾期']
    const contents = ['日常清洁', '性能校准', '定期保养', '故障检查', '预防性维护']
    return {
      key: String(i + 1),
      id: `TASK-${String(i + 1).padStart(4, '0')}`,
      equipmentId: `EQ-${String((i % 8) + 1).padStart(4, '0')}`,
      equipmentName: equipmentList[i % 8].name,
      content: contents[i % contents.length],
      planDate: `2024-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')}`,
      status: statuses[i % statuses.length],
    }
  })

  const handleCreateRule = () => {
    setModalTitle('新增提醒规则')
    ruleForm.resetFields()
    setIsRuleModalVisible(true)
  }

  const handleEditRule = (record: any) => {
    setModalTitle('编辑提醒规则')
    ruleForm.resetFields()
    ruleForm.setFieldsValue({
      equipment: record.equipmentId,
      maintenanceType: record.maintenanceType,
      cycleDays: record.cycleDays,
      department: record.department,
      firstDate: record.firstDate ? new Date(record.firstDate) : null,
      remark: record.remark,
    })
    setIsRuleModalVisible(true)
  }

  const handleDeleteRule = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定删除提醒规则【${record.id}】吗？`,
      onOk: () => message.success('删除成功'),
    })
  }

  const handleCompleteTask = (record: any) => {
    setSelectedTask(record)
    completeForm.resetFields()
    setIsCompleteModalVisible(true)
  }

  const handleRuleModalOk = () => {
    ruleForm.validateFields().then(values => {
      message.success('保存成功')
      setIsRuleModalVisible(false)
    })
  }

  const handleCompleteModalOk = () => {
    completeForm.validateFields().then(values => {
      message.success('维护完成')
      setIsCompleteModalVisible(false)
    })
  }

  const handleCollapseChange = (keys: string[]) => {
    setActiveCollapseKeys(keys)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>维护提醒</h1>
      
      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
          <Space wrap>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreateRule}>新增提醒规则</Button>
          </Space>
        </div>

        <Collapse 
          activeKey={activeCollapseKeys} 
          onChange={handleCollapseChange}
          defaultActiveKey={['1', '2']}
        >
          <Panel header="提醒规则列表" key="1">
            <Table 
              columns={ruleColumns} 
              dataSource={ruleData}
              scroll={{ x: 'max-content' }}
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Panel>
          <Panel header="待办维护任务" key="2">
            <Table 
              columns={taskColumns} 
              dataSource={taskData}
              scroll={{ x: 'max-content' }}
              pagination={{ pageSize: 8 }}
            />
          </Panel>
        </Collapse>
      </Card>

      <Modal
        title={modalTitle}
        open={isRuleModalVisible}
        onOk={handleRuleModalOk}
        onCancel={() => setIsRuleModalVisible(false)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setIsRuleModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleRuleModalOk}>保存</Button>,
        ]}
      >
        <Form form={ruleForm} layout="vertical">
          <Form.Item label="设备" name="equipment" rules={[{ required: true, message: '请选择设备' }]}>
            <Select placeholder="请选择设备">
              {equipmentList.map(eq => (
                <Option key={eq.id} value={eq.id}>{eq.name}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="维护类型" name="maintenanceType" rules={[{ required: true, message: '请选择维护类型' }]}>
            <Select placeholder="请选择维护类型">
              <Option value="定期保养">定期保养</Option>
              <Option value="校准">校准</Option>
              <Option value="维修">维修</Option>
            </Select>
          </Form.Item>
          <Form.Item label="周期天数" name="cycleDays" rules={[{ required: true, message: '请输入周期天数' }]}>
            <InputNumber min={1} placeholder="请输入周期天数" style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="负责部门/人" name="department" rules={[{ required: true, message: '请输入负责部门/人' }]}>
            <Input placeholder="请输入负责部门/人" />
          </Form.Item>
          <Form.Item label="首次维护日期" name="firstDate" rules={[{ required: true, message: '请选择首次维护日期' }]}>
            <DatePicker style={{ width: '100%' }} placeholder="请选择首次维护日期" />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入备注" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="完成维护"
        open={isCompleteModalVisible}
        onOk={handleCompleteModalOk}
        onCancel={() => setIsCompleteModalVisible(false)}
        width={600}
        footer={[
          <Button key="cancel" onClick={() => setIsCompleteModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleCompleteModalOk}>确认</Button>,
        ]}
      >
        {selectedTask && (
          <div style={{ marginBottom: 16, padding: '12px', backgroundColor: '#f5f5f5', borderRadius: 4 }}>
            <p><strong>设备：</strong>{selectedTask.equipmentName}</p>
            <p><strong>维护内容：</strong>{selectedTask.content}</p>
            <p><strong>计划日期：</strong>{selectedTask.planDate}</p>
          </div>
        )}
        <Form form={completeForm} layout="vertical">
          <Form.Item label="实际维护日期" name="actualDate" rules={[{ required: true, message: '请选择实际维护日期' }]}>
            <DatePicker style={{ width: '100%' }} placeholder="请选择实际维护日期" />
          </Form.Item>
          <Form.Item label="维护结果" name="result" rules={[{ required: true, message: '请输入维护结果' }]}>
            <Input.TextArea placeholder="请输入维护结果" rows={4} />
          </Form.Item>
          <Form.Item label="上传凭证" name="voucher">
            <Upload 
              action="#" 
              listType="picture"
              fileList={[]}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>点击上传</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
