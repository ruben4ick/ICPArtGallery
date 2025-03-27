import '../../index.scss';
import './style.scss';
import PlugLogin from '../@wallet-login/PlugLogin';

export const Navbar = () => {
  return (
    <div className="head-glass flex">
      <div className="head-text">
        <a href="/">.gallery</a>
      </div>
        <div className="head-text ml-auto">
            <PlugLogin />
        </div>
    </div>
  );
};
