<script setup>
import { reactive, watch, getCurrentInstance, nextTick, computed, onMounted, onBeforeUnmount } from 'vue';
import utils from '../../common/utils';
import { Monitor } from '../../services';
import {
  RESPONSE,
  METRIC_MONITOR_CATEGORIES,
  MONITOR_TIME_RANGES,
  MONITOR_MAX_RANGE_MS,
  MONITOR_DEFAULT_RANGE_MS,
} from '../../common/enum';
import { useRouter } from 'vue-router';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

const router = useRouter();
const { currentRoute: { _rawValue: { params: { app_key } } } } = router;
const context = getCurrentInstance();

function createDefaultRange(durationMs = MONITOR_DEFAULT_RANGE_MS) {
  const end = Date.now();
  return {
    start: new Date(end - durationMs),
    end: new Date(end),
  };
}

const state = reactive({
  activeDurationMs: MONITOR_DEFAULT_RANGE_MS,
  buttons: MONITOR_TIME_RANGES,
  nodes: [],
  selectedNode: '',
  catalog: [],
  range: createDefaultRange(),
  loading: false,
  chartLoading: {},
});

const charts = new Map();
const chartEls = new Map();
let isReady = false;
let loadToken = 0;

const metricsByCategory = computed(() => {
  const grouped = {};
  METRIC_MONITOR_CATEGORIES.forEach((category) => {
    grouped[category] = [];
  });
  (state.catalog || []).forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });
  return grouped;
});

function format(date) {
  return utils.formatTime(date, 'yyyy-MM-dd hh:mm');
}

function syncActiveDurationFromRange() {
  const duration = new Date(state.range.end).getTime() - new Date(state.range.start).getTime();
  const matched = MONITOR_TIME_RANGES.find((btn) => Math.abs(btn.durationMs - duration) < 3000);
  state.activeDurationMs = matched ? matched.durationMs : null;
}

function isRangeValid(start, end) {
  return end - start > 0 && end - start <= MONITOR_MAX_RANGE_MS;
}

function formatBytes(value) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  let size = Number(value);
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  return `${size.toFixed(unitIndex === 0 ? 0 : 2)} ${units[unitIndex]}`;
}

function formatBytesCompact(value) {
  const units = ['', 'K', 'M', 'G', 'T'];
  let size = Math.abs(Number(value));
  let unitIndex = 0;
  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }
  const suffix = units[unitIndex];
  if (unitIndex === 0) {
    return `${Math.round(size)}`;
  }
  if (size >= 100) {
    return `${Math.round(size)}${suffix}`;
  }
  if (size >= 10) {
    return `${size.toFixed(1)}${suffix}`;
  }
  return `${size.toFixed(2)}${suffix}`;
}

function formatCountCompact(value) {
  const n = Number(value);
  const abs = Math.abs(n);
  if (abs >= 1e12) {
    return `${(n / 1e12).toFixed(1)}T`;
  }
  if (abs >= 1e9) {
    return `${(n / 1e9).toFixed(1)}B`;
  }
  if (abs >= 1e6) {
    return `${(n / 1e6).toFixed(1)}M`;
  }
  if (abs >= 1e4) {
    return `${(n / 1e3).toFixed(1)}K`;
  }
  if (Number.isInteger(n)) {
    return `${n}`;
  }
  return n.toFixed(2);
}

function formatMetricValue(value, valueKind) {
  if (valueKind === 'percent') {
    return `${Number(value).toFixed(2)}%`;
  }
  if (valueKind === 'bytes') {
    return formatBytes(value);
  }
  return Number(value).toLocaleString();
}

function formatAxisValue(value, valueKind) {
  if (valueKind === 'percent') {
    return `${Number(value).toFixed(1)}%`;
  }
  if (valueKind === 'bytes') {
    return formatBytesCompact(value);
  }
  return formatCountCompact(value);
}

function getYAxisFormatter(valueKind) {
  return (value) => formatAxisValue(value, valueKind);
}

