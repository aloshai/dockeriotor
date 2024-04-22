import { Client, REST, Routes } from "discord.js";
import { OnInteractionCreateEvent } from "./events";
import { Command } from "@/models/command.model";
import { Event } from "@/models/event.model";
import { WorkersCommand, AddWorkerCommand } from "./commands";
import { RegisterCommand } from "./commands/register.command";
import { RemoveWorkerCommand } from "./commands/remove-worker.command";

export class Bot {
  public client: Client;

  public events: Event[] = [];
  public commands: Command[] = [];

  constructor() {
    this.client = new Client({
      intents: ["DirectMessages", "Guilds", "GuildMessages"],
    });
  }

  public async init() {
    await this.registerEvents();
    await this.registerCommands();

    this.client.on("ready", async () => {
      await this.registerSlashCommands(this.client.user.id);

      console.log("Bot is ready");
    });

    await this.client.login(process.env.DISCORD_TOKEN);
  }

  private async registerEvents() {
    this.registerEvent(new OnInteractionCreateEvent());
  }

  private async registerEvent(event: Event) {
    this.client.on(event.name, (...args) => {
      event.run(...args, this);
    });
  }

  private async registerCommands() {
    this.registerCommand(new AddWorkerCommand());
    this.registerCommand(new WorkersCommand());
    this.registerCommand(new RegisterCommand());
    this.registerCommand(new RemoveWorkerCommand());
  }

  private async registerSlashCommands(clientId: string) {
    const rest = new REST().setToken(process.env.DISCORD_TOKEN);

    const commands = this.commands.map((command) => command.command.toJSON());

    try {
      await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });

      // TODO: Register guild commands
      // await rest.put(
      //   Routes.applicationGuildCommands(clientId, process.env.GUILD_ID),
      //   {
      //     body: commands,
      //   }
      // );
    } catch (error) {
      console.error(error);
    }
  }

  private async registerCommand(command: Command) {
    this.commands.push(command);
  }
}
