
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LoginButton() {
  return (
    <Button asChild variant="default" className="font-semibold">
      <Link href="/login" data-testid="login-button">
        Entrar
      </Link>
    </Button>
  );
}
