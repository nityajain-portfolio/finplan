import Sidebar from './Sidebar';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getClient } from '../lib/api';

export default function Layout({ children }) {
  const router = useRouter();
  const clientId = router.query.client;
  const [clientName, setClientName] = useState('');

  useEffect(() => {
    if (clientId) {
      getClient(clientId).then(r => setClientName(r.data.company_name)).catch(() => {});
    }
  }, [clientId]);

  return (
    <div className="min-h-screen flex">
      <Sidebar clientId={clientId} clientName={clientName} />
      <main className="flex-1 ml-64 min-h-screen p-8 max-w-full overflow-x-hidden">
        {children}
      </main>
    </div>
  );
}
