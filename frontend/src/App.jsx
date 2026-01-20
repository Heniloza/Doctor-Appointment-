import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './RoleSelection';

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<RoleSelection />} />
         
        </Routes>
      </Router>
    </>
  );
}

export default App
