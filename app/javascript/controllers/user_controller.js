import { Controller } from "@hotwired/stimulus";
import * as localforage from "localforage";
var pixel = "/1pixel.png";
export default class extends Controller {
  static targets = ["name", "lastname", "email", "form"];

  connect() {
    console.log("El controlador se ha conectado");
    this.checkOnlineStatus();
  }

  async checkOnlineStatus() {
    try {
      // Asegúrate de que la imagen no esté almacenada en caché
      var assetPath = pixel + "?t=" + new Date().getTime();
      const online = await fetch(assetPath, { cache: "no-store" });
      this.onlineStatus = online.status >= 200 && online.status < 300;
      localStorage.setItem("onlineStatus", this.onlineStatus.toString());
    } catch (err) {
      this.onlineStatus = false;
      localStorage.setItem("onlineStatus", this.onlineStatus.toString());
    }
  }

  async submit(event) {
    console.log("entroooo");
    this.onlineStatus = localStorage.getItem("onlineStatus") === "true";
    console.log(this.onlineStatus, "ook");
    if (!this.onlineStatus) {
      event.preventDefault();
      const name = this.nameTarget.value;
      const lastname = this.lastnameTarget.value;
      const email = this.emailTarget.value;
      await localforage.setItem("user", { name, lastname, email });
      const user = await localforage.getItem("user");
      console.log(user, "user");
    }
  }
}
