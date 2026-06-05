import { Card, Form, Input, Button, Table, Space, Tag, message, DatePicker, Select, Modal, Upload, Divider, Radio, Col } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined, UploadOutlined, CheckOutlined, XOutlined } from '@ant-design/icons'
import { useState } from 'react'
import SearchForm from '../../components/SearchForm/SearchForm'
import PageTitle from '../../components/PageTitle/PageTitle'

const { RangePicker } = DatePicker
const { Option } = Select
const { TextArea } = Input

export default function AchievementManagement() {
  const [searchForm] = Form.useForm()
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [uploadForm] = Form.useForm()
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null)
  const [selectedType, setSelectedType] = useState('论文')

  const columns = [
    { title: '成果名称', dataIndex: 'name', key: 'name', onClick: (_: unknown, record: { key: string; name: string; type: string; author: string; project: string; date: string; journal: string }) => handleViewDetail(record) },
    { 
      title: '成果类型', 
      dataIndex: 'type', 
      key: 'type',
      render: (type: string) => {
        const colorMap: Record<string, string> = {
          '论文': 'blue',
          '专利': 'green',
          '著作': 'purple',
          '软件著作权': 'orange',
          '标准': 'cyan',
          '获奖': 'red',
          '其他': 'gray',
        }
        return <Tag color={colorMap[type]}>{type}</Tag>
      }
    },
    { title: '作者/发明人', dataIndex: 'author', key: 'author' },
    { title: '所属项目', dataIndex: 'project', key: 'project' },
    { title: '发表/授权时间', dataIndex: 'date', key: 'date' },
    { title: '发表期刊/专利号', dataIndex: 'journal', key: 'journal' },
    { 
      title: '附件', 
      dataIndex: 'attachment', 
      key: 'attachment',
      render: () => <Button type="primary" variant="solid">下载预览</Button>
    },
    {
      title: '操作',
      key: 'action',
      width: 200,
      fixed: 'right' as const,
      render: (_: unknown, record: { key: string; name: string; type: string; author: string; project: string; date: string; journal: string }) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>详情</Button>
          <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
        </Space>
      ),
    },
  ]

  const data = Array.from({ length: 100 }, (_, i) => {
    const types = ['论文', '专利', '著作', '软件著作权', '标准', '获奖']
    const authors = [['张医生', '李医生'], ['王医生', '赵医生'], ['张医生'], ['李医生', '王医生', '赵医生'], ['王医生'], ['赵医生', '钱医生']]
    const projects = ['肺癌早期诊断研究', '肿瘤免疫治疗临床研究', '基因检测技术研究', '肝癌早筛研究', '免疫治疗新方案', '精准医学应用', '大数据分析平台', '新药临床试验']
    const journals = ['Cancer Research', 'Nature Medicine', 'Cell', 'Lancet Oncology', 'JCO', 'Clinical Cancer Research', 'ZL202610123456.7', '科学出版社', '人民卫生出版社']
    return {
      key: String(i + 1),
      name: ['基于AI的肿瘤早期诊断研究', '新型肿瘤标志物检测试剂盒', '肿瘤免疫治疗临床指南', '精准医疗大数据平台', '智能诊断系统', '新型靶向药物研究', '手术机器人技术', '远程医疗平台'][i % 8],
      type: types[i % types.length],
      author: authors[i % authors.length].join('、'),
      project: projects[i % projects.length],
      date: `2026-0${1 + (i % 8)}-${String(10 + (i % 15)).padStart(2, '0')}`,
      journal: journals[i % journals.length],
      attachment: `${['paper', 'patent', 'book', 'software', 'standard', 'award'][i % 6]}.pdf`,
    }
  })

  const handleViewDetail = (record: any) => {
    setSelectedAchievement(record)
    setShowDetailModal(true)
  }

  const handleEdit = (record: any) => {
    setSelectedAchievement(record)
    setSelectedType(record.type)
    uploadForm.setFieldsValue({
      name: record.name,
      type: record.type,
      author: record.author,
    })
    setShowEditModal(true)
  }

  const handleDelete = (record: any) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定删除成果【${record.name}】吗？`,
      onOk: () => {
        message.success('成果已删除')
      }
    })
  }

  const handleUpload = () => {
    setSelectedType('论文')
    uploadForm.resetFields()
    setShowUploadModal(true)
  }

  const handleSaveUpload = () => {
    message.success('成果上传成功')
    setShowUploadModal(false)
    uploadForm.resetFields()
  }

  const handleSaveEdit = () => {
    message.success('成果信息已更新')
    setShowEditModal(false)
    uploadForm.resetFields()
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <PageTitle>成果管理</PageTitle>

      <SearchForm 
        onSearch={() => {}}
        onReset={() => searchForm.resetFields()}
        expandedFields={
          <>
            <Col span={6}>
              <Form.Item label="作者/发明人" name="author"><Input placeholder="请输入作者" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="发表时间" name="dateRange">
                <RangePicker style={{ width: '100%', zIndex: 9999 }} />
              </Form.Item>
            </Col>
          </>
        }
      >
        <Col span={6}>
          <Form.Item label="成果名称" name="name"><Input placeholder="请输入成果名称" /></Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="成果类型" name="type">
            <Select placeholder="请选择类型">
              <Option value="all">全部</Option>
              <Option value="paper">论文</Option>
              <Option value="patent">专利</Option>
              <Option value="book">著作</Option>
              <Option value="software">软件著作权</Option>
              <Option value="standard">标准</Option>
              <Option value="award">获奖</Option>
              <Option value="other">其他</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item label="所属项目" name="project">
            <Select placeholder="请选择项目">
              <Option value="all">全部</Option>
              <Option value="PRJ2026001">肺癌早期诊断研究</Option>
              <Option value="PRJ2026002">肿瘤免疫治疗临床研究</Option>
              <Option value="PRJ2026003">基因检测技术研究</Option>
              <Option value="PRJ2026004">肝癌早筛研究</Option>
              <Option value="PRJ2026005">免疫治疗新方案</Option>
              <Option value="PRJ2026006">精准医学应用</Option>
              <Option value="PRJ2026007">大数据分析平台</Option>
              <Option value="PRJ2026008">新药临床试验</Option>
            </Select>
          </Form.Item>
        </Col>
      </SearchForm>

      <Card style={{ borderRadius: 10 }} bodyStyle={{ padding: 20 }}>
        <Button type="primary" icon={<PlusOutlined />} style={{ marginBottom: 16 }} onClick={handleUpload}>
          上传成果
        </Button>
        <Table 
          columns={columns} 
          dataSource={data}
          rowSelection={{
            type: 'checkbox',
            onChange: (selectedRowKeys) => setSelectedRows(selectedRowKeys as string[])
          }}
        />
      </Card>

      <Modal
        title="上传成果"
        open={showUploadModal}
        onCancel={() => setShowUploadModal(false)}
        footer={null}
        width={700}
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Form form={uploadForm} layout="vertical">
          <h3 style={{ marginBottom: 16 }}>通用字段</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <Form.Item label="所属项目" name="project" rules={[{ required: true }]}>
              <Select placeholder="请选择所属项目">
                <Option value="PRJ2026001">肺癌早期诊断研究</Option>
                <Option value="PRJ2026002">肿瘤免疫治疗临床研究</Option>
                <Option value="PRJ2026003">基因检测技术研究</Option>
              </Select>
            </Form.Item>
            <Form.Item label="成果类型" name="type" rules={[{ required: true }]}>
              <Select placeholder="请选择成果类型" onChange={(value) => setSelectedType(value)}>
                <Option value="论文">论文</Option>
                <Option value="专利">专利</Option>
                <Option value="著作">著作</Option>
                <Option value="软件著作权">软件著作权</Option>
                <Option value="标准">标准</Option>
                <Option value="获奖">获奖</Option>
                <Option value="其他">其他</Option>
              </Select>
            </Form.Item>
            <Form.Item label="成果名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入成果名称" />
            </Form.Item>
            <Form.Item label="所属学科" name="subject">
              <Select placeholder="请选择所属学科">
                <Option value="肿瘤学">肿瘤学</Option>
                <Option value="病理学">病理学</Option>
                <Option value="免疫学">免疫学</Option>
              </Select>
            </Form.Item>
          </div>

          <Form.Item label="关键词" name="keywords">
            <Select mode="tags" placeholder="输入关键词后回车" />
          </Form.Item>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <Form.Item label="成果状态" name="status">
              <Select placeholder="请选择成果状态">
                <Option value="已发表/授权">已发表/授权</Option>
                <Option value="申请中">申请中</Option>
                <Option value="审核中">审核中</Option>
                <Option value="已录用">已录用</Option>
              </Select>
            </Form.Item>
            <Form.Item label="是否公开" name="public">
              <Radio.Group>
                <Radio value="是">是</Radio>
                <Radio value="否">否</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          {selectedType === '论文' && (
            <>
              <Divider />
              <h3 style={{ marginBottom: 16 }}>论文</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item label="作者" name="author" rules={[{ required: true }]}>
                  <Input placeholder="请输入作者" />
                </Form.Item>
                <Form.Item label="第一作者" name="firstAuthor" rules={[{ required: true }]}>
                  <Input placeholder="请输入第一作者" />
                </Form.Item>
                <Form.Item label="通讯作者" name="correspondingAuthor">
                  <Input placeholder="请输入通讯作者" />
                </Form.Item>
                <Form.Item label="发表期刊" name="journal" rules={[{ required: true }]}>
                  <Input placeholder="请输入发表期刊" />
                </Form.Item>
                <Form.Item label="ISSN" name="issn">
                  <Input placeholder="请输入ISSN" />
                </Form.Item>
                <Form.Item label="发表时间" name="publishDate" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="卷期页码" name="volume">
                  <Input placeholder="请输入卷期页码" />
                </Form.Item>
                <Form.Item label="收录情况" name="index">
                  <Select placeholder="请选择收录情况">
                    <Option value="SCI">SCI</Option>
                    <Option value="EI">EI</Option>
                    <Option value="核心">核心</Option>
                    <Option value="普通">普通</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="影响因子" name="impactFactor">
                  <Input type="number" placeholder="请输入影响因子" />
                </Form.Item>
                <Form.Item label="被引次数" name="citations">
                  <Input type="number" placeholder="被引次数" />
                </Form.Item>
              </div>
            </>
          )}

          {selectedType === '专利' && (
            <>
              <Divider />
              <h3 style={{ marginBottom: 16 }}>专利特有字段</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item label="发明人" name="inventor" rules={[{ required: true }]}>
                  <Input placeholder="请输入发明人" />
                </Form.Item>
                <Form.Item label="专利权人" name="patentee" rules={[{ required: true }]}>
                  <Input placeholder="请输入专利权人" />
                </Form.Item>
                <Form.Item label="申请号" name="applicationNo" rules={[{ required: true }]}>
                  <Input placeholder="请输入申请号" />
                </Form.Item>
                <Form.Item label="授权号" name="authorizationNo">
                  <Input placeholder="请输入授权号" />
                </Form.Item>
                <Form.Item label="申请日" name="applicationDate" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="授权公告日" name="authorizationDate">
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="专利类型" name="patentType">
                  <Select placeholder="请选择专利类型">
                    <Option value="发明">发明</Option>
                    <Option value="实用新型">实用新型</Option>
                    <Option value="外观设计">外观设计</Option>
                  </Select>
                </Form.Item>
              </div>
            </>
          )}

          {selectedType === '著作' && (
            <>
              <Divider />
              <h3 style={{ marginBottom: 16 }}>著作特有字段</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item label="作者" name="bookAuthor" rules={[{ required: true }]}>
                  <Input placeholder="请输入作者" />
                </Form.Item>
                <Form.Item label="出版社" name="publisher" rules={[{ required: true }]}>
                  <Input placeholder="请输入出版社" />
                </Form.Item>
                <Form.Item label="出版时间" name="publishDate" rules={[{ required: true }]}>
                  <DatePicker style={{ width: '100%' }} />
                </Form.Item>
                <Form.Item label="ISBN号" name="isbn" rules={[{ required: true }]}>
                  <Input placeholder="请输入ISBN号" />
                </Form.Item>
                <Form.Item label="总字数" name="wordCount">
                  <Input type="number" placeholder="单位：千字" />
                </Form.Item>
              </div>
            </>
          )}

          <Divider />
          <Form.Item label="附件" name="attachment">
            <Upload.Dragger>
              <p className="ant-upload-drag-icon"><UploadOutlined /></p>
              <p className="ant-upload-text">点击或拖拽文件到此处上传（支持PDF/Word/图片）</p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item label="备注" name="remark">
            <TextArea rows={3} placeholder="请输入备注" />
          </Form.Item>

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" onClick={handleSaveUpload} icon={<CheckOutlined />}>提交</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setShowUploadModal(false)} icon={<XOutlined />}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="编辑成果"
        open={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
        width={700}
        bodyStyle={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        <Form form={uploadForm} layout="vertical">
          <h3 style={{ marginBottom: 16 }}>通用字段</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <Form.Item label="所属项目" name="project" rules={[{ required: true }]}>
              <Select placeholder="请选择所属项目">
                <Option value="PRJ2026001">肺癌早期诊断研究</Option>
                <Option value="PRJ2026002">肿瘤免疫治疗临床研究</Option>
              </Select>
            </Form.Item>
            <Form.Item label="成果类型" name="type" rules={[{ required: true }]}>
              <Select placeholder="请选择成果类型" onChange={(value) => setSelectedType(value)}>
                <Option value="论文">论文</Option>
                <Option value="专利">专利</Option>
                <Option value="著作">著作</Option>
              </Select>
            </Form.Item>
            <Form.Item label="成果名称" name="name" rules={[{ required: true }]}>
              <Input placeholder="请输入成果名称" />
            </Form.Item>
          </div>

          {selectedType === '论文' && (
            <>
              <Divider />
              <h3 style={{ marginBottom: 16 }}>论文</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <Form.Item label="作者" name="author" rules={[{ required: true }]}>
                  <Input placeholder="请输入作者" />
                </Form.Item>
                <Form.Item label="发表期刊" name="journal" rules={[{ required: true }]}>
                  <Input placeholder="请输入发表期刊" />
                </Form.Item>
              </div>
            </>
          )}

          <Form.Item style={{ marginTop: 20 }}>
            <Button type="primary" onClick={handleSaveEdit} icon={<CheckOutlined />}>提交</Button>
            <Button style={{ marginLeft: 8 }} onClick={() => setShowEditModal(false)} icon={<XOutlined />}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title={`成果详情 - ${selectedAchievement?.name}`}
        open={showDetailModal}
        onCancel={() => setShowDetailModal(false)}
        footer={null}
        width={600}
      >
        <div style={{ padding: 20 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><strong>成果类型：</strong>{selectedAchievement?.type}</div>
            <div><strong>作者/发明人：</strong>{selectedAchievement?.author}</div>
            <div><strong>所属项目：</strong>{selectedAchievement?.project}</div>
            <div><strong>发表/授权时间：</strong>{selectedAchievement?.date}</div>
            <div><strong>发表期刊/专利号：</strong>{selectedAchievement?.journal}</div>
          </div>
          <Divider />
          <div>
            <strong>附件：</strong>
            <Button type="primary" variant="solid">下载预览</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}