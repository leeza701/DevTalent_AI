async function test() {
  try {
    const login = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test_recruiter@example.com', password: 'password123' })
    });
    console.log('Login Status:', login.status);
    const data = await login.json();
    if (!data.token) {
      console.log('Login failed:', data);
      return;
    }
    const token = data.token;
    console.log('Token received');

    const res = await fetch('http://localhost:5000/api/resumes/all', {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Candidates Data:', await res.json());
  } catch (err) {
    console.log('Error:', err.message);
  }
}

test();
