import { useEffect, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_CONTENT } from '../content/defaults';
import { downloadJson, useContent } from '../content/store';
import type { SiteContent } from '../content/types';

type Tab = 'profile' | 'projects' | 'thoughts' | 'acts' | 'stage' | 'ui';

export default function Admin() {
  const { content, loaded, saveContent, resetContent } = useContent();
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [tab, setTab] = useState<Tab>('profile');
  const [status, setStatus] = useState<{ text: string; ok: boolean } | null>(null);
  const [saving, setSaving] = useState(false);

  // 内容加载完成后初始化草稿（仅一次）
  useEffect(() => {
    if (loaded && !draft) setDraft(structuredClone(content));
  }, [loaded, content, draft]);

  if (!draft) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-abyss">
        <p className="font-mono text-xs uppercase tracking-[0.4em] text-ice/60">正在加载内容…</p>
      </div>
    );
  }

  const patch = (updater: (d: SiteContent) => SiteContent) =>
    setDraft((prev) => (prev ? updater(prev) : prev));

  const onSave = async () => {
    setSaving(true);
    const r = await saveContent(draft);
    setSaving(false);
    setStatus({ text: r.message, ok: r.ok });
    window.setTimeout(() => setStatus(null), 5000);
  };

  const onReset = async () => {
    await resetContent();
    setDraft(structuredClone(DEFAULT_CONTENT));
    setStatus({ text: '已恢复默认内容并删除 content.json', ok: true });
  };

  const onExport = () => {
    downloadJson(draft);
    setStatus({ text: '已导出 content.json', ok: true });
  };

  const tabs: { id: Tab; label: string }[] = [
    { id: 'profile', label: '个人资料' },
    { id: 'projects', label: '作品' },
    { id: 'thoughts', label: '技术文章' },
    { id: 'acts', label: '章节文字' },
    { id: 'stage', label: '3D 舞台' },
    { id: 'ui', label: '界面文案' },
  ];

  return (
    <div className="min-h-screen bg-abyss font-body text-white">
      {/* 氛围背景 */}
      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            'radial-gradient(900px 520px at 80% -5%, rgba(29,58,71,0.35), transparent 62%), radial-gradient(700px 420px at 0% 110%, rgba(8,24,33,0.85), transparent 60%)',
        }}
      />

      <div className="relative mx-auto max-w-6xl px-6 py-10 md:px-10">
        {/* 头部 */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="chapter-label mb-3">内容编辑器 · /admin</p>
            <h1 className="display-title text-3xl md:text-4xl">配置中心</h1>
            <p className="body-copy mt-2 max-w-xl">
              修改文字、图片 / 视频 / 模型地址等内容。保存后写入{' '}
              <code className="font-mono text-ice">public/content.json</code>，全设备生效。
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            {status && (
              <span
                className={`font-mono text-[10px] uppercase tracking-[0.2em] ${
                  status.ok ? 'text-petal/90' : 'text-red-300'
                }`}
              >
                {status.text}
              </span>
            )}
            <Link to="/?act=cover" className="rune-btn">
              <span className="rune-dot" /> 返回空间
            </Link>
            <button type="button" className="rune-btn" onClick={onExport}>
              <span className="rune-dot" /> 导出 JSON
            </button>
            <button type="button" className="rune-btn" onClick={onReset}>
              <span className="rune-dot" /> 恢复默认
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="rune-btn font-bold"
              style={{ textShadow: '0 0 14px rgba(238,220,231,0.4)' }}
            >
              <span className="rune-dot h-3 w-3" /> {saving ? '保存中…' : '保存'}
            </button>
          </div>
        </header>

        {/* 左侧导航 + 右侧表单 */}
        <div className="flex flex-col gap-10 md:flex-row">
          <nav className="flex shrink-0 flex-row flex-wrap gap-2 md:w-44 md:flex-col" aria-label="编辑分区">
            {tabs.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                aria-current={tab === t.id ? 'true' : undefined}
                className={`border-b py-2 pr-6 text-left font-mono text-[11px] uppercase tracking-[0.25em] transition-colors ${
                  tab === t.id ? 'border-petal/60 text-petal' : 'border-transparent text-ice/50 hover:text-ice'
                }`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          <div className="min-w-0 flex-1">
            {tab === 'profile' && <ProfileForm d={draft} patch={patch} />}
            {tab === 'projects' && <ProjectsForm d={draft} patch={patch} />}
            {tab === 'thoughts' && <ThoughtsForm d={draft} patch={patch} />}
            {tab === 'acts' && <ActsForm d={draft} patch={patch} />}
            {tab === 'stage' && <StageForm d={draft} patch={patch} />}
            {tab === 'ui' && <UiForm d={draft} patch={patch} />}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============ 通用字段组件 ============ */

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[10px] uppercase tracking-[0.25em] text-ice/70">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[11px] text-mist/80">{hint}</span>}
    </label>
  );
}

