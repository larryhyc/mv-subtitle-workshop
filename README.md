# 音乐MV字幕添加工具

这是一个基于Next.js开发的音乐MV字幕添加工具，可以自动将LRC字幕文件嵌入到音乐MV视频中。

## 功能特点

- 🎵 支持多种视频格式（MP4、AVI、MOV、MKV）
- 📝 支持标准LRC字幕文件格式

## 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **样式**: Tailwind CSS, Radix UI
- **状态管理**: Zustand
- **视频处理**: FFmpeg (fluent-ffmpeg)
- **文件上传**: React Dropzone

## 快速开始

### 安装依赖

```bash
pnpm install
# 或者
npm install
```

### 启动开发服务器

```bash
pnpm dev
# 或者
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 使用方法

1. **上传视频文件**: 拖拽或点击上传你的音乐MV视频文件
2. **上传LRC字幕**: 拖拽或点击上传对应的LRC字幕文件
3. **生成视频**: 点击"生成带字幕的视频"按钮开始处理
4. **下载结果**: 处理完成后预览并下载带字幕的视频

## LRC文件格式

LRC文件是标准的歌词文件格式，每行包含时间标签和歌词内容：

```
[00:00.50]这是第一句歌词
[00:03.20]这是第二句歌词
[00:06.80]这是第三句歌词
```

### 时间格式说明

- `[mm:ss.xx]` - 分钟:秒.百分秒
- `[m:ss.xx]` - 分钟:秒.百分秒（支持单位数分钟）
- `[mm:ss]` - 分钟:秒（不带毫秒）

## 字幕样式

生成的字幕具有以下特点：
- 字体：微软雅黑
- 字号：24px
- 颜色：白色
- 描边：黑色，2px
- 阴影：黑色，1px
- 位置：视频底部中央
- 背景：半透明黑色

## 系统要求

- Node.js 18+ 
- FFmpeg（用于视频处理）

### 安装FFmpeg

**Windows:**
```bash
# 使用Chocolatey
choco install ffmpeg

# 或下载并添加到PATH
# https://ffmpeg.org/download.html
```

**macOS:**
```bash
brew install ffmpeg
```

**Linux:**
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install ffmpeg

# CentOS/RHEL
sudo yum install ffmpeg
```

## 项目结构

```
mv-subtitle-workshop/
├── app/                    # Next.js App Router
│   ├── (app)/             # 应用页面
│   └── api/               # API路由
├── components/            # React组件
│   ├── ui/               # UI基础组件
│   ├── FileUpload.tsx    # 文件上传组件
│   ├── VideoEditor.tsx   # 视频编辑器
│   └── UsageGuide.tsx    # 使用说明
├── store/                # 状态管理
└── public/               # 静态资源
```

## API接口

### POST /api/embed-subtitle

处理视频和字幕文件，返回带字幕的视频。

**请求体:**
```json
{
  "videoFile": "blob:http://localhost:3000/...",
  "subtitleFile": "[00:00.50]歌词内容..."
}
```

**响应:**
- 成功：返回视频文件的二进制数据
- 失败：返回错误信息

## 部署

### Vercel部署

1. 将代码推送到GitHub
2. 在Vercel中导入项目
3. 确保安装了FFmpeg依赖

### 自托管

1. 构建项目：
```bash
pnpm build
```

2. 启动生产服务器：
```bash
pnpm start
```

## 注意事项

- 视频文件大小建议不超过100MB
- 处理时间取决于视频长度和复杂度
- 确保LRC文件的时间格式正确
- 临时文件会在处理完成后自动清理

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 许可证

MIT License
