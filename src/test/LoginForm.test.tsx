/* eslint-disable react/display-name */
import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginForm } from '@/components';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
}));

const loginMock = jest.fn();
jest.mock('@/store/zustand/authStore', () => ({
  useAuthStore: () => ({
    login: loginMock,
    isLoading: false,
  }),
}));

jest.mock('@/components/common', () => ({
  Button: ({ children, type = 'submit', ...rest }: any) => (
    <button
      type={type}
      {...rest}
    >
      {children}
    </button>
  ),
  Input: React.forwardRef(
    ({ label, id, type = 'text', showPasswordToggle, ...rest }: any, ref) => {
      const [inputType, setInputType] = React.useState(type);
      return (
        <div>
          <label htmlFor={id}>{label}</label>
          <input
            id={id}
            type={inputType}
            ref={ref}
            {...rest}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() =>
                setInputType((prev: any) =>
                  prev === 'password' ? 'text' : 'password'
                )
              }
            >
              {inputType === 'password' ? 'EyeOpen' : 'EyeClosed'}
            </button>
          )}
        </div>
      );
    }
  ),
}));

jest.mock('@/components/common/iconography', () => ({
  CSEyeOpen: () => <span>EyeOpen</span>,
  CSEyeClose: () => <span>EyeClose</span>,
}));

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders email and password inputs', () => {
    render(<LoginForm />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('toggles password visibility', async () => {
    render(<LoginForm />);
    const toggleBtn = screen.getByText('EyeOpen');
    expect(screen.getByLabelText(/password/i).getAttribute('type')).toBe(
      'password'
    );
    fireEvent.click(toggleBtn);
    expect(screen.getByLabelText(/password/i).getAttribute('type')).toBe(
      'text'
    );
  });

  it('calls login on submit', async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitBtn = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, '123456');
    await user.click(submitBtn);

    expect(loginMock).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: '123456',
    });
  });

  it('navigates to signup page', async () => {
    render(<LoginForm />);
    const user = userEvent.setup();

    await user.click(screen.getByText(/sign up here/i));
    expect(pushMock).toHaveBeenCalledWith('/signup');
  });
});
