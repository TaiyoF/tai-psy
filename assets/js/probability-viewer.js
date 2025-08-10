// ===== 確率分布ビューア v2.1 =====
class ProbabilityDistributionViewer {
    constructor() {
        this.state = {
            distribution: 'normal',
            currentTab: 'pdf',
      probability: { enabled: true, mode: 'interval', a: -1, b: 1 },
            params: {
                normal: { mean: 0, stddev: 1 },
                binomial: { n: 20, p: 0.5 },
                'chi-squared': { df: 5 },
                poisson: { lambda: 4 },
                exponential: { lambda: 1 },
                uniform: { a: 0, b: 1 },
                gamma: { alpha: 2, beta: 1 }
            }
        };
        this.elements = {};
    this._relayoutBound = false;
        this.init();
    }

    init() {
        this.cacheElements();
        this.bindEvents();
    this.setDefaultProbabilityForDistribution();
        this.updateUI();
    this.ensureSquare();
    window.addEventListener('resize', () => this.ensureSquare());
    }

    cacheElements() {
        this.elements = {
            distSelector: document.getElementById('dist-selector'),
            parameterControls: document.getElementById('parameter-controls'),
            plotDiv: document.getElementById('plot'),
            infoPanel: document.getElementById('info-panel'),
      formulaDisplay: document.getElementById('formula-display'),
            statsPanel: document.getElementById('stats-panel'),
            detailedStats: document.getElementById('detailed-stats'),
      probControls: document.getElementById('probability-controls'),
      probBadge: document.getElementById('probability-badge'),
      probResult: document.getElementById('probability-result'),
            resetBtn: document.getElementById('reset-btn'),
            exportBtn: document.getElementById('export-btn')
        };
    }

    bindEvents() {
    const onDist = (e) => {
      const t = e.target;
      if (t && t.id === 'dist-selector') {
        this.state.distribution = t.value;
        this.setDefaultProbabilityForDistribution();
            this.updateUI();
      }
    };
    if (this.elements.distSelector) this.elements.distSelector.addEventListener('change', onDist);
    document.addEventListener('change', onDist);

    if (this.elements.resetBtn) this.elements.resetBtn.addEventListener('click', () => {
      this.resetParameters();
      this.setDefaultProbabilityForDistribution();
      this.updateUI();
    });
    if (this.elements.exportBtn) this.elements.exportBtn.addEventListener('click', () => this.exportData());
  }

    async updateUI() {
        try {
            await this.setupParameterControls();
      this.setupProbabilityControls();
            await this.updatePlot();
            await this.updateInfoPanel();
      this.updateDetailedStats();
      this.ensureSquare();
    } catch (err) {
      console.error(err);
    }
  }

    async setupParameterControls() {
        const dist = this.state.distribution;
        const params = this.state.params[dist];
    let html = '';
        switch (dist) {
            case 'normal':
        html = `
            <div class="control-group">
          <label>平均 μ: <span class="parameter-value">${params.mean}</span></label>
                <input type="range" id="mean" class="parameter-slider" min="-5" max="5" value="${params.mean}" step="0.1">
            </div>
            <div class="control-group">
          <label>標準偏差 σ: <span class="parameter-value">${params.stddev}</span></label>
                <input type="range" id="stddev" class="parameter-slider" min="0.1" max="5" value="${params.stddev}" step="0.1">
        </div>`;
        break;
      case 'binomial':
        html = `
            <div class="control-group">
          <label>試行回数 n: <span class="parameter-value">${params.n}</span></label>
          <input type="range" id="n" class="parameter-slider" min="1" max="200" value="${params.n}" step="1">
            </div>
            <div class="control-group">
          <label>成功確率 p: <span class="parameter-value">${params.p}</span></label>
                <input type="range" id="p" class="parameter-slider" min="0" max="1" value="${params.p}" step="0.01">
        </div>`;
        break;
      case 'chi-squared':
        html = `
            <div class="control-group">
          <label>自由度 k: <span class="parameter-value">${params.df}</span></label>
          <input type="range" id="df" class="parameter-slider" min="1" max="200" value="${params.df}" step="1">
        </div>`;
        break;
      case 'poisson':
        html = `
            <div class="control-group">
          <label>平均 λ: <span class="parameter-value">${params.lambda}</span></label>
          <input type="range" id="lambda" class="parameter-slider" min="0.1" max="50" value="${params.lambda}" step="0.1">
        </div>`;
        break;
      case 'exponential':
        html = `
            <div class="control-group">
          <label>率 λ: <span class="parameter-value">${params.lambda}</span></label>
                <input type="range" id="lambda" class="parameter-slider" min="0.1" max="5" value="${params.lambda}" step="0.1">
        </div>`;
        break;
      case 'uniform':
        html = `
            <div class="control-group">
          <label>下限 a: <span class="parameter-value">${params.a}</span></label>
          <input type="range" id="a" class="parameter-slider" min="-10" max="10" value="${params.a}" step="0.1">
            </div>
            <div class="control-group">
          <label>上限 b: <span class="parameter-value">${params.b}</span></label>
          <input type="range" id="b" class="parameter-slider" min="-10" max="10" value="${params.b}" step="0.1">
        </div>`;
        break;
      case 'gamma':
        html = `
            <div class="control-group">
          <label>形状 α: <span class="parameter-value">${params.alpha}</span></label>
          <input type="range" id="alpha" class="parameter-slider" min="0.1" max="20" value="${params.alpha}" step="0.1">
            </div>
            <div class="control-group">
          <label>尺度 β: <span class="parameter-value">${params.beta}</span></label>
          <input type="range" id="beta" class="parameter-slider" min="0.1" max="10" value="${params.beta}" step="0.1">
        </div>`;
        break;
    }
    this.elements.parameterControls.innerHTML = html;
    this.elements.parameterControls.querySelectorAll('.parameter-slider').forEach(sl => {
      sl.addEventListener('input', (e) => this.handleParamChange(e));
    });
  }

