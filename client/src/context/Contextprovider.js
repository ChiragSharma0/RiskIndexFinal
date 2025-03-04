import React from "react";
import { UserProvider } from "./usercontext";
import FormContextProvider from "./formcontext"; // Wraps VI and EI contexts
import { ScheduleProvider } from "./schedule"; // Import Schedule Context
import { LocationProvider } from './locationcontext'

const AppContextProvider = ({ children }) => {
  return (
    <UserProvider>
        <ScheduleProvider> {/* Wrap it here */}

          <FormContextProvider>
            {children}
          </FormContextProvider>
        </ScheduleProvider>
    </UserProvider>
  );
};

export default AppContextProvider;
