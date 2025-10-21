import { HeroUIProvider } from '@heroui/react';

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers(props: ProvidersProps) {
  const { children } = props;

  return <HeroUIProvider>{children}</HeroUIProvider>;
}
