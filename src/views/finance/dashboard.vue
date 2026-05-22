<script setup>
import { t } from '@/i18n';
</script>
<template>
    <div class="tab-content">
      <div class="tab-pane p-3 active">
        <div class="row cim-sw-row">
          <div class="col-sm-12 cim-fd-col">
            <div class="cim-fdb-form">
              <div class="cim-fdb-title">{{ t('legacyPages.finance.dashboard.availableBalance') }}</div>
              <div class="cim-fdb-body">
                <div class="cim-fdb-mods">
                  <div class="jd-fdb-mod">
                    <em class="cim-num">10200</em>
                    <span class="cim-num">.02</span>
                    <span class="cim-unit">{{ t('common.word.yuan') }}</span>
                  </div>
                  <div class="jd-fdb-mod">
                    <div class="cim-button cim-button-bg">{{ t('legacyPages.finance.dashboard.recharge') }}</div>
                  </div>
                  <div class="jd-fdb-mod">
                    <div class="cim-button cim-button-bd">{{ t('legacyPages.finance.dashboard.details') }}</div>
                  </div>
                  <!-- <div class="jd-fdb-mod">1|2|3</div> -->
                </div>
                <div class="cim-fdb-calcs">
                  <div class="jd-fdb-calc">
                    <div class="calc-title">{{ t('legacyPages.finance.dashboard.cashBalance') }}</div>
                    <div class="calc-value">0.00<span class="cim-unit">{{ t('common.word.yuan') }}</span></div>
                  </div>
                  <div class="jd-fdb-calc">-</div>
                  <div class="jd-fdb-calc cim-fdb-arrearage">
                    <div class="calc-title">{{ t('legacyPages.finance.dashboard.arrears') }}</div>
                    <div class="calc-value">0.00 <span class="cim-unit">{{ t('common.word.yuan') }}</span></div>
                  </div>
                  <div class="jd-fdb-calc">-</div>
                  <div class="jd-fdb-calc">
                    <div class="calc-title">{{ t('legacyPages.finance.dashboard.frozenAmount') }}</div>
                    <div class="calc-value">0.00 <span class="cim-unit">{{ t('common.word.yuan') }}</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
</template>
