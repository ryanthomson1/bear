"use client";

import { createContext, useState, useCallback, useContext } from "react";

interface ControlPanelContextType {
  logApiCall: (description: string, url: string, request: any, response: any, status: number) => void;
}

const ControlPanelContext = createContext<ControlPanelContextType>({
  logApiCall: () => {},
});

export const ControlPanelProvider = ({ children }: { children: React.ReactNode }) => {
  const [apiLogs, setApiLogs] = useState<string>("");

  const logApiCall = useCallback((description: string, url: string, request: any, response: any, status: number) => {
    const logEntry = {
      timestamp: new Date().toISOString(),
      description: description,
      url: url,
      request: request ? JSON.stringify(request, null, 2) : null,
      response: response ? JSON.stringify(response, null, 2) : null,
      status: status,
    };

    setApiLogs((prevLogs) => {
      const newLog = JSON.stringify(logEntry, null, 2);
      return `${newLog}\n\n${prevLogs}`;
    });
  }, []);

  return (
    <ControlPanelContext.Provider value={{ logApiCall }}>
      {children}
    </ControlPanelContext.Provider>
  );
};

export const useControlPanelContext = () => {
  return useContext(ControlPanelContext);
};

