import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SignupForm } from "@/components";

const pushMock = jest.fn();
jest.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
}));

const registerMock = jest.fn();
jest.mock("@/store/zustand/authStore", () => ({
  useAuthStore: () => ({
    register: registerMock,
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

describe("SignupForm", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders all input fields", () => {
    render(<SignupForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });

  it("toggles password and confirm password visibility", () => {
    render(<SignupForm />);
    const passwordToggle = screen.getAllByText("EyeOpen")[0];
    const confirmToggle = screen.getAllByText("EyeOpen")[1];

    fireEvent.click(passwordToggle);
    expect(screen.getByLabelText(/^password/i).getAttribute("type")).toBe("text");

    fireEvent.click(confirmToggle);
    expect(screen.getByLabelText(/confirm password/i).getAttribute("type")).toBe("text");
  });

  it("calls registerUser on submit", async () => {
    render(<SignupForm />);
    const user = userEvent.setup();

    await user.type(screen.getByLabelText(/email/i), "test@example.com");
    await user.type(screen.getByLabelText(/full name/i), "Test User");
    await user.type(screen.getByLabelText(/^password/i), "123456");
    await user.type(screen.getByLabelText(/confirm password/i), "123456");

    await user.click(screen.getByRole("button", { name: /sign up/i }));

    expect(registerMock).toHaveBeenCalledWith({
      email: "test@example.com",
      password: "123456",
      name: "Test User",
    });
  });

  it("navigates to login page", async () => {
    render(<SignupForm />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/login here/i));
    expect(pushMock).toHaveBeenCalledWith("/login");
  });
});
