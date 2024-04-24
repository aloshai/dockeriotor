import classNames from "classnames";
import { useState } from "react";
import { useConfirmation } from "../hooks/use-confirmation.tsx";
import instance from "../lib/axios.ts";
import { toast } from "react-toastify";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

export function WorkerCard({ worker, onDelete }: any) {
  const showConfirmation = useConfirmation({ onConfirm });

  async function onConfirm() {
    try {
      await instance.delete("/worker/delete", {
        data: {
          tag: worker.tag,
        },
      });

      toast.success("Worker deleted successfully.");
      onDelete(worker.tag);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  async function updateCommand(e) {
    e.preventDefault();

    withReactContent(Swal)
      .fire({
        title: <span className="text-white">Update Command</span>,
        html: (
          <textarea
            id="command"
            rows={5}
            className="text-white w-full p-2 bg-black border border-gray-black rounded"
            placeholder="Command"
          ></textarea>
        ),
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "red",
        focusConfirm: false,
        cancelButtonColor: "#202020",
        confirmButtonText: "Update",
        cancelButtonText: "Cancel",
        background: "#101010",
        preConfirm: () => {
          const command = document.getElementById(
            "command"
          ) as HTMLInputElement;
          return command.value;
        },
        inputValue: worker.command,
      })
      .then((result) => {
        if (result.isConfirmed) {
          instance
            .patch("/worker/update", {
              tag: worker.tag,
              command: result.value,
            })
            .then(() => {
              toast.success("Command updated successfully.");
            })
            .catch((error: any) => {
              toast.error(error.response.data.message);
            });
        }
      });
  }

  async function sendAction(action: number) {
    try {
      await instance.post("/worker/action", {
        tag: worker.tag,
        action,
      });

      toast.success("Action sent successfully.");
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  const [workerCommandSpoiler, setWorkerCommandSpoiler] = useState(false);

  const activeContainers = worker.stats?.map((x) => x.image) || [];
  const containersStatus = worker.stats?.every((x) => x.state === "running");

  return (
    <div className="flex flex-col gap-4 border-b p-5 pl-5 first:rounded-t-md last:rounded-b-md border-b-gray-black bg-black">
      <div className="flex md:flex-row flex-col items-center md:gap-0 gap-4">
        <div className="flex flex-1 flex-col md:flex-row md:items-center gap-1 truncate md:gap-4">
          <div className="flex items-center justify-center relative px-2">
            <div
              className={classNames(
                "absolute w-3 h-3 rounded-full animate-ping",
                {
                  "bg-green-500": worker.isActive,
                  "bg-red-500": !worker.isActive,
                }
              )}
            ></div>
            <div
              className={classNames("w-2 h-2 rounded-full", {
                "bg-green-500": worker.isActive,
                "bg-red-500": !worker.isActive,
              })}
            ></div>
          </div>
          <div className="flex flex-1 flex-col gap-1 truncate">
            <div
              className="min-w-0 truncate text-black dark:text-white font-medium"
              title="rtx-super-4070"
            >
              #{worker.tag}
            </div>
            {activeContainers.length > 0 && (
              <div className="text-xs text-gray text-wrap">
                <span className="bg-green-light-300 text-light-300 !bg-transparent">
                  IO.NET Containers
                </span>
                : {activeContainers.join(", ")}
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row items-center gap-4 mr-8">
          <div className="flex flex-col justify-center gap-2 rounded-full px-3 py-[6px] text-xs lg:flex-none bg-orange/10 text-orange">
            <div className="w-44 flex justify-between">
              <span className="text-gray mr-4">Dockeriotor:</span>
              <span
                className={classNames("text-right", {
                  "text-green-500": worker.isActive,
                  "text-red-500": !worker.isActive,
                })}
              >
                {worker.isActive ? "Connected" : "Not Connected"}
              </span>
            </div>
            <div className="w-44 flex justify-between">
              <span className="text-gray mr-4">IO.NET:</span>
              <span
                className={classNames({
                  "text-green-500": containersStatus,
                  "text-red-500": !containersStatus,
                })}
              >
                {containersStatus ? "Containers running" : "Unknown"}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={showConfirmation}
            className="w-8 h-8 rounded-full flex items-center justify-center group hover:bg-red-500 bg-red-500/20 transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5 stroke-red-500 group-hover:stroke-white transition"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              />
            </svg>
          </button>
        </div>
      </div>

      {worker.stats && (
        <>
          <h3 className="mt-4 font-medium text-sm">Containers</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {worker.stats.map((container: any) => (
              <div
                key={container.id}
                className="flex flex-col gap-2 p-4 border border-gray-black rounded"
              >
                <div className="flex justify-between items-center gap-2">
                  <div className="text-xs text-white">{container.image}</div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <div className="text-xs text-gray">{container.state}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="text-xs text-gray">CPU Usage:</div>
                  <div className="text-xs text-gray">
                    {container.cpu_usage.toFixed(2)}%
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <div className="text-xs text-gray">Memory Usage:</div>
                  <div className="text-xs text-gray">
                    {(container.memory_usage / 1024 / 1024).toFixed(2)}MB
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {worker.isActive && (
        <>
          <h3 className="mt-4 font-medium text-sm">Commands</h3>
          {/**
           * Start, Stop, Pause, Resume with svgs
           */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <WorkerCommand
              onClick={() => sendAction(0)}
              icon={StartIcon}
              title="Start"
            />
            <WorkerCommand
              onClick={() => sendAction(1)}
              icon={StopIcon}
              title="Stop"
            />
            <WorkerCommand
              onClick={() => sendAction(3)}
              icon={PauseIcon}
              title="Pause"
            />
            <WorkerCommand
              onClick={() => sendAction(4)}
              icon={ResumeIcon}
              title="Resume"
            />
            <WorkerCommand
              onClick={() => sendAction(2)}
              icon={RestartIcon}
              title="Restart"
            />
          </div>
        </>
      )}

      <h3 className="mt-4 font-medium text-sm">IO.NET Worker Command</h3>
      <div
        onClick={() => setWorkerCommandSpoiler(!workerCommandSpoiler)}
        className="border border-gray-black p-4 rounded font-mono text-xs relative"
      >
        {/**
         * spoiler
         */}

        {!workerCommandSpoiler && (
          <div className="absolute top-0 left-0 w-full h-full bg-black bg-opacity-50 backdrop-blur-md rounded z-10 flex items-center justify-center cursor-pointer">
            Show command
          </div>
        )}
        {worker.command}
      </div>
      <button
        onClick={updateCommand}
        className="px-5 py-3 text-xs font-medium text-white bg-gray-black rounded hover:bg-white hover:text-black transition border border-gray-black w-max ml-auto"
      >
        Update Command
      </button>
    </div>
  );
}

export const StartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z"
    />
  </svg>
);

export const StopIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 group-hover:stroke-black transition"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15.75 5.25v13.5m-7.5-13.5v13.5"
    />
  </svg>
);

export const PauseIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 group-hover:stroke-black transition"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z"
    />
  </svg>
);

export const ResumeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 group-hover:stroke-black transition"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
    />
  </svg>
);

export const RestartIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="w-6 h-6 group-hover:stroke-black transition"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5.25 7.5A2.25 2.25 0 0 1 7.5 5.25h9a2.25 2.25 0 0 1 2.25 2.25v9a2.25 2.25 0 0 1-2.25 2.25h-9a2.25 2.25 0 0 1-2.25-2.25v-9Z"
    />
  </svg>
);

export function WorkerCommand({ icon, title, onClick }: any) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-4 p-4 border border-gray-black rounded group hover:bg-white transition"
    >
      {icon}
      <div className="text-xs group-hover:text-black transition">{title}</div>
    </button>
  );
}
