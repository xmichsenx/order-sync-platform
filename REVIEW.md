# CodeRabbit Review Guidelines

## Review objective

This platform synchronizes orders between external systems. Reliability and predictable failure handling are more important than clever abstractions or minor stylistic preferences.

Prioritize findings that could cause:

- duplicate external side effects
- lost events or messages
- incorrect order state
- unsafe retries or replays
- cross-organization data access
- hidden operational failures
- security or data exposure

Treat `docs/product-vision.md` as a roadmap, not as acceptance criteria for every pull request. Review the behavior introduced or changed by the pull request.

## Finding quality

Raise a finding only when there is a concrete failure scenario supported by the changed code.

For each finding:

- identify the triggering condition
- explain the user or operational impact
- suggest the smallest practical correction
- distinguish correctness problems from optional improvements

Prioritize correctness, security, and reliability over formatting or style already enforced by Ruff, ESLint, TypeScript, or CI.

## Delivery and idempotency

Assume webhooks and RabbitMQ messages can be delivered more than once, including concurrently.

Check that:

- duplicate deliveries cannot create duplicate external side effects
- idempotency is enforced atomically, preferably with database constraints
- code does not rely only on a check-then-insert sequence
- idempotency keys are stable and scoped correctly
- consumers remain safe after partial failure and redelivery

## Transactions and message publishing

Check transaction boundaries carefully.

Flag situations where:

- database state can commit without the corresponding message being published
- a message can be acknowledged before required state is durable
- external side effects occur inside a transaction without a recovery strategy
- outbox records and business changes are not committed atomically
- exceptions are swallowed, causing failed work to appear successful

## Retries, DLQ, and replay

Check that:

- only transient failures are retried
- validation, authentication, and other permanent failures are not retried indefinitely
- retries use bounded backoff
- retry attempts and terminal failures are recorded
- replay is safe to invoke more than once
- replay does not erase the original failure history
- jobs cannot move backward from a terminal state accidentally

## External integrations

Check that external requests:

- have explicit timeouts
- classify connection errors, timeouts, 4xx, 429, and 5xx appropriately
- do not retry non-idempotent operations unless protected by an idempotency mechanism
- validate responses before changing internal state
- avoid leaking credentials or sensitive payloads into logs and errors

## Security and multi-tenancy

Check that:

- tenant or organization scope is enforced by backend queries
- authorization is enforced server-side
- identifiers supplied by users cannot access another organization’s resources
- webhook signatures are verified before processing when applicable
- secrets, credentials, and sensitive order data are not logged

## Observability

Important operations should preserve enough context to investigate failures.

Check for:

- correlation, event, job, and attempt identifiers
- meaningful structured error context
- accurate status transitions
- metrics or traces around retries, DLQ transitions, replay, and external calls

Avoid recommending logs that expose secrets or full sensitive payloads.

## Backend

The backend supports Python 3.11 and later.

Check that:

- code remains compatible with Python 3.11
- blocking I/O is not performed directly in asynchronous FastAPI handlers
- API errors are predictable and do not expose internal exception details
- database and messaging resources have explicit lifecycle management

## Frontend

The dashboard is an operational tool.

Check that:

- loading, empty, stale, and error states are represented
- destructive actions such as replay are protected against accidental or duplicate submission
- displayed status does not misleadingly imply success
- TypeScript types are preserved instead of bypassed with unsafe assertions
- interactive controls remain accessible

## Tests

Behavior-changing code should test the relevant failure modes.

Pay particular attention to tests for:

- duplicate and concurrent delivery
- timeouts and temporary external failures
- retry exhaustion
- worker failure after partial progress
- DLQ transitions
- repeated replay
- tenant isolation and authorization
- invalid state transitions

Do not request tests for trivial declarations or behavior already fully exercised elsewhere.
