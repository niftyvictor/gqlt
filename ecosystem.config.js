module.exports = {
  apps: [
    {
      name: "gql",
      script: "gql/main.js",
      watch: ".",
    },
    {
      name: "auth",
      script: "auth/main.js",
      watch: ".",
    },
  ],
};