    handleParamChange(e) {
        const { id, value } = e.target;
        const dist = this.state.distribution;
        this.state.params[dist][id] = parseFloat(value);
    const span = e.target.previousElementSibling?.querySelector('.parameter-value');
    if (span) span.textContent = Number(value).toFixed( id==='n'||id==='df' ? 0 : 2 );
            this.updatePlot();
            this.updateInfoPanel();
    this.updateDetailedStats();
  }

  setupProbabilityControls() {
    const { mode, a, b } = this.state.probability;
    const html = `
      <div class="probability-row">
        <div class="prob-modes" role="radiogroup" aria-label="範囲の種類">
          <input type="radio" id="mode-left" name="prob-mode" value="left" ${mode==='left'?'checked':''}>
          <label for="mode-left">(a]</label>
          <input type="radio" id="mode-interval" name="prob-mode" value="interval" ${mode==='interval'?'checked':''}>
          <label for="mode-interval">[a, b]</label>
          <input type="radio" id="mode-right" name="prob-mode" value="right" ${mode==='right'?'checked':''}>
          <label for="mode-right">[b)</label>
          <input type="radio" id="mode-two" name="prob-mode" value="two-tail" ${mode==='two-tail'?'checked':''}>
          <label for="mode-two">(a] [b)</label>
        </div>
        <div class="prob-inputs">
          <label class="prob-input a">a: <input id="prob-a" type="number" step="0.1" value="${a}"></label>
          <label class="prob-input b">b: <input id="prob-b" type="number" step="0.1" value="${b}"></label>
        </div>
      </div>
      <div id="probability-result" class="probability-result"></div>
    `;
    this.elements.probControls.innerHTML = html;

    // 参照を取り直す（innerHTMLで破棄されるため）
    this.elements.probResult = this.elements.probControls.querySelector('#probability-result');

    // 旧黒バッジが残る場合に備えて非表示＆中身を空に
    const badge = document.getElementById('probability-badge');
    if (badge) { badge.textContent = ''; badge.style.display = 'none'; }

    // ラジオ変更でモード切替
    this.elements.probControls.addEventListener('change', (e) => {
      if (e.target && e.target.name === 'prob-mode') {
        this.state.probability.mode = e.target.value;
        this.updateProbabilityInputsVisibility();
        this.updatePlot();
      }
    });
    this.elements.probControls.querySelector('#prob-a').addEventListener('input', (e) => {
      this.state.probability.a = parseFloat(e.target.value);
      this.updatePlot();
    });
    this.elements.probControls.querySelector('#prob-b').addEventListener('input', (e) => {
      this.state.probability.b = parseFloat(e.target.value);
      this.updatePlot();
    });

    this.updateProbabilityInputsVisibility();
    // not needed with radios
  }

  updateProbabilityInputsVisibility() {
    const mode = this.state.probability.mode;
    const aEl = this.elements.probControls.querySelector('.prob-input.a');
    const bEl = this.elements.probControls.querySelector('.prob-input.b');
    if (!aEl || !bEl) return;
    aEl.style.display = (mode === 'right') ? 'none' : 'inline-flex';
    bEl.style.display = (mode === 'left') ? 'none' : 'inline-flex';
  }

  // removed ensureProbabilityModeUI

