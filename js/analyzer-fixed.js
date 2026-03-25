// ============================================================
// 高考志愿填报分析引擎
// ============================================================

class GaoKaoAnalyzer {
  constructor(userData) {
    this.user = userData;
    this.result = {};
  }

  // 主分析入口
  analyze() {
    console.log('[analyzer] 📊 开始分析 - 分数:', this.user.score, '位次:', this.user.rank);
    console.log('[analyzer] COLLEGES 数据:', typeof COLLEGES, COLLEGES ? COLLEGES.length : 0);
    
    this.result.userProfile = this.buildProfile();
    this.result.rankInfo = this.estimateRank();
    this.result.scoreLevel = this.getScoreLevel();
    this.result.hollandType = this.analyzeHolland();
    this.result.recommendedMajors = this.getMajorRecommendations();
    this.result.cityStrategy = this.getCityStrategy();
    this.result.collegeList = this.getCollegeList();
    
    console.log('[analyzer] ✅ 院校列表生成完成:',{
      chong: this.result.collegeList?.chong?.length || 0,
      wen: this.result.collegeList?.wen?.length || 0,
      bao: this.result.collegeList?.bao?.length || 0
    });
    
    this.result.industryTrends = this.getIndustryTrends();
    this.result.summary = this.buildSummary();
    
    console.log('[analyzer] ✅ 分析完成!')
    return this.result;
  }

  // 构建考生画像
  buildProfile() {
    const { name, score, province, subject, gender, examType, interests, cityPreference, familyResources, targetMajor } = this.user;
    return { name, score, province, subject, gender, examType, interests, cityPreference, familyResources, targetMajor };
  }

  // 估算位次（广东物理类）
  estimateRank() {
    const score = parseInt(this.user.score);
    if (!score || score < 200) return { rank: null, rankText: '请输入有效分数', percentile: null };

    // 插值计算位次
    let rank = this.interpolateRank(score);
    let totalPhysics = 320000; // 广东物理类约32万考生
    let percentile = ((totalPhysics - rank) / totalPhysics * 100).toFixed(1);

    let rankText = '';
    if (rank <= 100) rankText = '全省前100名，顶尖水平';
    else if (rank <= 500) rankText = `全省前500名，优秀精英段`;
    else if (rank <= 2000) rankText = `全省前2000名，省内顶尖`;
    else if (rank <= 5000) rankText = `全省前5000名，重点985线`;
    else if (rank <= 10000) rankText = `全省前10000名，985/211冲刺段`;
    else if (rank <= 20000) rankText = `全省前20000名，211稳妥段`;
    else if (rank <= 50000) rankText = `全省前50000名，一本优质段`;
    else if (rank <= 100000) rankText = `全省约${rank}名，一本录取段`;
    else rankText = `全省约${rank}名，二本/专科段`;

    return { rank, rankText, percentile, totalPhysics };
  }

  // 线性插值计算位次
  interpolateRank(score) {
    const table = GUANGDONG_2025_RANK_TABLE;
    // 找到上下界
    for (let i = 0; i < table.length - 1; i++) {
      if (score >= table[i + 1].score && score <= table[i].score) {
        const ratio = (table[i].score - score) / (table[i].score - table[i + 1].score);
        return Math.round(table[i].rank + ratio * (table[i + 1].rank - table[i].rank));
      }
    }
    if (score >= table[0].score) return table[0].rank;
    return table[table.length - 1].rank;
  }

  // 分数层次判断
  getScoreLevel() {
    const score = parseInt(this.user.score);
    if (score >= 660) return { level: 'S', label: '顶尖985竞争段', color: '#FF6B35', desc: '可冲顶尖985，选择空间极大' };
    if (score >= 645) return { level: 'A+', label: '985稳妥段', color: '#FF6B35', desc: '985高校稳妥可报，211任意选' };
    if (score >= 630) return { level: 'A', label: '985/211冲击段', color: '#FF9500', desc: '强势985可冲，211绝对稳妥' };
    if (score >= 615) return { level: 'B+', label: '211优质段', color: '#34C759', desc: '211高校稳妥区间，双一流均可' };
    if (score >= 600) return { level: 'B', label: '211竞争段', color: '#34C759', desc: '211可冲，省内优质一本稳妥' };
    if (score >= 580) return { level: 'C+', label: '一本优质段', color: '#007AFF', desc: '省内重点一本稳妥，211可冲' };
    if (score >= 560) return { level: 'C', label: '一本录取段', color: '#007AFF', desc: '一本线上，省内一般本科稳妥' };
    return { level: 'D', label: '二本/专科段', color: '#8E8E93', desc: '建议选择职业技能导向专业' };
  }

