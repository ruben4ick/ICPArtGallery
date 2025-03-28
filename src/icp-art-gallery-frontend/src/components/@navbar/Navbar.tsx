import '../../index.scss';
import './style.scss';
import PlugLogin from '../@wallet-login/PlugLogin';

export const Navbar = () => {
  return (
    <div className="glass head-glass flex">
      <div className="head-text flex-1">
        <a href="/">.gallery</a>
      </div>
      <div className="head-text flex justify-end">
        <PlugLogin />
      </div>
    </div>
  );
};
