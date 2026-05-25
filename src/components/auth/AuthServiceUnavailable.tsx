type AuthServiceUnavailableProps = {
  message: string;
};

export function AuthServiceUnavailable({ message }: AuthServiceUnavailableProps) {
  return (
    <p
      className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-950"
      role="alert"
    >
      {message}
    </p>
  );
}
