import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import ChatView from "./components/ChatView";
import ProjectsView from "./components/ProjectsView";
import CaseStudiesView from "./components/CaseStudiesView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: ChatView },
      { path: "chat/:conversationId", Component: ChatView },
      { path: "projects", Component: ProjectsView },
      { path: "cases", Component: CaseStudiesView },
    ],
  },
]);
