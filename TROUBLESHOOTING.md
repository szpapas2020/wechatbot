# 微信网页版登录问题说明

## 扫码后出现大量 WARN/ERR 日志

扫码后你可能会看到类似以下的日志：

```
10:20:00 WARN PuppetWeChatBridge proxyWechaty() noWechaty exception: Error: Execution context was destroyed, most likely because of a navigation.
10:20:00 ERR PuppetWeChatBridge getUserName() exception: Execution context was destroyed, most likely because of a navigation.
10:20:02 WARN PuppetWeChatBridge proxyWechaty() noWechaty exception: Error: there is no WechatyBro in browser(yet)
10:20:02 ERR PuppetWeChatBridge getUserName() exception: there is no WechatyBro in browser(yet)
```

### 这是正常现象！

这些警告和错误是**正常的登录过程**，不是程序出错了。

**原因**：
1. 扫码确认后，微信网页版会进行页面跳转
2. 页面跳转会销毁旧的浏览器上下文（Execution context）
3. Puppet 需要重新初始化与浏览器的连接
4. 这个过程大约需要 20-30 秒

### 解决方法

**只需要等待！**

1. 扫码确认登录后，保持耐心等待
2. 大约 30 秒后，程序会自动恢复连接
3. 如果看到 `✅ 机器人登录成功` 就说明已经成功了

### 如果等待超过 1 分钟仍未成功

可能是以下原因：

1. **网络问题**：无法访问 wx.qq.com
   - 检查网络连接
   - 尝试使用 VPN

2. **浏览器加载慢**（Windows 常见）
   - 修改 `index.js` 中的 `head: false` 为 `head: true`
   - 查看浏览器加载情况

3. **微信网页版限制**
   - 新注册的微信账号可能无法使用网页版
   - 建议使用 Android ADB 模式：`npm run start:adb`

### 推荐方案

由于微信网页版已被官方限制，**强烈建议使用 Android ADB 模式**：

```bash
npm run start:adb
```

这种方式：
- ✅ 更稳定
- ✅ 不受微信网页版限制影响
- ✅ 使用真实微信客户端
- ❌ 需要 Android 手机和 USB 连接
