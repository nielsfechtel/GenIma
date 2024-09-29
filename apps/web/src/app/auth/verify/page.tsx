"use client";

import { executeToken } from "@web/src/actions/auth.actions";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@web/src/components/ui/card";
import { signOut } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";

export default function Verify() {
  const t = useTranslations("verify");

  let message;
  let gotoLocation = "dashboard";
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (token) {
    signOut({
      callbackUrl: "/",
      redirect: true,
    }).then(() => {
      executeToken(token)
        .then((result) => {
          message = result.message;
          switch (result.actionType) {
            case "DELETE_ACCOUNT": {
              gotoLocation = "landingpage";
              break;
            }
            case "RESET_PASSWORD": {
              gotoLocation = "dashboard";
              break;
            }
            case "CHANGE_EMAIL": {
              gotoLocation = "login";
              break;
            }
            case "VERIFY_EMAIL": {
              gotoLocation = "login";
              break;
            }
            default: {
              gotoLocation = "landingpage";
            }
          }
        })
        .catch((result) => {
          console.error("Something wen't wrong, please try again", result);
        });
    });
  } else {
    message = "No token supplied!";
  }

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">{message}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <h2>{t("verifying")}</h2>
      </CardContent>
    </Card>
  );
}
