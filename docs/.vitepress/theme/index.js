import DefaultTheme from "vitepress/theme";
import './custom.css'
import ElementPlus, { ElConfigProvider } from 'element-plus'
import 'element-plus/theme-chalk/base.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import 'element-plus/theme-chalk/el-message.css';
import { computed, defineComponent, h, nextTick } from "vue";
import { useData } from 'vitepress';

import { resolveElementPlusLocale } from "./element-locale";

import compatibleBadge from './components/badges/compatible.vue'
import partialBadge from './components/badges/partial.vue'
import nativeBadge from './components/badges/native.vue'
import newWorldBadge from './components/badges/newWorld.vue'
import unknownBadge from './components/badges/unknown.vue'
import unsupportedBadge from './components/badges/unsupported.vue'

import i18n from "./i18n";

// 让 Element Plus 的内置文案（表格筛选面板的“筛选/重置”按钮、分页文案等）
// 跟随站点当前语言；语言变化时 el-config-provider 会重新注入 locale
const Layout = defineComponent({
    name: "Layout",
    setup(_, { slots }) {
        const { lang } = useData();
        const elementLocale = computed(() => resolveElementPlusLocale(lang.value));

        return () =>
            h(
                ElConfigProvider,
                { locale: elementLocale.value },
                { default: () => h(DefaultTheme.Layout, null, slots) }
            );
    },
});

export default {
    ...DefaultTheme,
    Layout,
    enhanceApp(ctx) {
        DefaultTheme.enhanceApp(ctx);
        ctx.app.use(i18n);
        ctx.app.use(ElementPlus);
        ctx.app.mixin({
            mounted() {
                nextTick(() => {
                    // Used for execute switch language after insert "lang" in <html>
                    if (typeof window !== "undefined") {
                        // Determine if the "window" exists to allow Vite to build smoothly
                        // There's black magic on the frontend, too!!!
                        const current_lang = document.documentElement.lang || "en";
                        localStorage.setItem("lang", current_lang);
                        if (ctx.app.config.globalProperties.$i18n) {
                            ctx.app.config.globalProperties.$i18n.locale = current_lang;
                        }
                        this.$forceUpdate();
                    }
                });
            },
        });
        // Global badges
        ctx.app.component("Compatible", compatibleBadge);
        ctx.app.component("Partial", partialBadge);
        ctx.app.component("Native", nativeBadge);
        ctx.app.component("NewWorld", newWorldBadge);
        ctx.app.component("Unknown", unknownBadge);
        ctx.app.component("Unsupported", unsupportedBadge);
    },
};
