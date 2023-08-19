<template>
  <div class="page-main app">
    <ServiceBaseInfo service-name="counter" />
    <div class="content">
      <div
        v-for="(item, index) in counterList"
        :key="item.id"
        class="counter q-mb-md"
      >
        <p class="label">{{ $t('counter.title') }}: {{ index + 1 }}</p>
        <div class="bg-white counter-item-content">
          <div class="row counter-item-main">
            <q-btn
              class="decrease row items-center justify-center"
              :color="
                item.instance.value <= item.instance.conf.min
                  ? 'grey-4'
                  : 'primary'
              "
              square
              unelevated
              @click="() => handleDecrease(item)"
            >
              <q-icon name="remove"></q-icon>
            </q-btn>
            <div
              class="counter-item-content row flex-1 items-center justify-center"
            >
              <p class="text">{{ item.instance.value }}</p>
            </div>
            <q-btn
              class="increase row items-center justify-center"
              :color="
                item.instance.value >= item.instance.conf.max
                  ? 'grey-4'
                  : 'primary'
              "
              square
              unelevated
              @click="() => handleIncrease(item)"
            >
              <q-icon name="add"></q-icon>
            </q-btn>
          </div>
          <div class="row counter-item-actions">
            <q-btn
              class="btn flex-1"
              @click="() => handleRemove(item.id)"
              :color="counterList.length === 1 ? 'grey-4' : 'negative'"
              square
              unelevated
              :disable="counterList.length === 1"
            >
              <span>{{ $t('counter.remove') }}</span>
            </q-btn>
            <q-btn
              class="btn flex-1"
              color="warning"
              square
              unelevated
              @click="() => handleReset(item.id)"
            >
              <span>{{ $t('counter.reset') }}</span>
            </q-btn>
            <q-btn
              class="btn flex-1"
              color="info"
              square
              unelevated
              @click="() => handleSetting(item.id)"
            >
              <span>{{ $t('counter.setting') }}</span>
            </q-btn>
          </div>
        </div>
      </div>
      <div class="row justify-center">
        <q-btn
          v-if="counterList.length < 100"
          color="primary"
          @click="() => handleCreate()"
          >{{ $t('counter.create') }}</q-btn
        >
      </div>
    </div>
  </div>
  <CreateCounterDialog
    :visible="visible"
    :default-config="defaultCounterConfig"
    @ok="handleDialogOk"
    @cancel="handleDialogCancel"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue'
import counterService from '@/core/service/counter'
import type { CounterItem } from '@/core/service/counter'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import CreateCounterDialog from './components/CreateCounter.vue'
import { useI18n } from 'vue-i18n'
import { useQuasar, throttle } from 'quasar'
import { CounterConfig } from '@/core/service/counter/core'

const { t } = useI18n()

const $q = useQuasar()

const counterList = ref<CounterItem[]>([])

const defaultCounterConfig = {
  min: 0,
  max: 10000,
  step: 1,
  initial: 0,
}

counterList.value.push(counterService.createCounter(defaultCounterConfig))

// 移动端情况下，click 有多次触发的现象
const handleDecrease = throttle((item: CounterItem) => {
  item.instance.decrease()
}, 100)

const handleIncrease = throttle((item: CounterItem) => {
  item.instance.increase()
}, 100)

// 设置弹窗
const visible = ref(false)
const isCreate = ref(false)
const dialogCounterId = ref('')

function handleCreate() {
  visible.value = true
  isCreate.value = true
}

function handleDialogOk(data: CounterConfig) {
  if (isCreate.value) {
    counterList.value.push(counterService.createCounter(data))
  } else if (dialogCounterId.value) {
    counterService.updateConfig(counterList.value, dialogCounterId.value, data)
  }
  handleDialogCancel()
}

function handleDialogCancel() {
  visible.value = false
}

function handleRemove(id: string) {
  $q.dialog({
    title: t('counter.remove'),
    message: t('counter.removeMsg'),
  }).onOk(() => {
    counterList.value = counterService.removeCounter(counterList.value, id)
  })
}

function handleReset(id: string) {
  $q.dialog({
    title: t('counter.reset'),
    message: t('counter.resetMsg'),
  }).onOk(() => {
    counterService.resetCounter(counterList.value, id)
  })
}

function handleSetting(id: string) {
  dialogCounterId.value = id
  visible.value = true
  isCreate.value = false
}
</script>

<style lang="scss">
.page-main {
  .content {
    max-width: 800px;
    margin: 0 auto;
    .counter-item-content {
      border: 1px solid gray;
      .counter-item-main {
        height: 120px;
        font-size: 40px;
        .counter-item-content {
          height: 100%;
          flex: 1;
        }
        .decrease,
        .increase {
          height: 100%;
          width: 20%;
          font-size: 30px;
        }
      }
      .counter-item-actions {
        .btn {
          font-size: 20px;
        }
      }
    }
  }
}
</style>
