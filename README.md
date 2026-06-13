limelight-lemonade-jam - 小米手环10移植版

基于 [hezdaaa](https://github.com/hezdaaa) 的 [limelight-lemonade-jam-miband](https://github.com/hezdaaa/limelight-lemonade-jam-miband) 小米手环 9 Pro 源码修改优化，适配小米手环 10

---

## 原作信息

- **原作者**：hezdaaa
- **原项目**：[limelight-lemonade-jam-miband](https://github.com/hezdaaa/limelight-lemonade-jam-miband)
- **原作说明**：limelight 小米手环移植版

---

## 我的修改与优化

### UI 重构
- 针对小米手环10的屏幕尺寸和分辨率重新设计 UI 布局
- 优化文字显示和按钮触控区域

### 新增功能
- **开屏提示弹窗** — 首次启动时显示操作提示
- **场景切换** — 支持「下一场景」「上一场景」
- **章节切换** — 支持「下一章节」「上一章节」
- **快跳转导航** — 支持「下一选择项」「上一选择项」
- **"返回功能**" — 支持「返回上一句」
-返回功能**隐藏模式** — 新增隐藏界面模式
- **"背景自动滚动** — 背景自动左右滚动
- **手动拖动查看** — 支持左右拖动查看背景

### 问题修复
- 修复了若干个在小米手环 9 上的已知兼容性问题

---

## 项目由来

起初我因为好奇下载了小米手环 9 Pro 的 rpk 包，硬把它装在小米手环 9 上，结果发现竟然可以运行！但 UI 明显不兼容，操作体验较差。

于是我花了 2 天时间，针对小米手环 9 /10做了专门的移植适配，优化了界面和交互，让没有 Pro 系列手环的朋友也能玩上这款游戏。

开源出来，供没有 Pro 系列手环的人游玩使用。

---

## 安装方法

1. 下载本项目的 `.rpk` 文件
2. 通过表盘自定义或 astrobox 等工具安装到手环
3. 安装不上可以多试几次，或者重启看看，由于安装包包体过大导致安装速度较慢，请各位理解
4. 首次启动会有操作提示

---

## 兼容性

|设备|状态|
|------|------|
| 小米手环 9 | ✅ 完美适配 |（https://github.com/skdkzzx/limelight-lemonade-jam-xiaomi-band9）
| 小米手环 10 | ✅ 完美适配 |（https://github.com/skdkzzx/limelight-lemonade-jam-xiaomi-band10）
| 小米手环 9 Pro | ❌ 请使用原版 |
| 其他手环 | 未测试 |

---

## 许可证

原项目未指定开源许可证，本修改版本遵循相同约定。

版权归属原作者 hezdaaa，本修改版本仅供学习交流使用。

---

## 致谢

感谢 [hezdaaa](https://github.com/hezdaaa) 提供的原版源码，让这个项目成为可能。
