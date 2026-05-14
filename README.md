# CoverJudge — AI 封面裁判

> 你不知道哪张封面会爆。它知道。

## 一句话

上传 2-4 张候选封面，AI 模拟真实用户在推荐流里 0.3 秒扫过的注意力分配，预测每张封面的点击率——分 B 站、抖音、视频号三个平台给出不同预测。

## 解决的痛点

封面是视频成功的一半。现在创作者选封面全靠直觉——"我觉得这张挺好看的"。但你的直觉 = 一个数据点。CoverJudge = 模拟 1000 个用户的注意力分配。

## 核心功能

| 功能 | 说明 |
|------|------|
| **CTR 预测** | AI 模拟推荐流 0.3 秒扫视，给每张封面打点击率分（0-100） |
| **分平台预测** | B 站（大字优先）、抖音（人脸+表情优先）、视频号（专业感优先）不同审美 |
| **注意力热力图** | 标记封面中哪个区域最先被看到、哪个被忽略 |
| **文字可读性检查** | 检测封面文字在手机小窗预览中是否可读 |
| **对比度评分** | 检测黑暗模式下封面的可见度 |
| **A/B 建议** | 如果两张都接近，建议实际 A/B 测试哪个指标更敏感 |

## 为什么有效

- B 站封面：大字标题 + 干净背景 > 复杂拼贴
- 抖音封面：人脸 + 强情绪表情 > 纯文字
- 视频号封面：专业感 + 适合朋友圈展示 > 娱乐感

不同平台审美完全不同。CoverJudge 针对每个平台单独训练了评估标准。

## 技术栈

| 层 | 技术 |
|----|------|
| 核心 | TypeScript + Node.js |
| AI 视觉 | Claude Vision API（封面分析 + 注意力模拟） |
| 图像处理 | Sharp（尺寸检查/对比度分析/缩略图生成） |
| Web UI | Next.js（可选——拖拽上传 + 实时评分） |

## 快速开始

```bash
git clone https://github.com/honghuihaohao-cpu/coverjudge.git
cd coverjudge
npm install
cp .env.example .env  # 填入 ANTHROPIC_API_KEY

# 比较两张 B 站封面
npx coverjudge cover1.png cover2.png --platform bilibili

# 比较四张抖音封面，输出详细报告
npx coverjudge *.png --platform douyin --detailed
```

## 输出示例

```
╔══════════════════════════════════════╗
║  CoverJudge — 封面 CTR 预测报告      ║
║  平台：B站 | 模式：推荐流             ║
╠══════════════════════════════════════╣
║                                      ║
║  🥇 cover_a.png  CTR: 82/100         ║
║     ✓ 大字标题在左上角，最先被看到     ║
║     ✓ 对比度 94%，黑暗模式清晰        ║
║     ✗ 底部水印轻微分散注意力          ║
║                                      ║
║  🥈 cover_b.png  CTR: 61/100         ║
║     ✓ 人脸表情有冲击力               ║
║     ✗ 文字太小，手机预览几乎不可读    ║
║     ✗ 背景太杂，0.3 秒找不到焦点      ║
║                                      ║
║  💡 建议：用 cover_a，把水印去掉      ║
╚══════════════════════════════════════╝
```

## 项目结构

```
coverjudge/
├── src/
│   ├── index.ts            # CLI 入口
│   ├── judge/
│   │   ├── attention.ts    # 注意力模拟
│   │   ├── contrast.ts     # 对比度分析
│   │   ├── readability.ts  # 文字可读性
│   │   └── platform/       # 平台审美标准
│   │       ├── bilibili.ts
│   │       ├── douyin.ts
│   │       └── wechat.ts
│   └── report/
│       └── formatter.ts
├── .env.example
├── LICENSE
└── README.md
```

## 协议

MIT License
