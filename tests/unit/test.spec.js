/*
 基本方法：
分组（Test Group）：descripe(描述语,function)
测试用例（Test Case）：test(描述语,function)
断言（Assert）：expect(运行需测试的方法并返回实际结果).toBe(预期结果)
//https://blog.csdn.net/weixin_42881744/article/details/107231965
* */
describe('分组', () => {
  it('', () => {
    expect(2 + 2).toBe(4)
    expect(2 + 1).toBe(4)
  })
})
