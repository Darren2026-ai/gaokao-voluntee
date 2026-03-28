# 高考志愿填报系统 - 架构设计规范

## 核心原则

### 🎯 最高优先级规范
**任何功能、任何修改，都必须保留以下三项内容：**

1. **具体的学校名称** ← 不能省略
2. **具体的专业组** ← 不能省略  
3. **分数和位次信息** ← 配套数据

这三项是系统的**硬性要求**，是报告存在的核心价值。

---

## 系统架构

### 数据流向图

```
┌─────────────────────────────────────────────────────────┐
│ 用户提交表单 (index.html)                                  │
│ - 分数、位次、选科、城市偏好等                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ GaoKaoAnalyzer.analyze() (analyzer.js)                   │
│ ✅ 必须执行：                                             │
│   1. getCollegeList()  → 冲稳保院校推荐                  │
│   2. getMajorRecommendations() → 专业推荐              │
│   3. getCityStrategy() → 城市策略                        │
│   4. getIndustryTrends() → 行业趋势                      │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ renderReport() (app.js)                                  │
│ 【关键】将分析结果渲染成 HTML                             │
│ - renderCollegeList() → 冲稳保院校卡片                   │
│ - renderCollegeCard() → 单个院校卡片                     │
│   (必须显示: 学校 + 专业组 + 分数 + 位次)                │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│ 最终报告 (HTML)                                          │
│ ✅ 冲稳保院校推荐方案                                     │
│    - 冲刺：10所学校 × 专业组                             │
│    - 稳妥：12所学校 × 专业组                             │
│    - 保底：8所学校 × 专业组                              │
│    总计：≥30个专业组推荐                                  │
└─────────────────────────────────────────────────────────┘
```

---

## 关键函数职责

### 1️⃣ getCollegeList() - 院校推荐生成

**位置**：`js/analyzer.js` 第 254-323 行

**输入**：用户的分数、位次、城市偏好

**输出**：
```javascript
{
  chong: [院校对象1, 院校对象2, ...],  // 冲刺，≤10个
  wen: [院校对象3, 院校对象4, ...],    // 稳妥，≤12个
  bao: [院校对象5, 院校对象6, ...]     // 保底，≤8个
}
```

**每个院校对象必须包含**：
```javascript
{
  name: "华东师范大学",           // ✅ 学校名称（必需）
  groupName: "组101 · 数学师范组", // ✅ 专业组（必需）
  minScore: 635,                  // 最低分
  minRank: 2500,                  // 最低位次
  probability: "60%",             // 录取概率
  province: "上海",               // 省份
  // 其他字段...
}
```

**关键检查清单**：
- [ ] COLLEGES 数据已正确加载
- [ ] 所有遍历处都有 null/undefined 检查
- [ ] buildRecommendItem() 返回完整对象
- [ ] 日志记录完整（便于调试）
- [ ] 至少生成 15 个推荐（冲+稳+保总和）

---

### 2️⃣ buildRecommendItem() - 院校卡片构建

**位置**：`js/analyzer.js` 第 376-400 行

**必需字段**（缺一不可）：
```javascript
{
  name: string,           // 学校名称
  groupName: string,      // 专业组
  minScore: number,       // 最低分
  minRank: number,        // 最低位次
  province: string,       // 省份
  probability: string,    // 录取概率
  type: 'chong'/'wen'/'bao', // 类型
  // ... 其他字段
}
```

**禁止返回 null**：
- 任何字段缺失都可能导致渲染失败
- 如果无法确定某个字段，使用默认值（如 "—"）

---

### 3️⃣ renderCollegeCard() - 卡片渲染

**位置**：`js/app.js` 第 1038-1080 行

**渲染内容**（必须全部显示）：
```html
┌─────────────────────────────────┐
│ 学校名称 (groupName)             │ ← 必显示
│                                   │
│ 最低分：635 | 位次：2500          │ ← 必显示
│ 录取概率：60%                     │ ← 配套
│ 位置：上海                        │ ← 辅助
└─────────────────────────────────┘
```

**调试方法**：
1. 打开浏览器控制台 (Cmd+Shift+J)
2. 检查是否有错误或警告
3. 执行：`document.querySelectorAll('.college-card').length`
4. 应该返回数字（院校卡片数量）

---

## 数据来源

### 📊 COLLEGES 数据

**文件**：`data/colleges.js`

**结构**：
```javascript
window.COLLEGES = [
  {
    name: "华东师范大学",
    province: "上海",
    city: "上海",
    groups: [
      {
        groupName: "组101 · 数学师范组",
        subjects: ["数学", "物理", "化学"],
        minScore: 635,
        minRank: 2500,
        // ...
      },
      // 更多专业组
    ]
  },
  // 更多学校
]
```

**关键验证**：
```javascript
// 在浏览器控制台执行
console.log("COLLEGES 加载状态:", typeof COLLEGES, COLLEGES?.length);
console.log("第一所学校:", COLLEGES[0]);
console.log("第一所学校的专业组数:", COLLEGES[0].groups?.length);
```

---

## 常见错误案例

### ❌ 案例1：院校卡片为空

**症状**：报告中看不到学校和专业组

