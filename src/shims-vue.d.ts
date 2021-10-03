/*生命模块类型*/
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module './*'
declare module '@/*'
declare module '@/hooks'
declare module 'js-cookie'
