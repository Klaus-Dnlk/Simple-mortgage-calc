class CookiesBanner {
  constructor() {
    this.init();
  }

  init() {
    if (!document.getElementById('cookies-banner')) {
      this.render();
      this.setupEventListeners();
      this.checkCookie();
    }
  }

  setCookies(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = 'expires=' + date.toUTCString();
    document.cookie = `${name}=${value};${expires};path=/`;
    console.log(`Cookie set: ${name}=${value};${expires};path=/`);
  }

  getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  }

  render() {
    const bannerHTML = `
            <style>
                .cookies-banner {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    right: 0;
                    background-color: #333;
                    color: white;
                    padding: 16px;
                    text-align: center;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    transition: transform 0.5s ease-in-out;
                }
                .cookies-banner.hidden {
                    transform: translateY(100%);
                }
                .cookies-banner button {
                    background-color: #f50057;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    cursor: pointer;
                }
            </style>
            <div id="cookies-banner" class="cookies-banner">
                <span>This website uses cookies to enhance the user experience.</span>
                <button id="accept-button">Accept</button>
            </div>
        `;

    document.body.insertAdjacentHTML('beforeend', bannerHTML);
    this.banner = document.getElementById('cookies-banner');
    this.acceptButton = document.getElementById('accept-button');
  }

  setupEventListeners() {
    if (this.acceptButton) {
      this.acceptButton.addEventListener(
        'click',
        this.handleAcceptButtonClick.bind(this)
      );
    }
  }

  handleAcceptButtonClick() {
    console.log('Accept button clicked');
    this.setCookies('userConsent', 'accepted', 365);
    this.banner.classList.add('hidden');
  }

  checkCookie() {
    const consent = this.getCookie('userConsent');
    console.log(`Check cookie: userConsent=${consent}`);
    if (consent === 'accepted') {
      this.banner.classList.add('hidden');
    }
  }
}

export default CookiesBanner;
