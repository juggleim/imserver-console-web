<script setup>
import { reactive, getCurrentInstance, nextTick, watch } from 'vue';
import utils from '../../common/utils';
import { ErrorType, STORAGE, RESPONSE, STAT_TYPE, CONVERSATION_TYPE, ANA_DATE_RANGES } from '../../common/enum';
import { useRouter } from "vue-router";
import common from "../../common/common";
import { Analysis } from "../../services";
import { t } from '@/i18n';

const context = getCurrentInstance();
let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;

let state = reactive({
  buttons: ANA_DATE_RANGES,
  range: {
    start: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    end: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
  },
});

let chat = null;
function drawChat(result){
  if(!chat){
    let { asuserchat } = context.refs;
    chat = context.proxy.$echat.init(asuserchat);
  }
  let { daus, dates } = common.formatDauChat(result);
  const colors = ['#5470C6'];
  let option = {
    legend: {
      data: [t('analysis.user.legendDau')]
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
        name: t('analysis.user.legendDau'),
        type: 'line',
        smooth: true,
        data: daus,
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
      }
    ]
  };
  chat.setOption(option);
}

async function getUserChat(params){
  let { data, code } = await Analysis.getUserChat({ ...params, channel_type: CONVERSATION_TYPE.PRIVATE });
  if(utils.isEqual(code, 0)){
    let { items } = data;
    return { items };
  }
  context.proxy.$toast({ icon: 'error', text: t('analysis.user.fetchFailed') });
  return { items: [] };
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
  let result = await getUserChat(params);
  drawChat(result);
}
nextTick(() => {
  let { start, end } = common.getRangeDate(8);
  let params = { app_key, start, end };
  getUserChat(params).then((result) => {
    drawChat(result);
  });
});

watch(() => state.range, async () => {
  let { start, end } = state.range;
  start = new Date(start).getTime();
  end = new Date(end).getTime();
  let params = { app_key, start, end };
  let result = await getUserChat(params);
  drawChat(result);
})


</script>
<template>
  <div class="mb-4 cim-as-box">
    <!-- <div class="row cim-cb-row cim-as-header">
      <div class="cim-bk-form">
        <div class="row cim-asr-row">
          <div class="col-sm-4 cim-asr-col">
            <span class="cim-ars-memo">Peak DAU This Month</span>
            <div class="cim-ars-num">1,029</div>
          </div>
          <div class="col-sm-4 cim-asr-col">
            <span class="cim-ars-memo">New Users Yesterday</span>
            <div class="cim-ars-num">2,000</div>
            <div class="cim-ars-percent">
              vs previous day<span class="cicon cicon-ac-up cim-ars-direction">10%</span>
            </div>
          </div>
          <div class="col-sm-4 cim-asr-col">
            <span class="cim-ars-memo">Total Users as of Yesterday</span>
            <div class="cim-ars-num">3,043</div>
          </div>
        </div>
      </div>
    </div> -->
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
      <div class="cim-bk-form" ref="asuserchat">
      </div>
    </div>
  </div>
</template>
