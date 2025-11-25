import { defineConfig } from "vitepress";

import { navbar } from "./navbar";
import { sidebar_hardwares } from "./sidebar_hardwares";
import { sidebar_translation } from "./sidebar_translation";
import { sidebar_liblol } from "./sidebar_liblol";
import { sidebar_contribution } from "./sidebar_contribution";
import { sidebar_chips } from "./sidebar_chips";

export const zh = defineConfig({
    lang: "zh",
    title: "Loong 1-2-3",
    description: "适用于龙架构的兼容性数据网站",
    themeConfig: {
        outline: {
            label: "页面导航",
        },
        nav: navbar,
        sidebar: {
            "/hardwares/": [
                {
                    text: "硬件相关",
                    items: sidebar_hardwares,
                },
            ],
            "/translation/": [
                {
                    text: "转译相关",
                    items: sidebar_translation,
                },
            ],
            "/liblol/": [
                {
                    text: "LibLoL 相关",
                    items: sidebar_liblol,
                },
            ],
            "/contribution/": [
                {
                    text: "参与贡献",
                    items: sidebar_contribution,
                },
            ],
            "/chips/": sidebar_chips,
        }
    },
});

export const search_locales_zh = {
    placeholder: '搜索文档',
    translations: {
        button: {
            buttonText: "搜索文档",
            buttonAriaLabel: "搜索文档",
        },
        modal: {
            noResultsText: "无法找到相关结果",
            resetButtonTitle: "清除查询条件",
            footer: {
                selectText: "选择",
                navigateText: "切换",
                closeText: '关闭',
            },
        },
    }
}