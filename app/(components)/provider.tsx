'use client';
import { Provider } from "react-redux";
import { store } from "../../store/store";
import { SessionProvider } from "next-auth/react";

type Props = {
  children: React.ReactNode;
};
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <Provider store={store}>
      <SessionProvider>{children}</SessionProvider>
    </Provider>
  )
}