module.exports = {
  trailingComma: "es5",
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  importOrder: ["<THIRD_PARTY_MODULES>", "^@/(.*)$", "^[./]"],

  plugins: ["@trivago/prettier-plugin-sort-imports"],
};
