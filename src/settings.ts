interface SettingTy {
  title: string
  sidebarLogo: boolean
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
  delWindowHeight: string
  tmpToken: string
  showNavbarTitle: boolean
  showTopNavbar: boolean
  mainNeedAnimation: boolean
  viteBasePath: string
  plateFormId: number
}

const setting: SettingTy = {
  title: '前后端低代码平台',
  /**
   * @type {boolean} true | false
   * @description Whether show the logo in sidebar
   */
  sidebarLogo: true,
  /**
   * @type {boolean} true | false
   * @description Whether show the title in Navbar
   */
  showNavbarTitle: false,
  /**
   * @type {boolean} true | false
   * @description Whether show the drop-down
   */
  ShowDropDown: true,
  /**
   * @type {boolean} true | false
   * @description Whether show Hamburger
   */
  showHamburger: true,
  /**
   * @type {boolean} true | false
   * @description Whether show the settings right-panel
   */
  showLeftMenu: true,
  /**
   * @type {boolean} true | false
   * @description Whether show TagsView
   */
  showTagsView: false,
  /**
   * @description TagsView show number
   */
  tagsViewNum: 6,
  /**
   * @type {boolean} true | false
   * @description Whether show the top Navbar
   */
  showTopNavbar: true,
  /* page  animation related*/
  /**
   * @type {boolean} true | false
   * @description Whether need animation of main area
   */
  mainNeedAnimation: false,
  /**
   * @type {boolean} true | false
   * @description Whether need nprogress
   */
  isNeedNprogress: true,

  /*page login or other*/
  /**
   * @type {boolean} true | false
   * @description Whether need login
   */
  isNeedLogin: true,
  /**
   * @type {string} 'roles' | 'code'
   */
  permissionMode: 'roles',
  /**
   * @type {boolean} true | false
   * @description Whether  open prod mock
   */
  openProdMock: true,
  /**
   * @type {string | array} 'dev' | ['prod','test','dev'] according to the .env file props of VITE_APP_ENV
   * @description Need show err logs component.
   * The default is only used in the production env
   * If you want to also use it in dev, you can pass ['dev', 'test']
   */
  errorLog: ['prod'],
  /*
   * table height(100vh-delWindowHeight)
   * */
  delWindowHeight: '210px',
  /*
   * setting dev token when  isNeedLogin is setting false
   * */
  tmpToken: 'tmp_token',

  /*
   * vite.config.js base config
   * such as
   * */
  viteBasePath: './',

  //平台id  1->前端后端低代码平台
  plateFormId: 1
}

export default setting
