import { describe, it, expect } from "vitest";

import { mount } from "@vue/test-utils";
import DataTable from "../DataTable.vue";

describe("DataTable", () => {
  it("renders properly", () => {
    const wrapper = mount(DataTable, {
      props: { data: [{ id: "1234" }], headers: ["id"] },
    });

    expect(wrapper.text()).toContain("1234");
  });
});
