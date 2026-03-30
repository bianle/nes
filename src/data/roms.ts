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

import romsData from './roms.json'

/**
 * 在此维护游戏库。
 * - 本地：把文件放到 `public/`，用 `/roms/xxx.nes`、`/covers/xxx.png` 引用。
 * - 网络：封面与 ROM 都可写完整 URL；ROM 跨域时请确认对方站点允许你的页面所在源访问。
 */
export const roms: RomEntry[] = romsData

export function getRomById(id: string): RomEntry | undefined {
  return roms.find((r) => r.id === id)
}
