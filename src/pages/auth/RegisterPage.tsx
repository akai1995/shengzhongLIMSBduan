import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'

export default function RegisterPage() {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [idType, setIdType] = useState('idcard')
  const [idNumber, setIdNumber] = useState('')
  const [advisor, setAdvisor] = useState('')
  const [previewUrl, setPreviewUrl] = useState('')
  const [ocrResult, setOcrResult] = useState<{ name: string; idNumber: string } | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
    // 模拟OCR识别
    setTimeout(() => {
      setOcrResult({ name: name || '张三', idNumber: idNumber || '530102199001010012' })
    }, 800)
  }

  const handleNext = () => {
    if (!name || !phone || !idNumber || !advisor) return
    navigate('/consent', {
      state: {
        name,
        idType: idType === 'idcard' ? '身份证' : '学生证',
        idNumber,
        phone,
        advisor,
      },
    })
  }

  const advisors = [
    { value: 'zhang', label: '张教授 - 肿瘤分子生物学' },
    { value: 'li', label: '李教授 - 临床检验诊断学' },
    { value: 'wang', label: '王教授 - 病理学' },
    { value: 'chen', label: '陈教授 - 免疫学' },
    { value: 'liu', label: '刘教授 - 生物化学' },
  ]

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
        width: 560,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
        padding: '36px 40px',
      }}>
        {/* 标题 */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 14, color: '#8C8C8C', marginBottom: 4 }}>云南省肿瘤医院</div>
          <div style={{ fontSize: 20, fontWeight: 600, color: '#262626' }}>用户注册</div>
        </div>

        {/* 姓名 + 手机号 */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#595959', marginBottom: 6 }}>姓名</div>
            <input
              type="text"
              placeholder="请输入真实姓名"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{
                width: '100%', height: 40, padding: '0 12px', fontSize: 14,
                border: '1px solid #D9D9D9', borderRadius: 6, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#595959', marginBottom: 6 }}>手机号</div>
            <input
              type="tel"
              placeholder="请输入手机号"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              style={{
                width: '100%', height: 40, padding: '0 12px', fontSize: 14,
                border: '1px solid #D9D9D9', borderRadius: 6, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* 证件类型 + 证件号码 */}
        <div style={{ display: 'flex', gap: 16, marginBottom: 16 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#595959', marginBottom: 6 }}>证件类型</div>
            <div style={{ display: 'flex', gap: 16, height: 40, alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
                <input
                  type="radio"
                  name="idType"
                  value="idcard"
                  checked={idType === 'idcard'}
                  onChange={() => setIdType('idcard')}
                  style={{ accentColor: '#177DDC' }}
                />
                身份证
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 14 }}>
                <input
                  type="radio"
                  name="idType"
                  value="studentcard"
                  checked={idType === 'studentcard'}
                  onChange={() => setIdType('studentcard')}
                  style={{ accentColor: '#177DDC' }}
                />
                学生证
              </label>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, color: '#595959', marginBottom: 6 }}>证件号码</div>
            <input
              type="text"
              placeholder="请输入证件号码"
              value={idNumber}
              onChange={(e) => setIdNumber(e.target.value)}
              style={{
                width: '100%', height: 40, padding: '0 12px', fontSize: 14,
                border: '1px solid #D9D9D9', borderRadius: 6, outline: 'none', boxSizing: 'border-box',
              }}
            />
          </div>
        </div>

        {/* 上传证件照片 */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 13, color: '#595959', marginBottom: 6 }}>
            上传证件照片 <span style={{
              fontSize: 11, color: '#177DDC', backgroundColor: '#E7F2FB',
              padding: '1px 6px', borderRadius: 3, marginLeft: 6,
            }}>OCR识别</span>
          </div>
          <div
            onClick={() => fileInputRef.current?.click()}
            style={{
              height: 100,
              border: '1px dashed #D9D9D9',
              borderRadius: 8,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              backgroundColor: '#FAFAFA',
              overflow: 'hidden',
            }}
          >
            {previewUrl ? (
              <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                <img src={previewUrl} alt="证件预览" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <span
                  onClick={(e) => { e.stopPropagation(); setPreviewUrl(''); setOcrResult(null) }}
                  style={{
                    position: 'absolute', top: 6, right: 6,
                    width: 20, height: 20, borderRadius: '50%',
                    backgroundColor: 'rgba(0,0,0,0.5)', color: '#FFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, cursor: 'pointer',
                  }}
                >✕</span>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 24, marginBottom: 4 }}>📤</div>
                <div style={{ fontSize: 13, color: '#8C8C8C' }}>点击或拖拽上传证件照片</div>
                <div style={{ fontSize: 11, color: '#B2B2B2' }}>支持 JPG、PNG 格式</div>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {ocrResult && (
            <div style={{
              marginTop: 10, padding: 12, backgroundColor: '#F7F8FA',
              borderRadius: 8, border: '1px solid #EBEDF0',
            }}>
              <div style={{ fontSize: 13, fontWeight: 500, color: '#262626', marginBottom: 8 }}>OCR 识别结果</div>
              <div style={{ display: 'flex', gap: 24, fontSize: 13 }}>
                <div>
                  <span style={{ color: '#8C8C8C' }}>姓名：</span>
                  <span style={{ color: '#262626' }}>{ocrResult.name}</span>
                  <span style={{ color: '#49AA19', marginLeft: 6, fontSize: 12 }}>✓ 匹配</span>
                </div>
                <div>
                  <span style={{ color: '#8C8C8C' }}>证件号：</span>
                  <span style={{ color: '#262626' }}>{ocrResult.idNumber}</span>
                  <span style={{ color: '#49AA19', marginLeft: 6, fontSize: 12 }}>✓ 匹配</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 选择导师 */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, color: '#595959', marginBottom: 6 }}>选择导师</div>
          <select
            value={advisor}
            onChange={(e) => setAdvisor(e.target.value)}
            style={{
              width: '100%', height: 40, padding: '0 12px', fontSize: 14,
              border: '1px solid #D9D9D9', borderRadius: 6, outline: 'none',
              backgroundColor: '#FFFFFF', boxSizing: 'border-box',
            }}
          >
            <option value="">请选择导师</option>
            {advisors.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>

        {/* 按钮 */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => navigate('/login')}
            style={{
              flex: 1, height: 40, fontSize: 14,
              borderRadius: 6, border: '1px solid #D9D9D9',
              backgroundColor: '#FFFFFF', color: '#595959', cursor: 'pointer',
            }}
          >
            返回登录
          </button>
          <button
            onClick={handleNext}
            style={{
              flex: 1, height: 40, fontSize: 14, fontWeight: 500,
              borderRadius: 6, border: 'none',
              backgroundColor: '#177DDC', color: '#FFFFFF', cursor: 'pointer',
            }}
          >
            下一步
          </button>
        </div>
      </div>
    </div>
  )
}