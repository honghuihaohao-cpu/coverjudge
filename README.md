# CoverJudge — AI 封面裁判

上传 2-4 张候选封面，AI 模拟真实用户在推荐流中 0.3 秒的注意力分配，预测每张封面的点击率。分 B 站、抖音、视频号三个平台独立评分。

## 快速开始

```bash
git clone https://github.com/honghuihaohao-cpu/coverjudge.git
cd coverjudge
npm install
echo 'ANTHROPIC_API_KEY="sk-ant-..."' > .env
npm run dev
```

打开 http://localhost:3000，上传封面对比。

## 功能

- 拖拽上传 2-4 张候选封面
- Claude Vision API 分析封面 CTR 潜力
- B 站 / 抖音 / 视频号三平台独立评分
- 柱状图 + 雷达图可视化对比
- 每张封面的优点/缺点分析

## 协议

MIT
