# 微信消息转发机器人

一个简单易用的微信消息转发机器人，可以将一个微信群的消息自动转发到另一个微信群。

## 两种运行模式

### 1. 网页版模式 (默认)
使用微信网页版协议，需要扫码登录。

**优点**：简单，无需手机连接
**缺点**：微信网页版已被官方限制，可能不稳定

### 2. Android ADB 模式 (推荐)
使用真实 Android 手机通过 USB 调试运行。

**优点**：稳定，使用真实微信客户端
**缺点**：需要 Android 手机和 USB 连接

## 功能特性

- 🔄 自动转发群消息
- 📝 支持文本、图片、视频、语音、文件、链接等多种消息类型
- ⚙️ 灵活的配置选项
- 🎯 可选择性转发特定类型的消息
- 📝 支持添加转发前缀

## 安装

1. 确保已安装 Node.js (建议 v16+)

2. 安装依赖：
```bash
npm install
```

3. 配置机器人：
```bash
# 复制配置文件模板
cp config.example.json config.json

# 编辑 config.json，填入源群和目标群名称
```

## Android ADB 模式设置（推荐）

1. **准备 Android 手机**：
   - 开启"开发者选项"
   - 开启"USB 调试"
   - 用 USB 线连接到电脑

2. **安装 ADB 工具**：
   ```bash
   # Windows: 下载 Android Platform Tools
   # Mac: brew install android-platform-tools
   # Linux: sudo apt install adb
   ```

3. **验证连接**：
   ```bash
   adb devices
   # 应该显示你的设备
   ```

4. **启动 ADB 模式**：
   ```bash
   npm run start:adb
   ```

## 配置说明

编辑 `config.json` 文件：

```json
{
  "source": {
    "type": "room",
    "name": "源群名称"  // 要监控的群名称（支持部分匹配）
  },
  "target": {
    "type": "room",
    "name": "目标群名称"  // 转发消息到的群名称
  },
  "forwardText": true,     // 是否转发文本消息
  "forwardImage": true,    // 是否转发图片
  "forwardVideo": true,    // 是否转发视频
  "forwardAudio": true,    // 是否转发语音
  "forwardFile": true,     // 是否转发文件
  "forwardUrl": true,      // 是否转发链接
  "prefix": "",            // 转发消息前缀（可选）
  "mentionAll": false      // 是否在转发后提示所有人
}
```

## 使用方法

1. 启动机器人：
```bash
npm start
```

2. 扫描二维码登录微信

3. 机器人会自动开始转发消息

## 注意事项

⚠️ **重要提示**：

1. 微信有频率限制，短时间内大量转发可能导致账号受限
2. 建议在转发消息间适当延迟（可自行修改代码添加）
3. 请遵守微信使用规范，不要用于垃圾营销
4. 首次使用建议小规模测试
5. 确保机器人账号已加入源群和目标群

## 获取群名称

**最简单的方法**：

1. 启动机器人并扫码登录
2. 登录成功后，控制台会自动列出所有群聊
3. 直接复制群名称到 config.json

**手动方法**：

如果需要手动获取，可以在群里发送消息，机器人会显示完整的群名称。

## 故障排查

1. **找不到目标群**：确保群名称正确，机器人账号已在群内
2. **消息不转发**：检查源群名称配置是否正确
3. **登录失败**：重新扫描二维码登录

## 开发模式

```bash
npm run dev
```

使用 nodemon 监听文件变化，自动重启。

## 许可证

MIT
