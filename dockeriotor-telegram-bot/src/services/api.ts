import apiInstance from "../lib/axios";

export function getUser(telegramId: number) {
  return apiInstance.get("/user/telegram/" + telegramId);
}

export function registerTelegramUser(telegramId: number) {
  return apiInstance.post("/user/telegram", {
    telegramId,
  });
}

export function updateWorker(telegramId: number, tag: string, command: string) {
  return apiInstance.patch(
    "/worker/update",
    {
      tag,
      command,
    },
    {
      headers: {
        "x-telegram-id": telegramId,
      },
    }
  );
}

export function getWorkers(telegramId: number) {
  return apiInstance.get("/worker", {
    headers: {
      "x-telegram-id": telegramId,
    },
  });
}

export function deleteWorker(telegramId: number, tag: string) {
  return apiInstance.delete("/worker/delete", {
    headers: {
      "x-telegram-id": telegramId,
    },
    data: {
      tag: tag,
    },
  });
}

export function createWorker(telegramId: number, tag: string, command: string) {
  return apiInstance.post(
    "/worker/create",
    {
      tag,
      command,
    },
    {
      headers: {
        "x-telegram-id": telegramId,
      },
    }
  );
}

export function sendAction(telegramId: number, tag: string, action: any) {
  return apiInstance.post(
    "/worker/action",
    {
      tag,
      action,
    },
    {
      headers: {
        "x-telegram-id": telegramId,
      },
    }
  );
}
