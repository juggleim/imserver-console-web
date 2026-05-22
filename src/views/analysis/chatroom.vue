<script setup>
import { reactive, watch, getCurrentInstance, nextTick } from 'vue';
import utils from '../../common/utils';
import { Analysis } from "../../services";
import { ErrorType, STORAGE, RESPONSE, STAT_TYPE, CONVERSATION_TYPE, ANA_DATE_RANGES } from '../../common/enum';
import common from "../../common/common";
import { useRouter } from "vue-router";
import AnalysisDay from '../../components/analysis-day.vue';
import { t } from '@/i18n';
const context = getCurrentInstance();
let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;

let state = reactive({
  buttons: ANA_DATE_RANGES,
  range: {
    start: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    end: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
  },
  yestday: {
    upMsg: { percent: 0, isUp: true, count: 0 },
    downMsg: { percent: 0, isUp: true, count: 0 },
    disMsg: { percent: 0, isUp: true, count: 0 },
    online: { percent: 0, isUp: true, count: 0 },
  }
});

let chat = null;
function drawChat(result){
  if(!chat){
    let { asuserchat } = context.refs;
    chat = context.proxy.$echat.init(asuserchat);
  }
  let { upMsgs, downMsgs, disMsgs, dates } = common.formatChatData(result);
  const colors = ['#5470C6', '#008000', '#EE6666'];
  let option = {
    legend: {
      data: [
        t('analysis.chatroom.legendUp'),
        t('analysis.chatroom.legendDown'),
        t('analysis.chatroom.legendDispatch')
      ]
    },
    tooltip: {
      trigger: 'none',
      axisPointer: {
        type: 'cross'
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: dates
    },
    yAxis: {
      type: 'value',
      axisPointer: {
        label: {
          formatter: function (params) {
            return utils.numberWithCommas(params.value.toFixed(0))
          }
        }  
      }
    },
    series: [
      {
        name: t('analysis.chatroom.legendUp'),
        type: 'line',
        smooth: true,
        data: upMsgs,
        lineStyle: {
          color: colors[0]
        },
        label: {
          show: true,
          position: 'top',
          formatter: function (params) {
            return utils.numberWithCommas(params.value.toFixed(0))
          }
        },
      },
      {
        name: t('analysis.chatroom.legendDown'),
        type: 'line',
        smooth: true,
        lineStyle: {
          color: colors[1]
        },
        data: downMsgs,
        label: {
          show: true,
          position: 'top',
          formatter: function (params) {
            return utils.numberWithCommas(params.value.toFixed(0))
          }
        },
      },
      {
        name: t('analysis.chatroom.legendDispatch'),
        type: 'line',
        smooth: true,
        lineStyle: {
          color: colors[2]
        },
        data: disMsgs,
        label: {
          show: true,
          position: 'top',
          formatter: function (params) {
            return utils.numberWithCommas(params.value.toFixed(0))
          }
        },
      }
    ]
  };
  chat.setOption(option);
}

async function getMessageChat(params){
  let { data } = await Analysis.getMessageChat({ ...params, channel_type: CONVERSATION_TYPE.CHATROOM });
  let { msg_dispatch = { items: [] }, msg_down = { items: [] }, msg_up = { items: [] } } = data;
  let func = (a, b) => { return a.time_mark > b.time_mark;}
  let disMsgs = utils.sort(msg_dispatch.items, func);
  let downMsgs = utils.sort(msg_down.items, func);
  let upMsgs = utils.sort(msg_up.items, func);
  return { disMsgs, downMsgs, upMsgs };
}

function format(date) {
  return utils.formatTime(new Date(date).getTime(), 'yyyy-MM-dd');
}

async function onTabDateClicker(item){
  utils.map(state.buttons, (btn) => {
    btn.isActive = utils.isEqual(btn.name, item.name);
    return btn;
  });
  let { start, end } = common.getRangeDate(item.name);
  let params = { app_key, start, end };
  let result = await getMessageChat(params);
  drawChat(result);
}
nextTick(() => {
  let { start, end } = common.getRangeDate(8);
  let params = { app_key, start, end };
  getMessageChat(params).then((result) => {
    let yesterday = common.calcYesterday(result);
    // utils.extend(yesterday, { online: { count: 0, isUp: false, percent: 0} })
    utils.extend(state.yestday, yesterday);  
    drawChat(result);
  });
});

watch(() => state.range, async () => {
  let { start, end } = state.range;
  start = new Date(start).getTime();
  end = new Date(end).getTime();
  let params = { app_key, start, end };
  let result = await getMessageChat(params);
  drawChat(result);
})

</script>
<template>
  <div class="mb-4 cim-as-box">
    <div class="row cim-cb-row cim-as-header">
      <div class="cim-bk-form">
        <div class="row cim-asr-row">
          <AnalysisDay :title="t('analysis.chatroom.dayUp')" :item="state.yestday.upMsg"></AnalysisDay>
          <AnalysisDay :title="t('analysis.chatroom.dayDown')" :item="state.yestday.downMsg"></AnalysisDay>
          <AnalysisDay :title="t('analysis.chatroom.dayDispatch')" :item="state.yestday.disMsg"></AnalysisDay>
          <!-- <AnalysisDay :title="'昨日聊天室同时在线峰值（人）'" :item="state.yestday.online"></AnalysisDay> -->
        </div>
      </div>
    </div>
    <div class="cim-as-tools">
      <div class="cim-as-tool">
        <div class="cim-as-button" :class="{'cim-as-button-active': item.isActive}" v-for="item in state.buttons" @click="onTabDateClicker(item)">{{ item.titleKey ? t(item.titleKey, {}, item.title) : item.title }}</div>
        <div class="cim-as-date cicon cicon-date">
          <VDatePicker v-model.range="state.range" class="cim-as-date-picker">
            <template #default="{ togglePopover }">
              <div class="cim-as-date-content" @click="togglePopover">{{ format(state.range.start) }} {{ t('common.word.to') }} {{ format(state.range.end) }}</div>
            </template>
          </VDatePicker>
        </div>
      </div>

    </div>
    <div class="row cim-as-body">
      <div class="cim-bk-form" ref="asuserchat"></div>
    </div>
  </div>
</template>
