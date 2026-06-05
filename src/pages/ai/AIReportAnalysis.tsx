import { Card, Form, Button, Table, Modal, Tag, message, Row, Col, Upload } from 'antd'
import { FileTextOutlined, PlayCircleOutlined, SaveOutlined, DownloadOutlined, ReloadOutlined, EyeOutlined } from '@ant-design/icons'
import { useState, useEffect } from 'react'
import PageTitle from '../../components/PageTitle/PageTitle'

interface ReportData {
  key: string
  id: string
  name: string
  type: string
  createTime: string
  sampleCount: number
  analysisStatus: string
}

interface AnalysisResult {
  id: string
  reportName: string
  detectionConclusion: {
    result: string
    qualityAssessment: string
    interpretation: string
  }
  patientInfo: {
    name: string
    age: string
    clinicalDiagnosis: string
    familyHistory: string
    sampleType: string
    hospital: string
  }
  detectionMethod: {
    scope: string
    genes: { name: string; description: string }[]
    method: string
    performance: {
      diseaseLevel: string
      sensitivity: string
      specificity: string
      clinicalSignificance: string
    }[]
  }
  detectionData: {
    referenceGene: {
      project: string
      value: string
      reference: string
      conclusion: string
    }[]
    targetGene: {
      gene: string
      ctValue: string
      deltaCt: string
      threshold: string
      conclusion: string
    }[]
    keyInterpretation: string[]
  }
  clinicalRecommendations: {
    currentResult: string
    followUp: string[]
    limitations: string[]
  }
  reportEvaluation: {
    item: string
    evaluation: string
  }[]
}

