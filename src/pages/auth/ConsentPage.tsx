import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function ConsentPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as { name: string; idType: string; idNumber: string } | null
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [countdown, setCountdown] = useState(10)
  const [canSign, setCanSign] = useState(false)
  const [hasSignature, setHasSignature] = useState(false)
  const [isDrawing, setIsDrawing] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  // 倒计时
  useEffect(() => {
    if (countdown <= 0) {
      setCanSign(true)
      return
    }
    const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
    return () => clearTimeout(timer)
  }, [countdown])

  // 初始化签名画布
  useEffect(() => {
    if (!canSign || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.strokeStyle = '#262626'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }, [canSign])

  const getCanvasPos = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current
    if (!canvas) return { x: 0, y: 0 }
    const rect = canvas.getBoundingClientRect()
    if ('touches' in e) {
      return { x: e.touches[0].clientX - rect.left, y: e.touches[0].clientY - rect.top }
    }
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  const startDraw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDrawing(true)
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getCanvasPos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    if (!isDrawing) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = getCanvasPos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasSignature(true)
  }

  const stopDraw = () => {
    setIsDrawing(false)
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasSignature(false)
  }

  const handleSubmit = () => {
    if (!hasSignature) return
    setSubmitted(true)
    setTimeout(() => {
      navigate('/login')
    }, 1500)
  }

  const today = new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #f0f5ff 0%, #e8f0fe 50%, #dce8fc 100%)',
      padding: 20,
    }}>
      <div style={{
        width: 620,
        maxHeight: '90vh',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        padding: '32px 36px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 4 }}>云南省肿瘤医院</div>
          <div style={{ fontSize: 18, fontWeight: 600, color: '#262626' }}>系统使用知情同意书</div>
        </div>

        {/* 可滚动内容 */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          fontSize: 13,
          color: '#595959',
          lineHeight: 1.8,
          padding: '0 4px',
          marginBottom: 16,
        }}>
          <h3 style={{ textAlign: 'center', fontSize: 15, marginBottom: 16, color: '#262626' }}>系统使用知情同意书</h3>
          <p>尊敬的用户：</p>
          <p>欢迎使用云南省肿瘤医院实验室信息管理系统（以下简称"本系统"）。在您正式注册并使用本系统之前，请仔细阅读并充分理解本知情同意书的全部内容。</p>

          <h4 style={{ fontSize: 14, marginTop: 16, marginBottom: 8, color: '#262626' }}>一、系统用途</h4>
          <p>本系统为云南省肿瘤医院实验室信息管理专用平台，主要用于实验室样本管理、检测数据录入、质控管理、报告生成等科研与临床辅助工作。本系统仅限授权人员使用，不得用于任何非授权用途。</p>

          <h4 style={{ fontSize: 14, marginTop: 16, marginBottom: 8, color: '#262626' }}>二、数据保密与隐私保护</h4>
          <p>1. 您在系统中录入、上传、查看的所有数据（包括但不限于患者信息、样本数据、检测结果、影像资料等）均属于医院保密信息。</p>
          <p>2. 您承诺严格遵守《中华人民共和国个人信息保护法》《医疗机构病历管理规定》等相关法律法规，不得泄露、传播、篡改或滥用系统数据。</p>
          <p>3. 您的账号仅限本人使用，不得转借、共享或委托他人使用。因账号保管不当导致的数据泄露，由账号持有人承担相应责任。</p>

          <h4 style={{ fontSize: 14, marginTop: 16, marginBottom: 8, color: '#262626' }}>三、使用规范</h4>
          <p>1. 您应按照系统操作规范正确录入数据，确保数据的真实性、完整性和准确性。</p>
          <p>2. 不得利用本系统从事任何违法违规活动，不得上传含有病毒、恶意代码的文件。</p>
          <p>3. 发现系统异常或数据错误时，应及时向系统管理员报告。</p>
          <p>4. 您的操作记录将被系统完整记录并存档，作为审计追溯的依据。</p>

          <h4 style={{ fontSize: 14, marginTop: 16, marginBottom: 8, color: '#262626' }}>四、知识产权</h4>
          <p>本系统的软件著作权、界面设计、数据库结构等知识产权归云南省肿瘤医院及系统开发方所有。未经书面许可，不得对本系统进行反向工程、复制或分发。</p>

          <h4 style={{ fontSize: 14, marginTop: 16, marginBottom: 8, color: '#262626' }}>五、免责声明</h4>
          <p>1. 本系统作为辅助工具，其输出结果仅供参考，不构成最终医疗诊断依据。临床决策应以医生综合判断为准。</p>
          <p>2. 因不可抗力（如网络故障、服务器维护等）导致的服务中断，系统管理方不承担赔偿责任，但将尽快恢复服务。</p>

          <h4 style={{ fontSize: 14, marginTop: 16, marginBottom: 8, color: '#262626' }}>六、违规处理</h4>
          <p>如违反本同意书相关条款，医院有权暂停或终止您的系统使用权限，并视情节轻重追究相应责任。</p>

          <h4 style={{ fontSize: 14, marginTop: 16, marginBottom: 8, color: '#262626' }}>七、同意声明</h4>
          <p>本人已仔细阅读并充分理解上述全部内容，自愿同意遵守本知情同意书的各项条款，承诺合法、合规、安全地使用本系统。</p>

          {state && (
            <div style={{
              marginTop: 16, padding: 12, backgroundColor: '#F7F8FA',
              borderRadius: 8, border: '1px solid #EBEDF0',
            }}>
              <p style={{ margin: '2px 0' }}>注册人姓名：<strong>{state.name}</strong></p>
              <p style={{ margin: '2px 0' }}>证件类型及号码：<strong>{state.idType} - {state.idNumber}</strong></p>
              <p style={{ margin: '2px 0' }}>注册日期：<strong>{today}</strong></p>
            </div>
          )}
        </div>

        {/* 倒计时 */}
        {!canSign && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#8C8C8C', textAlign: 'center', marginBottom: 6 }}>
              请仔细阅读以上条款，剩余 <span style={{ color: '#177DDC', fontWeight: 600 }}>{countdown}</span> 秒
            </div>
            <div style={{ height: 4, backgroundColor: '#EBEDF0', borderRadius: 2, overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${(10 - countdown) * 10}%`,
                backgroundColor: '#177DDC',
                borderRadius: 2,
                transition: 'width 1s linear',
              }} />
            </div>
          </div>
        )}

        {/* 签名区域 */}
        {canSign && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, color: '#595959', marginBottom: 8, textAlign: 'center' }}>
              请在下方签字区域手写签名
            </div>
            <div style={{
              border: '1px solid #D9D9D9',
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: '#FAFAFA',
            }}>
              <canvas
                ref={canvasRef}
                width={500}
                height={150}
                style={{ width: '100%', height: 150, cursor: 'crosshair' }}
                onMouseDown={startDraw}
                onMouseMove={draw}
                onMouseUp={stopDraw}
                onMouseLeave={stopDraw}
                onTouchStart={startDraw}
                onTouchMove={draw}
                onTouchEnd={stopDraw}
              />
            </div>
            <div style={{ textAlign: 'center', marginTop: 8 }}>
              <button
                onClick={clearSignature}
                style={{
                  fontSize: 13, color: '#177DDC', backgroundColor: 'transparent',
                  border: 'none', cursor: 'pointer',
                }}
              >
                清除重写
              </button>
            </div>
          </div>
        )}

        {/* 提交按钮 */}
        {canSign && (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              onClick={() => navigate('/register')}
              style={{
                flex: 1, height: 40, fontSize: 14,
                borderRadius: 6, border: '1px solid #D9D9D9',
                backgroundColor: '#FFFFFF', color: '#595959', cursor: 'pointer',
              }}
            >
              返回修改
            </button>
            <button
              onClick={handleSubmit}
              disabled={!hasSignature || submitted}
              style={{
                flex: 1, height: 40, fontSize: 14, fontWeight: 500,
                borderRadius: 6, border: 'none',
                backgroundColor: hasSignature && !submitted ? '#177DDC' : '#D9D9D9',
                color: hasSignature && !submitted ? '#FFFFFF' : '#B2B2B2',
                cursor: hasSignature && !submitted ? 'pointer' : 'not-allowed',
              }}
            >
              {submitted ? '提交成功 ✓' : '签字并提交'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}