export default class Form {
  constructor(forms) {
    this.forms = document.querySelectorAll(forms);
    this.inputs = document.querySelectorAll("input");
    this.message = {
      loading: "Грузимся не нервничай",
      success: "Все, а теперь отстань",
      failure: "Все сломалось ОШИИИБКА",
    };
  }

  clearInputs() {
    this.inputs.forEach((item) => (item.value = ""));
  }

  checkMailInputs() {
    const mailInput = document.querySelectorAll('[type="email"]');

    mailInput.forEach((input) => {
      input.addEventListener("keypress", (e) => {
        if (e.key.match(/[^a-z 0-9 @ \.]/gi)) {
          e.preventDefault();
        }
      });
    });
  }

  initMask() {
    let setCursorPos = (pos, el) => {
      el.focus();

      if (el.setSelectionRange) {
        el.setSelectionRange(pos, pos);
      } else if (el.createTextRange) {
        let range = el.createTextRange();

        range.collapse(true);
        range.moveEnd("character", pos);
        range.moveStart("character", pos);
        range.select();
      }
    };

    function createMask(event) {
      let matrix = "+1 (___) ___-____";
      let i = 0;
      let def = matrix.replace(/\D/g, "");
      let val = this.value.replace(/\D/g, "");

      if (def.length >= val.length) {
        val = def;
      }

      this.value = matrix.replace(/./g, (a) => {
        return /[_\d]/.test(a) && i < val.length
          ? val.charAt(i++)
          : i >= val.length
          ? ""
          : a;
      });

      if (event.type == "blur") {
        if (this.value.length == 2) {
          this.value = "";
        }
      } else {
        setCursorPos(this.value.length, this);
      }
    }

    let inputs = document.querySelectorAll('[name="phone"]');

    inputs.forEach((input) => {
      input.addEventListener("input", createMask);
      input.addEventListener("focus", createMask);
      input.addEventListener("blur", createMask);
    });
  }

  async postData(url, data) {
    let res = await fetch(url, {
      method: "POST",
      body: data,
    });
    return await res.text();
  }

  init() {
    this.initMask();
    this.checkMailInputs();
    this.forms.forEach((item) => {
      item.addEventListener("submit", (e) => {
        e.preventDefault();

        let statusMessage = document.createElement("div");
        statusMessage.style.cssText = `
          margin-top: 15px;
          font-size: 18px;
          color: green;
        `;
        item.parentNode.appendChild(statusMessage);

        statusMessage.textContent = this.message.loading;

        const formData = new FormData(item);

        this.postData(
          "https://6321af2582f8687273b6cd37.mockapi.io/js-forms",
          formData
        )
          .then((res) => {
            console.log(res);
            statusMessage.textContent = this.message.success;
          })
          .catch(() => (statusMessage.textContent = this.message.failure))
          .finally(() => {
            this.clearInputs();
            setTimeout(() => {
              statusMessage.remove();
            }, 6000);
          });
      });
    });
  }
}
