import { useState } from "react";
import { useUser } from "../../lib/auth";
import instance from "../../lib/axios";
import { toast } from "react-toastify";

export function CreateWorker() {
  const user = useUser();

  const [worker, setWorker] = useState<any>(null);

  const [name, setName] = useState<string>("");
  const [workerCommand, setWorkerCommand] = useState<string>("");

  async function createWorker() {
    if (!name || !workerCommand) {
      toast.error("Please fill in all fields.");
      return;
    }

    try {
      const response = await instance.post("/worker/create", {
        tag: name,
        command: workerCommand,
      });

      const responseData = response.data;
      setWorker(responseData.data);

      toast.success("Worker created successfully.");
      setTimeout(() => {
        const element = document.getElementById("worker-deployment");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 200);
    } catch (error: any) {
      toast.error(error.response.data.message);
    }
  }

  return (
    <div className="flex flex-col max-w-screen-lg w-full mx-auto mt-14">
      <h1 className="text-4xl font-semibold">Create Dockeriotor Client</h1>

      <div className="flex md:flex-row flex-col mt-12 gap-12">
        <div className="w-72 shrink-0">
          <h3 className="font-semibold">1. Name your worker</h3>
          <p className="text-gray text-xs mt-2">
            Add a unique name for your device, The ideal format would be similar
            to the following: My-Test-Device
          </p>
        </div>
        <div className="flex flex-col w-full grow border rounded border-gray-black p-5 text-xs">
          <label className="text-gray" htmlFor="">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-4 border rounded border-gray-black bg-transparent mt-4 focus:outline-none focus:border-gray-500 transition"
            placeholder="Device name"
            type="text"
          />
        </div>
      </div>

      <div className="flex md:flex-row flex-col mt-12 gap-12">
        <div className="w-72 shrink-0">
          <h3 className="font-semibold">2. Awareness</h3>
          <p className="text-gray text-xs mt-2">
            Make sure the requirements for your IO.NET Worker are installed.
          </p>
        </div>
        <div className="flex flex-col w-full grow border rounded border-gray-black p-5 text-xs">
          <h4 className="text-lg font-semibold">1. Run your IO.NET Worker</h4>
          <p className="mt-1 text-gray">
            If you haven't already, create your{" "}
            <a
              href="https://cloud.io.net/worker/devices"
              className="underline font-bold"
              target="_blank"
            >
              IO.NET Worker
            </a>
            .
          </p>
          <div className="p-4 border rounded border-gray-black bg-transparent mt-4 focus:outline-none focus:border-gray-500 transition">
            {
              "Your IO.NET Worker has its own commands. Please run them by following the steps given by IO.NET."
            }
          </div>
        </div>
      </div>

      <div className="flex md:flex-row flex-col mt-12 gap-12">
        <div className="w-72 shrink-0">
          <h3 className="font-semibold">3. Your Worker Command</h3>
          <p className="text-gray text-xs mt-2">
            Dockeriotor obtains environment data using IO.NET's command. We
            integrate the values ​​in this command into IO.NET's launch command.
          </p>
        </div>
        <div className="flex flex-col w-full grow border rounded border-gray-black p-5 text-xs">
          <label className="text-gray" htmlFor="">
            Worker Command
          </label>
          <textarea
            value={workerCommand}
            onChange={(e) => setWorkerCommand(e.target.value)}
            rows={5}
            className="p-4 border rounded border-gray-black bg-transparent mt-4 focus:outline-none focus:border-gray-500 transition"
            placeholder="Worker Command"
          ></textarea>
        </div>
      </div>

      <button
        type="button"
        className="mt-12 px-8 py-2 rounded-full border hover:bg-white hover:text-black transition"
        onClick={() => createWorker()}
      >
        Create Worker
      </button>

      {worker && (
        <div
          id="worker-deployment"
          className="flex md:flex-row flex-col mt-12 gap-12"
        >
          <div className="w-72 shrink-0">
            <h3 className="font-semibold">
              4. Download and launch Dockeriotor
            </h3>
            <p className="text-gray text-xs mt-2">
              Dockeriotor has a separate Client. It runs this.
            </p>
          </div>
          <div className="flex flex-col w-full grow border rounded border-gray-black p-5 text-xs">
            <h4 className="text-lg font-semibold">
              1. Run the command to download Dockeriotor
            </h4>
            <div className="p-4 border rounded border-gray-black bg-transparent mt-4 focus:outline-none focus:border-gray-500 transition">
              {
                "curl -L https://github.com/aloshai/dockeriotor -o dockeriotor.sh"
              }
            </div>
            <h4 className="text-lg font-semibold mt-4">
              2. Run the command to launch binary
            </h4>
            <div className="p-4 border rounded border-gray-black bg-transparent mt-4 focus:outline-none focus:border-gray-500 transition">
              {"chmod +x dockeriotor.sh"}
            </div>
            <h4 className="text-lg font-semibold mt-4">
              3. Run the command to start Dockeriotor
            </h4>
            <div className="p-4 border rounded border-gray-black bg-transparent mt-4 focus:outline-none focus:border-gray-500 transition">
              {`python main.py --user-id=${user.data.id} --tag=${worker.tag}`}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
