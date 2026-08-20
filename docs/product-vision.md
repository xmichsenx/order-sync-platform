# Product Vision

## What we are building

Order Sync Platform is a B2B application for synchronizing orders between external systems, for example a marketplace and an ERP.

The main focus of the project is reliability. Sending data from one API to another is the easy part. The interesting part is handling situations where something goes wrong.

The system should be able to deal with duplicate webhooks, unavailable external APIs, timeouts, failed workers and messages that cannot be processed.

A typical flow will look like this:

```text
Marketplace -> Webhook -> Order Sync Platform -> RabbitMQ -> Worker -> ERP
```

Incoming events will be validated and stored before being processed asynchronously. Successful jobs will be marked as completed. Failed jobs will be retried and, after exhausting the retry limit, moved to a dead letter queue.

An operator should be able to see what happened and replay failed operations after the underlying problem has been resolved.

## Main functionality

The platform should eventually support:

- receiving and validating webhooks
- integration with at least one real external API or sandbox
- PostgreSQL as the primary database
- asynchronous processing using RabbitMQ and background workers
- idempotent event processing
- retry with backoff
- dead letter queue and manual replay
- transactional outbox
- multiple organizations using the same application
- user authentication and role-based permissions
- audit log for important actions
- an operator dashboard built with React and TypeScript

Redis can be added for things such as caching, rate limiting or locks where it actually makes sense.

## Operator dashboard

The dashboard should make it possible to understand the current state of integrations without looking directly at the database or application logs.

An operator should be able to:

- browse synchronization jobs
- see their current status
- inspect processing attempts and errors
- find failed jobs
- replay failed operations
- view integrations
- search and filter jobs
- see relevant audit history

The dashboard is mainly an operational tool, not a general-purpose admin panel.

## Failure handling

Failure scenarios are an important part of the project.

We want to be able to reproduce cases such as:

- receiving the same webhook more than once
- an external API timing out
- an external API temporarily returning 5xx responses
- a worker failing while processing a job
- the same message being delivered more than once
- retries being exhausted
- a job ending up in the DLQ
- replaying a failed job after the external service recovers

The system should behave predictably in each of these situations and should not create duplicate side effects.

## Observability

We also want to be able to understand what happens to an event while it moves through the system.

The application should expose useful logs, metrics and traces. OpenTelemetry will be used for instrumentation, with tools such as Grafana, Prometheus, Loki and Tempo added as needed.

It should be possible to follow an event from the incoming webhook, through the queue and worker, up to the request made to the external system.

## Testing

Critical parts of the system should be covered by automated tests.

This includes regular unit and integration tests, but also tests for things such as duplicate delivery, retries and external service failures.

Later in the project we also want to run basic performance tests and document the results.

## Final demo

The final version should be able to demonstrate a scenario like this:

1. A marketplace sends an order.
2. The platform accepts it and schedules synchronization.
3. The ERP is unavailable.
4. The job fails and is retried automatically.
5. After several attempts it ends up in the DLQ.
6. The failure is visible in the operator dashboard.
7. The ERP becomes available again.
8. The operator replays the job.
9. The synchronization succeeds.
10. Sending the original webhook again does not create a duplicate.

Logs and traces should make it possible to investigate the whole flow.

## Goal

The goal is not to build as many integrations or features as possible.

The goal is to build a relatively small system that demonstrates how we approach reliability, asynchronous processing, external integrations, testing and debugging in a production-like application.
