// ============================================================
// 应用主控制器
// ============================================================

// ---- 状态 ----
let currentStep = 1;
const TOTAL_STEPS = 7;
let selectedInterests = [];
let selectedMajors = [];
let selectedCities = [];
let selectedFamily = [];
let selectedPriority = 'balanced'; // 新增：志愿优先级 'city'|'school'|'major'|'balanced'
let scoreType = 'gaokao';
let reportData = null;
let activeCollegeTab = 'chong';
let hollandChart = null;

// ---- 选科组合类型映射 ----
const SUBJECT_TYPES = {
  '物理类（物化生）': { type: '物理类', combination: '物化生', label: '物理类 · 物化生' },
  '物理类（物化政）': { type: '物理类', combination: '物化政', label: '物理类 · 物化政' },
  '物理类（物化地）': { type: '物理类', combination: '物化地', label: '物理类 · 物化地' },
  '物理类（物生地）': { type: '物理类', combination: '物生地', label: '物理类 · 物生地' },
  '物理类（其他组合）': { type: '物理类', combination: '其他', label: '物理类 · 其他' },
  '历史类（史生地）': { type: '历史类', combination: '史生地', label: '历史类 · 史生地' },
  '历史类（史政地）': { type: '历史类', combination: '史政地', label: '历史类 · 史政地' },
};

// ---- 兴趣选项数据 ----
const INTERESTS = [
  { icon: '🔬', name: '科学探究', value: '科学研究' },
  { icon: '💻', name: '编程技术', value: '编程计算机' },
  { icon: '📐', name: '数学逻辑', value: '数学逻辑分析' },
  { icon: '🧬', name: '生命科学', value: '生物生命科学' },
  { icon: '⚛️', name: '物理天地', value: '物理探索' },
  { icon: '🧪', name: '化学实验', value: '化学实验' },
  { icon: '👩‍🏫', name: '教学分享', value: '教学教育帮助' },
  { icon: '📖', name: '阅读写作', value: '写作阅读文学' },
  { icon: '🎨', name: '艺术设计', value: '艺术设计绘画' },
  { icon: '💼', name: '商业管理', value: '商业管理领导' },
  { icon: '⚕️', name: '医疗健康', value: '医疗护理' },
  { icon: '🌍', name: '社会服务', value: '社会服务助人' },
  { icon: '🏗️', name: '工程建设', value: '工程建造动手' },
  { icon: '📊', name: '数据分析', value: '数据统计分析' },
  { icon: '🌱', name: '环境生态', value: '环境生态自然' },
  { icon: '🤖', name: '人工智能', value: '人工智能AI' },
];

// ---- 专业大类数据 ----
const MAJOR_CATEGORIES = [
  {
    icon: '💻',
    name: '计算机类',
    value: '计算机',
    desc: '计算机科学与技术、软件工程、网络工程、信息安全等',
    highlight: false
  },
  {
    icon: '⚡',
    name: '电子信息类',
    value: '电子信息',
    desc: '电子信息工程、通信工程、微电子科学与工程等',
    highlight: false
  },
  {
    icon: '🤖',
    name: '人工智能类',
    value: '人工智能',
    desc: '人工智能、机器学习、智能系统等',
    highlight: true
  },
  {
    icon: '⚙️',
    name: '机械工程类',
    value: '机械工程',
    desc: '机械工程、机械设计制造、工业设计等',
    highlight: false
  },
  {
    icon: '⚡',
    name: '电气工程类',
    value: '电气工程',
    desc: '电气工程及其自动化、新能源电气等',
    highlight: false
  },
  {
    icon: '🏗️',
    name: '土木工程类',
    value: '土木工程',
    desc: '土木工程、建筑工程、铁道工程等',
    highlight: false
  },
  {
    icon: '💧',
    name: '水利工程类',
    value: '水利工程',
    desc: '水利水电工程、水文与水资源工程等',
    highlight: false
  },
  {
    icon: '🔬',
    name: '化学工程类',
    value: '化学工程',
    desc: '化学工程与工业、应用化学、化学等',
    highlight: false
  },
  {
    icon: '🧪',
    name: '生物工程类',
    value: '生物工程',
    desc: '生物工程、生物技术、生物制药等',
    highlight: true
  },
  {
    icon: '🔋',
    name: '新能源类',
    value: '新能源',
    desc: '新能源科学与工程、储能科学与工程等',
    highlight: true
  },
  {
    icon: '📡',
    name: '集成电路类',
    value: '集成电路',
    desc: '集成电路设计与集成系统、微电子科学等',
    highlight: true
  },
  {
    icon: '🏥',
    name: '医学类',
    value: '医学',
    desc: '临床医学、医学影像、药学、护理学等',
    highlight: false
  },
  {
    icon: '🧬',
    name: '生物类',
    value: '生物科学',
    desc: '生物科学、生物技术、遗传学等',
    highlight: false
  },
  {
    icon: '🎓',
    name: '师范教育类',
    value: '师范教育',
    desc: '师范专业、教育学、心理学等',
    highlight: false
  },
  {
    icon: '💰',
    name: '经济管理类',
    value: '经济管理',
    desc: '经济学、工商管理、金融学、会计学等',
    highlight: false
  },
  {
    icon: '⚖️',
    name: '法学类',
    value: '法学',
    desc: '法学、知识产权、国际法等',
    highlight: false
  },
  {
    icon: '🌍',
    name: '环境科学类',
    value: '环境科学',
    desc: '环境工程、环境科学、生态学等',
    highlight: false
  },
  {
    icon: '🎨',
    name: '艺术设计类',
    value: '艺术设计',
    desc: '视觉传达设计、工业设计、建筑学等',
    highlight: false
  },
  {
    icon: '📚',
    name: '文学语言类',
    value: '文学语言',
    desc: '汉语言文学、英语、新闻传播等',
    highlight: false
  },
  {
    icon: '🚀',
    name: '航空航天类',
    value: '航空航天',
    desc: '飞行器设计、航空工程、空间技术等',
    highlight: true
  },
];

// ---- 城市数据 ----
const CITIES = [
  { name: '广州', tag: '华南中心 · 中大/华工/华南师范', pref: '广东' },
  { name: '深圳', tag: '湾区核心 · 南科大/大厂资源', pref: '广东' },
  { name: '珠海', tag: '宜居湾区 · 北师大珠海', pref: '广东' },
  { name: '北京', tag: '全国中心 · 顶尖资源集中', pref: '北京' },
  { name: '上海', tag: '国际都市 · 华东师大/复旦/同济', pref: '上海' },
  { name: '杭州', tag: '互联网之城 · 浙大/阿里', pref: '浙江' },
  { name: '武汉', tag: '性价比之王 · 武大/华科', pref: '湖北' },
  { name: '成都', tag: '新一线 · 川大/电科大', pref: '四川' },
  { name: '留在广东', tag: '广东省内均可', pref: '广东', highlight: true },
  { name: '就近最好', tag: '家庭建议，省内/市内为主', pref: '广东', highlight: true },
  { name: '不限城市', tag: '以学校和专业为主', pref: 'any' },
];

