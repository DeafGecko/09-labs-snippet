import { afterEach, describe, expect, it, vi } from "vitest";
import { storage } from "../../utils/storage";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("storage", () => {
  it("round-trips a value through localStorage", () => {
    storage.set("09labs-test", { a: 1, list: ["x"] });
    expect(storage.get("09labs-test", null)).toEqual({ a: 1, list: ["x"] });
  });

  it("returns the fallback when the key is missing", () => {
    expect(storage.get("missing-key", "fallback")).toBe("fallback");
  });

  it("returns the fallback and warns when stored JSON is broken", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    localStorage.setItem("09labs-broken", "{not json");
    expect(storage.get("09labs-broken", [])).toEqual([]);
    expect(warn).toHaveBeenCalled();
  });

  it("does not throw when writing fails", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => storage.set("09labs-full", "x")).not.toThrow();
    expect(warn).toHaveBeenCalled();
  });
});
