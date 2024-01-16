import { Controller } from "@hotwired/stimulus";
import * as localforage from "localforage";

export default class extends Controller {
  async connect() {
    console.log("conectado a sync");
    this.onlineStatus = localStorage.getItem("onlineStatus") === "true";
  }

  async sync(event) {
    event.preventDefault();
    console.log(this.onlineStatus);
    if (this.onlineStatus) return;

    const user = await localforage.getItem("user");
    console.log(user, "user");
    if (user) {
      try {
        const csrfToken = document.querySelector(
          'meta[name="csrf-token"]'
        ).content;
        console.log(user, "users");
        const response = await fetch("http://127.0.0.1:3000/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-CSRF-Token": csrfToken,
          },
          body: JSON.stringify({ user: user }),
        });

        if (response.ok) {
          console.log("finalizo");
          await localforage.removeItem("user");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    } else {
      console.warn("No hay datos para sincronizar en IndexedDB");
    }
  }
}
