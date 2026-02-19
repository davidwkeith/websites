export interface Redirect {
  source: string;
  destination: string;
  code: 301 | 302;
}

export interface HeaderRule {
  source: string;
  headers: Record<string, string>;
}

export interface WorkerHandlerConfig {
  /** Apex hostname for www→apex redirect. Omit to skip. */
  hostname?: string;
  /** Path redirects. */
  redirects?: Redirect[];
  /** Header rules applied to every response. */
  headerRules?: HeaderRule[];
  /**
   * Runs after redirects but before the default asset fetch.
   * Return a Response to short-circuit, or null to continue with the default fetch.
   */
  before?: (request: Request, url: URL, env: any) => Promise<Response | null>;
}
