import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../components/auth/LoginForm";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const loginMock = jest.fn();
jest.mock("@/store/zustand/authStore", () => ({
  useAuthStore: () => ({
    login: loginMock,
    isLoading: false,
  }),
}));

jest.mock("../components/common", () => ({
  Button: (props: any) => <button {...props} />,
}));
jest.mock("../components/common/iconography", () => ({
  CSEyeOpen: () => <span>EyeOpen</span>,
  CSEyeClose: () => <span>EyeClose</span>,
}));

describe("LoginForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders email and password inputs", () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it("toggles password visibility", async () => {
    render(<LoginForm />);
    const toggleBtn = screen.getByText("EyeOpen");
    expect(screen.getByLabelText(/password/i).getAttribute("type")).toBe("password");
    fireEvent.click(toggleBtn);
    expect(screen.getByLabelText(/password/i).getAttribute("type")).toBe("text");
  });

  it("calls login on submit", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole("button", { name: /login/i });

    await user.type(emailInput, "test@example.com");
    await user.type(passwordInput, "123456");
    await user.click(submitBtn);

    expect(loginMock).toHaveBeenCalledWith({ email: "test@example.com", password: "123456" });
  });

  it("navigates to signup page", async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/sign up here/i));
    expect(pushMock).toHaveBeenCalledWith("/signup");
  });
});
