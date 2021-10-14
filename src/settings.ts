interface SettingTy {
  title: string
  fixedHeader: boolean
  sidebarLogo: boolean
  showTitle: boolean
  showLeftMenu: boolean
  ShowDropDown: boolean
  showHamburger: boolean
  isNeedLogin: boolean
  isNeedNprogress: boolean
  showTagsView: boolean
  tagsViewNum: number
  openProdMock: boolean
  errorLog: string | Array<string>
  permissionMode: string
}

const setting: SettingTy = {
  title: 'Vue3 Admin Ts',
  /**
   * @type {boolean} true | false
   * @description Whether fix the header
   */
  fixedHeader: true,
  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,
  /**
   * @type {boolean} true | false
   * @description Whether show the title in Navbar
   */
  showTitle: false,
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showLeftMenu: true,
  /**
   * @type {boolean} true | false
   * @description Whether show the drop-down
   */
  ShowDropDown: true,
  showHamburger: true,
  /**
   * @type {boolean} true | false
   * @description Whether need login
   */
  isNeedLogin: true,

  /**
   * @type {boolean} true | false
   * @description Whether need nprogress
   */
  isNeedNprogress: true,

  /**
   * @type {boolean} true | false
   * @description Whether show TagsView
   */
  showTagsView: true,
  /**
   * @description TagsView show number
   */
  tagsViewNum: 6,
  //showSettings: true
  /**
   * @type {boolean} true | false
   * @description Whether  open prod mock
   */
  openProdMock: true,
  /**
   * @type {string | array} 'serve' | ['build', 'serve']
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['build', 'serve']
   */
  errorLog: ['build'],
  /**
   * @type {string} 'roles' | 'code'
   */
  permissionMode: 'roles'
}

export default setting
