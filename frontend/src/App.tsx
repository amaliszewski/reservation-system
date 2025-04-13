import { Navigate, Route, Routes } from 'react-router';
import { HomePage } from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const { authUser } = useAuthStore();

  return (
    <div>
      <Routes>
        {/* <Route path="/" element={<HomePage />} /> */}
        <Route
          path="/"
          element={authUser ? <HomePage /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/" />}
        />
      </Routes>
    </div>
  );
}

export default App;
