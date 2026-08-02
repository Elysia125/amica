export interface ApiResponse {
  sessionId?: string;
  outputType?: string;
  response?: any;
  error?: string;
}

export interface apiLogEntry {
  sessionId: string;
  timestamp: string;
  inputType: string;
  outputType: string;
  response?: any;
  error?: string;
}

export const generateSessionId = (sessionId?: string): string =>
  sessionId || Math.random().toString(36).substring(2, 10);

export const sendToClients = (_message: { type: string; data: any }) => {
  // SSE removed (dev-only Next.js API); no-op in Vite build
};

export const readFile = (filePath: string): any => {
  return JSON.parse(localStorage.getItem(filePath) || "{}");
};

export const writeFile = (filePath: string, content: any): void => {
  localStorage.setItem(filePath, JSON.stringify(content));
};
