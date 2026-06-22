<script setup>
import { reactive, watch, getCurrentInstance, nextTick, computed } from 'vue';
import utils from '../../common/utils';
import { Analysis, Application } from "../../services";
import { RESPONSE, CONVERSATION_TYPE, ANA_REALTIME_RANGES } from '../../common/enum';
import { useRouter } from "vue-router";
import { t } from '@/i18n';

const REALTIME_STAT_SWITCH_KEY = 'open_real_time_msg_statistic';

const THREE_DAYS_MS = 3 * 24 * 60 * 60 * 1000;
const ONE_HOUR_MS = 60 * 60 * 1000;
const SIX_HOURS_MS = 6 * ONE_HOUR_MS;
const TWELVE_HOURS_MS = 12 * ONE_HOUR_MS;
const ONE_DAY_MS = 24 * ONE_HOUR_MS;

function getRealtimeBucketMs(rangeMs) {
  if (rangeMs <= ONE_HOUR_MS) {
    return 30 * 1000;
  }
  if (rangeMs <= SIX_HOURS_MS) {
    return 60 * 1000;
  }
  if (rangeMs <= TWELVE_HOURS_MS) {
    return 5 * 60 * 1000;
  }
  if (rangeMs <= ONE_DAY_MS) {
    return 10 * 60 * 1000;
  }
  return 15 * 60 * 1000;
}

function createDefaultRange(durationMs = ONE_HOUR_MS) {
  const end = Date.now();
  return {
    start: new Date(end - durationMs),
    end: new Date(end),
  };
}

const context = getCurrentInstance();
let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;

let state = reactive({
  activeDurationMs: ONE_HOUR_MS,
  buttons: ANA_REALTIME_RANGES,
  channelType: CONVERSATION_TYPE.PRIVATE,
  channelTypes: [
    { labelKey: 'analysis.messageRealtime.channelPrivate', value: CONVERSATION_TYPE.PRIVATE },
    { labelKey: 'analysis.messageRealtime.channelGroup', value: CONVERSATION_TYPE.GROUP },
    { labelKey: 'analysis.messageRealtime.channelChatroom', value: CONVERSATION_TYPE.CHATROOM },
  ],
  range: createDefaultRange(ONE_HOUR_MS),
  switchItem: {
    id: REALTIME_STAT_SWITCH_KEY,
    name: 'Enable realtime message statistics',
    labelKey: 'analysis.messageRealtime.switchLabel',
    value: 0,
  },
});

const isRealtimeStatEnabled = computed(() => Number(state.switchItem.value) === 1);

let chat = null;
let isReady = false;

function syncActiveDurationFromRange() {
  const duration = new Date(state.range.end).getTime() - new Date(state.range.start).getTime();
  const matched = ANA_REALTIME_RANGES.find((btn) => Math.abs(btn.durationMs - duration) < 3000);
  state.activeDurationMs = matched ? matched.durationMs : null;
}

function isRangeValid(start, end) {
  return end - start > 0 && end - start <= THREE_DAYS_MS;
}

function alignBucket(timeMark, bucketMs) {
  return Math.floor(timeMark / bucketMs) * bucketMs;
}

function fillSeriesPoints(items, rangeStart, rangeEnd, bucketMs) {
  const valueMap = new Map();
  (items || []).forEach((item) => {
    valueMap.set(alignBucket(item.time_mark, bucketMs), item.count);
  });
  const points = [];
  let t = Math.ceil(rangeStart / bucketMs) * bucketMs;
  while (t <= rangeEnd) {
    points.push([t, valueMap.has(t) ? valueMap.get(t) : 0]);
    t += bucketMs;
  }
  return points;
}