function getChartGrid(valueKind) {
  // Bytes and large counts need a bit more room even with containLabel.
  const left = valueKind === 'bytes' ? 6 : 4;
  return {
    left,
    right: 10,
    top: 10,
    bottom: 6,
    containLabel: true,
  };
}

function metricLabel(item) {
  if (item.label_key) {
    return t(item.label_key);
  }
  return item.metric_type;
}

function setChartEl(metricType, el) {
  if (el) {
    chartEls.set(metricType, el);
  } else {
    chartEls.delete(metricType);
  }
}

function disposeCharts() {
  charts.forEach((chart) => chart.dispose());
  charts.clear();
}

function renderChart(metricType, points, valueKind) {
  const el = chartEls.get(metricType);
  if (!el) {
    return;
  }
  let chart = charts.get(metricType);
  if (!chart) {
    chart = context.proxy.$echat.init(el);
    charts.set(metricType, chart);
  }
  const seriesData = (points || []).map((point) => [point.collect_time, point.metric_value]);
  chart.setOption({
    animation: false,
    grid: getChartGrid(valueKind),
    tooltip: {
      trigger: 'axis',
      confine: true,
      formatter(params) {
        const item = params?.[0];
        if (!item) {
          return '';
        }
        return `${utils.formatTime(item.value[0], 'yyyy-MM-dd hh:mm:ss')}<br/>${formatMetricValue(item.value[1], valueKind)}`;
      },
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        fontSize: 10,
        hideOverlap: true,
        formatter: (value) => utils.formatTime(value, 'hh:mm'),
      },
    },
    yAxis: {
      type: 'value',
      scale: true,
      splitNumber: 4,
      axisLabel: {
        fontSize: 10,
        hideOverlap: true,
        margin: 4,
        formatter: getYAxisFormatter(valueKind),
      },
    },
    series: [{
      type: 'line',
      showSymbol: false,
      smooth: true,
      data: seriesData,
    }],
  }, true);
  chart.resize();
}

function onChartClick(metric) {
  // Reserved for future detail page using the same single-metric API.
  void metric;
}

async function loadMetricChart(metric, token) {
  const start = new Date(state.range.start).getTime();
  const end = new Date(state.range.end).getTime();
  state.chartLoading[metric.metric_type] = true;
  try {
    const result = await Monitor.getPerformanceMetric({
      node_name: state.selectedNode,
      metric_type: metric.metric_type,
      start,
      end,
    });
    if (token !== loadToken) {
      return;
    }
    const { code, data } = result;
    if (!utils.isEqual(code, RESPONSE.SUCCESS)) {
      return;
    }
    await nextTick();
    renderChart(metric.metric_type, data?.points || [], data?.value_kind || metric.value_kind);
  } finally {
    if (token === loadToken) {
      state.chartLoading[metric.metric_type] = false;
    }
  }
}

async function loadCharts() {
  if (!state.selectedNode || !state.catalog.length) {
    return;
  }
  const start = new Date(state.range.start).getTime();
  const end = new Date(state.range.end).getTime();
  if (!isRangeValid(start, end)) {
    context.proxy.$toast({ icon: 'error', text: t('monitor.rangeTooLong') });
    return;
  }
  const token = ++loadToken;
  state.loading = true;
  disposeCharts();
  try {
    await Promise.all(state.catalog.map((metric) => loadMetricChart(metric, token)));
  } catch (error) {
    if (token === loadToken) {
      context.proxy.$toast({ icon: 'error', text: t('monitor.loadFailed') });
    }
  } finally {
    if (token === loadToken) {
      state.loading = false;
    }
  }
}

function onShortcutClick(item) {
  state.activeDurationMs = item.durationMs;
  const end = Date.now();
  state.range = {
    start: new Date(end - item.durationMs),
    end: new Date(end),
  };
}

async function loadNodes() {
  const result = await Monitor.getPerformanceNodes();
  const { code, data } = result;
  if (!utils.isEqual(code, RESPONSE.SUCCESS)) {
    return;
  }
  state.nodes = data?.items || [];
  if (!state.selectedNode && state.nodes.length > 0) {
    state.selectedNode = state.nodes[0];
  }
}

