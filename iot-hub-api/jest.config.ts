import type { Config } from "jest";

export default (): Config => {
  return {
    verbose: true,
    preset: "ts-jest",
    transform: {
      "^.+\\.(ts|tsx)?$": "ts-jest",
    },
    resetMocks: true,
  };
};
