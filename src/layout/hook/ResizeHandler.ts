import store from '@/store'

const { body } = document
const WIDTH = 992
import { useAppStore } from '@/pinia/app'
export default function () {
  const appStore = useAppStore()
  const $_isMobile = () => {
    const rect = body.getBoundingClientRect()
    return rect.width - 1 < WIDTH
  }
  const $_resizeHandler = () => {
    if (!document.hidden) {
      const isMobile = $_isMobile()
      // console.log('toggleDevice')
      // store.dispatch('app/toggleDevice', isMobile ? 'mobile' : 'desktop')
      if (isMobile) {
        // console.log('closeSideBar')
        // store.dispatch('app/closeSideBar', { withoutAnimation: true })
        /*此处只做根据window尺寸关闭sideBar功能*/

        appStore.M_sidebar_opened(false)
      } else {
        appStore.M_sidebar_opened(true)
      }
    }
  }
  onBeforeMount(() => {
    window.addEventListener('resize', $_resizeHandler)
  })
  onMounted(() => {
    const isMobile = $_isMobile()
    if (isMobile) {
      appStore.M_sidebar_opened(false)
      // store.dispatch('app/toggleDevice', 'mobile')
      // store.dispatch('app/closeSideBar', { withoutAnimation: true })
    } else {
      appStore.M_sidebar_opened(true)
    }
  })
  onBeforeUnmount(() => {
    window.removeEventListener('resize', $_resizeHandler)
  })
}