const inputCls =
  'w-full border-b border-ice/15 bg-transparent px-1 py-2 text-[14px] text-white placeholder:text-ice/25 focus:border-petal focus:outline-none';

function TextInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return <input className={inputCls} value={value} placeholder={placeholder} onChange={(e) => onChange(e.target.value)} />;
}

function TextArea({ value, onChange, rows = 4 }: { value: string; onChange: (v: string) => void; rows?: number }) {
  return <textarea className={`${inputCls} resize-y leading-relaxed`} value={value} rows={rows} onChange={(e) => onChange(e.target.value)} />;
}

function TagInput({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  const [text, setText] = useState('');
  const add = () => {
    const t = text.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setText('');
  };
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {value.map((t, i) => (
          <span key={t + i} className="flex items-center gap-2 border border-ice/15 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.15em] text-petal/80">
            {t}
            <button type="button" className="text-ice/40 hover:text-petal" onClick={() => onChange(value.filter((_, j) => j !== i))} aria-label={`删除 ${t}`}>
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="mt-2 flex gap-2">
        <input className={inputCls} value={text} placeholder="输入后回车添加" onChange={(e) => setText(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }} />
        <button type="button" className="rune-btn shrink-0" onClick={add}><span className="rune-dot" /> 添加</button>
      </div>
    </div>
  );
}

function MediaField({ value, onChange, kind, hint }: { value: string; onChange: (v: string) => void; kind: 'image' | 'video' | 'model'; hint?: string }) {
  const isMedia = /\.(png|jpe?g|webp|gif|svg|mp4|webm|glb|gltf)(\?|$)/i.test(value);
  return (
    <div>
      <TextInput value={value} onChange={onChange} placeholder={`${kind} URL`} />
      {kind !== 'model' && isMedia && (
        <div className="mt-3 overflow-hidden rounded-lg border border-ice/10" style={{ aspectRatio: '16 / 9', maxWidth: 360, background: '#0a121b' }}>
          {kind === 'image' ? (
            <img src={value} alt="预览" loading="lazy" className="h-full w-full object-cover" />
          ) : (
            <video src={value} muted loop playsInline className="h-full w-full object-cover" controls />
          )}
        </div>
      )}
      {hint && <span className="mt-1 block text-[11px] text-mist/80">{hint}</span>}
    </div>
  );
}

function JsonField({ value, onChange, rows = 8 }: { value: unknown; onChange: (v: unknown) => void; rows?: number }) {
  const [text, setText] = useState(() => JSON.stringify(value, null, 2));
  const [err, setErr] = useState(false);
  useEffect(() => {
    setText(JSON.stringify(value, null, 2));
  }, [value]);
  return (
    <div>
      <textarea
        className={`${inputCls} resize-y font-mono text-[12px] leading-relaxed ${err ? 'text-red-300' : 'text-ice/90'}`}
        rows={rows}
        value={text}
        onChange={(e) => setText(e.target.value)}
        onBlur={() => {
          try {
            onChange(JSON.parse(text));
            setErr(false);
          } catch {
            setErr(true);
          }
        }}
      />
      {err && <span className="mt-1 block text-[11px] text-red-300">JSON 格式错误，尚未保存。</span>}
    </div>
  );
}

function Card({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-8 rounded-xl border border-ice/10 bg-void/50 p-6 backdrop-blur-xl">
      <h2 className="mb-6 font-display text-lg font-bold text-petal">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  );
}

/* ============ 分区表单 ============ */

function ProfileForm({ d, patch }: { d: SiteContent; patch: (u: (x: SiteContent) => SiteContent) => void }) {
  const p = d.profile;
  return (
    <>
      <Card title="基本信息">
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="姓名"><TextInput value={p.name} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, name: v } }))} /></Field>
          <Field label="英文名 / 站点名"><TextInput value={p.enName} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, enName: v } }))} /></Field>
          <Field label="头衔"><TextInput value={p.role} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, role: v } }))} /></Field>
          <Field label="学校"><TextInput value={p.school} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, school: v } }))} /></Field>
          <Field label="届别"><TextInput value={p.year} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, year: v } }))} /></Field>
          <Field label="所在地"><TextInput value={p.location} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, location: v } }))} /></Field>
          <Field label="邮箱"><TextInput value={p.email} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, email: v } }))} /></Field>
          <Field label="微信"><TextInput value={p.wechat} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, wechat: v } }))} /></Field>
        </div>
        <Field label="头像图片（留空使用占位剪影）" hint="支持图片 URL；如需视频可到作品封面处使用"><MediaField kind="image" value={p.avatar} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, avatar: v } }))} /></Field>
      </Card>

      <Card title="简介文字">
        {p.intro.map((t, i) => (
          <Field key={i} label={`段落 ${i + 1}`}>
            <TextArea rows={2} value={t} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, intro: x.profile.intro.map((it, j) => (j === i ? v : it)) } }))} />
          </Field>
        ))}
        <Field label="技能标签"><TagInput value={p.skills} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, skills: v } }))} /></Field>
      </Card>

      <Card title="经历">
        {p.experiences.map((e, i) => (
          <div key={i} className="grid gap-4 rounded-lg border border-ice/5 p-4 md:grid-cols-3">
            <Field label="职位"><TextInput value={e.role} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, experiences: x.profile.experiences.map((it, j) => (j === i ? { ...it, role: v } : it)) } }))} /></Field>
            <Field label="公司"><TextInput value={e.company} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, experiences: x.profile.experiences.map((it, j) => (j === i ? { ...it, company: v } : it)) } }))} /></Field>
            <Field label="年份"><TextInput value={e.year} onChange={(v) => patch((x) => ({ ...x, profile: { ...x.profile, experiences: x.profile.experiences.map((it, j) => (j === i ? { ...it, year: v } : it)) } }))} /></Field>
          </div>
        ))}
      </Card>
    </>
  );
}

