import { Card, Table, Button, Space, Tag, Input, Select, Modal, Form, message, Row, Col, Tree, Tabs, Popconfirm, Checkbox } from 'antd'

const { TabPane } = Tabs
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, CopyOutlined, MoreOutlined } from '@ant-design/icons'
import { useThemeStore } from '../../store/themeStore'
import { useState, useRef, useEffect } from 'react'

const { Option } = Select
const { TreeNode } = Tree

interface CategoryNode {
  key: string
  title: string
  children?: CategoryNode[]
  count?: number
  sortOrder?: number
  description?: string
  status?: 'enabled' | 'disabled'
}

export default function KnowledgeCategory() {
  const { isDark } = useThemeStore()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [modalTitle, setModalTitle] = useState('新增分类')
  const [selectedCategory, setSelectedCategory] = useState<CategoryNode | null>(null)
  const [searchText, setSearchText] = useState('')
  const [expandedKeys, setExpandedKeys] = useState<string[]>(['root'])
  const [form] = Form.useForm()
  const [treeData, setTreeData] = useState<CategoryNode[]>([
    {
      key: 'root',
      title: '知识库',
      status: 'enabled',
      children: [
        {
          key: 'safety',
          title: '安全培训',
          status: 'enabled',
          count: 35,
          children: [
            { key: 'safety-lab', title: '实验室安全', count: 15, status: 'enabled' },
            { key: 'safety-chemical', title: '化学品安全', count: 8, status: 'enabled' },
            { key: 'safety-equipment', title: '设备安全', count: 12, status: 'enabled' },
          ],
        },
        {
          key: 'operation',
          title: '操作规程',
          status: 'enabled',
          count: 38,
          children: [
            { key: 'operation-equipment', title: '仪器操作', count: 20, status: 'enabled' },
            { key: 'operation-process', title: '实验流程', count: 18, status: 'enabled' },
          ],
        },
        {
          key: 'technical',
          title: '技术文档',
          status: 'enabled',
          count: 20,
          children: [
            { key: 'technical-analysis', title: '数据分析', count: 12, status: 'enabled' },
            { key: 'technical-coding', title: '编程指南', count: 8, status: 'enabled' },
          ],
        },
        {
          key: 'data',
          title: '数据管理',
          status: 'enabled',
          count: 10,
          children: [
            { key: 'data-collection', title: '数据采集', count: 6, status: 'enabled' },
            { key: 'data-storage', title: '数据存储', count: 4, status: 'enabled' },
          ],
        },
      ],
      count: 103,
    },
  ])

  const [tagData, setTagData] = useState(Array.from({ length: 20 }, (_, i) => ({
    key: String(i + 1),
    name: [`安全`, '实验室', '操作', '指南', '仪器', '数据', '分析', '文档', '培训', '管理'][i % 10] + (i > 9 ? i : ''),
    usageCount: Math.floor(Math.random() * 100) + 10,
    lastUsed: `2024-0${(i % 6) + 1}-${String((i % 28) + 1).padStart(2, '0')}`,
  })))

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const contextMenuRef = useRef<{ visible: boolean; x: number; y: number; node: CategoryNode | null }>({
    visible: false,
    x: 0,
    y: 0,
    node: null,
  })

  const handleContextMenu = (e: React.MouseEvent, node: CategoryNode) => {
    e.preventDefault()
    contextMenuRef.current = {
      visible: true,
      x: e.clientX,
      y: e.clientY,
      node,
    }
  }

  useEffect(() => {
    const handleClick = () => {
      contextMenuRef.current.visible = false
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  const findNode = (data: CategoryNode[], key: string): CategoryNode | null => {
    for (const node of data) {
      if (node.key === key) return node
      if (node.children) {
        const found = findNode(node.children, key)
        if (found) return found
      }
    }
    return null
  }

  const updateNode = (data: CategoryNode[], key: string, updates: Partial<CategoryNode>): CategoryNode[] => {
    return data.map(node => {
      if (node.key === key) {
        return { ...node, ...updates }
      }
      if (node.children) {
        return { ...node, children: updateNode(node.children, key, updates) }
      }
      return node
    })
  }

  const addChildNode = (data: CategoryNode[], parentKey: string, newNode: CategoryNode): CategoryNode[] => {
    return data.map(node => {
      if (node.key === parentKey) {
        return {
          ...node,
          children: [...(node.children || []), newNode],
          count: (node.count || 0) + 1,
        }
      }
      if (node.children) {
        const updated = addChildNode(node.children, parentKey, newNode)
        const countChange = updated.length !== (node.children?.length || 0) ? 1 : 0
        return {
          ...node,
          children: updated,
          count: (node.count || 0) + countChange,
        }
      }
      return node
    })
  }

  const deleteNode = (data: CategoryNode[], key: string): { result: CategoryNode[]; deletedCount: number } => {
    let deletedCount = 0
    const result = data.filter(node => {
      if (node.key === key) {
        deletedCount = node.count || 1
        return false
      }
      if (node.children) {
        const { result: updated, deletedCount: childDeleted } = deleteNode(node.children, key)
        deletedCount += childDeleted
        node.children = updated
        node.count = (node.count || 0) - deletedCount
      }
      return true
    })
    return { result, deletedCount }
  }

  const handleAddRoot = () => {
    setModalTitle('新增根分类')
    form.resetFields({ parentKey: undefined })
    setSelectedCategory(null)
    setIsModalVisible(true)
  }

  const handleAddChild = (parentNode: CategoryNode) => {
    setModalTitle('新增子分类')
    form.resetFields({ parentKey: parentNode.key })
    form.setFieldsValue({ parentKey: parentNode.key, parentTitle: parentNode.title })
    setSelectedCategory(parentNode)
    setIsModalVisible(true)
  }

  const handleEdit = (record: CategoryNode) => {
    setModalTitle('编辑分类')
    form.setFieldsValue({
      name: record.title,
      sortOrder: record.sortOrder || 1,
      description: record.description || '',
      status: record.status || 'enabled',
    })
    setSelectedCategory(record)
    setIsModalVisible(true)
  }

  const handleDelete = (record: CategoryNode) => {
    if (record.key === 'root') {
      message.warning('不能删除根分类')
      return
    }
    const { result, deletedCount } = deleteNode(treeData, record.key)
    setTreeData(result)
    if (selectedCategory?.key === record.key) {
      setSelectedCategory(null)
    }
    message.success(`已删除分类: ${record.title}，包含 ${deletedCount} 篇知识`)
  }

  const handleModalOk = () => {
    form.validateFields().then(values => {
      const newNode: CategoryNode = {
        key: selectedCategory?.key || `category-${Date.now()}`,
        title: values.name,
        sortOrder: values.sortOrder || 1,
        description: values.description || '',
        status: values.status || 'enabled',
        count: 0,
      }

      if (selectedCategory && !form.getFieldValue('parentKey')) {
        setTreeData(updateNode(treeData, selectedCategory.key, {
          title: values.name,
          sortOrder: values.sortOrder,
          description: values.description,
          status: values.status,
        }))
        if (selectedCategory === selectedCategory) {
          setSelectedCategory({ ...selectedCategory, ...newNode })
        }
        message.success(`已更新分类: ${values.name}`)
      } else {
        const parentKey = form.getFieldValue('parentKey') || 'root'
        setTreeData(addChildNode(treeData, parentKey, newNode))
        message.success(`已新增分类: ${values.name}`)
      }
      setIsModalVisible(false)
    })
  }

  const handleSaveDetail = () => {
    if (!selectedCategory) return
    message.success('分类详情已保存')
  }

  const handleTransferKnowledge = () => {
    if (!selectedCategory) return
    message.info('转移知识功能开发中')
  }

  const handleTagEdit = (record: any) => {
    message.info(`编辑标签: ${record.name}`)
  }

  const handleTagDelete = (record: any) => {
    setTagData(tagData.filter(t => t.key !== record.key))
    message.success(`已删除标签: ${record.name}`)
  }

  const renderTreeNodes = (data: CategoryNode[]) =>
    data.map(item => {
      const title = (
        <div 
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}
          onContextMenu={(e) => handleContextMenu(e, item)}
        >
          <span>{item.title}</span>
          <span style={{ fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C' }}>{item.count || 0}篇</span>
        </div>
      )
      if (item.children) {
        return (
          <TreeNode title={title} key={item.key} dataRef={item}>
            {renderTreeNodes(item.children)}
          </TreeNode>
        )
      }
      return <TreeNode title={title} key={item.key} dataRef={item} />
    })

  const tagColumns = [
    {
      title: (
        <Checkbox
          checked={selectedTags.length === tagData.length && tagData.length > 0}
          indeterminate={selectedTags.length > 0 && selectedTags.length < tagData.length}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedTags(tagData.map(t => t.key))
            } else {
              setSelectedTags([])
            }
          }}
        />
      ),
      key: 'selection',
      width: 50,
      render: (_: any, record: any) => (
        <Checkbox
          checked={selectedTags.includes(record.key)}
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedTags([...selectedTags, record.key])
            } else {
              setSelectedTags(selectedTags.filter(k => k !== record.key))
            }
          }}
        />
      ),
    },
    { title: '标签名称', dataIndex: 'name', key: 'name' },
    { title: '使用次数', dataIndex: 'usageCount', key: 'usageCount' },
    { title: '最后使用时间', dataIndex: 'lastUsed', key: 'lastUsed' },
    {
      title: '操作',
      key: 'action',
      width: 160,
      render: (_: any, record: any) => (
        <Space size="small">
          <Button type="text" size="small" icon={<EditOutlined />} onClick={() => handleTagEdit(record)}>编辑</Button>
          <Popconfirm
            title={`确定删除标签 "${record.name}" 吗？`}
            onConfirm={() => handleTagDelete(record)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const currentTreeData = searchText
    ? treeData
    : treeData

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <h1 style={{ fontSize: 20, fontWeight: 500, color: isDark ? '#FFFFFF' : '#000000', marginBottom: 0 }}>
        分类管理
      </h1>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Tabs defaultActiveKey="category">
          <TabPane tab="分类管理" key="category">
            <Row gutter={20}>
              <Col span={12}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button onClick={() => setExpandedKeys(treeData[0].children?.map((c: CategoryNode) => c.key) || [])}>全部展开</Button>
                    <Button onClick={() => setExpandedKeys([])}>全部折叠</Button>
                  </div>
                  <Button type="primary" icon={<PlusOutlined />} onClick={handleAddRoot}>新增根分类</Button>
                </div>
                <Input
                  placeholder="搜索分类"
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  style={{ marginBottom: 16 }}
                />
                <Tree
                  expandedKeys={expandedKeys}
                  onExpand={(keys) => setExpandedKeys(keys as string[])}
                  onSelect={(selectedKeys) => {
                    const key = selectedKeys[0] as string
                    setSelectedCategory(findNode(treeData, key))
                  }}
                  showLine
                  style={{ background: isDark ? '#141414' : '#FFFFFF', borderRadius: 8, padding: 16 }}
                >
                  {renderTreeNodes(currentTreeData)}
                </Tree>
                <p style={{ fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C', marginTop: 8 }}>
                  右键点击分类可添加子分类
                </p>
              </Col>
              <Col span={12}>
                <div style={{ padding: 20, background: isDark ? '#1D1D1D' : '#F9F9F9', borderRadius: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 500 }}>分类详情</h3>
                    {selectedCategory && selectedCategory.key !== 'root' && (
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(selectedCategory)}>编辑</Button>
                        <Popconfirm
                          title={`确定删除分类 "${selectedCategory.title}" 吗？`}
                          onConfirm={() => handleDelete(selectedCategory)}
                          okText="确定"
                          cancelText="取消"
                        >
                          <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
                        </Popconfirm>
                      </div>
                    )}
                  </div>
                  {selectedCategory ? (
                    <Form layout="vertical">
                      <Form.Item label="分类名称">
                        <Input value={selectedCategory.title} disabled />
                      </Form.Item>
                      <Form.Item label="父级分类">
                        <Input value={selectedCategory.key === 'root' ? '无' : '知识库'} disabled />
                      </Form.Item>
                      <Form.Item label="关联知识数量">
                        <Input value={selectedCategory.count || 0} disabled />
                      </Form.Item>
                      <Form.Item label="排序序号" name="sortOrder" initialValue={selectedCategory.sortOrder || 1}>
                        <Input type="number" placeholder="决定同级分类中的显示顺序" />
                      </Form.Item>
                      <Form.Item label="分类描述" name="description" initialValue={selectedCategory.description || ''}>
                        <Input.TextArea rows={3} placeholder="请输入分类描述，不超过200字" />
                      </Form.Item>
                      <Form.Item label="状态" name="status" initialValue={selectedCategory.status || 'enabled'}>
                        <Select>
                          <Option value="enabled">启用</Option>
                          <Option value="disabled">禁用</Option>
                        </Select>
                      </Form.Item>
                      <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                        <Button type="primary" onClick={handleSaveDetail}>保存</Button>
                        {selectedCategory.key !== 'root' && (
                          <Button onClick={handleTransferKnowledge}>转移知识</Button>
                        )}
                      </div>
                    </Form>
                  ) : (
                    <div style={{ textAlign: 'center', padding: 40, color: isDark ? '#7E7E7E' : '#8C8C8C' }}>
                      <MoreOutlined style={{ fontSize: 48, marginBottom: 16, opacity: 0.5 }} />
                      <p>请选择一个分类查看详情</p>
                    </div>
                  )}
                </div>
              </Col>
            </Row>
          </TabPane>
          <TabPane tab="标签管理" key="tags">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ display: 'flex', gap: 8 }}>
                <Input placeholder="搜索标签" style={{ width: 200 }} />
                <Button type="primary">添加标签</Button>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Popconfirm
                  title={`确定删除选中的 ${selectedTags.length} 个标签吗？`}
                  onConfirm={() => {
                    setTagData(tagData.filter(t => !selectedTags.includes(t.key)))
                    setSelectedTags([])
                    message.success(`已删除 ${selectedTags.length} 个标签`)
                  }}
                  okText="确定"
                  cancelText="取消"
                  disabled={selectedTags.length === 0}
                >
                  <Button disabled={selectedTags.length === 0}>批量删除</Button>
                </Popconfirm>
                <Button disabled={selectedTags.length < 2}>批量合并</Button>
              </div>
            </div>
            <Table
              columns={tagColumns}
              dataSource={tagData}
              pagination={{ pageSize: 10, showSizeChanger: true, showQuickJumper: true }}
            />
          </TabPane>
        </Tabs>
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
          <Form.Item label="分类名称" name="name" rules={[{ required: true, message: '请输入分类名称' }]}>
            <Input placeholder="请输入分类名称" />
          </Form.Item>
          {selectedCategory && (
            <Form.Item label="父级分类">
              <Input value={selectedCategory.title} disabled />
              <Form.Item name="parentKey" hidden>
                <Input value={selectedCategory.key} />
              </Form.Item>
            </Form.Item>
          )}
          <Form.Item label="排序序号" name="sortOrder" initialValue="1">
            <Input type="number" placeholder="决定同级分类中的显示顺序" />
          </Form.Item>
          <Form.Item label="分类描述" name="description">
            <Input.TextArea rows={3} placeholder="请输入分类描述，不超过200字" />
          </Form.Item>
          <Form.Item label="状态" name="status" initialValue="enabled">
            <Select>
              <Option value="enabled">启用</Option>
              <Option value="disabled">禁用</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {contextMenuRef.current.visible && contextMenuRef.current.node && (
        <div
          style={{
            position: 'fixed',
            left: contextMenuRef.current.x,
            top: contextMenuRef.current.y,
            background: isDark ? '#1D1D1D' : '#FFFFFF',
            border: `1px solid ${isDark ? '#373737' : '#E5E5E5'}`,
            borderRadius: 8,
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 9999,
            minWidth: 120,
          }}
        >
          <Button
            type="text"
            block
            icon={<PlusOutlined />}
            onClick={() => {
              handleAddChild(contextMenuRef.current.node!)
              contextMenuRef.current.visible = false
            }}
            style={{ textAlign: 'left', padding: '8px 16px' }}
          >
            新增子分类
          </Button>
          {contextMenuRef.current.node.key !== 'root' && (
            <Button
              type="text"
              block
              icon={<EditOutlined />}
              onClick={() => {
                handleEdit(contextMenuRef.current.node!)
                contextMenuRef.current.visible = false
              }}
              style={{ textAlign: 'left', padding: '8px 16px' }}
            >
              编辑分类
            </Button>
          )}
          {contextMenuRef.current.node.key !== 'root' && (
            <Popconfirm
              title={`确定删除分类 "${contextMenuRef.current.node.title}" 吗？`}
              onConfirm={() => {
                handleDelete(contextMenuRef.current.node!)
                contextMenuRef.current.visible = false
              }}
              okText="确定"
              cancelText="取消"
            >
              <Button
                type="text"
                block
                danger
                icon={<DeleteOutlined />}
                style={{ textAlign: 'left', padding: '8px 16px' }}
              >
                删除分类
              </Button>
            </Popconfirm>
          )}
        </div>
      )}
    </div>
  )
}