interface SettingTy {
    title: string;
    sidebarLogo: boolean;
    showLeftMenu: boolean;
    ShowDropDown: boolean;
    showHamburger: boolean;
    isNeedLogin: boolean;
    isNeedNprogress: boolean;
    showTagsView: boolean;
    tagsViewNum: number;
    openProdMock: boolean;
    errorLog: string | Array<string>;
    permissionMode: string;
    delWindowHeight: string;
    tmpToken: string;
    showNavbarTitle: boolean;
    showTopNavbar: boolean;
    mainNeedAnimation: boolean;
    viteBasePath: string;
}
declare const setting: SettingTy;
export default setting;
