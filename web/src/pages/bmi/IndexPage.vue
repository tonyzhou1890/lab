<template>
  <div class="page-main app">
    <ServiceBaseInfo :service-name="ServiceSchame.i18nKey" />
    <div class="content">
      <q-form
        ref="formRef"
        @submit="onSubmit"
        class="form"
      >
        <!-- 体重 -->
        <q-input
          type="number"
          v-model.number="formData.weight"
          :label="$t('bmi.weight') + 'kg *'"
          :rules="[
            (val) => !isEmpty(val) || $t('global.form.required'),
            (val) => val > 0 || $t('global.form.positiveNumber'),
          ]"
        />
        <!-- 身高 -->
        <q-input
          type="number"
          v-model.number="formData.height"
          :label="$t('bmi.height') + 'cm *'"
          :rules="[
            (val) => !isEmpty(val) || $t('global.form.required'),
            (val) => val > 0 || $t('global.form.positiveNumber'),
          ]"
        />
        <div class="btns row justify-center">
          <q-btn
            :label="$t('global.form.submit')"
            type="submit"
            color="primary"
          ></q-btn>
        </div>
      </q-form>
      <section class="result-section">
        <h2 class="section-title">{{ $t('global.form.result') }}</h2>
        <div class="result text-body1 text-center ova break-all">
          {{ result }}
        </div>
        <div
          v-show="!isEmpty(result)"
          class="result-bar flex column"
        >
          <div class="tag">
            <span
              class="tag-pointer inline-block q-pa-xs rounded-borders text-white bg-grey"
              :style="{
                'margin-left': location.percent + '%',
              }"
              >{{ location.tag }}</span
            >
          </div>
          <div class="standard-tags flex">
            <div
              v-for="item in standards"
              :key="item.label"
              :style="{
                width: item.diffPercent + '%',
              }"
              :data-tag="item.key"
              class="scroll-bar tac"
            >
              <div class="bar-inner"></div>
              <span class="tag-item">{{ item.label }}</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import ServiceSchame from '@/core/service/bmi/schema'
import BMIService from '@/core/service/bmi'
import ServiceBaseInfo from '@/components/ServiceBaseInfo.vue'
import { errorNotify } from '@/core/error/utils'
import { isEmpty } from '@/core/utils/validate'

const { t } = useI18n()

const service = new BMIService()

const standards = service.standards.map((item) => {
  return {
    key: item.key,
    label: t('bmi.standard.' + item.key),
    value: item.value,
    percent: item.percent,
    diffPercent: item.diffPercent,
  }
})

const formData = ref<{
  height: number | null
  weight: number | null
}>({
  height: null,
  weight: null,
})

const result = ref<number | null>(null)

const location = ref<{
  index: number
  tag: string
  percent: number
}>({
  index: -1,
  tag: '',
  percent: 0,
})

function onSubmit() {
  try {
    result.value = service.calc(
      formData.value.height as number,
      formData.value.weight as number
    )
    result.value = Number(result.value.toFixed(1))
    const loc = service.locate(result.value)
    loc.tag = t('bmi.standard.' + loc.tag)
    location.value = loc
  } catch (e) {
    errorNotify(e, { t })
  }
}
</script>

<style lang="scss" scoped>
.page-main {
  .content {
    .form,
    .result-bar {
      max-width: 500px;
      margin: 0 auto;
    }
    .result-bar {
      .tag {
        width: 100%;
        margin-bottom: 3px;
        .tag-pointer {
          transform: translateX(-50%);
          white-space: nowrap;
          &::after {
            content: '';
            width: 6px;
            height: 6px;
            transform: rotate(45deg);
            box-sizing: border-box;
            border: 3px solid $grey;
            position: absolute;
            left: 50%;
            bottom: -3px;
            margin-left: -3px;
          }
        }
      }
      .standard-tags {
        width: 100%;
        .scroll-bar {
          .bar-inner {
            height: 10px;
            box-sizing: border-box;
            border-right: 1px solid white;
          }
          &[data-tag='thin'] {
            .bar-inner {
              background-image: linear-gradient(
                to right,
                rgba(40, 190, 250, 1),
                rgba(0, 200, 190, 1)
              );
            }
          }
          &[data-tag='normal'] {
            .bar-inner {
              background-image: linear-gradient(
                to right,
                rgba(0, 200, 190, 1),
                rgba(115, 200, 90, 1)
              );
            }
          }
          &[data-tag='weight'] {
            .bar-inner {
              background-image: linear-gradient(
                to right,
                rgba(115, 200, 90, 1),
                rgba(250, 140, 0, 1)
              );
            }
          }
          &[data-tag='fat'] {
            .bar-inner {
              background-image: linear-gradient(
                to right,
                rgba(250, 140, 0, 1),
                rgba(250, 116, 0, 1)
              );
              border-right: none;
            }
          }
        }
      }
    }
  }
}
</style>
