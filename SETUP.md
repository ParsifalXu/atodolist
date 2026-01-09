# 快速设置指南

## 1. 安装依赖

```bash
npm install
```

## 2. 设置 Supabase

1. 访问 [Supabase](https://supabase.com) 并创建一个新项目
2. 在项目设置中获取以下信息：
   - Project URL (例如: `https://xxxxx.supabase.co`)
   - Anon/Public Key
   - Service Role Key (可选，用于服务端操作)

## 3. 配置环境变量

创建 `.env.local` 文件：

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 4. 设置数据库

1. 在 Supabase 项目中，打开 SQL Editor
2. 复制 `supabase/migrations/001_initial_schema.sql` 文件的内容
3. 在 SQL Editor 中执行该 SQL 脚本
4. 这将创建：
   - `projects` 表
   - `todos` 表
   - Row Level Security (RLS) 策略
   - 必要的索引

## 5. 运行开发服务器

```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000)

## 6. 测试应用

1. 访问 `/signup` 创建新账户
2. 登录后会自动跳转到 `/dashboard`
3. 开始添加任务！

## 故障排除

### 认证问题
- 确保 Supabase 项目中的 Authentication 已启用
- 检查 Email 认证提供者是否已启用

### 数据库错误
- 确保已运行 SQL 迁移脚本
- 检查 RLS 策略是否正确设置
- 验证表名和列名是否正确

### 样式问题
- 确保 Tailwind CSS 已正确配置
- 检查 `tailwind.config.ts` 中的路径配置

