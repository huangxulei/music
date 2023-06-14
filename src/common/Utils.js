export const useIpcRenderer = () => {
    try {
        return electronAPI ? electronAPI.ipcRenderer : null
    } catch (error) {
        console.log(error)
    }
    return null
}
/** 随机字符串
 * @param src 限定组成元素的字符串，如：ABCDEFGHIJKLMNOPQRSTUVWSYZ
 * @param len 长度
 */
export const randomText = (src, len) => {
    let result = []
    for (let i = 0; i < len; i++) {
        const index = Math.floor(Math.random() * (src.length - 1))
        result.push(src.charAt(index))
    }
    return result.join("")
}

export const useUseCustomTrafficLight = () => {
    try {
        return electronAPI ? electronAPI.useCustomTrafficLight : false
    } catch (error) {
        //Do Nothing
    }
    return false
}
