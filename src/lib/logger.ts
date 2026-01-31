/**
 * Logger Enterprise
 * - Esconde logs de debug em produção
 * - Adiciona timestamps e cores
 * - Tipagem segura
 */

type LogLevel = "info" | "warn" | "error" | "debug";

const IS_DEV = import.meta.env.DEV; // Vite env check

class Logger {
  private print(level: LogLevel, message: string, data?: any) {
    if (!IS_DEV && level === "debug") return; // Silêncio em produção

    const timestamp = new Date().toLocaleTimeString("pt-BR");
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    const styles = {
      info: "color: #3b82f6; font-weight: bold;",
      warn: "color: #eab308; font-weight: bold;",
      error: "color: #ef4444; font-weight: bold; background: #fee2e2; padding: 2px rounded;",
      debug: "color: #a855f7; font-weight: normal;",
    };

    console.groupCollapsed(`%c${prefix} ${message}`, styles[level]);
    if (data) console.log(data);
    console.groupEnd();
  }

  info(msg: string, data?: any) { this.print("info", msg, data); }
  warn(msg: string, data?: any) { this.print("warn", msg, data); }
  error(msg: string, data?: any) { this.print("error", msg, data); }
  debug(msg: string, data?: any) { this.print("debug", msg, data); }
}

export const logger = new Logger();