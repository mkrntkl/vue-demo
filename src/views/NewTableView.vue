<script setup>
import { ref } from "vue";
import DataTable from "../components/DataTable.vue";
import { mapTableToData } from "../utils/tableMapping";
import { postTable } from "../api/table";
import router from "../router";

const fileInput = ref(null);
const data = ref([]);
const headers = ref([]);
const headersCheckedState = ref([]);
const tableName = ref("");

function handleNameChange(e) {
  tableName.value = e.target.value;
}

function handleFileChange(e) {
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
      // TODO: implement clearing functionality
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
  headersCheckedState.value = headers.value.map(() => true);
}

function onSelect(e, index) {
  if (e.target.checked) {
    headersCheckedState.value[index] = true;
  } else {
    headersCheckedState.value[index] = false;
  }
}

function downloadData() {
  const newData = [];

  for (let i = 0; i < data.value.length; i++) {
    newData.push(
      Object.fromEntries(
        Object.entries(data.value[i]).filter(
          (_, index) => headersCheckedState.value[index] === true,
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

function saveTable() {
  const saveData = mapTableToData(
    data.value,
    tableName.value,
    getSelectedHeaders(),
  );
  postTable(saveData)
    .then((res) => {
      if (res.data) {
        router.push("/");
      }
    })
    .catch((e) => {
      console.log(e);
    });
}

function getSelectedHeaders() {
  return headers.value.filter((_, index) => !!headersCheckedState.value[index]);
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
            @change="handleFileChange"
            accept="text/csv, application/json"
          />
        </div>
        <div class="pe-3 textInput">
          <label class="form-label">Table name</label>
          <input
            class="form-control"
            title="tableName"
            @change="handleNameChange"
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
                  :checked="!!headersCheckedState[index]"
                  @change="(e) => onSelect(e, index)"
                />
                <label class="form-check-label" :for="'checkbox-' + header">
                  {{ header }}
                </label>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex">
          <button
            type="button"
            class="btn btn-dark button-wide me-3"
            id="downloadButton"
            @click="downloadData"
            v-if="data.length > 0"
          >
            Download as JSON
          </button>
          <button
            type="button"
            class="btn btn-dark button"
            id="downloadButton"
            @click="saveTable"
            v-if="data.length > 0"
          >
            Save table
          </button>
        </div>
      </div>
    </div>
  </form>
  <DataTable :data="data" :headers="getSelectedHeaders()" />
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
.button-wide {
  height: 2.5rem;
  min-width: 10rem;
}
</style>
