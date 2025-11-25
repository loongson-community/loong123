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
        :default-sort="{ prop: 'name', order: 'ascending' }"
        @filter-change="handleFilterChange"
    >
        <el-table-column prop="name" :label="$t('components.name')" width="120" />
        <el-table-column prop="vendor" :label="$t('components.vendor')" width="100" />
        <el-table-column prop="version" :label="$t('components.soft_version')" width="120" />
        <el-table-column prop="lat_or_box64" :label="$t('components.lat_or_box64')" width="80" />
        <el-table-column prop="lat_version" :label="$t('components.lat_version')" width="96" />
        <el-table-column prop="box64_version" :label="$t('components.box64_version')" width="102" />
        <el-table-column prop="date" :label="$t('components.uptimedate')" width="106" />
        <el-table-column
            prop="lat_status"
            :label="$t('components.lat_status')"
            column-key="lat_status"
            width="140"
            :filters="filter_data[current_lang]?.filters_status_translation || 'zh'"
            :filter-method="filterLatStatus"
            filter-placement="bottom-end"
        >
            <template #default="scope">
                <Unknown v-if="scope.row.lat_status == 0" />
                <Compatible v-if="scope.row.lat_status == 1" />
                <Partial v-if="scope.row.lat_status == 2" />
                <Native v-if="scope.row.lat_status == 3" />
                <Unsupported v-if="scope.row.lat_status == -1" />
            </template>
        </el-table-column>
        <el-table-column
            prop="box64_status"
            :label="$t('components.box64_status')"
            column-key="box64_status"
            width="140"
            :filters="filter_data[current_lang]?.filters_status_translation || 'zh'"
            :filter-method="filterBox64Status"
            filter-placement="bottom-end"
        >
            <template #default="scope">
                <Unknown v-if="scope.row.box64_status == 0" />
                <Compatible v-if="scope.row.box64_status == 1" />
                <Partial v-if="scope.row.box64_status == 2" />
                <Native v-if="scope.row.box64_status == 3" />
                <Unsupported v-if="scope.row.box64_status == -1" />
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

    import databaseJson from "../../../data/datas.min.json";
    import filter_data from "../../../data/locales.min.json";
    const current_lang = document.documentElement.lang;

    const tableData = ref(databaseJson.translation);

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

    const filterLatStatus = (value, row) => {
        return row.lat_status === value;
    };

    const filterBox64Status = (value, row) => {
        return row.box64_status === value;
    };

    // 处理搜索
    const handleSearch = (query) => {
        searchData.value = query;
        currentPage.value = 1;
    };

    // 使用 sortValue 对 tableData 进行大小写排序
    const sortedTableData = computed(() => {
        return tableData.value.slice().sort((a, b) => {
            return sortValue({ value: a.name }, { value: b.name });
        });
    });

    // 处理筛选条件变化
    const handleFilterChange = filters => {
        if (filters.status) {
            selectedData.value = filters.status.length > 0 ? filters.status[0] : null;
        }
        currentPage.value = 1;
    };

    // 计算过滤后的数据
    const filteredTableData = computed(() => {
        return sortedTableData.value.filter(row => {
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
