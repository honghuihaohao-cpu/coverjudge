"use client";

import { useState, useCallback, useRef } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Zap, Upload, Loader2, Trophy, AlertCircle, Check, X } from "lucide-react";
import type { CoverResult, Platform } from "@/lib/judge";

const platformNames: Record<Platform, string> = { bilibili: "B站", douyin: "抖音", wechat: "视频号" };
const platformColors: Record<Platform, string> = { bilibili: "#00a1d6", douyin: "#ff0044", wechat: "#07c160" };

export default function HomePage() {
  const [files, setFiles] = useState<(File & { preview: string })[]>([]);
  const [platform, setPlatform] = useState<Platform>("bilibili");
  const [analyzing, setAnalyzing] = useState(false);
  const [results, setResults] = useState<CoverResult[] | null>(null);
  const [error, setError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const accepted = Array.from(e.target.files || []);
    if (accepted.length + files.length > 4) { setError("最多上传 4 张封面对比"); return; }
    setError("");
    setFiles((prev) => [...prev, ...accepted.map((f) => Object.assign(f, { preview: URL.createObjectURL(f) }))]);
    if (e.target) e.target.value = "";
  }

  async function handleAnalyze() {
    if (files.length < 2) { setError("至少上传 2 张封面对比"); return; }
    setAnalyzing(true); setError(""); setResults(null);

    const images = await Promise.all(files.map(async (f) => {
      const buf = await f.arrayBuffer();
      return { base64: Buffer.from(buf).toString("base64"), filename: f.name };
    }));

    try {
      const res = await fetch("/api/analyze", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ images, platform }) });
      const data = await res.json();
      if (data.error) { setError(data.error); } else { setResults(data); }
    } catch { setError("分析失败，请检查 API Key"); }
    setAnalyzing(false);
  }

  const chartData = results?.map((r) => ({ name: r.filename.slice(0, 15), B站: r.scores.bilibili, 抖音: r.scores.douyin, 视频号: r.scores.wechat, 综合: r.overallCTR })) || [];
  const winner = results?.[0];

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white dark:bg-zinc-900">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-zinc-900 dark:bg-white"><Zap className="h-4 w-4 text-white dark:text-zinc-900" /></div>
            <span className="font-semibold">CoverJudge</span>
          </div>
          <span className="text-xs text-muted-foreground">AI 封面 CTR 预测器</span>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 lg:p-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-2xl lg:text-3xl font-bold">AI 封面裁判</h1>
          <p className="text-muted-foreground">上传 2-4 张候选封面，AI 模拟推荐流 0.3 秒注意力分配，预测点击率。分平台独立评分。</p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div onClick={() => fileInputRef.current?.click()} className="rounded-xl border-2 border-dashed p-8 text-center cursor-pointer border-zinc-300 hover:border-zinc-400 transition-colors">
            <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" multiple onChange={handleFileChange} className="hidden" />
            <Upload className="h-8 w-8 mx-auto text-zinc-400 mb-2" />
            <p className="text-sm font-medium">点击此处上传封面</p>
            <p className="text-xs text-muted-foreground mt-1">PNG / JPG / WebP，单张 &lt;10MB，2-4 张</p>
          </div>

          <div className="flex flex-col justify-center gap-3">
            <div>
              <label className="text-sm font-medium">目标平台</label>
              <div className="flex gap-2 mt-1">
                {(["bilibili", "douyin", "wechat"] as Platform[]).map((p) => (
                  <button key={p} onClick={() => setPlatform(p)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${platform === p ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900" : "bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200"}`}>{platformNames[p]}</button>
                ))}
              </div>
            </div>
            <button onClick={handleAnalyze} disabled={analyzing || files.length < 2} className="w-full py-3 rounded-lg bg-zinc-900 text-white dark:bg-white dark:text-zinc-900 font-medium disabled:opacity-40 transition-opacity flex items-center justify-center gap-2">
              {analyzing ? <><Loader2 className="h-4 w-4 animate-spin" /> AI 分析中...</> : <><Zap className="h-4 w-4" /> 开始分析 ({files.length} 张)</>}
            </button>
          </div>
        </div>

        {/* Previews */}
        {files.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {files.map((f, i) => (
              <div key={f.name} className="relative group rounded-lg overflow-hidden border">
                <img src={f.preview} alt={f.name} className="w-full aspect-video object-cover" />
                <button onClick={() => { URL.revokeObjectURL(f.preview); setFiles(files.filter((_, j) => j !== i)); }} className="absolute top-1 right-1 h-6 w-6 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100"><X className="h-3 w-3" /></button>
                <p className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-xs px-2 py-1 truncate">{f.name}</p>
              </div>
            ))}
          </div>
        )}

        {error && <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300 text-sm"><AlertCircle className="h-4 w-4" />{error}</div>}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {winner && (
              <div className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-950 dark:to-yellow-950 border border-amber-200 p-6 flex items-center gap-4">
                <Trophy className="h-10 w-10 text-amber-500 shrink-0" />
                <div>
                  <p className="text-sm text-amber-600 font-medium">最佳封面</p>
                  <p className="text-xl font-bold">{winner.filename}</p>
                  <p className="text-sm text-muted-foreground">综合 CTR 预测 {winner.overallCTR}/100</p>
                </div>
              </div>
            )}

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {results.map((r, i) => (
                <div key={r.filename} className={`rounded-xl border p-4 space-y-3 ${i === 0 ? "ring-2 ring-amber-400" : ""}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-muted-foreground truncate">{r.filename}</span>
                    <span className={`text-sm font-bold ${i === 0 ? "text-amber-500" : ""}`}>#{i + 1}</span>
                  </div>
                  <div className="space-y-1">
                    {(["bilibili", "douyin", "wechat"] as Platform[]).map((p) => (
                      <div key={p} className="flex items-center justify-between text-xs">
                        <span style={{ color: platformColors[p] }}>{platformNames[p]}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800"><div className="h-full rounded-full" style={{ width: `${r.scores[p] || 0}%`, backgroundColor: platformColors[p] }} /></div>
                          <span className="font-mono">{r.scores[p] || "?"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="text-xs text-muted-foreground space-y-1">
                    {r.strengths.slice(0, 2).map((s, j) => <p key={j} className="flex items-start gap-1"><Check className="h-3 w-3 text-green-500 mt-0.5 shrink-0" />{s}</p>)}
                    {r.weaknesses.slice(0, 1).map((w, j) => <p key={j} className="flex items-start gap-1"><X className="h-3 w-3 text-red-400 mt-0.5 shrink-0" />{w}</p>)}
                  </div>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-xl border p-4">
                <h3 className="text-sm font-semibold mb-3">分平台 CTR 预测</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 11 }} /><Tooltip /><Legend /><Bar dataKey="B站" fill="#00a1d6" radius={[3, 3, 0, 0]} /><Bar dataKey="抖音" fill="#ff0044" radius={[3, 3, 0, 0]} /><Bar dataKey="视频号" fill="#07c160" radius={[3, 3, 0, 0]} /></BarChart>
                </ResponsiveContainer>
              </div>
              <div className="rounded-xl border p-4">
                <h3 className="text-sm font-semibold mb-3">综合竞争力雷达图</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <RadarChart data={chartData}><PolarGrid /><PolarAngleAxis dataKey="name" tick={{ fontSize: 11 }} /><PolarRadiusAxis domain={[0, 100]} /><Radar name="综合" dataKey="综合" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.2} /></RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
