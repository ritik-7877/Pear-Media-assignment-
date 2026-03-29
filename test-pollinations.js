async function test() {
  const prompt = "Output a JSON object with: { \"hello\": \"world\" }";
  const res = await fetch(`https://text.pollinations.ai/${encodeURIComponent(prompt)}`);
  console.log(await res.text());
}
test();