    calculateStatistics(dist, params) {
    const s = {};
        switch (dist) {
            case 'normal':
        s.expectation = params.mean;
        s.variance = params.stddev ** 2;
                break;
            case 'binomial':
        s.expectation = params.n * params.p;
        s.variance = params.n * params.p * (1 - params.p);
                break;
            case 'chi-squared':
        s.expectation = params.df;
        s.variance = 2 * params.df;
                break;
            case 'poisson':
        s.expectation = params.lambda;
        s.variance = params.lambda;
                break;
            case 'exponential':
        s.expectation = 1 / params.lambda;
        s.variance = 1 / (params.lambda ** 2);
                break;
            case 'uniform':
        s.expectation = (params.a + params.b) / 2;
        s.variance = ((params.b - params.a) ** 2) / 12;
                break;
            case 'gamma':
        s.expectation = params.alpha / params.beta;
        s.variance = params.alpha / (params.beta ** 2);
                break;
    }
    s.standardDeviation = Math.sqrt(s.variance);
    return s;
  }

  formulaFor(dist) {
    switch (dist) {
      case 'normal': return { E: 'E[X] = μ', V: 'Var(X) = σ^2', pdf: 'f(x)=\\frac{1}{\\sqrt{2\\pi\\sigma^{2}}}\\exp\\!\\left(-\\frac{(x-\\mu)^2}{2\\sigma^2}\\right)' };
      case 'binomial': return { E: 'E[X] = n p', V: 'Var(X) = n p (1 − p)', pdf: 'P(X=k)=\\binom{n}{k}p^k(1-p)^{n-k}' };
      case 'chi-squared': return { E: 'E[X] = k', V: 'Var(X) = 2k', pdf: 'f(x)=\\frac{1}{2^{k/2}\\Gamma(k/2)}x^{k/2-1}e^{-x/2} \\ (x\\ge 0)' };
      case 'poisson': return { E: 'E[X] = λ', V: 'Var(X) = λ', pdf: 'P(X=k)=e^{-\\lambda}\\frac{\\lambda^k}{k!}' };
      case 'exponential': return { E: 'E[X] = 1/λ', V: 'Var(X) = 1/λ^2', pdf: 'f(x)=\\lambda e^{-\\lambda x}\\ (x\\ge 0)' };
      case 'uniform': return { E: 'E[X] = (a + b)/2', V: 'Var(X) = (b − a)^2/12', pdf: 'f(x)=\\frac{1}{b-a}\\ (a\\le x\\le b)' };
      case 'gamma': return { E: 'E[X] = \\alpha/\\beta', V: 'Var(X) = \\alpha/\\beta^2', pdf: 'f(x)=\\frac{\\beta^{\\alpha}}{\\Gamma(\\alpha)}x^{\\alpha-1}e^{-\\beta x} \\ (x\\ge 0)' };
      default: return { E: '', V: '', pdf: '' };
    }
  }

    updateDetailedStats() {
        const dist = this.state.distribution;
        const params = this.state.params[dist];
        const stats = this.calculateStatistics(dist, params);
    const badge = (text) => `<span class="prob-badge">${text}</span>`;
    // MathJax用の黒字式
    const EFormula = {
      normal: '\\(E[X]=\\mu\\)',
      binomial: '\\(E[X]=np\\)',
      'chi-squared': '\\(E[X]=k\\)',
      poisson: '\\(E[X]=\\lambda\\)',
      exponential: '\\(E[X]=1/\\lambda\\)',
      uniform: '\\(E[X]=\\frac{a+b}{2}\\)',
      gamma: '\\(E[X]=\\frac{\\alpha}{\\beta}\\)'
    }[dist] || '\\(E[X]\\)';

    const VFormula = {
      normal: '\\(V[X]=\\sigma^2\\)',
      binomial: '\\(V[X]=np(1-p)\\)',
      'chi-squared': '\\(V[X]=2k\\)',
      poisson: '\\(V[X]=\\lambda\\)',
      exponential: '\\(V[X]=1/\\lambda^2\\)',
      uniform: '\\(V[X]=\\frac{(b-a)^2}{12}\\)',
      gamma: '\\(V[X]=\\frac{\\alpha}{\\beta^2}\\)'
    }[dist] || '\\(V[X]\\)';

    const html = `
      <div class="stats-lines">
        <div class="stats-line">期待値: <span class="mj">${EFormula}</span> = ${badge(stats.expectation.toFixed(4))}</div>
        <div class="stats-line">分散: <span class="mj">${VFormula}</span> = ${badge(stats.variance.toFixed(4))}</div>
        <div class="stats-line">標準偏差: <span class="mj">SD</span> = ${badge(stats.standardDeviation.toFixed(4))}</div>
      </div>`;
    if (this.elements.detailedStats) {
      this.elements.detailedStats.innerHTML = html;
      if (window.MathJax && window.MathJax.typesetPromise) {
        window.MathJax.typesetPromise([this.elements.detailedStats]);
      }
    }
  }

