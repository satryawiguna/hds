import { redirect } from "next/navigation";
import { AUTH_ROUTES } from "@hds/shared";

export default function HomePage() {
  redirect(AUTH_ROUTES.LOGIN);
}
