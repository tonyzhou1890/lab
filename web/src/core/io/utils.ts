import { Loading } from 'quasar'
import { DepLoadCallbackParams } from '@/core/typings/general-types'

export const loading = {
  show() {
    Loading.show({
      message: 'loading_',
    })
  },
  update(params: DepLoadCallbackParams) {
    Loading.show({
      message: `${params.path}<br />${Number(
        (params.percent * 100).toFixed(2)
      )}%`,
      html: true,
    })
  },
  hide() {
    Loading.hide()
  },
}
