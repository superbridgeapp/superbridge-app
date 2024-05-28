module.exports = {
  api: {
    output: {
      mode: "single",
      target: "codegen/index.ts",
      schemas: "codegen/model",
      client: "react-query",
      mock: false,
      override: {
        mutator: {
          path: "./services/http-client.ts",
          name: "customInstance",
        },
      },
    },
    input: {
      target: "../../../fugu-monorepo/apps/backend/bridge-swagger.yaml",
    },
  },
};
