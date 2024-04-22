import apiInstance from "@/lib/axios";

export function getUser(discordId: string) {
  return apiInstance.get("/user/discord/" + discordId);
}

export function registerDiscordUser(discordId: string) {
  return apiInstance.post("/user/discord", {
    discordId,
  });
}

export function updateWorker(discordId: string, tag: string, command: string) {
  return apiInstance.patch(
    "/worker/update",
    {
      tag,
      command,
    },
    {
      headers: {
        "x-discord-id": discordId,
      },
    },
  );
}

export function getWorkers(discordId: string) {
  return apiInstance.get("/worker", {
    headers: {
      "x-discord-id": discordId,
    },
  });
}

export function deleteWorker(discordId: string, tag: string) {
  return apiInstance.delete("/worker/delete", {
    headers: {
      "x-discord-id": discordId,
    },
    data: {
      tag: tag,
    },
  });
}

export function createWorker(discordId: string, tag: string, command: string) {
  return apiInstance.post(
    "/worker/create",
    {
      tag,
      command,
    },
    {
      headers: {
        "x-discord-id": discordId,
      },
    },
  );
}

export function sendAction(discordId: string, tag: string, action: any) {
  return apiInstance.post(
    "/worker/action",
    {
      tag,
      action,
    },
    {
      headers: {
        "x-discord-id": discordId,
      },
    },
  );
}
