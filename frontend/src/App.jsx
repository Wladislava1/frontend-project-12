import { Routes, Route } from 'react-router-dom';
import { HomeLayout, LoginPage, NotFoundPage } from './components/Pages.jsx';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeLayout />}>
        <Route index element={<LoginPage />} />
        <Route path="login" element={<LoginPage />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
export default App;
