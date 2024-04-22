# dockeriotor

Dockeriotor is a Remote Worker Management service designed for IO.NET. It allows you to manage workers running on the IO.NET network through a web interface, Telegram, and Discord, offering you the ability to update them remotely. The goal of Dockeriotor is to be both cloud-based and self-hostable.

Dockeriotor provides the following features:

- Web Interface
- Telegram Bot
- Discord Bot
- Client
- API

## Dockeriotor API

The Dockeriotor API is a tool for managing your workers via API, allowing you to send commands to the Dockeriotor client service. It features a modular monolithic architecture built with Nest.js.

The API has two distinct authorization systems:

- **OAuth2:** Utilizes Discord and Telegram OAuth2 methods to handle user logins.
- **API KEY:** Grants access permissions for Telegram and Discord bots.

## Dockeriotor Client

The Dockeriotor Client is an agent written in Python that gathers container information through the REST API of your locally running Docker. It also executes worker commands through the shell.

## Dockeriotor Web/Telegram/Discord

Dockeriotor's Web, Telegram, and Discord services let you manage your workers remotely through three different platforms. Unique profiles are created for users accessing via Discord and Telegram, and these profiles come with a dedicated interface and command set to easily manage their workers.

## What's Next for Dockeriotor?

Dockeriotor is focused on continuous improvement and aims to make IO.NET services more accessible to both developers and consumers. The service plans to enhance its features and ensure regular updates to IO.NET's product line.

Here are the plans for the near future:

- **Dockeriotor SDK:** Development of an SDK to help developers integrate Dockeriotor into their projects more easily.
- Refactoring to maintain a clean project architecture and codebase.
- **Dockeriotor CLI:** Creation of a CLI tool to allow worker management from the terminal.
- Logging and monitoring (including resource tracking and management).
- Self-hostable Dockeriotor support with Docker Compose.