function ProjectsForm({ d, patch }: { d: SiteContent; patch: (u: (x: SiteContent) => SiteContent) => void }) {
  return (
    <>
      {d.projects.map((p, i) => (
        <Card key={p.id} title={`作品 ${i + 1} · ${p.title.split(':')[0]}`}>
          <div className="grid gap-6 md:grid-cols-2">
            <Field label="ID（只读）"><input className={`${inputCls} text-ice/50`} value={p.id} readOnly /></Field>
            <Field label="标题"><TextInput value={p.title} onChange={(v) => patch((x) => ({ ...x, projects: x.projects.map((it, j) => (j === i ? { ...it, title: v } : it)) }))} /></Field>
          </div>
          <Field label="封面（图片 / 视频）"><MediaField kind={/\.mp4|webm/i.test(p.coverMedia) ? 'video' : 'image'} value={p.coverMedia} onChange={(v) => patch((x) => ({ ...x, projects: x.projects.map((it, j) => (j === i ? { ...it, coverMedia: v } : it)) }))} /></Field>
          <Field label="简介"><TextArea rows={3} value={p.shortDesc} onChange={(v) => patch((x) => ({ ...x, projects: x.projects.map((it, j) => (j === i ? { ...it, shortDesc: v } : it)) }))} /></Field>
          <Field label="技术栈"><TagInput value={p.techStack} onChange={(v) => patch((x) => ({ ...x, projects: x.projects.map((it, j) => (j === i ? { ...it, techStack: v } : it)) }))} /></Field>
          <Field label="详情章节（高级 · JSON）" hint="支持 text / image / video / code / compare / mixed / thoughtRef 等块，字段见 data.ts 的 ProjectBlock">
            <JsonField value={p.details} onChange={(v) => patch((x) => ({ ...x, projects: x.projects.map((it, j) => (j === i ? { ...it, details: v as typeof it.details } : it)) }))} rows={10} />
          </Field>
        </Card>
      ))}
    </>
  );
}

