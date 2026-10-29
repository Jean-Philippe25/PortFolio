// =========================================
// MENU MOBILE
// =========================================

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

if (menuToggle && navLinks) {

    menuToggle.addEventListener("click", () => {

        navLinks.classList.toggle("active");

        const icon = menuToggle.querySelector("i");

        if (icon) {

            if (navLinks.classList.contains("active")) {

                icon.classList.remove("fa-bars");
                icon.classList.add("fa-xmark");

            } else {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        }

    });

}


// =========================================
// FERMER LE MENU APRÈS UN CLIC
// =========================================

if (navLinks && menuToggle) {

    document.querySelectorAll(".nav-links a").forEach(link => {

        link.addEventListener("click", () => {

            navLinks.classList.remove("active");

            const icon = menuToggle.querySelector("i");

            if (icon) {

                icon.classList.remove("fa-xmark");
                icon.classList.add("fa-bars");

            }

        });

    });

}


// =========================================
// NAVBAR AU SCROLL
// =========================================

const header = document.querySelector(".header");

if (header) {

    window.addEventListener("scroll", () => {

        if (window.scrollY > 50) {

            header.style.boxShadow =
                "0 5px 20px rgba(0, 0, 0, 0.25)";

        } else {

            header.style.boxShadow = "none";

        }

    });

}


// =========================================
// ANIMATION DES SECTIONS AU SCROLL
// =========================================

const sections = document.querySelectorAll(".section");

if ("IntersectionObserver" in window) {

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },

        {
            threshold: 0.15
        }

    );

    sections.forEach(section => {

        observer.observe(section);

    });

} else {

    sections.forEach(section => {

        section.classList.add("show");

    });

}


// =========================================
// MODE SOMBRE / MODE CLAIR
// =========================================

const themeToggle = document.getElementById("theme-toggle");

if (themeToggle) {

    const themeIcon = themeToggle.querySelector("i");


    function applyTheme(theme) {

        if (theme === "light") {

            document.body.classList.add("light-theme");

            if (themeIcon) {

                themeIcon.classList.remove("fa-sun");
                themeIcon.classList.add("fa-moon");

            }

        } else {

            document.body.classList.remove("light-theme");

            if (themeIcon) {

                themeIcon.classList.remove("fa-moon");
                themeIcon.classList.add("fa-sun");

            }

        }

    }


    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "light") {

        applyTheme("light");

    } else {

        applyTheme("dark");

    }


    themeToggle.addEventListener("click", () => {

        const isLightTheme =
            document.body.classList.contains("light-theme");

        if (isLightTheme) {

            applyTheme("dark");
            localStorage.setItem("theme", "dark");

        } else {

            applyTheme("light");
            localStorage.setItem("theme", "light");

        }

    });

}


// =========================================
// FORMULAIRE DE CONTACT - FORMSPREE
// =========================================

const contactForm =
    document.getElementById("contact-form");

const formMessage =
    document.getElementById("form-message");


if (contactForm && formMessage) {

    contactForm.addEventListener(
        "submit",
        async (event) => {

            // Empêcher le rechargement de la page
            event.preventDefault();


            // Réinitialiser le message
            formMessage.className =
                "form-message";

            formMessage.textContent = "";


            // Récupérer les valeurs
            const name =
                document.getElementById("name").value.trim();

            const email =
                document.getElementById("email").value.trim();

            const subject =
                document.getElementById("subject").value.trim();

            const message =
                document.getElementById("message").value.trim();


            // =========================================
            // VÉRIFICATION DES CHAMPS
            // =========================================

            if (!name || !email || !subject || !message) {

                formMessage.className =
                    "form-message show error";

                formMessage.textContent =
                    "Veuillez remplir tous les champs obligatoires.";

                return;

            }


            // =========================================
            // VÉRIFICATION DE L'EMAIL
            // =========================================

            const emailPattern =
                /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


            if (!emailPattern.test(email)) {

                formMessage.className =
                    "form-message show error";

                formMessage.textContent =
                    "Veuillez entrer une adresse email valide.";

                return;

            }


            // =========================================
            // CONFIGURATION DU REPLY-TO
            // =========================================

            const replyTo =
                document.getElementById("_replyto");

            if (replyTo) {

                replyTo.value = email;

            }


            // =========================================
            // BOUTON D'ENVOI
            // =========================================

            const submitButton =
                contactForm.querySelector(
                    'button[type="submit"]'
                );

            const originalButtonHTML =
                submitButton
                    ? submitButton.innerHTML
                    : "";


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.innerHTML =
                    '<i class="fa-solid fa-spinner fa-spin"></i> Envoi en cours...';

            }


            // =========================================
            // ENVOI VERS FORMSPREE
            // =========================================

            try {

                const response = await fetch(
                    contactForm.action,
                    {
                        method: "POST",

                        body: new FormData(contactForm),

                        headers: {
                            "Accept": "application/json"
                        }
                    }
                );


                // =========================================
                // ENVOI RÉUSSI
                // =========================================

                if (response.ok) {

                    formMessage.className =
                        "form-message show success";

                    formMessage.innerHTML =
                        '<i class="fa-solid fa-circle-check"></i> ' +
                        'Merci ! Votre message a été envoyé avec succès.';


                    // Réinitialiser le formulaire
                    contactForm.reset();

                }


                // =========================================
                // ERREUR FORMSPREE
                // =========================================

                else {

                    let data = {};

                    try {

                        data = await response.json();

                    } catch (error) {

                        data = {};

                    }


                    formMessage.className =
                        "form-message show error";

                    formMessage.textContent =
                        data.error ||
                        "Une erreur est survenue lors de l'envoi. Veuillez réessayer.";

                }

            }


            // =========================================
            // ERREUR DE CONNEXION
            // =========================================

            catch (error) {

                console.error(
                    "Erreur Formspree :",
                    error
                );

                formMessage.className =
                    "form-message show error";

                formMessage.textContent =
                    "Impossible d'envoyer le message. Vérifiez votre connexion internet.";

            }


            // =========================================
            // RÉACTIVER LE BOUTON
            // =========================================

            finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.innerHTML =
                        originalButtonHTML;

                }

            }

        }
    );

}


// =========================================
// SCROLL FLUIDE
// =========================================

document
    .querySelectorAll('a[href^="#"]')
    .forEach(link => {

        link.addEventListener(
            "click",
            function (event) {

                const targetId =
                    this.getAttribute("href");


                if (!targetId || targetId === "#") {

                    return;

                }


                const target =
                    document.querySelector(targetId);


                if (target) {

                    event.preventDefault();

                    target.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

                }

            }
        );

    });


// =========================================
// ANNÉE AUTOMATIQUE DU FOOTER
// =========================================

const currentYear =
    document.getElementById("current-year");

if (currentYear) {

    currentYear.textContent =
        new Date().getFullYear();

}