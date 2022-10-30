<script setup>
import { onMounted, ref } from "vue";
import { getTables } from "../api/table";
import router from "../router";

const hoverIndex = ref(-1);
const data = ref([]);

onMounted(() => {
  getTables()
    .then((res) => {
      data.value = res.data;
    })
    .catch((e) => {
      console.log(e);
    });
});

function editTable(id) {
  router.push(`/${id}`);
}
</script>

<template>
  <div class="p-5">
    <table class="table table-dark">
      <thead>
        <tr>
          <th class="fw-bold">#</th>
          <th class="fw-bold">Name</th>
          <th class="fw-bold">Id</th>
          <th class="fw-bold">CreatedAt</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(table, index) in data"
          @mouseleave="hoverIndex = -1"
          @mouseenter="hoverIndex = index"
          :key="table.id"
          @click="() => editTable(table.id)"
        >
          <td :class="hoverIndex === index ? 'hover' : ''" class="fw-bold">
            {{ index + 1 }}
          </td>
          <td :class="hoverIndex === index ? 'hover' : ''">
            {{ table.name }}
          </td>
          <td :class="hoverIndex === index ? 'hover' : ''">
            {{ table.id }}
          </td>
          <td :class="hoverIndex === index ? 'hover' : ''">
            {{ new Date(table.createdAt).toDateString() }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style>
.hover {
  background-color: #3e454d !important;
  cursor: pointer;
}
</style>
