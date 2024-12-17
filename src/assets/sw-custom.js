let config;

// Fetch the configuration during the install event
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     fetch("/assets/ngsw-config.json")
//       .then((response) => response.json())
//       .then((data) => {
//         config = data;
//         console.log("[Service Worker] Loaded config:", config);
//         return caches.open("app-cache-v1").then((cache) => {
//           const filesToPrefetch = config.assetGroups.find(
//             (group) => group.name === "app"
//           ).resources.files;
//           return cache.addAll(filesToPrefetch);
//         });
//       })
//       .catch((error) => {
//         console.error("[Service Worker] Failed to load config:", error);
//       })
//   );
// });

// self.addEventListener("notificationclick", function (event) {
//   console.log("this is the notification", event.notification.data);
//   const urlToOpen =
//     event.notification.data?.url || "https://platform.pieworks.in";

//   if (event.action) {
//     switch (event.action) {
//       case "foo":
//         event.waitUntil(clients.openWindow("/absolute/path"));
//         break;
//       case "bar":
//         event.waitUntil(
//           clients.matchAll({ type: "window" }).then((clientsArr) => {
//             const client = clientsArr.find((client) =>
//               client.url.includes("relative/path")
//             );
//             if (client) {
//               client.focus();
//             } else {
//               clients.openWindow("relative/path");
//             }
//           })
//         );
//         break;
//     }
//   } else {
//     event.waitUntil(clients.openWindow(urlToOpen));
//   }

//   event.notification.close();
// });

// const jsonFor = {
//   notification: {
//     title: "Hello!",
//     body: "You have a new message.",
//     icon: "/assets/icon.png",
//     click_action: "https://your-website.com",
//     data: {
//       customField: "customValue",
//     },
//   },
// };

// self.addEventListener("push", function (event) {
//   try {
//     const data = jsonFor; // Parse the JSON payload
//     console.log("Push event received: ", data);

//     const options = {
//       body: data.notification.body,
//       icon: data.notification.icon,
//       data: data.notification.click_action, // Pass the click_action URL
//     };

//     event.waitUntil(
//       self.registration.showNotification(data.notification.title, options)
//     );
//   } catch (error) {
//     console.error("Error handling push event:", error);
//   }
// });