// ---- 家庭资源数据 ----
const FAMILY_RESOURCES = [
  { icon: '⚕️', name: '医疗资源', value: '医疗' },
  { icon: '⚖️', name: '法律资源', value: '法律' },
  { icon: '💰', name: '金融资源', value: '金融' },
  { icon: '🏛️', name: '政府资源', value: '政府' },
  { icon: '🏢', name: '企业资源', value: '企业' },
  { icon: '🎓', name: '教育资源', value: '教育' },
  { icon: '🔧', name: '技术背景', value: '技术' },
  { icon: '❌', name: '无特别资源', value: '无' },
];

// ============================================================
// 页面初始化
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  renderInterestGrid();
  renderMajorGrid();
  renderCityGrid();
  renderFamilyGrid();
  updateProgress();
  
  // 为生成报告按钮绑定事件监听器（确保 onclick 工作）
  const submitBtn = document.querySelector('.btn-submit');
  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      console.log('✅ 生成报告按钮被点击');
      generateReport().catch(err => {
        console.error('报告生成失败:', err);
      });
    });
  }
});

function renderInterestGrid() {
  const grid = document.getElementById('interestGrid');
  grid.innerHTML = INTERESTS.map(item => `
    <div class="interest-item" onclick="toggleInterest(this, '${item.value}')">
      <div class="interest-icon">${item.icon}</div>
      <div class="interest-name">${item.name}</div>
    </div>
  `).join('');
}

function renderMajorGrid() {
  const grid = document.getElementById('majorGrid');
  if (!grid) return; // 如果元素不存在，则跳过
  
  grid.innerHTML = MAJOR_CATEGORIES.map(item => `
    <div class="major-item ${item.highlight ? 'highlight' : ''}" onclick="toggleMajor(this, '${item.value}')">
      <div class="major-icon">${item.icon}</div>
      <div class="major-name">${item.name}</div>
      <div class="major-desc">${item.desc}</div>
    </div>
  `).join('');
}

function renderCityGrid() {
  const grid = document.getElementById('cityGrid');
  grid.innerHTML = CITIES.map(item => `
    <div class="city-item ${item.highlight ? 'highlight' : ''}" onclick="toggleCity(this, '${item.name}')">
      <div class="city-name">${item.name}</div>
      <div class="city-tag">${item.tag}</div>
    </div>
  `).join('');
}

function renderFamilyGrid() {
  const grid = document.getElementById('familyGrid');
  grid.innerHTML = FAMILY_RESOURCES.map(item => `
    <div class="check-item" onclick="toggleFamily(this, '${item.value}')">
      <span>${item.icon}</span>
      <span>${item.name}</span>
    </div>
  `).join('');
}

// ============================================================
// 导航
// ============================================================
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  document.getElementById(`page-${name}`).classList.add('active');
  const navMap = { survey: 0, converter: 1, report: 2 };
  document.querySelectorAll('.nav-btn')[navMap[name]]?.classList.add('active');
  window.scrollTo(0, 0);
}

// ============================================================
// 问卷步进
// ============================================================
function nextStep(current) {
  if (!validateStep(current)) return;
  document.getElementById(`step-${current}`).classList.remove('active');
  currentStep = current + 1;
  document.getElementById(`step-${currentStep}`).classList.add('active');
  updateProgress();
  // Step 7 时更新确认信息
  if (currentStep === 7) renderConfirm();
  window.scrollTo(0, 0);
}

function prevStep(current) {
  document.getElementById(`step-${current}`).classList.remove('active');
  currentStep = current - 1;
  document.getElementById(`step-${currentStep}`).classList.add('active');
  updateProgress();
  window.scrollTo(0, 0);
}

function updateProgress() {
  const pct = (currentStep / TOTAL_STEPS * 100).toFixed(1);
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('progressText').textContent = `第 ${currentStep} 步 / 共 ${TOTAL_STEPS} 步`;
}

// ============================================================
// 表单验证
// ============================================================
function validateStep(step) {
  if (step === 2) {
    if (scoreType === 'gaokao') {
      const score = parseInt(document.getElementById('f-score').value);
      if (!score || score < 200 || score > 750) {
        alert('请输入有效的高考分数（200-750分）');
        return false;
      }
    } else {
      const score = parseInt(document.getElementById('f-mock-score').value);
      if (!score || score < 200 || score > 750) {
        alert('请输入有效的考试分数（200-750分）');
        return false;
      }
    }
  }
  if (step === 5) {
    // 第5步不强制要求，可以默认选择balanced
    if (!selectedPriority || selectedPriority === '') {
      selectedPriority = 'balanced';
    }
  }
  return true;
}

// ============================================================
// 分数预览
// ============================================================
function updateScorePreview() {
  const score = parseInt(document.getElementById('f-score').value);
  const preview = document.getElementById('scorePreview');
  if (!score || score < 200) { preview.style.display = 'none'; return; }

  const analyzer = new GaoKaoAnalyzer({ score });
  const rankInfo = analyzer.estimateRank();
  const level = analyzer.getScoreLevel();

  preview.style.display = 'block';
  preview.style.background = level.color + '1A';
  preview.style.borderLeft = `3px solid ${level.color}`;
  preview.innerHTML = `
    <span style="color:${level.color}; font-size:15px; font-weight:700">${level.label}</span>
    <span style="margin:0 10px; color:#ccc">|</span>
    <span style="color:#666">${rankInfo.rankText}</span>
  `;
}

function updateMockPreview() {
  const score = parseInt(document.getElementById('f-mock-score').value);
  const examType = document.getElementById('f-exam-type').value;
  const examYear = document.getElementById('f-exam-year').value;
  const mockRank = parseInt(document.getElementById('f-mock-rank').value);
  const totalStudents = parseInt(document.getElementById('f-total-students').value);
  const preview = document.getElementById('mockPreview');
  
  if (!score || score < 200) { preview.style.display = 'none'; return; }

  const converter = new ExamConverter(examType, score, 'physics', examYear, mockRank, totalStudents);
  const result = converter.convert();
  if (result.error) { preview.style.display = 'none'; return; }

  let rankInfo = '';
  if (mockRank && totalStudents) {
    rankInfo = `<div style="font-size:13px; color:#374151; margin:4px 0">
      🏆 全市${mockRank}名（全市排名前${Math.round((mockRank/totalStudents)*100)}%）
      ${result.rankEstimate ? `→ 预估全省位次：${result.rankEstimate}名` : ''}
    </div>`;
  }

  preview.style.display = 'block';
  preview.innerHTML = `
    <div style="font-size:13px; color:#6B7280; margin-bottom:4px">${examYear}年${examType} ${score}分 → 预估高考成绩</div>
    <div style="font-size:22px; font-weight:800; color:#4F46E5">${result.estimatedGaoKao}分</div>
    <div style="font-size:14px; color:#374151; margin:4px 0">区间：${result.range}</div>
    ${rankInfo}
    <div style="font-size:12px; color:#9CA3AF; line-height:1.5">${result.note}</div>
  `;
}

// ============================================================
// 交互选择
// ============================================================
function toggleInterest(el, value) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (!selectedInterests.includes(value)) selectedInterests.push(value);
  } else {
    selectedInterests = selectedInterests.filter(v => v !== value);
  }
}

function toggleMajor(el, value) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (!selectedMajors.includes(value)) selectedMajors.push(value);
  } else {
    selectedMajors = selectedMajors.filter(v => v !== value);
  }
}

