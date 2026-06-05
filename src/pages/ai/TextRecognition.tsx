import { useState } from 'react'
import { Upload, Button, Card, Table, Tag, message, Empty, Divider, Row, Col, Form, Space, Modal } from 'antd'
import { UploadOutlined, FileTextOutlined, EyeOutlined, DownloadOutlined, DeleteOutlined, CopyOutlined, CheckCircleOutlined, ExclamationCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import type { UploadProps } from 'antd'
import dayjs from 'dayjs'
import PageTitle from '../../components/PageTitle/PageTitle'

interface RecognitionRecord {
  id: string
  fileName: string
  fileType: string
  uploadTime: string
  status: 'completed' | 'processing' | 'failed'
  summary: string
  keywords: string[]
  entities: { name: string; type: string }[]
  content: string
  totalFields: number
  highConfidence: number
  needsReview: number
  lowConfidence: number
}

const mockRecords: RecognitionRecord[] = [
  {
    id: 'TR-001',
    fileName: '2026年第一季度肿瘤药物研究报告.pdf',
    fileType: 'PDF',
    uploadTime: '2026-05-28 14:30:22',
    status: 'completed',
    summary: '本报告系统阐述了2026年第一季度肿瘤药物研发的核心成果。研究团队成功筛选出新型小分子化合物"药物X"，通过体外细胞实验证实其在10μM浓度下对HCT116结肠癌细胞的抑制率达78.5%。报告详细记录了实验设计、数据采集与统计分析全过程，并提出下一阶段的临床试验方案建议。',
    keywords: ['肿瘤药物', '药物筛选', '细胞实验', 'HCT116', '抑制率', '临床试验'],
    entities: [
      { name: '药物X', type: '药物' },
      { name: 'HCT116细胞系', type: '生物实体' },
      { name: '78.5%', type: '数值' },
      { name: '10μM', type: '浓度' },
      { name: '2026年第一季度', type: '时间范围' },
    ],
    content: '肿瘤药物研究报告\n报告编号：TRC-2026-Q1-001\n编制日期：2026年5月28日\n\n摘要\n本研究旨在筛选具有抗肿瘤活性的新型小分子化合物。通过高通量筛选平台，从10000个化合物库中筛选出候选药物X，并进行了系统的体外活性评价。\n\n一、材料与方法\n1. 细胞系：HCT116人结肠癌细胞系（ATCC编号：CCL-247）\n2. 培养条件：RPMI-1640培养基，10%胎牛血清，37℃，5%CO2\n3. 药物处理：药物X浓度梯度为0、1、5、10、20μM\n4. 检测方法：CCK-8细胞增殖检测法\n5. 培养时间：72小时\n\n二、实验结果\n| 药物浓度 | 细胞存活率 | 抑制率 |\n|---------|-----------|--------|\n| 0μM | 100% | - |\n| 1μM | 85.2% | 14.8% |\n| 5μM | 52.3% | 47.7% |\n| 10μM | 21.5% | 78.5% |\n| 20μM | 15.8% | 84.2% |\n\n三、结论\n药物X在10μM浓度下表现出显著的肿瘤细胞抑制效果，IC50值为6.8μM。建议进一步开展体内动物实验和毒理学研究。',
    totalFields: 25,
    highConfidence: 20,
    needsReview: 3,
    lowConfidence: 2,
  },
  {
    id: 'TR-002',
    fileName: 'CRISPR-Cas9基因编辑技术最新进展综述.docx',
    fileType: 'DOCX',
    uploadTime: '2026-05-27 09:15:33',
    status: 'completed',
    summary: '本文全面综述了CRISPR-Cas9基因编辑技术的发展历程与最新突破。从原核生物免疫系统发现到基因编辑工具开发，系统梳理了技术演进脉络。重点分析了近年来在基因治疗、农业生物技术和基础科学研究领域的典型应用案例，包括EXaVecta公司的β-地中海贫血基因治疗临床试验和中国农科院的抗虫水稻培育项目。',
    keywords: ['CRISPR-Cas9', '基因编辑', '基因治疗', '农业生物技术', '基因敲除', '碱基编辑'],
    entities: [
      { name: 'CRISPR-Cas9', type: '技术' },
      { name: 'EXaVecta公司', type: '机构' },
      { name: 'β-地中海贫血', type: '疾病' },
      { name: '中国农科院', type: '机构' },
      { name: '2012年', type: '关键时间点' },
    ],
    content: 'CRISPR-Cas9基因编辑技术研究进展综述\n\n摘要\nCRISPR-Cas9技术自2012年被首次报道以来，已迅速成为生命科学领域最具革命性的基因编辑工具。本文综述了该技术的原理、发展历程及应用现状。\n\n一、技术原理\nCRISPR（成簇规律间隔短回文重复序列）是原核生物免疫系统的组成部分。CRISPR-Cas9系统通过向导RNA（gRNA）引导Cas9蛋白精准切割目标DNA序列，实现基因敲除、插入或替换。\n\n二、技术发展历程\n1. 2012年：Jennifer Doudna和Emmanuelle Charpentier首次报道CRISPR-Cas9作为基因编辑工具\n2. 2013年：张锋团队首次将CRISPR-Cas9应用于哺乳动物细胞\n3. 2019年：David Liu团队开发单碱基编辑技术\n4. 2023年：Prime Editing 3.0技术实现精准基因修复\n\n三、应用领域\n1. 疾病治疗：β-地中海贫血、镰状细胞贫血基因治疗\n2. 农业育种：抗病虫害作物、高产优质品种培育\n3. 基础研究：基因功能解析、疾病模型构建',
    totalFields: 22,
    highConfidence: 18,
    needsReview: 2,
    lowConfidence: 2,
  },
  {
    id: 'TR-003',
    fileName: '实验室安全管理与设备采购会议纪要.txt',
    fileType: 'TXT',
    uploadTime: '2026-05-25 17:45:10',
    status: 'completed',
    summary: '本次实验室周会重点讨论三项议题：新版安全检查流程将于6月1日正式实施，涵盖个人防护装备检查、实验操作规范和应急预案演练；2026年度设备采购预算核定为50万元，优先采购高分辨质谱仪和实时荧光定量PCR仪；第三季度科研工作聚焦肿瘤药物研发、基因编辑技术应用和生物信息学分析三个方向。',
    keywords: ['安全管理', '设备采购', '科研计划', '质谱仪', 'PCR仪', '应急预案'],
    entities: [
      { name: '6月1日', type: '日期' },
      { name: '50万元', type: '金额' },
      { name: '高分辨质谱仪', type: '设备' },
      { name: '实时荧光定量PCR仪', type: '设备' },
      { name: '第三季度', type: '时间范围' },
    ],
    content: '实验室周会会议纪要\n会议时间：2026年5月25日 14:00-16:00\n会议地点：综合楼A座302会议室\n主持人：张明研究员\n参会人员：各课题组负责人及安全管理员\n\n一、安全管理制度更新\n1. 新版安全检查流程自2026年6月1日起实施\n2. 新增内容：\n   - 个人防护装备(PPE)每日检查制度\n   - 实验操作SOP标准化流程\n   - 月度应急演练计划\n3. 责任分工：各课题组指定安全联络员\n\n二、设备采购计划\n1. 本年度采购预算：50万元\n2. 采购清单：\n   - 高分辨质谱仪（预算35万元）\n   - 实时荧光定量PCR仪（预算10万元）\n   - 低温离心机（预算5万元）\n3. 采购时间节点：6月底前完成招标\n\n三、第三季度科研重点\n1. 肿瘤药物研发项目\n2. 基因编辑技术应用研究\n3. 生物信息学平台建设',
    totalFields: 18,
    highConfidence: 15,
    needsReview: 2,
    lowConfidence: 1,
  },
]

const typeColors: Record<string, string> = {
  药物: 'blue',
  生物实体: 'green',
  数值: 'orange',
  技术: 'purple',
  日期: 'cyan',
  金额: 'red',
  浓度: 'gold',
  时间范围: 'magenta',
  机构: 'geekblue',
  疾病: 'volcano',
  关键时间点: 'lime',
  设备: 'teal',
}

function TextRecognition() {
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [records, setRecords] = useState<RecognitionRecord[]>(mockRecords)
  const [selectedRecord, setSelectedRecord] = useState<RecognitionRecord | null>(null)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [viewRecord, setViewRecord] = useState<RecognitionRecord | null>(null)

  const props: UploadProps = {
    accept: '.pdf,.docx,.doc,.txt',
    multiple: false,
    beforeUpload: (file) => {
      setUploadedFile(file)
      return false
    },
    fileList: [],
  }

  const handleStartRecognition = () => {
    if (!uploadedFile) {
      message.warning('请先上传文件')
      return
    }
    
    setUploading(true)
    setTimeout(() => {
      const newRecord: RecognitionRecord = {
        id: `TR-${String(Date.now()).slice(-3)}`,
        fileName: uploadedFile.name,
        fileType: uploadedFile.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        uploadTime: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        status: 'completed',
        summary: `基于AI超文本识别技术，已成功分析文档《${uploadedFile.name}》。识别结果显示该文档涉及研究数据分析，包含实验方法描述、数据表格和结论部分。系统已提取关键术语和实体信息，生成结构化摘要供快速浏览。`,
        keywords: ['研究报告', '数据分析', '实验方法', '结论', '关键发现'],
        entities: [
          { name: uploadedFile.name, type: '文档' },
          { name: 'AI识别', type: '技术' },
        ],
        content: `文档名称：${uploadedFile.name}\n文件大小：${(uploadedFile.size / 1024).toFixed(1)} KB\n上传时间：${dayjs().format('YYYY-MM-DD HH:mm:ss')}\n\n识别状态：已完成\n识别内容：本文档已通过AI超文本识别技术进行深度分析。系统自动提取了文档的结构信息、关键术语、实体名称和核心观点，生成了结构化的摘要和关键词列表。`,
        totalFields: 15,
        highConfidence: 12,
        needsReview: 2,
        lowConfidence: 1,
      }
      setRecords([newRecord, ...records])
      setSelectedRecord(newRecord)
      setUploadedFile(null)
      setUploading(false)
      message.success('识别完成！')
    }, 2000)
  }

  const handleView = (record: RecognitionRecord) => {
    setViewRecord(record)
    setModalVisible(true)
  }

  const handleModalClose = () => {
    setModalVisible(false)
    setViewRecord(null)
  }

  const handleCopyModal = () => {
    if (viewRecord) {
      navigator.clipboard.writeText(viewRecord.summary)
      message.success('摘要已复制到剪贴板')
    }
  }

  const handleDelete = (id: string) => {
    setRecords(records.filter(r => r.id !== id))
    if (selectedRecord?.id === id) {
      setSelectedRecord(null)
    }
    message.success('删除成功')
  }

  const handleCopy = () => {
    if (selectedRecord) {
      navigator.clipboard.writeText(selectedRecord.summary)
      message.success('摘要已复制到剪贴板')
    }
  }

  const columns = [
    {
      title: '文件名',
      dataIndex: 'fileName',
      key: 'fileName',
      ellipsis: true,
      width: 200,
    },
    {
      title: '文件类型',
      dataIndex: 'fileType',
      key: 'fileType',
      width: 100,
      render: (type: string) => <Tag color="blue">{type}</Tag>,
    },
    {
      title: '上传时间',
      dataIndex: 'uploadTime',
      key: 'uploadTime',
      width: 160,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => {
        const color = status === 'completed' ? 'green' : status === 'processing' ? 'orange' : 'red'
        const text = status === 'completed' ? '已完成' : status === 'processing' ? '识别中' : '失败'
        return <Tag color={color}>{text}</Tag>
      },
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      render: (_, record) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            onClick={() => handleView(record)}
            size="small"
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            size="small"
            danger
          >
            删除
          </Button>
        </Space>
      ),
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, width: '100%' }}>
      <PageTitle>超文本识别</PageTitle>

      <Row gutter={24}>
        <Col span={8}>
          <Card 
            title="文件上传" 
            style={{ height: '100%', borderRadius: 10 }} 
            styles={{ body: { padding: 20 } }}
          >
            <Form form={form} layout="vertical">
              <Form.Item label="文件上传" name="files" valuePropName="fileList" getValueFromEvent={(e) => Array.isArray(e) ? e : e?.fileList}>
                <Upload.Dragger {...props} disabled={uploading}>
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined style={{ fontSize: 48, color: '#177DDC' }} />
                  </p>
                  <p className="ant-upload-text">点击或拖拽文件到此处上传</p>
                  <p className="ant-upload-hint">支持 pdf、docx、doc、txt 格式，单文件不超过50MB</p>
                </Upload.Dragger>
              </Form.Item>

              {uploadedFile && (
                <div style={{ marginTop: 16, padding: 12, backgroundColor: '#E7F2FB', borderRadius: 8 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <FileTextOutlined style={{ fontSize: 24, color: '#177DDC' }} />
                    <div>
                      <p style={{ margin: 0, fontWeight: 500 }}>{uploadedFile.name}</p>
                      <p style={{ margin: 0, fontSize: 12, color: '#8C8C8C' }}>
                        {(uploadedFile.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <Form.Item style={{ textAlign: 'center', marginTop: 16 }}>
                <Space>
                  <Button
                    type="primary"
                    size="large"
                    icon={<FileTextOutlined />}
                    onClick={handleStartRecognition}
                    disabled={uploading || !uploadedFile}
                    loading={uploading}
                  >
                    {uploading ? '识别中...' : '开始识别'}
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        <Col span={16}>
          <Card 
            title="识别结果预览" 
            style={{ height: '100%', borderRadius: 10 }} 
            styles={{ body: { padding: 20 } }}
          >
            {selectedRecord ? (
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ marginBottom: 16 }}>
                  <Space size={24}>
                    <Tag color={selectedRecord.status === 'completed' ? 'green' : 'red'} icon={
                      selectedRecord.status === 'completed' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />
                    }>
                      {selectedRecord.status === 'completed' ? '识别成功' : '识别失败'}
                    </Tag>
                    <span style={{ color: '#595959' }}>文件名：{selectedRecord.fileName}</span>
                  </Space>
                </div>

                <Row gutter={16} style={{ marginBottom: 16 }}>
                  <Col span={6}>
                    <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 600, color: '#177DDC' }}>{selectedRecord.totalFields}</div>
                      <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>总字段数</div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 600, color: '#49AA19' }}>{selectedRecord.highConfidence}</div>
                      <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>高置信度</div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 600, color: '#D89614' }}>{selectedRecord.needsReview}</div>
                      <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>需人工复核</div>
                    </div>
                  </Col>
                  <Col span={6}>
                    <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, textAlign: 'center' }}>
                      <div style={{ fontSize: 24, fontWeight: 600, color: '#F53F3F' }}>{selectedRecord.lowConfidence}</div>
                      <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>低置信度</div>
                    </div>
                  </Col>
                </Row>

                <div style={{ flex: 1, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500 }}>
                      <ClockCircleOutlined style={{ marginRight: 8 }} />
                      识别摘要
                    </h4>
                    <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, lineHeight: 1.8 }}>
                      {selectedRecord.summary}
                    </div>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500 }}>关键信息提取</h4>
                    
                    <div style={{ marginBottom: 12 }}>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 500 }}>关键词</h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {selectedRecord.keywords.map((keyword, index) => (
                          <Tag key={index} color="blue">{keyword}</Tag>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 500 }}>实体识别</h5>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                        {selectedRecord.entities.map((entity, index) => (
                          <Tag key={index} color={typeColors[entity.type] || 'gray'}>
                            {entity.name}
                            <span style={{ marginLeft: 4, opacity: 0.7 }}>({entity.type})</span>
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500 }}>原文预览</h4>
                    <div 
                      style={{ 
                        padding: 12, 
                        backgroundColor: '#FFFFFF', 
                        border: '1px solid #E5E5E5', 
                        borderRadius: 8,
                        maxHeight: 200,
                        overflow: 'auto',
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.6,
                        fontSize: 13,
                      }}
                    >
                      {selectedRecord.content}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                  <Button icon={<CopyOutlined />} onClick={handleCopy}>
                    复制摘要
                  </Button>
                  <Button icon={<DownloadOutlined />}>
                    导出报告
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 400, color: '#8C8C8C' }}>
                <FileTextOutlined style={{ fontSize: 64, marginBottom: 16, opacity: 0.5 }} />
                <p>请上传文件并开始识别</p>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Card title="近期识别记录" style={{ borderRadius: 10 }} styles={{ body: { padding: 0 } }}>
        <Table
          columns={columns}
          dataSource={records}
          rowKey="id"
          pagination={{ pageSize: 5, showSizeChanger: false, showTotal: (total) => `共 ${total} 条记录` }}
          style={{ padding: 16 }}
        />
      </Card>

      <Modal
        title={
          <Space>
            <FileTextOutlined style={{ color: '#177DDC' }} />
            <span>识别结果详情</span>
          </Space>
        }
        open={modalVisible}
        onCancel={handleModalClose}
        footer={[
          <Button key="copy" icon={<CopyOutlined />} onClick={handleCopyModal}>
            复制摘要
          </Button>,
          <Button key="download" icon={<DownloadOutlined />}>
            导出报告
          </Button>,
          <Button key="close" type="primary" onClick={handleModalClose}>
            关闭
          </Button>,
        ]}
        width={800}
        styles={{ body: { padding: 24, maxHeight: '60vh', overflow: 'auto' } }}
      >
        {viewRecord && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <Space size={24}>
                <Tag color={viewRecord.status === 'completed' ? 'green' : 'red'} icon={
                  viewRecord.status === 'completed' ? <CheckCircleOutlined /> : <ExclamationCircleOutlined />
                }>
                  {viewRecord.status === 'completed' ? '识别成功' : '识别失败'}
                </Tag>
                <span style={{ color: '#595959' }}>文件名：{viewRecord.fileName}</span>
                <span style={{ color: '#8C8C8C' }}>上传时间：{viewRecord.uploadTime}</span>
              </Space>
            </div>

            <Row gutter={16}>
              <Col span={6}>
                <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 600, color: '#177DDC' }}>{viewRecord.totalFields}</div>
                  <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>总字段数</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 600, color: '#49AA19' }}>{viewRecord.highConfidence}</div>
                  <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>高置信度</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 600, color: '#D89614' }}>{viewRecord.needsReview}</div>
                  <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>需人工复核</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 600, color: '#F53F3F' }}>{viewRecord.lowConfidence}</div>
                  <div style={{ fontSize: 12, color: '#8C8C8C', marginTop: 4 }}>低置信度</div>
                </div>
              </Col>
            </Row>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500 }}>
                <ClockCircleOutlined style={{ marginRight: 8 }} />
                识别摘要
              </h4>
              <div style={{ padding: 12, backgroundColor: '#F7F7F7', borderRadius: 8, lineHeight: 1.8 }}>
                {viewRecord.summary}
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500 }}>关键信息提取</h4>
              
              <div style={{ marginBottom: 12 }}>
                <h5 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 500 }}>关键词</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {viewRecord.keywords.map((keyword, index) => (
                    <Tag key={index} color="blue">{keyword}</Tag>
                  ))}
                </div>
              </div>

              <div>
                <h5 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 500 }}>实体识别</h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {viewRecord.entities.map((entity, index) => (
                    <Tag key={index} color={typeColors[entity.type] || 'gray'}>
                      {entity.name}
                      <span style={{ marginLeft: 4, opacity: 0.7 }}>({entity.type})</span>
                    </Tag>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: 14, fontWeight: 500 }}>原文预览</h4>
              <div 
                style={{ 
                  padding: 12, 
                  backgroundColor: '#FFFFFF', 
                  border: '1px solid #E5E5E5', 
                  borderRadius: 8,
                  maxHeight: 200,
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  fontSize: 13,
                }}
              >
                {viewRecord.content}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}

export default TextRecognition