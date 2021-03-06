import cache from "../cache";
import mock from "../mock";

describe("Tenant cache", () => {
  afterEach(() => {
    cache.clear();
  });

  describe("add", () => {
    it("should add product to a list", () => {
      const base = mock.full;
      const products = [mock.full, mock.full];

      cache.set("tenant", products);
      cache.add("tenant", base);

      expect(cache.get("tenant")).toContain(base);
    });
  });

  describe("get", () => {
    it("should get a tenant", () => {
      const products = [mock.full, mock.full];

      cache.set("tenant", products);

      expect(cache.get("tenant")).toEqual(products);
    });
  });

  describe("set", () => {
    it("should set a list of products", () => {
      const products = [mock.full, mock.full];

      cache.set("tenant", products);

      expect(cache.get("tenant")).toEqual(products);
    });
  });

  describe("clear", () => {
    it("should clear cache", () => {
      cache.set("1", [mock.full]);
      cache.set("2", [mock.full]);
      cache.set("3", [mock.full]);

      expect(cache.clear()).toEqual(0);
    });
  });

  describe("pluck", () => {
    it("should remove a list of products", () => {
      const base = mock.full;
      const products = [mock.full, base, mock.full];

      cache.set("tenant", products);
      cache.pluck("tenant", base.id);

      expect(cache.get("tenant")).not.toContain(base);
    });
  });

  describe("update", () => {
    it("should update a partial product", () => {
      const base = mock.full;
      const partial = {
        title: "some modified title",
      };
      const expected = {
        ...base,
        ...partial,
      };

      cache.set("tenant", [mock.full, base, mock.full]);
      cache.update("tenant", base.id, partial);

      expect(cache.get("tenant")[1]).toEqual(expected);
    });
  });

  describe("remove", () => {
    it("should remove a list of products", () => {
      const products = [mock.full, mock.full];

      cache.set("tenant", products);
      cache.remove("tenant");

      expect(cache.get("tenant")).toEqual(undefined);
    });
  });
});