  // 霍兰德兴趣分析
  analyzeHolland() {
    const interests = this.user.interests || [];
    const scores = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };

    // 根据用户兴趣关键词匹配
    const keywords = {
      R: ['动手', '实验', '技术', '工程', '修理', '操作', '机械', '建造', '种植'],
      I: ['研究', '探索', '数学', '物理', '生物', '化学', '科学', '分析', '逻辑', '编程'],
      A: ['艺术', '设计', '绘画', '音乐', '写作', '创作', '文学', '表演', '美学'],
      S: ['帮助', '教学', '服务', '交流', '人际', '辅导', '关爱', '医疗', '护理', '社工', '老师'],
      E: ['领导', '管理', '商业', '说服', '演讲', '组织', '创业', '竞争', '销售'],
      C: ['整理', '计划', '统计', '数据', '精确', '规律', '财务', '会计', '档案'],
    };

    interests.forEach(interest => {
      Object.keys(keywords).forEach(type => {
        keywords[type].forEach(kw => {
          if (interest.includes(kw)) scores[type] += 2;
        });
      });
    });

    // 如果用户填了目标专业，额外加权
    const targetMajor = this.user.targetMajor || '';
    if (/师范|教育|老师/.test(targetMajor)) scores.S += 5;
    if (/数学|物理|生物|化学|科学/.test(targetMajor)) scores.I += 3;
    if (/工程|机械|建筑/.test(targetMajor)) scores.R += 3;
    if (/管理|商|法/.test(targetMajor)) scores.E += 3;
    if (/艺术|设计|文/.test(targetMajor)) scores.A += 3;

    // 取前两名类型
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    const primary = sorted[0][0];
    const secondary = sorted[1][0];

