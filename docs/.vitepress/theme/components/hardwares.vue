<template>
    <el-row :gutter="20">
        <el-col :span="16"><SearchBar @search="handleSearch" /></el-col>
        <el-col :span="4">
            <el-button @click="clearFilter">{{ $t("components.clear_filter") }}</el-button>
        </el-col>
    </el-row>
    <el-table
        ref="tableRef"
        row-key="model"
        :data="paginatedTableData"
        border
        :default-sort="{ prop: 'brand', order: 'ascending' }"
        @filter-change="handleFilterChange"
    >
        <el-table-column prop="model" :label="$t('components.model')" width="250" />
        <el-table-column prop="arch" :label="$t('components.arch_or_series')" width="110" />
        <el-table-column
            prop="brand"
            :label="$t('components.brand')"
            column-key="brand"
            width="140"
            sortable
            :filters="filter_vendors[current_lang].sort(sortValue)"
            :filter-method="filterBrand"
        />
        <el-table-column
            prop="type"
            :label="$t('components.type')"
            column-key="type"
            width="180"
            :filters="filter_data[current_lang].filters_hardware_type"
            :filter-method="filterType"
            filter-placement="bottom-end"
        >
            <template #default="scope">
                <span v-for="(hardware, index) in filter_data[current_lang].filters_hardware_type" :key="index">
                    <span v-if="scope.row.type == hardware.value">{{ hardware.text }}</span>
                </span>
            </template>
        </el-table-column>
        <el-table-column
            prop="status"
            :label="$t('components.status')"
            column-key="status"
            width="165"
            :filters="filter_data[current_lang].filters_status"
            :filter-method="filterStatus"
            filter-placement="bottom-end"
        >
            <template #default="scope">
                <Unknown v-if="scope.row.status == 0" />
                <Compatible v-if="scope.row.status == 1" />
                <Partial v-if="scope.row.status == 2" />
                <NewWorld v-if="scope.row.status == 3" />
                <Unsupported v-if="scope.row.status == -1" />
            </template>
        </el-table-column>
        <el-table-column prop="notes" :label="$t('components.notes')" min-width="200">
            <template #default="scope">
                <span v-if="current_lang == 'en' && scope.row.notes_en">{{ scope.row.notes_en }}</span>
                <span v-else>{{ scope.row.notes }}</span>
            </template>
        </el-table-column>
        <el-table-column prop="link" :label="$t('components.link')" width="60">
            <template #default="scope">
                <span v-if="current_lang == 'en' && scope.row.link_en">
                    <a :href="scope.row.link_en">{{ $t("components.doc_link") }}</a>
                </span>
                <span v-else-if="scope.row.link">
                    <a :href="scope.row.link">{{ $t("components.doc_link") }}</a>
                </span>
            </template>
        </el-table-column>
    </el-table>
    <el-pagination
        style="justify-content: center"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :total="filteredTableData.length"
        :page-size="pageSize"
        :current-page="currentPage"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
    />
</template>

<script setup>
    import { ref, computed, watch } from "vue";
    import { sortValue } from "./utils/sortUtils";
    import SearchBar from "./SearchBar.vue";

    import hardwaresJson from "../../../data/hardwares.min.json";
    import filter_data from "../../../data/locales.min.json";
    import filter_vendors from "../../../data/vendors.min.json";
    let current_lang;
    if (typeof window !== "undefined") {
        current_lang = document.documentElement.lang;
    }

    const tableData = ref(hardwaresJson); // 初始化 tableData

    const tableRef = ref();
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(10); // 每页显示条数
    const selectedData = ref({
        // 获取当前选中的筛选条件
        brand: null,
        type: null,
        status: null
    });
    const searchData = ref("");

    const clearFilter = () => {
        tableRef.value.clearFilter();
        selectedData.value = { brand: null, type: null, status: null }; // 清空筛选条件
        searchData.value = "";
        currentPage.value = 1; // 重置为第一页
    };

    const filterBrand = (value, row) => {
        return row.brand === value;
    };

    const filterType = (value, row) => {
        return row.type === value;
    };

    const filterStatus = (value, row) => {
        return row.status === value;
    };

    // 使用 sortValue 对 tableData 进行大小写排序
    const sortedTableData = computed(() => {
        return tableData.value.slice().sort((a, b) => {
            return sortValue({ value: a.brand }, { value: b.brand });
        });
    });

    // 处理搜索
    const handleSearch = (query) => {
        searchData.value = query;
        currentPage.value = 1;
    };

    // 处理筛选条件变化
    const handleFilterChange = filters => {
        if (filters.brand) {
            selectedData.value.brand = filters.brand.length > 0 ? filters.brand[0] : null;
        }
        if (filters.type) {
            selectedData.value.type = filters.type.length > 0 ? filters.type[0] : null;
        }
        if (filters.status) {
            selectedData.value.status = filters.status.length > 0 ? filters.status[0] : null;
        }
        currentPage.value = 1;
    };

    // 计算过滤后的数据
    const filteredTableData = computed(() => {
        return sortedTableData.value.filter((row) => {
            const ignoreSpace = /\s+/g;
            const searchQuery = searchData.value.toLowerCase().replace(ignoreSpace, "");
            const model = row.model.toLowerCase().replace(ignoreSpace, "");
            const arch = (row.arch?.toLowerCase() || "").replace(ignoreSpace, "");
            const brand = row.brand.toLowerCase().replace(ignoreSpace, "");

            return (
                (!searchData.value || 
                    model.includes(searchQuery) ||
                    arch.includes(searchQuery) ||
                    brand.includes(searchQuery)
                ) &&
                (!selectedData.value.brand || row.brand === selectedData.value.brand) &&
                (!selectedData.value.type || row.type === selectedData.value.type) &&
                (!selectedData.value.status || row.status === selectedData.value.status)
            );
        });
    });

    // 监听 filteredTableData 的变化，动态调整 currentPage
    watch(filteredTableData, (newVal) => {
        const totalPages = Math.ceil(newVal.length / pageSize.value);
        if (currentPage.value > totalPages && totalPages > 0) {
            currentPage.value = totalPages;
        } else if (newVal.length === 0) {
            currentPage.value = 1; // 如果没有数据，重置为第一页
        }
    });

    const paginatedTableData = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return filteredTableData.value.slice(start, end);
    });

    const handleSizeChange = (size) => {
        pageSize.value = size;
        currentPage.value = 1;
    };

    const handlePageChange = (page) => {
        currentPage.value = page;
    };
</script>