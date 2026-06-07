import Link from "next/link";

/**
 * Login placeholder (T-035). Magic link UI ships when AUTH_ENABLED=true.
 */
export default function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center gap-6 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight">Вход</h1>
      <p className="text-muted-foreground text-sm leading-relaxed">
        Авторизация появится в Phase 5 после подключения PostgreSQL и Resend.
        Сейчас приложение работает без входа.
      </p>
      <Link
        href="/"
        className="text-primary text-sm font-medium underline-offset-4 hover:underline"
      >
        ← На дашборд
      </Link>
    </main>
  );
}
