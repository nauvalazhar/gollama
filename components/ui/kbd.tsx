interface KbdProps {
  children: React.ReactNode;
}

export function Kbd({ children }: KbdProps) {
  return (
    <kbd className="px-1.5 py-0.5 rounded-md border border-border text-white">
      {children}
    </kbd>
  );
} 