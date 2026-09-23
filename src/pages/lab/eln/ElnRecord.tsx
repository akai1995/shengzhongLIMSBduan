import { Card, Form, Input, Button, Select, Table, DatePicker, Modal, Tag, Space, message, Upload, Row, Col, Dropdown } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, LockOutlined, UploadOutlined, DownOutlined, UpOutlined, SearchOutlined, ExportOutlined, FilePdfOutlined, FileWordOutlined } from '@ant-design/icons'
import type { MenuProps } from 'antd'

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import PageTitle from '../../../components/PageTitle/PageTitle'
import { useThemeStore } from '../../../store/themeStore'

const { Option } = Select
const { RangePicker } = DatePicker
const { TextArea } = Input

interface VersionInfo {
  version: string
  modifier: string
  modifyTime: string
  isCurrent: boolean
  purpose: string
  steps: string
  data: string
  analysis: string
}

interface ExperimentRecord {
  key: string
  id: string
  name: string
  creator: string
  template: string
  version: string
  createTime: string
  lastModify: string
  isLocked: boolean
  signatureImage: string
  signatureName: string
  signatureTime: string
  purpose: string
  steps: string
  data: string
  analysis: string
  attachments: string[]
  versions: VersionInfo[]
}

export default function ElnRecord() {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()
  const [detailModalVisible, setDetailModalVisible] = useState(false)
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [templateSelectModalVisible, setTemplateSelectModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [signatureModalVisible, setSignatureModalVisible] = useState(false)
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [currentRecord, setCurrentRecord] = useState<ExperimentRecord | null>(null)
  const [deleteRecord, setDeleteRecord] = useState<ExperimentRecord | null>(null)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [expanded, setExpanded] = useState(false)
  const [tableData, setTableData] = useState<ExperimentRecord[]>([])
  const [filteredData, setFilteredData] = useState<ExperimentRecord[]>([])
  const [versionModalVisible, setVersionModalVisible] = useState(false)
  const [versionDetailModalVisible, setVersionDetailModalVisible] = useState(false)
  const [currentVersion, setCurrentVersion] = useState<VersionInfo | null>(null)
  const idCounterRef = useRef(101)

  useEffect(() => {
    const initialData: ExperimentRecord[] = [{
      key: '1',
      id: 'ELN20260001',
      name: '昆明医科大学科研实验记录',
      creator: '张医生',
      template: '病理实验记录',
      version: 'v1.0',
      createTime: '2026-05-01',
      lastModify: '2026-05-01',
      isLocked: false,
      signatureImage: '',
      signatureName: '',
      signatureTime: '',
      purpose: '研究病理组织切片的相关特性',
      steps: '1. 准备实验材料\n2. 进行病理组织切片\n3. 数据采集\n4. 结果分析',
      data: '实验数据记录：样本数=100，对照组=50，实验组=50',
      analysis: '病理组织切片完成，结果符合预期，建议进一步验证',
      attachments: ['实验图片1.jpg', '实验数据.xlsx'],
      versions: [{
        version: 'v1.0',
        modifier: '张医生',
        modifyTime: '2026-05-01',
        isCurrent: true,
        purpose: '研究病理组织切片的相关特性',
        steps: '1. 准备实验材料\n2. 进行病理组织切片\n3. 数据采集\n4. 结果分析',
        data: '实验数据记录：样本数=100，对照组=50，实验组=50',
        analysis: '病理组织切片完成，结果符合预期，建议进一步验证'
      }]
    }]
    setTableData(initialData)
    setFilteredData(initialData)
    idCounterRef.current = 101
  }, [])

  const columns = [
    { title: '记录ID', dataIndex: 'id', key: 'id', width: 140 },
    { title: '实验名称', dataIndex: 'name', key: 'name', width: 200 },
    { title: '创建人', dataIndex: 'creator', key: 'creator', width: 120 },
    { title: '模板名称', dataIndex: 'template', key: 'template', width: 180 },
    { title: '当前版本号', dataIndex: 'version', key: 'version', width: 120 },
    { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 140 },
    { title: '最后修改时间', dataIndex: 'lastModify', key: 'lastModify', width: 140 },
    { 
      title: '签名锁定', 
      dataIndex: 'isLocked', 
      key: 'isLocked', 
      width: 220,
      render: (isLocked: boolean, record: ExperimentRecord) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Tag color={isLocked ? 'green' : 'orange'}>
            {isLocked ? '已锁定' : '未锁定'}
          </Tag>
          <div 
            style={{ 
              width: 60, 
              height: 30, 
              objectFit: 'contain', 
              border: isLocked ? `1px solid ${isDark ? '#434343' : '#D9D9D9'}` : `1px dashed ${isDark ? '#434343' : '#D9D9D9'}`, 
              borderRadius: 4,
              backgroundColor: isLocked ? (isDark ? '#262626' : '#FAFAFA') : 'transparent',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {isLocked && record.signatureImage ? (
              <img 
                src={record.signatureImage} 
                alt="签名" 
                style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                title={`${record.signatureName} - ${record.signatureTime}`}
              />
            ) : (
              <span style={{ fontSize: 10, color: isDark ? '#8C8C8C' : '#999' }}>未签名</span>
            )}
          </div>
        </div>
      )
    },
    { 
      title: '操作', 
      key: 'action', 
      width: 350, 
      fixed: 'right' as const,
      render: (_: any, record: ExperimentRecord) => (
        <Space size="middle">
          <Button type="text" icon={<EyeOutlined />} onClick={() => handleViewDetail(record)}>查看</Button>
          {!record.isLocked && (
            <>
              <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)}>编辑</Button>
              <Button type="text" icon={<LockOutlined />} onClick={() => handleSignature(record)}>签名锁定</Button>
              <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record)}>删除</Button>
            </>
          )}
          <Dropdown menu={{ items: getExportMenuItems(record) }}>
            <Button type="text" icon={<ExportOutlined />}>导出</Button>
          </Dropdown>
          <Button type="text" onClick={() => handleVersion(record)}>历史版本</Button>
        </Space>
      )
    },
  ]

  const handleSearch = () => {
    const values = searchForm.getFieldsValue()
    let result = [...tableData]
    
    if (values.name) {
      result = result.filter(item => item.name.includes(values.name))
    }
    if (values.creator) {
      result = result.filter(item => item.creator.includes(values.creator))
    }
    if (values.template && values.template !== 'all') {
      result = result.filter(item => item.template === values.template)
    }
    if (values.status && values.status !== 'all') {
      const isLocked = values.status === 'locked'
      result = result.filter(item => item.isLocked === isLocked)
    }
    if (values.dateRange && values.dateRange.length === 2) {
      const startDate = values.dateRange[0].format('YYYY-MM-DD')
      const endDate = values.dateRange[1].format('YYYY-MM-DD')
      result = result.filter(item => item.createTime >= startDate && item.createTime <= endDate)
    }
    
    setFilteredData(result)
    message.info(`搜索完成，共找到 ${result.length} 条记录`)
  }

  const handleReset = () => {
    searchForm.resetFields()
    setFilteredData([...tableData])
  }

  const handleViewDetail = (record: ExperimentRecord) => {
    setCurrentRecord(record)
    setDetailModalVisible(true)
  }

  const handleCreate = () => {
    setTemplateSelectModalVisible(true)
  }

  const handleSelectTemplate = (template: { title: string; content: string }) => {
    setTemplateSelectModalVisible(false)
    sessionStorage.setItem('eln_create_template', JSON.stringify({ title: template.title, content: template.content }))
    navigate('/lab/eln/record/create')
  }

  const HOSPITAL_TEMPLATES = [
    {
      key: 'pathology',
      title: '病理实验记录',
      icon: '🔬',
      description: '病理组织切片、染色、镜检等实验记录模板',
      content: '<h3>病理实验记录</h3><table><tr><td style="width:120px;font-weight:bold">患者姓名：</td><td></td><td style="width:120px;font-weight:bold">住院号：</td><td></td></tr><tr><td style="font-weight:bold">病理号：</td><td></td><td style="font-weight:bold">送检科室：</td><td></td></tr><tr><td style="font-weight:bold">标本类型：</td><td></td><td style="font-weight:bold">送检日期：</td><td></td></tr></table><p><b>染色方法：</b></p><p><b>镜下所见：</b></p><p></p><p><b>病理诊断：</b></p><p></p><p><b>备注：</b></p>',
    },
    {
      key: 'blood',
      title: '血液检测实验',
      icon: '🩸',
      description: '血常规、生化、免疫、凝血等血液检测实验记录模板',
      content: '<h3>血液检测实验</h3><table><tr><td style="width:120px;font-weight:bold">患者姓名：</td><td></td><td style="width:120px;font-weight:bold">样本编号：</td><td></td></tr><tr><td style="font-weight:bold">检测项目：</td><td></td><td style="font-weight:bold">样本类型：</td><td></td></tr><tr><td style="font-weight:bold">抽血时间：</td><td></td><td style="font-weight:bold">检测日期：</td><td></td></tr></table><p><b>检测方法：</b></p><p></p><p><b>检测结果：</b></p><p></p><p><b>参考范围：</b></p><p></p><p><b>结论：</b></p><p></p>',
    },
    {
      key: 'pcr',
      title: 'PCR扩增实验',
      icon: '🧬',
      description: 'PCR引物设计、扩增条件、产物检测等实验记录模板',
      content: '<h3>PCR扩增实验</h3><table><tr><td style="width:120px;font-weight:bold">实验名称：</td><td></td><td style="width:120px;font-weight:bold">实验日期：</td><td></td></tr><tr><td style="font-weight:bold">样本来源：</td><td></td><td style="font-weight:bold">操作人员：</td><td></td></tr></table><p><b>引物序列：</b></p><p>Forward: </p><p>Reverse: </p><p><b>扩增条件：</b></p><p>预变性: 95°C, min</p><p>变性: 95°C, sec</p><p>退火: °C, sec</p><p>延伸: 72°C, sec</p><p>循环数: </p><p><b>结果：</b></p><p></p><p><b>结论：</b></p><p></p>',
    },
    {
      key: 'western_blot',
      title: 'Western Blot实验',
      icon: '🔬',
      description: '蛋白提取、电泳、转膜、抗体孵育、显影等实验记录模板',
      content: '<h3>Western Blot实验</h3><table><tr><td style="width:120px;font-weight:bold">实验日期：</td><td></td><td style="width:120px;font-weight:bold">操作人员：</td><td></td></tr><tr><td style="font-weight:bold">样本来源：</td><td></td><td style="font-weight:bold">目的蛋白：</td><td></td></tr></table><p><b>蛋白提取方法：</b></p><p></p><p><b>电泳条件：</b></p><p>分离胶浓度: %, 电压: V, 时间: min</p><p><b>转膜条件：</b></p><p>膜类型: , 电流: mA, 时间: min</p><p><b>一抗信息：</b></p><p>名称: , 稀释比例: 1:, 孵育条件: </p><p><b>二抗信息：</b></p><p>名称: , 稀释比例: 1:, 孵育条件: </p><p><b>显影结果：</b></p><p></p><p><b>结论：</b></p><p></p>',
    },
    {
      key: 'cell_culture',
      title: '细胞培养实验',
      icon: '🧫',
      description: '细胞复苏、传代、冻存、转染等细胞培养实验记录模板',
      content: '<h3>细胞培养实验</h3><table><tr><td style="width:120px;font-weight:bold">细胞名称：</td><td></td><td style="width:120px;font-weight:bold">细胞代数：</td><td></td></tr><tr><td style="font-weight:bold">培养基：</td><td></td><td style="font-weight:bold">血清浓度：</td><td></td></tr><tr><td style="font-weight:bold">操作日期：</td><td></td><td style="font-weight:bold">操作人员：</td><td></td></tr></table><p><b>操作类型：</b> 复苏 / 传代 / 冻存 / 转染</p><p><b>操作步骤：</b></p><p>1. </p><p>2. </p><p>3. </p><p><b>细胞状态：</b></p><p>融合度: %, 存活率: %</p><p><b>注意事项：</b></p><p></p><p><b>结论：</b></p><p></p>',
    },
    {
      key: 'ihc',
      title: '免疫组化实验',
      icon: '🔬',
      description: 'IHC脱蜡、抗原修复、抗体孵育、DAB显色等实验记录模板',
      content: '<h3>免疫组化实验</h3><table><tr><td style="width:120px;font-weight:bold">病理号：</td><td></td><td style="width:120px;font-weight:bold">实验日期：</td><td></td></tr><tr><td style="font-weight:bold">检测抗体：</td><td></td><td style="font-weight:bold">操作人员：</td><td></td></tr></table><p><b>抗原修复：</b></p><p>方法: , 时间: min, 温度: °C</p><p><b>一抗信息：</b></p><p>名称: , 稀释比例: 1:, 孵育条件: </p><p><b>检测系统：</b></p><p></p><p><b>DAB显色时间：</b> min</p><p><b>结果判读：</b></p><p>阳性部位: , 染色强度: , 阳性率: </p><p><b>结论：</b></p><p></p>',
    },
    {
      key: 'frozen',
      title: '冰冻切片实验',
      icon: '🧊',
      description: '冰冻切片制备、快速染色、术中诊断等实验记录模板',
      content: '<h3>冰冻切片实验</h3><table><tr><td style="width:120px;font-weight:bold">患者姓名：</td><td></td><td style="width:120px;font-weight:bold">住院号：</td><td></td></tr><tr><td style="font-weight:bold">病理号：</td><td></td><td style="font-weight:bold">送检科室：</td><td></td></tr><tr><td style="font-weight:bold">标本类型：</td><td></td><td style="font-weight:bold">手术日期：</td><td></td></tr></table><p><b>取材部位：</b></p><p></p><p><b>切片厚度：</b> μm</p><p><b>染色方法：</b></p><p></p><p><b>镜下所见：</b></p><p></p><p><b>冰冻诊断：</b></p><p></p><p><b>与术后诊断对比：</b></p><p></p>',
    },
    {
      key: 'tissue',
      title: '组织处理实验',
      icon: '🧫',
      description: '组织固定、脱水、包埋、脱钙等组织处理记录模板',
      content: '<h3>组织处理实验</h3><table><tr><td style="width:120px;font-weight:bold">患者姓名：</td><td></td><td style="width:120px;font-weight:bold">病理号：</td><td></td></tr><tr><td style="font-weight:bold">标本类型：</td><td></td><td style="font-weight:bold">处理日期：</td><td></td></tr></table><p><b>固定液：</b></p><p>固定时间: h</p><p><b>脱水程序：</b></p><p>75%乙醇: min, 85%乙醇: min, 95%乙醇: min, 无水乙醇: min</p><p><b>透明：</b></p><p>二甲苯: min</p><p><b>浸蜡：</b></p><p>石蜡: min, 温度: °C</p><p><b>包埋方式：</b></p><p></p><p><b>注意事项：</b></p><p></p>',
    },
  ]

  const handleEdit = (record: ExperimentRecord) => {
    navigate(`/lab/eln/record/edit?id=${record.id}&name=${encodeURIComponent(record.name)}`)
  }

  const handleSignature = (record: ExperimentRecord) => {
    setCurrentRecord(record)
    setSignatureModalVisible(true)
  }

  const handleDelete = (record: ExperimentRecord) => {
    setDeleteRecord(record)
    setDeleteModalVisible(true)
  }

  const handleVersion = (record: ExperimentRecord) => {
    setCurrentRecord(record)
    setVersionModalVisible(true)
  }

  const getExportMenuItems = (record: ExperimentRecord): MenuProps['items'] => [
    {
      key: 'pdf',
      icon: <FilePdfOutlined />,
      label: '导出为PDF',
      onClick: () => handleExport(record, 'pdf'),
    },
    {
      key: 'word',
      icon: <FileWordOutlined />,
      label: '导出为Word',
      onClick: () => handleExport(record, 'word'),
    },
  ]

  const getBatchExportMenuItems = (): MenuProps['items'] => [
    {
      key: 'pdf',
      icon: <FilePdfOutlined />,
      label: '批量导出PDF',
      onClick: () => handleBatchExport('pdf'),
    },
    {
      key: 'word',
      icon: <FileWordOutlined />,
      label: '批量导出Word',
      onClick: () => handleBatchExport('word'),
    },
  ]

  const buildExportHtml = (records: ExperimentRecord[]) => {
    const recordsHtml = records.map(record => `
      <div style="page-break-after: always;">
        <h1>${record.name}</h1>
        <h2>基本信息</h2>
        <table>
          <tr><td class="label" style="width:120px">记录ID</td><td>${record.id}</td><td class="label" style="width:120px">实验名称</td><td>${record.name}</td></tr>
          <tr><td class="label">创建人</td><td>${record.creator}</td><td class="label">模板名称</td><td>${record.template}</td></tr>
          <tr><td class="label">当前版本</td><td>${record.version}</td><td class="label">签名状态</td><td>${record.isLocked ? '已锁定' : '未锁定'}</td></tr>
          <tr><td class="label">创建时间</td><td>${record.createTime}</td><td class="label">最后修改</td><td>${record.lastModify}</td></tr>
        </table>
        <h2>实验目的</h2>
        <p class="content">${record.purpose || '暂无内容'}</p>
        <h2>实验步骤</h2>
        <p class="content">${record.steps || '暂无内容'}</p>
        <h2>实验数据</h2>
        <p class="content">${record.data || '暂无内容'}</p>
        <h2>结果分析</h2>
        <p class="content">${record.analysis || '暂无内容'}</p>
        ${record.attachments.length > 0 ? `<h2>附件</h2><p>${record.attachments.join('、')}</p>` : ''}
      </div>
    `).join('')

    return `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
      <head><meta charset="utf-8"><title>实验记录</title>
      <style>
        body { font-family: "SimSun","宋体",serif; font-size: 14px; color: #262626; line-height: 2; padding: 40px; }
        h1 { font-size: 22px; font-weight: bold; text-align: center; margin-bottom: 20px; }
        h2 { font-size: 16px; font-weight: bold; margin: 16px 0 8px; border-bottom: 1px solid #E5E5E5; padding-bottom: 4px; }
        table { width: 100%; border-collapse: collapse; margin: 8px 0; }
        td, th { border: 1px solid #D9D9D9; padding: 6px 10px; font-size: 14px; }
        th { background: #FAFAFA; font-weight: bold; }
        .label { color: #8C8C8C; }
        .content { white-space: pre-wrap; }
      </style></head><body>${recordsHtml}</body></html>`
  }

  const handleExport = (record: ExperimentRecord, format: 'pdf' | 'word') => {
    const htmlContent = buildExportHtml([record])

    if (format === 'word') {
      const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${record.name}.doc`
      link.click()
      URL.revokeObjectURL(url)
      message.success('Word文件导出成功')
    } else {
      Promise.all([import('jspdf'), import('html2canvas')]).then(([jsPDF, html2canvas]) => {
        const container = document.createElement('div')
        container.innerHTML = htmlContent
        container.style.cssText = 'font-family:"SimSun","宋体",serif;font-size:14px;color:#262626;line-height:2;padding:40px 60px;background:#fff;width:794px;position:absolute;left:-9999px;'
        document.body.appendChild(container)
        html2canvas.default(container, { scale: 2, useCORS: true }).then((canvas: HTMLCanvasElement) => {
          const imgData = canvas.toDataURL('image/jpeg', 0.98)
          const pdf = new jsPDF.default('p', 'mm', 'a4')
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()
          const imgWidth = pdfWidth - 20
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          let heightLeft = imgHeight
          let position = 10
          pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight)
          heightLeft -= (pdfHeight - 20)
          while (heightLeft > 0) {
            position = heightLeft - imgHeight + 10
            pdf.addPage()
            pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight)
            heightLeft -= (pdfHeight - 20)
          }
          pdf.save(`${record.name}.pdf`)
          document.body.removeChild(container)
          message.success('PDF文件导出成功')
        })
      })
    }
  }

  const handleBatchExport = (format: 'pdf' | 'word') => {
    if (selectedRowKeys.length === 0) {
      message.warning('请先选择需要导出的记录')
      return
    }
    const selectedRecords = filteredData.filter(item => selectedRowKeys.includes(item.key))
    const htmlContent = buildExportHtml(selectedRecords)
    const fileName = selectedRecords.length === 1 ? selectedRecords[0].name : `实验记录批量导出(${selectedRecords.length}条)`

    if (format === 'word') {
      const blob = new Blob(['\ufeff' + htmlContent], { type: 'application/msword' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${fileName}.doc`
      link.click()
      URL.revokeObjectURL(url)
      message.success(`已批量导出 ${selectedRecords.length} 条记录为Word文件`)
    } else {
      Promise.all([import('jspdf'), import('html2canvas')]).then(([jsPDF, html2canvas]) => {
        const container = document.createElement('div')
        container.innerHTML = htmlContent
        container.style.cssText = 'font-family:"SimSun","宋体",serif;font-size:14px;color:#262626;line-height:2;padding:40px 60px;background:#fff;width:794px;position:absolute;left:-9999px;'
        document.body.appendChild(container)
        html2canvas.default(container, { scale: 2, useCORS: true }).then((canvas: HTMLCanvasElement) => {
          const imgData = canvas.toDataURL('image/jpeg', 0.98)
          const pdf = new jsPDF.default('p', 'mm', 'a4')
          const pdfWidth = pdf.internal.pageSize.getWidth()
          const pdfHeight = pdf.internal.pageSize.getHeight()
          const imgWidth = pdfWidth - 20
          const imgHeight = (canvas.height * imgWidth) / canvas.width
          let heightLeft = imgHeight
          let position = 10
          pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight)
          heightLeft -= (pdfHeight - 20)
          while (heightLeft > 0) {
            position = heightLeft - imgHeight + 10
            pdf.addPage()
            pdf.addImage(imgData, 'JPEG', 10, position, imgWidth, imgHeight)
            heightLeft -= (pdfHeight - 20)
          }
          pdf.save(`${fileName}.pdf`)
          document.body.removeChild(container)
          message.success(`已批量导出 ${selectedRecords.length} 条记录为PDF文件`)
        })
      })
    }
  }

  const handleViewVersion = (version: VersionInfo) => {
    setCurrentVersion(version)
    setVersionDetailModalVisible(true)
  }

  const handleEditVersion = (version: VersionInfo) => {
    if (!currentRecord) return
    
    const newVersionNum = parseInt(currentRecord.version.replace('v', '').replace('.0', '')) + 1
    const newVersion: VersionInfo = {
      ...version,
      version: `v${newVersionNum}.0`,
      modifyTime: new Date().toISOString().split('T')[0],
      isCurrent: true,
      modifier: '当前用户'
    }

    setTableData(prev => prev.map(item => {
      if (item.id === currentRecord.id) {
        return {
          ...item,
          version: newVersion.version,
          lastModify: newVersion.modifyTime,
          purpose: newVersion.purpose,
          steps: newVersion.steps,
          data: newVersion.data,
          analysis: newVersion.analysis,
          versions: [
            ...item.versions.map(v => ({ ...v, isCurrent: false })),
            newVersion
          ]
        }
      }
      return item
    }))

    setFilteredData(prev => prev.map(item => {
      if (item.id === currentRecord.id) {
        return {
          ...item,
          version: newVersion.version,
          lastModify: newVersion.modifyTime,
          purpose: newVersion.purpose,
          steps: newVersion.steps,
          data: newVersion.data,
          analysis: newVersion.analysis,
          versions: [
            ...item.versions.map(v => ({ ...v, isCurrent: false })),
            newVersion
          ]
        }
      }
      return item
    }))

    message.success('已将历史版本内容复制为新的当前版本')
    setVersionModalVisible(false)
  }

  const handleCreateSubmit = (values: any) => {
    const now = new Date().toISOString().split('T')[0]
    const newRecord: ExperimentRecord = {
      key: String(idCounterRef.current++),
      id: `ELN2026${String(idCounterRef.current - 1).padStart(4, '0')}`,
      name: values.name,
      creator: '当前用户',
      template: values.template,
      version: 'v1.0',
      createTime: now,
      lastModify: now,
      isLocked: false,
      signatureImage: '',
      signatureName: '',
      signatureTime: '',
      purpose: values.purpose || '',
      steps: values.steps || '',
      data: values.data || '',
      analysis: values.analysis || '',
      attachments: [],
      versions: [{
        version: 'v1.0',
        modifier: '当前用户',
        modifyTime: now,
        isCurrent: true,
        purpose: values.purpose || '',
        steps: values.steps || '',
        data: values.data || '',
        analysis: values.analysis || ''
      }]
    }
    
    setTableData(prev => [newRecord, ...prev])
    setFilteredData(prev => [newRecord, ...prev])
    message.success('实验记录创建成功')
    setCreateModalVisible(false)
  }

  const handleEditSubmit = (values: any) => {
    if (!currentRecord) return
    
    const now = new Date().toISOString().split('T')[0]
    setTableData(prev => prev.map(item => 
      item.key === currentRecord.key 
        ? { 
            ...item, 
            name: values.name, 
            template: values.template, 
            lastModify: now,
            purpose: values.purpose || '',
            steps: values.steps || '',
            data: values.data || '',
            analysis: values.analysis || ''
          }
        : item
    ))
    setFilteredData(prev => prev.map(item => 
      item.key === currentRecord.key 
        ? { 
            ...item, 
            name: values.name, 
            template: values.template, 
            lastModify: now,
            purpose: values.purpose || '',
            steps: values.steps || '',
            data: values.data || '',
            analysis: values.analysis || ''
          }
        : item
    ))
    message.success('实验记录更新成功')
    setEditModalVisible(false)
  }

  const handleSignatureSubmit = () => {
    if (!currentRecord) return
    
    setTableData(prev => prev.map(item => 
      item.key === currentRecord.key 
        ? { ...item, isLocked: true, lastModify: new Date().toISOString().split('T')[0] }
        : item
    ))
    setFilteredData(prev => prev.map(item => 
      item.key === currentRecord.key 
        ? { ...item, isLocked: true, lastModify: new Date().toISOString().split('T')[0] }
        : item
    ))
    message.success('签名锁定成功，记录已不可编辑')
    setSignatureModalVisible(false)
  }

  const confirmDelete = () => {
    if (!deleteRecord) return
    
    setTableData(prev => prev.filter(item => item.key !== deleteRecord.key))
    setFilteredData(prev => prev.filter(item => item.key !== deleteRecord.key))
    message.success('删除成功')
    setDeleteModalVisible(false)
    setDeleteRecord(null)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, width: '100%', minHeight: '100%', padding: 0 }}>
      <PageTitle>实验记录</PageTitle>

      <Card style={{ borderRadius: 10, backgroundColor: '#FFFFFF', border: '1px solid #E5E5E5' }} bodyStyle={{ padding: 20 }}>
        <Form form={searchForm} layout="horizontal" labelCol={{ style: { paddingLeft: 0, width: 'auto', flex: 'none' } }} wrapperCol={{ style: { flex: 1 } }}>
          <Row gutter={16} style={{ height: '32px' }}>
            <Col span={6}>
              <Form.Item label="实验名称" name="name"><Input placeholder="请输入实验名称" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="创建人" name="creator"><Input placeholder="请输入创建人" /></Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item label="模板名称" name="template">
                <Select placeholder="请选择模板">
                  <Option value="all">全部</Option>
                  <Option value="细胞培养模板">细胞培养模板</Option>
                  <Option value="PCR实验模板">PCR实验模板</Option>
                  <Option value="Western Blot模板">Western Blot模板</Option>
                  <Option value="免疫组化模板">免疫组化模板</Option>
                  <Option value="动物实验模板">动物实验模板</Option>
                </Select>
              </Form.Item>
            </Col>
            {expanded && (
              <>
                <Col span={6}>
                  <Form.Item label="创建时间" name="dateRange">
                    <RangePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              </>
            )}
            {!expanded && (
              <Col span={6}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset} className="reset-btn">重置</Button>
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
            <Row gutter={16} style={{ marginLeft: '0px', marginRight: '0px', height: '32px', marginTop: '20px' }}>
              <Col span={6}>
                <Form.Item label="签名状态" name="status">
                  <Select placeholder="全部">
                    <Option value="all">全部</Option>
                    <Option value="locked">已锁定</Option>
                    <Option value="unlocked">未锁定</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6} offset={12}>
                <Form.Item>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', justifyContent: 'flex-end' }}>
                    <Button type="primary" icon={<SearchOutlined />} onClick={handleSearch}>查询</Button>
                    <Button onClick={handleReset} className="reset-btn">重置</Button>
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
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
            新建实验记录
          </Button>
          <Dropdown menu={{ items: getBatchExportMenuItems() }}>
            <Button icon={<ExportOutlined />} disabled={selectedRowKeys.length === 0}>
              批量导出{selectedRowKeys.length > 0 ? `(${selectedRowKeys.length})` : ''}
            </Button>
          </Dropdown>
        </div>
        <Table 
          columns={columns} 
          dataSource={filteredData} 
          scroll={{ x: 'max-content' }}
          rowSelection={{
            type: 'checkbox',
            selectedRowKeys,
            onChange: (keys) => setSelectedRowKeys(keys as string[])
          }}
          pagination={{ 
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`
          }}
        />
      </Card>

      <Modal
        title="查看实验记录"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={800}
      >
        {currentRecord && (
          <div>
            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>基本信息</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px 24px', marginBottom: 24 }}>
              <div><strong>记录ID：</strong>{currentRecord.id}</div>
              <div><strong>实验名称：</strong>{currentRecord.name}</div>
              <div><strong>创建人：</strong>{currentRecord.creator}</div>
              <div><strong>模板名称：</strong>{currentRecord.template}</div>
              <div><strong>创建时间：</strong>{currentRecord.createTime}</div>
              <div><strong>最后修改时间：</strong>{currentRecord.lastModify}</div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                  <strong>签名锁定：</strong>
                  <Tag color={currentRecord.isLocked ? 'green' : 'orange'}>
                    {currentRecord.isLocked ? '已锁定' : '未锁定'}
                  </Tag>
                </div>
                <div 
                  style={{ 
                    width: 200, 
                    height: 80, 
                    border: currentRecord.isLocked ? `1px solid ${isDark ? '#434343' : '#D9D9D9'}` : `1px dashed ${isDark ? '#434343' : '#D9D9D9'}`, 
                    borderRadius: 4,
                    backgroundColor: currentRecord.isLocked ? (isDark ? '#262626' : '#FAFAFA') : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}
                >
                  {currentRecord.isLocked && currentRecord.signatureImage ? (
                    <img 
                      src={currentRecord.signatureImage} 
                      alt="签名" 
                      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    />
                  ) : (
                    <span style={{ fontSize: 14, color: isDark ? '#8C8C8C' : '#999' }}>未签名</span>
                  )}
                </div>
                {currentRecord.isLocked && (
                  <div style={{ fontSize: 12, color: isDark ? '#8C8C8C' : '#8C8C8C' }}>
                    <div>签名人：{currentRecord.signatureName}</div>
                    <div>签名时间：{currentRecord.signatureTime}</div>
                  </div>
                )}
              </div>
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>实验目的</h3>
            <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
              {currentRecord.purpose || '暂无内容'}
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>实验步骤</h3>
            <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
              {currentRecord.steps || '暂无内容'}
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>实验数据</h3>
            <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, whiteSpace: 'pre-wrap' }}>
              {currentRecord.data || '暂无内容'}
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>结果分析</h3>
            <div style={{ marginBottom: 24, padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
              {currentRecord.analysis || '暂无内容'}
            </div>

            <h3 style={{ marginBottom: 16, fontSize: 16, fontWeight: 500 }}>附件</h3>
            <div style={{ marginBottom: 24 }}>
              {currentRecord.attachments && currentRecord.attachments.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                  {currentRecord.attachments.map((file, index) => (
                    <div 
                      key={index}
                      style={{ 
                        padding: 8, 
                        border: `1px solid ${isDark ? '#434343' : '#D9D9D9'}`, 
                        borderRadius: 4,
                        backgroundColor: isDark ? '#262626' : '#FAFAFA',
                        cursor: 'pointer'
                      }}
                      onClick={() => message.info(`查看附件: ${file}`)}
                    >
                      <span style={{ fontSize: 12 }}>{file}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8, color: '#999' }}>
                  暂无附件
                </div>
              )}
            </div>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, paddingTop: 16, borderTop: `1px solid ${isDark ? '#434343' : '#E8E8E8'}` }}>
          <Button onClick={() => setDetailModalVisible(false)}>关闭</Button>
          <Button type="primary" onClick={() => { setDetailModalVisible(false); handleVersion(currentRecord!) }}>历史版本</Button>
        </div>
      </Modal>

      <Modal
        title="电子签名"
        open={signatureModalVisible}
        onCancel={() => setSignatureModalVisible(false)}
        footer={null}
        width={600}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: 20 }}>请在此处进行电子签名确认</p>
          <div style={{ width: '100%', height: 200, border: '1px dashed #d9d9d9', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
            <span style={{ color: '#bfbfbf' }}>签名画板区域</span>
          </div>
          <div style={{ marginBottom: 20, padding: 16, backgroundColor: '#FFF7E6', borderRadius: 8 }}>
            <p style={{ color: '#FA8C16', margin: 0, fontSize: 14 }}>提示：签名后记录将被锁定，无法再进行编辑</p>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
            <Button onClick={() => setSignatureModalVisible(false)}>取消</Button>
            <Button type="primary" onClick={handleSignatureSubmit}>确认签名并锁定</Button>
          </div>
        </div>
      </Modal>

      <Modal
        title="确认删除"
        open={deleteModalVisible}
        onCancel={() => {
          setDeleteModalVisible(false)
          setDeleteRecord(null)
        }}
        footer={null}
      >
        <p>确定删除实验记录 <strong>{deleteRecord?.name}</strong> 吗？</p>
        <p style={{ color: '#FF4D4F', marginTop: 12 }}>删除后将无法恢复，此操作不可逆。</p>
        <div style={{ textAlign: 'right', marginTop: 20 }}>
          <Button onClick={() => {
            setDeleteModalVisible(false)
            setDeleteRecord(null)
          }}>取消</Button>
          <Button type="primary" danger onClick={confirmDelete} style={{ marginLeft: 10 }}>
            确定删除
          </Button>
        </div>
      </Modal>

      <Modal
        title="历史版本"
        open={versionModalVisible}
        onCancel={() => setVersionModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '1000px' }}
      >
        <div style={{ marginBottom: 20 }}>
          <h3 style={{ margin: 0, marginBottom: 8 }}>实验记录：{currentRecord?.name}</h3>
          <p style={{ color: '#8C8C8C', margin: 0 }}>记录ID：{currentRecord?.id}</p>
        </div>
        
        <Table
          dataSource={currentRecord?.versions || []}
          rowKey="version"
          pagination={false}
          bordered
          columns={[
            { 
              title: '版本号', 
              dataIndex: 'version', 
              key: 'version',
              render: (version: string, record: VersionInfo) => (
                <span>
                  {version}
                  {record.isCurrent && <Tag color="green" style={{ marginLeft: 8 }}>当前版本</Tag>}
                </span>
              )
            },
            { title: '修改人', dataIndex: 'modifier', key: 'modifier' },
            { title: '修改时间', dataIndex: 'modifyTime', key: 'modifyTime' },
            { 
              title: '是否当前版本', 
              dataIndex: 'isCurrent', 
              key: 'isCurrent',
              render: (isCurrent: boolean) => (
                <Tag color={isCurrent ? 'green' : 'gray'}>
                  {isCurrent ? '是' : '否'}
                </Tag>
              )
            },
            { 
              title: '操作', 
              key: 'action',
              render: (_: any, record: VersionInfo) => (
                <Space size="middle">
                  <Button type="text" onClick={() => handleViewVersion(record)}>查看</Button>
                  {!record.isCurrent && (
                    <Button type="text" onClick={() => handleEditVersion(record)}>编辑</Button>
                  )}
                </Space>
              )
            }
          ]}
        />
      </Modal>

      <Modal
        title={`版本详情 - ${currentVersion?.version}`}
        open={versionDetailModalVisible}
        onCancel={() => {
          setVersionDetailModalVisible(false)
          setCurrentVersion(null)
        }}
        footer={null}
        width="90%"
        style={{ maxWidth: '1000px' }}
        bodyStyle={{ padding: '20px', maxHeight: '80vh', overflowY: 'auto' }}
      >
        <div style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
                <p style={{ margin: 0, color: '#8C8C8C', fontSize: 12 }}>修改人</p>
                <p style={{ margin: 4, fontWeight: 500 }}>{currentVersion?.modifier}</p>
              </div>
            </Col>
            <Col span={12}>
              <div style={{ padding: 12, backgroundColor: '#F5F5F5', borderRadius: 8 }}>
                <p style={{ margin: 0, color: '#8C8C8C', fontSize: 12 }}>修改时间</p>
                <p style={{ margin: 4, fontWeight: 500 }}>{currentVersion?.modifyTime}</p>
              </div>
            </Col>
          </Row>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>实验目的</h4>
          <div style={{ padding: 12, border: '1px solid #E5E5E5', borderRadius: 8 }}>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{currentVersion?.purpose}</p>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>实验步骤</h4>
          <div style={{ padding: 12, border: '1px solid #E5E5E5', borderRadius: 8 }}>
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', fontFamily: 'inherit' }}>{currentVersion?.steps}</pre>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>实验数据</h4>
          <div style={{ padding: 12, border: '1px solid #E5E5E5', borderRadius: 8 }}>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{currentVersion?.data}</p>
          </div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h4 style={{ margin: 0, marginBottom: 8 }}>结果分析</h4>
          <div style={{ padding: 12, border: '1px solid #E5E5E5', borderRadius: 8 }}>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{currentVersion?.analysis}</p>
          </div>
        </div>

        <div style={{ textAlign: 'right' }}>
          <Button onClick={() => {
            setVersionDetailModalVisible(false)
            setCurrentVersion(null)
          }}>关闭</Button>
        </div>
      </Modal>

      <Modal
        title="选择实验记录模板"
        open={templateSelectModalVisible}
        onCancel={() => setTemplateSelectModalVisible(false)}
        footer={null}
        width={900}
      >
        <p style={{ color: '#8C8C8C', marginBottom: 16 }}>请选择与您实验相关的模板，模板内容将自动填充到新建实验记录中</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {HOSPITAL_TEMPLATES.map(template => (
            <div
              key={template.key}
              onClick={() => handleSelectTemplate(template)}
              style={{
                padding: 16,
                border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
                borderRadius: 8,
                cursor: 'pointer',
                backgroundColor: isDark ? '#141414' : '#FFFFFF',
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#177DDC'
                e.currentTarget.style.backgroundColor = isDark ? '#141F28' : '#E7F2FB'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark ? '#2C2C2C' : '#E5E5E5'
                e.currentTarget.style.backgroundColor = isDark ? '#141414' : '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 24 }}>{template.icon}</span>
                <span style={{ fontSize: 16, fontWeight: 600 }}>{template.title}</span>
              </div>
              <p style={{ margin: 0, fontSize: 13, color: '#8C8C8C' }}>{template.description}</p>
            </div>
          ))}
        </div>
      </Modal>

    </div>
  )
}