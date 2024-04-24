import { useQuery } from "@tanstack/react-query";
import instance from "../lib/axios";

export const useUser = () => {
  const query = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        return null;
      }

      const response = await instance.get("/auth/profile");
      const responseData = response.data;

      return responseData.data;
    },
  });

  return query;
};

export const AuthLoader = ({ children }) => {
  const query = useUser();

  if (query.isLoading) {
    return <div>Loading...</div>;
  }

  if (query.isError) {
    return <div>Error...</div>;
  }

  return children;
};
