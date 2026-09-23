import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, Button, Input, Select, Form, Upload, message, Space, Tag, Tooltip, Divider, Row, Col, Modal, Tabs, Avatar, Dropdown } from 'antd'
import { 
  ArrowLeftOutlined, SaveOutlined, SendOutlined, LockOutlined,
  UploadOutlined, BoldOutlined, ItalicOutlined, UnderlineOutlined,
  StrikethroughOutlined, FontSizeOutlined, FontColorsOutlined,
  HighlightOutlined, OrderedListOutlined, UnorderedListOutlined,
  CheckSquareOutlined, AlignLeftOutlined, AlignCenterOutlined, AlignRightOutlined, LinkOutlined,
  TableOutlined, PictureOutlined, CodeOutlined, FileWordOutlined,
  UndoOutlined, RedoOutlined, ClearOutlined, FormatPainterOutlined,
  EyeOutlined, RobotOutlined, DownOutlined, FileTextOutlined, SearchOutlined,
  AppstoreOutlined, ThunderboltOutlined, StarOutlined,
  LeftOutlined, RightOutlined, PlusOutlined, EditOutlined,
  MenuOutlined, HolderOutlined, UpOutlined,
  CopyOutlined, CameraOutlined, ScanOutlined, QuestionCircleOutlined,
  SyncOutlined,
  DownloadOutlined,
  UserOutlined, LoadingOutlined, SafetyCertificateOutlined,
  TeamOutlined, ExperimentOutlined, IdcardOutlined, BookOutlined,
  SortDescendingOutlined, SortAscendingOutlined, SnippetsOutlined,
  ColumnHeightOutlined, FunctionOutlined, PieChartOutlined,
  CalculatorOutlined
} from '@ant-design/icons'
import PageTitle from '../../../components/PageTitle/PageTitle'
import { useThemeStore } from '../../../store/themeStore'
import AIExperiment from '../../ai/AIExperiment'
import OCRRecognition from '../../ai/OCRRecognition'

const { Option } = Select
const { TextArea } = Input

// 页面数据结构
interface PageData {
  id: string
  title: string
  icon: string
  content: string
}

// 预设页面类型
interface PageTypeOption {
  key: string
  title: string
  icon: React.ReactNode
  description: string
}

const PAGE_TYPE_OPTIONS: PageTypeOption[] = [
  { key: 'cover', title: '封面信息', icon: <IdcardOutlined />, description: '新建记录本封面页' },
  { key: 'requirement', title: '实验记录要求', icon: <FileTextOutlined />, description: '新建实验记录要求页' },
  { key: 'integrity', title: '科研诚信承诺书', icon: <SafetyCertificateOutlined />, description: '新建诚信承诺页' },
  { key: 'subject', title: '研究对象信息', icon: <TeamOutlined />, description: '新建研究对象信息页' },
  { key: 'experiment', title: '实验记录', icon: <ExperimentOutlined />, description: '新建空白实验记录页' },
  { key: 'secrecy', title: '保密守则', icon: <LockOutlined />, description: '新建保密守则页' },
  { key: 'backcover', title: '封底', icon: <BookOutlined />, description: '新建记录本封底页' },
]

// 各页面类型的默认内容
const PAGE_DEFAULT_CONTENT: Record<string, string> = {
  cover: `<p style="text-align:center;margin-bottom:32px;"><span style="color:#000;font-family:'SimHei','黑体',sans-serif;font-size:14px;font-weight:normal;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;&nbsp;</span></p><p style="text-align:center;margin-bottom:32px;"><span style="color: rgb(0, 0, 0); font-family: SimHei, 黑体, sans-serif;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span style="color: rgb(0, 0, 0); font-family: SimHei, 黑体, sans-serif;">&nbsp;</span><span style="color: rgb(0, 0, 0); font-family: SimHei, 黑体, sans-serif;"><font size="3">学号:</font></span></p><p style="text-align:center;margin-bottom:32px;"><span style="color: rgb(0, 0, 0); font-family: SimHei, 黑体, sans-serif;">&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</span><span style="color: rgb(0, 0, 0); font-family: SimHei, 黑体, sans-serif;">&nbsp;</span><span style="color: rgb(0, 0, 0); font-family: SimHei, 黑体, sans-serif;"><font size="3">秘级:</font></span></p><h1 style="font-weight:700;text-align:center;margin-bottom:16px;color:#000;"><span style="font-family: SimSun, 宋体, serif;"><font size="6">昆明医科大学</font></span></h1><h1 style="font-weight:700;text-align:center;margin-bottom:32px;color:#000;"><span style="font-family: SimSun, 宋体, serif;"><font size="7">科研实验记录</font></span></h1><div style="margin:40px 0;"><br></div><div style="font-family:'SimSun','宋体',serif;font-size:16px;line-height:2.5;"><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 课题名称:</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 题目起讫日期:</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 研究生姓名:</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 导师姓名:</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 所在单位:</div><div>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 入学时间:</div></div><div style="margin:60px 0;"><br></div><div style="text-align:center;font-family:'SimSun','宋体',serif;font-size:24px;">昆明医科大学研究生院</div><div style="text-align:center;font-family:'SimSun','宋体',serif;font-size:24px;"><br></div><div style="text-align:center;font-family:'SimSun','宋体',serif;font-size:24px;"><br></div><div style="text-align:center;font-family:'SimSun','宋体',serif;font-size:24px;"><br></div>`,
  requirement: `<h1 style="font-weight: 700; text-align: center; margin-bottom: 32px; color: rgb(0, 0, 0);"><font face="SimSun" style="" size="6"><br></font></h1><h1 style="font-weight: 700; text-align: center; margin-bottom: 32px; color: rgb(0, 0, 0);"><span style="font-family: SimSun; font-size: xx-large;">昆明医科大学研究生科研实验记录的要求</span></h1><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;">&nbsp; &nbsp; 实验记录是科研和实验过程的原始、真实的反映，是培养研究生科研基本知识、基本技能的重要手段和进行规范科学实验的重要内容，是研究生学位论文真实性和可信度的有力证明材料。因此，导师和研究生务必高度重视实验过程的记</span></font><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">录工作，培养和锻炼研究生严谨、认真、求实的学风和科学态度。为此，特制定如下要求:</span></h2><h2 style="margin-bottom: 16px;"><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">&nbsp; &nbsp;</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">&nbsp;</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">1.实验记录必须用研究生院统一印制的记录本、以碳素笔或钢笔认真如实地记录学位课题研究的全过程。</span></h2><h2 style="margin-bottom: 16px;"><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">&nbsp; &nbsp;</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">&nbsp;</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">2.实验记录应对包括实验时间、地点、条件、对象(材料)、设备仪器、试剂、技术方法、实验结果等内容一一进行详细记录，按照记录应当能有效地进行实验的重复。进行问卷调查或现场座谈工作也应进行相应记录。</span></h2><h2 style="margin-bottom: 16px;"><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">&nbsp; &nbsp;</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">&nbsp;</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">3.实验仪器或电脑打印的图、表等数据资料也应附在记录中。</span></h2><h2 style="margin-bottom: 16px;"><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">&nbsp; &nbsp;</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">&nbsp;</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">4.实验记录必须保持它的原始性，不允许在答辩前将原始记录抄录在记录</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">本上，更不允许"补做"实验记录。实验记录经形式审查不符合上述要</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">求者不得进行论文答辩。</span></h2><h2 style="margin-bottom: 16px;"><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">&nbsp; &nbsp;</span><span style="font-size: 16px; font-weight: normal; color: #2b3034; font-family: SimHei, 黑体, sans-serif;">&nbsp;</span><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;">5.研究生的学位课题无论课题来源如何，在答辩前均必须提供原始实验记录交答辩委员会审阅，答&nbsp; 辩后原始实验记录原则上存入研究生的学位档案。记录若要求存入科研档案者，应由学校科研处或各二级学院科研管理机构出具证明并将实验记录复印件存入该生的学位档案。除学校档案室外，其他需存留研究生实验记录的部门必须是国家有关科研机构认可的部门，否则不允许存留研究生的实验记录。</span></font></h2><div><br></div><div><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;"><br></span></font></div><div><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;"><br></span></font></div><div><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;"><br></span></font></div><div><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;"><br></span></font></div><div><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;"><br></span></font></div>`,
  integrity: `<h1 style="text-align: center; margin-bottom: 5px; margin-top: 0px;"><font color="#000000" face="SimHei, 黑体, sans-serif"><span style="font-size: 22px;"><br></span></font></h1><h1 style="text-align: center; margin-bottom: 5px; margin-top: 0px;"><font color="#000000" face="SimHei, 黑体, sans-serif"><span style="font-size: 22px;">昆明医科大学</span></font></h1><h1 style="text-align: center; margin-bottom: 32px;"><font color="#000000" face="SimHei, 黑体, sans-serif"><span style="font-size: 22px;">研究生科研诚信承诺书</span></font></h1><h1 style="text-align: left; margin-bottom: 32px;"><font color="#000000"><span style="font-family: SimHei, 黑体, sans-serif; font-size: 22px;">&nbsp; &nbsp; </span><font size="3" style="font-weight: normal;" face="SimSun">本人郑重承诺:本人将本着求实严谨的态度在导师的指导下进行学位课题的研究工作，并将按照《昆明医科大学研究生科研实验记录》的要求，真实、完整地记录实验过程，妥善保存有关实验资料，同时，自觉抵制一切违背科学道德的学术不端行为，若有违反，本人愿承担一切后果及相关责任。</font></font></h1><h1 style="text-align: center; margin-bottom: 32px;"><span style="font-weight: 400; color: rgb(0, 0, 0); font-family: SimHei, 黑体, sans-serif; font-size: medium;">研究生（签名）:<u>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</u> &nbsp; &nbsp; &nbsp; 年&nbsp; &nbsp; &nbsp; 月&nbsp; &nbsp; &nbsp; 日</span></h1><div><span style="font-weight: 400; color: rgb(0, 0, 0); font-family: SimHei, 黑体, sans-serif; font-size: medium;"><br></span></div><div><span style="font-weight: 400; color: rgb(0, 0, 0); font-family: SimHei, 黑体, sans-serif; font-size: medium;"><br></span></div><h1 style="text-align: center; margin-bottom: 32px;"><font color="#000000" face="SimHei, 黑体, sans-serif" size="3"><span style="font-weight: 400;"><br></span></font></h1><div><font color="#000000" face="SimHei, 黑体, sans-serif" size="3"><span style="font-weight: 400;"><br></span></font></div><h1 style="text-align: left; margin-bottom: 32px;"><font color="#000000" face="SimHei, 黑体, sans-serif" size="3" style="font-weight: normal;">&nbsp; &nbsp; 本人郑重承诺:本人将认真履行导师职责，切实加强对研究生的指导，注重科学精神和学术道德的培育，严格落实培养过程管理的有关要求，言传身教，为人师表，自觉抵制一切违背科学道德的学术不端行为，若学生违反上述承诺，本人愿承担作为导师的相关责任。</font></h1><h1 style="margin-bottom: 32px; text-align: center;"><font color="#000000" face="SimHei, 黑体, sans-serif" size="3"><span style="font-weight: 400;">指导教师（签名）:<u>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </u>&nbsp; &nbsp; &nbsp; &nbsp; &nbsp;年&nbsp; &nbsp; &nbsp; 月&nbsp; &nbsp; &nbsp; 日</span></font></h1><div><font color="#000000" face="SimHei, 黑体, sans-serif" size="3"><span style="font-weight: 400;"><br></span></font></div><div><font color="#000000" face="SimHei, 黑体, sans-serif" size="3"><span style="font-weight: 400;"><br></span></font></div><div><font color="#000000" face="SimHei, 黑体, sans-serif" size="3"><span style="font-weight: 400;"><br></span></font></div><div><font color="#000000" face="SimHei, 黑体, sans-serif" size="3"><span style="font-weight: 400;"><br></span></font></div><div><font color="#000000" face="SimHei, 黑体, sans-serif" size="3"><span style="font-weight: 400;"><br></span></font></div>`,
  subject: `<h1 style="text-align: left; margin-bottom: 5px; margin-top: 0px;"><font color="#000000" face="SimSun" size="3"><span style="font-weight: 400;">参加本题研究的人员及职称：</span></font></h1><div><table border="1" style="border-collapse:collapse;width:100%;table-layout:fixed"><tbody><tr><td style="text-align: center; padding: 8px; border: 1px solid #2b3034; min-width: 60px; word-break:break-word;"><font size="3">&nbsp;姓名</font></td><td style="text-align: center; padding: 8px; border: 1px solid #2b3034; min-width: 60px; word-break:break-word;"><font size="3">&nbsp;性别</font></td><td style="text-align: center; padding: 8px; border: 1px solid #2b3034; min-width: 60px; word-break:break-word;"><font size="3">&nbsp;年龄</font></td><td style="text-align: center; padding: 8px; border: 1px solid #2b3034; min-width: 60px; word-break:break-word;"><font size="3">&nbsp;职称</font></td><td style="text-align: center; padding: 8px; border: 1px solid #2b3034; min-width: 60px; word-break:break-word;"><font size="3">&nbsp;备注</font></td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td><td style="padding:8px;border:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr></tbody></table><br></div>`,
  experiment: `<div style="display:flex;align-items:center;position:relative;margin-bottom:5px;margin-top:0px;"><h1 style="flex:1;text-align:center;margin:0;"><font face="SimSun" style="color:#2b3034;font-weight:normal;" size="3">年&nbsp; &nbsp;月&nbsp; &nbsp;日</font></h1><span style="position:absolute;right:0;"><font face="SimSun" style="color:#2b3034;font-weight:normal;" size="3">第1页</font></span></div><div><table style="border-collapse:collapse;width:100%;table-layout:fixed"><tbody><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr><tr><td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td></tr></tbody></table><br></div><div style="text-align: center;"><font color="#2b3034" size="3">实验者签名:<u>&nbsp; &nbsp; &nbsp; &nbsp;</u></font></div>`,
  secrecy: `<h1 style="font-size: 22px; font-weight: 700; text-align: center; margin-bottom: 32px; color: rgb(0, 0, 0);"><font face="SimSun"><br></font></h1><h1 style="font-weight: 700; text-align: center; margin-bottom: 32px; color: rgb(0, 0, 0);"><font face="SimSun" style="" size="6">保密守则</font></h1><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px;"><span style="font-weight: normal;">一、</span></span><span style="font-size: 16px; font-weight: 400;">不该说的机密，绝对不说;</span></font></h2><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px;"><span style="font-weight: normal;">二、不该知道的机密，不打听;</span></span></font></h2><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px;"><span style="font-weight: normal;">三、不该看的机密一定不看;</span></span></font></h2><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;">四、私人通讯不得涉及国家机密;</span></font></h2><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;">五、不在不利于保密的场合下谈论机密;</span></font></h2><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;">六、私人笔记本不得记录国家机密事项;</span></font></h2><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;">七、宿舍内不得带人或存放机密文件;</span></font></h2><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;">八、外出携带机密文件，必须经领导批准，并要有设备妥善保管;</span></font></h2><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;">九、调动工作时，必须把机密文件资料，向组织上指定的人员交</span></font></h2><h2 style="margin-bottom: 16px;"><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px; font-weight: normal;">待清楚:</span></font></h2><div><font color="#2b3034" face="SimHei, 黑体, sans-serif"><span style="font-size: 16px;"><div style="">十、发现了违反保密制度或丢失机密文件，应进行斗争，及时向</div><div style="">领导检举、报告和如实反映情况。</div><div style=""><br></div><div style=""><br></div><div style=""><br></div><div style=""><br></div><div style=""><br></div><div style=""><br></div></span></font></div>`,
  backcover: '<div style="margin:120px 0;"><br></div>'.repeat(16),
}