    async updatePlot() {
        const dist = this.state.distribution;
        const tab = this.state.currentTab;
    const { data, layout } = this.createPlot(dist, tab);

    // 結果式
    const pText = this.formatProbabilityText(dist, this.state.params[dist]);
    if (this.elements.probResult) {
      const eq = pText.split('=');
      const pretty = `${eq[0]}= <span class="prob-badge">${(eq[1]||'').trim()}</span>`;
      this.elements.probResult.innerHTML = pretty;
    }

    // autorange を毎回有効化して「曲線は動かない」現象を防ぐ
    layout.xaxis.autorange = true;
    layout.yaxis.autorange = true;

    const config = {
      displayModeBar: false,
      responsive: true,
      scrollZoom: false,
      edits: { shapePosition: true }
    };
    await Plotly.react(this.elements.plotDiv, data, layout, config);
    this.attachDragHandlers();
    this.ensureSquare();
  }

  attachDragHandlers() {
    if (this._relayoutBound) return;
    this._relayoutBound = true;
    this.elements.plotDiv.on('plotly_relayout', (e) => {
      const p = this.state.probability;
      let changed = false;
      if (typeof e['shapes[0].x0'] !== 'undefined') { p.a = Number(e['shapes[0].x0']); changed = true; }
      if (typeof e['shapes[1].x0'] !== 'undefined') { p.b = Number(e['shapes[1].x0']); changed = true; }
      if (!changed) return;
      const aEl = this.elements.probControls.querySelector('#prob-a');
      const bEl = this.elements.probControls.querySelector('#prob-b');
      if (aEl) aEl.value = p.a.toFixed(2);
      if (bEl) bEl.value = p.b.toFixed(2);
      this.updatePlot();
    });
  }

  createPlot(dist, type) {
    switch (dist) {
      case 'normal': return this.createNormalPlot(this.state.params.normal, type);
      case 'binomial': return this.createBinomialPlot(this.state.params.binomial, type);
      case 'chi-squared': return this.createChiSquaredPlot(this.state.params['chi-squared'], type);
      case 'poisson': return this.createPoissonPlot(this.state.params.poisson, type);
      case 'exponential': return this.createExponentialPlot(this.state.params.exponential, type);
      case 'uniform': return this.createUniformPlot(this.state.params.uniform, type);
      case 'gamma': return this.createGammaPlot(this.state.params.gamma, type);
      default: return { data: [], layout: this.squareLayout('', '') };
    }
  }

