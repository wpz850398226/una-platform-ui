import { chPost } from './index'

export function startAct(form) {
  return chPost('jyact/runJob/startAct', form)
}
