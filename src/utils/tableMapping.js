import { v4 as uuidv4 } from "uuid";

export function mapDataToTable(data) {
  const headersObj = {};
  const rowsObj = {};

  for (let i = 0; i < data.values.length; i++) {
    if (!Array.isArray(rowsObj[data.values[i].rowId])) {
      rowsObj[data.values[i].rowId] = [];
    }
    rowsObj[data.values[i].rowId].push({
      value: data.values[i].value,
      headerId: data.values[i].headerId,
    });
  }

  for (let i = 0; i < data.headers.length; i++) {
    headersObj[data.headers[i].id] = data.headers[i].name;
  }

  const headers = Object.values(headersObj);
  const rows = Object.values(rowsObj);
  const table = [];

  for (let i = 0; i < rows.length; i++) {
    const row = {};
    for (let j = 0; j < rows[i].length; j++) {
      row[headersObj[rows[i][j].headerId]] = rows[i][j].value;
    }
    table.push(row);
  }

  return { data: table, headers: headers };
}

export function mapTableToData(table, name, headersArr) {
  if (table.length < 1) {
    return [];
  }

  const tableId = uuidv4();

  const headers = [];

  for (let i = 0; i < headersArr.length; i++) {
    const uuid = uuidv4();
    headers.push({
      id: uuid.toString(),
      isActive: true, //TODO: use selected checkbox value
      name: headersArr[i],
      tableId: tableId,
    });
  }

  const values = [];

  for (let i = 0; i < table.length; i++) {
    const rowId = uuidv4();
    const row = table[i];
    for (let j = 0; j < headers.length; j++) {
      const val = {};
      val.tableId = tableId;
      val.rowId = rowId;
      val.headerId = headers[j].id;
      val.value = row[headers[j].name]?.toString();
      values.push(val);
    }
  }

  const data = {
    id: tableId,
    headers,
    values,
    name: name,
  };

  return data;
}