function toggleCity(el, value) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (!selectedCities.includes(value)) selectedCities.push(value);
  } else {
    selectedCities = selectedCities.filter(v => v !== value);
  }
}

function toggleFamily(el, value) {
  el.classList.toggle('selected');
  if (el.classList.contains('selected')) {
    if (!selectedFamily.includes(value)) selectedFamily.push(value);
  } else {
    selectedFamily = selectedFamily.filter(v => v !== value);
  }
}

function selectPriority(el, value) {
  // 移除所有卡片的selected类
  document.querySelectorAll('.priority-card').forEach(card => {
    card.classList.remove('selected');
  });
  // 添加selected类到当前卡片
  el.classList.add('selected');
  // 更新全局变量
  selectedPriority = value;
  console.log('✅ 志愿优先级已选择:', value);
}

function switchScoreType(type) {
  scoreType = type;
  document.getElementById('score-gaokao').style.display = type === 'gaokao' ? 'block' : 'none';
  document.getElementById('score-mock').style.display = type === 'mock' ? 'block' : 'none';
  document.getElementById('btn-gaokao').classList.toggle('active', type === 'gaokao');
  document.getElementById('btn-mock').classList.toggle('active', type === 'mock');
}

// ============================================================
// 格式化选科显示
// ============================================================
function formatSubjectDisplay(subject) {
  const mapping = SUBJECT_TYPES[subject];
  if (mapping) {
    return mapping.label;
  }
  return subject; // 如果没有找到映射，返回原值
}

// ============================================================
// 确认页渲染
// ============================================================
function renderConfirm() {
  const name = document.getElementById('f-name').value || '匿名同学';
  const gender = document.querySelector('input[name="gender"]:checked')?.value || '未填';
  const province = document.getElementById('f-province').value;
  const subject = document.getElementById('f-subject').value;
  const subjectDisplay = formatSubjectDisplay(subject);

  let scoreDisplay = '';
  if (scoreType === 'gaokao') {
    scoreDisplay = `${document.getElementById('f-score').value}分（高考成绩）`;
  } else {
    try {
      const examType = document.getElementById('f-exam-type').value;
      const mockScore = document.getElementById('f-mock-score').value;
      const examYear = document.getElementById('f-exam-year').value;
      const mockRank = document.getElementById('f-mock-rank').value;
      const totalStudents = document.getElementById('f-total-students').value;
      
      const converted = new ExamConverter(
        examType,
        mockScore,
        'physics',
        examYear,
        mockRank,
        totalStudents
      ).convert();
      scoreDisplay = `${mockScore}分（${examType}，预估高考约${converted.estimatedGaoKao}分）`;
    } catch (e) {
      scoreDisplay = `${document.getElementById('f-mock-score').value}分（模拟考成绩）`;
    }
  }

  const targetMajor = document.getElementById('f-target-major').value || '待分析推荐';

  const items = [
    { label: '👤 姓名', value: name },
    { label: '⚧️ 性别', value: gender },
    { label: '🗺️ 省份', value: province },
    { label: '📚 选科', value: subjectDisplay },
    { label: '📊 成绩', value: scoreDisplay },
    { label: '🎯 目标专业', value: targetMajor },
    { label: '🏙️ 城市意向', value: selectedCities.length ? selectedCities.join('、') : '未选择（不限）' },
    { label: '❤️ 兴趣方向', value: selectedInterests.length ? selectedInterests.slice(0, 4).join('、') + (selectedInterests.length > 4 ? '...' : '') : '未选择' },
  ];

  document.getElementById('confirmGrid').innerHTML = items.map(item => `
    <div class="confirm-item">
      <div class="confirm-label">${item.label}</div>
      <div class="confirm-value">${item.value}</div>
    </div>
  `).join('');
}

// ============================================================
// 实时行业趋势搜索
// ============================================================
async function fetchIndustryTrends() {
  // 返回最新发展前景好的行业与推荐专业
  // 这里先用本地默认数据，也可接入真实 web_search
  return [
    { name: "🤖 人工智能", majors: ["人工智能", "计算机科学", "数据科学与大数据技术"], growth: "年增30%+", stage: "爆发期" },
    { name: "⚡ 新能源", majors: ["新能源科学与工程", "储能科学与工程", "电气工程及自动化"], growth: "年增25%", stage: "成长期" },
    { name: "🛰️ 低空经济", majors: ["飞行器设计", "无人机技术", "航空工程", "通信工程"], growth: "年增300%", stage: "爆发期" },
    { name: "🧬 生物制造", majors: ["生物工程", "基因工程", "合成生物学", "生物技术"], growth: "前沿赛道", stage: "导入期" },
    { name: "🔌 集成电路", majors: ["微电子科学与工程", "集成电路设计", "电子科学与技术"], growth: "国家战略", stage: "成长期" },
    { name: "👨‍🏫 师范教育", majors: ["各科师范专业", "数学教育", "物理教育", "生物教育"], growth: "稳定需求", stage: "成熟期" },
    { name: "⚕️ 医学健康", majors: ["临床医学", "口腔医学", "药学", "公共卫生"], growth: "永续需求", stage: "成熟期" }
  ];
}