function formatAvgPerSec(value) {
  return Number(value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getAxisLabelFormatter(rangeMs) {
  const bucketMs = getRealtimeBucketMs(rangeMs);
  return (value) => {
    if (bucketMs <= 30 * 1000) {
      return utils.formatTime(value, 'hh:mm:ss');
    }
    if (bucketMs <= 60 * 1000) {
      return utils.formatTime(value, 'hh:mm');
    }
    return utils.formatTime(value, 'MM-dd hh:mm');
  };
}

function drawChat(result, rangeStart, rangeEnd) {
  if (!chat) {
    let { asrealtimechat } = context.refs;
    chat = context.proxy.$echat.init(asrealtimechat);
  }
  const rangeMs = rangeEnd - rangeStart;
  const bucketMs = getRealtimeBucketMs(rangeMs);
  const upData = fillSeriesPoints(result.upMsgs, rangeStart, rangeEnd, bucketMs);
  const downData = fillSeriesPoints(result.downMsgs, rangeStart, rangeEnd, bucketMs);
  const disData = fillSeriesPoints(result.disMsgs, rangeStart, rangeEnd, bucketMs);
  const pointCount = Math.max(upData.length, downData.length, disData.length);
  const colors = ['#5470C6', '#008000', '#EE6666'];
  let option = {
    legend: {
      data: [
        t('analysis.messageRealtime.legendUp'),
        t('analysis.messageRealtime.legendDown'),
        t('analysis.messageRealtime.legendDispatch')
      ]
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      formatter(params) {
        if (!params || !params.length) {
          return '';
        }
        const bucketMs = getRealtimeBucketMs(rangeEnd - rangeStart);
        const timeFmt = bucketMs <= 30 * 1000 ? 'yyyy-MM-dd hh:mm:ss' : 'yyyy-MM-dd hh:mm';
        const time = utils.formatTime(params[0].value[0], timeFmt);
        const lines = [time];
        params.forEach((item) => {
          lines.push(`${item.marker}${item.seriesName}: ${formatAvgPerSec(item.value[1])}`);
        });
        return lines.join('<br/>');
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: 24,
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      min: rangeStart,
      max: rangeEnd,
      boundaryGap: false,
      axisLabel: {
        formatter: getAxisLabelFormatter(rangeMs),
        hideOverlap: true,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: (value) => formatAvgPerSec(value),
      },
      axisPointer: {
        label: {
          formatter: function (params) {
            return formatAvgPerSec(params.value);
          }
        }
      }
    },
    series: [
      {
        name: t('analysis.messageRealtime.legendUp'),
        type: 'line',
        smooth: true,
        showSymbol: pointCount <= 120,
        data: upData,
        lineStyle: { color: colors[0] },
      },
      {
        name: t('analysis.messageRealtime.legendDown'),
        type: 'line',
        smooth: true,
        showSymbol: pointCount <= 120,
        lineStyle: { color: colors[1] },
        data: downData,
      },
      {
        name: t('analysis.messageRealtime.legendDispatch'),
        type: 'line',
        smooth: true,
        showSymbol: pointCount <= 120,
        lineStyle: { color: colors[2] },
        data: disData,
      }
    ]
  };
  chat.setOption(option, true);
}

async function getRealtimeMessageChat(params) {
  let { data, code } = await Analysis.getRealtimeMessageChat(params);
  if (!utils.isEqual(code, RESPONSE.SUCCESS)) {
    context.proxy.$toast({ icon: 'error', text: t('analysis.messageRealtime.fetchFailed') });
    return { disMsgs: [], downMsgs: [], upMsgs: [] };
  }
  let { msg_dispatch = { items: [] }, msg_down = { items: [] }, msg_up = { items: [] } } = data;
  return {
    disMsgs: msg_dispatch.items || [],
    downMsgs: msg_down.items || [],
    upMsgs: msg_up.items || [],
  };
}

function format(date) {
  return utils.formatTime(new Date(date).getTime(), 'yyyy-MM-dd hh:mm');
}

async function loadChart() {
  if (!isRealtimeStatEnabled.value) {
    return;
  }
  let { start, end } = state.range;
  start = new Date(start).getTime();
  end = new Date(end).getTime();
  if (!isRangeValid(start, end)) {
    context.proxy.$toast({ icon: 'error', text: t('analysis.messageRealtime.rangeTooLarge') });
    return;
  }
  let params = { app_key, start, end, channel_type: state.channelType };
  let result = await getRealtimeMessageChat(params);
  drawChat(result, start, end);
}

function onShortcutClick(item) {
  const end = Date.now();
  state.range = {
    start: new Date(end - item.durationMs),
    end: new Date(end),
  };
}

function loadSetting() {
  if (utils.isEmpty(app_key)) {
    return Promise.resolve();
  }
  return Application.getSetting({
    app_key,
    config_keys: [REALTIME_STAT_SWITCH_KEY],
  }).then(({ data }) => {
    if (utils.isEmpty(data)) {
      return;
    }
    const val = data.configs?.[REALTIME_STAT_SWITCH_KEY];
    state.switchItem.value = utils.isEmpty(val) ? 0 : Number(val);
  });
}

function onSwitchSave(item) {
  Application.updateSetting({ ...item, app_key }).then(() => {
    state.switchItem.value = Number(item.value);
    context.proxy.$toast({ icon: 'success', text: t('analysis.messageRealtime.switchSaveSuccess') });
    if (Number(item.value) === 1 && isReady) {
      loadChart();
    }
  });
}

function onSwitchToggle(e) {
  onSwitchSave({
    id: REALTIME_STAT_SWITCH_KEY,
    value: Number(e.target.checked),
  });
}

watch(() => [state.range.start, state.range.end, state.channelType], () => {
  if (!isReady || !isRealtimeStatEnabled.value) {
    return;
  }
  syncActiveDurationFromRange();
  loadChart();
});

loadSetting().then(() => {
  nextTick(() => {
    state.range = createDefaultRange(ONE_HOUR_MS);
    state.activeDurationMs = ONE_HOUR_MS;
    isReady = true;
    if (isRealtimeStatEnabled.value) {
      loadChart();
    }
  });
});

</script>
<template>
  <div class="mb-4 cim-as-box cim-realtime-as-box">
    <div class="cim-realtime-stat-switch cim-switch-page">
      <div class="cim-realtime-stat-row">
        <span class="cim-realtime-stat-label">{{ t('analysis.messageRealtime.switchLabel') }}</span>
        <div class="form-check form-switch cim-realtime-stat-toggle">
          <input
            class="form-check-input"
            type="checkbox"
            :checked="isRealtimeStatEnabled"
            @change="onSwitchToggle"
          />
        </div>
      </div>
    </div>
    <template v-if="isRealtimeStatEnabled">
      <div class="cim-as-tools">
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
          <div class="cim-as-channel">
            <select class="form-select" v-model="state.channelType">
              <option v-for="item in state.channelTypes" :key="item.value" :value="item.value">
                {{ t(item.labelKey) }}
              </option>
            </select>
          </div>
        </div>
      </div>
      <div class="row cim-as-body">
        <div class="cim-bk-form" ref="asrealtimechat"></div>
      </div>
    </template>
  </div>
</template>
<style scoped>
.cim-realtime-as-box {
  align-items: stretch;
}

.cim-realtime-stat-switch {
  width: 100%;
  padding: 16px 0 12px;
  margin: 0;
  border: none;
  background: transparent;
  box-shadow: none;
}

.cim-realtime-stat-row {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 12px;
}

.cim-realtime-stat-label {
  flex: none;
  margin: 0;
  font-size: 14px;
  line-height: 22px;
  font-weight: 400;
  color: #5d5d5d;
  white-space: nowrap;
}

.cim-realtime-stat-toggle {
  flex: none;
  padding-left: 0;
  margin: 0;
  min-height: 22px;
}

.cim-realtime-stat-toggle .form-check-input {
  float: none;
  width: 2.5em;
  height: 1.25em;
  margin: 0;
  cursor: pointer;
}

.cim-as-button {
  border: 1px solid #d8d8d8;
  border-radius: 2px;
  margin-right: 4px;
  background-color: #fff;
  color: #333;
}
.cim-as-button.cim-as-button-active {
  background-color: #0741d1;
  border-color: #0741d1;
  color: #fff;
}
</style>
