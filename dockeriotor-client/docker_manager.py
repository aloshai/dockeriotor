import docker
import sys
import os
import subprocess
from constants import (
    IO_NET_CONTAINER_PREFIX,
    IO_NET_DARWIN_CHMOD_COMMAND,
    IO_NET_DARWIN_LAUNCH_BINARY_CURL,
    IO_NET_LINUX_CHMOD_COMMAND,
    IO_NET_LINUX_LAUNCH_BINARY_CURL,
)
from docker_stats_helper import calculate_cpu_percent_unix

client = docker.from_env()


def pause_containers():
    containerList = get_active_containers()
    for container in containerList:
        container.pause()


def resume_containers():
    containerList = get_active_containers()
    for container in containerList:
        container.unpause()


def restart_containers(worker_variables):
    stop_containers(True)

    start_container(worker_variables=worker_variables)


def start_container(worker_variables):
    platform = sys.platform

    if platform == "win32":
        start_container_win32(worker_variables)
    elif platform == "linux":
        start_container_linux(worker_variables)
    elif platform == "darwin":
        start_container_darwin(worker_variables)

    return None


def start_container_win32(worker_variables):
    device_name = worker_variables["DEVICE_NAME"]
    device_id = worker_variables["DEVICE_ID"]
    user_id = worker_variables["USER_ID"]
    operating_system = worker_variables["OPERATING_SYSTEM"]
    usegpus = worker_variables["USEGPUS"]

    env = os.environ.copy()
    env["DEVICE_NAME"] = device_name
    env["DEVICE_ID"] = device_id
    env["USER_ID"] = user_id
    env["OPERATING_SYSTEM"] = operating_system
    env["USEGPUS"] = usegpus

    command = [
        "docker",
        "run",
        "-d",
        "-v",
        "/var/run/docker.sock:/var/run/docker.sock",
        "-e",
        "DEVICE_NAME",
        "-e",
        "DEVICE_ID",
        "-e",
        "USER_ID",
        "-e",
        "OPERATING_SYSTEM",
        "-e",
        "USEGPUS",
        "--pull",
        "always",
        "ionetcontainers/io-launch:v0.1",
    ]

    subprocess.Popen(command, env=env)


def start_container_linux(worker_variables):
    if subprocess.Popen(IO_NET_LINUX_LAUNCH_BINARY_CURL).wait() != 0:
        raise Exception("Failed to download binary file")

    if subprocess.Popen(IO_NET_LINUX_CHMOD_COMMAND).wait() != 0:
        print("Failed to change permissions of binary file")
        return False

    device_id = worker_variables["DEVICE_ID"]
    user_id = worker_variables["USER_ID"]
    operating_system = worker_variables["OPERATING_SYSTEM"]
    usegpus = worker_variables["USEGPUS"]
    device_name = worker_variables["DEVICE_NAME"]

    command = [
        "./launch_binary_linux",
        "--device_id={}".format(device_id),
        "--user_id={}".format(user_id),
        '--operating_system="{}"'.format(operating_system),
        "--usegpus={}".format(usegpus),
        "--device_name={}".format(device_name),
    ]

    process = subprocess.Popen(command)

    if process.wait() != 0:
        print("Failed to start container")
        return False

    return True


def start_container_darwin(worker_command):
    if os.system(IO_NET_DARWIN_LAUNCH_BINARY_CURL) != 0:
        raise Exception("Failed to download binary file")

    if os.system(IO_NET_DARWIN_CHMOD_COMMAND) != 0:
        print("Failed to change permissions of binary file")
        return False

    device_id = worker_command["DEVICE_ID"]
    user_id = worker_command["USER_ID"]
    operating_system = worker_command["OPERATING_SYSTEM"]
    usegpus = worker_command["USEGPUS"]
    device_name = worker_command["DEVICE_NAME"]

    command = [
        "./launch_binary_mac",
        "--device_id={}".format(device_id),
        "--user_id={}".format(user_id),
        '--operating_system="{}"'.format(operating_system),
        "--usegpus={}".format(usegpus),
        "--device_name={}".format(device_name),
    ]

    process = subprocess.Popen(command)

    if process.wait() != 0:
        print("Failed to start container")
        return False

    return True


def get_all_containers():
    containerList = client.containers.list(all=True)

    ionetContainerList = filter_containers_by_prefix(
        containerList, IO_NET_CONTAINER_PREFIX
    )

    return ionetContainerList


def get_container_stats(container_id):
    container = client.containers.get(container_id)
    stats = container.stats(stream=False)

    cpu_usage = calculate_cpu_percent_unix(
        stats,
    )

    return {
        "id": container_id,
        "name": container.name,
        "image": container.attrs["Config"]["Image"].split("@")[0],
        "state": container.attrs["State"]["Status"],
        "cpu_usage": cpu_usage,
        "memory_usage": stats["memory_stats"]["usage"],
        "created": container.attrs["Created"],
    }


def get_active_container_stats():
    containerList = get_active_containers()

    stats = []
    for container in containerList:
        stats.append(get_container_stats(container.id))

    return stats


def get_active_containers():
    containerList = client.containers.list()

    ionetContainerList = filter_containers_by_prefix(
        containerList, IO_NET_CONTAINER_PREFIX
    )

    return ionetContainerList


def stop_containers(force=False):
    containerList = get_active_containers()
    for container in containerList:
        container.remove(force=force)


def filter_containers_by_prefix(containerList, prefix):
    filteredList = []
    for container in containerList:
        imageName = container.attrs["Config"]["Image"]

        if imageName.startswith(prefix):
            filteredList.append(container)
    return filteredList
