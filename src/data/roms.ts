export interface RomEntry {
  id: string
  title: string
  /** 列表卡片上的一句话介绍 */
  description: string
  /** 分类或玩法标签，展示为小标签 */
  tags: string[]
  /**
   * 封面图地址：本站相对路径（如 `/covers/a.png`）或完整网络地址（`https://...`）均可。
   * 省略或空字符串时列表与搜索中显示占位图。
   */
  cover?: string
  /**
   * ROM 地址：本站路径或 `https://` 等完整 URL 均可。
   * 若 ROM 在其它域名，该资源需允许跨域（响应头含 CORS，否则浏览器会拦截 XHR）。
   */
  romUrl: string
}

/**
 * 在此维护游戏库。
 * - 本地：把文件放到 `public/`，用 `/roms/xxx.nes`、`/covers/xxx.png` 引用。
 * - 网络：封面与 ROM 都可写完整 URL；ROM 跨域时请确认对方站点允许你的页面所在源访问。
 */
export const roms: RomEntry[] = [
  {
    id: '1',
    title: '超级马里奥兄弟',
    description: '任天堂平台跳跃代表作，顶蘑菇、钻水管，拯救公主的经典旅程。',
    tags: ['平台', '冒险'],
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/1_Super_Mario_Bros_W_E_FDS_686c65e139.png',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/Super_Mario_Bros_World_fd4079458a.nes',
  },
  {
    id: '2',
    title: '快打旋风',
    description: '清版过关动作游戏，三人可选，拳脚连招扫街除恶。',
    tags: ['动作', '单人'],
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/1_2_1c234f64b4.jpg',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_13fa26ab32.nes',
  },
  {
    id: '3',
    title: '一二功夫',
    description: '早期格斗小品，节奏明快，适合热身与怀旧。',
    tags: ['格斗', '单人'],
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/1_7c2bb6e10f.jpg',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_5d041d510a.nes',
  },
  {
    id: '4',
    title: '炸弹人',
    description: '放置炸弹开路、炸敌人与砖块，迷宫里考验走位与时机。',
    tags: ['益智', '单人'],
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/1_Bomberman_J_FDS_310c88b599.png',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_43892d0835.nes',
  },
  {
    id: '5',
    title: '古巴战士',
    description: '俯冲射击闯关，救战友、打坦克，街机移植的火爆手感。',
    tags: ['射击', '双人'],
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/3_e83410eb63.jpg',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_57a596daea.nes',
  },
  {
    id: '6',
    title: '三目童子',
    description: '三目童子，打怪兽，街机移植的火爆手感。',
    tags: ['射击', '单人'],
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/Mitsume_ga_Tooru_J_a7cd3f3e47.png',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_74a1c2b944.nes',
  },
  {
    id: '7',
    title: '坦克大战',
    description: '坦克大战，打坦克，街机移植的火爆手感。',
    tags: ['射击', '双人'],
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/3_1_3_in_1_Battle_City_Unl_987a712e5e.png',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_ec3e65c4f1.nes',
  },
  {
    id: '8',
    title: '松鼠大作战',
    description: '松鼠大作战，打松鼠，街机移植的火爆手感。',
    tags: ['射击', '双人'],
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/1_Chip_to_Dale_no_Daisakusen_J_40251bc39a.png',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/1_0be53246c9.nes',
  },
  {
    id: '9',
    title: '松鼠大作战2',
    description: '松鼠大作战2，打松鼠，街机移植的火爆手感。',
    tags: ['射击', '双人'],
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/2_Chip_to_Dale_no_Daisakusen_2_J_c13ecc5727.png',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/2_1661eda835.nes',
  },
  {
    id: '10',
    title: '超级魂斗罗',
    description: '超级魂斗罗，打魂斗罗，街机移植的火爆手感。',
    tags: ['射击', '双人'],
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/Super_C_U_c6b9029002.png',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_a176e2f4ed.nes',
  },
]

export function getRomById(id: string): RomEntry | undefined {
  return roms.find((r) => r.id === id)
}
