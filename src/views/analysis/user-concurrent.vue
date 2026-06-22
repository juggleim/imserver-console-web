<script setup>
import { reactive, getCurrentInstance, nextTick, watch } from 'vue';
import utils from '../../common/utils';
import { ANA_DATE_RANGES } from '../../common/enum';
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
    let { asuserconcurrentchat } = context.refs;
    chat = context.proxy.$echat.init(asuserconcurrentchat);
  }
  let { daus, dates } = common.formatDauChat(result);
  const colors = ['#5470C6'];
  let option = {
    legend: {
      data: [t('analysis.userConcurrent.legendMaxConnect')]
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
        name: t('analysis.userConcurrent.legendMaxConnect'),
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

async function getConcurrentChat(params){
  let { data, code } = await Analysis.getMaxConnectChat(params);
  if(utils.isEqual(code, 0)){
    let { items } = data;
    return { items };
  }
  context.proxy.$toast({ icon: 'error', text: t('analysis.userConcurrent.fetchFailed') });
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
  let result = await getConcurrentChat(params);
  drawChat(result);
}
nextTick(() => {
  let { start, end } = common.getRangeDate(8);
  let params = { app_key, start, end };
  getConcurrentChat(params).then((result) => {
    drawChat(result);
  });
});

watch(() => state.range, async () => {
  let { start, end } = state.range;
  start = new Date(start).getTime();
  end = new Date(end).getTime();
  let params = { app_key, start, end };
  let result = await getConcurrentChat(params);
  drawChat(result);
})

</script>
<template>
  <div class="mb-4 cim-as-box">
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
      <div class="cim-bk-form" ref="asuserconcurrentchat">
      </div>
    </div>
  </div>
</template>
