import { StateTy } from '~/store'

const getters = {
  device: (state: StateTy) => state.app.device,
  cachedViews: (state: StateTy) => state.app.cachedViews
}
export default getters