// ============================================================
// 生成报告
// ============================================================
async function generateReport() {
  console.log('🟡 [generateReport] 函数被调用');
  
  try {
    // 显示加载状态
    const submitBtn = document.querySelector('.btn-submit');
    if (!submitBtn) {
      throw new Error('找不到提交按钮（.btn-submit）');
    }
    
    const originalText = submitBtn.innerHTML;
    console.log('🟡 [generateReport] 按钮原始文本:', originalText);
    
    submitBtn.innerHTML = '<span class="btn-icon">⏳</span> 正在生成报告，请稍候...';
    submitBtn.disabled = true;
    console.log('🟡 [generateReport] 已显示加载状态');

    // 收集数据
    let finalScore;
    let examType = '';
    let examYear = '';
    let mockRank = null;
    let totalStudents = null;
    
    console.log('🟡 [generateReport] 开始收集用户数据，scoreType:', scoreType);
    
    if (scoreType === 'gaokao') {
      const scoreInput = document.getElementById('f-score');
      if (!scoreInput) {
        throw new Error('找不到高考分数输入框');
      }
      finalScore = parseInt(scoreInput.value);
      if (!finalScore || finalScore < 200) {
        throw new Error('请输入有效的高考分数（200-750分）');
      }
    } else {
      examType = document.getElementById('f-exam-type').value;
      examYear = document.getElementById('f-exam-year').value;
      const mockScoreInput = document.getElementById('f-mock-score');
      if (!mockScoreInput) {
        throw new Error('找不到模拟考分数输入框');
      }
      const mockScore = parseInt(mockScoreInput.value);
      if (!mockScore || mockScore < 200) {
        throw new Error('请输入有效的模拟考分数（200-750分）');
      }
      mockRank = document.getElementById('f-mock-rank').value ? parseInt(document.getElementById('f-mock-rank').value) : null;
      totalStudents = document.getElementById('f-total-students').value ? parseInt(document.getElementById('f-total-students').value) : null;
      
      const converted = new ExamConverter(examType, mockScore, 'physics', examYear, mockRank, totalStudents).convert();
      finalScore = converted.estimatedGaoKao;
    }

    console.log('🟡 [generateReport] 用户分数:', finalScore);

    const rank = document.getElementById('f-rank').value;
    const userData = {
      name: document.getElementById('f-name').value || '同学',
      gender: document.querySelector('input[name="gender"]:checked')?.value || '女',
      province: document.getElementById('f-province').value,
      subject: document.getElementById('f-subject').value,
      score: finalScore,
      userRank: rank ? parseInt(rank) : null,
      examType,
      examYear,
      mockRank,
      totalStudents,
      interests: selectedInterests,
      majorCategories: selectedMajors,
      targetMajor: document.getElementById('f-target-major').value,
      priority: selectedPriority,
      cityPreference: selectedCities,
      familyResources: selectedFamily,
      awayPreference: document.querySelector('input[name="away"]:checked')?.value,
      acceptCooperate: document.getElementById('f-cooperate')?.checked || true,
      extra: document.getElementById('f-extra').value,
    };

    console.log('🟡 [generateReport] 用户数据已收集:', userData);

    // 分析
    if (typeof GaoKaoAnalyzer === 'undefined') {
      throw new Error('GaoKaoAnalyzer 类未加载');
    }
    
    console.log('🟡 [generateReport] 创建分析器...');
    const analyzer = new GaoKaoAnalyzer(userData);
    console.log('🟡 [generateReport] 执行分析...');
    reportData = analyzer.analyze();
    
    // 覆盖位次（如果用户手动填了）
    if (userData.userRank) reportData.rankInfo.rank = userData.userRank;

    console.log('🟡 [generateReport] 分析完成，获取行业趋势...');
    
    // 【新增】实时获取行业趋势
    const industryTrends = await fetchIndustryTrends();
    reportData.industryTrends = industryTrends;

    console.log('🟡 [generateReport] 渲染报告...');
    
    // 渲染报告
    renderReport(userData, reportData);

    console.log('🟡 [generateReport] 显示报告页面...');
    
    // 显示报告页
    document.getElementById('reportNavBtn').style.display = 'flex';
    showPage('report');

    // 恢复按钮状态
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
    
    console.log('✅ [generateReport] 报告生成成功！');
  } catch (error) {
    console.error('❌ [generateReport] 报告生成失败:', error);
    console.error('错误详情:', error.stack);
    
    // 显示用户友好的错误提示
    alert('⚠️ 报告生成失败\n\n错误: ' + error.message + '\n\n请检查：\n1. 是否已填写成绩\n2. 浏览器控制台是否有错误信息');
    
    // 恢复按钮状态
    const submitBtn = document.querySelector('.btn-submit');
    if (submitBtn) {
      submitBtn.innerHTML = '<span class="btn-icon">🔍</span> 生成我的志愿填报报告';
      submitBtn.disabled = false;
    }
  }
}

