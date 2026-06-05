import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Popconfirm, Row, Col, Progress } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, Trash2Outlined, FileZipOutlined, DatabaseOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'
import { useState } from 'react'

const { Option } = Select

export default function StorageManagement() {
  const { isDark } = useThemeStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新建规则')
  const [form] = Form.useForm()

  const handleCreate = () => {
    setModalTitle('新建规则')
    form.resetFields()
    setIsModalVisible(true)
  }

  const handleEdit = (record: any) => {
    setModalTitle('编辑规则')
    form.setFieldsValue(record)
    setIsModalVisible(true)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      console.log('表单数据:', values)
      message.success('保存成功')
      setIsModalVisible(false)
    })
  }

  const lifecycleColumns = [
    { title: '规则名称', dataIndex: 'name', key: 'name', ellipsis: true },
    { title: '数据范围', dataIndex: 'scope', key: 'scope', ellipsis: true },
    {
      title: '执行动作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
      render: (val: string) => {
        const color = val === '删除' ? 'red' : val === '压缩归档' ? 'orange' : 'blue'
        return <Tag color={color}>{val}</Tag>
      },
    },
    { title: '执行周期', dataIndex: 'frequency', key: 'frequency', width: 100, render: (val: string) => <Tag color="green">{val}</Tag> },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 80,
      render: (status: string) => <Tag color={status === '启用' ? 'green' : 'default'}>{status}</Tag>,
    },
    {
      title: '操作',
      key: 'action',
      width: 160,
      fixed: 'right' as const,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Popconfirm title="确定删除该规则吗？" onConfirm={() => message.success('删除成功')}>
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const lifecycleData = Array.from({ length: 5 }, (_, i) => ({
    key: String(i + 1),
    name: [`自动清理临时文件`, '压缩归档历史数据', '转冷存储', '定期删除日志', '清理过期备份'][i],
    scope: ['未标记为"长期保存"的原始文件', '超过30天的日志文件', '超过90天的数据', '超过7天的临时文件', '超过365天的归档数据'][i],
    action: ['删除', '压缩归档', '转冷存储', '删除', '压缩归档'][i],
    frequency: ['每天', '每周', '每月', '每天', '每季度'][i],
    status: i % 4 === 0 ? '禁用' : '启用',
  }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        存储管理
      </h1>

      <Card style={{ borderRadius: 10 }} styles={{ body: { padding: 20 } }}>
        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>存储概览</h3>
          <Row gutter={20}>
            <Col span={12}>
              <div style={{ padding: 20, background: isDark ? '#1D1D1D' : '#F9F9F9', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <DatabaseOutlined style={{ fontSize: 28, color: '#177DDC' }} />
                  <div>
                    <div style={{ fontSize: 12, color: isDark ? '#ADADAD' : '#8C8C8C' }}>总存储空间</div>
                    <div style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#262626' }}>已用 3.2TB / 总计 10TB</div>
                  </div>
                </div>
                <Progress percent={32} strokeColor="#177DDC" />
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: 20, background: isDark ? '#1D1D1D' : '#F9F9F9', borderRadius: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                  <FileZipOutlined style={{ fontSize: 28, color: '#49AA19' }} />
                  <div>
                    <div style={{ fontSize: 12, color: isDark ? '#ADADAD' : '#8C8C8C' }}>标准化存储根目录</div>
                    <div style={{ fontSize: 14, fontWeight: 500, color: isDark ? '#FFFFFF' : '#262626' }}>/data/standard/</div>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 20 }}>
                  <div>
                    <div style={{ fontSize: 12, color: isDark ? '#ADADAD' : '#8C8C8C' }}>归档策略</div>
                    <div style={{ fontSize: 13, color: isDark ? '#DCDCDC' : '#595959' }}>按日期自动分区(年/月/日)</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: isDark ? '#ADADAD' : '#8C8C8C' }}>默认存储格式</div>
                    <div style={{ fontSize: 13, color: isDark ? '#DCDCDC' : '#595959' }}>Parquet</div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>数据生命周期规则</h3>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'flex-start' }}>
            <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
              新建规则
            </Button>
          </div>
          <Table
            columns={lifecycleColumns}
            dataSource={lifecycleData}
            scroll={{ x: 'max-content' }}
            pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
          />
        </div>

        <div>
          <h3 style={{ fontSize: 16, fontWeight: 500, marginBottom: 16 }}>存储监控趋势</h3>
          <div style={{ padding: 20, background: isDark ? '#1D1D1D' : '#F9F9F9', borderRadius: 8 }}>
            <div style={{ display: 'flex', gap: 24 }}>
              <div style={{ flex: 2 }}>
                <div style={{ fontSize: 14, color: isDark ? '#ADADAD' : '#8C8C8C', marginBottom: 12 }}>近7天存储使用量变化</div>
                <div style={{ height: 150, display: 'flex', alignItems: 'flex-end', gap: 16, paddingBottom: 10 }}>
                  {Array.from({ length: 7 }, (_, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <div style={{ width: '100%', backgroundColor: '#177DDC', borderRadius: 4, transition: 'height 0.3s', height: `${20 + Math.random() * 80}%`, minHeight: 10 }}></div>
                      <div style={{ fontSize: 11, color: isDark ? '#7E7E7E' : '#8C8C8C', marginTop: 8 }}>
                        {['周一', '周二', '周三', '周四', '周五', '周六', '周日'][i]}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: isDark ? '#ADADAD' : '#8C8C8C', marginBottom: 12 }}>文件类型分布</div>
                <div style={{ height: 120, width: 120, borderRadius: '50%', background: 'conic-gradient(#177DDC 216deg, #49AA19 216deg 306deg, #D89614 306deg 360deg)', position: 'relative', margin: '0 auto' }}>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 70, height: 70, borderRadius: '50%', background: isDark ? '#1D1D1D' : '#F9F9F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: isDark ? '#FFFFFF' : '#262626' }}>100%</div>
                    </div>
                  </div>
                </div>
                <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, backgroundColor: '#177DDC', borderRadius: 2 }}></div>
                    <span style={{ fontSize: 12, color: isDark ? '#DCDCDC' : '#595959' }}>原始数据 60%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, backgroundColor: '#49AA19', borderRadius: 2 }}></div>
                    <span style={{ fontSize: 12, color: isDark ? '#DCDCDC' : '#595959' }}>标准化数据 35%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 12, height: 12, backgroundColor: '#D89614', borderRadius: 2 }}></div>
                    <span style={{ fontSize: 12, color: isDark ? '#DCDCDC' : '#595959' }}>日志 5%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <Modal
        title={modalTitle}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        width={500}
        okText="保存"
        cancelText="取消"
      >
        <Form form={form} layout="vertical">
          <Form.Item label="规则名称" name="name" rules={[{ required: true, message: '请输入规则名称' }]}>
            <Input placeholder="请输入规则名称" />
          </Form.Item>
          <Form.Item label="数据范围" name="scope" rules={[{ required: true, message: '请输入数据范围' }]}>
            <Input.TextArea rows={3} placeholder="请输入数据范围描述" />
          </Form.Item>
          <Form.Item label="执行动作" name="action" rules={[{ required: true, message: '请选择执行动作' }]}>
            <Select placeholder="请选择执行动作">
              <Option value="delete">删除</Option>
              <Option value="archive">压缩归档</Option>
              <Option value="cold">转冷存储</Option>
            </Select>
          </Form.Item>
          <Form.Item label="执行周期" name="frequency" rules={[{ required: true, message: '请选择执行周期' }]}>
            <Select placeholder="请选择执行周期">
              <Option value="daily">每天</Option>
              <Option value="weekly">每周</Option>
              <Option value="monthly">每月</Option>
              <Option value="quarterly">每季度</Option>
            </Select>
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue="启用">
            <Select>
              <Option value="启用">启用</Option>
              <Option value="禁用">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
