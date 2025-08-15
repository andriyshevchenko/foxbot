import { Action } from "../core";
import { Query } from "../core";

/**
 * Interface for writing log messages at different levels.
 *
 * @example
 * ```typescript
 * class ConsoleJournal implements Journal {
 *   async write(message: string, level: "debug" | "info" | "warn" | "error"): Promise<void> {
 *     console[level](message);
 *   }
 * }
 * ```
 */
export interface Journal {
  /**
   * Writes a log message at the specified level.
   *
   * @param m The message to write
   * @param l The log level
   * @returns Promise that resolves when the message is written
   */
  write(m: string, l: "debug" | "info" | "warn" | "error"): Promise<void>;
}

/**
 * An action decorator that logs a message before executing another action.
 *
 * @example
 * ```typescript
 * const click = new Click(button);
 * const message = new TextLiteral("Clicking submit button");
 * const logged = new LoggedAction(click, message, journal, "info");
 * await logged.perform(); // logs message then clicks
 * ```
 */
export class LoggedAction implements Action {
  /**
   * Creates a new logged action.
   *
   * @param a The action to execute
   * @param m Query that returns the message to log
   * @param j The journal to write to
   * @param l The log level (defaults to "debug")
   */
  constructor(
    private readonly a: Action,
    private readonly m: Query<string>,
    private readonly j: Journal,
    private readonly l: "debug" | "info" | "warn" | "error" = "debug"
  ) {}

  /**
   * Logs the message then executes the action.
   *
   * @returns Promise that resolves when both logging and action are complete
   */
  async perform(): Promise<void> {
    await this.j.write(await this.m.value(), this.l);
    await this.a.perform();
  }
}
