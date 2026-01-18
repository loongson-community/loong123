import { defineConfig } from "vitepress";
import path from "path";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import { fileURLToPath } from 'url'

import AutoGenerateJson from "../plugin/auto_generate_data";

import { search_locales_zh } from "./zh/main";

export const shared = defineConfig({
    i18nRouting: true,
    themeConfig: {
        footer: {
            message: `
                本项目与任何营利性实体均利益无关，本站内容中提及的商标均为相应拥有者的财产。<br />
                This project is unaffiliated with any for-profit entity. All trademarks referenced herein are property of their respective holders.
            `,
            copyright: `
                CC BY-SA 4.0 International <a href="https://beian.miit.gov.cn" target="_blank">鄂ICP备2022017735号-10</a>
                <br />Copyright © 2023-2025 <a href="https://github.com/LiarOnce" target="_blank">LiarOnce</a>
            `
        },
        search: {
            provider: "local",
            options: {
                locales: {
                    root: search_locales_zh
                },
            },
        },
        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/loongson-community/loong123",
            },
        ],
    },
    markdown: {
        config: (md) => { },
    },
    vite: {
        ssr: {
            noExternal: ["element-plus", "vue-i18n"],
        },
        resolve: {
            alias: {
                '@': path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../')
            }
        },
        plugins: [
            AutoImport({
                resolvers: [ElementPlusResolver()],
            }),
            Components({
                resolvers: [ElementPlusResolver()],
            }),
            VueI18nPlugin({
                include: [path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../i18n/**")]
            }),
            AutoGenerateJson()
        ],
        build: {
            rollupOptions: {
                external: ['document'],
            },
        }
    },
    transformPageData(pageData) {
        if (pageData.frontmatter.date) {
        const date = new Date(pageData.frontmatter.date)
            pageData.frontmatter.date = date.toISOString().split('T')[0]
        }
        return pageData
    }
});
