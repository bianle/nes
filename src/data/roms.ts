export interface RomEntry {
  id: string
  title: string
  /**
   * 封面图地址：本站相对路径（如 `/covers/a.png`）或完整网络地址（`https://...`）均可。
   */
  cover: string
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
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/1_Super_Mario_Bros_W_E_FDS_686c65e139.png',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/Super_Mario_Bros_World_fd4079458a.nes',
  },
  {
    id: '2',
    title: '快打旋风',
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/1_2_1c234f64b4.jpg',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_13fa26ab32.nes',
  },
  {
    id: '3',
    title: '一二功夫',
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/1_7c2bb6e10f.jpg',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_5d041d510a.nes',
  },
  {
    id: '4',
    title: '炸弹人',
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/1_Bomberman_J_FDS_310c88b599.png',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_43892d0835.nes',
  },
  {
    id: '5',
    title: '古巴战士',
    cover: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/3_e83410eb63.jpg',
    romUrl: 'https://nexus-alioss.oss-cn-beijing.aliyuncs.com/_57a596daea.nes',
  },
]

export function getRomById(id: string): RomEntry | undefined {
  return roms.find((r) => r.id === id)
}
