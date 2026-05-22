<script setup>
import { useRouter } from "vue-router";
import { reactive, watch } from 'vue';
import utils from "../../common/utils";
import Stroage from "../../common/storage";
import { STORAGE } from "../../common/enum";
import menuTools from "./menu-tools";
import appTools from '../../common/app-tools';
import { t } from '@/i18n';

const props = defineProps(["isCollapse", "isHome"]);
const router = useRouter();
let useRouterCurrent = reactive(router);

let state = reactive({
  menus: []
});
menuTools.setMenuConfig({ state, router });

function updateActive(active){
  state.menus.map((_menu) => {
    _menu.isActive = !_menu.children && utils.isEqual(active.name, _menu.name);
    if(_menu.children){
      _menu.children = _menu.children.map((child) => {
        child.isActive = utils.isEqual(active.name, child.name);
        return child;
      });
    }
    return _menu;
  });
}
let onFold = (menu) => {
  state.menus.map((_menu) => {
    if(utils.isEqual(menu.title, _menu.title)){
      _menu.isUnfold = !_menu.isUnfold;
    }
    return _menu;
  });
};

let onNavigate = (menu) => {
  if(menu.children){
    return onFold(menu);
  }
  let currentApp = appTools.getCurrent();
  router.push({ name: menu.name, params: { app_key: currentApp.app_key } });
}

watch(useRouterCurrent, (n) =>{
  let { currentRoute: { name } } = n;
  if(!menuTools.isSameGroup(state.menus, name)){
    menuTools.showMenus(router);
  }
  if(utils.isEqual(name, 'Dashboard')){
    state.menus = [];
  }
  updateActive({ name })
});

function onLogout(){
  Stroage.remove(STORAGE.USER_TOKEN);
  router.push({ name: 'Login' });
}
let { currentRoute: { _rawValue: { name } } } = router;

//非首页，根据 URL 展示菜单
if(!utils.isEqual(name, 'Dashboard')){
  menuTools.showMenus(router);
}
// 展示菜单后更新选中状态，和展示菜单先后顺序不能改变
updateActive({ name });
</script>
<template>
  <div
    class="sidebar cim-sider-shell"
    :class="{ 'hide': props.isCollapse && utils.isMobile(), 'show': props.isCollapse && utils.isMobile(), 'hide': props.isHome }"
    id="sidebar"
  >
    <div class="cim-sider-panel">
      <ul class="sidebar-nav cim-sidebar-nav" data-coreui="navigation" data-simplebar>
        <li
          class="nav-group cim-sidebar-group"
          v-for="menu in state.menus"
          :key="menu.name || menu.title"
          :class="{ 'show': menu.isUnfold, 'hideMenu': menu.isHidden }"
        >
          <div
            class="nav-link cicon cim-sidebar-link cim-sidebar-link-root"
            :class="{ 'active': menu.isActive, 'is-open': menu.isUnfold, 'is-parent': menu.children }"
            @click="onNavigate(menu)"
          >
            <span class="cim-nav-icon cicon" :class="[menu.icon]"></span>
            <span class="cim-sidebar-label">{{ t(menu.title) }}</span>
            <span
              v-if="menu.children"
              class="cim-sidebar-arrow cicon cicon-right-arrow"
              :class="{ 'is-open': menu.isUnfold }"
            ></span>
          </div>
          <ul v-if="menu.children" class="nav-group-items compact cim-sidebar-children">
            <li
              class="nav-item cim-sidebar-child-item"
              v-for="child in menu.children"
              :key="child.name || child.title"
              :class="{ 'hideMenu': child.isHidden }"
            >
              <div
                class="nav-link cicon cim-sidebar-link cim-sidebar-link-child"
                :class="{ 'active': child.isActive }"
                @click="onNavigate(child)"
              >
                <span class="cim-sidebar-child-label">{{ t(child.title) }}</span>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </div>
    <div class="sidebar-footer cim-sider-footer">
      <div class="cicon cicon-logout cim-button cim-sider-logout" @click="onLogout">{{ t('common.header.logout') }}</div>
    </div>
  </div>
</template>
