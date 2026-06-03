import { ViteReactSSG } from "vite-react-ssg";
import { routes } from "./App";
import "./index.css";

// In production the SPA lives under /market-intelligence/ (WordPress page slug); in dev, root.
const basename = import.meta.env.PROD ? "/market-intelligence" : "/";

// vite-react-ssg builds the router (createBrowserRouter) and wraps the tree with
// HelmetProvider for head collection. This export is the entry the SSG build + client use.
export const createRoot = ViteReactSSG({ routes, basename });
