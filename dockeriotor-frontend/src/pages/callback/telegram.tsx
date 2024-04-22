import { useEffect } from "react";
import instance from "../../lib/axios";

export function TelegramCallback() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);


    login(params);
  }, []);

  async function login(params: any) {
    const response = await instance.get("/auth/telegram", {
      params: params,
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
