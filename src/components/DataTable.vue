<script setup>
import { computed } from "vue";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
  headers: {
    type: Array,
    required: true,
  },
});

const sortedData = computed(() => props.data);

function sortTable(header) {
  console.log("sort by:", header);
  console.log(sortedData);
}
</script>

<template>
  <table id="tableComponent" class="table table-dark">
    <thead>
      <tr>
        <th>#</th>
        <th v-for="header in headers" :key="header" @click="sortTable(header)">
          {{ header }}
          <!-- <i class="bi bi-sort-alpha-down" aria-label="Sort Icon"></i> -->
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in sortedData" :key="item">
        <td>{{ index + 1 }}</td>
        <td v-for="header in headers" :key="header">
          {{ item[header] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
