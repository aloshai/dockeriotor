import asyncio
import argparse
import socket_manager
import pyfiglet

pyfiglet.print_figlet("Dockeriotor", colors="BLUE")

parser = argparse.ArgumentParser()

parser.add_argument("--user-id", type=str, help="User ID", required=True)
parser.add_argument("--tag", type=str, help="Tag", required=True)
parser.add_argument(
    "--server-url",
    type=str,
    help="Server URL",
    required=False,
    default="https://dockeriotor.com",
)

args = parser.parse_args()


async def main():
    await socket_manager.start_server(args.user_id, args.tag, args.server_url)


loop = asyncio.new_event_loop()
loop.run_until_complete(main())
loop.run_forever()
