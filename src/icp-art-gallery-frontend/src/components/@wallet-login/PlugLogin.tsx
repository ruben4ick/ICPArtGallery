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
    <div style={{ padding: '1rem' }}>
      {principal ? (
        <div>
          <span className="head-text" onClick={handleLogout}>
            <a href="">.disconnect</a>
          </span>
        </div>
      ) : (
        <span className="head-text" onClick={handleLogin}>
          <a href="">.connect_plug</a>
        </span>
      )}
    </div>
  );
};

export default PlugLogin;
