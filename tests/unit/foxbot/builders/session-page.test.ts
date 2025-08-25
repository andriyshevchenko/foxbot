import { describe, expect, it } from "vitest";
import { SessionPage } from "../../../../foxbot/builders/session_page";

// Note: This test is designed to test SessionPage construction and interface compliance
// without requiring complex browser mocking that would violate TypeScript strict rules.
// The actual browser integration is tested in end-to-end tests.

describe("SessionPage", () => {
  it("can be instantiated with a session", () => {
    expect.assertions(1);

    // Create a minimal session mock for construction testing
    const mockSession = {
      open: () => Promise.resolve(),
      browser: () => Promise.reject(new Error("Not implemented in test mock")),
      close: () => Promise.resolve(),
    };

    // Test that SessionPage can be constructed without errors
    const sessionPage = new SessionPage(mockSession);

    // Verify it implements the Query interface correctly
    expect(
      typeof sessionPage.value,
      "SessionPage should implement Query interface with value method"
    ).toBe("function");
  });

  it("value method returns a Promise", () => {
    expect.assertions(1);

    const mockSession = {
      open: () => Promise.resolve(),
      browser: () => Promise.reject(new Error("Not implemented in test mock")),
      close: () => Promise.resolve(),
    };

    const sessionPage = new SessionPage(mockSession);
    const result = sessionPage.value();

    // We verify it returns a Promise but don't await it since that would trigger the mock error
    expect(result, "SessionPage.value() should return a Promise").toBeInstanceOf(Promise);

    // Clean up the unhandled promise to prevent the test error
    result.catch(() => {
      // Expected rejection from mock, silence it
    });
  });
});
