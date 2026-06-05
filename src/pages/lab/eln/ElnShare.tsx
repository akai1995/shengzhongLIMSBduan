import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Space, message, Tabs, Row, Col, Badge, Tooltip } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, DownOutlined, UpOutlined, EyeOutlined, MessageOutlined, FileTextOutlined, BellOutlined, HistoryOutlined, UserOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import PageTitle from '../../../components/PageTitle/PageTitle'

const { Option } = Select
const { RangePicker } = DatePicker

interface ShareRecord {
  key: string
  id: string
  recordName: string
  recordId: string
  sharedBy: string
  sharedTo: string[]
  permission: string
  allowExport: boolean
  startTime: string
  endTime: string
  status: 'active' | 'expired' | 'pending'
}

interface CollabActivity {
  key: string
  id: string
  recordName: string
  recordId: string
  actor: string
  action: string
  actionType: 'view' | 'edit' | 'comment' | 'share' | 'export' | 'lock' | 'unlock'
  timestamp: string
  detail: string
}

interface Notification {
  key: string
  id: string
  type: 'share' | 'comment' | 'edit' | 'mention'
  title: string
  message: string
  timestamp: string
  read: boolean
  relatedRecord: string
}

export default function ElnShare() {
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [notificationModalVisible, setNotificationModalVisible] = useState(false)
  const [currentShare, setCurrentShare] = useState<ShareRecord | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<ShareRecord | null>(null)
  const [expanded, setExpanded] = useState(false)
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [shareTableData, setShareTableData] = useState<ShareRecord[]>([])
  const [filteredShareData, setFilteredShareData] = useState<ShareRecord[]>([])
  const [activityData, setActivityData] = useState<CollabActivity[]>([])
  const [filteredActivityData, setFilteredActivityData] = useState<CollabActivity[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)

  const currentUser = '张医生'

  const experimentRecords = [
    { key: '1', id: 'ELN2026001', name: '细胞培养实验记录', owner: '张医生' },
    { key: '2', id: 'ELN2026002', name: 'PCR扩增实验记录', owner: '张医生' },
    { key: '3', id: 'ELN2026003', name: 'Western Blot实验记录', owner: '李医生' },
    { key: '4', id: 'ELN2026004', name: '免疫组化实验记录', owner: '王医生' },
    { key: '5', id: 'ELN2026005', name: '动物实验记录', owner: '张医生' },
    { key: '6', id: 'ELN2026006', name: '临床样本处理记录', owner: '赵医生' },
  ]

  const labMembers = [
    { id: '1', name: '张医生', role: '研究员' },
    { id: '2', name: '李医生', role: '高级研究员' },
    { id: '3', name: '王医生', role: '技术员' },
    { id: '4', name: '赵医生', role: '研究员' },
    { id: '5', name: '钱医生', role: '主任' },
    { id: '6', name: '孙医生', role: '技术员' },
  ]

  const myRecords = experimentRecords.filter(r => r.owner === currentUser)

  useEffect(() => {
    const initialShareData: ShareRecord[] = Array.from({ length: 20 }, (_, i) => {
      const names = ['细胞培养实验记录', 'PCR扩增实验记录', 'Western Blot实验记录', '免疫组化实验记录', '动物实验记录', '临床样本处理记录']
      const permissions = ['只读', '可编辑', '可评论', '可管理']
      const users = ['李医生', '王医生', '赵医生', '钱医生', '孙医生']
      const sharedTo = i % 3 === 0 ? [users[i % users.length], users[(i + 1) % users.length]] : [users[i % users.length]]
      return {
        key: String(i + 1),
        id: `SHR${Date.now().toString().slice(-8)}${String(i + 1).padStart(3, '0')}`,
        recordName: names[i % names.length] + (i >= names.length ? `-${Math.floor(i / names.length) + 1}` : ''),
        recordId: `ELN2026${String(1001 + i).padStart(4, '0')}`,
        sharedBy: i % 3 === 0 ? '李医生' : '张医生',
        sharedTo,
        permission: permissions[i % permissions.length],
        allowExport: i % 3 !== 0,
        startTime: `2026-05-${String(1 + (i % 28)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:00:00`,
        endTime: i % 4 === 0 ? '' : `2026-06-${String(1 + (i % 28)).padStart(2, '0')} ${String(9 + (i % 8)).padStart(2, '0')}:00:00`,
        status: i % 5 === 0 ? 'expired' : 'active',
      }
    })
    setShareTableData(initialShareData)
    setFilteredShareData(initialShareData)

    const actions = [
      { action: '查看了实验记录', actionType: 'view' as const, icon: EyeOutlined },
      { action: '编辑了实验记录', actionType: 'edit' as const, icon: FileTextOutlined },
      { action: '添加了评论', actionType: 'comment' as const, icon: MessageOutlined },
      { action: '共享了实验记录', actionType: 'share' as const, icon: UserOutlined },
      { action: '导出了实验记录', actionType: 'export' as const, icon: FileTextOutlined },
      { action: '锁定了实验记录', actionType: 'lock' as const, icon: LockOutlined },
      { action: '解锁了实验记录', actionType: 'unlock' as const, icon: UnlockOutlined },
    ]

    const initialActivityData: CollabActivity[] = Array.from({ length: 30 }, (_, i) => {
      const names = ['细胞培养实验记录', 'PCR扩增实验记录', 'Western Blot实验记录', '免疫组化实验记录', '动物实验记录']
      const users = ['李医生', '王医生', '赵医生', '钱医生', '孙医生', '张医生']
      const action = actions[i % actions.length]
      return {
        key: String(i + 1),
        id: `ACT${Date.now().toString().slice(-6)}${String(i + 1).padStart(4, '0')}`,
        recordName: names[i % names.length],
        recordId: `ELN2026${String(1001 + (i % 10)).padStart(4, '0')}`,
        actor: users[i % users.length],
        action: action.action,
        actionType: action.actionType,
        timestamp: `2026-05-${String(15 + (i % 15)).padStart(2, '0')} ${String(8 + (i % 16)).padStart(2, '0')}:${String(10 + (i % 50)).padStart(2, '0')}:00`,
        detail: i % 3 === 0 ? `修改了"实验步骤"部分` : i % 5 === 0 ? `评论: 实验结果很好，建议补充对照组数据` : '',
      }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    
    setActivityData(initialActivityData)
    setFilteredActivityData(initialActivityData)

    const initialNotifications: Notification[] = [
      { key: '1', id: 'NOT001', type: 'share', title: '李医生共享了实验记录', message: '李医生将"Western Blot实验记录"共享给您，权限: 可编辑', timestamp: '2026-05-19 10:30:00', read: false, relatedRecord: 'Western Blot实验记录' },
      { key: '2', id: 'NOT002', type: 'comment', title: '王医生评论了您的实验记录', message: '王医生在"细胞培养实验记录"中添加了评论', timestamp: '2026-05-19 09:15:00', read: false, relatedRecord: '细胞培养实验记录' },
      { key: '3', id: 'NOT003', type: 'edit', title: '赵医生编辑了共享记录', message: '赵医生编辑了您共享的"PCR扩增实验记录"', timestamp: '2026-05-19 08:45:00', read: true, relatedRecord: 'PCR扩增实验记录' },
      { key: '4', id: 'NOT004', type: 'share', title: '钱医生共享了实验记录', message: '钱医生将"动物实验记录"共享给您，权限: 只读', timestamp: '2026-05-18 16:20:00', read: true, relatedRecord: '动物实验记录' },
    ]
    setNotifications(initialNotifications)
    setUnreadCount(initialNotifications.filter(n => !n.read).length)
  }, [])

  const shareColumns = [
    { title: '实验记录名称', dataIndex: 'recordName', key: 'recordName', width: 220 },
    { title: '实验记录ID', dataIndex: 'recordId', key: 'recordId', width: 140 },
    { title: '共享人', dataIndex: 'sharedBy', key: 'sharedBy', width: 100 },
    { 
      title: '被共享人', 
      dataIndex: 'sharedTo', 
      key: 'sharedTo', 
      width: 180,
      render: (users: string[]) => (
        <div>
          {users.map((user, index) => (
            <div key={index} style={{ marginBottom: index < users.length - 1 ? 4 : 0 }}>
              <Tag color="blue">{user}</Tag>
            </div>
          ))}
        </div>
      )
    },
    { 
      title: '权限类型', 
      dataIndex: 'permission', 
      key: 'permission', 
      width: 100,
      render: (permission: string) => {
        const colorMap: Record<string, string> = {
          '只读': 'blue',
          '可编辑': 'green',
          '可评论': 'orange',
          '可管理': 'purple',
        }
        return <Tag color={colorMap[permission] || 'default'}>{permission}</Tag>
      }
    },
    { 
      title: '允许导出', 
      dataIndex: 'allowExport', 
      key: 'allowExport', 
      width: 80,
      render: (allow: boolean) => <Tag color={allow ? 'green' : 'red'}>{allow ? '是' : '否'}</Tag>
    },
    { 
      title: '状态', 
      dataIndex: 'status', 
      key: 'status', 
      width: 80,
      render: (status: string) => {
        const colorMap: Record<string, string> = {
          'active': 'green',
          'expired': 'red',
          'pending': 'orange',
        }
        const labelMap: Record<string, string> = {
          'active': '有效',
          'expired': '已过期',
          'pending': '待确认',
        }
        return <Tag color={colorMap[status] || 'default'}>{labelMap[status] || status}</Tag>
      }
    },
    { title: '开始时间', dataIndex: 'startTime', key: 'startTime', width: 160 },
    { title: '结束时间', dataIndex: 'endTime', key: 'endTime', width: 160, render: (time: string) => time || '永久' },
    { 
      title: '操作', 
      key: 'action', 
      width: 160, 
      fixed: 'right' as const,
      render: (_: any, record: ShareRecord) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>修改</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>撤销</Button>
        </Space>
      )
    },
  ]

  const activityColumns = [
    { 
      title: '操作类型', 
      dataIndex: 'actionType', 
      key: 'actionType', 
      width: 100,
      render: (type: string) => {
        const iconMap: Record<string, typeof EyeOutlined> = {
          'view': EyeOutlined,
          'edit': FileTextOutlined,
          'comment': MessageOutlined,
          'share': UserOutlined,
          'export': FileTextOutlined,
          'lock': LockOutlined,
          'unlock': UnlockOutlined,
        }
        const colorMap: Record<string, string> = {
          'view': 'blue',
          'edit': 'green',
          'comment': 'orange',
          'share': 'purple',
          'export': 'cyan',
          'lock': 'red',
          'unlock': 'green',
        }
        const Icon = iconMap[type] || EyeOutlined
        return <Tag color={colorMap[type] || 'default'} icon={<Icon />}>{type === 'view' ? '查看' : type === 'edit' ? '编辑' : type === 'comment' ? '评论' : type === 'share' ? '共享' : type === 'export' ? '导出' : type === 'lock' ? '锁定' : '解锁'}</Tag>
      }
    },
    { title: '实验记录', dataIndex: 'recordName', key: 'recordName', width: 200 },
    { title: '操作人', dataIndex: 'actor', key: 'actor', width: 100 },
    { title: '操作描述', dataIndex: 'action', key: 'action', width: 180 },
    { title: '详情', dataIndex: 'detail', key: 'detail', width: 250, ellipsis: true },
    { title: '操作时间', dataIndex: 'timestamp', key: 'timestamp', width: 180 },
    { 
      title: '操作', 
      key: 'action', 
      width: 160, 
      fixed: 'right' as const,
      render: (_: any, record: CollabActivity) => (
        <Space size="middle">
          <Button type="text" icon={<EditOutlined />}>修改</Button>
          <Button type="text" danger icon={<DeleteOutlined />}>撤销</Button>
        </Space>
      )
    },
  ]

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    let shareResult = [...shareTableData]
    let activityResult = [...activityData]

    if (values.name) {
      shareResult = shareResult.filter(item => item.recordName.includes(values.name))
      activityResult = activityResult.filter(item => item.recordName.includes(values.name))
    }
    if (values.sharedBy) {
      shareResult = shareResult.filter(item => item.sharedBy.includes(values.sharedBy))
      activityResult = activityResult.filter(item => item.actor.includes(values.sharedBy))
    }
    if (values.sharedTo) {
      shareResult = shareResult.filter(item => item.sharedTo.some(u => u.includes(values.sharedTo)))
    }
    if (values.permission && values.permission !== 'all') {
      shareResult = shareResult.filter(item => item.permission === values.permission)
    }
    if (values.dateRange && values.dateRange.length === 2) {
      const startDate = values.dateRange[0].format('YYYY-MM-DD')
      const endDate = values.dateRange[1].format('YYYY-MM-DD')
      shareResult = shareResult.filter(item => item.startTime.substring(0, 10) >= startDate && item.startTime.substring(0, 10) <= endDate)
      activityResult = activityResult.filter(item => item.timestamp.substring(0, 10) >= startDate && item.timestamp.substring(0, 10) <= endDate)
    }

    setFilteredShareData(shareResult)
    setFilteredActivityData(activityResult)
    message.info(`搜索完成，共享设置找到 ${shareResult.length} 条记录，协作动态找到 ${activityResult.length} 条记录`)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setFilteredShareData([...shareTableData])
    setFilteredActivityData([...activityData])
  }

  const handleCreate = () => {
    form.resetFields()
    setCurrentShare(null)
    setCreateModalVisible(true)
  }

  const handleEdit = (record: ShareRecord) => {
    setCurrentShare(record)
    form.setFieldsValue({
      recordId: experimentRecords.find(r => r.id === record.recordId)?.key || '',
      sharedTo: record.sharedTo,
      permission: record.permission,
      allowExport: record.allowExport,
    })
    setEditModalVisible(true)
  }

  const handleDelete = (record: ShareRecord) => {
    setDeleteRecord(record)
    setDeleteModalVisible(true)
  }

  const handleViewDetail = (record: ShareRecord) => {
    setCurrentShare(record)
    setDetailModalVisible(true)
  }

  const handleCreateSubmit = (values: any) => {
    const recordInfo = experimentRecords.find(r => r.key === values.recordId)
    if (!recordInfo) {
      message.error('请选择有效的实验记录')
      return
    }

    const now = new Date()
    const newShare: ShareRecord = {
      key: String(Date.now()),
      id: `SHR${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
      recordName: recordInfo.name,
      recordId: recordInfo.id,
      sharedBy: currentUser,
      sharedTo: Array.isArray(values.sharedTo) ? values.sharedTo : [values.sharedTo],
      permission: values.permission || '只读',
      allowExport: values.allowExport || false,
      startTime: values.dateRange && values.dateRange[0] 
        ? values.dateRange[0].format('YYYY-MM-DD HH:mm:ss') 
        : now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-'),
      endTime: values.dateRange && values.dateRange[1] 
        ? values.dateRange[1].format('YYYY-MM-DD HH:mm:ss') 
        : '',
      status: 'active',
    }

    setShareTableData(prev => [newShare, ...prev])
    setFilteredShareData(prev => [newShare, ...prev])

    const newActivity: CollabActivity = {
      key: String(Date.now() + 1),
      id: `ACT${now.getTime().toString().slice(-6)}001`,
      recordName: recordInfo.name,
      recordId: recordInfo.id,
      actor: currentUser,
      action: `将实验记录共享给 ${newShare.sharedTo.join('、')}`,
      actionType: 'share',
      timestamp: now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-'),
      detail: `权限: ${newShare.permission}，允许导出: ${newShare.allowExport ? '是' : '否'}`,
    }
    setActivityData(prev => [newActivity, ...prev])
    setFilteredActivityData(prev => [newActivity, ...prev])

    newShare.sharedTo.forEach(user => {
      const newNotification: Notification = {
        key: String(Date.now() + Math.random()),
        id: `NOT${now.getTime().toString().slice(-6)}`,
        type: 'share',
        title: `${currentUser}共享了实验记录`,
        message: `${currentUser}将"${recordInfo.name}"共享给您，权限: ${newShare.permission}`,
        timestamp: now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-'),
        read: false,
        relatedRecord: recordInfo.name,
      }
      setNotifications(prev => [newNotification, ...prev])
      setUnreadCount(prev => prev + 1)
    })

    message.success('共享设置成功')
    setCreateModalVisible(false)
    form.resetFields()
  }

  const handleEditSubmit = (values: any) => {
    if (!currentShare) return

    const updatedRecord: ShareRecord = {
      ...currentShare,
      sharedTo: Array.isArray(values.sharedTo) ? values.sharedTo : [values.sharedTo],
      permission: values.permission || currentShare.permission,
      allowExport: values.allowExport !== undefined ? values.allowExport : currentShare.allowExport,
      startTime: values.dateRange && values.dateRange[0] 
        ? values.dateRange[0].format('YYYY-MM-DD HH:mm:ss') 
        : currentShare.startTime,
      endTime: values.dateRange && values.dateRange[1] 
        ? values.dateRange[1].format('YYYY-MM-DD HH:mm:ss') 
        : '',
    }

    const now = new Date()
    const changedFields = []
    if (JSON.stringify(updatedRecord.sharedTo) !== JSON.stringify(currentShare.sharedTo)) {
      changedFields.push('协作用户')
    }
    if (updatedRecord.permission !== currentShare.permission) {
      changedFields.push('权限')
    }
    if (updatedRecord.allowExport !== currentShare.allowExport) {
      changedFields.push('导出权限')
    }
    if (updatedRecord.endTime !== currentShare.endTime) {
      changedFields.push('有效期')
    }

    setShareTableData(prev => prev.map(item => item.key === currentShare.key ? updatedRecord : item))
    setFilteredShareData(prev => prev.map(item => item.key === currentShare.key ? updatedRecord : item))

    const editActivity: CollabActivity = {
      key: String(Date.now()),
      id: `ACT${now.getTime().toString().slice(-6)}002`,
      recordName: updatedRecord.recordName,
      recordId: updatedRecord.recordId,
      actor: currentUser,
      action: `修改了共享设置`,
      actionType: 'edit',
      timestamp: now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-'),
      detail: `修改项: ${changedFields.join('、')}`,
    }
    setActivityData(prev => [editActivity, ...prev])
    setFilteredActivityData(prev => [editActivity, ...prev])

    message.success('共享修改成功')
    setEditModalVisible(false)
    form.resetFields()
  }

  const confirmDelete = () => {
    if (!deleteRecord) return

    const now = new Date()
    const deleteActivity: CollabActivity = {
      key: String(Date.now()),
      id: `ACT${now.getTime().toString().slice(-6)}003`,
      recordName: deleteRecord.recordName,
      recordId: deleteRecord.recordId,
      actor: currentUser,
      action: `撤销了共享`,
      actionType: 'share',
      timestamp: now.toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\//g, '-'),
      detail: `撤销了对 ${deleteRecord.sharedTo.join('、')} 的共享`,
    }
    setActivityData(prev => [deleteActivity, ...prev])
    setFilteredActivityData(prev => [deleteActivity, ...prev])

    setShareTableData(prev => prev.filter(item => item.key !== deleteRecord.key))
    setFilteredShareData(prev => prev.filter(item => item.key !== deleteRecord.key))
    
    message.success('共享已撤销')
    setDeleteModalVisible(false)
    setDeleteRecord(null)
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })))
    setUnreadCount(0)
    message.success('所有通知已标记为已读')
  }

  const markAsRead = (notification: Notification) => {
    setNotifications(prev => prev.map(n => n.key === notification.key ? { ...n, read: true } : n))
    setUnreadCount(prev => prev - 1)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <PageTitle>共享协作管理</PageTitle>
        <Button 
          type="primary" 
          icon={<BellOutlined />}
          onClick={() => setNotificationModalVisible(true)}
        >
          通知中心
          {unreadCount > 0 && <Badge count={unreadCount} style={{ backgroundColor: '#FF4D4F' }} />}
        </Button>
      </div>

      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16} style={{ height: '32px' }}>
            <Col span={6}>
              <Form.Item label="实验记录名称" name="name"><Input placeholder="请输入实验记录名称" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="共享人" name="sharedBy"><Input placeholder="请输入共享人" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="被共享人" name="sharedTo"><Input placeholder="请输入被共享人" /></Form.Item>
            </Col>
            {expanded && (
              <Col span={6}>
                <Form.Item label="权限类型" name="permission">
                  <Select placeholder="请选择权限">
                    <Option value="all">全部</Option>
                    <Option value="只读">只读</Option>
                    <Option value="可编辑">可编辑</Option>
                    <Option value="可评论">可评论</Option>
                    <Option value="可管理">可管理</Option>
                  </Select>
                </Form.Item>
              </Col>
            )}
            {!expanded && (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset}>重置</Button>
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
              <Col span={6}>
                <Form.Item label="时间范围" name="dateRange">
                  <RangePicker showTime style={{ width: '100%' }} />
                </Form.Item>
              </Col>
              <Col span={6} offset={12}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset}>重置</Button>
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
        <Tabs items={[
          {
            key: '1',
            label: (
              <span>
                <UserOutlined style={{ marginRight: 8 }} />
                共享设置
              </span>
            ),
            children: (
              <div>
                <Button type="primary" style={{ marginBottom: 16 }} icon={<PlusOutlined />} onClick={handleCreate}>
                  设置共享
                </Button>
                <Table 
                  columns={shareColumns} 
                  dataSource={filteredShareData} 
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
              </div>
            ),
          },
          {
            key: '2',
            label: (
              <span>
                <HistoryOutlined style={{ marginRight: 8 }} />
                协作动态
              </span>
            ),
            children: (
              <Table 
                columns={activityColumns} 
                dataSource={filteredActivityData} 
                scroll={{ x: 'max-content' }}
                pagination={{ 
                  pageSize: 10,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 条记录`
                }}
              />
            ),
          },
        ]} />
      </Card>

      <Modal
        title="设置共享"
        open={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleCreateSubmit}>
          <Form.Item label="选择实验记录" name="recordId" rules={[{ required: true, message: '请选择实验记录' }]}>
            <Select placeholder="请选择您有权限的实验记录">
              {myRecords.map(record => (
                <Option key={record.key} value={record.key}>{record.name} ({record.id})</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="添加协作用户" name="sharedTo" rules={[{ required: true, message: '请选择协作用户' }]}>
            <Select mode="multiple" placeholder="请选择协作用户" style={{ width: '100%' }}>
              {labMembers.filter(m => m.name !== currentUser).map(member => (
                <Option key={member.id} value={member.name}>{member.name} ({member.role})</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="权限设置" name="permission" rules={[{ required: true, message: '请选择权限' }]}>
            <Select placeholder="请选择权限">
              <Option value="只读">只读 - 仅查看权限</Option>
              <Option value="可编辑">可编辑 - 可修改记录内容</Option>
              <Option value="可评论">可评论 - 仅添加评论</Option>
              <Option value="可管理">可管理 - 完整管理权限</Option>
            </Select>
          </Form.Item>

          <Form.Item label="是否允许导出" name="allowExport">
            <Select placeholder="请选择" defaultValue={false}>
              <Option value={true}>是 - 允许导出实验记录</Option>
              <Option value={false}>否 - 禁止导出</Option>
            </Select>
          </Form.Item>

          <Form.Item label="有效期（可选）" name="dateRange">
            <RangePicker showTime style={{ width: '100%' }} placeholder={['开始时间', '结束时间（留空表示永久有效）']} />
          </Form.Item>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #E5E5E5' }}>
            <p style={{ color: '#8C8C8C', fontSize: 12, marginBottom: 16 }}>
              共享后，被共享用户将收到通知，可在其协作列表中查看该实验记录。
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button onClick={() => {
                setCreateModalVisible(false)
                form.resetFields()
              }}>取消</Button>
              <Button type="primary" htmlType="submit">确认共享</Button>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal
        title="修改共享"
        open={editModalVisible}
        onCancel={() => {
          setEditModalVisible(false)
          form.resetFields()
        }}
        footer={null}
        width={650}
      >
        <Form form={form} layout="vertical" onFinish={handleEditSubmit}>
          <Form.Item label="当前实验记录" style={{ marginBottom: 24 }}>
            <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
              {currentShare?.recordName} ({currentShare?.recordId})
            </div>
          </Form.Item>

          <Form.Item label="协作用户" name="sharedTo" rules={[{ required: true, message: '请选择协作用户' }]}>
            <Select mode="multiple" placeholder="请选择协作用户" style={{ width: '100%' }}>
              {labMembers.filter(m => m.name !== currentUser).map(member => (
                <Option key={member.id} value={member.name}>{member.name} ({member.role})</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="权限设置" name="permission" rules={[{ required: true, message: '请选择权限' }]}>
            <Select placeholder="请选择权限">
              <Option value="只读">只读 - 仅查看权限</Option>
              <Option value="可编辑">可编辑 - 可修改记录内容</Option>
              <Option value="可评论">可评论 - 仅添加评论</Option>
              <Option value="可管理">可管理 - 完整管理权限</Option>
            </Select>
          </Form.Item>

          <Form.Item label="是否允许导出" name="allowExport">
            <Select placeholder="请选择">
              <Option value={true}>是 - 允许导出实验记录</Option>
              <Option value={false}>否 - 禁止导出</Option>
            </Select>
          </Form.Item>

          <Form.Item label="有效期（可选）" name="dateRange">
            <RangePicker showTime style={{ width: '100%' }} placeholder={['开始时间', '结束时间（留空表示永久有效）']} />
          </Form.Item>

          <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #E5E5E5' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button onClick={() => {
                setEditModalVisible(false)
                form.resetFields()
              }}>取消</Button>
              <Button type="primary" htmlType="submit">保存修改</Button>
            </div>
          </div>
        </Form>
      </Modal>

      <Modal
        title="共享详情"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={650}
      >
        {currentShare && (
          <div>
            <h3 style={{ marginBottom: 20, fontSize: 16, fontWeight: 500 }}>共享信息</h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 24 }}>
              <div><strong>实验记录：</strong>{currentShare.recordName}</div>
              <div><strong>记录ID：</strong>{currentShare.recordId}</div>
              <div><strong>共享人：</strong>{currentShare.sharedBy}</div>
              <div><strong>权限类型：</strong><Tag color={{ '只读': 'blue', '可编辑': 'green', '可评论': 'orange', '可管理': 'purple' }[currentShare.permission]}>{currentShare.permission}</Tag></div>
              <div><strong>允许导出：</strong><Tag color={currentShare.allowExport ? 'green' : 'red'}>{currentShare.allowExport ? '是' : '否'}</Tag></div>
              <div><strong>状态：</strong><Tag color={{ 'active': 'green', 'expired': 'red', 'pending': 'orange' }[currentShare.status]}>{currentShare.status === 'active' ? '有效' : currentShare.status === 'expired' ? '已过期' : '待确认'}</Tag></div>
              <div><strong>开始时间：</strong>{currentShare.startTime}</div>
              <div><strong>结束时间：</strong>{currentShare.endTime || '永久有效'}</div>
            </div>

            <div>
              <h4 style={{ marginBottom: 12, fontSize: 14, fontWeight: 500 }}>协作用户</h4>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {currentShare.sharedTo.map((user, index) => (
                  <Tag key={index} color="blue">{user}</Tag>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
              <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
              <Button type="primary" icon={<EditOutlined />} onClick={() => {
                setDetailModalVisible(false)
                handleEdit(currentShare)
              }}>修改</Button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="确认撤销"
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false)
          setDeleteRecord(null)
        }}
        footer={null}
      >
        <div style={{ padding: 20 }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: '#FFF2F0', display: 'flex', alignItems: 'center', justifyContent: 'center', marginRight: 16 }}>
              <DeleteOutlined style={{ fontSize: 24, color: '#FF4D4F' }} />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: 16, fontWeight: 500 }}>确认撤销共享</h3>
              <p style={{ margin: 4, fontSize: 14, color: '#8C8C8C' }}>此操作将撤销对该实验记录的共享权限</p>
            </div>
          </div>

          <div style={{ padding: 16, backgroundColor: '#F5F5F5', borderRadius: 8, marginBottom: 20 }}>
            <p style={{ margin: '0 0 8px 0' }}><strong>实验记录：</strong>{deleteRecord?.recordName}</p>
            <p style={{ margin: 0 }}><strong>被撤销用户：</strong>{deleteRecord?.sharedTo.join('、')}</p>
          </div>

          <p style={{ color: '#FF4D4F', marginBottom: 20 }}>
            撤销后，上述用户将无法再访问该实验记录，请谨慎操作。
          </p>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button onClick={() => {
              setDeleteModalVisible(false)
              setDeleteRecord(null)
            }}>取消</Button>
            <Button type="primary" danger onClick={confirmDelete}>确认撤销</Button>
          </div>
        </div>
      </Modal>

      <Modal
        title={`通知中心 ${unreadCount > 0 ? `(${unreadCount} 条未读)` : ''}`}
        open={notificationModalVisible}
        onCancel={() => setNotificationModalVisible(false)}
        footer={null}
        width={650}
      >
        <div style={{ paddingBottom: 16, borderBottom: '1px solid #E5E5E5', marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <p style={{ margin: 0, color: '#595959' }}>共 {notifications.length} 条通知</p>
            {unreadCount > 0 && (
              <Button type="text" onClick={markAllAsRead}>全部标为已读</Button>
            )}
          </div>
        </div>

        <div style={{ maxHeight: 500, overflowY: 'auto' }}>
          {notifications.map(notification => (
            <div 
              key={notification.key}
              style={{ 
                padding: 16, 
                borderBottom: '1px solid #F0F0F0',
                backgroundColor: notification.read ? 'transparent' : '#FFFBE6',
                cursor: 'pointer',
                transition: 'background-color 0.2s',
                onClick: () => markAsRead(notification)
              }}
              className="notification-item"
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                <div style={{ 
                  width: 36, 
                  height: 36, 
                  borderRadius: 18, 
                  backgroundColor: notification.type === 'share' ? '#E6F7FF' : notification.type === 'comment' ? '#FFF7E6' : notification.type === 'edit' ? '#F6FFED' : '#FFF0F6',
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {notification.type === 'share' && <UserOutlined style={{ color: '#1890FF' }} />}
                  {notification.type === 'comment' && <MessageOutlined style={{ color: '#FA8C16' }} />}
                  {notification.type === 'edit' && <FileTextOutlined style={{ color: '#52C41A' }} />}
                  {notification.type === 'mention' && <BellOutlined style={{ color: '#EB2F96' }} />}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: '0 0 4px 0', fontSize: 14, fontWeight: 500 }}>{notification.title}</h4>
                  <p style={{ margin: '0 0 8px 0', fontSize: 13, color: '#595959' }}>{notification.message}</p>
                  <p style={{ margin: 0, fontSize: 12, color: '#8C8C8C' }}>{notification.timestamp}</p>
                </div>
                {!notification.read && (
                  <div style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4D4F' }} />
                )}
              </div>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  )
}