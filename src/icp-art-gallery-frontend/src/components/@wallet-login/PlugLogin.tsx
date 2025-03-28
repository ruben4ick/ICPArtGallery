import '../../index.scss';
import { useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { loginWithPlug, createPlugActor, logoutPlug } from '../../hooks/wallet-login/plug-auth';
import { useAuth } from '../../context/@wallet-login/AuthContext';

export const PlugLogin = () => {
  const { principal, setPrincipal } = useAuth();

  useEffect(() => {
    if (window.ic?.plug?.sessionData) {
      window.ic.plug.getPrincipal().then((p: Principal) => {
        setPrincipal(p.toText());
      });
    }
  }, []);

  const handleLogin = async () => {
    const principalId = await loginWithPlug();
    if (principalId) {
      setPrincipal(principalId);
      createPlugActor();
    } else {
      console.warn('Plug login failed or was cancelled.');
    }
  };

  const handleLogout = () => {
    logoutPlug();
    setPrincipal(null);
  };

  return (
    <div>
      {principal ? (
        <button className="head-text cursor-pointer" onClick={handleLogout} type="button">
          .disconnect
        </button>
      ) : (
        <button className="head-text cursor-pointer" onClick={handleLogin} type="button">
          .connect_plug
        </button>
      )}
    </div>
  );
};

export default PlugLogin;