**原因排查**：
1. ❌ COLLEGES 未加载 → 检查 colleges.js 是否被引入
2. ❌ getCollegeList() 返回空数组 → 检查位次范围
3. ❌ buildRecommendItem() 返回 null → 检查字段完整性
4. ❌ renderCollegeCard() 出错 → 检查浏览器控制台

**修复步骤**：
```javascript
// 第一步：验证数据加载
console.log("[debug] COLLEGES:", typeof COLLEGES, COLLEGES?.length);

// 第二步：验证分析结果
const analyzer = new GaoKaoAnalyzer(userData);
const result = analyzer.analyze();
console.log("[debug] collegeList:", result.collegeList);

// 第三步：检查渲染
console.log("[debug] 卡片数量:", document.querySelectorAll('.college-card').length);
```

### ❌ 案例2：只显示学校，不显示专业组

**症状**：卡片显示"华东师范大学"但不显示"组101 · 数学师范组"

**原因**：buildRecommendItem() 没有包含 groupName 字段

**修复**：
```javascript
// 错误版本
const item = {
  name: college.name,
  minScore: group.minScore,
  // ❌ 缺少 groupName
};

// 正确版本
const item = {
  name: college.name,
  groupName: group.groupName,  // ✅ 必须包含
  minScore: group.minScore,
};
```

### ❌ 案例3：分数或位次显示为 undefined

**症状**："最低分：undefined | 位次：undefined"

**原因**：group 对象中没有 minScore 或 minRank 字段

**修复**：
```javascript
// 检查字段是否存在
if (!group.minScore || !group.minRank) {
  console.error("[error] group 对象缺少必需字段:", group);
  return null; // 跳过这个专业组
}
```

---

## 修改检查清单

### 每次修改前

- [ ] 理解当前的数据流向
- [ ] 确认修改涉及的函数
- [ ] 检查修改是否会影响 COLLEGES 数据加载
- [ ] 检查修改是否会影响院校卡片渲染

### 每次修改后

- [ ] 浏览器清缓存（Cmd+Shift+R）
- [ ] 填表并生成报告
- [ ] 检查冲稳保院校是否显示
- [ ] 检查学校名称是否显示
- [ ] 检查专业组是否显示
- [ ] 检查分数和位次是否显示
- [ ] 打开浏览器控制台检查错误

### 验证命令

```javascript
// 命令1：检查数据加载
console.log("✅ COLLEGES loaded:", typeof COLLEGES === 'object' && COLLEGES.length > 0);

// 命令2：检查分析结果
const test = new GaoKaoAnalyzer({
  score: 600,
  rank: 5000,
  cityPreference: [],
  targetMajor: '',
  priority: 'balanced'
});
const result = test.analyze();
console.log("✅ Analysis result:", result);
console.log("✅ College list:", result.collegeList);

// 命令3：检查卡片渲染
console.log("✅ College cards rendered:", document.querySelectorAll('.college-card').length);
```

---

## 功能扩展指南

### 当添加新功能时

**示例**：想添加"按学科领域筛选"功能

**步骤**：
1. ✅ 确保不删除任何院校数据
2. ✅ 确保 getCollegeList() 仍然生成 ≥15 个推荐
3. ✅ 确保 buildRecommendItem() 仍然包含所有字段
4. ✅ 在渲染阶段添加筛选逻辑（不是在数据生成阶段）
5. ✅ 彻底测试

**代码示例**：
```javascript
// ❌ 错误做法（数据生成时就筛选）
const collegeList = this.getCollegeList();
collegeList.chong = collegeList.chong.filter(c => c.discipline === 'STEM');
// 问题：失去了其他学科的推荐

// ✅ 正确做法（保留所有数据，渲染时筛选）
const collegeList = this.getCollegeList();  // 完整数据
const filtered = collegeList.chong.filter(c => c.discipline === 'STEM');  // 筛选
renderCollegeList(filtered, 'chong');  // 显示筛选结果
```

---

## 性能和质量要求

| 指标 | 要求 | 检查方法 |
|------|------|---------|
| 加载时间 | < 3 秒 | 打开报告，观察时间 |
| 院校推荐数量 | ≥ 15 个专业组 | 数一下卡片数量 |
| 字段完整性 | 100% | 检查每张卡片是否都有学校、专业组、分数 |
| 错误率 | 0 | 打开浏览器控制台，确保无 error 或 warning |
| 跨浏览器兼容 | Chrome / Safari / Firefox | 在三个浏览器中测试 |

---

## 总结

### 🚀 系统的三个支柱

1. **数据生成** (analyzer.js)
   - 必须生成 ≥15 个推荐
   - 必须包含学校和专业组

2. **数据渲染** (app.js)
   - 必须显示学校名称
   - 必须显示专业组
   - 必须显示分数和位次

3. **质量保证** (测试)
   - 每次修改都要验证
   - 浏览器控制台无错误
   - 至少15个院校卡片显示正确

### ✅ 核心规范（不可违反）

- **学校名称** ← 必须显示
- **专业组名称** ← 必须显示
- **分数和位次** ← 必须显示
- **至少15个推荐** ← 必须满足

---

**最后更新**：2026-03-23  
**重要性**：⭐⭐⭐⭐⭐ 系统设计的核心
