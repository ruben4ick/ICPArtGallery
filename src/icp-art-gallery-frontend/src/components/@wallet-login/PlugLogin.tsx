import { useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { loginWithPlug, createPlugActor, logoutPlug } from '../../hooks/wallet-login/plug-auth';
import { useAuth } from '../../context/@wallet-login/AuthContext';
import '../../index.scss';

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
          <button type="button" className="head-text cursor-pointer" onClick={handleLogout}>.disconnect</button>
      ) : (
          <button type="button" className="head-text cursor-pointer" onClick={handleLogin}>.connect_plug</button>
      )}
    </div>
  );
};

export default PlugLogin;
