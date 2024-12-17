self.addEventListener("notificationclick", function (event) {
  console.log("this is the notification", event.notification.data);
  const urlToOpen =
    event.notification.data?.url || "https://platform.pieworks.in";

  if (event.action) {
    switch (event.action) {
      case "foo":
        event.waitUntil(clients.openWindow("/absolute/path"));
        break;
      case "bar":
        event.waitUntil(
          clients.matchAll({ type: "window" }).then((clientsArr) => {
            const client = clientsArr.find((client) =>
              client.url.includes("relative/path")
            );
            if (client) {
              client.focus();
            } else {
              clients.openWindow("relative/path");
            }
          })
        );
        break;
    }
  } else {
    event.waitUntil(clients.openWindow(urlToOpen));
  }

  event.notification.close();
});
