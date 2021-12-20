/*the ts file of vue*/
declare module '*.vue' {
  import { DefineComponent } from 'vue'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

//declare import module
declare module './*'
declare module '@/*'
declare module '@/hooks'
declare module '*'

/* commonMixin.js声明文件,如果使用到了mixin里的方法请在此处进行配置声明*/
declare var fileListMixin: Array<any>
declare var chooseFileNameMixin: string
declare var commonValueMixin: string
declare var pageTotalMixin: number
declare var dialogTitleMixin: string
declare var detailDialogMixin: boolean
declare var startEndArrMixin: Array<any>
declare var searchFormMixin: any
