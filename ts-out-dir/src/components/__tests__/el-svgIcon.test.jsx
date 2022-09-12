import { mount } from '@vue/test-utils';
import { describe, it } from 'vitest';
import ElSvgIcon from '../ElSvgIcon.vue';
describe('ElSvgIcon.vue', () => {
    it('create', () => {
        const wrapper = mount(() => <ElSvgIcon name="Edit" size={30} color={'red'}/>);
    });
});
//# sourceMappingURL=el-svgIcon.test.jsx.map