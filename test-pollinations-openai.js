async function test() {
  const res = await fetch('https://text.pollinations.ai/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      messages: [{role: 'user', content: 'Say hello in JSON format { "hello": "world" }'}],
      jsonMode: true
    })
  });
  console.log(await res.text());
}
test();
