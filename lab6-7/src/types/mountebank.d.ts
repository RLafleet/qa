declare module 'mountebank' {
  export interface MountebankServer {
    start: () => Promise<void>;
    stop: () => Promise<void>;
  }

  export interface MountebankOptions {
    port?: number;
    pidfile?: string;
    logfile?: string;
    loglevel?: string;
    mock?: boolean;
    debug?: boolean;
    allowInjection?: boolean;
    localOnly?: boolean;
  }

  export function create(options: MountebankOptions): MountebankServer;
} 