// 医院实验公式库（分类）
const FORMULA_CATEGORIES = [
  {
    category: '肾功能',
    formulas: [
      { name: '肌酐清除率(Cockcroft-Gault)', formula: '(140-age)*weight/(72*cr)', vars: { age: '年龄(岁)', weight: '体重(kg)', cr: '血肌酐(mg/dL)' } },
      { name: '估算肾小球滤过率(eGFR)', formula: '186*pow(cr, -1.154)*pow(age, -0.203)', vars: { age: '年龄(岁)', cr: '血肌酐(mg/dL)' } },
      { name: '尿蛋白肌酐比(UPCR)', formula: 'protein/cr', vars: { protein: '尿蛋白(mg/dL)', cr: '尿肌酐(mg/dL)' } },
    ],
  },
  {
    category: '体液与营养',
    formulas: [
      { name: '体质指数(BMI)', formula: 'weight/(height*height)', vars: { weight: '体重(kg)', height: '身高(m)' } },
      { name: '体表面积(Mosteller)', formula: 'sqrt(height*weight/3600)', vars: { height: '身高(cm)', weight: '体重(kg)' } },
      { name: '理想体重(IBW)', formula: '50+2.3*(height*100/2.54-60)', vars: { height: '身高(m)' } },
    ],
  },
  {
    category: '血气与电解质',
    formulas: [
      { name: '阴离子间隙(AG)', formula: 'na-cl-hco3', vars: { na: '钠(mmol/L)', cl: '氯(mmol/L)', hco3: '碳酸氢根(mmol/L)' } },
      { name: '矫正钙', formula: 'ca+0.02*(40-alb)', vars: { ca: '实测钙(mmol/L)', alb: '白蛋白(g/L)' } },
      { name: '血浆渗透压', formula: '2*na+glu+bun', vars: { na: '钠(mmol/L)', glu: '血糖(mmol/L)', bun: '尿素氮(mmol/L)' } },
    ],
  },
  {
    category: '血液学',
    formulas: [
      { name: '红细胞比容(Hct)估测', formula: 'hb*3', vars: { hb: '血红蛋白(g/dL)' } },
      { name: '平均红细胞体积(MCV)', formula: 'hct/rbc', vars: { hct: '红细胞比容(%)', rbc: '红细胞计数(10^12/L)' } },
      { name: '平均血红蛋白浓度(MCHC)', formula: 'hb/hct', vars: { hb: '血红蛋白(g/dL)', hct: '红细胞比容(%)' } },
    ],
  },
  {
    category: '心血管',
    formulas: [
      { name: '平均动脉压(MAP)', formula: 'dbp+(sbp-dbp)/3', vars: { dbp: '舒张压(mmHg)', sbp: '收缩压(mmHg)' } },
      { name: '脉压(PP)', formula: 'sbp-dbp', vars: { sbp: '收缩压(mmHg)', dbp: '舒张压(mmHg)' } },
      { name: '心脏指数(CI)', formula: 'co/bsa', vars: { co: '心输出量(L/min)', bsa: '体表面积(m²)' } },
    ],
  },
]

// 扁平化公式列表（用于搜索和插入）
const ALL_FORMULAS: { name: string; formula: string; vars: Record<string, string> }[] = FORMULA_CATEGORIES.flatMap(c => c.formulas as any)

// 公式计算：安全求值（支持 sqrt/pow/sin/cos/tan/log/abs/exp/ceil/floor/round/max/min，^ 转换为 **）
const safeEvalFormula = (expr: string): number | null => {
  try {
    let e = expr.replace(/\^/g, '**')
    const mathFns: Record<string, (...args: number[]) => number> = {
      sqrt: Math.sqrt, pow: Math.pow, abs: Math.abs, exp: Math.exp,
      ceil: Math.ceil, floor: Math.floor, round: Math.round,
      max: Math.max, min: Math.min,
      sin: Math.sin, cos: Math.cos, tan: Math.tan, log: Math.log, ln: Math.log,
    }
    Object.entries(mathFns).forEach(([name, fn]) => {
      e = e.replace(new RegExp(`\\b${name}\\b`, 'g'), `Math.${name}`)
    })
    e = e.replace(/\bpi\b/gi, 'Math.PI').replace(/\bE\b/g, 'Math.E')
    const result = Function('"use strict"; return (' + e + ')')()
    if (typeof result === 'number' && isFinite(result)) return result
    return null
  } catch { return null }
}

// 公式计算：从公式中提取变量名（排除数学函数）
const extractFormulaVars = (formula: string): string[] => {
  const tokens = formula.match(/[a-zA-Z_][a-zA-Z0-9_]*/g) || []
  const mathFuncs = new Set(['sin','cos','tan','log','ln','sqrt','abs','exp','pow','pi','e','PI','E','ceil','floor','round','max','min','Math'])
  return [...new Set(tokens)].filter(t => !mathFuncs.has(t))
}

let pageIdCounter = 100

function generatePageId(): string {
  return `page_${++pageIdCounter}_${Date.now()}`
}

