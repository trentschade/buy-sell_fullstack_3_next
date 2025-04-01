import { useEffect, useState } from 'react';

export default function Home() {
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetch('/api/hello')
      .then(res => res.json())
      .then(data => setMessage(data.message));
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Next.js Starter</h1>
      <p>{message || 'Loading...'}</p>
    </div>
  );
}