export default function AIReportAnalysis() {
  const [reports, setReports] = useState<ReportData[]>([])
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null)
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [viewModalVisible, setViewModalVisible] = useState(false)

  const initialReports: ReportData[] = Array.from({ length: 8 }, (_, i) => ({
    key: String(i + 1),
    id: `RPT-${String(2026001 + i).padStart(7, '0')}`,
    name: `实验报告_${['基因检测', '蛋白质分析', '细胞培养', '质谱分析', '测序数据'][i % 5]}_${i + 1}`,
    type: ['基因检测', '蛋白质分析', '细胞培养', '质谱分析', '测序数据'][i % 5],
    createTime: `2026-05-${String(10 + (i % 20)).padStart(2, '0')} ${String(9 + (i % 12)).padStart(2, '0')}:30:00`,
    sampleCount: Math.floor(Math.random() * 50) + 10,
    analysisStatus: ['已分析', '待分析', '已分析', '待分析', '已分析', '已分析', '待分析', '已分析'][i],
  }))

  useEffect(() => {
    setReports(initialReports)
  }, [])

  const handleViewReport = (report: ReportData) => {
    setSelectedReport(report)

    if (report.analysisStatus === '待分析') {
      message.warning('该报告尚未进行AI解读，请先选择报告并点击"开始AI解读"')
      return
    }

    const mockResult: AnalysisResult = {
      id: report.id,
      reportName: report.name,
      detectionConclusion: {
        result: '阴性',
        qualityAssessment: '合格',
        interpretation: `受检者的宫颈脱落细胞样本中，未检测到PAX1和JAM3基因的异常甲基化。结合该检测方法对CIN2+病变的灵敏度89.60%、特异性96.50%，阴性结果提示目前宫颈高级别病变（CIN2+）的风险较低。`,
      },
      patientInfo: {
        name: '倪英',
        age: '58岁',
        clinicalDiagnosis: '筛查',
        familyHistory: '无',
        sampleType: '宫颈脱落细胞',
        hospital: '安宁市第一人民医院',
      },
      detectionMethod: {
        scope: '人PAX1和JAM3基因甲基化检测',
        genes: [
          { name: 'PAX1基因', description: '目前公认的宫颈癌甲基化标志物之一。宫颈病变过程中，PAX1基因启动子区会发生高甲基化，导致抑癌功能沉默。检测其甲基化状态可反映宫颈病变程度。' },
          { name: 'JAM3基因', description: '辅助甲基化标志物，与PAX1联合检测可提高诊断准确性。' },
        ],
        method: '荧光定性PCR：检测样本中是否存在目标基因甲基化，给出"阳性/阴性"结论。',
        performance: [
          { diseaseLevel: 'CIN2+', sensitivity: '89.60%', specificity: '96.50%', clinicalSignificance: '100个CIN2+患者中约90个能检出，漏检约10个；100个健康人中约96.5个判为正常' },
          { diseaseLevel: 'CIN3+', sensitivity: '95.96%', specificity: '87.09%', clinicalSignificance: '对更高级别病变检出能力更强，特异性略降' },
        ],
      },
      detectionData: {
        referenceGene: [
          { project: 'GAPDH CT值', value: '28.58', reference: '<35', conclusion: '合格' },
        ],
        targetGene: [
          { gene: 'PAX1', ctValue: '37.14', deltaCt: '8.56', threshold: '>6.6', conclusion: '阴性（ΔCT > 阈值）' },
          { gene: 'JAM3', ctValue: '40.44', deltaCt: '11.86', threshold: '>10', conclusion: '阴性（ΔCT > 阈值）' },
        ],
        keyInterpretation: [
          'ΔCT值 = 目标基因CT值 - 内参基因CT值',
          '若基因发生甲基化，PCR扩增会受抑制，CT值增大，ΔCT值相应增大',
          '本检测采用ΔCT值大于某阈值判为阴性的判断逻辑（即：未甲基化时ΔCT较大，甲基化时ΔCT较小）',
          'PAX1的ΔCT=8.56 > 6.6 → 阴性（未甲基化）',
          'JAM3的ΔCT=11.86 > 10 → 阴性（未甲基化）',
        ],
      },
      clinicalRecommendations: {
        currentResult: 'PAX1/JAM3甲基化阴性，提示无高级别宫颈病变的分子学证据。',
        followUp: [
          '若同时有细胞学（TCT）检查且结果为阴性：可按常规筛查指南，3-5年后再筛查',
          '若TCT异常（如ASC-US、LSIL）：建议进一步HPV检测或缩短随访间隔',
          '若有临床症状（如接触性出血）：即便甲基化阴性，仍建议妇科门诊评估',
        ],
        limitations: [
          '该检测对CIN2+的灵敏度约90%，存在约10%的假阴性可能',
          '甲基化阴性不代表绝对无病变，需结合其他检查综合判断',
        ],
      },
      reportEvaluation: [
        { item: '患者信息', evaluation: '完整，但缺少联系方式（用于紧急结果通知）' },
        { item: '检测方法', evaluation: '清晰注明方法学与设备' },
        { item: '性能指标', evaluation: '提供了灵敏性数据，便于临床参考' },
        { item: '结果呈现', evaluation: '表格清晰，ΔCT值与判断阈值对比明确' },
        { item: '结论', evaluation: '明确给出"阴性"结论' },
        { item: '签章', evaluation: '有检测者和审核者双签名，流程规范' },
        { item: '建议', evaluation: '报告未提供临床建议（可补充"建议结合细胞学及临床随访"）' },
      ],
    }

    setAnalysisResult(mockResult)
    setViewModalVisible(true)
  }

  const handleAnalyze = () => {
    if (!selectedReport) {
      message.warning('请先选择一份报告')
      return
    }

    setIsAnalyzing(true)

    setTimeout(() => {
      setReports(prev => prev.map(item =>
        item.key === selectedReport.key
          ? { ...item, analysisStatus: '已分析' }
          : item
      ))
      setIsAnalyzing(false)
      message.success('AI解读完成，请点击"查看"按钮查看解读结果')
    }, 2000)
  }

  const handleSelectReport = (report: ReportData) => {
    setSelectedReport(report)
  }

  const handleDownloadReport = () => {
    if (!analysisResult) return

    let content = `AI报告解读结果\n\n`
    content += `报告ID：${analysisResult.id}\n`
    content += `报告名称：${analysisResult.reportName}\n\n`

    content += `一、检测结论（最核心信息）\n`
    content += `检测结果：${analysisResult.detectionConclusion.result}\n`
    content += `样品总体质量评估：${analysisResult.detectionConclusion.qualityAssessment}\n\n`
    content += `结论解读：\n${analysisResult.detectionConclusion.interpretation}\n\n`


    content += `二、患者基本信息分析\n`
    content += `年龄：${analysisResult.patientInfo.age} - 宫颈癌高发年龄段（40-60岁），筛查意义重大\n`
    content += `临床诊断：${analysisResult.patientInfo.clinicalDiagnosis} - 属于常规体检/机会性筛查，非因症状就诊\n`
    content += `是否有家族史：${analysisResult.patientInfo.familyHistory} - 无遗传易感背景，风险因素进一步降低\n`
    content += `样本类型：${analysisResult.patientInfo.sampleType} - 标准的宫颈癌筛查样本，采集方法正确\n`
    content += `送检医院：${analysisResult.patientInfo.hospital} - 三级医院，检测质量有保障\n\n`

    content += `三、检测方法与技术指标解读\n`
    content += `3.1 检测范围\n${analysisResult.detectionMethod.scope}\n\n`
    analysisResult.detectionMethod.genes.forEach(gene => {
      content += `• ${gene.name}：${gene.description}\n`
    })
    content += `\n3.2 检测方法\n${analysisResult.detectionMethod.method}\n\n`

    content += `3.3 检测性能（临床有效性数据）\n`
    content += `病变等级\t灵敏度\t特异性\t临床意义\n`
    analysisResult.detectionMethod.performance.forEach(p => {
      content += `${p.diseaseLevel}\t${p.sensitivity}\t${p.specificity}\t${p.clinicalSignificance}\n`
    })
    content += `\n解读：该检测方法对高级别宫颈病变（尤其是CIN3+）的检出能力很好（近96%），特异性也较高，属于临床可接受的分子诊断方法。\n\n`


    content += `四、检测数据详细分析\n`
    content += `4.1 内参基因（GAPDH）\n`
    content += `项目\t检测值\t参考值\t结论\n`
    analysisResult.detectionData.referenceGene.forEach(r => {
      content += `${r.project}\t${r.value}\t${r.reference}\t${r.conclusion}\n`
    })
    content += `GAPDH是内参基因，用于判断样本质量。CT值<35表示样本DNA质量合格，检测结果可信。本样本28.58，远低于阈值，样本质量良好。\n\n`


    content += `4.2 目标基因CT值与ΔCT值\n`
    content += `项目\tCT值\tΔCT值\t判断阈值\t结论\n`
    analysisResult.detectionData.targetGene.forEach(t => {
      content += `${t.gene}\t${t.ctValue}\t${t.deltaCt}\t${t.threshold}\t${t.conclusion}\n`
    })
    content += `\n关键理解：\n`
    analysisResult.detectionData.keyInterpretation.forEach(k => {
      content += `• ${k}\n`
    })
    content += `\n`

    content += `五、临床建议\n`
    content += `1. 当前结果：${analysisResult.clinicalRecommendations.currentResult}\n`
    content += `2. 后续管理建议（需结合临床）：\n`
    analysisResult.clinicalRecommendations.followUp.forEach(f => {
      content += `   ${f}\n`
    })
    content += `3. 局限性告知：\n`
    analysisResult.clinicalRecommendations.limitations.forEach(l => {
      content += `   • ${l}\n`
    })
    content += `\n`

    content += `六、报告规范性评价\n`
    content += `项目\t评价\n`
    analysisResult.reportEvaluation.forEach(e => {
      content += `${e.item}\t${e.evaluation}\n`
    })

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${analysisResult.id}_解读报告.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    message.success('报告下载成功')
  }

  const reportColumns = [
    { title: '报告名称', dataIndex: 'name', key: 'name', width: 420 },
    {
      title: '分析状态',
      dataIndex: 'analysisStatus',
      key: 'analysisStatus',
      width: 100,
      render: (status: string) => (
        <span>
          {status === '已分析' ? (
            <Tag color="green">{status}</Tag>
          ) : (
            <Tag color="orange">{status}</Tag>
          )}
        </span>
      )
    },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
    {
      title: '操作',
      key: 'action',
      width: 80,
      fixed: 'right',
      render: (_: any, record: ReportData) => (
        <Button
          type="text"
          icon={<EyeOutlined />}
          onClick={() => handleViewReport(record)}
          disabled={record.analysisStatus === '待分析'}
          style={{ color: record.analysisStatus === '已分析' ? '#177DDC' : '#B2B2B2' }}
        >
          查看
        </Button>
      )
    },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%' }}>
      <PageTitle>AI报告解读</PageTitle>

      <Row gutter={20}>
        <Col span={6}>
          <Card title="报告上传" style={{ borderRadius: 10 }} styles={{ body: { padding: 20 } }}>
            <Upload.Dragger
              accept=".pdf,.xlsx,.docx"
              beforeUpload={() => false}
            >
              <p className="ant-upload-icon">
                <FileTextOutlined style={{ fontSize: 24 }} />
              </p>
              <p className="ant-upload-text">点击或拖拽上传报告文件</p>
              <p className="ant-upload-hint">支持 PDF、Excel、Word 格式</p>
            </Upload.Dragger>

            <Button
              type="primary"
              onClick={handleAnalyze}
              loading={isAnalyzing}
              icon={<PlayCircleOutlined />}
              style={{ width: '100%', marginTop: 16 }}
            >
              {isAnalyzing ? 'AI解读中...' : '开始AI解读'}
            </Button>

            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #E5E5E5' }}>
              <h4 style={{ margin: '0 0 12px 0', fontSize: 14 }}>AI解读说明</h4>
              <ul style={{ margin: 0, paddingLeft: 20, fontSize: 12, color: '#8C8C8C' }}>
                <li>采样数据：分析样本基本信息、分布情况、质量控制指标</li>
                <li>分析数据：解读检测指标、统计结果、相关性分析</li>
                <li>智能洞察：基于AI算法发现潜在规律和异常</li>
                <li>建议生成：根据分析结果提供改进建议</li>
              </ul>
            </div>
          </Card>
        </Col>

        <Col span={18}>
          <Card title="报告列表" style={{ borderRadius: 10 }} styles={{ body: { padding: 0 } }}>
            <div style={{ padding: 16, borderBottom: '1px solid #E5E5E5', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: 12, color: '#8C8C8C' }}>
                共 {reports.length} 份报告，{reports.filter(r => r.analysisStatus === '已分析').length} 份已分析
              </div>
              <Button icon={<ReloadOutlined />} onClick={() => message.info('刷新完成')}>刷新</Button>
            </div>

            <Table
              columns={reportColumns}
              dataSource={reports}
              scroll={{ x: 'max-content' }}
              pagination={{ pageSize: 8, showSizeChanger: true, showTotal: (total) => `共 ${total} 条记录` }}
              style={{ padding: 16 }}
              rowClassName={(record) => selectedReport?.key === record.key ? 'ant-table-row-selected' : ''}
              onRow={(record) => ({
                onClick: () => handleSelectReport(record),
                style: { cursor: 'pointer' }
              })}
            />
          </Card>
        </Col>
      </Row>

      <Modal
        title="AI报告解读结果"
        open={viewModalVisible}
        onCancel={() => { setViewModalVisible(false); setAnalysisResult(null) }}
        footer={null}
        width={900}
        style={{ maxHeight: '90vh' }}
      >
        {analysisResult && (
          <div style={{ maxHeight: '70vh', overflow: 'auto', paddingRight: 10 }}>
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 8px 0', fontSize: 16, fontWeight: 600, color: '#000' }}>
                一、检测结论（最核心信息）
              </h2>
              <div style={{ backgroundColor: '#F5F5F5', padding: 16, borderRadius: 8 }}>
                <div style={{ marginBottom: 8 }}>
                  <span style={{ fontWeight: 500 }}>检测结果：</span>
                  <span style={{ color: '#49AA19', fontWeight: 500 }}>{analysisResult.detectionConclusion.result}</span>
                </div>
                <div style={{ marginBottom: 16 }}>
                  <span style={{ fontWeight: 500 }}>样品总体质量评估：</span>
                  <span style={{ color: '#49AA19', fontWeight: 500 }}>{analysisResult.detectionConclusion.qualityAssessment}</span>
                </div>
                <div>
                  <div style={{ fontWeight: 500, marginBottom: 8 }}>结论解读：</div>
                  <p style={{ margin: 0, lineHeight: 1.8, color: '#595959' }}>
                    {analysisResult.detectionConclusion.interpretation}
                  </p>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#000' }}>
                二、患者基本信息分析
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F5F5F5' }}>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 13, fontWeight: 500 }}>项目</th>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 13, fontWeight: 500 }}>内容</th>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 13, fontWeight: 500 }}>分析</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>年龄</td>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>{analysisResult.patientInfo.age}</td>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13, color: '#595959' }}>宫颈癌高发年龄段（40-60岁），筛查意义重大</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>临床诊断</td>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>{analysisResult.patientInfo.clinicalDiagnosis}</td>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13, color: '#595959' }}>属于常规体检/机会性筛查，非因症状就诊</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>是否有家族史</td>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>{analysisResult.patientInfo.familyHistory}</td>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13, color: '#595959' }}>无遗传易感背景，风险因素进一步降低</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>样本类型</td>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>{analysisResult.patientInfo.sampleType}</td>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13, color: '#595959' }}>标准的宫颈癌筛查样本，采集方法正确</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>送检医院</td>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>{analysisResult.patientInfo.hospital}</td>
                    <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13, color: '#595959' }}>三级医院，检测质量有保障</td>
                  </tr>
                </tbody>
              </table>
              <p style={{ marginTop: 12, fontSize: 12, color: '#8C8C8C', fontStyle: 'italic' }}>
                注：报告明确声明患者信息由受检者提供，检测机构不对信息准确性负责——这是标准的免责声明，符合医疗检测规范。
              </p>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#000' }}>
                三、检测方法与技术指标解读
              </h2>
              <div style={{ marginBottom: 16 }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 500, color: '#262626' }}>3.1 检测范围</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#595959' }}>{analysisResult.detectionMethod.scope}</p>
                <ul style={{ margin: 12, paddingLeft: 20 }}>
                  {analysisResult.detectionMethod.genes.map((gene, index) => (
                    <li key={index} style={{ marginBottom: 8, fontSize: 13, color: '#595959' }}>
                      <span style={{ fontWeight: 500 }}>{gene.name}：</span>{gene.description}
                    </li>
                  ))}
                </ul>
              </div>

              <div style={{ marginBottom: 16 }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 500, color: '#262626' }}>3.2 检测方法</h3>
                <p style={{ margin: 0, fontSize: 13, color: '#595959' }}>{analysisResult.detectionMethod.method}</p>
              </div>

              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 500, color: '#262626' }}>3.3 检测性能（临床有效性数据）</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F5F5F5' }}>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>病变等级</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>灵敏度</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>特异性</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>临床意义</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.detectionMethod.performance.map((p, index) => (
                      <tr key={index}>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12 }}>{p.diseaseLevel}</td>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12 }}>{p.sensitivity}</td>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12 }}>{p.specificity}</td>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12, color: '#595959' }}>{p.clinicalSignificance}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ margin: 0, fontSize: 13, color: '#595959', padding: '12px', backgroundColor: '#F5F5F5', borderRadius: 6 }}>
                  <span style={{ fontWeight: 500 }}>解读：</span>该检测方法对高级别宫颈病变（尤其是CIN3+）的检出能力很好（近96%），特异性也较高，属于临床可接受的分子诊断方法。
                </p>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#000' }}>
                四、检测数据详细分析
              </h2>

              <div style={{ marginBottom: 16 }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 500, color: '#262626' }}>4.1 内参基因（GAPDH）</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F5F5F5' }}>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>项目</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>检测值</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>参考值</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>结论</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.detectionData.referenceGene.map((r, index) => (
                      <tr key={index}>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12 }}>{r.project}</td>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12 }}>{r.value}</td>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12 }}>{r.reference}</td>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12, color: '#49AA19' }}>{r.conclusion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p style={{ margin: 0, fontSize: 13, color: '#595959' }}>
                  GAPDH是内参基因，用于判断样本质量。CT值&lt;35表示样本DNA质量合格，检测结果可信。本样本28.58，远低于阈值，样本质量良好。
                </p>
              </div>

              <div>
                <h3 style={{ margin: '0 0 12px 0', fontSize: 14, fontWeight: 500, color: '#262626' }}>4.2 目标基因CT值与ΔCT值</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: 12 }}>
                  <thead>
                    <tr style={{ backgroundColor: '#F5F5F5' }}>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>项目</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>CT值</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>ΔCT值</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>判断阈值</th>
                      <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 12, fontWeight: 500 }}>结论</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResult.detectionData.targetGene.map((t, index) => (
                      <tr key={index}>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12 }}>{t.gene}</td>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12 }}>{t.ctValue}</td>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12 }}>{t.deltaCt}</td>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12 }}>{t.threshold}</td>
                        <td style={{ padding: '8px', border: '1px solid #E5E5E5', fontSize: 12, color: '#49AA19' }}>{t.conclusion}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div style={{ marginTop: 12 }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: 13, fontWeight: 500 }}>关键理解：</h4>
                  <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {analysisResult.detectionData.keyInterpretation.map((k, index) => (
                      <li key={index} style={{ marginBottom: 6, fontSize: 13, color: '#595959' }}>{k}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#000' }}>
                五、临床建议
              </h2>
              <ol style={{ margin: 0, paddingLeft: 20 }}>
                <li style={{ marginBottom: 12, fontSize: 13, color: '#595959' }}>
                  <span style={{ fontWeight: 500 }}>当前结果：</span>{analysisResult.clinicalRecommendations.currentResult}
                </li>
                <li style={{ marginBottom: 12, fontSize: 13, color: '#595959' }}>
                  <span style={{ fontWeight: 500 }}>后续管理建议（需结合临床）：</span>
                  <ul style={{ margin: 8, paddingLeft: 20 }}>
                    {analysisResult.clinicalRecommendations.followUp.map((f, index) => (
                      <li key={index} style={{ marginBottom: 6, fontSize: 13 }}>{f}</li>
                    ))}
                  </ul>
                </li>
                <li style={{ fontSize: 13, color: '#595959' }}>
                  <span style={{ fontWeight: 500 }}>局限性告知：</span>
                  <ul style={{ margin: 8, paddingLeft: 20 }}>
                    {analysisResult.clinicalRecommendations.limitations.map((l, index) => (
                      <li key={index} style={{ marginBottom: 6, fontSize: 13 }}>{l}</li>
                    ))}
                  </ul>
                </li>
              </ol>
            </div>

            <div style={{ marginBottom: 24 }}>
              <h2 style={{ margin: '0 0 16px 0', fontSize: 16, fontWeight: 600, color: '#000' }}>
                六、报告规范性评价
              </h2>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#F5F5F5' }}>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 13, fontWeight: 500 }}>项目</th>
                    <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #E5E5E5', fontSize: 13, fontWeight: 500 }}>评价</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisResult.reportEvaluation.map((e, index) => (
                    <tr key={index}>
                      <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13 }}>{e.item}</td>
                      <td style={{ padding: '10px', border: '1px solid #E5E5E5', fontSize: 13, color: '#595959' }}>{e.evaluation}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: 24, paddingTop: 16, borderTop: '1px solid #E5E5E5', display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
              <Button onClick={() => { setViewModalVisible(false); setAnalysisResult(null) }}>关闭</Button>
              <Button icon={<SaveOutlined />}>保存解读</Button>
              <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownloadReport}>导出报告</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}