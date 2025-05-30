import '../../index.scss';
import './style.scss';
import { useAuth } from '../../context/@wallet-login/AuthContext';
import PlugLogin from '../@wallet-login/PlugLogin';
import { AddNft } from '../@add-nft/AddNft';
import Sorter from '../@gallery/Sorter/Sorter';

export const Navbar = () => {
  const { principal } = useAuth();

  return (
    <div className="glass head-glass flex">
      <div className="head-text flex-1">
        <a href="/">.gallery</a>
      </div>
      <div className="head-text flex justify-end gap-4 whitespace-nowrap">
        {principal ? <AddNft /> : null}
        <Sorter />
        <PlugLogin />
      </div>
    </div>
  );
};

export default Navbar;
