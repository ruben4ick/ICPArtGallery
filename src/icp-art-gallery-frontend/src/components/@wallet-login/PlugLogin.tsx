import { useState, useEffect } from 'react';
import { Principal } from '@dfinity/principal';
import { loginWithPlug, createPlugActor, logoutPlug } from '../../hooks/auth/plug-auth';
import { useAuth } from '../../context/AuthContext';

export const PlugLogin = () => {
  const { principal, setPrincipal } = useAuth();

  useEffect(() => {
    if (window.ic?.plug?.sessionManager?.sessionData) {
      window.ic.plug.getPrincipal().then((p: Principal) => {
        setPrincipal(p.toText());
      });
    }
  }, []);

  const handleLogin = async () => {
    const principalId = await loginWithPlug();
    if (principalId) {
      setPrincipal(principalId);
      await createPlugActor();
    } else {
      console.warn("Plug login failed or was cancelled.");
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
          <p>
            ✅ Connected as: <code>{principal}</code>
          </p>
          <button onClick={handleLogout} type="button">
            Disconnect
          </button>
        </div>
      ) : (
        <button onClick={handleLogin} type="button">
          🔌 Connect with Plug Wallet
        </button>
      )}
    </div>
  );
};

export default PlugLogin;
