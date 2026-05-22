<script setup>
import { reactive, watch } from "vue";
import utils from "../common/utils";
import common from "../common/common";


const props = defineProps(["avatar", "name", "userId", "cls"]);
const emit = defineEmits([""]);

let state = reactive({});

function formatName(name = ''){
  let letter = '';
  if(name.length > 0){
    letter = name.split('')[0];
  }
  return letter.toUpperCase() ;
}
function getNum(){
  let { name = '', userId = '' } = props;
  let str = userId || name;
  return common.getAvatarNum(str);
}
</script>

<template>
 	<div class="cim-avatar" :class="props.cls" :style="{'background-image': 'url('+ props.avatar +')'}">
		<div class="inner" v-if="!props.avatar" :class="['jg-peer-color-' + getNum()]">
      {{formatName(props.name)}}
    </div>
    <slot></slot>
	</div>
</template>
