import { Card, Table, Button, Modal, Form, Input, Select, DatePicker, Space, Tag, Checkbox, Switch, message } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, PoweroffOutlined, PlayCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { useState } from 'react'
import PageTitle from '../../components/PageTitle/PageTitle'

const { Option } = Select
const { RangePicker, TimePicker } = DatePicker

export default function UVCControl() {
  const [taskModalVisible, setTaskModalVisible] = useState(false)
  const [confirmModalVisible, setConfirmModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [selectedDevices, setSelectedDevices] = useState<string[]>([])
  const [controlAction, setControlAction] = useState('')
  const [selectedTask, setSelectedTask] = useState<any>(null)
  const [isEdit, setIsEdit] = useState(false)
  const [form] = Form.useForm()
  const [selectedTaskKeys, setSelectedTaskKeys] = useState<string[]>([])
  const generateTaskList = () => {
    const tasks = []
    const types = ['定时', '延时', '循环']
    const actions = ['开启', '关闭']
    const statuses = ['启用', '停用']
    const areas = ['实验室A', '实验室B', '洁净区C', '走廊D', '库房E']
    const operators = ['张三', '李四', '王五', '赵六', '钱七']
    
    for (let i = 1; i <= 100; i++) {
      const type = types[Math.floor(Math.random() * types.length)]
      const action = actions[Math.floor(Math.random() * actions.length)]
      const status = statuses[Math.floor(Math.random() * statuses.length)]
      const area = areas[Math.floor(Math.random() * areas.length)]
      const deviceCount = Math.floor(Math.random() * 3) + 1
      const devices = []
      const deviceNames = []
      
      for (let j = 0; j < deviceCount; j++) {
        const deviceId = `UVC-${area.charAt(0)}${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`
        const deviceName = `消毒灯${area.charAt(0)}${String(Math.floor(Math.random() * 10) + 1).padStart(2, '0')}`
        devices.push(deviceId)
        deviceNames.push(deviceName)
      }
      
      let executeTime
      if (type === '定时') {
        const hour = String(Math.floor(Math.random() * 24)).padStart(2, '0')
        const minute = String(Math.floor(Math.random() * 60)).padStart(2, '0')
        executeTime = `${hour}:${minute}`
      } else if (type === '延时') {
        executeTime = String(Math.floor(Math.random() * 120) + 1)
      } else {
        const hours = String(Math.floor(Math.random() * 24)).padStart(2, '0')
        const minutes = String(Math.floor(Math.random() * 60)).padStart(2, '0')
        const seconds = String(Math.floor(Math.random() * 60)).padStart(2, '0')
        executeTime = `${hours}:${minutes}:${seconds}`
      }
      
      const date = new Date()
      date.setDate(date.getDate() - Math.floor(Math.random() * 30))
      const createTime = date.toLocaleString('zh-CN').replace(/\//g, '-')
      
      const lastExecuteDate = status === '启用' ? new Date() : null
      const lastExecuteTime = lastExecuteDate ? lastExecuteDate.toLocaleString('zh-CN').replace(/\//g, '-') : '-'
      
      const nextExecuteDate = status === '启用' ? new Date(Date.now() + Math.floor(Math.random() * 86400000)) : null
      const nextExecuteTime = nextExecuteDate ? nextExecuteDate.toLocaleString('zh-CN').replace(/\//g, '-') : '-'
      
      tasks.push({
        key: String(i),
        name: `任务${String(i).padStart(3, '0')} - ${type}${action}`,
        devices,
        deviceNames: deviceNames.join(', '),
        type,
        executeTime,
        action,
        status,
        lastExecuteTime,
        nextExecuteTime,
        createTime,
        retryCount: Math.floor(Math.random() * 5) + 1,
        remark: status === '停用' ? '已停用' : '',
      })
    }
    return tasks
  }
  
  const generateLogList = () => {
    const logs = []
    const types = ['远程开启', '远程关闭', '定时执行', '手动操作']
    const sources = ['PC', '小程序', '自动任务', '移动端']
    const operators = ['张三', '李四', '王五', '赵六', '钱七', '循环消毒', '每日消毒任务']
    const results = ['成功', '失败']
    const devices = ['消毒灯A01', '消毒灯A02', '消毒灯B01', '消毒灯B02', '消毒灯C01', '消毒灯D01', '消毒灯E01']
    const failReasons = ['设备离线', '网络超时', '权限不足', '设备故障', '-']
    const ips = ['192.168.1.100', '192.168.1.101', '192.168.1.102', '192.168.1.103', '127.0.0.1']
    
    for (let i = 1; i <= 100; i++) {
      const result = results[Math.floor(Math.random() * results.length)]
      const source = sources[Math.floor(Math.random() * sources.length)]
      const ip = source === '自动任务' ? '127.0.0.1' : ips[Math.floor(Math.random() * ips.length)]
      const failReason = result === '失败' ? failReasons[Math.floor(Math.random() * (failReasons.length - 1))] : '-'
      
      const date = new Date()
      date.setTime(date.getTime() - Math.floor(Math.random() * 86400000 * 7))
      date.setMinutes(date.getMinutes() - Math.floor(Math.random() * 1440))
      const timeStr = date.toLocaleString('zh-CN').replace(/\//g, '-')
      
      logs.push({
        id: `LOG${String(i).padStart(3, '0')}`,
        time: timeStr,
        device: devices[Math.floor(Math.random() * devices.length)],
        type: types[Math.floor(Math.random() * types.length)],
        source,
        operator: operators[Math.floor(Math.random() * operators.length)],
        result,
        failReason,
        ip,
      })
    }
    return logs.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
  }
  
  const [taskList, setTaskList] = useState(generateTaskList())
  const [logList, setLogList] = useState(generateLogList())
  const [deviceList] = useState([
    { id: 'UVC-A01', name: '消毒灯A01', area: '实验室A101', status: '在线' },
    { id: 'UVC-A02', name: '消毒灯A02', area: '实验室A101', status: '在线' },
    { id: 'UVC-B01', name: '消毒灯B01', area: '实验室B101', status: '在线' },
    { id: 'UVC-B02', name: '消毒灯B02', area: '实验室B102', status: '故障' },
    { id: 'UVC-C01', name: '消毒灯C01', area: '洁净区C01', status: '离线' },
    { id: 'UVC-D01', name: '消毒灯D01', area: '走廊D01', status: '在线' },
  ])

  const onlineDevices = deviceList.filter(d => d.status === '在线')
  const offlineDevices = deviceList.filter(d => d.status !== '在线')

  const taskColumns = [
    { 
      title: (
        <Checkbox 
          checked={selectedTaskKeys.length > 0 && selectedTaskKeys.length === taskList.length}
          indeterminate={selectedTaskKeys.length > 0 && selectedTaskKeys.length < taskList.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedTaskKeys(taskList.map(t => t.key))
            } else {
              setSelectedTaskKeys([])
            }
          }}
        />
      ), 
      dataIndex: 'select', 
      key: 'select', 
      width: 50, 
      render: (_, record) => (
        <Checkbox 
          checked={selectedTaskKeys.includes(record.key)} 
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedTaskKeys([...selectedTaskKeys, record.key])
            } else {
              setSelectedTaskKeys(selectedTaskKeys.filter(k => k !== record.key))
            }
          }} 
        />
      )
    },
    { title: '任务名称', dataIndex: 'name', key: 'name', width: 150 },
    { title: '目标设备', dataIndex: 'deviceNames', key: 'deviceNames', width: 150 },
    { 
      title: '任务类型', 
      dataIndex: 'type', 
      key: 'type', 
      width: 100,
      render: (t: string) => <Tag color={t === '定时' ? 'blue' : t === '延时' ? 'green' : 'orange'}>{t}</Tag>
    },
    { title: '执行时间', dataIndex: 'executeTime', key: 'executeTime', width: 120 },
    { 
      title: '执行动作', 
      dataIndex: 'action', 
      key: 'action', 
      width: 100,
      render: (a: string) => <Tag color={a === '开启' ? 'green' : 'red'}>{a}</Tag>
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 80,
      render: (s: string) => (
        <Tag 
          color={s === '启用' ? 'success' : 'default'}
          style={{ 
            backgroundColor: s === '启用' ? undefined : 'rgba(0, 0, 0, 0.08)',
            borderColor: s === '启用' ? undefined : 'rgba(0, 0, 0, 0.15)',
            color: s === '启用' ? undefined : 'rgba(0, 0, 0, 0.65)'
          }}
        >
          {s}
        </Tag>
      )
    },
    { title: '最后执行时间', dataIndex: 'lastExecuteTime', key: 'lastExecuteTime', width: 180 },
    { title: '下次执行时间', dataIndex: 'nextExecuteTime', key: 'nextExecuteTime', width: 180 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
    { 
      title: '操作', 
      key: 'action', 
      fixed: 'right' as const,
      width: 240,
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEditTask(record)}>编辑</Button>
          <Button 
            type="text" 
            style={{ color: record.status === '启用' ? '#FF4D4F' : '#52C41A' }} 
            onClick={() => handleToggleTask(record.key, record.status !== '启用')}
          >
            {record.status === '启用' ? '关闭' : '开启'}
          </Button>
          <Button type="text" icon={<DeleteOutlined />} style={{ color: '#FF4D4F' }} onClick={() => handleDeleteTask(record.key)}>删除</Button>
        </div>
      )
    },
  ]

  const logColumns = [
    { title: '日志ID', dataIndex: 'id', key: 'id', width: 100 },
    { title: '操作时间', dataIndex: 'time', key: 'time', width: 180 },
    { title: '操作设备', dataIndex: 'device', key: 'device', width: 120 },
    { title: '操作类型', dataIndex: 'type', key: 'type', width: 120 },
    { title: '操作来源', dataIndex: 'source', key: 'source', width: 100 },
    { title: '操作人/触发任务', dataIndex: 'operator', key: 'operator', width: 150 },
    { 
      title: '执行结果', 
      dataIndex: 'result', 
      key: 'result', 
      width: 80,
      render: (r: string) => <Tag color={r === '成功' ? 'green' : 'red'}>{r}</Tag>
    },
    { title: '失败原因', dataIndex: 'failReason', key: 'failReason', width: 150 },
    { title: '操作IP', dataIndex: 'ip', key: 'ip', width: 120 },
  ]

  const addLog = (device: string, type: string, source: string, operator: string, result: string, failReason: string = '-') => {
    const now = new Date()
    const timeStr = now.toLocaleString('zh-CN').replace(/\//g, '-')
    const newId = `LOG${String(logList.length + 1).padStart(3, '0')}`
    const ip = source === '自动任务' ? '127.0.0.1' : '192.168.1.100'
    
    setLogList(prev => [{
      id: newId,
      time: timeStr,
      device,
      type,
      source,
      operator,
      result,
      failReason,
      ip
    }, ...prev])
  }

  const handleDeviceChange = (value: string[]) => {
    setSelectedDevices(value)
  }

  const handleControl = (action: string) => {
    if (selectedDevices.length === 0) {
      message.warning('请先选择要控制的设备')
      return
    }
    
    const offlineSelected = selectedDevices.filter(id => !onlineDevices.some(d => d.id === id))
    if (offlineSelected.length > 0) {
      const offlineNames = offlineSelected.map(id => {
        const device = deviceList.find(d => d.id === id)
        return device ? device.name : id
      })
      message.warning(`以下设备当前离线或故障，无法控制：${offlineNames.join('、')}`)
      return
    }
    
    setControlAction(action)
    setConfirmModalVisible(true)
  }

  const handleConfirmControl = () => {
    const now = new Date().toLocaleString('zh-CN').replace(/\//g, '-')
    
    selectedDevices.forEach(deviceId => {
      const device = deviceList.find(d => d.id === deviceId)
      if (device) {
        addLog(device.name, `远程${controlAction}`, 'PC', '当前用户', '成功')
      }
    })
    
    message.success(`${controlAction}成功，已控制 ${selectedDevices.length} 台设备`)
    setConfirmModalVisible(false)
    setSelectedDevices([])
    form.resetFields()
  }

  const handleOpenTaskModal = (editRecord?: any) => {
    if (editRecord) {
      setIsEdit(true)
      setSelectedTask(editRecord)
      form.setFieldsValue({
        name: editRecord.name,
        devices: editRecord.devices,
        taskType: editRecord.type,
        action: editRecord.action,
        time: editRecord.type === '定时' ? editRecord.executeTime : undefined,
        delayTime: editRecord.type === '延时' ? editRecord.executeTime : undefined,
        cycleRule: editRecord.type === '循环' ? editRecord.executeTime : undefined,
        retryCount: editRecord.retryCount,
        remark: editRecord.remark
      })
      setEditModalVisible(true)
    } else {
      setIsEdit(false)
      setSelectedTask(null)
      form.resetFields()
      setTaskModalVisible(true)
    }
  }

  const handleSaveTask = () => {
    form.validateFields().then(values => {
      const now = new Date().toLocaleString('zh-CN').replace(/\//g, '-')
      let executeTime = ''
      
      if (values.taskType === '定时') {
        executeTime = values.time ? values.time.format('HH:mm') : ''
      } else if (values.taskType === '延时') {
        executeTime = values.delayTime ? String(values.delayTime) : ''
      } else if (values.taskType === '循环') {
        executeTime = values.cycleRule || ''
      }

      const deviceNames = values.devices.map((id: string) => {
        const device = deviceList.find(d => d.id === id)
        return device ? device.name.replace('消毒灯', '') : id
      }).join(', ')

      if (isEdit && selectedTask) {
        setTaskList(prev => prev.map(task => 
          task.key === selectedTask.key ? {
            ...task,
            name: values.name,
            devices: values.devices,
            deviceNames,
            type: values.taskType,
            executeTime,
            action: values.action,
            retryCount: values.retryCount || 1,
            remark: values.remark
          } : task
        ))
        message.success('任务编辑成功')
        setEditModalVisible(false)
      } else {
        const newKey = String(taskList.length + 1)
        setTaskList(prev => [{
          key: newKey,
          name: values.name,
          devices: values.devices,
          deviceNames,
          type: values.taskType,
          executeTime,
          action: values.action,
          status: '启用',
          lastExecuteTime: '-',
          nextExecuteTime: values.taskType === '定时' ? `2024-01-16 ${executeTime}:00` : '-',
          createTime: now,
          retryCount: values.retryCount || 1,
          remark: values.remark
        }, ...prev])
        message.success('任务创建成功')
        setTaskModalVisible(false)
      }
      
      form.resetFields()
    }).catch(() => {
      message.error('请填写必填项')
    })
  }

  const handleEditTask = (record: any) => {
    handleOpenTaskModal(record)
  }

  const handleDeleteTask = (key: string) => {
    Modal.confirm({
      title: '删除任务',
      content: '确定要删除这个任务吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        setTaskList(prev => prev.filter(task => task.key !== key))
        message.success('任务已删除')
      }
    })
  }

  const handleToggleTask = (key: string, enabled: boolean) => {
    setTaskList(prev => prev.map(task => 
      task.key === key ? {
        ...task,
        status: enabled ? '启用' : '停用',
        nextExecuteTime: enabled ? (task.type === '定时' ? `2024-01-16 ${task.executeTime}:00` : '-') : '-'
      } : task
    ))
    message.success(enabled ? '任务已启用' : '任务已停用')
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, padding: 0 }}>
      <PageTitle>远程控制与定时任务</PageTitle>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>即时控制</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, height: 32 }}>
          <Form form={form} layout="inline" style={{ marginBottom: 0 }}>
            <Form.Item label="选择设备" name="selectedDevices">
              <Select 
                placeholder="请选择设备" 
                style={{ width: 300 }} 
                mode="multiple"
                onChange={handleDeviceChange}
                value={selectedDevices}
              >
                {onlineDevices.map(device => (
                  <Option key={device.id} value={device.id}>
                    {device.name} ({device.area}) <Tag color="green">在线</Tag>
                  </Option>
                ))}
                {offlineDevices.map(device => (
                  <Option key={device.id} value={device.id} disabled>
                    {device.name} ({device.area}) <Tag color={device.status === '离线' ? 'gray' : 'red'}>{device.status}</Tag>
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Form>
          <Space>
            <Button 
              type="primary" 
              icon={<PlayCircleOutlined />} 
              onClick={() => handleControl('开启')}
              disabled={selectedDevices.length === 0}
            >
              开启
            </Button>
            <Button 
              icon={<PoweroffOutlined />} 
              onClick={() => handleControl('关闭')}
              disabled={selectedDevices.length === 0}
            >
              关闭
            </Button>
          </Space>
        </div>
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500 }}>定时任务</h3>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => handleOpenTaskModal()}>新建定时任务</Button>
        </div>
        <Table 
          columns={taskColumns} 
          dataSource={taskList} 
          scroll={{ x: 'max-content' }}
          pagination={{ showSizeChanger: true, showQuickJumper: true, showTotal: (t) => `共 ${t} 条`, pageSize: 10 }}
        />
      </Card>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>控制日志</h3>
        <Table 
          columns={logColumns} 
          dataSource={logList} 
          scroll={{ x: 'max-content' }}
          pagination={{ showSizeChanger: true, showQuickJumper: true, showTotal: (t) => `共 ${t} 条`, pageSize: 10 }}
        />
      </Card>

      <Modal
        title={isEdit ? '编辑定时任务' : '新建定时任务'}
        visible={taskModalVisible || editModalVisible}
        onCancel={() => { 
          setTaskModalVisible(false)
          setEditModalVisible(false)
          form.resetFields()
        }}
        footer={[
          <Button key="back" onClick={() => { 
            setTaskModalVisible(false)
            setEditModalVisible(false)
            form.resetFields()
          }}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleSaveTask}>确定</Button>,
        ]}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="任务名称" name="name" rules={[{ required: true, message: '请输入任务名称' }]}>
            <Input placeholder="请输入任务名称" />
          </Form.Item>
          <Form.Item label="目标设备" name="devices" rules={[{ required: true, message: '请选择目标设备' }]}>
            <Select placeholder="请选择目标设备" mode="multiple">
              {deviceList.map(device => (
                <Option key={device.id} value={device.id}>{device.name} ({device.area})</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="任务类型" name="taskType" rules={[{ required: true, message: '请选择任务类型' }]}>
            <Select placeholder="请选择任务类型">
              <Option value="定时">定时任务</Option>
              <Option value="延时">延时任务</Option>
              <Option value="循环">循环任务</Option>
            </Select>
          </Form.Item>
          <Form.Item label="执行动作" name="action" rules={[{ required: true, message: '请选择执行动作' }]}>
            <Select placeholder="请选择执行动作">
              <Option value="开启">开启消毒灯</Option>
              <Option value="关闭">关闭消毒灯</Option>
            </Select>
          </Form.Item>
          <Form.Item label="定时时间" name="time">
            <TimePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="延时时长(分钟)" name="delayTime">
            <Input type="number" placeholder="请输入延时时长" />
          </Form.Item>
          <Form.Item label="循环间隔" name="cycleRule">
            <Select placeholder="请选择循环间隔">
              <Option value="01:00:00">每1小时</Option>
              <Option value="02:00:00">每2小时</Option>
              <Option value="04:00:00">每4小时</Option>
              <Option value="06:00:00">每6小时</Option>
            </Select>
          </Form.Item>
          <Form.Item label="执行失败重试次数" name="retryCount">
            <Input type="number" placeholder="请输入重试次数" defaultValue={3} />
          </Form.Item>
          <Form.Item label="备注" name="remark">
            <Input.TextArea placeholder="请输入备注" rows={3} />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="确认操作"
        visible={confirmModalVisible}
        onCancel={() => setConfirmModalVisible(false)}
        footer={[
          <Button key="back" onClick={() => setConfirmModalVisible(false)}>取消</Button>,
          <Button key="submit" type="primary" onClick={handleConfirmControl}>确认执行</Button>,
        ]}
        width={450}
      >
        <div style={{ padding: 20 }}>
          <div style={{ marginBottom: 16 }}>
            <p style={{ marginBottom: 8 }}>确定要{controlAction}以下设备吗？</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {selectedDevices.map(id => {
                const device = deviceList.find(d => d.id === id)
                return <Tag key={id} color="blue">{device?.name}</Tag>
              })}
            </div>
          </div>
          <Form layout="vertical">
            <Form.Item label="操作原因">
              <Input.TextArea placeholder="请输入操作原因（选填）" rows={3} />
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  )
}