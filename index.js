const { WechatyBuilder } = require('wechaty');
const QrcodeTerminal = require('qrcode-terminal');
const fs = require('fs');

// 加载配置
let config;
try {
  config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
} catch (error) {
  console.error('无法读取 config.json，请先复制 config.example.json 为 config.json 并配置');
  process.exit(1);
}

// 初始化机器人
const bot = WechatyBuilder.build({
  name: 'wechat-forwarder-bot',
  puppet: 'wechaty-puppet-wechat',
  puppetOptions: {
    uos: true,  // 使用 UOS 协议，更稳定
  },
});

// 生成二维码登录
bot.on('scan', (qrcode, status) => {
  console.log(`扫描二维码登录: ${status}`);
  QrcodeTerminal.generate(qrcode, { small: true });
});

// 登录成功
bot.on('login', async (user) => {
  console.log(`✅ 机器人登录成功: ${user.name()}`);

  // 列出所有群聊
  console.log('\n📋 正在获取所有群聊列表...\n');
  const roomList = await bot.Room.findAll();

  console.log(`找到 ${roomList.length} 个群聊:\n`);
  console.log('═'.repeat(80));
  console.log('序号'.padEnd(6) + '群名称');
  console.log('─'.repeat(80));

  for (let i = 0; i < roomList.length; i++) {
    const room = roomList[i];
    const topic = await room.topic() || '(未命名群)';
    console.log(`${(i + 1).toString().padEnd(6)}${topic}`);
  }
  console.log('═'.repeat(80));
  console.log('\n💡 提示: 将群名称复制到 config.json 中\n');
});

// 登出
bot.on('logout', (user) => {
  console.log(`👋 机器人登出: ${user.name()}`);
});

// 消息处理
bot.on('message', async (msg) => {
  try {
    const room = msg.room();
    const talker = msg.talker();

    // 检查是否来自源群
    if (!room) return;

    const roomTopic = await room.topic();
    const isFromSource = roomTopic.includes(config.source.name);
    if (!isFromSource) return;

    // 过滤机器人自己的消息
    if (msg.self()) return;

    console.log(`📨 收到来自 [${roomTopic}] 的消息，来自: ${talker.name()}`);

    // 查找目标群 - 使用 topic 而不是 name
    const targetRoom = await bot.Room.find({ topic: config.target.name });
    if (!targetRoom) {
      console.error(`❌ 未找到目标群: ${config.target.name}`);
      return;
    }

    // 构建转发消息
    let forwardMessage = '';
    if (config.prefix) {
      forwardMessage = config.prefix;
    }

    // 获取消息类型
    const type = msg.type();

    switch (type) {
      case bot.Message.Type.Text:
        if (config.forwardText) {
          const text = msg.text();
          forwardMessage += `[${talker.name()}]: ${text}`;
          await targetRoom.say(forwardMessage);
          console.log(`✅ [文本] ${talker.name()}: ${text}`);
        }
        break;

      case bot.Message.Type.Image:
        if (config.forwardImage) {
          const fileBox = await msg.toFileBox();
          forwardMessage += `[${talker.name()}] 发送了一张图片`;
          await targetRoom.say(forwardMessage);
          await targetRoom.say(fileBox);
          console.log(`✅ [图片] ${talker.name()} 发送了一张图片`);
        }
        break;

      case bot.Message.Type.Video:
        if (config.forwardVideo) {
          const fileBox = await msg.toFileBox();
          forwardMessage += `[${talker.name()}] 发送了一个视频`;
          await targetRoom.say(forwardMessage);
          await targetRoom.say(fileBox);
          console.log(`✅ [视频] ${talker.name()} 发送了一个视频`);
        }
        break;

      case bot.Message.Type.Audio:
        if (config.forwardAudio) {
          const fileBox = await msg.toFileBox();
          forwardMessage += `[${talker.name()}] 发送了一条语音`;
          await targetRoom.say(forwardMessage);
          await targetRoom.say(fileBox);
          console.log(`✅ [语音] ${talker.name()} 发送了一条语音`);
        }
        break;

      case bot.Message.Type.Attachment:
        if (config.forwardFile) {
          const fileBox = await msg.toFileBox();
          forwardMessage += `[${talker.name()}] 发送了一个文件: ${fileBox.name}`;
          await targetRoom.say(forwardMessage);
          await targetRoom.say(fileBox);
          console.log(`✅ [文件] ${talker.name()} 发送了文件: ${fileBox.name}`);
        }
        break;

      case bot.Message.Type.Url:
        if (config.forwardUrl) {
          const urlLink = await msg.toUrlLink();
          forwardMessage += `[${talker.name()}] 分享了链接:\n${urlLink.url()}\n${urlLink.title()}`;
          await targetRoom.say(forwardMessage);
          console.log(`✅ [链接] ${talker.name()} 分享了: ${urlLink.title()} - ${urlLink.url()}`);
        }
        break;

      default:
        console.log(`⚠️  未处理的消息类型: ${type}`);
    }

    // 如果需要 @所有人
    if (config.mentionAll) {
      await targetRoom.say('请查看以上转发消息');
    }

  } catch (error) {
    console.error('❌ 处理消息时出错:', error.message);
  }
});

// 启动机器人
bot.start()
  .then(() => {
    console.log('🤖 微信消息转发机器人已启动');
    console.log(`📥 源群: ${config.source.name}`);
    console.log(`📤 目标群: ${config.target.name}`);
  })
  .catch((error) => {
    console.error('❌ 启动机器人失败:', error);
    process.exit(1);
  });

// 优雅退出
process.on('SIGINT', async () => {
  console.log('\n正在停止机器人...');
  await bot.stop();
  process.exit(0);
});
