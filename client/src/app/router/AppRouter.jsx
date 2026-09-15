import { useRoutes } from "react-router-dom";
import { routes } from "./routes";

const AppRouter = () => {
  return useRoutes(routes);
};

export default AppRouter;