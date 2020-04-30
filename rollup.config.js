import typescript from "@rollup/plugin-typescript";

import pkg from "./package.json";

const INPUT_FILE_PATH = pkg.s;
const OUTPUT_NAME = "Auth0Context";

const GLOBALS = {
  react: "React",
  "react-dom": "ReactDOM",
};

const PLUGINS = [typescript()];

const EXTERNAL = ["react", "react-dom"];

const OUTPUT_DATA = [
  {
    file: pkg.browser,
    format: "umd",
  },
  {
    file: pkg.main,
    format: "cjs",
  },
  {
    file: pkg.module,
    format: "esm",
  },
];

const config = OUTPUT_DATA.map(({ file, format }) => ({
  input: INPUT_FILE_PATH,
  output: {
    file,
    format,
    name: OUTPUT_NAME,
    globals: GLOBALS,
  },
  external: EXTERNAL,
  plugins: PLUGINS,
  sourcemap: true,
}));

export default config;
