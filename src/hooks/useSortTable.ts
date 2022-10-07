/* 表格拖拽排序 */
import Sortable from 'sortablejs'
export const useCommonExample = () => {
  const rowDrop = (tableData, tableClass: string) => {
    // 获取到element-ui封装的表格标签
    const tbody: any = document.querySelector(` ${tableClass} tbody`)
    Sortable.create(tbody, {
      animation: 180,
      delay: 0,
      onEnd({ newIndex, oldIndex }) {
        const currRow = tableData.splice(oldIndex, 1)[0]
        tableData.splice(newIndex, 0, currRow)
      }
    })
  }
  return {
    rowDrop
  }
}

export const useSortTable = useCommonExample

export default useCommonExample
