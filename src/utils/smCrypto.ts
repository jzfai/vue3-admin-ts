import { sm2 } from 'sm-crypto'

const publicKey = '040a302b5e4b961afb3908a4ae191266ac5866be100fc52e3b8dba9707c8620e64ae790ceffc3bfbf262dc098d293dd3e303356cb91b54861c767997799d2f0060'

/**
 * sm2加密
 * @param data 待加密数据
 * @return 加密后的数据
 */
export const sm2Encrypt = (data: string): string => {
	return '04' + sm2.doEncrypt(data, publicKey, 1)
}