function ThoughtsForm({ d, patch }: { d: SiteContent; patch: (u: (x: SiteContent) => SiteContent) => void }) {
  return (
    <>
      {d.thoughts.map((t, i) => (
        <Card key={t.id} title={`文章 ${i + 1} · ${t.title}`}>
          <div className="grid gap-6 md:grid-cols-3">
            <Field label="ID（只读）"><input className={`${inputCls} text-ice/50`} value={t.id} readOnly /></Field>
            <Field label="标题"><TextInput value={t.title} onChange={(v) => patch((x) => ({ ...x, thoughts: x.thoughts.map((it, j) => (j === i ? { ...it, title: v } : it)) }))} /></Field>
            <Field label="日期"><TextInput value={t.date} onChange={(v) => patch((x) => ({ ...x, thoughts: x.thoughts.map((it, j) => (j === i ? { ...it, date: v } : it)) }))} /></Field>
          </div>
          <Field label="摘要"><TextArea rows={2} value={t.summary} onChange={(v) => patch((x) => ({ ...x, thoughts: x.thoughts.map((it, j) => (j === i ? { ...it, summary: v } : it)) }))} /></Field>
          <Field label="正文"><TextArea rows={10} value={t.content} onChange={(v) => patch((x) => ({ ...x, thoughts: x.thoughts.map((it, j) => (j === i ? { ...it, content: v } : it)) }))} /></Field>
          <Field label="关联作品 ID"><TagInput value={t.relatedProjects} onChange={(v) => patch((x) => ({ ...x, thoughts: x.thoughts.map((it, j) => (j === i ? { ...it, relatedProjects: v } : it)) }))} /></Field>
        </Card>
      ))}
    </>
  );
}

function ActsForm({ d, patch }: { d: SiteContent; patch: (u: (x: SiteContent) => SiteContent) => void }) {
  return (
    <Card title="章节文字（每幕的章节号 / 名称）">
      {d.actCopy.map((a, i) => (
        <div key={a.id} className="grid gap-4 rounded-lg border border-ice/5 p-4 md:grid-cols-3">
          <Field label="章节号"><TextInput value={a.chapter} onChange={(v) => patch((x) => ({ ...x, actCopy: x.actCopy.map((it, j) => (j === i ? { ...it, chapter: v } : it)) }))} /></Field>
          <Field label="名称"><TextInput value={a.title} onChange={(v) => patch((x) => ({ ...x, actCopy: x.actCopy.map((it, j) => (j === i ? { ...it, title: v } : it)) }))} /></Field>
          <Field label="副标题"><TextInput value={a.sub} onChange={(v) => patch((x) => ({ ...x, actCopy: x.actCopy.map((it, j) => (j === i ? { ...it, sub: v } : it)) }))} /></Field>
        </div>
      ))}
    </Card>
  );
}

function StageForm({ d, patch }: { d: SiteContent; patch: (u: (x: SiteContent) => SiteContent) => void }) {
  return (
    <Card title="3D 舞台">
      <Field label="模型（GLTF / GLB URL）" hint="留空使用内置占位场景；填入后 3D 舞台自动加载该模型">
        <MediaField kind="model" value={d.stage.modelUrl} onChange={(v) => patch((x) => ({ ...x, stage: { ...x.stage, modelUrl: v } }))} />
      </Field>
      <Field label="说明"><TextArea rows={2} value={d.stage.note} onChange={(v) => patch((x) => ({ ...x, stage: { ...x.stage, note: v } }))} /></Field>
      <p className="body-copy text-[13px]">提示：模型会在 3D 舞台中央加载并适配视野；模型地址无效时自动回退占位场景。</p>
    </Card>
  );
}

function UiForm({ d, patch }: { d: SiteContent; patch: (u: (x: SiteContent) => SiteContent) => void }) {
  return (
    <Card title="界面文案">
      <Field label="品牌名（左上角）"><TextInput value={d.ui.brand} onChange={(v) => patch((x) => ({ ...x, ui: { ...x.ui, brand: v } }))} /></Field>
      <Field label="首页提示（封面幕）"><TextInput value={d.ui.hint} onChange={(v) => patch((x) => ({ ...x, ui: { ...x.ui, hint: v } }))} /></Field>
    </Card>
  );
}