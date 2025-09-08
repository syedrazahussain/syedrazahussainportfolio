import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homescreen from './screens/Homescreen';
import Internshala from './pages/internshala';
import Allprojectspage from './pages/allprojectspage';


function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homescreen />} />
          <Route path="/internshala" element={<Internshala/>} /> 
          <Route path="/allprojectspage" element={<Allprojectspage/>} />  
          


        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
