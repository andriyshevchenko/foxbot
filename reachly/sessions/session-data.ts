export interface SessionData {
  readonly li_at: string;
  readonly JSESSIONID: string;
  readonly userAgent: string;
  readonly viewportWidth: number;
  readonly viewportHeight: number;
  readonly timezone: string;
  readonly locale: string;
  readonly screenWidth?: number;
  readonly screenHeight?: number;
  readonly devicePixelRatio?: number;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly taskbarHeight?: number;
  readonly platform?: string;
  readonly deviceMemory?: number;
  readonly hardwareConcurrency?: number;
  readonly webglVendor?: string;
  readonly webglRenderer?: string;
  readonly httpHeaders?: Record<string, string>;
  readonly cookies?: Record<string, string>;
}
