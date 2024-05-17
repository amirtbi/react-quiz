import { ReactNode } from "react";

export default function Main(props: { children: ReactNode }) {
  const { children } = props;
  return (
    <>
      <main className="main">{children}</main>
    </>
  );
}
