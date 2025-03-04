import React from "react";
import { VIFormProvider } from "./VIformcontext";
import { EIFormProvider } from "./Eicontext";

const FormContextProvider = ({ children }) => {
  return (
    <VIFormProvider>
      <EIFormProvider>{children}</EIFormProvider>
    </VIFormProvider>
  );
};

export default FormContextProvider;
