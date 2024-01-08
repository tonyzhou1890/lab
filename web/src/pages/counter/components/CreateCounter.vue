<template>
  <q-dialog v-model="visible">
    <q-card>
      <q-card-section>
        <q-form
          ref="formRef"
          @submit="onSubmit"
          class="form"
        >
          <!-- 最小值 -->
          <q-input
            type="number"
            v-model.number="conf.min"
            mask="#"
            :label="$t('counter.min') + '*'"
            :rules="[
              (val) => !isEmpty(val) || $t('global.form.required'),
              (val) => val <= (conf.max ?? 0) || $t('global.form.inputError'),
            ]"
          />
          <!-- 最大值 -->
          <q-input
            type="number"
            v-model.number="conf.max"
            mask="#"
            :label="$t('counter.max') + '*'"
            :rules="[
              (val) => !isEmpty(val) || $t('global.form.required'),
              (val) =>
                val >= (conf.min ?? -Infinity) || $t('global.form.inputError'),
            ]"
          />
          <!-- 步进 -->
          <q-input
            type="number"
            v-model.number="conf.step"
            :label="$t('counter.step') + '*'"
            :rules="[
              (val) => !isEmpty(val) || $t('global.form.required'),
              (val) => val > 0 || $t('global.form.inputError'),
            ]"
          />
          <!-- 初始值 -->
          <q-input
            type="number"
            v-model.number="conf.initial"
            :label="$t('counter.initial') + '*'"
            :rules="[
              (val) => !isEmpty(val) || $t('global.form.required'),
              (val) =>
                (val <= (conf.max ?? Infinity) &&
                  val >= (conf.min ?? -Infinity)) ||
                $t('global.form.inputError'),
            ]"
          />
          <div class="btns row justify-center">
            <q-btn
              :label="$t('global.form.cancel')"
              @click="onCancel"
              class="q-mr-md"
            ></q-btn>
            <q-btn
              :label="$t('global.form.ok')"
              type="submit"
              color="primary"
            ></q-btn>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { ref, toRef, watch } from 'vue'
import type { CounterConfig } from '@/core/service/counter/core'
import { isEmpty } from '@/core/utils/validate'

const props = defineProps<{
  visible: boolean
  defaultConfig: CounterConfig
}>()

const visible = toRef(props, 'visible')

const conf = ref<CounterConfig>({
  min: 0,
  max: 0,
  step: 0,
  initial: 0,
})

watch(visible, (newVal) => {
  if (newVal) {
    conf.value = { ...props.defaultConfig }
  }
})

const emit = defineEmits<{
  (e: 'ok', data: CounterConfig): void
  (e: 'cancel'): void
}>()

function onSubmit() {
  emit('ok', conf.value)
}

function onCancel() {
  emit('cancel')
}
</script>
