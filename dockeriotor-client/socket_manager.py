import asyncio
import socketio
import docker_manager

sio = socketio.AsyncClient(
    reconnection=True,
    reconnection_attempts=0,
    logger=True,
)

CURRENT_WORKER_DATA = None


@sio.event()
async def connect():
    print("Socket connected to cloud")


@sio.event()
async def disconnect():
    print("Socket disconnected from cloud")


@sio.event()
def action(data):
    worker_environment = CURRENT_WORKER_DATA["environment"]

    match data["action"]:
        case 0:  # Start
            docker_manager.stop_containers(True)
            docker_manager.start_container(worker_environment)
        case 1:  # Stop
            docker_manager.stop_containers(True)
        case 2:  # Restart
            docker_manager.restart_containers(worker_environment)
        case 3:  # Pause
            docker_manager.pause_containers()
        case 4:  # Resume
            docker_manager.resume_containers()
        case _:
            pass


# update:data
@sio.event()
async def update_worker_data(data):
    global CURRENT_WORKER_DATA

    CURRENT_WORKER_DATA = data


async def send_worker_stats():
    try:
        stats = docker_manager.get_active_container_stats()

        await sio.emit(
            "stats",
            {
                "stats": stats,
            },
        )
    except Exception as e:
        print(e)
        pass


async def run_status_scheduler():
    while True:
        await asyncio.sleep(5)

        if CURRENT_WORKER_DATA is None:
            continue

        if sio.sid is None:
            continue

        await send_worker_stats()


async def start_server(user_id, tag, server_url):
    await sio.connect(
        url=server_url,
        auth={"user_id": user_id, "tag": tag},
    )

    await asyncio.create_task(run_status_scheduler())

    await sio.wait()
