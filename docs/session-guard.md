Create a SessionGuard class implementing Action encapsulating this code, target: Action, session: Session - constructor parameter

try {
await target.perform();
} finally {
await session.close();
}
