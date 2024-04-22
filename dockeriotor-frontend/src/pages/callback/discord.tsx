import { useEffect } from "react";
import instance from "../../lib/axios";

export function DiscordCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const code = params.get("code");

    if (code) {
      login(code);
    }
  }, []);

  async function login(code: string) {
    const response = await instance.get("/auth/discord", {
      params: {
        code,
      },
    });

    const responseData = response.data;
    const accessToken = responseData.data.access_token;

    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
    }

    window.location.href = "/workers";
  }

  return <></>;
}
