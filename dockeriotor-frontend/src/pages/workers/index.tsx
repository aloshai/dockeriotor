import { Tooltip } from "react-tooltip";
import { WorkerCard } from "../../components/worker-card";
import { useQuery } from "@tanstack/react-query";
import instance from "../../lib/axios";
import { Link } from "react-router-dom";

export function Workers() {
  const query = useQuery({
    queryKey: ["workers"],
    refetchInterval: 10000,
    queryFn: async () => {
      const response = await instance("/worker/my");
      const responseData = response.data;

      return responseData.data;
    },
  });

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error: {query.error.message}</div>;
  }

  return (
    <div className="mt-16 max-w-screen-lg w-full mx-auto">
      <h1 className="text-3xl text-white font-semibold">Workers</h1>
      <p className="text-xs mt-2 text-white/50">
        All your workers registered to Dockeriotor are listed below. You can see
        the status of your Workers below, give commands, change your IO.NET
        command or view the resource usage of Docker Containers.
      </p>

      <p className="text-orange-500 text-xs mt-8 px-8 py-4 bg-orange-500/20 rounded">
        Warning: The changes you make here do not affect IO.NET. Dockeriotor
        keeps track of your changes through its own Cloud. Dockeriotor uses
        these changes only for the requirements within the system. If you have
        closed your IO.NET Worker from IO.NET, it is normal for it to appear
        open here. <br /> <br /> Dockeriotor manages your Docker using your
        Worker run commands.
      </p>

      <div className="flex justify-end mt-8 gap-4">
        <a
          href="https://cloud.io.net/worker/devices"
          target="_blank"
          className="flex items-center gap-2 px-6 py-4 text-xs font-medium text-white border border-gray-black hover:bg-white hover:text-black transition rounded-full"
          data-tooltip-id="create-new-worker"
          data-tooltip-content="Redirects to the IO.NET Worker creation page."
        >
          Create New Worker
        </a>
        <Tooltip id="create-new-worker" />
        <Link
          to={"/workers/create"}
          data-tooltip-id="add-worker-dockeriotor"
          data-tooltip-content="Allows you to register your Worker in Dockeriotor and create commands"
          className="flex items-center gap-2 px-6 py-4 text-xs font-medium text-white border border-gray-black hover:bg-white hover:text-black transition rounded-full"
        >
          Add Worker Dockeriotor
        </Link>
        <Tooltip id="add-worker-dockeriotor" />
      </div>

      <div className="border border-gray-black mt-4">
        {query.data.map((worker) => (
          <WorkerCard
            onDelete={query.refetch}
            key={worker.id}
            worker={worker}
          />
        ))}
      </div>
    </div>
  );
}