    return {
      scores,
      primary,
      secondary,
      primaryInfo: HOLLAND_MAJOR_MAP[primary],
      secondaryInfo: HOLLAND_MAJOR_MAP[secondary],
      code: `${primary}${secondary}`,
    };
  }

  // 专业推荐
  getMajorRecommendations() {
    const holland = this.analyzeHolland();
    const targetMajor = this.user.targetMajor || '';
    const score = parseInt(this.user.score);
    const recommendations = [];

    // 优先考虑用户指定专业
    if (targetMajor) {
      recommendations.push({
        type: 'target',
        label: '目标专业',
        name: targetMajor,
        match: 100,
        reason: '用户明确表达的专业意向',
        trend: this.getMajorTrend(targetMajor),
      });
    }

    // 基于霍兰德推荐
    const hollandMajors = [
      ...(HOLLAND_MAJOR_MAP[holland.primary]?.majors || []),
      ...(HOLLAND_MAJOR_MAP[holland.secondary]?.majors || []),
    ];

    hollandMajors.slice(0, 4).forEach(major => {
      if (!recommendations.find(r => r.name.includes(major))) {
        recommendations.push({
          type: 'holland',
          label: '兴趣匹配',
          name: major,
          match: 85,
          reason: `与你的${holland.primaryInfo?.name}特质高度匹配`,
          trend: this.getMajorTrend(major),
        });
      }
    });

    // 加入行业趋势热门专业
    if (INDUSTRY_TRENDS && INDUSTRY_TRENDS.hot) {
      INDUSTRY_TRENDS.hot.slice(0, 3).forEach(industry => {
        if (score >= 600 && industry.score >= 5) {
          const majorName = industry.majors[0];
          if (!recommendations.find(r => r.name === majorName)) {
            recommendations.push({
              type: 'trend',
              label: '行业趋势',
              name: majorName,
              match: 75,
              reason: `${industry.name}处于${industry.stage}，${industry.growth}`,
              trend: { level: 'hot', label: '🔥 极热门', growth: industry.growth },
            });
          }
        }
      });
    }

    return recommendations.slice(0, 8);
  }

  // 获取专业趋势
  getMajorTrend(majorName) {
    if (!INDUSTRY_TRENDS || !INDUSTRY_TRENDS.hot) {
      return { level: 'normal', label: '📊 就业稳定', growth: '就业持续需求' };
    }
    
    for (const industry of INDUSTRY_TRENDS.hot) {
      if (industry.majors && industry.majors.some(m => majorName.includes(m) || m.includes(majorName))) {
        return { level: 'hot', label: `🔥 ${industry.name}行业热门`, growth: industry.growth };
      }
    }
    return { level: 'normal', label: '📊 就业稳定', growth: '就业持续需求' };
  }

  // 城市策略
  getCityStrategy() {
    const cityPref = this.user.cityPreference || [];
    const province = this.user.province || '广东';
    const targetMajor = this.user.targetMajor || '';

    const strategies = [];

    if (cityPref.includes('留在广东') || cityPref.includes('广东')) {
      strategies.push({
        priority: 1,
        city: '广州',
        reason: '华南教育中心，中大、华工、华南师范三大旗舰，资源最集中',
        colleges: ['中山大学', '华南理工大学', '华南师范大学', '暨南大学'],
        employmentRate: '广东留省就业率75%+',
      });
      strategies.push({
        priority: 2,
        city: '深圳',
        reason: '南科大在深，腾讯等大厂实习资源丰富，薪资高',
        colleges: ['南方科技大学', '深圳大学'],
        employmentRate: '深圳毕业生平均薪资高出全国均值40%',
      });
      strategies.push({
        priority: 3,
        city: '珠海',
        reason: '北师大珠海校区在此，师范+广东留省极佳选择',
        colleges: ['北京师范大学（珠海校区）'],
        employmentRate: '北师大品牌+粤港澳大湾区就业便利',
      });
    }

    if (cityPref.includes('上海') || (!cityPref.length || cityPref.includes('不限'))) {
      strategies.push({
        priority: 4,
        city: '上海',
        reason: '华东师大在沪，师范顶尖学府，视野开阔',
        colleges: ['华东师范大学', '同济大学', '复旦大学'],
        employmentRate: '上海留沪就业率65%+，起薪全国第一',
      });
    }

    return strategies;
  }

  // 院校推荐列表（冲稳保） - 重点修复
  getCollegeList() {
    const score = parseInt(this.user.score);
    const rank = this.result.rankInfo?.rank || this.interpolateRank(score);
    const cityPref = this.user.cityPreference || [];
    const targetMajor = this.user.targetMajor || '';
    const priority = this.user.priority || 'balanced';
    const stayGuangdong = cityPref.includes('留在广东') || cityPref.includes('广东') || cityPref.includes('就近');

    const chong = [];   // 冲
    const wen = [];    // 稳
    const bao = [];    // 保

    console.log('[getCollegeList] ⭐ 开始生成院校列表');
    console.log('[getCollegeList] 用户分数:', score, '位次:', rank);
    console.log('[getCollegeList] COLLEGES 类型:', typeof COLLEGES, '数据量:', COLLEGES ? (Array.isArray(COLLEGES) ? COLLEGES.length : 'not-array') : 'undefined');

    // 根据分数调整冲稳保策略
    const thresholds = this.adjustThresholds(score, rank);
    console.log('[getCollegeList] 阈值:', thresholds);

    // 遍历所有院校所有专业组
    if (typeof COLLEGES === 'undefined' || !COLLEGES || !Array.isArray(COLLEGES)) {
      console.error('[getCollegeList] ❌ COLLEGES 未加载或格式错误！');
      return { chong: [], wen: [], bao: [] };
    }

    let processedCount = 0;
    let chongCount = 0, wenCount = 0, baoCount = 0;

    COLLEGES.forEach((college, collegeIdx) => {
      // 基本验证
      if (!college || !college.groups) return;

      // 城市过滤（可选）
      if (stayGuangdong && college.province !== '广东' && !['上海', '北京'].includes(college.city)) return;

      college.groups.forEach((group, groupIdx) => {
        processedCount++;
        
        if (!group || group.minRank === undefined || group.minScore === undefined) return;

        const groupRank = group.minRank;
        const diff = groupRank - rank;
        const scoreDiff = group.minScore - score;

        // 专业匹配度计算
        let majorMatch = false;
        if (targetMajor && group.subjects && Array.isArray(group.subjects)) {
          majorMatch = group.subjects.some(s => {
            return s && (s.includes(targetMajor.slice(0, 4)) || targetMajor.includes(s.slice(0, 3)));
          });
        }

        // 根据优先级调整排序权重
        let priority_score = this.calcPriorityScore(college, group, priority);

        // 冲：目标院校录取位次 < 考生位次，差距符合冲的范围
        if (diff < 0 && diff > thresholds.chongMin) {
          const item = this.buildRecommendItem(college, group, score, rank, 'chong', majorMatch, priority_score);
          if (item) {
            chong.push(item);
            chongCount++;
          }
        }
        // 稳：位次差在稳的范围内
        else if (diff >= thresholds.wenMin && diff <= thresholds.wenMax) {
          const item = this.buildRecommendItem(college, group, score, rank, 'wen', majorMatch, priority_score);
          if (item) {
            wen.push(item);
            wenCount++;
          }
        }
        // 保：位次差在保的范围内
        else if (diff > thresholds.baoMin && diff <= thresholds.baoMax && college.level !== '专科') {
          const item = this.buildRecommendItem(college, group, score, rank, 'bao', majorMatch, priority_score);
          if (item) {
            bao.push(item);
            baoCount++;
          }
        }
      });
    });

    console.log('[getCollegeList] 处理完成: 共处理', processedCount, '个专业组');
    console.log('[getCollegeList] 初步分类: 冲=', chongCount, '稳=', wenCount, '保=', baoCount);

    // 排序：专业匹配度优先，然后按优先级分数，最后按分数线高低
    const sortFn = (a, b) => {
      if (a.majorMatch && !b.majorMatch) return -1;
      if (!a.majorMatch && b.majorMatch) return 1;
      const priorityDiff = (b.priorityScore || 0) - (a.priorityScore || 0);
      if (priorityDiff !== 0) return priorityDiff;
      return (b.minScore || 0) - (a.minScore || 0);
    };

    chong.sort(sortFn);
    wen.sort(sortFn);
    bao.sort(sortFn);

    // 【优化】扩展到30个志愿：冲10+稳12+保8
    const resultChong = chong.slice(0, 10);
    const resultWen = wen.slice(0, 12);
    const resultBao = bao.slice(0, 8);
    
    const total = resultChong.length + resultWen.length + resultBao.length;
    console.log('[getCollegeList] ✅ 最终结果: 冲=', resultChong.length, '稳=', resultWen.length, '保=', resultBao.length, '总计=', total);

    // 确保至少有15个推荐（冲10+稳4+保1=15）
    if (total < 15) {
      console.warn('[getCollegeList] ⚠️ 推荐数(' + total + ')不足15个，扩大范围...');
      // 暂时不做额外处理，返回现有数据
    }

    return {
      chong: resultChong,
      wen: resultWen,
      bao: resultBao,
    };
  }

  // 根据分数调整冲稳保阈值
  adjustThresholds(score, rank) {
    // 针对不同分数段调整策略
    if (score >= 660) {
      // 顶尖985段，冲击更强
      return { chongMin: -8000, wenMin: -3000, wenMax: 2000, baoMin: 2000, baoMax: 8000 };
    } else if (score >= 630) {
      // 985/211冲击段
      return { chongMin: -5000, wenMin: -1000, wenMax: 3000, baoMin: 3000, baoMax: 8000 };
    } else if (score >= 600) {
      // 211竞争段
      return { chongMin: -4000, wenMin: 0, wenMax: 3000, baoMin: 3000, baoMax: 8000 };
    } else if (score >= 580) {
      // 一本优质段（591分属于这个范围）
      // 冲：冲211的较弱专业组 (位次差 -3000到-1000)
      // 稳：广东工业大学这样的大学 (位次差 0到5000)
      // 保：确保一本的大学 (位次差 5000到10000)
      return { chongMin: -4000, wenMin: -1000, wenMax: 5000, baoMin: 5000, baoMax: 12000 };
    } else if (score >= 560) {
      // 一本录取段
      return { chongMin: -3000, wenMin: 1000, wenMax: 6000, baoMin: 6000, baoMax: 15000 };
    } else {
      // 二本/专科段
      return { chongMin: -2000, wenMin: 3000, wenMax: 8000, baoMin: 8000, baoMax: 20000 };
    }
  }

  // 根据优先级计算排序权重分
  calcPriorityScore(college, group, priority) {
    let score = 0;

    // 城市等级权重
    const cityTiers = {
      '北京': 10, '上海': 10, '深圳': 9, '广州': 9,
      '杭州': 8, '武汉': 8, '成都': 8, '南京': 8,
      '珠海': 7, '苏州': 7, '西安': 7, '长沙': 7,
      '合肥': 6
    };
    const cityScore = cityTiers[college.city] || 3;

    // 学校等级权重
    const levelScores = {
      'C9': 10, '985': 8, '211': 6, '双一流': 5, '普通本科': 2
    };
    let maxLevelScore = Math.max(...(college.tags || []).map(tag => levelScores[tag] || 0));

    if (priority === 'city') {
      // 城市优先：城市权重80%，学校权重20%
      score = cityScore * 0.8 + (maxLevelScore / 10) * 2 * 0.2;
    } else if (priority === 'school') {
      // 学校优先：学校权重80%，城市权重20%
      score = (maxLevelScore / 10) * 8 + cityScore * 0.2;
    } else if (priority === 'major') {
      // 专业优先：只看分数（分数高说明专业竞争力强）
      score = group.minScore / 100;
    } else {
      // 平衡：综合考虑（学校40%，城市35%，分数25%）
      score = (maxLevelScore / 10) * 4 + cityScore * 0.35 + (group.minScore / 100) * 0.25;
    }

    return score;
  }

  // 构建推荐条目
  buildRecommendItem(college, group, score, rank, type, majorMatch, priorityScore = 0) {
    const scoreDiff = score - group.minScore;
    const rankDiff = group.minRank - rank;
    return {
      id: `${college.id}_${group.code}`,
      collegeName: college.name,
      shortName: college.shortName,
      level: college.level,
      city: college.city,
      province: college.province,
      tags: college.tags,
      groupCode: group.code,
      groupNote: group.note,
      subjects: group.subjects,
      minScore: group.minScore,
      minRank: group.minRank,
      scoreDiff,
      rankDiff,
      type,
      majorMatch,
      priorityScore,
      policy: college.policy,
      characteristic: college.characteristic,
      tuition: college.tuition,
      tuitionNote: college.tuitionNote,
      admitProb: this.calcProbability(type, scoreDiff),
    };
  }

  // 录取概率估算
  calcProbability(type, scoreDiff) {
    if (type === 'chong') {
      if (scoreDiff >= -2) return '45-55%';
      if (scoreDiff >= -5) return '30-45%';
      return '20-35%';
    }
    if (type === 'wen') {
      if (scoreDiff >= 5) return '75-90%';
      if (scoreDiff >= 2) return '65-80%';
      return '55-70%';
    }
    if (type === 'bao') {
      if (scoreDiff >= 15) return '95%+';
      return '90-95%';
    }
    return '未知';
  }

  // 获取行业趋势
  getIndustryTrends() {
    if (typeof INDUSTRY_TRENDS === 'undefined' || !INDUSTRY_TRENDS || !INDUSTRY_TRENDS.hot) {
      return [];
    }
    return INDUSTRY_TRENDS.hot.slice(0, 5).map(industry => ({
      name: industry.name,
      growth: industry.growth,
      stage: industry.stage,
      majors: industry.majors
    }));
  }

  // 生成总结建议
  buildSummary() {
    const score = parseInt(this.user.score);
    const { rank, rankText } = this.result.rankInfo;
    const { level, label } = this.result.scoreLevel;
    const holland = this.result.hollandType;
    const colList = this.result.collegeList;

    const topChong = colList.chong && colList.chong[0];
    const topWen = colList.wen && colList.wen[0];
    const topBao = colList.bao && colList.bao[0];

    const coreAdvice = `
${score}分（${rankText}），属于${label}。
综合六维度分析：

【冲刺】${topChong ? `${topChong.collegeName}${topChong.groupNote}（${topChong.minScore}分，录取概率${topChong.admitProb}）` : '可根据兴趣选择难度适中的院校'}
【稳妥】${topWen ? `${topWen.collegeName}${topWen.groupNote}（${topWen.minScore}分，录取概率${topWen.admitProb}）` : '建议选择分数线比自己低5-10分的院校'}
【保底】${topBao ? `${topBao.collegeName}${topBao.groupNote}（${topBao.minScore}分，录取概率${topBao.admitProb}）` : '确保有可靠保底选项'}

兴趣匹配：${holland.primaryInfo?.name}，最适合${(holland.primaryInfo?.majors || []).slice(0, 3).join('、')}等方向。
    `.trim();

    return {
      coreAdvice,
      keyPoints: [
        `位次是核心：${score}分对应全省约第${rank}名，填报时用位次而非分数跨年比较`,
        `服从调剂很重要：冲刺院校务必勾选"服从专业调剂"，避免退档`,
        `五年趋势要看：查目标院校近5年最低位次，防大小年`,
        `保底必须留：至少2-3个90%以上录取概率的保底志愿`,
      ],
    };
  }
}

