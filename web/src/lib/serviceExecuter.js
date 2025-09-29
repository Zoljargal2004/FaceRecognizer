

export async function serviceExecuter(
  body,
  endpoint,
  method,
  description = ""
) {
  try {
    const res = await fetch(`/api/${endpoint}`, {
      method: method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return res.json();
  } catch (e) {
    console.error(`service Error on ${description}  -  `, e);
  }
}