// ============================================================
// 报告渲染
// ============================================================
function renderReport(user, data) {
  const { rankInfo, scoreLevel, hollandType, recommendedMajors, cityStrategy, collegeList, summary } = data;
  const score = user.score;
  const name = user.name || '同学';
  const subjectDisplay = formatSubjectDisplay(user.subject);

  const html = `
    <div class="report-wrap">

      <!-- 顶部 Hero -->
      <div class="report-hero">
        <div class="report-title">📋 ${name}的高考志愿填报分析报告</div>
        <div class="report-subtitle">基于2025年广东省真实录取数据 · 六维度综合分析 · ${new Date().toLocaleDateString('zh-CN')}</div>
        <div class="report-meta">
          <div class="report-meta-item">
            <div class="report-meta-label">选科组合</div>
            <div class="report-meta-value">${subjectDisplay}</div>
          </div>
          <div class="report-meta-item">
            <div class="report-meta-label">成绩</div>
            <div class="report-meta-value">${score}分</div>
            ${user.examType ? `<div style="font-size:12px; color:#6B7280; margin-top:4px">基于${user.examYear}年${user.examType}换算</div>` : ''}
          </div>
          <div class="report-meta-item">
            <div class="report-meta-label">全省位次（估算）</div>
            <div class="report-meta-value">约第${rankInfo.rank?.toLocaleString()}名</div>
            ${user.mockRank && user.totalStudents ? `<div style="font-size:12px; color:#6B7280; margin-top:4px">全市${user.mockRank}名（前${Math.round((user.mockRank/user.totalStudents)*100)}%）</div>` : ''}
          </div>
          <div class="report-meta-item">
            <div class="report-meta-label">成绩层次</div>
            <div class="report-meta-value" style="font-size:16px; margin-top:6px">
              <span style="background:${scoreLevel.color}; color:#fff; padding:4px 14px; border-radius:50px; font-size:14px">${scoreLevel.label}</span>
            </div>
          </div>
          <div class="report-meta-item">
            <div class="report-meta-label">超过全省考生</div>
            <div class="report-meta-value">${rankInfo.percentile}%</div>
          </div>
        </div>
      </div>

      <!-- ① 分数定位 -->
      <div class="report-section">
        <div class="section-title"><span class="section-icon">📍</span>分数定位与位次分析</div>
        <div class="dimension-grid">
          <div class="dimension-item">
            <div class="dimension-icon">🏆</div>
            <div class="dimension-label">全省位次${user.subject.includes('历史') ? '（历史类）' : '（物理类）'}</div>
            <div class="dimension-value">约第 ${rankInfo.rank?.toLocaleString()} 名</div>
            <div class="dimension-bar"><div class="dimension-bar-fill" style="width:${Math.min(100, (1 - rankInfo.rank/320000)*100).toFixed(1)}%; background:linear-gradient(90deg,#4F46E5,#06B6D4)"></div></div>
          </div>
          <div class="dimension-item">
            <div class="dimension-icon">📊</div>
            <div class="dimension-label">超越全省考生比例</div>
            <div class="dimension-value">${rankInfo.percentile}%</div>
            <div class="dimension-bar"><div class="dimension-bar-fill" style="width:${rankInfo.percentile}%; background:linear-gradient(90deg,#10B981,#06B6D4)"></div></div>
          </div>
          <div class="dimension-item">
            <div class="dimension-icon">🎯</div>
            <div class="dimension-label">院校竞争层次</div>
            <div class="dimension-value" style="color:${scoreLevel.color}">${scoreLevel.level}级</div>
            <div style="font-size:12px; color:#6B7280; margin-top:6px">${scoreLevel.desc}</div>
          </div>
        </div>
        <div style="background:#F0F9FF; border-radius:8px; padding:14px 18px; margin-top:16px; font-size:14px; color:#0369A1;">
          💡 <strong>位次提醒：</strong>${rankInfo.rankText}。填报时请务必以位次作为参考标准，而非单纯比较分数（不同年份试卷难度不同，位次更科学）。
        </div>
        ${user.subject.includes('历史') ? `
        <div style="background:#FEF3C7; border-radius:8px; padding:14px 18px; margin-top:12px; font-size:14px; color:#92400E;">
          📌 <strong>历史类考生提示：</strong>当前推荐的院校数据以物理类为主。由于历史类考生数量及录取数据有所不同，建议在查看院校时，参照各校的招生章程确认具体的招生计划和分数要求。
        </div>
        ` : ''}
      </div>

      <!-- ② 兴趣分析（雷达图） -->
      <div class="report-section">
        <div class="section-title"><span class="section-icon">🧠</span>兴趣性格分析（霍兰德模型）</div>
        <div class="chart-row">
          <div class="chart-wrap">
            <canvas id="hollandChart"></canvas>
          </div>
          <div class="chart-legend">
            <div style="margin-bottom:12px;">
              <div style="font-size:16px; font-weight:700; color:#4F46E5">${hollandType.primaryInfo?.name}</div>
              <div style="font-size:13px; color:#6B7280; margin-top:4px; line-height:1.6">${hollandType.primaryInfo?.desc}</div>
              <div style="margin-top:8px; display:flex; flex-wrap:wrap; gap:6px">
                ${hollandType.primaryInfo?.majors?.slice(0,4).map(m => `<span style="background:#EEF2FF; color:#4F46E5; padding:3px 8px; border-radius:4px; font-size:12px">${m}</span>`).join('')}
              </div>
            </div>
            <div style="border-top:1px solid #E5E7EB; padding-top:12px;">
              <div style="font-size:14px; font-weight:600; color:#6B7280">辅助类型：${hollandType.secondaryInfo?.name}</div>
              <div style="font-size:13px; color:#9CA3AF; margin-top:4px">${hollandType.secondaryInfo?.desc}</div>
            </div>
            <div style="border-top:1px solid #E5E7EB; padding-top:12px; margin-top:12px;">
              <div style="font-size:14px; font-weight:600">职业方向</div>
              <div style="margin-top:6px; display:flex; flex-wrap:wrap; gap:6px">
                ${hollandType.primaryInfo?.careers?.map(c => `<span style="background:#D1FAE5; color:#065F46; padding:3px 8px; border-radius:4px; font-size:12px">${c}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ③ 专业推荐 -->
      <div class="report-section">
        <div class="section-title"><span class="section-icon">📚</span>专业方向推荐</div>
        <div class="major-grid">
          ${recommendedMajors.map(major => `
            <div class="major-card">
              <div class="major-card-header">
                <div class="major-name">${major.name}</div>
                <span class="major-type-tag type-${major.type}">${major.label}</span>
              </div>
              <div class="major-reason">${major.reason}</div>
              <span class="major-trend-tag">${major.trend?.label}</span>
              ${major.trend?.growth ? `<span style="font-size:11px; color:#6B7280; margin-left:6px">${major.trend.growth}</span>` : ''}
            </div>
          `).join('')}
        </div>
      </div>

      <!-- ④ 冲稳保院校推荐 -->
      <div class="report-section">
        <div class="section-title"><span class="section-icon">🏛️</span>冲稳保院校推荐方案</div>
        <div style="font-size:13px; color:#6B7280; margin-bottom:16px; line-height:1.6">
          冲：录取概率30-55%，需要发挥稳定 &nbsp;|&nbsp; 稳：录取概率60-85%，分数基本匹配 &nbsp;|&nbsp; 保：录取概率90%+，确保有学上
        </div>
        <div class="college-type-tabs">
          <button class="college-tab chong active" onclick="switchCollegeTab('chong')">🚀 冲刺 (${collegeList.chong.length}所)</button>
          <button class="college-tab wen" onclick="switchCollegeTab('wen')">✅ 稳妥 (${collegeList.wen.length}所)</button>
          <button class="college-tab bao" onclick="switchCollegeTab('bao')">🛡️ 保底 (${collegeList.bao.length}所)</button>
        </div>
        <div id="college-list-container">
          ${renderCollegeList(collegeList.chong, 'chong')}
        </div>
      </div>

      <!-- ⑤ 城市策略 -->
      <div class="report-section">
        <div class="section-title"><span class="section-icon">🏙️</span>城市选择策略</div>
        <div style="display:flex; flex-direction:column; gap:14px">
          ${cityStrategy.map(s => `
            <div style="background:#F8F9FF; border-radius:8px; padding:16px 18px; border:1px solid #E5E7EB; border-left:3px solid ${s.priority <= 2 ? '#4F46E5' : '#9CA3AF'}">
              <div style="display:flex; align-items:center; gap:10px; margin-bottom:8px">
                <span style="background:${s.priority <= 2 ? '#4F46E5' : '#9CA3AF'}; color:#fff; border-radius:50%; width:24px; height:24px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:700; flex-shrink:0">${s.priority}</span>
                <span style="font-size:17px; font-weight:700">${s.city}</span>
              </div>
              <div style="font-size:13px; color:#374151; line-height:1.6; margin-bottom:8px">${s.reason}</div>
              <div style="display:flex; flex-wrap:wrap; gap:6px">
                ${s.colleges.map(c => `<span style="background:#EEF2FF; color:#4F46E5; padding:3px 8px; border-radius:4px; font-size:12px">${c}</span>`).join('')}
              </div>
              <div style="font-size:12px; color:#6B7280; margin-top:8px">📊 ${s.employmentRate}</div>
            </div>
          `).join('')}
        </div>
      </div>

      <!-- 【新增】行业趋势摘要 -->
      <div class="report-section">
        <div class="section-title"><span class="section-icon">📈</span>最新行业趋势与专业匹配</div>
        <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px">
          ${data.industryTrends?.slice(0, 5).map(ind => `
            <div style="background:#F0FDFA; border:1px solid #99F6E4; border-radius:8px; padding:14px; flex:1 1 160px; min-width:150px">
              <div style="font-size:15px; font-weight:700; color:#047857; margin-bottom:6px">${ind.name}</div>
              <div style="font-size:12px; color:#059669; margin-bottom:4px">📊 ${ind.growth} · ${ind.stage}</div>
              <div style="font-size:12px; color:#065F46; line-height:1.5">
                <strong>推荐专业：</strong><br/>
                ${ind.majors.slice(0, 3).join('、')}${ind.majors.length > 3 ? '...' : ''}
              </div>
            </div>
          `).join('')}
        </div>
        <div style="font-size:13px; color:#6B7280; background:#F9FAFB; padding:12px 14px; border-radius:6px; border-left:3px solid #10B981">
          💡 <strong>行业洞察：</strong>上述行业根据2025年国家产业政策与发展增速筛选，建议结合自身兴趣选择相关方向，未来就业机会更多、薪资潜力更大。
        </div>
      </div>

      <!-- ⑥ 志愿填报方案（具体填报表格） -->
      <div class="report-section">
        <div class="section-title"><span class="section-icon">📝</span>具体志愿填报方案</div>
        <div class="volunteer-plan">
        <div class="plan-intro">
          基于您的分数层次和兴趣偏好，为您制定以下具体的30个志愿填报方案。建议按"冲-稳-保"顺序填报，每个梯度内院校按个人喜好排序。
          <div style="margin-top:10px; font-size:12px; color:#6B7280; background:#F0F9FF; padding:8px 12px; border-radius:6px; border-left:3px solid #0284C7">
            💡 <strong>三梯度分布：</strong>冲(10个)·稳(12个)·保(8个) = 30个志愿
          </div>
        </div>
          
          <div class="volunteer-table-container">
            <table class="volunteer-table">
              <thead>
                <tr>
                  <th style="width:60px">志愿号</th>
                  <th style="width:140px">院校名称</th>
                  <th style="width:120px">专业组</th>
                  <th style="width:140px">最低分 & 历年数据</th>
                  <th style="width:100px">录取概率</th>
                  <th style="width:200px">推荐专业 & 行业</th>
                  <th style="width:140px">学费备注</th>
                  <th style="width:140px">填报策略</th>
                </tr>
              </thead>
              <tbody>
                ${generateVolunteerTableContent(collegeList, user)}
              </tbody>
            </table>
          </div>
          
          <div class="plan-strategy">
            <div class="strategy-title">📌 五梯度填报策略详解：</div>
            <div class="strategy-grid">
            <div class="strategy-item">
              <div class="strategy-icon" style="background:#FEE2E2; color:#EF4444">🚀</div>
              <div>
                <strong style="color:#EF4444">冲刺梯度（志愿1-10）</strong>
                <p>录取概率30-50%，选择往年最低位次高于你30-50名的院校。专业组内填满6个专业并<span style="background:#FEE2E2; padding:2px 6px; border-radius:3px">必须服从调剂</span>。典型：北京大学、清华大学、浙江大学等985顶尖校的部分专业组</p>
              </div>
            </div>
            <div class="strategy-item">
              <div class="strategy-icon" style="background:#FEF3C7; color:#F59E0B">✅</div>
              <div>
                <strong style="color:#F59E0B">稳妥梯度（志愿11-22）</strong>
                <p>录取概率60-80%，分数基本匹配或略低。兼顾院校层次和专业匹配度，热门专业优先填报。典型：武汉大学、华中科技大学、电子科大等985/211名校</p>
              </div>
            </div>
            <div class="strategy-item">
              <div class="strategy-icon" style="background:#DBEAFE; color:#0284C7">🛡️</div>
              <div>
                <strong style="color:#0284C7">保底梯度（志愿23-30）</strong>
                <p>录取概率90%以上，确保录取。包括实力强劲的一本院校和各地方高校特色专业。典型：广东医科大学、广东工业大学等地方强势院校</p>
              </div>
            </div>
              <div class="strategy-item">
                <div class="strategy-icon" style="background:#D1FAE5; color:#10B981">🛡️</div>
                <div>
                  <strong style="color:#10B981">保底梯度（志愿9-10）</strong>
                  <p>录取概率90%+，确保无论如何都能录取。位次低于你至少50-100名，可填报偏好专业。典型：华南师范普通组、广州大学101/102组</p>
                </div>
              </div>
              <div class="strategy-item">
                <div class="strategy-icon" style="background:#E0E7FF; color:#6366F1">📌</div>
                <div>
                  <strong style="color:#6366F1">垫底梯度（备用）</strong>
                  <p>录取概率95%+，极低风险。当冲稳保都未录时的最后保障，位次明显低于你（100+名）。</p>
                </div>
              </div>
              <div class="strategy-item">
                <div class="strategy-icon" style="background:#F3E8FF; color:#8B5CF6">✨</div>
                <div>
                  <strong style="color:#8B5CF6">捡漏梯度（机会）</strong>
                  <p>往年最低位次高于你，但因招生计划增加或报考热度下降，今年或有机会。高风险高收益，需谨慎。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- ⑦ 核心建议 -->
      <div class="report-section">
        <div class="section-title"><span class="section-icon">📋</span>填报操作指南</div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px">
          <div style="background:#EFF6FF; border-radius:8px; padding:16px; border-left:3px solid #0284C7">
            <div style="font-weight:700; color:#0C4A6E; margin-bottom:8px">✅ 填报流程</div>
            <ol style="font-size:13px; color:#0C4A6E; margin-left:16px; line-height:1.8">
              <li>登陆省教育考试院高考志愿填报系统</li>
              <li>按"冲-稳-保-垫-捡"顺序逐个填报院校专业组代码</li>
              <li>冲刺梯度<span style="background:#FEE2E2; padding:2px 6px; border-radius:3px">必须勾选服从调剂</span></li>
              <li>保存前多次核对代码和专业组号</li>
              <li>确认提交前截图备份</li>
            </ol>
          </div>
          <div style="background:#FEF3C7; border-radius:8px; padding:16px; border-left:3px solid #EAB308">
            <div style="font-weight:700; color:#713F12; margin-bottom:8px">⚠️ 常见坑点</div>
            <ul style="font-size:13px; color:#713F12; margin-left:16px; line-height:1.8">
              <li>冲刺院校不勾选调剂 → 高分被退档</li>
              <li>只看分数不看位次 → 大小年风险</li>
              <li>一梯度内院校顺序随意 → 前面梯度满了机会损失</li>
              <li>忽视专业组代码 → 代码错误彻底作废</li>
              <li>体检受限未查招生章程 → 被退档</li>
            </ul>
          </div>
        </div>
        <div style="background:#F0FDF4; border-radius:8px; padding:16px; border-left:3px solid #16A34A">
          <div style="font-weight:700; color:#15803D; margin-bottom:8px">💡 核心建议</div>
          <div style="font-size:13px; color:#15803D; line-height:1.8">
            🎯 <strong>位次优先于分数：</strong>不同年份试卷难度差异大，位次才是跨年对比的科学方法。查近5年最低位次趋势，判断今年是"大年"还是"小年"。<br/>
            🛡️ <strong>冲稳保梯度缺一不可：</strong>冲没中有稳垫底，稳没中有保兜底。三个梯度都要有明确把握的院校。<br/>
            📊 <strong>行业趋势很重要：</strong>上述推荐行业都是国家十五五重点，就业前景和薪资潜力都更好。选专业时多考虑。<br/>
            🔍 <strong>临界前务必再核实：</strong>本报告基于2025年数据，填报前登陆掌上高考APP核实最新数据，官方为最终依据。
          </div>
        </div>
      </div>

      <!-- ⑧ 核心建议 -->
        <div class="advice-card">
          <div class="advice-title">⭐ 推荐路径</div>
          <div class="advice-path">
            ${collegeList.chong[0] ? `<span style="background:#FEE2E2; color:#EF4444; padding:4px 12px; border-radius:6px; font-weight:700">冲 ${collegeList.chong[0].shortName}</span><span class="path-arrow">→</span>` : ''}
            ${collegeList.wen[0] ? `<span style="background:#FEF3C7; color:#92400E; padding:4px 12px; border-radius:6px; font-weight:700">稳 ${collegeList.wen[0].shortName}</span><span class="path-arrow">→</span>` : ''}
            ${collegeList.bao[0] ? `<span style="background:#D1FAE5; color:#065F46; padding:4px 12px; border-radius:6px; font-weight:700">保 ${collegeList.bao[0].shortName}</span>` : ''}
          </div>
          <ul class="key-points">
            ${summary.keyPoints.map(p => `<li>${p}</li>`).join('')}
          </ul>
        </div>

        <!-- 风险提示 -->
        <div class="section-title" style="margin-top:24px"><span class="section-icon">⚠️</span>风险提示</div>
        <div class="risk-grid">
          <div class="risk-item"><div class="risk-icon">📋</div><div class="risk-text"><strong>服从调剂：</strong>冲刺院校务必勾选服从专业调剂，否则高分被退档得不偿失</div></div>
          <div class="risk-item"><div class="risk-icon">📈</div><div class="risk-text"><strong>看五年趋势：</strong>只看一年数据不够，要查近5年最低位次，防大小年风险</div></div>
          <div class="risk-item"><div class="risk-icon">🏥</div><div class="risk-text"><strong>体检限报：</strong>色盲色弱对医学、化工等专业有限制，报考前查清楚招生章程</div></div>
          <div class="risk-item"><div class="risk-icon">📌</div><div class="risk-text"><strong>保底必须有：</strong>至少2-3个90%以上把握的保底志愿，避免一分之差滑档</div></div>
          <div class="risk-item"><div class="risk-icon">🎓</div><div class="risk-text"><strong>师范注意提前批：</strong>华南师范教师专项等有提前批，不占普通批名额，可单独研究</div></div>
          <div class="risk-item"><div class="risk-icon">🔍</div><div class="risk-text"><strong>数据核实：</strong>本报告数据基于2025年，填报前务必到掌上高考APP核实最新数据</div></div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="report-actions">
        <button class="btn-print" onclick="window.print()">🖨️ 打印/保存PDF</button>
        <button class="btn-refill" onclick="showPage('survey')">✏️ 重新填写</button>
      </div>

      <div style="text-align:center; font-size:12px; color:#9CA3AF; padding-bottom:20px">
        本报告仅供志愿填报参考 · 数据来源2025年广东省高考实际录取情况 · 请以当年官方数据为最终依据
      </div>
    </div>
  `;

  document.getElementById('reportContent').innerHTML = html;

  // 渲染雷达图（延迟确保DOM就绪）
  setTimeout(() => renderHollandChart(hollandType), 100);
  // 院校缓存
  window._collegeList = collegeList;
}

// ============================================================
// 院校列表渲染
// ============================================================
function renderCollegeList(list, type) {
  if (!list || list.length === 0) {
    return `<div style="text-align:center; padding:40px; color:#9CA3AF">暂无符合条件的院校，请调整城市偏好或分数</div>`;
  }
  return `<div class="college-list">
    ${list.map(c => renderCollegeCard(c, type)).join('')}
  </div>`;
}

function renderCollegeCard(c, type) {
  const levelTag = getLevelTag(c.level, c.tags);
  const scoreDiffText = c.scoreDiff >= 0
    ? `<span style="color:#10B981">比录取线高 ${c.scoreDiff} 分</span>`
    : `<span style="color:#EF4444">比录取线低 ${Math.abs(c.scoreDiff)} 分</span>`;

  return `
    <div class="college-card">
      <div class="college-card-header">
        <div class="college-name-wrap">
          <div class="college-name">${c.collegeName}</div>
          <span class="college-level-tag ${levelTag.cls}">${levelTag.text}</span>
          ${c.majorMatch ? '<span class="college-match-tag">✓ 专业匹配</span>' : ''}
          <span style="background:#F3F4F6; color:#6B7280; padding:3px 8px; border-radius:4px; font-size:12px">📍${c.city}</span>
        </div>
        <div class="college-score-group">
          <div class="college-rank">2025年最低位次：第${c.minRank?.toLocaleString()}名</div>
          <div class="college-score ${type}">${c.minScore}分</div>
          <div class="college-diff">${scoreDiffText}</div>
          <span class="prob-tag prob-${type}">录取概率 ${c.admitProb}</span>
        </div>
      </div>
      <div class="college-card-body">
        <div class="college-info-group">
          <div class="college-group-code">专业组 ${c.groupCode} · ${c.groupNote}</div>
          <div class="college-subjects">
            ${c.subjects.slice(0,4).map(s => `<span class="subject-tag">${s}</span>`).join('')}
          </div>
          <div class="college-char">${c.characteristic}</div>
        </div>
      </div>
      <div style="margin-top:10px; font-size:12px; color:#9CA3AF; border-top:1px solid #F3F4F6; padding-top:8px">
        📌 录取政策：${c.policy}<br/>
        💰 学费：${c.tuition || '5000-8000元/年'} ${c.tuitionNote ? `(${c.tuitionNote})` : ''}
      </div>
    </div>
  `;
}

function getLevelTag(level, tags) {
  if (tags?.includes('C9')) return { cls: 'tag-C9', text: 'C9顶尖' };
  if (level === '985') return { cls: 'tag-985', text: '985' };
  if (level === '211') return { cls: 'tag-211', text: '211' };
  if (tags?.includes('师范名校')) return { cls: 'tag-师范', text: '师范名校' };
  return { cls: 'tag-normal', text: level };
}

// ============================================================
// 志愿填报表格生成
// ============================================================
function generateVolunteerTableContent(collegeList, user) {
  let volunteerRows = [];
  let volunteerIndex = 1;

  // 冲刺志愿（1-10）- 30%录取概率
  if (collegeList.chong && collegeList.chong.length > 0) {
    collegeList.chong.slice(0, 10).forEach(college => {
      volunteerRows.push(generateVolunteerRow(college, volunteerIndex++, '冲', user));
    });
  }

  // 稳妥志愿（11-22）- 60-80%录取概率
  if (collegeList.wen && collegeList.wen.length > 0) {
    collegeList.wen.slice(0, 12).forEach(college => {
      volunteerRows.push(generateVolunteerRow(college, volunteerIndex++, '稳', user));
    });
  }

  // 保底志愿（23-30）- 90%+录取概率
  if (collegeList.bao && collegeList.bao.length > 0) {
    collegeList.bao.slice(0, 8).forEach(college => {
      volunteerRows.push(generateVolunteerRow(college, volunteerIndex++, '保', user));
    });
  }

  return volunteerRows.join('\n');
}

function generateVolunteerRow(college, index, type, user) {
  const typeColors = {
    '冲': '#EF4444',
    '稳': '#F59E0B', 
    '保': '#10B981',
    '垫': '#6366F1',
    '捡': '#8B5CF6'
  };
  
  const strategies = {
    '冲': '专业组内填满6个专业，务必服从调剂',
    '稳': '重点专业优先填报，适度服从调剂',
    '保': '确保录取，可适当填报热门专业',
    '垫': '低位次保底，有调剂就接受',
    '捡': '往年高位次但今年或有机会'
  };

  // 从 college 对象中提取近3年录取数据
  let historyInfo = '';
  if (college.admissionHistory && college.admissionHistory.length > 0) {
    const sorted = [...college.admissionHistory].sort((a, b) => b.year - a.year);
    historyInfo = sorted.map(h => `${h.year}年：${h.minScore}分（位次${h.minRank}名）`).join(' / ');
  }

  // 推荐专业（基于用户兴趣和目标专业）
  let recommendedMajors = [];
  if (user.targetMajor && user.targetMajor.includes('师范')) {
    recommendedMajors = ['数学师范', '物理师范', '生物师范', '化学师范'];
  } else if (user.interests.some(i => i.includes('数学'))) {
    recommendedMajors = ['数学类', '统计学', '信息与计算科学', '数据科学'];
  } else if (user.interests.some(i => i.includes('生物'))) {
    recommendedMajors = ['生命科学', '生物技术', '生物医学工程', '生态学'];
  } else if (user.interests.some(i => i.includes('计算机') || i.includes('AI'))) {
    recommendedMajors = ['计算机类', '人工智能', '软件工程', '数据科学'];
  } else {
    recommendedMajors = college.subjects?.slice(0, 4) || ['请查看招生章程'];
  }

  // 关联行业标签
  let industryTags = '';
  if (college.relatedIndustry && college.relatedIndustry.length > 0) {
    industryTags = college.relatedIndustry.map(ind => 
      `<span style="background:#FEF3C7; color:#92400E; padding:2px 6px; border-radius:3px; font-size:11px; margin-right:4px">${ind}</span>`
    ).join('');
  }

  return `
    <tr class="volunteer-row volunteer-${type}">
      <td class="volunteer-index">
        <span class="index-badge" style="background:${typeColors[type]}">${index}</span>
        <div style="font-size:11px; color:#9CA3AF; margin-top:2px">${type}梯度</div>
      </td>
      <td class="volunteer-college">
        <div class="college-name">${college.collegeName}</div>
        <div class="college-city">📍 ${college.city}</div>
        <div style="font-size:11px; color:#9CA3AF; margin-top:4px">${college.level || '一本'} · ${college.type || '综合'}</div>
      </td>
      <td class="volunteer-group">
        <div class="group-code">${college.groupCode}组</div>
        <div class="group-note" style="font-size:12px; color:#6B7280; margin-top:4px">${college.groupNote}</div>
        ${college.planCount ? `<div style="font-size:11px; color:#059669; margin-top:4px">📊 招生${college.planCount}人</div>` : ''}
      </td>
      <td class="volunteer-score">
        <div class="score-value" style="font-weight:700; font-size:16px; color:#1F2937">${college.minScore}分</div>
        <div class="score-diff" style="color:${college.scoreDiff >= 0 ? '#10B981' : '#EF4444'}; font-size:12px; margin-top:4px">${college.scoreDiff >= 0 ? '+' : ''}${college.scoreDiff}</div>
        ${historyInfo ? `<div style="font-size:10px; color:#9CA3AF; margin-top:6px; line-height:1.4">📈 ${historyInfo}</div>` : ''}
      </td>
      <td class="volunteer-prob">
        <div class="prob-value" style="color:${typeColors[type]}; font-weight:700; font-size:16px">${college.admitProb}</div>
        <div class="prob-type" style="font-size:11px; color:#6B7280; margin-top:4px">${type}梯度</div>
      </td>
      <td class="volunteer-majors">
        <div style="margin-bottom:6px">
          ${recommendedMajors.slice(0, 3).map(m => `<span class="major-tag">${m}</span>`).join('')}
        </div>
        ${industryTags ? `<div style="font-size:11px; margin-top:4px">${industryTags}</div>` : ''}
      </td>
      <td style="font-size:12px; color:#059669">
        💰 ${college.tuition || '5000-8000元/年'}<br/>
        <span style="color:#6B7280; font-size:11px">${college.tuitionNote || ''}</span>
      </td>
      <td class="volunteer-strategy" style="font-size:12px; color:#374151">${strategies[type]}</td>
    </tr>
  `;
}

function switchCollegeTab(type) {
  activeCollegeTab = type;
  document.querySelectorAll('.college-tab').forEach(btn => btn.classList.remove('active'));
  document.querySelector(`.college-tab.${type}`).classList.add('active');
  document.getElementById('college-list-container').innerHTML = renderCollegeList(window._collegeList[type], type);
}

// ============================================================
// 霍兰德雷达图
// ============================================================
function renderHollandChart(hollandType) {
  const canvas = document.getElementById('hollandChart');
  if (!canvas) return;
  if (hollandChart) { hollandChart.destroy(); hollandChart = null; }

  const scores = hollandType.scores;
  const labels = ['现实型(R)', '研究型(I)', '艺术型(A)', '社会型(S)', '企业型(E)', '常规型(C)'];
  const dataValues = [scores.R, scores.I, scores.A, scores.S, scores.E, scores.C];
  const maxVal = Math.max(...dataValues, 5);

  hollandChart = new Chart(canvas, {
    type: 'radar',
    data: {
      labels,
      datasets: [{
        label: '兴趣分布',
        data: dataValues,
        backgroundColor: 'rgba(79,70,229,0.15)',
        borderColor: '#4F46E5',
        borderWidth: 2,
        pointBackgroundColor: '#4F46E5',
        pointRadius: 4,
      }]
    },
    options: {
      responsive: true, maintainAspectRatio: true,
      scales: {
        r: {
          beginAtZero: true, max: maxVal,
          grid: { color: '#E5E7EB' },
          pointLabels: { font: { size: 11, family: '-apple-system, PingFang SC, sans-serif' }, color: '#374151' },
          ticks: { display: false },
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

// ============================================================
// 换算器
// ============================================================
function updateConverter() {
  const score = parseInt(document.getElementById('cv-score').value);
  const examType = document.getElementById('cv-exam-type').value;
  const examYear = document.getElementById('cv-exam-year').value;
  const subject = document.getElementById('cv-subject').value;
  const mockRank = parseInt(document.getElementById('cv-rank').value);
  const totalStudents = parseInt(document.getElementById('cv-total').value);
  const resultEl = document.getElementById('converter-result');
  if (!score || score < 200) { resultEl.style.display = 'none'; return; }

  const converter = new ExamConverter(examType, score, subject, examYear, mockRank, totalStudents);
  const result = converter.convert();
  if (result.error) { resultEl.style.display = 'none'; return; }

  const analyzer = new GaoKaoAnalyzer({ score: result.estimatedGaoKao });
  const level = analyzer.getScoreLevel();
  const rankInfo = analyzer.estimateRank();

  let rankInfoHtml = '';
  if (mockRank && totalStudents) {
    const cityRankPercent = Math.round((mockRank/totalStudents)*100);
    rankInfoHtml = `<div style="background:#EFF6FF; color:#1E40AF; padding:8px 12px; border-radius:8px; margin:8px 0; font-size:13px">
      🏆 ${examYear}年${examType}全市第${mockRank}名（排名前${cityRankPercent}%）
      ${result.rankEstimate ? `→ 预估全省位次：${result.rankEstimate}名` : ''}
    </div>`;
  }

  resultEl.style.display = 'block';
  resultEl.innerHTML = `
    <div style="display:flex; align-items:center; gap:10px; margin-bottom:6px">
      <span class="confidence-tag" style="background:${result.confidenceLevel.color}1A; color:${result.confidenceLevel.color}">${result.confidenceLevel.label}</span>
    </div>
    <div class="result-main">${examYear}年${examType} ${score}分 → 预估高考 <span style="color:#4F46E5">${result.estimatedGaoKao}分</span></div>
    <div class="result-range">合理区间：<strong>${result.range}</strong></div>
    ${rankInfoHtml}
    <div style="margin:10px 0; display:flex; flex-wrap:wrap; gap:10px">
      <span style="background:${level.color}1A; color:${level.color}; padding:4px 12px; border-radius:50px; font-size:13px; font-weight:600">${level.label}</span>
      <span style="background:#F3F4F6; color:#374151; padding:4px 12px; border-radius:50px; font-size:13px">${rankInfo.rankText}</span>
    </div>
    <div class="result-note">${result.note}</div>
    <div style="margin-top:10px; font-size:12px; color:#9CA3AF">${result.confidenceLevel.desc}</div>
  `;
}
