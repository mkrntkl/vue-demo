<script setup>
import { ref } from "vue";
import DataTable from "../components/DataTable.vue";

const fileInput = ref(null);
const data = ref([]);
const headers = ref([]);
const selectedHeaders = ref([]);
const tableName = ref("");

function onFileChange(e) {
  let files = e.target.files;
  if (
    files.length > 0 &&
    (files[0].type === "application/json" || files[0].type === "text/csv")
  ) {
    readFile(files[0]);
  } else {
    fileInput.value.value = "";
    //show some error
  }
}

function readFile(file) {
  let reader = new FileReader();

  reader.onload = (e) => {
    if (file.type === "application/json") {
      assignData(JSON.parse(e.target.result));
    } else if (file.type === "text/csv") {
      const lines = e.target.result.split("\n");
      const header = lines[0].split(",");
      const output = lines.slice(1).map((line) => {
        const fields = line.split(",");
        return Object.fromEntries(header.map((h, i) => [h, fields[i]]));
      });
      assignData(output);
    } else {
      fileInput.value.value = "";
      return;
    }

    if (tableName.value === "") {
      tableName.value = file.name;
    }
  };
  reader.readAsText(file);
}

function assignData(_data) {
  data.value = _data;
  headers.value = Object.keys(data.value[0]);
  selectedHeaders.value = headers.value.map(() => true);
}

function onSelect(e, index) {
  if (e.target.checked) {
    selectedHeaders.value[index] = true;
  } else {
    selectedHeaders.value[index] = false;
  }
}

function downloadData() {
  const newData = [];

  for (let i = 0; i < data.value.length; i++) {
    newData.push(
      Object.fromEntries(
        Object.entries(data.value[i]).filter(
          (_, index) => selectedHeaders.value[index] === true,
        ),
      ),
    );
  }

  const fileName = "newFile";
  const type = "application/json";
  var file = new Blob([JSON.stringify(newData)], { type: type });
  if (window.navigator.msSaveOrOpenBlob)
    // IE10+
    window.navigator.msSaveOrOpenBlob(file, fileName);
  else {
    // Others
    var a = document.createElement("a"),
      url = URL.createObjectURL(file);
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    }, 0);
  }
}
</script>

<template>
  <form class="py-4">
    <div class="d-flex flex-column">
      <div class="d-flex align-items-end">
        <div class="fileInput pe-3">
          <label class="form-label">Import csv/json</label>
          <input
            type="file"
            class="form-control"
            title="fileInput"
            ref="fileInput"
            @change="onFileChange"
            accept="text/csv, application/json"
          />
        </div>
        <div class="pe-3 textInput">
          <label class="form-label">Table name</label>
          <input
            class="form-control"
            title="tableName"
            @change="onFileChange"
            accept="text/csv, application/json"
            maxlength="30"
            :value="tableName"
          />
        </div>
      </div>
      <div
        class="w-auto flex-row align-items-end d-flex py-3 justify-content-between"
      >
        <div class="w-auto flex-column d-flex">
          <span v-if="headers.length > 0" class="mb-1"
            >Select and name table headers</span
          >
          <div class="d-flex w-auto flex-wrap">
            <div class="input-group mb-3">
              <div
                class="form-check me-4"
                v-for="(header, index) in headers"
                :key="header"
              >
                <input
                  class="form-check-input"
                  type="checkbox"
                  :name="header"
                  :id="'checkbox-' + header"
                  :checked="!!selectedHeaders[index]"
                  @change="(e) => onSelect(e, index)"
                />
                <label class="form-check-label" :for="'checkbox-' + header">
                  {{ header }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-dark button"
          id="downloadButton"
          @click="downloadData"
          v-if="data.length > 0"
        >
          Save as JSON
        </button>
      </div>
    </div>
    <DataTable
      :data="data"
      :headers="headers.filter((_, index) => !!selectedHeaders[index])"
    />
  </form>
</template>

<style>
.fileInput {
  max-width: 40rem;
  width: 25rem;
}
.textInput {
  max-width: 40rem;
  width: 20rem;
}
.button {
  height: 2.5rem;
  min-width: 8rem;
}
</style>
