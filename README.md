# HPM 听书 · Bitrise 云端构建 APK

Bitrise 全程网页操作，不需要本地 Git、不需要电脑命令行。免费层每月 200 次构建。

## 步骤总览

1. 注册 Bitrise → 连 GitHub → 推这个文件夹到 GitHub 空仓库
2. Bitrise 自动发现 `bitrise.yml` 配置文件
3. 触发构建 → 等 8-12 分钟 → Bitrise 网页里直接下载 APK

---

## 详细步骤

### ① 注册 Bitrise

打开 https://app.bitrise.io/sign-up → 用 GitHub 账号登录（**这一步同时授权 Bitrise 读你的仓库**）

### ② 把这个文件夹推到 GitHub

最简单：在 GitHub 网页新建一个空 public 仓库（名字如 `hpm-bitrise`），上传文件夹里**所有内容**（包括 `bitrise.yml`）。

**关键**：`bitrise.yml` 必须在仓库根目录。

### ③ Bitrise 加这个项目

1. Bitrise dashboard → 右上 **+ Add new app**
2. 选 **Private** 或 **Public**
3. 选你刚才的 GitHub 仓库
4. **Branch**: `main`
5. **Project type**: 选 **Other**（不要选 Android / React Native / Cordova）
6. **App icon**: 跳过
7. **Webhook**: 选 **Register** 让它自动注册（之后 push 自动触发）
8. **Stack**: Bitrise 会自动读 `bitrise.yml` 里指定的 `linux-docker-android-22.04`，不用改

### ④ 等构建

第一次 Bitrise 会自动跑一遍 workflow。看 **Builds** 标签页，等绿色 ✅（8-12 分钟）。

### ⑤ 下载 APK

构建详情页 → 滚到底 **Apps & Artifacts** → 找到 `app-debug.apk` → 点击下载 → 传手机安装

后续每次 push 自动触发构建，Bitrise 邮件通知。

---

## 关于本地 TTS

这个 APK 用 Capacitor `@capacitor-community/text-to-speech` 插件，直接调安卓系统的 `TextToSpeech` API（不依赖 WebView 的 `speechSynthesis`）。装好 APK 后点 ▶ 即可听到声音。

如果手机没装中文 TTS 引擎：**设置 → 系统 → 语言 → 文本转语音输出 → 安装语音数据**（一次性，几十 MB）

---

## 文件清单

| 文件 | 作用 |
|---|---|
| `bitrise.yml` | Bitrise 流水线配置（必须在仓库根目录） |
| `package.json` | Capacitor + 原生 TTS 插件依赖 |
| `capacitor.config.json` | App 配置（com.hpm.tingshu） |
| `www/` | 完整网页内容（含 `index.html`、`manifest.webmanifest`、`sw.js`、所有图标） |
| `icons/` | Android 启动器图标（金色 HPM 字标） |

---

## 故障排查

| 现象 | 原因 / 修复 |
|---|---|
| Bitrise 显示 "no bitrise.yml found" | `bitrise.yml` 没放在仓库根目录，或文件名错（必须小写） |
| Build 失败 in "Add Android platform" | 删掉仓库里已有的 `android/` 文件夹 |
| Build 失败 in "android-build" step | 看日志，多半是网络或 SDK 缓存问题，**Rebuild** 一次即可 |
| APK 装上后朗读没声音 | 手机里没装 TTS 引擎，按上文"关于本地 TTS"操作 |
