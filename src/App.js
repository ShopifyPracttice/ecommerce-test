import './App.css';
import {BrowserRouter, Route, Routes} from "react-router-dom";
import ProductListing from './ProductsList';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<ProductListing/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
