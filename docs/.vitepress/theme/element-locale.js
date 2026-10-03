import en from "element-plus/es/locale/lang/en";
import zhCn from "element-plus/es/locale/lang/zh-cn";

// Element Plus 内置文案的语言包，例如表格筛选面板的“筛选/重置”按钮、分页的“共 x 条”等
const elementLocales = {
    zh: zhCn,
    en: en,
};

/**
 * 将站点语言（VitePress 的 lang，例如 "zh"、"en"）映射为 Element Plus 语言包，
 * 使 Element Plus 的内置文案跟随站点本地化，而不是固定使用默认的英文。
 *
 * @param {string} lang 站点当前语言
 * @returns {object} Element Plus 语言包
 */
export const resolveElementPlusLocale = lang => {
    const key = String(lang || "").toLowerCase().split("-")[0];

    return elementLocales[key] || en;
};

export default elementLocales;
