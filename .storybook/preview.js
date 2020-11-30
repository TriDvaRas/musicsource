import { setCompodocJson } from "@storybook/addon-docs/angular";
import docJson from "../documentation.json";
setCompodocJson(docJson);

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  layout: "centered",
  backgrounds: {
    default: "black",
    values: [
      {
        name: "black",
        value: "#000",
      },
      {
        name: "light",
        value: "#555",
      },
    ],
  },
};
