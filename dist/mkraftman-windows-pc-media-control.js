/**
 * mkraftman-windows-pc-media-control
 * Dummy media control card for Windows PC via Unified Remote.
 * Matches the Sky Q media control visual style.
 * Controls: Home (navigate to streaming), rewind, play/pause, fast-forward, Windows key.
 */

class MkraftmanWindowsPCMediaControl extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this._config = null;
    this._hass = null;
    this._el = {};
    this._built = false;
  }

  static getStubConfig() {
    return {};
  }

  setConfig(config) {
    this._config = config || {};
    if (this._built) this._update();
    else if (this._hass) this._build();
  }

  getCardSize() {
    return 3;
  }

  getGridOptions() {
    return { rows: 3, columns: 12, min_rows: 3, min_columns: 6 };
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._config) return;
    if (!this._built) {
      this._build();
      return;
    }
  }

  _build() {
    if (this._built || !this._hass || !this._config) return;

    const shadow = this.shadowRoot;
    shadow.innerHTML = `
      <style>
        :host {
          display: block;
          --mc-fg: var(--primary-text-color, #fff);
        }
        ha-card {
          position: relative;
          overflow: hidden;
          height: 100%;
          box-sizing: border-box;
          background: #132532;
        }

        .bg { position: absolute; inset: 0; }
        .bg-color {
          position: absolute; inset: 0;
          background-color: #132532;
        }
        .bg-image {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          background-size: cover;
          background-position: center;
          background-image: url('/local/images/windows.png');
          opacity: 1;
        }
        .bg-gradient {
          position: absolute;
          right: 0; top: 0; bottom: 0;
          background: linear-gradient(to right, #132532 0%, transparent 100%);
          opacity: 1;
        }

        .player {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          padding: 16px;
          height: 100%;
          box-sizing: border-box;
          color: var(--mc-fg);
        }

        .name {
          font-size: 18px;
          font-weight: 500;
          opacity: 0.85;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: var(--mc-fg);
          margin-bottom: 8px;
        }

        .controls {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 4px 0;
          gap: 4px;
          flex: 1;
        }
        .ctrl {
          background: none;
          border: none;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 10px;
          flex: 1;
          max-width: 72px;
          transition: background-color 0.15s;
          color: var(--mc-fg);
          -webkit-tap-highlight-color: transparent;
          outline: none;
        }
        .ctrl ha-icon {
          --mdc-icon-size: 40px;
          color: var(--mc-fg);
        }
        .ctrl .icon-circle {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 700;
          user-select: none;
          border: 1px solid white;
          box-sizing: border-box;
        }
        .ctrl.home .icon-circle {
          background: #0078D4;
        }
        .ctrl.home .icon-circle ha-icon {
          --mdc-icon-size: 22px;
          color: white;
        }
        .ctrl.win .icon-circle {
          background: #0078D4;
        }
        .ctrl.win .icon-circle ha-icon {
          --mdc-icon-size: 22px;
          color: white;
        }
        .ctrl.pp {
          max-width: 132px;
        }
        .ctrl.pp ha-icon {
          --mdc-icon-size: 65px;
        }
      </style>

      <ha-card>
        <div class="bg">
          <div class="bg-color"></div>
          <div class="bg-image" id="bgImage"></div>
          <div class="bg-gradient" id="bgGrad"></div>
        </div>
        <div class="player">
          <div class="name">Windows PC</div>
          <div class="controls">
            <button class="ctrl home" id="homeBtn">
              <div class="icon-circle">
                <ha-icon icon="mdi:home"></ha-icon>
              </div>
            </button>
            <button class="ctrl" id="rw">
              <ha-icon icon="mdi:rewind"></ha-icon>
            </button>
            <button class="ctrl pp" id="pp">
              <ha-icon icon="mdi:play-pause"></ha-icon>
            </button>
            <button class="ctrl" id="ff">
              <ha-icon icon="mdi:fast-forward"></ha-icon>
            </button>
            <button class="ctrl win" id="winBtn">
              <div class="icon-circle">
                <ha-icon icon="mdi:microsoft-windows"></ha-icon>
              </div>
            </button>
          </div>
        </div>
      </ha-card>
    `;

    this._el = {
      card: shadow.querySelector("ha-card"),
      bgImage: shadow.getElementById("bgImage"),
      bgGrad: shadow.getElementById("bgGrad"),
    };

    shadow.getElementById("homeBtn").addEventListener("click", () => {
      window.location.href = "/living-room-streaming/0";
    });

    shadow.getElementById("rw").addEventListener("click", () => {
      this._sendUR("Relmtech.Keyboard", "toggle", { Values: [{ Value: "media_prev" }] });
    });
    shadow.getElementById("pp").addEventListener("click", () => {
      this._sendUR("Relmtech.Keyboard", "toggle", { Values: [{ Value: "media_play_pause" }] });
    });
    shadow.getElementById("ff").addEventListener("click", () => {
      this._sendUR("Relmtech.Keyboard", "toggle", { Values: [{ Value: "media_next" }] });
    });

    shadow.getElementById("winBtn").addEventListener("click", () => {
      // Double-toggle: key-down then key-up after 100ms
      this._sendUR("Relmtech.Keyboard", "toggle", { Values: [{ Value: "LWIN" }] });
      setTimeout(() => {
        this._sendUR("Relmtech.Keyboard", "toggle", { Values: [{ Value: "LWIN" }] });
      }, 100);
    });

    this._built = true;
    this._updateBgSize();

    this._resizeObserver = new ResizeObserver(() => {
      this._updateBgSize();
    });
    this._resizeObserver.observe(this._el.card);
  }

  _updateBgSize() {
    if (!this._el.card || !this._el.bgImage) return;
    const h = this._el.card.offsetHeight;
    if (h > 0) {
      this._el.bgImage.style.width = h + "px";
      this._el.bgGrad.style.width = h + "px";
    }
  }

  _sendUR(remoteId, action, extras) {
    if (!this._hass) return;
    const data = { remote_id: remoteId, action: action };
    if (extras) data.extras = extras;
    this._hass.callService("unified_remote", "call", data);
  }

  _update() {}

  connectedCallback() {
    if (this._hass && this._config && !this._built) {
      this._build();
    }
  }

  disconnectedCallback() {
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
      this._resizeObserver = null;
    }
  }
}

customElements.define("mkraftman-windows-pc-media-control", MkraftmanWindowsPCMediaControl);

window.customCards = window.customCards || [];
window.customCards.push({
  type: "mkraftman-windows-pc-media-control",
  name: "Mkraftman Windows PC Media Control",
  description: "Transport controls for Windows PC via Unified Remote.",
});
