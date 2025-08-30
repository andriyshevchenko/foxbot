Yes. Separate **doing** (running a span) from **noting** (writing structured events). Keep only one tiny public interface for each concern and hide OpenTelemetry behind implementations.

Below is a minimal, copy-pasteable design:

## **1\) Public contracts (tiny, cohesive)**

// tele/Journal.ts  
export interface Journal {  
 /\*\* Structured note tied to the current span. \*/  
 note(message: string, attrs?: Record\<string, unknown\>): Promise\<void\>;  
}

// tele/Stage.ts  
export interface Stage {  
 /\*\*  
 \* Execute \`work\` inside a span named after this stage.  
 \* The span is opened before, and ended after, the callback returns/throws.  
 \* The callback receives a Journal for writing notes.  
 \*/  
 perform\<T\>(work: (j: Journal) \=\> Promise\<T\>): Promise\<T\>;  
}

## **2\) OTel wiring (encapsulated; app code never touches OTel)**

// tele/Telemetry.ts  
import { NodeSDK } from '@opentelemetry/sdk-node';  
import { Resource } from '@opentelemetry/resources';  
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

// Optional logs (can be disabled)  
import { LoggerProvider, BatchLogRecordProcessor } from '@opentelemetry/sdk-logs';  
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';

export type TelemetryConfig \= {  
 serviceName: string;  
 environment?: string;  
 tracesEndpoint?: string; // e.g. http://localhost:4318/v1/traces  
 logsEndpoint?: string; // e.g. http://localhost:4318/v1/logs  
 enableLogs?: boolean; // default false  
};

export class Telemetry {  
 private sdk: NodeSDK;  
 private loggerProvider?: LoggerProvider;

constructor(cfg: TelemetryConfig) {  
 const resource \= new Resource({  
 'service.name': cfg.serviceName,  
 'deployment.environment': cfg.environment ?? 'dev',  
 });

    this.sdk \= new NodeSDK({
      resource,
      traceExporter: new OTLPTraceExporter({
        url: cfg.tracesEndpoint ?? process.env.OTEL\_EXPORTER\_OTLP\_TRACES\_ENDPOINT,
      }),
    });

    if (cfg.enableLogs) {
      this.loggerProvider \= new LoggerProvider({ resource });
      this.loggerProvider.addLogRecordProcessor(
        new BatchLogRecordProcessor(new OTLPLogExporter({
          url: cfg.logsEndpoint ?? process.env.OTEL\_EXPORTER\_OTLP\_LOGS\_ENDPOINT,
        })),
      );
    }

}

start() { return this.sdk.start(); }  
 shutdown() { return Promise.allSettled(\[this.sdk.shutdown(), this.loggerProvider?.shutdown()\]).then(() \=\> {}); }

// Internal accessors used by implementations:  
 get service() { return { name: 'telemetry' }; }  
}

## **3\) Implementations (hide OTel types)**

// tele/OtelJournal.ts  
import { Journal } from './Journal';  
import { trace } from '@opentelemetry/api';  
import { logs, SeverityNumber } from '@opentelemetry/api-logs';

export class OtelJournal implements Journal {  
 // Keep a direct reference to the span to avoid relying on global active context.  
 constructor(private readonly span: ReturnType\<ReturnType\<typeof trace.getTracer\>\['startSpan'\]\>,  
 private readonly emitLogs: boolean) {}

async note(message: string, attrs: Record\<string, unknown\> \= {}): Promise\<void\> {  
 // 1\) Event on the span (shows on Tempo timeline)  
 this.span.addEvent(message, attrs);

    // 2\) Optional: a structured log record (Collector → Loki) carrying trace/span IDs
    if (this.emitLogs) {
      const sc \= this.span.spanContext();
      const logger \= logs.getLogger('journal', '1.0.0');
      logger.emit({
        body: message,
        severityNumber: SeverityNumber.INFO,
        attributes: { ...attrs, trace\_id: sc.traceId, span\_id: sc.spanId },
      });
    }

}  
}

// tele/OtelStage.ts  
import { Stage } from './Stage';  
import { Journal } from './Journal';  
import { OtelJournal } from './OtelJournal';  
import { Telemetry } from './Telemetry';  
import { trace, context, SpanStatusCode } from '@opentelemetry/api';

export class OtelStage implements Stage {  
 constructor(  
 private readonly telemetry: Telemetry,  
 private readonly name: string,  
 private readonly attrs: Record\<string, unknown\> \= {},  
 private readonly enableLogs \= false,  
 ) {}

async perform\<T\>(work: (j: Journal) \=\> Promise\<T\>): Promise\<T\> {  
 const tracer \= trace.getTracer('scraper', '1.0.0');  
 const span \= tracer.startSpan(this.name, { attributes: this.attrs });  
 const ctx \= trace.setSpan(context.active(), span);  
 const journal \= new OtelJournal(span, this.enableLogs);

    try {
      return await context.with(ctx, () \=\> work(journal));
    } catch (e: any) {
      span.recordException(e);
      span.setStatus({ code: SpanStatusCode.ERROR, message: String(e?.message ?? e) });
      throw e;
    } finally {
      span.end(); // implicit, no explicit close in app code
    }

}  
}

## **4\) Use it (clean separation: Stage runs, Journal notes)**

// scrape.ts  
import { chromium } from 'playwright';  
import { Telemetry } from './tele/Telemetry';  
import { OtelStage } from './tele/OtelStage';

async function main() {  
 const tele \= new Telemetry({  
 serviceName: 'scraper',  
 environment: 'dev',  
 tracesEndpoint: 'http://localhost:4318/v1/traces', // Collector  
 logsEndpoint: 'http://localhost:4318/v1/logs', // Collector  
 enableLogs: true, // set false to keep only span events  
 });

await tele.start();

try {  
 await new OtelStage(tele, \`job:${process.env.JOB_ID ?? 'local'}\`, { 'job.id': process.env.JOB_ID ?? 'local' }, true)  
 .perform(async (root) \=\> {  
 await root.note('job.start');

        await new OtelStage(tele, 'Creation of browser', {}, true).perform(async (j) \=\> {
          await j.note('some custom log', { headless: true });
          const browser \= await chromium.launch({ headless: true });
          await j.note('some playwright log', { version: await browser.version() });
          await browser.close();
        });

        await new OtelStage(tele, 'Creation of session', {}, true).perform(async (j) \=\> {
          await j.note('some custom log');
          // create context/page...
        });

        await new OtelStage(tele, 'Session decoration', {}, true).perform(async (j) \=\> {
          await j.note('anti-detect mechanism');
        });

        await new OtelStage(tele, 'Performing login workflow', {}, true).perform(async (j) \=\> {
          await j.note('navigating', { url: 'https://example.com/login' });
          // Playwright steps...
        });

        await new OtelStage(tele, 'Performing user search workflow', {}, true).perform(async (j) \=\> {
          await j.note('search.start', { query: 'alice' });
          await j.note('search.end', { results: 3 });
        });

        await root.note('job.end');
      });

} finally {  
 await tele.shutdown(); // flush  
 }  
}

main().catch(() \=\> process.exit(1));

### **Why this matches Elegant Objects**

- **Separation of concerns**:
  - `Stage.perform(...)` owns span lifecycle (open → run → end).
  - `Journal.note(...)` owns structured notes only.
- **Small, cohesive objects**: each class has one reason to change.
- **No global/static calls in app code**: OTel is confined to implementation classes.
- **No explicit close/end in user code**: RAII-style ending in `finally`.
- **No getters/DTOs**: you “tell” objects what to do (`perform`, `note`) instead of “asking.”

If you want a **factory** to avoid `new OtelStage(...)` in your app code, add a tiny `Stages` class (composition root) that takes `Telemetry` once and returns `Stage` instances by name.
