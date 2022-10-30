<script setup>
import { computed, ref } from "vue";

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

const hasData = computed(() => props.data.length > 0);
const sortedData = computed(() => props.data);
const numberOfPages = 20;
const pages = computed(() => {
  if (!hasData.value) {
    return [];
  } else {
    return Array.from(
      Array(Math.floor(sortedData.value.length / numberOfPages)),
      (e, i) => i + 1,
    );
  }
});

const pagesToShow = 10;
const selectedPage = ref(1);
const currentPages = computed(() => {
  let arr = [];
  let start = selectedPage.value - pagesToShow / 2;
  let end = selectedPage.value + pagesToShow / 2;
  let leftOverStart = end < pagesToShow / 2 ? pagesToShow / 2 - end : 0;
  let leftOverEnd = start < pagesToShow / 2 ? pagesToShow / 2 - start : 0;

  arr = pages.value.slice(
    start < 0 ? 0 : start + leftOverStart,
    end < pagesToShow / 2 ? end + leftOverEnd : end,
  );

  return arr;
});

const paginatedData = computed(() =>
  sortedData.value.slice(
    selectedPage.value * numberOfPages - numberOfPages >= 0
      ? selectedPage.value * numberOfPages - numberOfPages
      : 0,
    selectedPage.value * numberOfPages,
  ),
);

function selectPage(page) {
  selectedPage.value = page;
}

function prevPage() {
  if (selectedPage.value > 1) {
    selectedPage.value--;
  }
}

function nextPage() {
  if (selectedPage.value < pages.value.length) {
    selectedPage.value++;
  }
}
</script>

<template>
  <table
    id="tableComponent"
    class="table table-dark"
    :class="{ scroll: hasData }"
  >
    <thead class="">
      <tr>
        <th class="fw-bold">#</th>
        <th class="fw-bold" v-for="header in headers" :key="header">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(item, index) in paginatedData" :key="item">
        <td class="fw-bold">{{ index + 1 }}</td>
        <td v-for="header in headers" :key="header">
          {{ item[header] }}
        </td>
      </tr>
    </tbody>
  </table>
  <nav class="float-end" aria-label="Page navigation example">
    <ul class="pagination">
      <li v-if="selectedPage > pagesToShow" class="page-item">
        <a class="page-link" @click="selectPage(1)">First</a>
      </li>
      <li v-if="selectedPage > 1" class="page-item">
        <a class="page-link" @click="prevPage">...</a>
      </li>
      <li v-for="page in currentPages" :key="page" class="page-item">
        <a
          class="page-link"
          :class="page === selectedPage ? 'selectedPage' : null"
          @click="selectPage(page)"
          >{{ page }}
        </a>
      </li>
      <li class="page-item">
        <a class="page-link" @click="nextPage">...</a>
      </li>
      <li v-if="selectedPage < pages.length - pagesToShow" class="page-item">
        <a class="page-link" @click="selectPage(pages.length)">Last</a>
      </li>
    </ul>
  </nav>
</template>

<style>
.scroll {
  /* overflow-x: scroll; */
  max-width: 100vw;
  display: block;
}
.selectedPage {
  background-color: lightgray;
}
.page-link {
  cursor: pointer;
}
</style>
