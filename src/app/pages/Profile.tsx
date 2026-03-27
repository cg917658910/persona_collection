import { ChevronRight, Clock, Heart, Music2, PencilLine } from 'lucide-react'
import { motion } from 'motion/react'
import { useNavigate } from 'react-router'
import { useHomeData } from '../services/home'

export function Profile() {
  const navigate = useNavigate()
  const {
    data: { categoryCounts },
  } = useHomeData()

  const stats = [
    { label: '已收录人物', value: String(categoryCounts.characters), icon: Clock },
    { label: '作品', value: String(categoryCounts.works), icon: Music2 },
    { label: '创作者', value: String(categoryCounts.creators), icon: PencilLine },
    { label: '主题集', value: String(categoryCounts.themes), icon: Heart },
  ]

  const menuItems = [
    { label: '我的收藏', desc: '收藏你反复想起的人物', icon: Heart },
    { label: '最近浏览', desc: '继续回到刚刚理解过的人物', icon: Clock },
    { label: '我的评注', desc: '写下你自己的理解', icon: PencilLine },
  ]

  return (
    <div className="min-h-full px-5 py-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="mb-8">
        <h1 className="mb-2 text-2xl" style={{ color: '#D6B36A' }}>
          我的
        </h1>
        <p style={{ color: '#6C7A89' }}>你的人物收藏册，也是一份不断生长的理解记录。</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} className="mb-6 rounded-3xl p-6" style={{ background: '#1A1D23' }}>
        <div className="mb-6 flex items-center gap-4">
          <div
            className="flex h-16 w-16 items-center justify-center rounded-full text-2xl"
            style={{ background: 'linear-gradient(135deg, rgba(214,179,106,0.18) 0%, rgba(108,122,137,0.18) 100%)', color: '#D6B36A' }}
          >
            我
          </div>
          <div>
            <h2 className="mb-1" style={{ color: '#FFFFFF' }}>
              我的人物集
            </h2>
            <p className="text-sm" style={{ color: '#6C7A89' }}>
              把一个个你在意的人，收进自己的阅读与理解里。
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.35, delay: 0.18 + index * 0.06 }}
                className="rounded-2xl p-4 text-center"
                style={{ background: 'rgba(15,17,21,0.45)' }}
              >
                <Icon size={20} style={{ color: '#D6B36A', margin: '0 auto 8px' }} />
                <div className="mb-1 text-2xl" style={{ color: '#FFFFFF' }}>
                  {stat.value}
                </div>
                <div className="text-xs" style={{ color: '#6C7A89' }}>
                  {stat.label}
                </div>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <div className="mb-6 space-y-3">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <motion.button
              key={item.label}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.35, delay: 0.25 + index * 0.06 }}
              className="flex w-full items-center gap-4 rounded-2xl p-4"
              style={{ background: '#1A1D23' }}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: 'rgba(214,179,106,0.08)' }}>
                <Icon size={18} style={{ color: '#D6B36A' }} />
              </div>
              <div className="flex-1 text-left">
                <div className="mb-1 text-sm" style={{ color: '#FFFFFF' }}>
                  {item.label}
                </div>
                <div className="text-xs" style={{ color: '#6C7A89' }}>
                  {item.desc}
                </div>
              </div>
              <ChevronRight size={16} style={{ color: '#6C7A89' }} />
            </motion.button>
          )
        })}
      </div>

      <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.42 }} className="rounded-3xl p-5" style={{ background: '#1A1D23' }}>
        <div className="mb-2 text-sm" style={{ color: '#FFFFFF' }}>
          快速入口
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <button className="rounded-2xl p-4 text-left" style={{ background: 'rgba(15,17,21,0.45)', color: '#E6EAF0' }} onClick={() => navigate('/works')}>
            查看作品
          </button>
          <button className="rounded-2xl p-4 text-left" style={{ background: 'rgba(15,17,21,0.45)', color: '#E6EAF0' }} onClick={() => navigate('/creators')}>
            查看创作者
          </button>
          <button className="rounded-2xl p-4 text-left" style={{ background: 'rgba(15,17,21,0.45)', color: '#E6EAF0' }} onClick={() => navigate('/themes')}>
            查看主题集
          </button>
          <button className="rounded-2xl p-4 text-left" style={{ background: 'rgba(15,17,21,0.45)', color: '#E6EAF0' }} onClick={() => navigate('/discover')}>
            进入发现
          </button>
        </div>
      </motion.div>
    </div>
  )
}
