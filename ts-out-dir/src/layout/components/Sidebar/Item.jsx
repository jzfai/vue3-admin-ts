import ElSvgItem from './ElSvgItem.vue';
export default defineComponent({
    props: {
        icon: {
            type: String,
            default: ''
        },
        meta: {
            type: Object,
            default: null
        },
        title: {
            type: String,
            default: ''
        },
        elIcon: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        const renderItem = () => {
            if (props.meta?.elSvgIcon) {
                return <ElSvgItem elSvgName={props.meta.elSvgIcon}/>;
            }
            else if (props.meta?.icon) {
                return <svg-icon icon-class={props.meta?.icon} className="nav-icon"/>;
            }
        };
        return () => {
            return renderItem();
        };
    }
});
//# sourceMappingURL=Item.jsx.map