// =============================================
// 一模/大型考试换算工具
// =============================================
class ExamConverter {
  constructor(examType, examScore, subject, examYear, mockRank, totalStudents) {
    this.examType = examType;
    this.examScore = parseInt(examScore);
    this.subject = subject || 'physics';
    this.examYear = examYear || '2026';
    this.mockRank = parseInt(mockRank) || null;
    this.totalStudents = parseInt(totalStudents) || null;
  }

  convert() {
    const data = EXAM_CONVERSION[this.examType];
    if (!data) return { error: '暂不支持该考试类型' };

    const score = this.examScore;
    const table = data.physicsConversion;

    // 插值
    let estimated = score;
    for (let i = 0; i < table.length - 1; i++) {
      if (score >= table[i + 1].examScore && score <= table[i].examScore) {
        const ratio = (score - table[i + 1].examScore) / (table[i].examScore - table[i + 1].examScore);
        estimated = Math.round(table[i + 1].gaoKaoEstimate + ratio * (table[i].gaoKaoEstimate - table[i + 1].gaoKaoEstimate));
        break;
      }
    }

    // 根据考试类型调整
    if (data.difficultyFactor) {
      estimated = Math.round(estimated * data.difficultyFactor);
    }

    // 区间
    const low = Math.max(estimated - 5, estimated - Math.round(score * 0.02));
    const high = estimated + 8;

    // 计算位次估计
    let rankEstimate = null;
    if (this.mockRank && this.totalStudents) {
      const cityName = this.examType.includes('深圳') ? '深圳' : 
                      this.examType.includes('广州') ? '广州' : null;
      if (cityName && CITY_RANK_CONVERSION[cityName]) {
        const conversionFactor = CITY_RANK_CONVERSION[cityName].conversionFactor;
        rankEstimate = Math.round(this.mockRank / conversionFactor);
      }
    }

    return {
      examType: this.examType,
      examScore: score,
      examYear: this.examYear,
      estimatedGaoKao: estimated,
      range: `${low} ~ ${high}分`,
      low,
      high,
      rankEstimate,
      note: data.note,
      confidenceLevel: this.getConfidence(score),
    };
  }

  getConfidence(score) {
    if (score >= 580) return { label: '参考价值高', color: '#34C759', desc: '高分段换算精度较好' };
    if (score >= 500) return { label: '参考价值中等', color: '#FF9500', desc: '中分段建议结合多次考试综合判断' };
    return { label: '仅供参考', color: '#FF3B30', desc: '低分段波动较大，换算误差可能较大' };
  }
}
