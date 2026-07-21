/* =========================================
   SAEED MEDIA HUB — SCRIPT.JS V3.0
   PREMIUM CONTACT + UI SYSTEM
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. PREMIUM PAGE LOADER
       ========================================= */

    const loader = document.getElementById("loader");

    if (loader) {

        window.addEventListener("load", () => {

            setTimeout(() => {

                loader.style.opacity = "0";
                loader.style.visibility = "hidden";
                loader.style.pointerEvents = "none";

                setTimeout(() => {
                    loader.style.display = "none";
                }, 700);

            }, 1200);

        });

    }


    /* =========================================
       2. SCROLL REVEAL ANIMATION
       ========================================= */

    const animatedSections = document.querySelectorAll(
        "section:not(.hero)"
    );

    if ("IntersectionObserver" in window) {

        const sectionObserver = new IntersectionObserver(
            (entries, observer) => {

                entries.forEach((entry) => {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("show");

                        observer.unobserve(entry.target);

                    }

                });

            },
            {
                threshold: 0.15
            }
        );

        animatedSections.forEach((section) => {

            section.classList.add("hidden");

            sectionObserver.observe(section);

        });

    } else {

        animatedSections.forEach((section) => {

            section.classList.add("show");

        });

    }


    /* =========================================
       3. MOBILE NAVIGATION
       ========================================= */

    const menuToggle =
        document.getElementById("menu-toggle");

    const navMenu =
        document.querySelector(".nav-links");


    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            navMenu.classList.toggle("active");

            menuToggle.classList.toggle("active");

        });


        navMenu.querySelectorAll("a").forEach((link) => {

            link.addEventListener("click", () => {

                navMenu.classList.remove("active");

                menuToggle.classList.remove("active");

            });

        });

    }


    /* =========================================
       4. ACTIVE NAVIGATION ON SCROLL
       ========================================= */

    const sections =
        document.querySelectorAll("section[id]");

    const navLinks =
        document.querySelectorAll(".nav-links a");


    function updateActiveNavigation() {

        let currentSection = "";

        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop - 150;

            if (window.scrollY >= sectionTop) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach((link) => {

            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                "#" + currentSection
            ) {

                link.classList.add("active");

            }

        });

    }


    window.addEventListener(
        "scroll",
        updateActiveNavigation
    );


    updateActiveNavigation();


    /* =========================================
       5. DARK / LIGHT MODE
       ========================================= */

    const themeToggle =
        document.getElementById("themeToggle");


    if (themeToggle) {

        const savedTheme =
            localStorage.getItem("theme");


        if (savedTheme === "light") {

            document.body.classList.add(
                "light-mode"
            );

            themeToggle.innerHTML = "☀️";

        } else {

            themeToggle.innerHTML = "🌙";

        }


        themeToggle.addEventListener(
            "click",
            () => {

                document.body.classList.toggle(
                    "light-mode"
                );


                const isLight =
                    document.body.classList.contains(
                        "light-mode"
                    );


                themeToggle.innerHTML =
                    isLight ? "☀️" : "🌙";


                localStorage.setItem(
                    "theme",
                    isLight
                        ? "light"
                        : "dark"
                );

            }
        );

    }


    /* =========================================
       6. ANIMATED COUNTERS
       ========================================= */

    const counters =
        document.querySelectorAll(".counter");


    if (counters.length) {

        const animateCounter = (counter) => {

            const target =
                Number(
                    counter.getAttribute(
                        "data-target"
                    )
                );


            if (isNaN(target)) return;


            let current = 0;

            const duration = 1800;

            const startTime =
                performance.now();


            function updateCounter(currentTime) {

                const elapsed =
                    currentTime - startTime;


                const progress =
                    Math.min(
                        elapsed / duration,
                        1
                    );


                const value =
                    Math.floor(
                        progress * target
                    );


                counter.textContent =
                    value;


                if (progress < 1) {

                    requestAnimationFrame(
                        updateCounter
                    );

                } else {

                    counter.textContent =
                        target + "+";

                }

            }


            requestAnimationFrame(
                updateCounter
            );

        };


        if ("IntersectionObserver" in window) {

            const counterObserver =
                new IntersectionObserver(
                    (entries, observer) => {

                        entries.forEach((entry) => {

                            if (
                                entry.isIntersecting
                            ) {

                                animateCounter(
                                    entry.target
                                );

                                observer.unobserve(
                                    entry.target
                                );

                            }

                        });

                    },
                    {
                        threshold: 0.5
                    }
                );


            counters.forEach((counter) => {

                counterObserver.observe(
                    counter
                );

            });

        } else {

            counters.forEach(
                animateCounter
            );

        }

    }


    /* =========================================
       7. TYPING EFFECT
       ========================================= */

    const typingElement =
        document.getElementById("typing");


    if (typingElement) {

        const text =
            "Empowering Creativity Through AI & Technology";


        let index = 0;


        function typeWriter() {

            if (
                index <
                text.length
            ) {

                typingElement.textContent +=
                    text.charAt(index);

                index++;

                setTimeout(
                    typeWriter,
                    70
                );

            }

        }


        setTimeout(
            typeWriter,
            1500
        );

    }


    /* =========================================
       8. PORTFOLIO LIGHTBOX
       ========================================= */

    const portfolioImages =
        document.querySelectorAll(
            ".portfolio-card img"
        );


    const lightbox =
        document.getElementById(
            "lightbox"
        );


    const lightboxImg =
        document.getElementById(
            "lightboxImg"
        );


    const closeLightbox =
        document.getElementById(
            "closeLightbox"
        );


    if (
        portfolioImages.length &&
        lightbox &&
        lightboxImg
    ) {

        portfolioImages.forEach((image) => {

            image.style.cursor =
                "pointer";


            image.addEventListener(
                "click",
                () => {

                    lightbox.style.display =
                        "flex";

                    lightboxImg.src =
                        image.src;

                }
            );

        });


        if (closeLightbox) {

            closeLightbox.addEventListener(
                "click",
                () => {

                    lightbox.style.display =
                        "none";

                }
            );

        }


        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    lightbox
                ) {

                    lightbox.style.display =
                        "none";

                }

            }
        );

    }


    /* =========================================
       9. TESTIMONIAL SLIDER
       ========================================= */

    const testimonials =
        document.querySelectorAll(
            ".testimonial"
        );


    if (testimonials.length) {

        let currentTestimonial = 0;


        function showTestimonial(index) {

            testimonials.forEach(
                (testimonial) => {

                    testimonial.classList.remove(
                        "active"
                    );

                }
            );


            testimonials[index].classList.add(
                "active"
            );

        }


        showTestimonial(
            currentTestimonial
        );


        setInterval(() => {

            currentTestimonial++;


            if (
                currentTestimonial >=
                testimonials.length
            ) {

                currentTestimonial = 0;

            }


            showTestimonial(
                currentTestimonial
            );

        }, 4000);

    }


    /* =========================================
       10. PREMIUM NOTIFICATION SYSTEM
       ========================================= */

    function showNotification(
        message,
        type = "success"
    ) {

        const notification =
            document.createElement(
                "div"
            );


        notification.className =
            `smh-notification ${type}`;


        const icon =
            type === "success"
                ? "✅"
                : "❌";


        notification.innerHTML = `
            <span class="notification-icon">
                ${icon}
            </span>

            <span class="notification-message">
                ${message}
            </span>

            <button class="notification-close">
                ×
            </button>
        `;


        document.body.appendChild(
            notification
        );


        requestAnimationFrame(() => {

            notification.classList.add(
                "show"
            );

        });


        const closeButton =
            notification.querySelector(
                ".notification-close"
            );


        const removeNotification = () => {

            notification.classList.remove(
                "show"
            );


            setTimeout(() => {

                notification.remove();

            }, 400);

        };


        closeButton.addEventListener(
            "click",
            removeNotification
        );


        setTimeout(
            removeNotification,
            5000
        );

    }


    /* =========================================
       11. EMAILJS CONTACT FORM V3
       ========================================= */

    const contactForm =
        document.getElementById(
            "contact-form"
        );


    if (contactForm) {

        contactForm.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const submitButton =
                    contactForm.querySelector(
                        "button[type='submit']"
                    );


                if (!submitButton) return;


                const nameInput =
                    contactForm.querySelector(
                        '[name="user_name"]'
                    );


                const emailInput =
                    contactForm.querySelector(
                        '[name="user_email"]'
                    );


                const subjectInput =
                    contactForm.querySelector(
                        '[name="subject"]'
                    );


                const messageInput =
                    contactForm.querySelector(
                        '[name="message"]'
                    );


                if (
                    !nameInput ||
                    !emailInput ||
                    !subjectInput ||
                    !messageInput
                ) {

                    showNotification(
                        "Please complete the contact form correctly.",
                        "error"
                    );

                    return;

                }


                const name =
                    nameInput.value.trim();


                const email =
                    emailInput.value.trim();


                const subject =
                    subjectInput.value.trim();


                const message =
                    messageInput.value.trim();


                if (
                    name.length < 2
                ) {

                    showNotification(
                        "Please enter your full name.",
                        "error"
                    );

                    nameInput.focus();

                    return;

                }


                if (
                    !emailInput.checkValidity()
                ) {

                    showNotification(
                        "Please enter a valid email address.",
                        "error"
                    );

                    emailInput.focus();

                    return;

                }


                if (
                    subject.length < 2
                ) {

                    showNotification(
                        "Please enter a subject.",
                        "error"
                    );

                    subjectInput.focus();

                    return;

                }


                if (
                    message.length < 10
                ) {

                    showNotification(
                        "Your message must be at least 10 characters.",
                        "error"
                    );

                    messageInput.focus();

                    return;

                }


                const originalText =
                    submitButton.innerHTML;


                submitButton.disabled =
                    true;


                submitButton.innerHTML =
                    "⏳ Sending...";


                submitButton.style.opacity =
                    "0.7";


                try {

                    await emailjs.sendForm(

                        "service_6djvlr5",

                        "template_amkqcfo",

                        contactForm

                    );


                    showNotification(
                        "Your message has been sent successfully!",
                        "success"
                    );


                    contactForm.reset();


                } catch (error) {

                    console.error(
                        "EmailJS Error:",
                        error
                    );


                    showNotification(
                        "Failed to send your message. Please try again.",
                        "error"
                    );

                } finally {

                    submitButton.disabled =
                        false;


                    submitButton.innerHTML =
                        originalText;


                    submitButton.style.opacity =
                        "1";

                }

            }
        );

    }


    /* =========================================
       12. BACK TO TOP BUTTON
       ========================================= */

    const topButton =
        document.getElementById(
            "topBtn"
        );


    if (topButton) {

        window.addEventListener(
            "scroll",
            () => {

                if (
                    window.scrollY >
                    400
                ) {

                    topButton.classList.add(
                        "show"
                    );

                } else {

                    topButton.classList.remove(
                        "show"
                    );

                }

            }
        );


        topButton.addEventListener(
            "click",
            () => {

                window.scrollTo({

                    top: 0,

                    behavior: "smooth"

                });

            }
        );

    }


    /* =========================================
       13. SMOOTH SCROLL
       ========================================= */

    const smoothLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    smoothLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    !targetId ||
                    targetId === "#"
                ) return;


                const target =
                    document.querySelector(
                        targetId
                    );


                if (target) {

                    event.preventDefault();


                    target.scrollIntoView({

                        behavior:
                            "smooth",

                        block:
                            "start"

                    });

                }

            }
        );

    });

});


/* =========================================
   SAEED MEDIA HUB — V3.0 COMPLETE
   ========================================= */
