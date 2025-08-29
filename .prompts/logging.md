I think I want to add logging to this project with open telemetry traces and spans which will be exported to Grafana + Loki. For example see @linkedin-login.e2e.test.ts . My end goal I want to be able to see traces in grafana when each stage/operation should represent a span. I also want to be able to see structured logs for each span in grafana.
Example:
Trace: job-12345

- Span1: Creation of browser
  Logs:
  - some custom log
  - some playwright log
  - etc
- Span2: Creation of session
  Logs:
  - some custom log
  - some playwright log
  - etc
- Span3: Session decoration: anti-detect mechanism, optimization etc
- Span4: Performing login workflow
  Logs:
  - some custom log
  - some playwright log
  - etc
- Span5: Performing user search workflow
  Logs:
  - some custom log
  - some playwright log
  - etc

Implementation: I'm thinking of creating appropriate interface and injecting it to every OOP primitive and each oop primitive will log whats happening inside. NOTE: rules must be followed @typescript.md  
I think of a `Trace` interface should representing a collection of `interface Span` and span should represent a collection of logs, classes should only implement following interfaces, unless required by specific package/framework. No sync methods in logging. Classes names like "logger", "tracer" are not allowed. Class names should represent a real-life objects. DDD must be followed. Don't mention grafana or loki when coming up with a names for objects. No nulls allowed. objects must be immutable.
