import { useNavigate } from "react-router-dom";

export function useTelegramLogin() {
  const navigate = useNavigate();

  return function loginWithTelegram() {
    (window as any).Telegram.Login.auth(
      { bot_id: "6897670918", request_access: false },
      (data) => {
        if (!data) {
          console.log("No data");
          return;
        }

        const searchParams = new URLSearchParams(data);

        navigate(`/telegram/callback?${searchParams.toString()}`);
      }
    );
  };
}
