  document.addEventListener("DOMContentLoaded", function () {
      const caseForm = document.getElementById("case-form");

      if (caseForm) {
        caseForm.addEventListener("submit", async function (e) {
          e.preventDefault();

          const formData = new FormData(form);
          const file = formData.get("attachment");

          let attachment = null;
          if (file && file.size > 0) {
            attachment = {
              filename: file.name,
              content: await toBase64(file), // convert to Base64
            };
          }

          const data = {
            name: formData.get("name"),
            title: formData.get("title"),
            speciality: formData.get("speciality"),
            description: formData.get("description"),
            consent: formData.get("consent"),
            dataRelevant: formData.get("dataRelevant"),
            attachment,
          };

          try {
            const res = await fetch("/api/sendEmail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            const result = await res.json();
            alert(result.message);
            form.reset();
          } catch (err) {
            console.error(err);
            alert("Error sending email");
          }
        });
      }

      // ---------- CONTACT FORM ----------
      const contactForm = document.getElementById("contact-form");

      if (contactForm) {
        contactForm.addEventListener("submit", async function (e) {
          e.preventDefault();

          const formData = new FormData(contactForm);

          const data = {
            fullName: formData.get("fullName"),
            email: formData.get("email"),
            phone: formData.get("phone"),
            subject: formData.get("subject"),
            message: formData.get("message"),
            consent: formData.get("consent"),
          };

          try {
            const res = await fetch("/api/sendEmail", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(data),
            });

            const result = await res.json();
            alert(result.message);
            contactForm.reset();
          } catch (err) {
            console.error(err);
            alert("Error sending email");
          }
        });
      }

      function toBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result.split(",")[1]); // strip prefix
          reader.onerror = reject;
        });
      }

      // Your existing nav-link code
      document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function () {
          document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
          this.classList.add('active');
        });
      });

      // Modal link device check
      const modalLink = document.getElementById("modalLink");
      const buttons = document.querySelectorAll(".know-more-btn");

      buttons.forEach(button => {
        button.addEventListener("click", function () {
          const link = this.getAttribute("data-link");
          modalLink.setAttribute("href", link);
        });
      });

      function checkDevice() {
        const isMobileOrTablet = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
        modalLink.style.display = isMobileOrTablet ? "inline-block" : "none";
      }

      checkDevice();
    });
