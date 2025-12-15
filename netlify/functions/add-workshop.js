async function createWorkshop() {
  const locationInput = document.getElementById("location");

  const data = {
    admin_id,
    title: title.value.trim(),
    description: desc.value.trim(),
    date: date.value,
    time: time.value,
    location: locationInput.value.trim(),
    link: link.value.trim()
  };

  if (!data.title || !data.date) {
    alert("⚠️ عنوان الورشة والتاريخ مطلوبان");
    return;
  }

  const res = await fetch("/.netlify/functions/add-workshop", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

  if (!res.ok) {
    alert("❌ فشل إنشاء الورشة");
    return;
  }

  alert("✔️ تم إنشاء الورشة بنجاح");
  title.value = "";
  desc.value = "";
  date.value = "";
  time.value = "";
  locationInput.value = "";
  link.value = "";
  loadWorkshops();
}
