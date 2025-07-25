import type { Config } from "jest";
import baseConfig from "./jest.config";

export default (): Config => {
  return {
    ...baseConfig(),
    testMatch: ["**/?(*.)+(unit.test).ts"],
    testPathIgnorePatterns: ["/test-utils/"],
    clearMocks: true,
  };
};
