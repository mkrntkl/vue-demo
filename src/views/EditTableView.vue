<script setup>
import { onMounted, ref } from "vue";
import { getTable } from "../api/table";
import DataTable from "../components/DataTable.vue";
import { mapDataToTable } from "../utils/tableMapping";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const data = ref([]);
const headers = ref([]);

onMounted(() => {
  getTable(props.id)
    .then((res) => {
      const table = mapDataToTable(res.data);
      data.value = table.data;
      headers.value = table.headers;
    })
    .catch((e) => {
      console.log(e);
    });
});
</script>

<template>
  <div class="p-5">
    <DataTable :data="data" :headers="headers" />
  </div>
</template>