    createNormalPlot(params, type) {
        const { mean, stddev } = params;
    const xs = [], ys = [];
        const pdf = (x) => (1 / (stddev * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * Math.pow((x - mean) / stddev, 2));
        const cdf = (x) => 0.5 * (1 + this.erf((x - mean) / (stddev * Math.sqrt(2))));
    const x0 = mean - 4 * stddev, x1 = mean + 4 * stddev;
    for (let x = x0; x <= x1; x += 0.02) {
      xs.push(x);
      ys.push(type === 'pdf' ? pdf(x) : cdf(x));
    }
    const { shadedTraces, shapes } = this.createShadedAreaContinuous(xs, ys);
    const data = [{
      x: xs, y: ys, type: 'scatter', mode: 'lines', line: { width: 2 },
      hovertemplate: 'x=%{x}<br>y=%{y:.4f}<extra></extra>'
    }, ...shadedTraces];
    const layout = this.squareLayout(type === 'pdf' ? '確率密度' : '累積確率', 'x');
    if (shapes) layout.shapes = (layout.shapes || []).concat(shapes);
    return { data, layout };
  }

    createBinomialPlot(params, type) {
        const { n, p } = params;
    const xs = [], ys = [];
    let pk = Math.pow(1 - p, n);
    let csum = 0;
        for (let k = 0; k <= n; k++) {
      xs.push(k);
      if (type === 'pdf') { ys.push(pk); }
      else { csum += pk; ys.push(Math.min(csum, 1)); }
      pk = pk * ((n - k) / (k + 1)) * (p / (1 - p || 1e-16));
    }
    const marker = this.discreteHighlightColors(xs);
    const data = [{
      x: xs, y: ys,
                type: type === 'pdf' ? 'bar' : 'scatter',
                mode: type === 'pdf' ? undefined : 'lines+markers',
      marker: type === 'pdf' ? marker : { size: 6 },
      line: type === 'pdf' ? undefined : { width: 2 },
      hovertemplate: type === 'pdf' ? 'k=%{x}<br>P(X=k)=%{y:.4f}<extra></extra>'
                                    : 'k=%{x}<br>F(k)=%{y:.4f}<extra></extra>'
    }];
    const layout = this.squareLayout(type === 'pdf' ? '確率' : '累積確率', type === 'pdf' ? '成功回数 k' : 'k');
    layout.bargap = 0.05;
    layout.shapes = (layout.shapes || []).concat(this.verticalHandles());
    return { data, layout };
    }

    createPoissonPlot(params, type) {
        const { lambda } = params;
    const xs = [], ys = [];
    const maxK = Math.max(30, Math.round(lambda * 3 + 10));
    let pk = Math.exp(-lambda);
    let csum = 0;
        for (let k = 0; k <= maxK; k++) {
      xs.push(k);
      if (type === 'pdf') { ys.push(pk); }
      else { csum += pk; ys.push(Math.min(csum, 1)); }
      pk = pk * lambda / (k + 1);
      if (pk < 1e-15 && k > lambda + 10) break;
    }
    const marker = this.discreteHighlightColors(xs);
    const data = [{
      x: xs, y: ys,
                type: type === 'pdf' ? 'bar' : 'scatter',
                mode: type === 'pdf' ? undefined : 'lines+markers',
      marker: type === 'pdf' ? marker : { size: 6 },
      line: type === 'pdf' ? undefined : { width: 2 },
      hovertemplate: type === 'pdf' ? 'k=%{x}<br>P(X=k)=%{y:.4f}<extra></extra>'
                                    : 'k=%{x}<br>F(k)=%{y:.4f}<extra></extra>'
    }];
    const layout = this.squareLayout(type === 'pdf' ? '確率' : '累積確率', type === 'pdf' ? '発生回数 k' : 'k');
    layout.bargap = 0.1;
    layout.shapes = (layout.shapes || []).concat(this.verticalHandles());
    return { data, layout };
  }

  createChiSquaredPlot(params, type) {
    const { df } = params;
    const xs = [], ys = [];
    const pdf = (x) => x<=0 ? 0 : (Math.pow(x, df/2-1) * Math.exp(-x/2)) / (Math.pow(2, df/2) * this.gamma(df/2));
    const maxX = Math.max(60, df * 3);
    let csum = 0;
    const dx = 0.05;
    for (let x = 0; x <= maxX; x += dx) {
      const p = pdf(x);
      xs.push(x);
      if (type === 'pdf') ys.push(p);
      else { csum += p * dx; ys.push(Math.min(csum, 1)); }
    }
    const { shadedTraces, shapes } = this.createShadedAreaContinuous(xs, ys);
    const data = [{
      x: xs, y: ys, type: 'scatter', mode: 'lines', line: { width: 2 },
      hovertemplate: 'x=%{x}<br>y=%{y:.4f}<extra></extra>'
    }, ...shadedTraces];
    const layout = this.squareLayout(type === 'pdf' ? '確率密度' : '累積確率', 'x');
    if (shapes) layout.shapes = (layout.shapes || []).concat(shapes);
    return { data, layout };
    }

    createExponentialPlot(params, type) {
        const { lambda } = params;
    const xs = [], ys = [];
    const pdf = (x) => x<0 ? 0 : lambda * Math.exp(-lambda * x);
    const cdf = (x) => x<0 ? 0 : 1 - Math.exp(-lambda * x);
    for (let x = 0; x <= 10; x += 0.02) {
      xs.push(x);
      ys.push(type === 'pdf' ? pdf(x) : cdf(x));
    }
    const { shadedTraces, shapes } = this.createShadedAreaContinuous(xs, ys);
    const data = [{
      x: xs, y: ys, type: 'scatter', mode: 'lines', line: { width: 2 },
      hovertemplate: 'x=%{x}<br>y=%{y:.4f}<extra></extra>'
    }, ...shadedTraces];
    const layout = this.squareLayout(type === 'pdf' ? '確率密度' : '累積確率', 'x');
    if (shapes) layout.shapes = (layout.shapes || []).concat(shapes);
    return { data, layout };
  }

  createUniformPlot(params, type) {
    const { a: A, b: B } = params;
    const xs = [], ys = [];
    const pdf = (x)=> (x>=A && x<=B)? 1/(B-A) : 0;
    const cdf = (x)=> x<A?0 : (x>B?1 : (x-A)/(B-A));
    for (let x = Math.min(A-1, B-1); x <= Math.max(A+1, B+1); x += 0.02) {
      xs.push(x);
      ys.push(type === 'pdf' ? pdf(x) : cdf(x));
    }
    const { shadedTraces, shapes } = this.createShadedAreaContinuous(xs, ys);
    const data = [{
      x: xs, y: ys, type: 'scatter', mode: 'lines', line: { width: 2 },
      hovertemplate: 'x=%{x}<br>y=%{y:.4f}<extra></extra>'
    }, ...shadedTraces];
    const layout = this.squareLayout(type === 'pdf' ? '確率密度' : '累積確率', 'x');
    if (shapes) layout.shapes = (layout.shapes || []).concat(shapes);
    return { data, layout };
  }

  createGammaPlot(params, type) {
    const { alpha, beta } = params;
    const xs = [], ys = [];
    const pdf = (x)=> x<=0?0 : (Math.pow(x, alpha-1) * Math.exp(-beta*x)) / (Math.pow(beta, alpha) * this.gamma(alpha));
    let csum = 0;
    const dx = 0.05;
    for (let x = 0; x <= 20; x += dx) {
      const p = pdf(x);
      xs.push(x);
      if (type === 'pdf') ys.push(p);
      else { csum += p * dx; ys.push(Math.min(csum, 1)); }
    }
    const { shadedTraces, shapes } = this.createShadedAreaContinuous(xs, ys);
    const data = [{
      x: xs, y: ys, type: 'scatter', mode: 'lines', line: { width: 2 },
      hovertemplate: 'x=%{x}<br>y=%{y:.4f}<extra></extra>'
    }, ...shadedTraces];
    const layout = this.squareLayout(type === 'pdf' ? '確率密度' : '累積確率', 'x');
    if (shapes) layout.shapes = (layout.shapes || []).concat(shapes);
    return { data, layout };
  }

  squareLayout(yTitle, xTitle) {
        return {
      xaxis: {
        title: { text: xTitle, standoff: 12 },
        gridcolor: '#e5e7eb',
        zeroline: false,
        fixedrange: true,
        automargin: true,
        showspikes: false,
        constrain: 'domain',
        ticklabeloverflow: 'hide past domain',
        ticks: 'outside'
      },
      yaxis: {
        title: { text: yTitle, standoff: 12 },
        gridcolor: '#e5e7eb',
        zeroline: false,
        fixedrange: true,
        rangemode: 'tozero',
        automargin: true,
        showspikes: false,
        constrain: 'domain',
        ticklabeloverflow: 'hide past domain',
        ticks: 'outside'
      },
      margin: { l: 70, r: 24, t: 20, b: 56 },
      showlegend: false,
      hovermode: 'closest',
      hoverlabel: { bgcolor: '#0f172a', bordercolor: '#0f172a', font: { color: '#ffffff', size: 12 } },
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
      font: { color: '#0f172a' },
      // 左端と下端に黒の実線（常時）
      shapes: [
        { type: 'line', xref: 'paper', yref: 'paper', x0: 0, x1: 0, y0: 0, y1: 1, line: { color: '#111', width: 1 }, layer: 'above' },
        { type: 'line', xref: 'paper', yref: 'paper', x0: 0, x1: 1, y0: 0, y1: 0, line: { color: '#111', width: 1 }, layer: 'above' }
      ]
    };
  }

  createShadedAreaContinuous(xs, ys) {
    // 2トレース方式（両側時の橋渡しを回避）
    const traces = [];
    const shapes = this.verticalHandles();
    if (!this.state.probability?.enabled || this.state.currentTab !== 'pdf') return { shadedTraces: traces, shapes };
    const mode = this.state.probability.mode;
    let { a, b } = this.state.probability;
    if (a > b) [a, b] = [b, a];

    const buildTrace = (keep) => {
      const sx=[], sy=[];
      for (let i=0;i<xs.length;i++){ if (keep(xs[i])) { sx.push(xs[i]); sy.push(ys[i]); } }
      return {
        x: sx, y: sy, type: 'scatter', mode: 'lines',
        line: { width: 0 },
        fill: 'tozeroy',
        fillcolor: 'rgba(37,99,235,0.25)',
        hoverinfo: 'skip'
      };
    };

    if (mode === 'left') traces.push(buildTrace(x=>x<=a));
    else if (mode === 'right') traces.push(buildTrace(x=>x>=b));
    else if (mode === 'two-tail') {
      traces.push(buildTrace(x=>x<=a));
      traces.push(buildTrace(x=>x>=b));
    } else {
      traces.push(buildTrace(x=>x>=a && x<=b));
    }
    return { shadedTraces: traces, shapes };
  }

  discreteHighlightColors(xs) {
    if (!this.state.probability?.enabled || this.state.currentTab !== 'pdf') {
      return { color: '#2563eb' };
    }
    const { mode } = this.state.probability;
    let { a, b } = this.state.probability;
    const le = Math.floor(a);
    const ge = Math.ceil(b);
    const inInterval = (k) => {
      if (mode === 'left') return k <= le;
      if (mode === 'right') return k >= ge;
      if (mode === 'two-tail') return k <= le || k >= ge;
      return k >= Math.ceil(a) && k <= Math.floor(b);
    };
    const colors = xs.map(k => inInterval(k) ? 'rgba(37,99,235,0.9)' : 'rgba(148,163,184,0.6)');
    return { color: colors };
  }

  formatProbabilityText(dist, params) {
    const p = this.calculateProbability(dist, params);
    const { mode, a, b } = this.state.probability;
    const fmt = (x)=> Number(x).toLocaleString(undefined, { maximumFractionDigits: 6 });
    if (mode==='left') return `P(X ≤ ${fmt(a)}) = ${p.toFixed(6)}`;
    if (mode==='right') return `P(X ≥ ${fmt(b)}) = ${p.toFixed(6)}`;
    if (mode==='two-tail') return `P(X ≤ ${fmt(a)}) + P(X ≥ ${fmt(b)}) = ${p.toFixed(6)}`;
    return `P(${fmt(a)} ≤ X ≤ ${fmt(b)}) = ${p.toFixed(6)}`;
  }

  calculateProbability(dist, params) {
    const { mode } = this.state.probability;
    let { a, b } = this.state.probability;
    if (a > b) [a, b] = [b, a];
    const cdfs = {
      normal: (x)=> 0.5 * (1 + this.erf((x - params.mean) / (params.stddev * Math.sqrt(2)))),
      exponential: (x)=> x<0?0: 1 - Math.exp(-params.lambda * x),
      uniform: (x)=> x<params.a?0: (x>params.b?1:(x-params.a)/(params.b-params.a))
    };
    if (cdfs[dist]) {
      const F = cdfs[dist];
      if (mode==='left') return F(a);
      if (mode==='right') return 1 - F(b);
      if (mode==='two-tail') return Math.max(0, F(a)) + Math.max(0, 1 - F(b));
      return Math.max(0, F(b) - F(a));
    }
    if (dist === 'binomial') {
      const { n, p } = params;
      const aInt = Math.floor(a);
      const pmf0 = Math.pow(1-p, n);
      const pmfK = (k, prevPk) => prevPk * ((n - (k - 1)) / k) * (p / (1 - p || 1e-16));
      const cumTo = (K) => {
        if (K < 0) return 0;
        let pk = pmf0, sum = pk;
        for (let k = 1; k <= Math.min(K, n); k++) { pk = pmfK(k, pk); sum += pk; }
        return Math.min(sum, 1);
      };
      if (mode==='left') return cumTo(aInt);
      if (mode==='right') return Math.max(0, 1 - cumTo(Math.ceil(b) - 1));
      if (mode==='two-tail') return Math.min(1, Math.max(0, cumTo(Math.floor(a))) + Math.max(0, 1 - cumTo(Math.ceil(b) - 1)));
      return Math.max(0, cumTo(Math.floor(b)) - cumTo(Math.ceil(a) - 1));
    }
    if (dist === 'poisson') {
      const { lambda } = params;
      const aInt = Math.floor(a);
      const cumTo = (K) => {
        if (K < 0) return 0;
        let pk = Math.exp(-lambda), sum = pk;
        for (let k = 1; k <= K; k++) { pk = pk * lambda / (k); sum += pk; if (pk < 1e-15 && k > lambda + 10) break; }
        return Math.min(sum, 1);
      };
      if (mode==='left') return cumTo(aInt);
      if (mode==='right') return Math.max(0, 1 - cumTo(Math.ceil(b) - 1));
      if (mode==='two-tail') return Math.min(1, Math.max(0, cumTo(Math.floor(a))) + Math.max(0, 1 - cumTo(Math.ceil(b) - 1)));
      return Math.max(0, cumTo(Math.floor(b)) - cumTo(Math.ceil(a) - 1));
    }
    const pdfs = {
      'chi-squared': (x)=> x<=0?0:(Math.pow(x, params.df/2-1)*Math.exp(-x/2))/(Math.pow(2, params.df/2)*this.gamma(params.df/2)),
      gamma: (x)=> x<=0?0:(Math.pow(x, params.alpha-1)*Math.exp(-params.beta*x))/(Math.pow(params.beta, params.alpha)*this.gamma(params.alpha))
    };
    const pdf = pdfs[dist];
    if (!pdf) return 0;
    const integrate = (x0, x1)=>{
      if (x1 < x0) return 0;
      const n = 800;
      const h = (x1 - x0) / n;
      let s = 0;
      for (let i=0;i<=n;i++){
        const x = x0 + i*h;
        const w = (i===0||i===n)?1: (i%2===0?2:4);
        s += w * pdf(x);
      }
      return Math.max(0, Math.min(1, s * h / 3));
    };
    const xMin = 0, xMax = dist==='gamma' ? 20 : 60;
    if (mode==='left') return integrate(xMin, Math.max(xMin, a));
    if (mode==='right') return integrate(Math.min(xMax, b), xMax);
    if (mode==='two-tail') return Math.min(1, integrate(xMin, Math.max(xMin, a)) + integrate(Math.min(xMax, b), xMax));
    return integrate(Math.max(xMin, a), Math.min(xMax, b));
  }

    async updateInfoPanel() {
        const dist = this.state.distribution;
    let title = '', description = '';
        switch (dist) {
            case 'normal':
        title='正規分布'; description='身長や測定誤差など、多くの現象を近似する連続分布。'; break;
            case 'binomial':
        title='二項分布'; description='成功確率 p のベルヌーイ試行を n 回行ったときの成功回数の分布。'; break;
            case 'chi-squared':
        title='カイ二乗分布'; description='正規の二乗和に従う分布。検定でよく登場。'; break;
            case 'poisson':
        title='ポアソン分布'; description='単位時間あたり平均 λ 回起こる事象の回数の分布。'; break;
            case 'exponential':
        title='指数分布'; description='待ち時間の分布。ポアソン過程の到着間隔。'; break;
            case 'uniform':
        title='一様分布'; description='区間 [a,b] で一様。'; break;
            case 'gamma':
        title='ガンマ分布'; description='指数分布の一般化。待ち時間の和。'; break;
    }
    const f = this.formulaFor(dist);
    const formulaHTML = f.pdf ? `<div class="formula-tex">\\(${f.pdf}\\)</div>` : '';
    this.elements.infoPanel.innerHTML = `<h3>${title}</h3><p>${description}</p>${formulaHTML}`;
    // MathJax があればタイプセット
    if (window.MathJax && window.MathJax.typeset) {
      try { window.MathJax.typeset(); } catch {}
    }
  }

  erf(x) {
    const a1=0.254829592,a2=-0.284496736,a3=1.421413741,a4=-1.453152027,a5=1.061405429,p=0.3275911;
    const sign = x>=0?1:-1; x=Math.abs(x);
    const t = 1/(1+p*x);
    const y = 1 - (((((a5*t+a4)*t)+a3)*t+a2)*t+a1)*t*Math.exp(-x*x);
    return sign*y;
  }
  gamma(z) {
    const g=7,p=[0.99999999999980993,676.5203681218851,-1259.1392167224028,771.32342877765313,-176.61502916214059,12.507343278686905,-0.13857109526572012,9.9843695780195716e-6,1.5056327351493116e-7];
    if (z<0.5) return Math.PI/(Math.sin(Math.PI*z)*this.gamma(1-z));
    z-=1; let x=p[0]; for (let i=1;i<g+2;i++) x+=p[i]/(z+i);
    const t=z+g+0.5; return Math.sqrt(2*Math.PI)*Math.pow(t,z+0.5)*Math.exp(-t)*x;
  }

  setDefaultProbabilityForDistribution() {
    const dist = this.state.distribution;
    const pr = this.state.probability;
    pr.mode = 'interval';
    const stats = this.calculateStatistics(dist, this.state.params[dist]);
    const mean = stats.expectation;
    const sd = stats.standardDeviation;
    if (dist === 'chi-squared' || dist === 'exponential' || dist === 'gamma' || dist === 'poisson') {
      pr.a = Math.max(0, (mean - sd));
      pr.b = mean + sd;
    } else if (dist === 'binomial') {
      const { n } = this.state.params.binomial;
      pr.a = Math.max(0, Math.floor(mean - sd));
      pr.b = Math.min(n, Math.ceil(mean + sd));
    } else if (dist === 'uniform') {
      const { a, b } = this.state.params.uniform;
      const w = (b - a) / 4;
      pr.a = a + w; pr.b = b - w;
    } else {
      pr.a = mean - sd; pr.b = mean + sd;
    }
  }

  resetParameters() {
    this.state.params = {
      normal: { mean: 0, stddev: 1 },
      binomial: { n: 20, p: 0.5 },
      'chi-squared': { df: 5 },
      poisson: { lambda: 4 },
      exponential: { lambda: 1 },
      uniform: { a: 0, b: 1 },
      gamma: { alpha: 2, beta: 1 }
    };
  }

  exportData() {
    const dist = this.state.distribution;
    const params = this.state.params[dist];
    const data = {
      distribution: dist,
      parameters: params,
      timestamp: new Date().toISOString(),
      statistics: this.calculateStatistics(dist, params)
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `distribution_${dist}_${new Date().toISOString().split('T')[0]}.json`; a.click();
    URL.revokeObjectURL(url);
  }

  verticalHandles() {
    const { a, b } = this.state.probability;
    const y1 = 1;
    return [
      { type: 'line', x0: a, x1: a, y0: 0, y1: y1, line: { color: '#334155', width: 1, dash: 'dot' }, editable: true },
      { type: 'line', x0: b, x1: b, y0: 0, y1: y1, line: { color: '#334155', width: 1, dash: 'dot' }, editable: true }
    ];
  }

  ensureSquare() {
    const el = this.elements.plotDiv;
    if (!el) return;
    const w = el.clientWidth || el.parentElement?.clientWidth || 400;
    const hlimit = Math.floor(window.innerHeight * 0.7);
    const size = Math.min(w, hlimit);
    el.style.height = `${size}px`;
    try { Plotly.Plots.resize(el); } catch {}
  }
}

document.addEventListener('DOMContentLoaded', () => {
  try { window.app = new ProbabilityDistributionViewer(); }
  catch (e) { console.error('init failed', e); }
});