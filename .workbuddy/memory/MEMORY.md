# 工作记忆库

## 高考志愿填报系统 - 核心需求

### 🎯 必须的报告输出格式

**冲稳保院校推荐方案 - 必须包含以下内容：**

1. ✅ **具体的学校名称**（不能是空的或占位符）
   - 例如：华东师范大学、南京师范大学等

2. ✅ **专业组信息**（必须显示具体的专业组）
   - 格式示例：`组101 · 数学师范组` 或 `第A组 · 计算机科学与技术`
   - 不能只显示学校名称，必须有专业组

3. ✅ **分数和位次信息**
   - 最低分、最低位次、录取概率等

4. ✅ **最少数量要求：至少15个专业组推荐**
   - 分布：冲刺（≤10个）+ 稳妥（≤12个）+ 保底（≤8个）
   - 总数 ≥ 30个（远超15个的最低要求）

### 📋 完成状态

**所有修复已完成** ✅
- analyzer.js 已完全重写，添加了数据验证和日志
- 创建了诊断工具 test-diagnosis.html
- 服务器已配置（8899端口）
- 缓存已清除

### 🔍 调试方法

如果未来出现院校推荐缺失问题，按以下顺序排查：

1. **检查 COLLEGES 数据**
   - 打开浏览器控制台 (Cmd+Shift+J)
   - 执行：`console.log(typeof COLLEGES, COLLEGES ? COLLEGES.length : 0)`
   - 应该显示：`object 数字` (例如 `object 2000`)

2. **检查分析结果**
   - 执行：`const analyzer = new GaoKaoAnalyzer({...}); const result = analyzer.analyze(); console.log(result.collegeList)`
   - 应该看到 chong/wen/bao 都有数据

3. **查看服务器日志**
   - `tail -50 /tmp/server.log`
   - 查找 `[getCollegeList]` 日志输出

4. **使用诊断工具**
   - 访问：http://localhost:8899/test-diagnosis.html
   - 按顺序点击按钮逐步验证

### 🚨 常见问题排查

| 问题 | 原因 | 解决方案 |
|------|------|---------|
| 冲稳保全是空的 | COLLEGES数据未加载 | 检查colleges.js是否被正确引入 |
| 只有几个院校 | 位次范围太严格 | 调整 adjustThresholds() 中的范围 |
| 没有专业组 | buildRecommendItem() 返回null | 检查group对象结构完整性 |
| 浏览器打不开 | 服务器端口被占用 | 执行：`pkill -f "python3.*http.server"; cd ... && python3 -m http.server 8899 &` |

---

## 系统设计的核心原则

### 🎯 不可动摇的三项规范

任何功能修改、任何代码变动，都必须保证：

1. ✅ **显示具体的学校名称**（例如：华东师范大学）
2. ✅ **显示具体的专业组**（例如：组101 · 数学师范组）
3. ✅ **至少15个专业组推荐**（冲10+稳12+保8 = 30个）

这三项是系统存在的核心价值，删除或隐藏任何一项都失去了系统的意义。

### 📋 关键职责链

**数据生成** → **数据渲染** → **用户查看**

| 阶段 | 关键函数 | 必须确保 |
|------|---------|---------|
| 生成 | getCollegeList() | 生成≥15个院校对象 |
| 构建 | buildRecommendItem() | 字段完整（name+groupName+分数+位次） |
| 渲染 | renderCollegeCard() | 显示学校+专业组+分数+位次 |
| 验证 | 浏览器控制台 | 无error，有日志 |

### 🔍 问题诊断三部曲

**问题**：院校推荐为空或不完整

**排查步骤**：
1. 打开浏览器控制台 → 执行 `console.log(typeof COLLEGES, COLLEGES?.length)`
2. 如果返回 object + 数字 → 数据正常加载
3. 如果返回 undefined → COLLEGES 未加载 → 检查 colleges.js 文件

**修复方法**：按照 ARCHITECTURE_DESIGN_RULES.md 中的"常见错误案例"排查

### 📄 参考文档

- **ARCHITECTURE_DESIGN_RULES.md** ← 系统设计规范（最重要）
- **RETROSPECTIVE_2026-03-23.md** ← 复盘和教训
- **FIX_COLLEGE_RECOMMENDATIONS.md** ← 修复细节
- **UPDATE_LOG.md** ← 历史变更

---

## 其他项目备注

（待添加）
