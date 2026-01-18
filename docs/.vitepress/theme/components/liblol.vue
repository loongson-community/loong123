<template>
    <el-row :gutter="20">
        <el-col :span="16"><SearchBar @search="handleSearch" /></el-col>
        <el-col :span="4">
            <el-button @click="clearFilter">{{ $t("components.clear_filter") }}</el-button>
        </el-col>
    </el-row>
    <el-table 
        ref="tableRef"
        row-key="name" 
        :data="paginatedTableData" 
        border 
        :default-sort="{ prop: 'id', order: 'ascending' }"
        @filter-change="handleFilterChange"
    >
        <el-table-column prop="id" label="ID" width="70" />
        <el-table-column prop="name" :label="$t('components.name')" width="210" />
        <el-table-column prop="version" :label="$t('components.soft_version')" width="180" />
        <el-table-column prop="liblol_version" :label="$t('components.liblol_version')" width="80" />
        <el-table-column prop="date" :label="$t('components.uptimedate')" width="180" />
        <el-table-column
            prop="status"
            :label="$t('components.status')"
            column-key="status"
            width="110"
            :filters="filter_data[current_lang]?.filters_status || 'zh'"
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
        <el-table-column prop="notes" :label="$t('components.notes')" min-width="200" />
        <el-table-column prop="link" :label="$t('components.link')" width="60" />
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

    import liblolJson from "../../../data/liblol.min.json";
    import filter_data from "../../../data/locales.min.json";
    import SearchBar from "./SearchBar.vue";
    let current_lang;
    if (typeof window !== "undefined") {
        current_lang = document.documentElement.lang;
    }

    const tableData = ref(liblolJson);

    const tableRef = ref();
    const currentPage = ref(1); // 当前页码
    const pageSize = ref(10); // 每页显示条数
    const selectedData = ref(null);
    const searchData = ref("");

    const clearFilter = () => {
        tableRef.value.clearFilter();
        selectedData.value = null; // 清空筛选条件
        currentPage.value = 1; // 重置为第一页
    };

    const filterStatus = (value, row) => {
        return row.status === value;
    };

    // 处理搜索
    const handleSearch = (query) => {
        searchData.value = query;
        currentPage.value = 1;
    };

    // 处理筛选条件变化
    const handleFilterChange = filters => {
        if (filters.status) {
            selectedData.value = filters.status.length > 0 ? filters.status[0] : null;
        }
        currentPage.value = 1;
    };

    // 计算过滤后的数据
    const filteredTableData = computed(() => {
        return tableData.value.filter(row => {
            return (!searchData.value || row.name.toLowerCase().includes(searchData.value.toLowerCase())) &&
                   (!selectedData.value || row.status === selectedData.value);
        });
    });

    // 监听 filteredTableData 的变化，动态调整 currentPage
    watch(filteredTableData, newVal => {
        const totalPages = Math.ceil(newVal.length / pageSize.value);
        if (currentPage.value > totalPages) {
            currentPage.value = totalPages > 0 ? totalPages : 1;
        }
    });

    // 计算当前页的数据
    const paginatedTableData = computed(() => {
        const start = (currentPage.value - 1) * pageSize.value;
        const end = start + pageSize.value;
        return filteredTableData.value.slice(start, end);
    });

    // 处理每页显示条数变化的包装函数
    const handleSizeChange = size => {
        pageSize.value = size;
        currentPage.value = 1;
    };

    // 处理页码变化的包装函数
    const handlePageChange = page => {
        currentPage.value = page;
    };
</script>
