import Navbar from './components/@navbar/Navbar';
import './index.scss';
import Gallery from './components/@gallery/Gallery';

const App: React.FC = () => {
  return (
    <main>
      <Navbar />
      <div className="mt-[calc(5vh+20px)]">
        <Gallery />
      </div>
    </main>
  );
};

export default App;
