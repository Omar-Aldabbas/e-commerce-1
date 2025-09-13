
window.fetchData = async (url) => {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status || "404"}`);
    const data = await res.json();
    return data;
  } catch (err) {
    console.error("Error fetching products:", err || "No Data");
    return null;
  }
};