async function loadCatalog() {
  const result = await Monitor.getPerformanceCatalog();
  const { code, data } = result;
  if (!utils.isEqual(code, RESPONSE.SUCCESS)) {
    return;
  }
  state.catalog = data?.items || [];
}

watch(() => [state.range.start, state.range.end, state.selectedNode], () => {
  if (!isReady || !state.selectedNode) {
    return;
  }
  syncActiveDurationFromRange();
  loadCharts();
});

Promise.all([loadNodes(), loadCatalog()]).then(() => {
  nextTick(() => {
    state.range = createDefaultRange(MONITOR_DEFAULT_RANGE_MS);
    state.activeDurationMs = MONITOR_DEFAULT_RANGE_MS;
    isReady = true;
    if (state.selectedNode) {
      loadCharts();
    }
  });
});

function resizeCharts() {
  charts.forEach((chart) => chart.resize());
}

onMounted(() => {
  window.addEventListener('resize', resizeCharts);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', resizeCharts);
  disposeCharts();
});
</script>

<template>
  <PageSection title-key="monitor.pageTitle">
    <div class="cim-monitor-page">
      <div class="cim-as-tools cim-monitor-tools">
        <div class="cim-as-tool">
          <div
            class="cim-as-button"
            :class="{ 'cim-as-button-active': state.activeDurationMs === item.durationMs }"
            v-for="item in state.buttons"
            :key="item.durationMs"
            @click="onShortcutClick(item)"
          >{{ t(item.titleKey) }}</div>
          <div class="cim-as-date cicon cicon-date">
            <VDatePicker v-model.range="state.range" mode="dateTime" is24hr class="cim-as-date-picker">
              <template #default="{ togglePopover }">
                <div class="cim-as-date-content" @click="togglePopover">
                  {{ format(state.range.start) }} {{ t('common.word.to') }} {{ format(state.range.end) }}
                </div>
              </template>
            </VDatePicker>
          </div>
          <div class="cim-monitor-node">
            <label class="cim-monitor-node-label">{{ t('monitor.nodeLabel') }}</label>
            <select class="form-select" v-model="state.selectedNode" :disabled="!state.nodes.length">
              <option v-if="!state.nodes.length" value="">{{ t('monitor.nodeEmpty') }}</option>
              <option v-for="node in state.nodes" :key="node" :value="node">{{ node }}</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="state.loading" class="cim-monitor-loading">...</div>

      <div v-for="category in METRIC_MONITOR_CATEGORIES" :key="category" class="cim-monitor-section">
        <h3 class="cim-monitor-section-title">{{ t(`monitor.categories.${category}`) }}</h3>
        <div class="cim-monitor-grid">
          <div
            v-for="metric in metricsByCategory[category]"
            :key="metric.metric_type"
            class="cim-monitor-chart-card"
            @click="onChartClick(metric)"
          >
            <div class="cim-monitor-chart-title">{{ metricLabel(metric) }}</div>
            <div
              class="cim-monitor-chart-box"
              :ref="(el) => setChartEl(metric.metric_type, el)"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </PageSection>
</template>

<style scoped>
.cim-monitor-tools {
  margin-bottom: 16px;
}

.cim-monitor-node {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 220px;
}

.cim-monitor-node-label {
  white-space: nowrap;
  color: #666;
}

.cim-monitor-loading {
  margin-bottom: 12px;
  color: #666;
}

.cim-monitor-section {
  margin-bottom: 24px;
}

.cim-monitor-section-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
}

.cim-monitor-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}

.cim-monitor-chart-card {
  position: relative;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  background: #fff;
  padding: 12px;
  cursor: pointer;
}

.cim-monitor-chart-title {
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.cim-monitor-chart-box {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

@media (max-width: 1200px) {
  .cim-monitor-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 768px) {
  .cim-monitor-grid {
    grid-template-columns: 1fr;
  }
}
</style>