export default function ElnRecordEditor() {
  const { isDark } = useThemeStore()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [form] = Form.useForm()
  const editId = searchParams.get('id')
  const isEdit = !!editId

  // 页面管理
  const [pages, setPages] = useState<PageData[]>(() => {
    const defaultPages: PageData[] = [
      { id: 'page_cover', title: '封面信息', icon: '', content: PAGE_DEFAULT_CONTENT.cover },
      { id: 'page_requirement', title: '实验记录要求', icon: '', content: PAGE_DEFAULT_CONTENT.requirement },
      { id: 'page_integrity', title: '科研诚信承诺书', icon: '', content: PAGE_DEFAULT_CONTENT.integrity },
      { id: 'page_subject', title: '研究对象信息', icon: '', content: PAGE_DEFAULT_CONTENT.subject },
      { id: 'page_experiment', title: '实验记录', icon: '', content: PAGE_DEFAULT_CONTENT.experiment },
      { id: 'page_secrecy', title: '保密守则', icon: '', content: PAGE_DEFAULT_CONTENT.secrecy },
      { id: 'page_backcover', title: '封底', icon: '', content: PAGE_DEFAULT_CONTENT.backcover },
    ]
    if (!editId) {
      const templateData = sessionStorage.getItem('eln_create_template')
      if (templateData) {
        try {
          const template = JSON.parse(templateData)
          // 将模板内容插入实验记录页，保留年月日/页码头部和签名尾部
          const experimentHeader = `<div style="display:flex;align-items:center;position:relative;margin-bottom:5px;margin-top:0px;"><h1 style="flex:1;text-align:center;margin:0;"><font face="SimSun" style="color:#2b3034;font-weight:normal;" size="3">年&nbsp; &nbsp;月&nbsp; &nbsp;日</font></h1><span style="position:absolute;right:0;"><font face="SimSun" style="color:#2b3034;font-weight:normal;" size="3">第1页</font></span></div>`
          const experimentFooter = `<div style="text-align: center;"><font color="#2b3034" size="3">实验者签名:<u>&nbsp; &nbsp; &nbsp; &nbsp;</u></font></div>`
          defaultPages[4].content = experimentHeader + '<div>' + template.content + '</div>' + experimentFooter
          sessionStorage.removeItem('eln_create_template')
        } catch {}
      }
    }
    return defaultPages
  })
  const [currentPageIndex, setCurrentPageIndex] = useState(0)
  const [editingPageId, setEditingPageId] = useState<string | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  // 模态框
  const [addPageModalVisible, setAddPageModalVisible] = useState(false)
  const [aiModalVisible, setAiModalVisible] = useState(false)
  const [signatureModalVisible, setSignatureModalVisible] = useState(false)
  const signatureCanvasRef = useRef<HTMLCanvasElement>(null)
  const signatureTargetRef = useRef<HTMLElement | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  // AI功能
  const [aiTab, setAiTab] = useState('write')
  const [aiPrompt, setAiPrompt] = useState('')
  const [aiResult, setAiResult] = useState('')
  const [aiGenerating, setAiGenerating] = useState(false)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoText, setPhotoText] = useState('')
  const [photoRecognizing, setPhotoRecognizing] = useState(false)
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null)
  const [cameraActive, setCameraActive] = useState(false)
  const [savedRange, setSavedRange] = useState<Range | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // 图表插入（默认数据）
  const defaultChartData = [
    { name: '样本A', value: 30 },
    { name: '样本B', value: 50 },
    { name: '样本C', value: 20 },
  ]

  // 数学公式
  const [formulaModalVisible, setFormulaModalVisible] = useState(false)
  const [formulaType, setFormulaType] = useState<'inline' | 'block'>('inline')
  const [formulaInput, setFormulaInput] = useState('')

  // 公式计算（行内组件）
  // 公式库弹窗
  const [formulaLibModalVisible, setFormulaLibModalVisible] = useState(false)
  const [formulaLibSearch, setFormulaLibSearch] = useState('')
  const [formulaLibActiveBlock, setFormulaLibActiveBlock] = useState<HTMLElement | null>(null)
  const [formulaLibActiveCategory, setFormulaLibActiveCategory] = useState(0)
  // AI生成公式弹窗
  const [aiFormulaModalVisible, setAiFormulaModalVisible] = useState(false)
  const [aiFormulaInput, setAiFormulaInput] = useState('')
  const [aiFormulaResult, setAiFormulaResult] = useState<{ name: string; formula: string; vars: Record<string, string> } | null>(null)
  const [aiFormulaGenerating, setAiFormulaGenerating] = useState(false)

  // 保存/恢复编辑器选区
  const savedSelectionRef = useRef<Range | null>(null)
  // 获取选中文字的字号（映射 fontSize 命令值 1-7 到实际字号）
  const detectFontSize = () => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    let node = sel.anchorNode
    if (!node) return
    if (node.nodeType === Node.TEXT_NODE) node = node.parentNode as Node
    // 向上查找，获取最近的 fontSize 相关样式
    let el = node as HTMLElement
    while (el && el !== editorRefs.current.get(currentPage.id)) {
      const computed = window.getComputedStyle(el)
      const size = computed.fontSize
      const px = parseInt(size)
      if (!isNaN(px)) {
        // 将 px 映射回 fontSize 1-7
        const map: Record<number, string> = { 10: '1', 12: '1', 13: '2', 14: '2', 16: '3', 18: '4', 24: '5', 32: '6', 48: '7' }
        // 找最接近的
        let closest = '3'
        let minDiff = Infinity
        for (const [pxStr, val] of Object.entries(map)) {
          const diff = Math.abs(parseInt(pxStr) - px)
          if (diff < minDiff) { minDiff = diff; closest = val }
        }
        setCurrentFontSize(closest)
        return
      }
      el = el.parentElement as HTMLElement
    }
  }

  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      const range = sel.getRangeAt(0)
      const el = editorRefs.current.get(currentPage.id)
      if (el && el.contains(range.commonAncestorContainer)) {
        savedSelectionRef.current = range.cloneRange()
      }
    }
    // 检测当前字号
    detectFontSize()
  }
  const restoreSelection = () => {
    const sel = window.getSelection()
    if (sel && savedSelectionRef.current) {
      sel.removeAllRanges()
      sel.addRange(savedSelectionRef.current)
    }
  }

  // 工具栏
  const [currentFontSize, setCurrentFontSize] = useState('16')
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  // 表格操作浮动工具栏
  const [tableToolbarVisible, setTableToolbarVisible] = useState(false)
  const [tableToolbarPos, setTableToolbarPos] = useState({ top: 0, left: 0 })
  const [activeTableEl, setActiveTableEl] = useState<HTMLTableElement | null>(null)
  const [activeCellEl, setActiveCellEl] = useState<HTMLTableCellElement | null>(null)

  // 实验名称
  const [recordName, setRecordName] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [editNameValue, setEditNameValue] = useState('')

  // 编辑器 refs
  const editorRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  const currentPage = pages[currentPageIndex]
  const totalPages = pages.length

  useEffect(() => {
    if (isEdit) {
      const nameFromUrl = searchParams.get('name')
      const displayName = nameFromUrl ? decodeURIComponent(nameFromUrl) : `实验记录 ${editId}`
      form.setFieldsValue({
        name: displayName,
        template: '病理实验记录',
      })
      setRecordName(displayName)
    } else {
      const storedName = localStorage.getItem('eln_record_name')
      setRecordName(storedName || '')
    }
  }, [isEdit, form])

  // 监听全局AI按钮点击事件（从Layout.tsx触发）
  useEffect(() => {
    const handleAiEvent = () => {
      saveSelection()
      setAiModalVisible(true)
    }
    window.addEventListener('open-ai-modal', handleAiEvent)
    return () => window.removeEventListener('open-ai-modal', handleAiEvent)
  }, [])

  // 点击编辑区外部时隐藏表格工具栏
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (tableToolbarVisible && !target.closest('td,th') && !target.closest('[data-table-toolbar]')) {
        setTableToolbarVisible(false)
        setActiveTableEl(null)
        setActiveCellEl(null)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [tableToolbarVisible])

  // 保存
  const handleSave = () => {
    setSaving(true)
    setTimeout(() => {
      setSaving(false)
      setSaved(true)
      message.success('实验记录保存成功')
      setTimeout(() => setSaved(false), 3000)
    }, 500)
  }

  const handleSubmit = () => {
    message.success('实验记录提交成功')
    navigate('/lab/eln/record')
  }

  const handleBack = () => {
    navigate('/lab/eln/record')
  }

  // 页面切换
  const goToPage = (index: number) => {
    if (index >= 0 && index < totalPages) {
      // 保存当前页面内容
      const currentEl = editorRefs.current.get(currentPage.id)
      if (currentEl) {
        updatePageContent(currentPage.id, currentEl.innerHTML)
      }
      setCurrentPageIndex(index)
      setTableToolbarVisible(false)
      // 重置内容区滚动位置
      setTimeout(() => {
        const scrollContainer = document.querySelector('[data-editor-scroll-area]')
        if (scrollContainer) scrollContainer.scrollTop = 0
      }, 0)
    }
  }

  const goToPrevPage = () => goToPage(currentPageIndex - 1)
  const goToNextPage = () => goToPage(currentPageIndex + 1)

  // 更新页面内容
  const updatePageContent = (pageId: string, content: string) => {
    setPages(prev => prev.map(p => p.id === pageId ? { ...p, content } : p))
  }

  // 新增页面
  const handleAddPage = (pageType: PageTypeOption) => {
    const newPage: PageData = {
      id: generatePageId(),
      title: pageType.title,
      icon: pageType.icon,
      content: pageType.key === 'experiment'
        ? PAGE_DEFAULT_CONTENT.experiment.replace('第1页', `第${pages.filter(p => p.title === '实验记录').length + 1}页`)
        : (PAGE_DEFAULT_CONTENT[pageType.key] || ''),
    }
    setPages(prev => [...prev, newPage])
    setAddPageModalVisible(false)
    setCurrentPageIndex(pages.length)
    message.success(`已添加「${pageType.title}」页面`)
  }

  // 删除页面
  const handleDeletePage = (pageId: string) => {
    const index = pages.findIndex(p => p.id === pageId)
    if (index === -1) return
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除「${pages[index].title}」页面吗？`,
      okText: '确定',
      cancelText: '取消',
      onOk: () => {
        const newPages = pages.filter(p => p.id !== pageId)
        setPages(newPages)
        if (currentPageIndex >= newPages.length) {
          setCurrentPageIndex(Math.max(0, newPages.length - 1))
        } else if (currentPageIndex > index) {
          setCurrentPageIndex(currentPageIndex - 1)
        }
        message.success('页面已删除')
      },
    })
  }

  // AI功能 - AI书写
  const handleAiGenerate = () => {
    if (!aiPrompt.trim()) {
      message.warning('请输入需求描述')
      return
    }
    setAiGenerating(true)
    setAiResult('')
    // 模拟AI生成
    setTimeout(() => {
      const mockResult = `<p style="text-indent:2em;margin-bottom:12px;">根据您的需求「${aiPrompt}」，以下是AI生成的内容：</p><p style="text-indent:2em;margin-bottom:12px;">这里将展示AI根据您的描述自动生成的文档内容。在实际应用中，此功能将调用大语言模型API来生成符合要求的文本内容，并可直接插入到实验记录文档中。</p><p style="text-indent:2em;margin-bottom:12px;">您可以点击下方"复制到文档"按钮，将生成的内容插入到当前编辑位置。</p>`
      setAiResult(mockResult)
      setAiGenerating(false)
    }, 1500)
  }

  const handleInsertAiResult = () => {
    if (!aiResult) return
    const el = editorRefs.current.get(currentPage?.id || '')
    if (!el) {
      message.error('未找到编辑区域')
      return
    }
    el.focus()
    restoreSelection()
    // 使用insertHTML将AI生成内容插入到光标位置
    document.execCommand('insertHTML', false, aiResult)
    updatePageContent(currentPage!.id, el.innerHTML)
    message.success('内容已插入文档')
    setAiResult('')
    setAiPrompt('')
  }

  // AI功能 - 拍照识别
  const handlePhotoRecognize = () => {
    if (!photoFile) {
      message.warning('请先上传或拍摄图片')
      return
    }
    setPhotoRecognizing(true)
    setPhotoText('')
    setTimeout(() => {
      setPhotoText('这是拍照识别后的示例文本内容。\n在实际应用中，此功能将调用OCR识别API来提取图片中的文字信息。\n识别结果可以复制粘贴到实验记录文档中。')
      setPhotoRecognizing(false)
    }, 1500)
  }

  const handleCopyPhotoText = () => {
    if (!photoText) return
    navigator.clipboard.writeText(photoText).then(() => {
      message.success('文本已复制到剪贴板，可粘贴到文档中')
    })
  }

  // 拍照上传 - 摄像头操作
  const saveCursorPosition = () => {
    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      setSavedRange(selection.getRangeAt(0).cloneRange())
    }
  }

  const startCamera = async () => {
    saveCursorPosition()
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      setCameraStream(stream)
      setCameraActive(true)
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 100)
    } catch {
      message.error('无法访问摄像头，请检查权限设置')
    }
  }

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop())
      setCameraStream(null)
    }
    setCameraActive(false)
  }

  const captureAndInsert = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.drawImage(video, 0, 0)
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const editorEl = editorRefs.current[currentPage.id]
          if (editorEl && savedRange) {
            editorEl.focus()
            const selection = window.getSelection()
            if (selection) {
              selection.removeAllRanges()
              selection.addRange(savedRange)
            }
            document.execCommand('insertHTML', false, `<img src="${url}" style="max-width:100%;border-radius:4px;margin:8px 0;" />`)
            handleEditorInput(currentPage.id)
            message.success('照片已插入到文档')
          } else if (editorEl) {
            editorEl.focus()
            document.execCommand('insertHTML', false, `<img src="${url}" style="max-width:100%;border-radius:4px;margin:8px 0;" />`)
            handleEditorInput(currentPage.id)
            message.success('照片已插入到文档')
          }
          stopCamera()
          setSavedRange(null)
        }
      }, 'image/jpeg', 0.9)
    }
  }

  const aiExamplePrompts = [
    '在文档末尾加一个 3x3 的表格',
    '把第二段改写得更简洁',
    '把所有出现的产品名加粗',
  ]

  // 编辑标题
  const startEditTitle = (pageId: string) => {
    const page = pages.find(p => p.id === pageId)
    if (page) {
      setEditingPageId(pageId)
      setEditingTitle(page.title)
    }
  }

  const saveEditTitle = () => {
    if (editingPageId && editingTitle.trim()) {
      setPages(prev => prev.map(p => p.id === editingPageId ? { ...p, title: editingTitle.trim() } : p))
    }
    setEditingPageId(null)
  }

  // 排序
  const movePage = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= pages.length) return
    const newPages = [...pages]
    const [moved] = newPages.splice(index, 1)
    newPages.splice(newIndex, 0, moved)
    setPages(newPages)
    if (currentPageIndex === index) {
      setCurrentPageIndex(newIndex)
    } else if (currentPageIndex === newIndex) {
      setCurrentPageIndex(index)
    }
  }

  const deletePage = (index: number) => {
    if (pages.length <= 1) {
      message.warning('至少保留一个页面')
      return
    }
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除「${pages[index].title}」吗？删除后该页面内容将无法恢复。`,
      okText: '确认删除',
      okButtonProps: { danger: true },
      cancelText: '取消',
      onOk: () => {
        const newPages = pages.filter((_, i) => i !== index)
        setPages(newPages)
        if (currentPageIndex === index) {
          setCurrentPageIndex(Math.min(index, newPages.length - 1))
        } else if (currentPageIndex > index) {
          setCurrentPageIndex(currentPageIndex - 1)
        }
        message.success('页面已删除')
      },
    })
  }

  // 富文本操作
  const execCommand = (command: string, value?: string) => {
    const el = editorRefs.current.get(currentPage.id)
    if (el) {
      el.focus()
      restoreSelection()
      document.execCommand(command, false, value)
      updatePageContent(currentPage.id, el.innerHTML)
      // 执行后重新保存选区（光标可能已变化）
      saveSelection()
    }
  }

  const handleFontSize = (size: string) => {
    setCurrentFontSize(size)
    execCommand('fontSize', size)
  }

  // 设置行高
  const handleLineHeight = (value: string) => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    restoreSelection()
    // 用 execCommand 插入一个 span 包裹选中文字并设置行高
    const range = sel.getRangeAt(0)
    if (range.collapsed) {
      // 没有选中文字时，设置整个段落行高
      let node = range.startContainer as HTMLElement
      if (node.nodeType === Node.TEXT_NODE) node = node.parentElement as HTMLElement
      const blockEl = node?.closest('p, h1, h2, h3, h4, h5, h6, div, li, td') as HTMLElement
      if (blockEl) {
        blockEl.style.lineHeight = value
      }
    } else {
      // 选中文字时，用 span 包裹
      const span = document.createElement('span')
      span.style.lineHeight = value
      range.surroundContents(span)
    }
    saveSelection()
  }

  // 设置段落间距
  const handleParagraphSpacing = (before: number, after: number) => {
    const sel = window.getSelection()
    if (!sel || sel.rangeCount === 0) return
    restoreSelection()
    const range = sel.getRangeAt(0)
    let node = range.startContainer as HTMLElement
    if (node.nodeType === Node.TEXT_NODE) node = node.parentElement as HTMLElement
    const blockEl = node?.closest('p, h1, h2, h3, h4, h5, h6, div, li, td') as HTMLElement
    if (blockEl) {
      if (before >= 0) blockEl.style.marginTop = before + 'px'
      if (after >= 0) blockEl.style.marginBottom = after + 'px'
    }
    saveSelection()
  }

  // 数学公式插入
  const handleFormulaTypeSelect = (type: 'inline' | 'block') => {
    setFormulaType(type)
    setFormulaInput('')
    setFormulaModalVisible(true)
  }

  const insertFormula = () => {
    if (!formulaInput.trim()) {
      message.warning('请输入公式内容')
      return
    }
    const el = editorRefs.current.get(currentPage.id)
    if (!el) return
    el.focus()
    restoreSelection()

    if (formulaType === 'inline') {
      const html = `<span class="math-inline" style="font-style:italic;font-family:'Times New Roman',serif;background:#f0f2f5;padding:2px 8px;border-radius:4px;color:#2b3034;display:inline-block;">${formulaInput}</span>`
      document.execCommand('insertHTML', false, html)
    } else {
      const html = `<div class="math-block" style="text-align:center;padding:16px 24px;background:rgba(255,255,255,0.2);border-radius:8px;margin:12px 0;font-style:italic;font-family:'Times New Roman',serif;font-size:16px;color:#2b3034;border-left:4px solid #177DDC;">${formulaInput}</div>`
      document.execCommand('insertHTML', false, html)
    }
    updatePageContent(currentPage.id, el.innerHTML)
    saveSelection()
    setFormulaModalVisible(false)
    setFormulaInput('')
  }

  // 图表生成SVG（接受参数，不依赖状态）
  const generateChartSvg = (type: 'pie' | 'bar' | 'line' | 'area', data: { name: string; value: number }[]): string => {
    const w = 400
    const h = 300
    const margin = { top: 20, right: 20, bottom: 40, left: 50 }
    const colors = ['#177DDC', '#52C41A', '#FAAD14', '#FF4D4F', '#722ED1', '#13C2C2', '#EB2F96', '#FA8C16']
    const chartW = w - margin.left - margin.right
    const chartH = h - margin.top - margin.bottom

    let body = ''

    if (type === 'pie') {
      const cx = w / 2
      const cy = h / 2
      const r = Math.min(w, h) / 2 - 40
      const total = data.reduce((s, d) => s + d.value, 0) || 1
      let angle = -Math.PI / 2
      data.forEach((d, i) => {
        const slice = (d.value / total) * 2 * Math.PI
        const x1 = cx + r * Math.cos(angle)
        const y1 = cy + r * Math.sin(angle)
        const x2 = cx + r * Math.cos(angle + slice)
        const y2 = cy + r * Math.sin(angle + slice)
        const large = slice > Math.PI ? 1 : 0
        body += `<path d="M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z" fill="${colors[i % colors.length]}" stroke="#fff" stroke-width="2"/>`
        const midAngle = angle + slice / 2
        const lx = cx + (r + 30) * Math.cos(midAngle)
        const ly = cy + (r + 30) * Math.sin(midAngle)
        body += `<text x="${lx}" y="${ly}" text-anchor="${midAngle > Math.PI / 2 || midAngle < -Math.PI / 2 ? 'end' : 'start'}" font-size="12" fill="#2b3034" dominant-baseline="middle">${d.name}(${d.value})</text>`
        angle += slice
      })
    } else if (type === 'bar') {
      const maxVal = Math.max(...data.map(d => d.value), 1)
      const barW = chartW / data.length * 0.6
      const gap = chartW / data.length * 0.4
      body += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartH}" stroke="#2b3034" stroke-width="1"/>`
      body += `<line x1="${margin.left}" y1="${margin.top + chartH}" x2="${margin.left + chartW}" y2="${margin.top + chartH}" stroke="#2b3034" stroke-width="1"/>`
      data.forEach((d, i) => {
        const barH = (d.value / maxVal) * chartH
        const x = margin.left + gap / 2 + i * (barW + gap)
        const y = margin.top + chartH - barH
        body += `<rect x="${x}" y="${y}" width="${barW}" height="${barH}" fill="${colors[i % colors.length]}" rx="2"/>`
        body += `<text x="${x + barW / 2}" y="${y - 6}" text-anchor="middle" font-size="11" fill="#2b3034">${d.value}</text>`
        body += `<text x="${x + barW / 2}" y="${margin.top + chartH + 20}" text-anchor="middle" font-size="11" fill="#2b3034">${d.name}</text>`
      })
    } else if (type === 'line') {
      const maxVal = Math.max(...data.map(d => d.value), 1)
      const points = data.map((d, i) => {
        const x = margin.left + (i / (data.length - 1 || 1)) * chartW
        const y = margin.top + chartH - (d.value / maxVal) * chartH
        return { x, y }
      })
      body += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartH}" stroke="#2b3034" stroke-width="1"/>`
      body += `<line x1="${margin.left}" y1="${margin.top + chartH}" x2="${margin.left + chartW}" y2="${margin.top + chartH}" stroke="#2b3034" stroke-width="1"/>`
      for (let i = 1; i <= 4; i++) {
        const gy = margin.top + (chartH * i) / 4
        body += `<line x1="${margin.left}" y1="${gy}" x2="${margin.left + chartW}" y2="${gy}" stroke="#e8e8e8" stroke-width="1" stroke-dasharray="4,4"/>`
      }
      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
      body += `<path d="${pathD}" fill="none" stroke="#177DDC" stroke-width="2"/>`
      points.forEach((p, i) => {
        body += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#177DDC" stroke="#fff" stroke-width="2"/>`
        body += `<text x="${p.x}" y="${p.y - 10}" text-anchor="middle" font-size="11" fill="#2b3034">${data[i].value}</text>`
        body += `<text x="${p.x}" y="${margin.top + chartH + 20}" text-anchor="middle" font-size="11" fill="#2b3034">${data[i].name}</text>`
      })
    } else if (type === 'area') {
      const maxVal = Math.max(...data.map(d => d.value), 1)
      const points = data.map((d, i) => {
        const x = margin.left + (i / (data.length - 1 || 1)) * chartW
        const y = margin.top + chartH - (d.value / maxVal) * chartH
        return { x, y }
      })
      body += `<line x1="${margin.left}" y1="${margin.top}" x2="${margin.left}" y2="${margin.top + chartH}" stroke="#2b3034" stroke-width="1"/>`
      body += `<line x1="${margin.left}" y1="${margin.top + chartH}" x2="${margin.left + chartW}" y2="${margin.top + chartH}" stroke="#2b3034" stroke-width="1"/>`
      const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ')
      body += `<path d="${pathD} L${points[points.length - 1].x},${margin.top + chartH} L${margin.left},${margin.top + chartH} Z" fill="rgba(23,125,220,0.2)" stroke="#177DDC" stroke-width="2"/>`
      points.forEach((p, i) => {
        body += `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#177DDC" stroke="#fff" stroke-width="2"/>`
        body += `<text x="${p.x}" y="${p.y - 10}" text-anchor="middle" font-size="11" fill="#2b3034">${data[i].value}</text>`
        body += `<text x="${p.x}" y="${margin.top + chartH + 20}" text-anchor="middle" font-size="11" fill="#2b3034">${data[i].name}</text>`
      })
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`
  }

  // 直接插入图表到编辑器（无弹窗，上下布局，包含全部配置信息）
  const insertChartDirectly = (type: 'pie' | 'bar' | 'line' | 'area', data: { name: string; value: number }[], title: string) => {
    const el = editorRefs.current.get(currentPage.id)
    if (!el) return
    el.focus()
    restoreSelection()
    const chartId = `chart_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const svgStr = generateChartSvg(type, data)
    const dataRows = data.map((d, i) => `
      <div class="chart-data-row" style="display:flex;gap:6px;margin-bottom:4px;align-items:center;">
        <input class="chart-data-name" value="${d.name}" placeholder="样本名称" style="flex:1;padding:3px 6px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;outline:none;" />
        <input class="chart-data-value" type="number" value="${d.value}" placeholder="数量" style="width:70px;padding:3px 6px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;outline:none;" />
        <button class="chart-data-del" style="border:none;background:transparent;cursor:pointer;color:#ff4d4f;font-size:16px;padding:0;line-height:1;display:${data.length > 1 ? 'inline' : 'none'};">×</button>
      </div>`).join('')
    const containerHtml = `<div contenteditable="false" class="editor-chart" data-chart-id="${chartId}" data-chart-type="${type}" style="position:relative;margin:16px 0;padding:16px;background:rgba(255,255,255,0.2);border:1px solid #e8e8e8;border-radius:8px;">
      <button class="chart-delete-btn" style="position:absolute;top:8px;right:8px;border:none;background:transparent;cursor:pointer;color:#ff4d4f;font-size:18px;padding:0 4px;line-height:1;" title="删除">✕</button>
      <div style="margin-bottom:12px;display:flex;align-items:center;gap:8px;">
        <span style="font-size:12px;color:#2b3034;white-space:nowrap;">图表名称：</span>
        <input class="chart-name-input" value="${title}" placeholder="请输入图表名称" style="flex:1;padding:3px 8px;border:1px solid #d9d9d9;border-radius:4px;font-size:13px;outline:none;font-weight:600;color:#2b3034;" />
      </div>
      <div style="margin-bottom:12px;display:flex;align-items:center;gap:8px;">
        <span style="font-size:12px;color:#2b3034;white-space:nowrap;">图表类型：</span>
        <div style="display:flex;gap:4px;">
          <button class="chart-type-btn chart-type-pie${type === 'pie' ? ' active' : ''}" data-type="pie" style="padding:3px 10px;border:1px solid ${type === 'pie' ? '#177DDC' : '#d9d9d9'};border-radius:4px;background:${type === 'pie' ? '#e6f4ff' : '#fff'};color:${type === 'pie' ? '#177DDC' : '#595959'};cursor:pointer;font-size:12px;display:flex;align-items:center;gap:3px;">饼图</button>
          <button class="chart-type-btn chart-type-bar${type === 'bar' ? ' active' : ''}" data-type="bar" style="padding:3px 10px;border:1px solid ${type === 'bar' ? '#177DDC' : '#d9d9d9'};border-radius:4px;background:${type === 'bar' ? '#e6f4ff' : '#fff'};color:${type === 'bar' ? '#177DDC' : '#595959'};cursor:pointer;font-size:12px;display:flex;align-items:center;gap:3px;">柱状图</button>
          <button class="chart-type-btn chart-type-line${type === 'line' ? ' active' : ''}" data-type="line" style="padding:3px 10px;border:1px solid ${type === 'line' ? '#177DDC' : '#d9d9d9'};border-radius:4px;background:${type === 'line' ? '#e6f4ff' : '#fff'};color:${type === 'line' ? '#177DDC' : '#595959'};cursor:pointer;font-size:12px;display:flex;align-items:center;gap:3px;">折线图</button>
          <button class="chart-type-btn chart-type-area${type === 'area' ? ' active' : ''}" data-type="area" style="padding:3px 10px;border:1px solid ${type === 'area' ? '#177DDC' : '#d9d9d9'};border-radius:4px;background:${type === 'area' ? '#e6f4ff' : '#fff'};color:${type === 'area' ? '#177DDC' : '#595959'};cursor:pointer;font-size:12px;display:flex;align-items:center;gap:3px;">面积图</button>
        </div>
      </div>
      <div style="margin-bottom:12px;">
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;">
          <span style="font-size:12px;color:#2b3034;">图表数据：</span>
          <button class="chart-data-add" style="border:none;background:transparent;cursor:pointer;color:#177DDC;font-size:12px;padding:0;">+ 添加</button>
        </div>
        <div class="chart-data-container" style="max-height:150px;overflow:auto;padding:4px;">
          ${dataRows}
        </div>
      </div>
      <div style="text-align:center;padding:12px;border:1px solid #d9d9d9;border-radius:6px;min-height:60px;">
        <div class="chart-svg-container" style="display:inline-block;overflow:hidden;">${svgStr}</div>
      </div>
    </div><br/>`
    document.execCommand('insertHTML', false, containerHtml)
    updatePageContent(currentPage.id, el.innerHTML)
    // 绑定图表块交互事件
    requestAnimationFrame(() => {
      const block = el.querySelector(`[data-chart-id="${chartId}"]`) as HTMLElement
      if (block) bindChartBlockEvents(block, el)
    })
    saveSelection()
  }

  // 绑定图表块交互事件
  const bindChartBlockEvents = (block: HTMLElement, editorEl: HTMLElement) => {
    // 删除按钮
    const delBtn = block.querySelector('.chart-delete-btn') as HTMLButtonElement
    if (delBtn) {
      delBtn.onclick = (e) => {
        e.preventDefault()
        block.remove()
        updatePageContent(currentPage.id, editorEl.innerHTML)
      }
    }

    // 图表类型切换
    const typeBtns = block.querySelectorAll('.chart-type-btn')
    typeBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        const type = (btn as HTMLElement).dataset.type as 'pie' | 'bar' | 'line' | 'area'
        block.dataset.chartType = type
        // 更新按钮样式
        typeBtns.forEach(b => {
          const bt = (b as HTMLElement).dataset.type
          const isActive = bt === type
          const btnEl = b as HTMLElement
          btnEl.style.borderColor = isActive ? '#177DDC' : '#d9d9d9'
          btnEl.style.background = isActive ? '#e6f4ff' : '#fff'
          btnEl.style.color = isActive ? '#177DDC' : '#595959'
        })
        updateChartSvgInBlock(block)
      })
    })

    // 图表名称输入
    const nameInput = block.querySelector('.chart-name-input') as HTMLInputElement
    if (nameInput) {
      nameInput.addEventListener('input', () => updatePageContent(currentPage.id, editorEl.innerHTML))
    }

    // 添加数据行
    const addBtn = block.querySelector('.chart-data-add') as HTMLButtonElement
    if (addBtn) {
      addBtn.onclick = (e) => {
        e.preventDefault()
        const container = block.querySelector('.chart-data-container') as HTMLElement
        const rowCount = container.querySelectorAll('.chart-data-row').length
        const row = document.createElement('div')
        row.className = 'chart-data-row'
        row.style.cssText = 'display:flex;gap:6px;margin-bottom:4px;align-items:center;'
        row.innerHTML = `
          <input class="chart-data-name" value="" placeholder="样本名称" style="flex:1;padding:3px 6px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;outline:none;" />
          <input class="chart-data-value" type="number" value="0" placeholder="数量" style="width:70px;padding:3px 6px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;outline:none;" />
          <button class="chart-data-del" style="border:none;background:transparent;cursor:pointer;color:#ff4d4f;font-size:16px;padding:0;line-height:1;">×</button>`
        container.appendChild(row)
        bindChartDataRowEvents(row, block, editorEl)
        // 更新删除按钮可见性
        updateChartDelBtns(block)
        updateChartSvgInBlock(block)
        updatePageContent(currentPage.id, editorEl.innerHTML)
      }
    }

    // 绑定已有数据行
    block.querySelectorAll('.chart-data-row').forEach(row => {
      bindChartDataRowEvents(row as HTMLElement, block, editorEl)
    })
  }

  const bindChartDataRowEvents = (row: HTMLElement, block: HTMLElement, editorEl: HTMLElement) => {
    const nameInput = row.querySelector('.chart-data-name') as HTMLInputElement
    const valueInput = row.querySelector('.chart-data-value') as HTMLInputElement
    const delBtn = row.querySelector('.chart-data-del') as HTMLButtonElement

    const updateChart = () => {
      updateChartSvgInBlock(block)
      updatePageContent(currentPage.id, editorEl.innerHTML)
    }

    if (nameInput) nameInput.addEventListener('input', updateChart)
    if (valueInput) valueInput.addEventListener('input', updateChart)

    if (delBtn) {
      delBtn.onclick = (e) => {
        e.preventDefault()
        row.remove()
        updateChartDelBtns(block)
        updateChartSvgInBlock(block)
        updatePageContent(currentPage.id, editorEl.innerHTML)
      }
    }
  }

  const updateChartDelBtns = (block: HTMLElement) => {
    const rows = block.querySelectorAll('.chart-data-row')
    rows.forEach(row => {
      const delBtn = row.querySelector('.chart-data-del') as HTMLElement
      if (delBtn) delBtn.style.display = rows.length > 1 ? 'inline' : 'none'
    })
  }

  const updateChartSvgInBlock = (block: HTMLElement) => {
    const type = (block.dataset.chartType || 'pie') as 'pie' | 'bar' | 'line' | 'area'
    const data: { name: string; value: number }[] = []
    block.querySelectorAll('.chart-data-row').forEach(row => {
      const nameEl = row.querySelector('.chart-data-name') as HTMLInputElement
      const valueEl = row.querySelector('.chart-data-value') as HTMLInputElement
      data.push({ name: nameEl?.value || '', value: Number(valueEl?.value) || 0 })
    })
    const svg = generateChartSvg(type, data)
    const container = block.querySelector('.chart-svg-container')
    if (container) container.innerHTML = svg
  }

  // 公式计算：插入行内交互组件到编辑器
  const insertCalcBlock = () => {
    const el = editorRefs.current.get(currentPage.id)
    if (!el) return
    el.focus()
    restoreSelection()
    const calcId = `calc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const html = `<div contenteditable="false" class="editor-calc-block" data-calc-id="${calcId}" style="margin:12px 0;padding:14px 16px;background:rgba(255,255,255,0.2);border-left:4px solid #177DDC;border-radius:0 8px 8px 0;font-family:'Times New Roman',serif;position:relative;">
      <button class="calc-delete-btn" style="position:absolute;top:8px;right:8px;border:none;background:transparent;cursor:pointer;color:#ff4d4f;font-size:18px;padding:0 4px;line-height:1;" title="删除">✕</button>
      <div style="margin-bottom:8px;display:flex;align-items:center;gap:6px;">
        <span style="font-size:12px;color:#2b3034;white-space:nowrap;">公式库：</span>
        <button class="calc-library-btn" style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border:1px solid #d9d9d9;border-radius:4px;font-size:13px;background:#fff;cursor:pointer;outline:none;color:#595959;">📚 公式库</button>
      </div>
      <div style="margin-bottom:8px;display:flex;align-items:center;gap:6px;">
        <span style="font-size:12px;color:#2b3034;white-space:nowrap;">公式：</span>
        <input class="calc-formula-input" style="flex:1;padding:3px 8px;border:1px solid #d9d9d9;border-radius:4px;font-size:14px;font-style:italic;font-family:'Times New Roman',serif;outline:none;" placeholder="输入公式，如 (140-age)*weight/(72*cr)" />
      </div>
      <div style="margin-bottom:4px;display:flex;align-items:center;gap:6px;">
        <span style="font-size:12px;color:#2b3034;white-space:nowrap;">变量：</span>
      </div>
      <div class="calc-vars-container" style="margin-bottom:8px;padding-left:4px;"></div>
      <div class="calc-result-container" style="padding:8px 12px;border:1px solid #d9d9d9;border-radius:6px;min-height:32px;display:flex;align-items:center;gap:8px;">
        <span style="font-size:12px;color:#2b3034;">结果：</span>
        <span class="calc-result-value" style="font-size:18px;font-weight:600;color:#177DDC;">—</span>
      </div>
    </div><br/>`
    document.execCommand('insertHTML', false, html)
    updatePageContent(currentPage.id, el.innerHTML)
    // 插入后绑定事件
    requestAnimationFrame(() => {
      const block = el.querySelector(`[data-calc-id="${calcId}"]`) as HTMLElement
      if (block) bindCalcBlockEvents(block, el)
    })
  }

  // 公式计算：为行内组件绑定事件
  const bindCalcBlockEvents = (block: HTMLElement, editorEl: HTMLElement) => {
    const libraryBtn = block.querySelector('.calc-library-btn') as HTMLButtonElement
    const input = block.querySelector('.calc-formula-input') as HTMLInputElement
    const varsContainer = block.querySelector('.calc-vars-container') as HTMLElement
    const resultValue = block.querySelector('.calc-result-value') as HTMLElement
    const deleteBtn = block.querySelector('.calc-delete-btn') as HTMLButtonElement

    // 生成变量输入行
    const renderVars = (formula: string, varHints?: Record<string, string>) => {
      const vars = extractFormulaVars(formula)
      if (vars.length === 0) {
        varsContainer.innerHTML = ''
        recalc()
        return
      }
      varsContainer.innerHTML = vars.map(v => {
        const hint = varHints?.[v] || v
        return `<div style="display:flex;align-items:center;gap:6px;margin-bottom:4px;">
          <span style="width:80px;font-size:13px;color:#2b3034;text-align:right;font-style:italic;">${v}</span>
          <span style="color:#8c8c8c;">=</span>
          <input class="calc-var-input" data-var="${v}" style="width:100px;padding:2px 6px;border:1px solid #d9d9d9;border-radius:4px;font-size:13px;outline:none;background:#fff;" placeholder="${hint}" />
        </div>`
      }).join('')
      varsContainer.querySelectorAll('.calc-var-input').forEach(vi => {
        vi.addEventListener('input', () => recalc())
      })
      recalc()
    }

    const recalc = () => {
      const formula = input.value.trim()
      if (!formula) { resultValue.textContent = '—'; resultValue.style.color = '#177DDC'; return }
      const varInputs = varsContainer.querySelectorAll('.calc-var-input') as NodeListOf<HTMLInputElement>
      let expr = formula
      let allFilled = true
      varInputs.forEach(vi => {
        const name = vi.dataset.var || ''
        const val = vi.value.trim()
        if (val === '' || isNaN(Number(val))) { allFilled = false; return }
        const regex = new RegExp(`\\b${name}\\b`, 'g')
        expr = expr.replace(regex, val)
      })
      if (!allFilled) { resultValue.textContent = '—'; resultValue.style.color = '#177DDC'; return }
      const result = safeEvalFormula(expr)
      if (result !== null) {
        resultValue.textContent = `= ${Number(result.toFixed(4))}`
        resultValue.style.color = '#177DDC'
      } else {
        resultValue.textContent = '计算错误'
        resultValue.style.color = '#ff4d4f'
      }
    }

    // 公式库按钮 → 打开弹窗
    libraryBtn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      setFormulaLibActiveBlock(block)
      setFormulaLibSearch('')
      setFormulaLibModalVisible(true)
    })

    // 手动输入公式
    input.addEventListener('input', () => {
      renderVars(input.value)
    })

    // 删除
    deleteBtn.addEventListener('click', () => {
      block.remove()
      updatePageContent(currentPage.id, editorEl.innerHTML)
    })
    
    // 暴露 renderVars 方法供弹窗调用
    ;(block as any).__renderVars = renderVars
    ;(block as any).__recalc = recalc
  }

  // 公式库弹窗：选择公式后填充到当前块
  const fillBlockFormula = (formula: string, vars: Record<string, string>) => {
    if (!formulaLibActiveBlock) return
    const input = formulaLibActiveBlock.querySelector('.calc-formula-input') as HTMLInputElement
    if (input) {
      input.value = formula
      const renderVars = (formulaLibActiveBlock as any).__renderVars
      if (renderVars) renderVars(formula, vars)
    }
    setFormulaLibModalVisible(false)
    setFormulaLibActiveBlock(null)
  }

  // 公式库弹窗：插入空白公式块
  const insertBlankCalcBlock = () => {
    setFormulaLibModalVisible(false)
    setFormulaLibActiveBlock(null)
    insertCalcBlock()
  }

  // AI生成公式：打开弹窗
  const openAiFormulaModal = () => {
    setFormulaLibModalVisible(false)
    setAiFormulaInput('')
    setAiFormulaResult(null)
    setAiFormulaModalVisible(true)
  }

  // AI生成公式：模拟生成
  const generateAiFormula = () => {
    if (!aiFormulaInput.trim()) return
    setAiFormulaGenerating(true)
    setAiFormulaResult(null)
    // 模拟AI生成延迟
    setTimeout(() => {
      const keyword = aiFormulaInput.trim().toLowerCase()
      // 智能匹配公式库：优先关键词匹配，其次字符重叠率
      let match: { name: string; formula: string; vars: Record<string, string> } | null = null
      let bestScore = 0
      for (const f of ALL_FORMULAS) {
        const nameLower = f.name.toLowerCase().replace(/[()]/g, '')
        // 关键词匹配：检查输入词是否为公式名的子串，或公式名中包含输入的关键部分
        let score = 0
        if (nameLower.includes(keyword)) {
          score = 0.9 // 完全匹配子串，高分
        } else if (keyword.includes(nameLower)) {
          score = 0.7
        } else {
          // 分词匹配：检查输入中的每个词（2字及以上）是否出现在公式名中
          const chunks: string[] = []
          for (let i = 0; i < keyword.length; i++) {
            for (let j = i + 2; j <= keyword.length; j++) {
              chunks.push(keyword.slice(i, j))
            }
          }
          const matchedChunks = chunks.filter(c => nameLower.includes(c))
          if (chunks.length > 0) {
            score = matchedChunks.length / chunks.length
          }
        }
        if (score > bestScore && score > 0.15) {
          bestScore = score
          match = f
        }
      }
      if (!match) {
        // 无匹配时始终生成一个占位结果，让用户知道可以继续操作
        match = {
          name: aiFormulaInput.trim(),
          formula: aiFormulaInput.trim(),
          vars: { input: '请输入' },
        }
      }
      setAiFormulaResult(match)
      setAiFormulaGenerating(false)
    }, 800)
  }

  // AI生成公式：确认使用
  const confirmAiFormula = () => {
    if (!aiFormulaResult) return
    setAiFormulaModalVisible(false)
    // 如果有活跃的公式块，填充到当前块
    if (formulaLibActiveBlock) {
      fillBlockFormula(aiFormulaResult.formula, aiFormulaResult.vars)
    } else {
      // 否则直接插入新块
      insertCalcBlockWithFormula(aiFormulaResult.formula, aiFormulaResult.vars)
    }
    setAiFormulaResult(null)
    setAiFormulaInput('')
  }

  // 插入带公式的计算块
  const insertCalcBlockWithFormula = (formula: string, vars: Record<string, string>) => {
    const el = editorRefs.current.get(currentPage.id)
    if (!el) return
    el.focus()
    restoreSelection()
    const calcId = `calc_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
    const html = `<div contenteditable="false" class="editor-calc-block" data-calc-id="${calcId}" style="margin:12px 0;padding:14px 16px;background:rgba(255,255,255,0.2);border-left:4px solid #177DDC;border-radius:0 8px 8px 0;font-family:'Times New Roman',serif;position:relative;">
      <button class="calc-delete-btn" style="position:absolute;top:8px;right:8px;border:none;background:transparent;cursor:pointer;color:#ff4d4f;font-size:18px;padding:0 4px;line-height:1;" title="删除">✕</button>
      <div style="margin-bottom:8px;display:flex;align-items:center;gap:6px;">
        <span style="font-size:12px;color:#2b3034;white-space:nowrap;">公式库：</span>
        <button class="calc-library-btn" style="display:inline-flex;align-items:center;gap:4px;padding:3px 8px;border:1px solid #d9d9d9;border-radius:4px;font-size:13px;background:#fff;cursor:pointer;outline:none;color:#595959;">📚 公式库</button>
      </div>
      <div style="margin-bottom:8px;display:flex;align-items:center;gap:6px;">
        <span style="font-size:12px;color:#2b3034;white-space:nowrap;">公式：</span>
        <input class="calc-formula-input" value="${formula}" style="flex:1;padding:3px 8px;border:1px solid #d9d9d9;border-radius:4px;font-size:14px;font-style:italic;font-family:'Times New Roman',serif;outline:none;" placeholder="输入公式" />
      </div>
      <div style="margin-bottom:4px;display:flex;align-items:center;gap:6px;">
        <span style="font-size:12px;color:#2b3034;white-space:nowrap;">变量：</span>
      </div>
      <div class="calc-vars-container" style="margin-bottom:8px;padding-left:4px;"></div>
      <div class="calc-result-container" style="padding:8px 12px;border:1px solid #d9d9d9;border-radius:6px;min-height:32px;display:flex;align-items:center;gap:8px;">
        <span style="font-size:12px;color:#2b3034;">结果：</span>
        <span class="calc-result-value" style="font-size:18px;font-weight:600;color:#177DDC;">—</span>
      </div>
    </div><br/>`
    document.execCommand('insertHTML', false, html)
    updatePageContent(currentPage.id, el.innerHTML)
    requestAnimationFrame(() => {
      const block = el.querySelector(`[data-calc-id="${calcId}"]`) as HTMLElement
      if (block) {
        bindCalcBlockEvents(block, el)
        const renderVars = (block as any).__renderVars
        if (renderVars) renderVars(formula, vars)
      }
    })
  }

  const handleEditorInput = (pageId: string) => {
    const el = editorRefs.current.get(pageId)
    if (el) {
      updatePageContent(pageId, el.innerHTML)
    }
  }

  // 签名功能：检测点击签名区域（仅点击 <u> 标签触发）
  const handleEditorClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement

    // 检测是否点击了表格单元格
    const tdEl = target.closest('td,th') as HTMLTableCellElement
    const tableEl = target.closest('table') as HTMLTableElement
    if (tdEl && tableEl) {
      setActiveTableEl(tableEl)
      setActiveCellEl(tdEl)
      const rect = tdEl.getBoundingClientRect()
      const editorContainer = (e.currentTarget as HTMLElement).parentElement
      if (editorContainer) {
        const containerRect = editorContainer.getBoundingClientRect()
        setTableToolbarPos({
          top: rect.top - containerRect.top - 36,
          left: rect.left - containerRect.left,
        })
      }
      // 隐藏表格编辑工具栏
      // setTableToolbarVisible(true)
    } else {
      setTableToolbarVisible(false)
      setActiveTableEl(null)
      setActiveCellEl(null)
    }

    // 仅当点击的是 <u> 标签时才触发签名弹窗
    const uEl = target.closest('u') as HTMLElement
    if (!uEl) return
    signatureTargetRef.current = uEl
    setSignatureModalVisible(true)
    setTimeout(() => {
      const canvas = signatureCanvasRef.current
      if (canvas) {
        const ctx = canvas.getContext('2d')
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height)
        }
      }
    }, 100)
  }

  // 表格操作：在当前行上方插入行
  const insertRowAbove = () => {
    if (!activeTableEl || !activeCellEl) return
    const currentRow = activeCellEl.parentElement as HTMLTableRowElement
    const parentSection = currentRow.parentElement as HTMLElement
    const colCount = currentRow.cells.length
    const newRow = document.createElement('tr')
    for (let c = 0; c < colCount; c++) {
      const cell = document.createElement('td')
      cell.style.cssText = 'padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word'
      cell.innerHTML = '&nbsp;'
      newRow.appendChild(cell)
    }
    parentSection.insertBefore(newRow, currentRow)
    updatePageContent(currentPage.id, (editorRefs.current.get(currentPage.id))?.innerHTML || '')
  }

  // 表格操作：在当前行下方插入行
  const insertRowBelow = () => {
    if (!activeTableEl || !activeCellEl) return
    const currentRow = activeCellEl.parentElement as HTMLTableRowElement
    const parentSection = currentRow.parentElement as HTMLElement
    const colCount = currentRow.cells.length
    const newRow = document.createElement('tr')
    for (let c = 0; c < colCount; c++) {
      const cell = document.createElement('td')
      cell.style.cssText = 'padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word'
      cell.innerHTML = '&nbsp;'
      newRow.appendChild(cell)
    }
    if (currentRow.nextSibling) {
      parentSection.insertBefore(newRow, currentRow.nextSibling)
    } else {
      parentSection.appendChild(newRow)
    }
    updatePageContent(currentPage.id, (editorRefs.current.get(currentPage.id))?.innerHTML || '')
  }

  // 表格操作：在当前列左侧插入列
  const insertColLeft = () => {
    if (!activeTableEl || !activeCellEl) return
    const cellIndex = activeCellEl.cellIndex
    const rows = activeTableEl.rows
    for (let r = 0; r < rows.length; r++) {
      const refCell = rows[r].cells[cellIndex]
      const newCell = document.createElement(refCell?.tagName || 'td')
      newCell.style.cssText = 'padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word'
      newCell.innerHTML = '&nbsp;'
      if (refCell) {
        rows[r].insertBefore(newCell, refCell)
      } else {
        rows[r].appendChild(newCell)
      }
    }
    updatePageContent(currentPage.id, (editorRefs.current.get(currentPage.id))?.innerHTML || '')
  }

  // 表格操作：在当前列右侧插入列
  const insertColRight = () => {
    if (!activeTableEl || !activeCellEl) return
    const cellIndex = activeCellEl.cellIndex
    const rows = activeTableEl.rows
    for (let r = 0; r < rows.length; r++) {
      const refCell = rows[r].cells[cellIndex]
      const newCell = document.createElement(refCell?.tagName || 'td')
      newCell.style.cssText = 'padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word'
      newCell.innerHTML = '&nbsp;'
      if (refCell?.nextSibling) {
        rows[r].insertBefore(newCell, refCell.nextSibling)
      } else {
        rows[r].appendChild(newCell)
      }
    }
    updatePageContent(currentPage.id, (editorRefs.current.get(currentPage.id))?.innerHTML || '')
  }

  // 表格操作：删除当前行
  const deleteRow = () => {
    if (!activeTableEl || !activeCellEl) return
    const currentRow = activeCellEl.parentElement as HTMLTableRowElement
    if (activeTableEl.rows.length <= 1) {
      deleteTable()
      return
    }
    currentRow.remove()
    setTableToolbarVisible(false)
    setActiveTableEl(null)
    setActiveCellEl(null)
    updatePageContent(currentPage.id, (editorRefs.current.get(currentPage.id))?.innerHTML || '')
  }

  // 表格操作：删除当前列
  const deleteCol = () => {
    if (!activeTableEl || !activeCellEl) return
    const cellIndex = activeCellEl.cellIndex
    const rows = activeTableEl.rows
    if (rows[0]?.cells.length <= 1) {
      deleteTable()
      return
    }
    for (let r = rows.length - 1; r >= 0; r--) {
      const cell = rows[r].cells[cellIndex]
      if (cell) cell.remove()
    }
    setTableToolbarVisible(false)
    setActiveTableEl(null)
    setActiveCellEl(null)
    updatePageContent(currentPage.id, (editorRefs.current.get(currentPage.id))?.innerHTML || '')
  }

  // 表格操作：删除整个表格
  const deleteTable = () => {
    if (!activeTableEl) return
    activeTableEl.remove()
    updatePageContent(currentPage.id, (editorRefs.current.get(currentPage.id))?.innerHTML || '')
    setTableToolbarVisible(false)
    setActiveTableEl(null)
    setActiveCellEl(null)
  }

  // 表格操作：在表格旁插入新表格
  const insertTableBeside = (position: 'before' | 'after') => {
    if (!activeTableEl) return
    const el = editorRefs.current.get(currentPage.id)
    if (!el) return
    const rows = 3, cols = 3
    let html = '<table style="border-collapse:collapse;width:100%;table-layout:fixed">'
    for (let r = 0; r < rows; r++) {
      html += '<tr>'
      for (let c = 0; c < cols; c++) {
        html += '<td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td>'
      }
      html += '</tr>'
    }
    html += '</table>'
    const wrapper = document.createElement('div')
    wrapper.innerHTML = html
    const newTable = wrapper.firstElementChild as HTMLElement
    if (position === 'before') {
      activeTableEl.parentElement?.insertBefore(newTable, activeTableEl)
    } else {
      activeTableEl.parentElement?.insertBefore(newTable, activeTableEl.nextSibling)
    }
    updatePageContent(currentPage.id, el.innerHTML)
    setTableToolbarVisible(false)
    setActiveTableEl(null)
    setActiveCellEl(null)
  }

  // 签名画布：开始绘制
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    setIsDrawing(true)
    const rect = canvas.getBoundingClientRect()
    ctx.beginPath()
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top)
  }

  // 签名画布：绘制中
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = signatureCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const rect = canvas.getBoundingClientRect()
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.strokeStyle = '#000'
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top)
    ctx.stroke()
  }

  // 签名画布：停止绘制
  const stopDrawing = () => {
    setIsDrawing(false)
  }

  // 清空签名
  const clearSignature = () => {
    const canvas = signatureCanvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  }

  // 确认签名：将画布内容转为图片插入编辑器
  const confirmSignature = () => {
    const canvas = signatureCanvasRef.current
    const target = signatureTargetRef.current
    if (!canvas || !target) return
    const dataUrl = canvas.toDataURL('image/png')
    // 替换签名区域的 u 标签内容为签名图片
    const img = document.createElement('img')
    img.src = dataUrl
    img.style.height = '28px'
    img.style.verticalAlign = 'middle'
    img.style.margin = '0 4px'
    target.innerHTML = ''
    target.appendChild(img)
    setSignatureModalVisible(false)
    signatureTargetRef.current = null
  }

  // 设置编辑器 ref
  const setEditorRef = useCallback((pageId: string, el: HTMLDivElement | null) => {
    if (el) {
      editorRefs.current.set(pageId, el)
      // 仅在首次挂载时初始化 innerHTML，避免后续 state 更新导致光标重置
      if (!el.dataset.contentInitialized) {
        const page = pages.find(p => p.id === pageId)
        // 优先使用页面 content，其次使用 PAGE_DEFAULT_CONTENT，最后使用通用模板
        const pageTypeKey = PAGE_TYPE_OPTIONS.find(o => o.title === page?.title)?.key
        el.innerHTML = page?.content || (pageTypeKey ? PAGE_DEFAULT_CONTENT[pageTypeKey] : '') || `
          <h1 style="font-size:22px;font-weight:700;text-align:center;margin-bottom:32px;color:#000;font-family:'SimHei','黑体',sans-serif;">${page?.title || ''}</h1>
          <h2 style="font-size:16px;font-weight:700;margin-bottom:16px;color:#1A1A1A;font-family:'SimHei','黑体',sans-serif;">一、概述</h2>
          <p style="text-indent:2em;margin-bottom:12px;">请在此处填写${page?.title || ''}的相关内容。本部分内容支持富文本格式编辑，可包含一级标题、二级标题、三级标题等多层级结构，以及表格、图片等多媒体元素。</p>
          <h2 style="font-size:16px;font-weight:700;margin-bottom:16px;margin-top:24px;color:#1A1A1A;font-family:'SimHei','黑体',sans-serif;">二、详细内容</h2>
          <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;margin-top:20px;color:#333;font-family:'SimHei','黑体',sans-serif;">1. 子标题示例</h3>
          <p style="text-indent:2em;margin-bottom:12px;">这是三级标题下的正文内容示例。请根据实际实验内容进行修改和补充。建议使用清晰的结构化格式，便于后续查阅和数据分析。</p>
          <h3 style="font-size:14px;font-weight:700;margin-bottom:12px;margin-top:20px;color:#333;font-family:'SimHei','黑体',sans-serif;">2. 子标题示例</h3>
          <p style="text-indent:2em;margin-bottom:12px;">请在此处继续填写相关内容。可添加多个二级标题和三级标题来组织内容结构。</p>
          <h2 style="font-size:16px;font-weight:700;margin-bottom:16px;margin-top:24px;color:#1A1A1A;font-family:'SimHei','黑体',sans-serif;">三、备注</h2>
          <p style="text-indent:2em;margin-bottom:12px;">此处可填写补充说明、注意事项或其他备注信息。</p>
        `
        el.dataset.contentInitialized = 'true'
      }
      // 重新绑定已有的公式计算块事件
      el.querySelectorAll('.editor-calc-block').forEach(block => {
        bindCalcBlockEvents(block as HTMLElement, el)
      })
    } else {
      editorRefs.current.delete(pageId)
    }
  }, [pages])

  // 工具栏按钮样式
  const toolbarBtnStyle: React.CSSProperties = {
    width: 30, height: 30, border: 'none', background: 'transparent',
    cursor: 'pointer', borderRadius: 4, display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#595959',
  }
  const tableBtnStyle: React.CSSProperties = {
    height: 26, border: 'none', background: '#f5f5f5',
    cursor: 'pointer', borderRadius: 4, padding: '0 6px',
    fontSize: 12, color: '#595959', whiteSpace: 'nowrap',
  }
  const toolbarDividerStyle: React.CSSProperties = {
    width: 1, height: 18, backgroundColor: '#D9D9D9', margin: '0 4px',
  }

  const toolbarGroups = [
    {
      key: 'undo',
      tools: [
        { icon: <UndoOutlined />, title: '撤销', command: 'undo' },
        { icon: <RedoOutlined />, title: '重做', command: 'redo' },
      ]
    },
    {
      key: 'style',
      tools: [
        { icon: <FormatPainterOutlined />, title: '格式刷', command: '' },
        { icon: <ClearOutlined />, title: '清除格式', command: 'removeFormat' },
      ]
    },
    {
      key: 'text',
      tools: [
        { icon: <BoldOutlined />, title: '加粗', command: 'bold' },
        { icon: <ItalicOutlined />, title: '斜体', command: 'italic' },
        { icon: <UnderlineOutlined />, title: '下划线', command: 'underline' },
        { icon: <StrikethroughOutlined />, title: '删除线', command: 'strikeThrough' },
        { icon: <CodeOutlined />, title: '代码', command: 'code' },
      ]
    },
    {
      key: 'color',
      tools: [
        { icon: <FontColorsOutlined />, title: '字体颜色', command: 'foreColor' },
        { icon: <HighlightOutlined />, title: '高亮', command: 'backColor' },
      ]
    },
    {
      key: 'list',
      tools: [
        { icon: <UnorderedListOutlined />, title: '无序列表', command: 'insertUnorderedList' },
        { icon: <OrderedListOutlined />, title: '有序列表', command: 'insertOrderedList' },
        { icon: <CheckSquareOutlined />, title: '任务列表', command: '' },
      ]
    },
    {
      key: 'align',
      tools: [
        { icon: <AlignLeftOutlined />, title: '对齐', command: 'justifyLeft' },
      ]
    },
    {
      key: 'insert',
      tools: [
        { icon: <LinkOutlined />, title: '链接', command: 'createLink' },
        { icon: <TableOutlined />, title: '表格', command: '' },
        { icon: <PictureOutlined />, title: '图片', command: '' },
      ]
    },
    {
      key: 'sort',
      tools: [
        { icon: <span style={{ fontSize: 12 }}>↓</span>, title: '降序', command: '' },
        { icon: <span style={{ fontSize: 12 }}>↑</span>, title: '升序', command: '' },
      ]
    },
    {
      key: 'export',
      tools: [
        { icon: <FileWordOutlined />, title: '导出Word', command: '' },
      ]
    },
    {
      key: 'ai',
      tools: [
        { icon: <ThunderboltOutlined style={{ color: '#177DDC' }} />, title: 'AI助手', command: '' },
        { icon: <AppstoreOutlined style={{ color: '#177DDC' }} />, title: '模板', command: '' },
      ]
    },
  ]

  const isInfoPage = currentPage?.id === 'page_info'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 0, width: '100%', height: 'calc(100vh - 90px)', padding: 0 }}>
      {/* 顶部标题栏 */}
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 0 16px 0',
        flexShrink: 0,
      }}>
        <PageTitle>{isEdit ? '编辑实验记录' : '新建实验记录'}</PageTitle>
      </div>

      {/* 主体内容区 */}
      <div style={{ 
        display: 'flex', 
        gap: 0, 
        flex: 1, 
        minHeight: 0,
        border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
        borderRadius: '10px',
        overflow: 'hidden',
        backgroundColor: isDark ? '#141414' : '#FFFFFF',
      }}>
        {/* 左侧目录 */}
        <div style={{
          width: 220,
          flexShrink: 0,
          borderRight: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
          backgroundColor: isDark ? '#1A1A1A' : '#FAFAFA',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}>
          <div style={{
            padding: '14px 16px',
            borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
            fontSize: 14,
            fontWeight: 600,
            color: isDark ? '#DCDCDC' : '#000000',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}>
            <MenuOutlined style={{ fontSize: 14 }} />
            本册目录
          </div>
          <div style={{ flex: 1, overflow: 'auto', padding: '4px 0' }}>
            {pages.map((page, index) => (
              <div
                key={page.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px 8px 16px',
                  height: 50,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: currentPageIndex === index 
                    ? '#177DDC'
                    : (isDark ? '#DCDCDC' : '#000000'),
                  backgroundColor: currentPageIndex === index 
                    ? (isDark ? '#141F28' : '#E7F2FB') 
                    : 'transparent',
                  borderLeft: currentPageIndex === index 
                    ? '3px solid #177DDC' 
                    : '3px solid transparent',
                  transition: 'all 0.15s',
                  position: 'relative',
                  userSelect: 'none',
                }}
                onMouseEnter={(e) => {
                  if (currentPageIndex !== index) {
                    e.currentTarget.style.backgroundColor = isDark ? '#1D1D1D' : '#F0F0F0'
                  }
                }}
                onMouseLeave={(e) => {
                  if (currentPageIndex !== index) {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }
                }}
              >
                <span style={{ 
                  fontSize: 14, 
                  fontWeight: 400, 
                  color: currentPageIndex === index 
                    ? '#177DDC'
                    : (isDark ? '#DCDCDC' : '#000000'),
                  width: 24,
                  textAlign: 'center',
                  flexShrink: 0,
                }}>
                  {String(index + 1).padStart(2, '0')}
                </span>
                {editingPageId === page.id ? (
                  <Input
                    size="small"
                    value={editingTitle}
                    onChange={e => setEditingTitle(e.target.value)}
                    onBlur={saveEditTitle}
                    onPressEnter={saveEditTitle}
                    autoFocus
                    style={{ flex: 1, fontSize: 13, height: 24 }}
                    onClick={e => e.stopPropagation()}
                  />
                ) : (
                  <span 
                    style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    onClick={() => goToPage(index)}
                    onDoubleClick={() => startEditTitle(page.id)}
                  >
                    {page.title}
                  </span>
                )}
                {/* 上移下移 */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0, marginLeft: 'auto' }}>
                  <Button
                    type="text"
                    disabled={index === 0}
                    onClick={(e) => { e.stopPropagation(); movePage(index, 'up') }}
                    style={{ width: 24, height: 24, padding: 0, fontSize: 16, lineHeight: '24px', color: '#177DDC', fontFamily: 'sans-serif' }}
                  >
                    ▴
                  </Button>
                  <Button
                    type="text"
                    disabled={index === pages.length - 1}
                    onClick={(e) => { e.stopPropagation(); movePage(index, 'down') }}
                    style={{ width: 24, height: 24, padding: 0, fontSize: 16, lineHeight: '24px', color: '#177DDC', fontFamily: 'sans-serif' }}
                  >
                    ▾
                  </Button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* 右侧编辑区 */}
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minWidth: 0,
          overflow: 'hidden',
        }}>
          {/* 页面导航栏 */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 16px',
            flexShrink: 0,
            height: 50,
            borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
            backgroundColor: isDark ? '#141414' : '#FFFFFF',
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <span style={{ fontSize: 14, color: isDark ? '#ADADAD' : '#8C8C8C', flexShrink: 0 }}>实验名称：</span>
            {editingName ? (
              <Input
                size="small"
                autoFocus
                value={editNameValue}
                onChange={e => setEditNameValue(e.target.value)}
                onBlur={() => {
                  const trimmed = editNameValue.trim()
                  if (trimmed) {
                    setRecordName(trimmed)
                    localStorage.setItem('eln_record_name', trimmed)
                  }
                  setEditingName(false)
                }}
                onPressEnter={() => {
                  const trimmed = editNameValue.trim()
                  if (trimmed) {
                    setRecordName(trimmed)
                    localStorage.setItem('eln_record_name', trimmed)
                  }
                  setEditingName(false)
                }}
                style={{ fontSize: 14, fontWeight: 600, width: 260 }}
              />
            ) : (
              <span
                style={{
                  fontSize: 14,
                  fontWeight: recordName ? 600 : 400,
                  color: recordName ? (isDark ? '#DCDCDC' : '#262626') : (isDark ? '#7E7E7E' : '#BFBFBF'),
                  fontStyle: recordName ? 'normal' : 'italic',
                  cursor: 'pointer',
                  borderBottom: '1px dashed transparent',
                  padding: '1px 4px',
                  transition: 'all 0.2s',
                }}
                onClick={() => {
                  setEditNameValue(recordName)
                  setEditingName(true)
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderBottomColor = '#177DDC'
                  e.currentTarget.style.backgroundColor = isDark ? '#1A1A1A' : '#F5F5F5'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderBottomColor = 'transparent'
                  e.currentTarget.style.backgroundColor = 'transparent'
                }}
                title="点击编辑实验名称"
              >
                {recordName || '请输入实验名称'}
                <EditOutlined style={{ fontSize: 11, marginLeft: 6, color: isDark ? '#7E7E7E' : '#BFBFBF' }} />
              </span>
            )}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Button
                size="small"
                icon={<LeftOutlined />}
                disabled={currentPageIndex === 0}
                onClick={goToPrevPage}
              >
                上一页
              </Button>
              <span style={{ 
                fontSize: 13, 
                color: isDark ? '#DCDCDC' : '#262626',
                minWidth: 60,
                textAlign: 'center',
              }}>
                第{currentPageIndex + 1}/{totalPages}页
              </span>
              <Button
                size="small"
                icon={<RightOutlined />}
                disabled={currentPageIndex === totalPages - 1}
                onClick={goToNextPage}
              >
                下一页
              </Button>
              <div style={{ width: 1, height: 20, backgroundColor: isDark ? '#2C2C2C' : '#D9D9D9', margin: '0 4px' }} />
              <Button
                size="small"
                icon={<PlusOutlined />}
                onClick={() => setAddPageModalVisible(true)}
              >
                新增实验页
              </Button>
              <Button
                size="small"
                danger
                disabled={pages.length <= 1}
                onClick={() => deletePage(currentPageIndex)}
              >
                删除
              </Button>
            </div>
          </div>

          {/* 富文本工具栏 - 独立模块，固定在导航栏下方 */}
          {currentPage && !isInfoPage && currentPage.id !== 'page_attachments' && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              padding: '6px 12px',
              borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
              backgroundColor: '#FFFFFF',
              flexWrap: 'wrap',
              flexShrink: 0,
            }}>
              {/* 撤销/重做 */}
              <button onMouseDown={e => e.preventDefault()} onClick={() => execCommand('undo')} style={toolbarBtnStyle} title="撤销"><UndoOutlined /></button>
              <button onMouseDown={e => e.preventDefault()} onClick={() => execCommand('redo')} style={toolbarBtnStyle} title="重做"><RedoOutlined /></button>
              <div style={toolbarDividerStyle} />
              {/* 字体选择 */}
              <Select
                size="small"
                defaultValue="默认字体"
                style={{ width: 140 }}
                options={[
                  { value: 'default', label: '默认字体' },
                  { value: 'SimSun', label: '宋体' },
                  { value: 'SimHei', label: '黑体' },
                  { value: 'Microsoft YaHei', label: '微软雅黑' },
                  { value: 'KaiTi', label: '楷体' },
                  { value: 'FangSong', label: '仿宋' },
                  { value: 'Arial', label: 'Arial' },
                  { value: 'Times New Roman', label: 'Times New Roman' },
                ]}
                onDropdownVisibleChange={(open) => { if (open) saveSelection() }}
                onChange={(val) => { if (val !== 'default') execCommand('fontName', val) }}
              />
              {/* 字号选择 */}
              <Select
                size="small"
                value={currentFontSize}
                onChange={handleFontSize}
                style={{ width: 100 }}
                options={[
                  { value: '1', label: '12' },
                  { value: '2', label: '14' },
                  { value: '3', label: '16' },
                  { value: '4', label: '18' },
                  { value: '5', label: '24' },
                  { value: '6', label: '32' },
                  { value: '7', label: '48' },
                ]}
                onDropdownVisibleChange={(open) => { if (open) saveSelection() }}
              />
              <div style={toolbarDividerStyle} />
              {/* 格式刷 */}
              <button onMouseDown={e => e.preventDefault()} style={toolbarBtnStyle} title="格式刷"><FormatPainterOutlined /></button>
              {/* 清除格式 */}
              <button onMouseDown={e => e.preventDefault()} onClick={() => execCommand('removeFormat')} style={toolbarBtnStyle} title="清除格式"><ClearOutlined /></button>
              <div style={toolbarDividerStyle} />
              {/* 加粗/斜体/下划线/删除线/代码块 */}
              <button onMouseDown={e => e.preventDefault()} onClick={() => execCommand('bold')} style={toolbarBtnStyle} title="加粗"><BoldOutlined /></button>
              <button onMouseDown={e => e.preventDefault()} onClick={() => execCommand('italic')} style={toolbarBtnStyle} title="斜体"><ItalicOutlined /></button>
              <button onMouseDown={e => e.preventDefault()} onClick={() => execCommand('underline')} style={toolbarBtnStyle} title="下划线"><UnderlineOutlined /></button>
              <button onMouseDown={e => e.preventDefault()} onClick={() => execCommand('strikeThrough')} style={toolbarBtnStyle} title="删除线"><StrikethroughOutlined /></button>
              <button onMouseDown={e => e.preventDefault()} style={toolbarBtnStyle} title="代码块"><CodeOutlined /></button>
              <div style={toolbarDividerStyle} />
              {/* 字体颜色 */}
              <Dropdown onOpenChange={(open) => { if (open) saveSelection() }} trigger={['click']} dropdownRender={() => (
                <div style={{ padding: 8, background: '#fff', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 24px)', gap: 4 }}>
                    {['#000000','#434343','#666666','#2b3034','#B7B7B7','#CCCCCC','#D9D9D9','#EFEFEF','#F3F3F3','#FFFFFF','#E06666','#F6B26B','#FFD966','#93C47D','#76A5AF','#6FA8DC','#8E7CC3','#C27BA0','#A64D79','#674EA7','#3D85C6','#6AA84F','#BF9000','#E69138','#741B47','#85200C','#A61C00','#990000','#073763','#0B5394'].map(c => (
                      <div key={c} onClick={() => { execCommand('foreColor', c) }} style={{ width: 24, height: 24, backgroundColor: c, border: '1px solid #ddd', borderRadius: 3, cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
              )}>
                <button onMouseDown={e => e.preventDefault()} style={{ ...toolbarBtnStyle, display: 'inline-flex', gap: 2, position: 'relative' }} title="字体颜色">
                  <FontColorsOutlined />
                  <div style={{ position: 'absolute', bottom: 2, left: 6, right: 6, height: 3, backgroundColor: '#E06666', borderRadius: 1 }} />
                </button>
              </Dropdown>
              {/* 高亮 */}
              <Dropdown onOpenChange={(open) => { if (open) saveSelection() }} trigger={['click']} dropdownRender={() => (
                <div style={{ padding: 8, background: '#fff', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 24px)', gap: 4 }}>
                    {['#FFFF00','#00FF00','#00FFFF','#FF00FF','#FF0000','#0000FF','#FFFFCC','#CCFFCC','#CCFFFF','#FFCCFF','#FFCCCC','#CCCCFF','#FFFF99','#99FF99','#99FFFF','#FF99FF','#FF9999','#9999FF','#FFCC99','#99FFCC','#99CCFF','#CC99FF','#FF99CC','#CCFF99','#FFE5E5','#E5FFE5','#E5E5FF','#FFF0E5','#E5FFF0','#F0E5FF'].map(c => (
                      <div key={c} onClick={() => { execCommand('hiliteColor', c) }} style={{ width: 24, height: 24, backgroundColor: c, border: '1px solid #ddd', borderRadius: 3, cursor: 'pointer' }} />
                    ))}
                  </div>
                </div>
              )}>
                <button onMouseDown={e => e.preventDefault()} style={{ ...toolbarBtnStyle, display: 'inline-flex', gap: 2, position: 'relative' }} title="高亮">
                  <HighlightOutlined />
                  <div style={{ position: 'absolute', bottom: 2, left: 6, right: 6, height: 3, backgroundColor: '#FFFF00', borderRadius: 1 }} />
                </button>
              </Dropdown>
              <div style={toolbarDividerStyle} />
              {/* 标题/字号 */}
              <Dropdown onOpenChange={(open) => { if (open) saveSelection() }} menu={{ items: [
                { key: 'h1', label: '标题1', onClick: () => execCommand('formatBlock', '<h1>') },
                { key: 'h2', label: '标题2', onClick: () => execCommand('formatBlock', '<h2>') },
                { key: 'h3', label: '标题3', onClick: () => execCommand('formatBlock', '<h3>') },
                { key: 'h4', label: '标题4', onClick: () => execCommand('formatBlock', '<h4>') },
                { key: 'p', label: '正文', onClick: () => execCommand('formatBlock', '<p>') },
              ] }}>
                <button onMouseDown={e => e.preventDefault()} style={{ ...toolbarBtnStyle, display: 'inline-flex', gap: 2 }} title="标题">
                  <FontSizeOutlined />
                  <DownOutlined style={{ fontSize: 10 }} />
                </button>
              </Dropdown>
              <div style={toolbarDividerStyle} />
              {/* 无序列表/有序列表/复选框 */}
              <button onMouseDown={e => e.preventDefault()} onClick={() => execCommand('insertUnorderedList')} style={toolbarBtnStyle} title="无序列表"><UnorderedListOutlined /></button>
              <button onMouseDown={e => e.preventDefault()} onClick={() => execCommand('insertOrderedList')} style={toolbarBtnStyle} title="有序列表"><OrderedListOutlined /></button>
              <button onMouseDown={e => e.preventDefault()} style={toolbarBtnStyle} title="复选框"><CheckSquareOutlined /></button>
              <div style={toolbarDividerStyle} />
              {/* 对齐 */}
              <Dropdown onOpenChange={(open) => { if (open) saveSelection() }} menu={{ items: [
                { key: 'left', label: '左对齐', onClick: () => execCommand('justifyLeft') },
                { key: 'center', label: '居中对齐', onClick: () => execCommand('justifyCenter') },
                { key: 'right', label: '右对齐', onClick: () => execCommand('justifyRight') },
                { key: 'justify', label: '两端对齐', onClick: () => execCommand('justifyFull') },
              ] }}>
                <button onMouseDown={e => e.preventDefault()} style={{ ...toolbarBtnStyle, display: 'inline-flex', gap: 2 }} title="对齐方式">
                  <AlignLeftOutlined />
                  <DownOutlined style={{ fontSize: 10 }} />
                </button>
              </Dropdown>
              {/* 行高 */}
              <Dropdown onOpenChange={(open) => { if (open) saveSelection() }} menu={{ items: [
                { key: '1', label: '1.0', onClick: () => handleLineHeight('1') },
                { key: '1.5', label: '1.5', onClick: () => handleLineHeight('1.5') },
                { key: '2', label: '2.0', onClick: () => handleLineHeight('2') },
                { key: '2.5', label: '2.5', onClick: () => handleLineHeight('2.5') },
                { key: '3', label: '3.0', onClick: () => handleLineHeight('3') },
              ] }}>
                <button onMouseDown={e => e.preventDefault()} style={{ ...toolbarBtnStyle, display: 'inline-flex', gap: 2 }} title="行高">
                  <ColumnHeightOutlined />
                  <DownOutlined style={{ fontSize: 10 }} />
                </button>
              </Dropdown>
              {/* 段落间距 */}
              <Dropdown onOpenChange={(open) => { if (open) saveSelection() }} trigger={['click']} dropdownRender={() => (
                <div style={{ padding: 12, background: '#fff', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', width: 220 }}>
                  <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600 }}>段落间距</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>段前间距(px)</div>
                      <input type="number" id="spacing-before" min="0" max="100" defaultValue="0" style={{ width: '100%', height: 28, border: '1px solid #2b3034', borderRadius: 4, padding: '0 8px', fontSize: 13 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>段后间距(px)</div>
                      <input type="number" id="spacing-after" min="0" max="100" defaultValue="12" style={{ width: '100%', height: 28, border: '1px solid #2b3034', borderRadius: 4, padding: '0 8px', fontSize: 13 }} />
                    </div>
                  </div>
                  <button onClick={() => {
                    const before = parseInt((document.getElementById('spacing-before') as HTMLInputElement)?.value) || 0
                    const after = parseInt((document.getElementById('spacing-after') as HTMLInputElement)?.value) || 0
                    handleParagraphSpacing(before, after)
                  }} style={{ width: '100%', height: 32, background: '#177DDC', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>确定</button>
                </div>
              )}>
                <button onMouseDown={e => e.preventDefault()} style={{ ...toolbarBtnStyle, display: 'inline-flex', gap: 2 }} title="段落间距">
                  <ColumnHeightOutlined style={{ transform: 'rotate(90deg)' }} />
                  <DownOutlined style={{ fontSize: 10 }} />
                </button>
              </Dropdown>
              <div style={toolbarDividerStyle} />
              {/* 链接 */}
              <button onMouseDown={e => e.preventDefault()} onClick={() => { saveSelection(); const url = prompt('请输入链接地址：'); if (url) execCommand('createLink', url) }} style={toolbarBtnStyle} title="插入链接"><LinkOutlined /></button>
              {/* 表格 */}
              <Dropdown onOpenChange={(open) => { if (open) saveSelection() }} trigger={['click']} dropdownRender={() => (
                <div style={{ padding: 12, background: '#fff', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)', width: 200 }}>
                  <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 600 }}>插入表格</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>行数</div>
                      <input type="number" id="table-rows" min="1" max="20" defaultValue="3" style={{ width: '100%', height: 28, border: '1px solid #2b3034', borderRadius: 4, padding: '0 8px', fontSize: 13 }} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, color: '#8c8c8c', marginBottom: 4 }}>列数</div>
                      <input type="number" id="table-cols" min="1" max="20" defaultValue="3" style={{ width: '100%', height: 28, border: '1px solid #2b3034', borderRadius: 4, padding: '0 8px', fontSize: 13 }} />
                    </div>
                  </div>
                  <button onClick={() => {
                    const rows = Math.min(Math.max(parseInt((document.getElementById('table-rows') as HTMLInputElement)?.value) || 3, 1), 20)
                    const cols = Math.min(Math.max(parseInt((document.getElementById('table-cols') as HTMLInputElement)?.value) || 3, 1), 20)
                    let html = '<table style="border-collapse:collapse;width:100%;table-layout:fixed">'
                    for (let r = 0; r < rows; r++) {
                      html += '<tr>'
                      for (let c = 0; c < cols; c++) {
                        html += '<td style="padding:4px 8px;border:none;border-bottom:1px solid #2b3034;min-width:60px;word-break:break-word">&nbsp;</td>'
                      }
                      html += '</tr>'
                    }
                    html += '</table><br/>'
                    execCommand('insertHTML', html)
                  }} style={{ width: '100%', height: 32, background: '#177DDC', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', fontSize: 13 }}>确定插入</button>
                </div>
              )}>
                <button onMouseDown={e => e.preventDefault()} style={toolbarBtnStyle} title="插入表格"><TableOutlined /></button>
              </Dropdown>
              {/* 数学公式 */}
              <Dropdown onOpenChange={(open) => { if (open) saveSelection() }} menu={{ items: [
                { key: 'inline', label: '行内公式', onClick: () => handleFormulaTypeSelect('inline') },
                { key: 'block', label: '块级公式', onClick: () => handleFormulaTypeSelect('block') },
              ] }}>
                <button onMouseDown={e => e.preventDefault()} style={{ ...toolbarBtnStyle, display: 'inline-flex', gap: 2 }} title="数学公式">
                  <FunctionOutlined />
                  <DownOutlined style={{ fontSize: 10 }} />
                </button>
              </Dropdown>
              {/* 插入图表 */}
              <button onMouseDown={e => e.preventDefault()} onClick={() => { saveSelection(); insertChartDirectly('pie', defaultChartData, '图表') }} style={toolbarBtnStyle} title="插入图表">
                <PieChartOutlined />
              </button>
              {/* 公式计算 */}
              <button onMouseDown={e => e.preventDefault()} onClick={() => { saveSelection(); insertCalcBlock() }} style={toolbarBtnStyle} title="公式计算">
                <CalculatorOutlined />
              </button>
              {/* 图片 */}
              <Dropdown onOpenChange={(open) => { if (open) saveSelection() }} menu={{ items: [
                { key: 'url', label: '网络图片', onClick: () => { const url = prompt('请输入图片地址：'); if (url) execCommand('insertImage', url) } },
                { key: 'upload', label: '本地上传', onClick: () => {} },
              ] }}>
                <button onMouseDown={e => e.preventDefault()} style={{ ...toolbarBtnStyle, display: 'inline-flex', gap: 2 }} title="插入图片">
                  <PictureOutlined />
                  <DownOutlined style={{ fontSize: 10 }} />
                </button>
              </Dropdown>
              <div style={toolbarDividerStyle} />
              {/* 降序/升序 */}
              <button onMouseDown={e => e.preventDefault()} style={toolbarBtnStyle} title="降序"><SortDescendingOutlined /></button>
              <button onMouseDown={e => e.preventDefault()} style={toolbarBtnStyle} title="升序"><SortAscendingOutlined /></button>
              <div style={toolbarDividerStyle} />
              {/* 导出Word */}
              <Dropdown onOpenChange={(open) => { if (open) saveSelection() }} menu={{ items: [
                { key: 'word', label: '导出 Word', onClick: () => {} },
                { key: 'pdf', label: '导出 PDF', onClick: () => {} },
              ] }}>
                <button onMouseDown={e => e.preventDefault()} style={{ ...toolbarBtnStyle, display: 'inline-flex', gap: 2 }} title="导出">
                  <FileWordOutlined />
                  <DownOutlined style={{ fontSize: 10 }} />
                </button>
              </Dropdown>
              <div style={toolbarDividerStyle} />
              {/* snippets */}
              <button onMouseDown={e => e.preventDefault()} style={toolbarBtnStyle} title="片段"><SnippetsOutlined /></button>
              {/* appstore */}
              <button onMouseDown={e => e.preventDefault()} style={toolbarBtnStyle} title="模板"><AppstoreOutlined /></button>
              <div style={toolbarDividerStyle} />
              {/* AI助手 */}
              <Dropdown menu={{ items: [
                { key: 'write', label: 'AI书写', onClick: () => { saveSelection(); setAiModalVisible(true); setAiTab('write') } },
                { key: 'photo', label: '拍照上传', onClick: () => { saveSelection(); setAiModalVisible(true); setAiTab('photo') } },
                { key: 'ocr', label: 'OCR识别', onClick: () => { saveSelection(); setAiModalVisible(true); setAiTab('ocr') } },
                { key: 'qa', label: '智能问答', onClick: () => { saveSelection(); setAiModalVisible(true); setAiTab('qa') } },
              ] }}>
                <button onMouseDown={e => e.preventDefault()} style={{ ...toolbarBtnStyle, color: '#177DDC', display: 'inline-flex', gap: 2, alignItems: 'center' }} title="AI助手">
                  <ThunderboltOutlined />
                  <span style={{ fontSize: 12, fontWeight: 500 }}>AI</span>
                  <DownOutlined style={{ fontSize: 10 }} />
                </button>
              </Dropdown>
            </div>
          )}

          {/* 编辑内容区 */}
          <div data-editor-scroll-area style={{
            flex: 1,
            overflow: 'auto',
            padding: '0px',
            position: 'relative',
          }}>
            {/* 表格操作浮动工具栏 */}
            {tableToolbarVisible && activeTableEl && (
              <div style={{
                position: 'absolute',
                top: tableToolbarPos.top,
                left: tableToolbarPos.left,
                zIndex: 100,
                background: '#fff',
                border: '1px solid #e5e5e5',
                borderRadius: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                padding: '4px 6px',
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                flexWrap: 'wrap',
                maxWidth: 360,
              }}
                onMouseDown={(e) => e.preventDefault()}
                data-table-toolbar
              >
                <button onClick={insertRowAbove} title="上方插入行" style={tableBtnStyle}>↑行</button>
                <button onClick={insertRowBelow} title="下方插入行" style={tableBtnStyle}>↓行</button>
                <button onClick={insertColLeft} title="左侧插入列" style={tableBtnStyle}>←列</button>
                <button onClick={insertColRight} title="右侧插入列" style={tableBtnStyle}>→列</button>
                <div style={{ width: 1, height: 18, background: '#e5e5e5', margin: '0 2px' }} />
                <button onClick={deleteRow} title="删除行" style={{ ...tableBtnStyle, color: '#ff4d4f' }}>删行</button>
                <button onClick={deleteCol} title="删除列" style={{ ...tableBtnStyle, color: '#ff4d4f' }}>删列</button>
                <button onClick={deleteTable} title="删除表格" style={{ ...tableBtnStyle, color: '#ff4d4f' }}>删表</button>
                <div style={{ width: 1, height: 18, background: '#e5e5e5', margin: '0 2px' }} />
                <button onClick={() => insertTableBeside('before')} title="上方插入表格" style={tableBtnStyle}>+表上</button>
                <button onClick={() => insertTableBeside('after')} title="下方插入表格" style={tableBtnStyle}>+表下</button>
              </div>
            )}
            {currentPage && isInfoPage && (
              /* 基本信息页面 */
              <div>
                <div style={{ 
                  fontSize: 16, 
                  fontWeight: 600, 
                  color: isDark ? '#DCDCDC' : '#262626',
                  marginBottom: 16,
                  paddingBottom: 8,
                  borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#F0F0F0'}`,
                }}>
                  {currentPage?.title}
                </div>
                <Form form={form} layout="vertical" style={{ marginTop: 24 }}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Form.Item label="实验名称" name="name" rules={[{ required: true, message: '请输入实验名称' }]}>
                        <Input placeholder="请输入实验名称" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="实验模板" name="template" rules={[{ required: true, message: '请选择实验模板' }]}>
                        <Select placeholder="请选择实验模板">
                          <Option value="细胞培养模板">细胞培养模板</Option>
                          <Option value="PCR实验模板">PCR实验模板</Option>
                          <Option value="Western Blot模板">Western Blot模板</Option>
                          <Option value="免疫组化模板">免疫组化模板</Option>
                          <Option value="动物实验模板">动物实验模板</Option>
                          <Option value="临床样本处理模板">临床样本处理模板</Option>
                          <Option value="数据统计分析模板">数据统计分析模板</Option>
                          <Option value="试剂配制模板">试剂配制模板</Option>
                        </Select>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={8}>
                      <Form.Item label="创建人">
                        <Input value="当前用户" disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="创建时间">
                        <Input value={new Date().toISOString().split('T')[0]} disabled />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item label="记录ID">
                        <Input value={isEdit ? `ELN${editId}` : '自动生成'} disabled />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </div>
            )}

            {currentPage && !isInfoPage && currentPage.id !== 'page_attachments' && (
              /* Word文档内容页面 */
              <>
                {/* 内容编辑区 */}
                <div
                  key={currentPage.id}
                  ref={(el) => setEditorRef(currentPage.id, el)}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={() => handleEditorInput(currentPage.id)}
                  onMouseUp={saveSelection}
                  onKeyUp={saveSelection}
                  onClick={handleEditorClick}
                  style={{
                      fontFamily: '"SimSun", "宋体", serif',
                      fontSize: 14,
                      color: '#2b3034',
                      lineHeight: 1.8,
                      outline: 'none',
                      padding: 50,
                      backgroundColor: '#d9d8d2',
                    }}
                  />
              </>
            )}

            {currentPage && currentPage.id === 'page_attachments' && (
              /* 附件页面 */
              <div>
                <div style={{ 
                  fontSize: 16, 
                  fontWeight: 600, 
                  color: isDark ? '#DCDCDC' : '#262626',
                  marginBottom: 16,
                  paddingBottom: 8,
                  borderBottom: `1px solid ${isDark ? '#2C2C2C' : '#F0F0F0'}`,
                }}>
                  {currentPage?.title}
                </div>
                <Upload.Dragger 
                  multiple
                  style={{ 
                    backgroundColor: isDark ? '#1A1A1A' : '#FAFAFA',
                    borderColor: isDark ? '#2C2C2C' : '#E5E5E5',
                  }}
                >
                  <p className="ant-upload-drag-icon">
                    <UploadOutlined style={{ color: '#177DDC', fontSize: 24 }} />
                  </p>
                  <p className="ant-upload-text" style={{ color: isDark ? '#ADADAD' : '#595959' }}>
                    点击或拖拽文件到此处上传（支持多文件）
                  </p>
                  <p className="ant-upload-hint" style={{ color: isDark ? '#7E7E7E' : '#8C8C8C' }}>
                    支持图片、文档、表格、PDF等格式
                  </p>
                </Upload.Dragger>
              </div>
            )}


          </div>
        </div>
      </div>

      {/* 签名模态框 */}
      <Modal
        title="电子签名"
        open={signatureModalVisible}
        onCancel={() => { setSignatureModalVisible(false); signatureTargetRef.current = null }}
        footer={null}
        width={480}
        destroyOnClose
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 13, color: '#8c8c8c', alignSelf: 'flex-start' }}>请在下方区域手写签名：</div>
          <canvas
            ref={signatureCanvasRef}
            width={420}
            height={160}
            style={{ border: '1px solid #2b3034', borderRadius: 6, cursor: 'crosshair', background: '#fff' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
          />
          <div style={{ display: 'flex', gap: 8, width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={clearSignature}>清空</Button>
            <Button type="primary" onClick={confirmSignature}>确认签名</Button>
          </div>
        </div>
      </Modal>

      {/* 新增实验页模态框 */}
      <Modal
        title="新增实验页"
        open={addPageModalVisible}
        onCancel={() => setAddPageModalVisible(false)}
        footer={null}
        width={520}
        bodyStyle={{ padding: '16px 24px' }}
      >
        <div style={{ fontSize: 13, color: isDark ? '#ADADAD' : '#8C8C8C', marginBottom: 16 }}>
          请选择要添加的页面类型
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {PAGE_TYPE_OPTIONS.map(option => (
            <div
              key={option.key}
              onClick={() => handleAddPage(option)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '12px 16px',
                borderRadius: 8,
                border: `1px solid ${isDark ? '#2C2C2C' : '#E5E5E5'}`,
                cursor: 'pointer',
                transition: 'all 0.2s',
                backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#177DDC'
                e.currentTarget.style.backgroundColor = isDark ? '#141F28' : '#F0F7FF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDark ? '#2C2C2C' : '#E5E5E5'
                e.currentTarget.style.backgroundColor = isDark ? '#1A1A1A' : '#FFFFFF'
              }}
            >
              <span style={{ fontSize: 24, flexShrink: 0, color: '#177DDC', display: 'inline-flex', alignItems: 'center' }}>{option.icon}</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: isDark ? '#DCDCDC' : '#262626' }}>
                  {option.title}
                </div>
                <div style={{ fontSize: 12, color: isDark ? '#7E7E7E' : '#8C8C8C', marginTop: 2 }}>
                  {option.description}
                </div>
              </div>
              <PlusOutlined style={{ color: '#177DDC', fontSize: 14, flexShrink: 0 }} />
            </div>
          ))}
        </div>
      </Modal>

      {/* AI功能弹窗 */}
      {aiModalVisible && (
        <>
          <div
            onClick={() => { setAiModalVisible(false); setAiResult(''); setAiPrompt(''); setPhotoText(''); setPhotoFile(null) }}
            style={{ position: 'fixed', inset: 0, zIndex: 999 }}
          />
          <div style={{
            position: 'fixed',
            bottom: 100,
            right: 40,
            width: 500,
            maxHeight: 'calc(100vh - 140px)',
            height: 600,
            zIndex: 1000,
            backgroundColor: '#FFFFFF',
            borderRadius: 12,
            boxShadow: '0 8px 40px rgba(0,0,0,0.2)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            border: '1px solid #E5E5E5',
          }}>
            <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <style>{`
                .ai-panel-tabs { height: 100%; display: flex; flex-direction: column; }
                .ai-panel-tabs .ant-tabs-nav { margin-bottom: 0 !important; flex-shrink: 0; }
                .ai-panel-tabs .ant-tabs-nav-list { width: 100%; }
                .ai-panel-tabs .ant-tabs-tab { flex: 1; justify-content: center; margin: 0 !important; }
                .ai-panel-tabs .ant-tabs-content-holder { flex: 1; min-height: 0; }
                .ai-panel-tabs .ant-tabs-content { height: 100%; }
                .ai-panel-tabs .ant-tabs-tabpane { height: 100%; }
              `}</style>
              <Tabs
                activeKey={aiTab}
                onChange={(key) => setAiTab(key)}
                className="ai-panel-tabs"
              items={[
            {
              key: 'write',
              label: <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}><RobotOutlined />AI书写</span>,
              children: (
                <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%' }}>
                  <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
                    {!aiResult && !aiGenerating ? (
                      <div style={{ display: 'flex', marginBottom: 16, alignItems: 'flex-start' }}>
                        <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52C41A', marginRight: 12, flexShrink: 0 }} />
                        <div style={{ backgroundColor: '#F5F5F5', padding: 12, borderRadius: 12, maxWidth: '80%', lineHeight: 1.6 }}>
                          <div style={{ fontSize: 13, color: '#262626' }}>
                            用一句话描述你的需求，我会直接帮你编辑文档。
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        {aiPrompt && (
                          <div style={{ display: 'flex', marginBottom: 16, flexDirection: 'row-reverse', alignItems: 'flex-start' }}>
                            <Avatar icon={<UserOutlined />} style={{ backgroundColor: '#177DDC', marginLeft: 12, flexShrink: 0 }} />
                            <div style={{ backgroundColor: '#177DDC', padding: 12, borderRadius: 12, maxWidth: '80%', lineHeight: 1.6, color: '#FFFFFF' }}>
                              {aiPrompt}
                            </div>
                          </div>
                        )}
                        {aiGenerating ? (
                          <div style={{ display: 'flex', marginBottom: 16, alignItems: 'flex-start' }}>
                            <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52C41A', marginRight: 12, flexShrink: 0 }} />
                            <div style={{ backgroundColor: '#F5F5F5', padding: 12, borderRadius: 12 }}>
                              <LoadingOutlined style={{ fontSize: 16, color: '#177DDC' }} />
                            </div>
                          </div>
                        ) : aiResult ? (
                          <div style={{ display: 'flex', marginBottom: 16, alignItems: 'flex-start' }}>
                            <Avatar icon={<RobotOutlined />} style={{ backgroundColor: '#52C41A', marginRight: 12, flexShrink: 0 }} />
                            <div style={{ backgroundColor: '#F5F5F5', padding: 12, borderRadius: 12, maxWidth: '80%', lineHeight: 1.8 }}>
                              <div style={{ fontSize: 13, color: '#262626' }} dangerouslySetInnerHTML={{ __html: aiResult }} />
                              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 8 }}>
                                <Button size="small" type="primary" icon={<CopyOutlined />} onClick={handleInsertAiResult}>
                                  插入文档
                                </Button>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                  <div style={{ padding: 16, borderTop: '1px solid #E5E5E5', backgroundColor: '#FAFAFA' }}>
                    <div style={{ marginBottom: 12, display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: '#8C8C8C', marginRight: 4 }}>快捷问题：</span>
                      {aiExamplePrompts.map((example, i) => (
                        <Button key={i} size="small" onClick={() => setAiPrompt(example)}>
                          {example}
                        </Button>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end' }}>
                      <TextArea
                        value={aiPrompt}
                        onChange={e => setAiPrompt(e.target.value)}
                        placeholder="用一句话描述你的需求..."
                        autoSize={{ minRows: 1, maxRows: 3 }}
                        onPressEnter={e => { if (!e.shiftKey) { e.preventDefault(); handleAiGenerate() } }}
                        style={{ fontSize: 13, flex: 1 }}
                      />
                      <Button
                        type="primary"
                        icon={<SendOutlined />}
                        onClick={handleAiGenerate}
                        disabled={!aiPrompt.trim() || aiGenerating}
                        loading={aiGenerating}
                      >
                        发送
                      </Button>
                    </div>
                  </div>
                </div>
              ),
            },
            {
              key: 'photo',
              label: <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}><CameraOutlined />拍照上传</span>,
              children: (
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%' }}>
                  <div style={{ fontSize: 13, color: '#8C8C8C', marginBottom: 12, alignSelf: 'flex-start' }}>
                    拍照后照片将自动插入到文档光标位置
                  </div>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    style={{
                      width: '100%',
                      borderRadius: 8,
                      backgroundColor: '#000',
                      display: cameraActive ? 'block' : 'none',
                      marginBottom: 16,
                    }}
                  />
                  <canvas ref={canvasRef} style={{ display: 'none' }} />
                  {!cameraActive ? (
                    <div
                      onClick={() => document.getElementById('ai-photo-upload')?.click()}
                      style={{
                        border: '1px dashed #2b3034',
                        borderRadius: 8,
                        padding: '40px 0',
                        textAlign: 'center',
                        cursor: 'pointer',
                        transition: 'border-color 0.3s',
                        background: '#fafafa',
                        width: '100%',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#177DDC')}
                      onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#2b3034')}
                    >
                      <p style={{ marginBottom: 8 }}>
                        <CameraOutlined style={{ fontSize: 48, color: '#177DDC' }} />
                      </p>
                      <p style={{ fontSize: 14, color: '#262626', margin: 0 }}>点击拍照上传</p>
                      <p style={{ fontSize: 12, color: '#8C8C8C', margin: '4px 0 0' }}>选择本地图片，照片自动插入到文档</p>
                      <input
                        id="ai-photo-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (!file) return
                          const reader = new FileReader()
                          reader.onload = (ev) => {
                            const dataUrl = ev.target?.result as string
                            const el = editorRefs.current.get(currentPage?.id || '')
                            if (el) {
                              el.focus()
                              restoreSelection()
                              document.execCommand('insertHTML', false, `<img src="${dataUrl}" style="max-width:100%;margin:8px 0;" />`)
                              updatePageContent(currentPage!.id, el.innerHTML)
                              message.success('图片已插入文档')
                            }
                          }
                          reader.readAsDataURL(file)
                          e.target.value = ''
                        }}
                      />
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 12, width: '100%', justifyContent: 'center' }}>
                      <Button onClick={stopCamera}>取消</Button>
                      <Button type="primary" icon={<CameraOutlined />} onClick={captureAndInsert}>
                        拍照并插入
                      </Button>
                    </div>
                  )}
                </div>
              ),
            },
            {
              key: 'ocr',
              label: <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}><FileTextOutlined />OCR识别</span>,
              children: (
                <div style={{ padding: '0', flex: 1, overflow: 'auto' }}>
                  <OCRRecognition compact onInsertToDocument={(text) => {
                    restoreSelection()
                    const sel = window.getSelection()
                    if (sel && sel.rangeCount > 0) {
                      const range = sel.getRangeAt(0)
                      range.deleteContents()
                      range.insertNode(document.createTextNode(text))
                      range.collapse(false)
                    } else {
                      document.execCommand('insertText', false, text)
                    }
                    message.success('内容已插入文档')
                  }} />
                </div>
              ),
            },
            {
              key: 'qa',
              label: <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 14 }}><QuestionCircleOutlined />智能问答</span>,
              children: (
                <div style={{ padding: '0', flex: 1, height: '100%', overflow: 'auto' }}>
                  <AIExperiment />
                </div>
              ),
            },
          ]}
        />
            </div>
          </div>
        </>
      )}

      {/* 数学公式弹窗 */}
      <Modal
        title={formulaType === 'inline' ? '插入行内公式' : '插入块级公式'}
        open={formulaModalVisible}
        onCancel={() => { setFormulaModalVisible(false); setFormulaInput('') }}
        onOk={insertFormula}
        okText="插入公式"
        cancelText="取消"
        width={480}
        destroyOnClose
      >
        <div style={{ marginBottom: 12 }}>
          <span style={{ fontSize: 13, color: '#8c8c8c' }}>
            {formulaType === 'inline'
              ? '行内公式将插入到文字中，与文字在同一行显示'
              : '块级公式将独立成行，居中显示'}
          </span>
        </div>
        <Input.TextArea
          value={formulaInput}
          onChange={e => setFormulaInput(e.target.value)}
          placeholder="请输入公式内容，例如：E = mc²  或  x = (-b ± √(b²-4ac)) / 2a"
          rows={3}
          autoFocus
          style={{ fontFamily: "'Times New Roman', serif", fontStyle: 'italic', fontSize: 16 }}
        />
        <div style={{ marginTop: 12, padding: 12, background: '#f0f2f5', borderRadius: 6, fontSize: 13, color: '#8c8c8c' }}>
          提示：公式将以斜体衬线字体显示，可输入数学表达式、化学式等
        </div>
      </Modal>

      {/* 公式库弹窗 */}
      <Modal
        title={null}
        open={formulaLibModalVisible}
        onCancel={() => { setFormulaLibModalVisible(false); setFormulaLibActiveBlock(null) }}
        footer={null}
        width={680}
        destroyOnClose
        closeIcon={<span style={{ fontSize: 18, color: '#8c8c8c' }}>✕</span>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* 搜索 */}
          <Input
            prefix={<SearchOutlined style={{ color: '#bfbfbf' }} />}
            placeholder="搜索公式..."
            value={formulaLibSearch}
            onChange={e => setFormulaLibSearch(e.target.value)}
            allowClear
            size="middle"
            style={{ borderRadius: 6 }}
          />
          {/* 分类标签 - 左右切换 */}
          {!formulaLibSearch.trim() && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <button
                onClick={() => setFormulaLibActiveCategory(prev => Math.max(0, prev - 1))}
                disabled={formulaLibActiveCategory === 0}
                style={{
                  border: 'none', background: 'transparent', cursor: formulaLibActiveCategory === 0 ? 'not-allowed' : 'pointer',
                  padding: '4px 6px', borderRadius: 4, color: formulaLibActiveCategory === 0 ? '#d9d9d9' : '#595959',
                  fontSize: 14, display: 'flex', alignItems: 'center',
                }}
              ><LeftOutlined /></button>
              <div style={{ display: 'flex', gap: 0, flex: 1, overflow: 'hidden' }}>
                {FORMULA_CATEGORIES.map((cat, ci) => (
                  <button
                    key={ci}
                    onClick={() => setFormulaLibActiveCategory(ci)}
                    style={{
                      padding: '6px 14px', border: 'none', borderRadius: 0,
                      background: formulaLibActiveCategory === ci ? '#177DDC' : '#f5f5f5',
                      color: formulaLibActiveCategory === ci ? '#fff' : '#595959',
                      fontSize: 13, fontWeight: formulaLibActiveCategory === ci ? 600 : 400,
                      cursor: 'pointer', whiteSpace: 'nowrap',
                      ...(ci === 0 ? { borderTopLeftRadius: 4, borderBottomLeftRadius: 4 } : {}),
                      ...(ci === FORMULA_CATEGORIES.length - 1 ? { borderTopRightRadius: 4, borderBottomRightRadius: 4 } : {}),
                    }}
                  >{cat.category}</button>
                ))}
              </div>
              <button
                onClick={() => setFormulaLibActiveCategory(prev => Math.min(FORMULA_CATEGORIES.length - 1, prev + 1))}
                disabled={formulaLibActiveCategory === FORMULA_CATEGORIES.length - 1}
                style={{
                  border: 'none', background: 'transparent', cursor: formulaLibActiveCategory === FORMULA_CATEGORIES.length - 1 ? 'not-allowed' : 'pointer',
                  padding: '4px 6px', borderRadius: 4, color: formulaLibActiveCategory === FORMULA_CATEGORIES.length - 1 ? '#d9d9d9' : '#595959',
                  fontSize: 14, display: 'flex', alignItems: 'center',
                }}
              ><RightOutlined /></button>
            </div>
          )}
          {/* 公式列表 */}
          <div style={{ maxHeight: 360, overflowY: 'auto', paddingRight: 4 }}>
            {formulaLibSearch.trim() ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {ALL_FORMULAS.filter(f => f.name.toLowerCase().includes(formulaLibSearch.toLowerCase()) || f.formula.toLowerCase().includes(formulaLibSearch.toLowerCase())).length === 0 
                  ? <div style={{ gridColumn: '1 / 3', textAlign: 'center', padding: 24, color: '#8c8c8c' }}>未找到匹配公式</div>
                  : ALL_FORMULAS.filter(f => f.name.toLowerCase().includes(formulaLibSearch.toLowerCase()) || f.formula.toLowerCase().includes(formulaLibSearch.toLowerCase())).map((f, i) => (
                    <div
                      key={i}
                      onClick={() => fillBlockFormula(f.formula, f.vars)}
                      style={{ padding: '10px 12px', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', background: '#fff', transition: 'all 0.2s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#177DDC'; (e.currentTarget as HTMLElement).style.background = '#f0f6ff' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e8e8e8'; (e.currentTarget as HTMLElement).style.background = '#fff' }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#2b3034', marginBottom: 4 }}>{f.name}</div>
                      <div style={{ fontFamily: "'Times New Roman', serif", fontStyle: 'italic', fontSize: 13, color: '#8c8c8c' }}>{f.formula}</div>
                    </div>
                  ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {FORMULA_CATEGORIES[formulaLibActiveCategory].formulas.map((f, fi) => (
                  <div
                    key={fi}
                    onClick={() => fillBlockFormula(f.formula, f.vars)}
                    style={{ padding: '10px 12px', border: '1px solid #e8e8e8', borderRadius: 6, cursor: 'pointer', background: '#fff', transition: 'all 0.2s' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = '#177DDC'; (e.currentTarget as HTMLElement).style.background = '#f0f6ff' }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#e8e8e8'; (e.currentTarget as HTMLElement).style.background = '#fff' }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#2b3034', marginBottom: 4 }}>{f.name}</div>
                    <div style={{ fontFamily: "'Times New Roman', serif", fontStyle: 'italic', fontSize: 13, color: '#8c8c8c' }}>{f.formula}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {/* 底部按钮 */}
          <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
            <Button icon={<RobotOutlined />} onClick={openAiFormulaModal}>AI生成公式</Button>
            <Button type="primary" onClick={insertBlankCalcBlock}>插入空白公式</Button>
          </div>
        </div>
      </Modal>

      {/* AI生成公式弹窗 */}
      <Modal
        title={null}
        open={aiFormulaModalVisible}
        onCancel={() => { setAiFormulaModalVisible(false); setAiFormulaInput(''); setAiFormulaResult(null) }}
        footer={null}
        width={520}
        destroyOnClose
        closeIcon={<span style={{ fontSize: 18, color: '#8c8c8c' }}>✕</span>}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <RobotOutlined style={{ fontSize: 18, color: '#177DDC' }} />
            <span style={{ fontSize: 15, fontWeight: 600, color: '#2b3034' }}>AI生成公式</span>
          </div>
          {/* 输入区 */}
          <div>
            <div style={{ fontSize: 13, color: '#8c8c8c', marginBottom: 6 }}>请输入您需要计算的公式描述</div>
            <Input.TextArea
              value={aiFormulaInput}
              onChange={e => setAiFormulaInput(e.target.value)}
              placeholder="例如：计算肌酐清除率、计算BMI指数、钠离子浓度公式..."
              rows={3}
              autoFocus
              disabled={aiFormulaGenerating}
            />
          </div>
          {/* 生成结果 */}
          {aiFormulaResult && (
            <div style={{ padding: 14, background: '#f6ffed', border: '1px solid #b7eb8f', borderRadius: 8 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#2b3034', marginBottom: 8 }}>{aiFormulaResult.name}</div>
              <div style={{ fontFamily: "'Times New Roman', serif", fontStyle: 'italic', fontSize: 15, color: '#177DDC', marginBottom: 8 }}>
                {aiFormulaResult.formula}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {Object.entries(aiFormulaResult.vars).map(([k, v]) => (
                  <span key={k} style={{ fontSize: 12, padding: '2px 8px', background: '#fff', borderRadius: 4, border: '1px solid #d9d9d9', fontFamily: "'Times New Roman', serif", fontStyle: 'italic' }}>
                    {k}: {v}
                  </span>
                ))}
              </div>
            </div>
          )}
          {aiFormulaGenerating && (
            <div style={{ textAlign: 'center', padding: 24, color: '#8c8c8c' }}>
              <SyncOutlined spin style={{ fontSize: 20, marginRight: 8, color: '#177DDC' }} />
              正在生成公式...
            </div>
          )}
          {/* 没有结果时的提示 */}
          {!aiFormulaResult && !aiFormulaGenerating && aiFormulaInput.trim() && (
            <div style={{ textAlign: 'center', padding: 16, color: '#8c8c8c', fontSize: 13 }}>
              点击"生成公式"开始 AI 智能生成
            </div>
          )}
          {/* 底部按钮 */}
          <div style={{ display: 'flex', gap: 8, paddingTop: 8, borderTop: '1px solid #f0f0f0' }}>
            {aiFormulaResult ? (
              <>
                <Button icon={<SyncOutlined />} onClick={generateAiFormula} loading={aiFormulaGenerating}>重新生成</Button>
                <Button type="primary" onClick={confirmAiFormula} disabled={aiFormulaGenerating}>确认使用</Button>
              </>
            ) : (
              <Button type="primary" icon={<RobotOutlined />} onClick={generateAiFormula} loading={aiFormulaGenerating} disabled={!aiFormulaInput.trim() || aiFormulaGenerating} block>
                生成公式
              </Button>
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}