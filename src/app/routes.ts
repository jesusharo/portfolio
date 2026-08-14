import { createBrowserRouter } from "react-router";
import Root from "./components/Root";
import ChatView from "./components/ChatView";
import ProjectsView from "./components/ProjectsView";
import CaseStudiesView from "./components/CaseStudiesView";
import ProjectDetailProjects from "./components/ProjectDetailProjects";
import ProjectDetailCases from "./components/ProjectDetailCases";
import ContactView from "./components/ContactView";
import AboutView from "./components/AboutView";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: ChatView },
      { path: "chat/:conversationId", Component: ChatView },
      { path: "projects", Component: ProjectsView },
      { path: "projects/:id", Component: ProjectDetailProjects },
      { path: "cases", Component: CaseStudiesView },
      { path: "cases/:id", Component: ProjectDetailCases },
      { path: "contact", Component: ContactView },
      { path: "about", Component: AboutView },
    ],
  },
]);
