import { test, describe, expect } from "vite-plus/test";

import Island from "@components/Island.vue";

describe("exports", () => {
  test("ensure island component can be resolved", () => {
    expect(Island.name).toEqual("Island");
  });
});
