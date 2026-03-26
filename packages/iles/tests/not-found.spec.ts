import { test, describe, expect } from "vite-plus/test";

import NotFound from "@islands/components/NotFound";

describe("not found component", () => {
  test("resolves to existing component", () => {
    expect(NotFound.name).toEqual("NotFound");
  });
});
