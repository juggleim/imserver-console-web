<script setup>
import { reactive, getCurrentInstance, nextTick } from 'vue';
import utils from '../../common/utils';
import { useRouter } from "vue-router";
import { MsgManager } from "../../services";
import { ErrorType, STORAGE, RESPONSE, LOG_PULL_STATUS, PLATFORMAS } from '../../common/enum';
import Avatar from "../../components/avatar.vue";
import Storage from "../../common/storage";
import common from '../../common/common';
import { t } from '@/i18n';
import PageSection from '@/components/page-section.vue';

const context = getCurrentInstance();
let router = useRouter();
let { currentRoute: { _rawValue: { params: { app_key } } } } = router;
let defaultParams = {
  start: 0,
  limit: 50,
  app_key: app_key,
  keywords: '',
  target_id: '',
  channel_type: '',
};
let defaultMsgParams = {
  start: 0,
  limit: 50,
  app_key: app_key,
};
let state = reactive({
  params: utils.clone(defaultParams),
  msgParams: utils.clone(defaultMsgParams),
  list: [],
  isFinished: false,
  page: 1,
  lastScrollTop: 0,
  messages: [],
  current: {}
});
function format(date, fmt = 'yyyy-MM-dd') {
  return utils.formatTime(new Date(date).getTime(), fmt);
}
function onNext(){
  getConversaions({ scrollAfterAppend: true });
}
function onSearch(){
  state.params.start = 0;
  state.list = [];
  state.isFinished = false;
  state.messages = [];
  state.current = {};
  state.msgParams = utils.clone(defaultMsgParams);
  getConversaions();
}
function onConversation(item){
  utils.extend(state,{ messages: [], current: item, msgParams: utils.clone(defaultMsgParams), isMsgFinished: false });
  if(item.isGroup){
    state.msgParams.receiver_id = item.group.group_id;
  }else{
    state.msgParams.receiver_id = item.receiver.user_id;
  }
  state.msgParams.sender_id = item.sender.user_id;
  state.msgParams.channel_type = item.channel_type;
  nextTick(() => {
    let canscroll = true;
    let { messageList } = context.refs;
    messageList.addEventListener("scroll", debounce(() => {
      let scrollTop = messageList.scrollTop;
      if (scrollTop < 100) {
        getMessages(state.msgParams);
      }
    }, 200));

    getMessages(state.msgParams);
  })
}
function onCallback(result, text){
  let { code, msg } = result;
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      context.proxy.$toast({ icon: 'success', text: text });
    }else{
      context.proxy.$toast({ icon: 'error', text: t('common.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) });
    }
}

function removeMessage(message){
  state.messages = utils.filter(state.messages, (item) => {
    return !utils.isEqual(item.msg_id, message.msg_id);
  });
}

function getMessageActionParams(message){
  return {
    app_key,
    from_id: message.sender.user_id,
    target_id: state.msgParams.receiver_id,
    channel_type: state.msgParams.channel_type,
  };
}

function onRecallMessage(message){
  let params = {
    ...getMessageActionParams(message),
    msg_id: message.msg_id,
    exts: {},
  };
  MsgManager.recallMessage(params).then((result) => {
    onCallback(result, t('appServices.conversationList.feedback.recallSuccess'));
    if(utils.isEqual(result.code, RESPONSE.SUCCESS)){
      removeMessage(message);
    }
  });
}

function onDeleteMessage(message){
  let params = {
    ...getMessageActionParams(message),
    msgs: [{
      msg_id: message.msg_id,
      msg_time: message.msg_time,
      msg_read_index: message.msg_read_index,
    }],
  };
  MsgManager.deleteMessages(params).then((result) => {
    onCallback(result, t('appServices.conversationList.feedback.deleteSuccess'));
    if(utils.isEqual(result.code, RESPONSE.SUCCESS)){
      removeMessage(message);
    }
  });
}

function getConversaions(options = {}){
  let params = { ...state.params };

  MsgManager.getConversations(params).then((result) => {
    let { code, data, msg = '' } = result;
    if(utils.isEqual(code, RESPONSE.SUCCESS)){
      let { items } = data;
      items = utils.map(items, (item) => {
        let isGroup = item.channel_type == 2;
        item.isGroup = isGroup;
        item.formTime = format(item.time, 'yyyy-MM-dd hh:mm:ss');
        return item;
      });
      state.list = state.list.concat(items);
      if(!utils.isEmpty(items)){
        state.params.start = items[items.length - 1].time
      }
      state.isFinished = params.limit > items.length;
      if(options.scrollAfterAppend && !utils.isEmpty(items)){
        nextTick(() => {
          let { conversationBody } = context.refs;
          if(conversationBody){
            conversationBody.scrollBy({ top: 120, behavior: 'smooth' });
          }
        });
      }
    }else{
      context.proxy.$toast({ icon: 'error', text: t('common.feedback.requestFailed', { code, msg }, `Error: ${code} ${msg}`) });
    }
  });
}
getConversaions();

function getNum(message){
  let str = message.sender.user_id;
  return common.getAvatarNum(str);
}

function isActive(item){
  return utils.isEqual(item.time, state.current.time);
}
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};
async function getMessages(params){
  if(state.isMsgFinished){
    return;
  }
  let { messageList } = context.refs;
  const response = await MsgManager.getMessages(params);
  let { items: data } = response.data;
  data = data || [];
  if (data.length > 0) {
    const scrollTop = messageList.scrollTop;
    const previousHeight = messageList.scrollHeight;
    data.reverse();
    data = utils.map(data, (item) => {
      item.content = utils.isJSON(item.msg_content) ? utils.parse(item.msg_content) : item.msg_content;
      return item;
    });
    state.messages = data.concat(state.messages);
    state.msgParams.start = data[0].msg_time
    nextTick(() => {
      const newHeight = messageList.scrollHeight;
      // 计算新的滚动位置，保持视觉连续性
      messageList.scrollTop = scrollTop + (newHeight - previousHeight - 200);
    });
  }
  state.isMsgFinished = state.msgParams.limit > data.length
}

</script>
<template>
   <PageSection
    title-key="menu.message.conversations"
    shell-class="cim-conversation-page"
    :body-class="['cim-log-contanier', 'cim-conversation-page-content']"
  >
    <div class="cim-log-header">
      <ul class="cim-log-header-lf-box">
        <!-- <li class="cim-log-lf-item">
          <input class="form-control" type="text" v-model="state.params.user_id" placeholder="User ID" autocomplete="off" @keydown.enter="onSearch">
        </li> -->
        <li class="cim-log-lf-item">
          <select class="form-select" v-model="state.params.channel_type">
            <option value="">{{ t('appServices.conversationList.field.channelType') }}</option>
            <option :value="1">{{ t('appServices.conversationList.channel.private') }}</option>
            <option :value="2">{{ t('appServices.conversationList.channel.group') }}</option>
          </select>
        </li>
        <li class="cim-log-lf-item">
          <input class="form-control" type="text" v-model="state.params.keywords" :placeholder="t('appServices.conversationList.field.userName')" autocomplete="off" @keydown.enter="onSearch">
        </li>
        <li class="cim-log-lf-item">
          <input class="form-control" type="text" v-model="state.params.target_id" :placeholder="t('appServices.conversationList.field.targetId')" autocomplete="off" @keydown.enter="onSearch">
        </li>
        <li class="cim-log-lf-item">
          <div class="cim-button cim-button-bg" @click="onSearch">{{ t('common.action.search') }}</div>
        </li>
      </ul>
    </div>
    <div class="cim-conversationlist-body">
      <div class="cim-conversation-wrapper">
        <div class="cim-conversation-body" ref="conversationBody">
          <table class="table cim-table">
          <thead>
            <tr>
              <th class="cim-td-c center">{{ t('appServices.conversationList.table.conversationType') }}</th>
              <th class="cim-td-c">{{ t('appServices.conversationList.table.conversationInfo') }}</th>
              <th class="cim-td-c">{{ t('appServices.conversationList.table.lastMessageTime') }}</th>
              <th class="cim-td-c">{{ t('appServices.conversationList.table.operation') }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in state.list" :class="[isActive(item) ? 'selected' : '']">
              <td class="cim-td-c cim-conver-type">
                <span class="tip" :class="[item.isGroup ? 'group-tip' : 'user-tip']">{{ item.isGroup ? t('appServices.conversationList.channel.group') : t('appServices.conversationList.channel.private') }}</span>
              </td>
              <td class="cim-td-c">
                <div class="cim-conver-info-box" v-if="item.isGroup">
                  <div class="cim-userlist-info cim-conver-info">
                    <Avatar :user-id="item.group.group_id" :name="item.group.group_name" :avatar="item.group.group_portrait" :cls="'cim-xsmall-avatar'"></Avatar>
                    <div class="nickname">{{ item.group.group_name }}</div>
                  </div>  
                </div>
                <div class="cim-conver-info-box" v-else>
                  <div class="cim-userlist-info cim-conver-info">
                    <Avatar :user-id="item.receiver.user_id" :name="item.receiver.nickname || item.receiver.user_id" :avatar="item.receiver.avatar" :cls="'cim-xsmall-avatar'"></Avatar>
                    <div class="nickname">{{ item.receiver.nickname || item.receiver.user_id }}</div>
                  </div> ~ 
                  <div class="cim-userlist-info cim-conver-info">
                    <Avatar :user-id="item.sender.user_id" :name="item.sender.nickname || item.sender.user_id" :avatar="item.sender.avatar" :cls="'cim-xsmall-avatar'"></Avatar>
                    <div class="nickname">{{ item.sender.nickname || item.sender.user_id }}</div>
                  </div>  
                </div>
              </td>
              <td class="cim-td-c">{{ item.formTime }}</td>
              <td class="cim-td-c">
                <ul class="cim-table-tools">
                  <li class="cim-table-tool">
                    <a class="btn-link" href="#" @click="onConversation(item)">{{ t('appServices.conversationList.action.viewMessages') }}</a>
                  </li>
                </ul>
              </td>
            </tr>
          </tbody>
        </table>
        </div>
        <div class="cim-conversation-footer">
          <nav class="cim-navigation">
            <ul class="pagination">
              <li class="page-item">
                <a class="page-link" href="#" v-if="!state.isFinished"  aria-label="Next" @click="onNext">
                  <span aria-hidden="true">{{ t('common.action.nextPage') }}</span>
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div class="cim-message-wrapper" v-if="!utils.isEmpty(state.current)">
        <div class="header">
          <div class="conversation-info">
            <div class="cim-conver-type">
              <span class="tip" :class="[state.current.isGroup ? 'group-tip' : 'user-tip']">{{ state.current.isGroup ? t('appServices.conversationList.channel.group') : t('appServices.conversationList.channel.private') }}</span>
            </div>
            <div class="cim-conver-info-box" v-if="state.current.isGroup">
            <div class="cim-userlist-info cim-conver-info">
                <Avatar :user-id="state.current.group.group_id" :name="state.current.group.group_name" :avatar="state.current.group.group_portrait" :cls="'cim-xsmall-avatar'"></Avatar>
                <div class="nickname">{{ state.current.group.group_name }}</div>
              </div>  
            </div>
            <div class="cim-conver-info-box" v-else>
              <div class="cim-userlist-info cim-conver-info">
                <Avatar :user-id="state.current.receiver.user_id" :name="state.current.receiver.nickname || state.current.receiver.user_id" :avatar="state.current.receiver.avatar" :cls="'cim-xsmall-avatar'"></Avatar>
                <div class="nickname">{{ state.current.receiver.nickname || state.current.receiver.user_id }}</div>
              </div> ~ 
              <div class="cim-userlist-info cim-conver-info">
                <Avatar :user-id="state.current.sender.user_id" :name="state.current.sender.nickname || state.current.sender.user_id" :avatar="state.current.sender.avatar" :cls="'cim-xsmall-avatar'"></Avatar>
                <div class="nickname">{{ state.current.sender.nickname || state.current.sender.user_id }}</div>
              </div>  
            </div>
          </div>
        </div>
        <div class="body">
          <ul class="message-list" ref="messageList">
            <li class="message-item" v-for="(message, index) in state.messages">
              <Avatar :user-id="message.sender.user_id" :name="message.sender.nickname" :avatar="message.sender.avatar" :cls="'cim-small-avatar'"></Avatar>
              <div class="message-content" :class="['jg-peer-color-' + getNum(message)]">
                <div class="message-header">
                  <div class="message-sender">{{ message.sender.nickname || message.sender.user_id }}</div>
                </div>
                <div class="message-text" v-if="message.msg_type == 'jg:text'">{{ message.content.content }}</div>
                <div class="message-image" v-else-if="message.msg_type == 'jg:img'">
                  <img :src="message.content.thumbnail" class="cim-msg-image" alt/>
                </div>
                <div class="message-image" v-else-if="message.msg_type == 'jg:video'">
                  <video :src="message.content.url" ref="video" class="cim-msg-image" controls></video>
                </div>
                <div class="message-file" v-else-if="message.msg_type == 'jg:file'">
                  <a :href="message.content.url" class="cim-msg-file" :download="message.content.name">
                     <div class="cim-file-group">
                      <div class="cicon cicon-file"></div>
                      <div class="cim-file-info">
                        <h6 class="name">{{ message.content.name }}</h6>
                        <div class="meta">{{ (Number(message.content.size) || 0).toFixed(2) }} KB</div>
                      </div>
                    </div>
                  </a>
                </div>
                <div class="message-text" v-else>
                  <div>MessageType : {{  message.msg_type }}</div>
                  <div>MessageContent : {{  message.content }}</div>
                </div>
                <div class="message-time">{{ format(message.msg_time, 'yyyy-MM-dd hh:mm:ss') }}</div>
                <div class="message-actions">
                  <a class="btn-link" href="#" @click.prevent="onDeleteMessage(message)">{{ t('common.action.delete') }}</a>
                  <a class="btn-link" href="#" @click.prevent="onRecallMessage(message)">{{ t('common.action.recall') }}</a>
                </div>
              </div>
            </li>
            <li>
              <div class="none" v-if="state.isMsgFinished && state.messages.length == 0">{{ t('appServices.conversationList.message.empty') }}</div>
            </li>
          </ul>
          
        </div>
      </div>
    </div>
  </PageSection>
</template>
