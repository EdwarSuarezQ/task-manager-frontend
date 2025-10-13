import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuhtContext";

import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import TasksPage from "./pages/TasksPage";
import TaskFromPage from "./pages/TaskFromPage";
import ProfilePage from "./pages/ProfilePage";
import TaskDetailPage from "./pages/TaskDetailPage";
import UserSettingsPage from "./pages/UserSettingsPage";
import AdminUsersPage from "./pages/AdminUsersPage";

import ProtecteRoute from "./ProtectedRoute";
import { TaskProvider } from "./context/TasksContext";
import Navbar from "./components/Navbar";

function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Navbar />
          <main className="container mx-auto px-10">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              <Route element={<ProtecteRoute />}>
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/add-task" element={<TaskFromPage />} />
                <Route path="/tasks/:id" element={<TaskFromPage />} />
                <Route path="/tasks/view/:id" element={<TaskDetailPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/settings" element={<UserSettingsPage />} />
                <Route path="/admin" element={<AdminUsersPage />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}

export default App;
