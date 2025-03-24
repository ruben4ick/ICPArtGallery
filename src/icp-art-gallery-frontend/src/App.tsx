import { useState } from 'react';
import { icp_art_gallery_backend } from '../../declarations/icp-art-gallery-backend';
import logo from './logo2.svg';
import './index.scss';

const App: React.FC = () => {
  const [name, setName] = useState('');
  const [greeting, setGreeting] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const response = await icp_art_gallery_backend.greet(name);
    setGreeting(response);
  };

  return (
    <main>
      <img alt="DFINITY logo" src={logo} />
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">Enter your name: &nbsp;</label>
        <input id="name" onChange={(e) => setName(e.target.value)} type="text" value={name} />
        <button type="submit">Click Me!</button>
      </form>
      <section id="greeting">{greeting}</section>
    </main>
  );
};

export default App;
