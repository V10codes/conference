import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Layout, RequireAuth } from "./routes/layout/layout";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import MyConferences from "./routes/myConferences/myConferences";
import AuthoredConferences from "./routes/authoredConferences/authoredConferences";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewConferencePage from "./routes/newConferencePage/newConferencePage";
import ApproveAttendeePage from "./routes/approveAttendeePage/approveAttendeePage";
import ConferenceRegisterPage from "./routes/conferenceRegisterPage/conferenceRegisterPage";
import { profilePageLoader } from "./lib/loaders.js";
import ConferenceDetail from "./routes/conferenceDetail/conferenceDetail.jsx";
import ConferenceUpdatePage from "./routes/conferenceUpdatePage/conferenceUpdatePage.jsx";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },

        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        {
          path: "/add",
          element: <NewConferencePage />,
        },
        {
          path: "/authored-conferences",
          element: <AuthoredConferences />,
        },
        {
          path: "/my-conferences",
          element: <MyConferences />,
        },
        {
          path: "/conference/:id",
          element: <ConferenceDetail />,
        },
        {
          path: "/conference/register/:id",
          element: <ConferenceRegisterPage />,
        },
        {
          path: "/authored-conferences/attendee-list/:id",
          element: <ApproveAttendeePage />,
        },
        {
          path: "/authored-conferences/update/:id",
          element: <ConferenceUpdatePage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
