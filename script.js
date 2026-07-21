/* =========================================
   SAEED MEDIA HUB — SCRIPT.JS V3.0
   PREMIUM + MOBILE RESPONSIVE
   ========================================= */


/* =========================================
   1. PREMIUM PAGE LOADER
   ========================================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (!loader) return;

    setTimeout(() => {

        loader.style.opacity = "0";
        loader.style.visibility = "hidden";
        loader.style.pointerEvents = "none";

        setTimeout(() => {

            loader.style.display = "none";

        }, 700);

    }, 1200);

});


/* =========================================
   2. DOM READY
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {


    /* =====================================
       3. MOBILE NAVIGATION
       ===================================== */

    const menuToggle =
        document.getElementById("menu-toggle");

    const navMenu =
        document.querySelector(".nav-links");


    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            navMenu.classList.toggle("active");

            menuToggle.classList.toggle("active");

        });


        const navItems =
            navMenu.querySelectorAll("a");


        navItems.forEach((link) => {

            link.addEventListener("click", () => {

                navMenu.classList.remove("active");

                menuToggle.classList.remove("active");

            });

        });

    }


    /* =====================================
       4. SCROLL REVEAL ANIMATION
       ===================================== */

    const animatedElements =
        document.querySelectorAll(
            "section:not(.hero), .card, .portfolio-card, .stat-box, .testimonial"
        );


    if ("IntersectionObserver" in window) {

        const revealObserver =
            new IntersectionObserver(
                (entries, observer) => {

                    entries.forEach((entry) => {

                        if (entry.isIntersecting) {

                            entry.target.classList.add("show");

                            observer.unobserve(
                                entry.target
                            );

                        }

                    });

                },
                {
                    threshold: 0.12
                }
            );


        animatedElements.forEach((element) => {

            element.classList.add("hidden");

            revealObserver.observe(element);

        });

    } else {

        animatedElements.forEach((element) => {

            element.classList.add("show");

        });

    }


    /* =====================================
       5. ACTIVE NAVIGATION
       ===================================== */

    const sections =
        document.querySelectorAll(
            "section[id]"
        );

    const navLinks =
        document.querySelectorAll(
            ".nav-links a"
        );


    function updateActiveNavigation() {

        let currentSection = "";


        sections.forEach((section) => {

            const sectionTop =
                section.offsetTop - 160;


            if (
                window.scrollY >= sectionTop
            ) {

                currentSection =
                    section.getAttribute("id");

            }

        });


        navLinks.forEach((link) => {

            link.classList.remove("active");


            const target =
                link.getAttribute("href");


            if (
                target ===
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


    /* =====================================
       6. SMOOTH SCROLL
       ===================================== */

    const smoothLinks =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    smoothLinks.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute("href");


                if (
                    !targetId ||
                    targetId === "#"
                ) {

                    return;

                }


                const targetElement =
                    document.querySelector(
                        targetId
                    );


                if (targetElement) {

                    event.preventDefault();


                    targetElement.scrollIntoView({

                        behavior: "smooth",

                        block: "start"

                    });

                }

            }
        );

    });


    /* =====================================
       7. DARK / LIGHT MODE
       ===================================== */

    const themeToggle =
        document.getElementById(
            "themeToggle"
        );


    if (themeToggle) {

        const savedTheme =
            localStorage.getItem(
                "theme"
            );


        if (savedTheme === "light") {

            document.body.classList.add(
                "light-mode"
            );

            themeToggle.innerHTML =
                "☀️";

        } else {

            themeToggle.innerHTML =
                "🌙";

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


                if (isLight) {

                    themeToggle.innerHTML =
                        "☀️";

                    localStorage.setItem(
                        "theme",
                        "light"
                    );

                } else {

                    themeToggle.innerHTML =
                        "🌙";

                    localStorage.setItem(
                        "theme",
                        "dark"
                    );

                }

            }
        );

    }


    /* =====================================
       8. ANIMATED COUNTERS
       ===================================== */

    const counters =
        document.querySelectorAll(
            ".counter"
        );


    function animateCounter(counter) {

        const target =
            Number(
                counter.getAttribute(
                    "data-target"
                )
            );


        if (
            isNaN(target)
        ) {

            return;

        }


        const duration = 1800;

        const startTime =
            performance.now();


        function updateCounter(
            currentTime
        ) {

            const elapsed =
                currentTime -
                startTime;


            const progress =
                Math.min(
                    elapsed / duration,
                    1
                );


            const currentValue =
                Math.floor(
                    progress * target
                );


            counter.textContent =
                currentValue;


            if (
                progress < 1
            ) {

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

    }


    if (
        counters.length &&
        "IntersectionObserver" in window
    ) {

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


    /* =====================================
       9. TYPING EFFECT
       ===================================== */

    const typingElement =
        document.getElementById(
            "typing"
        );


    if (typingElement) {

        const typingText =
            "Empowering Creativity Through AI & Technology";


        let typingIndex = 0;


        typingElement.textContent = "";


        function typeWriter() {

            if (
                typingIndex <
                typingText.length
            ) {

                typingElement.textContent +=
                    typingText.charAt(
                        typingIndex
                    );


                typingIndex++;


                setTimeout(
                    typeWriter,
                    70
                );

            }

        }


        setTimeout(
            typeWriter,
            1300
        );

    }


    /* =====================================
       10. PORTFOLIO FILTER
       ===================================== */

    const filterButtons =
        document.querySelectorAll(
            ".filter-btn"
        );


    const portfolioCards =
        document.querySelectorAll(
            ".portfolio-card"
        );


    if (
        filterButtons.length &&
        portfolioCards.length
    ) {

        filterButtons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        filterButtons.forEach(
                            (btn) => {

                                btn.classList.remove(
                                    "active"
                                );

                            }
                        );


                        button.classList.add(
                            "active"
                        );


                        const filter =
                            button.getAttribute(
                                "data-filter"
                            );


                        portfolioCards.forEach(
                            (card) => {

                                const category =
                                    card.getAttribute(
                                        "data-category"
                                    );


                                if (
                                    filter === "all" ||
                                    category === filter
                                ) {

                                    card.classList.remove(
                                        "hide"
                                    );

                                } else {

                                    card.classList.add(
                                        "hide"
                                    );

                                }

                            }
                        );

                    }
                );

            }
        );

    }


    /* =====================================
       11. PORTFOLIO LIGHTBOX
       ===================================== */

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

        portfolioImages.forEach(
            (image) => {

                image.style.cursor =
                    "pointer";


                image.addEventListener(
                    "click",
                    () => {

                        lightbox.style.display =
                            "flex";


                        lightboxImg.src =
                            image.src;


                        document.body.style.overflow =
                            "hidden";

                    }
                );

            }
        );


        function closeLightboxFunction() {

            lightbox.style.display =
                "none";


            document.body.style.overflow =
                "";

        }


        if (closeLightbox) {

            closeLightbox.addEventListener(
                "click",
                closeLightboxFunction
            );

        }


        lightbox.addEventListener(
            "click",
            (event) => {

                if (
                    event.target ===
                    lightbox
                ) {

                    closeLightboxFunction();

                }

            }
        );


        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeLightboxFunction();

                }

            }
        );

    }


    /* =====================================
       12. TESTIMONIAL SLIDER
       ===================================== */

    const testimonials =
        document.querySelectorAll(
            ".testimonial"
        );


    if (
        testimonials.length
    ) {

        let currentTestimonial = 0;


        function showTestimonial(
            index
        ) {

            testimonials.forEach(
                (testimonial) => {

                    testimonial.classList.remove(
                        "active"
                    );

                }
            );


            testimonials[
                index
            ].classList.add(
                "active"
            );

        }


        showTestimonial(
            currentTestimonial
        );


        if (
            testimonials.length > 1
        ) {

            setInterval(
                () => {

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

                },
                4000
            );

        }

    }


    /* =====================================
       13. EMAILJS CONTACT FORM
       ===================================== */

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


                if (!submitButton) {

                    return;

                }


                const originalText =
                    submitButton.innerHTML;


                submitButton.disabled =
                    true;


                submitButton.innerHTML =
                    "Sending...";


                try {

                    if (
                        typeof emailjs ===
                        "undefined"
                    ) {

                        throw new Error(
                            "EmailJS is not loaded."
                        );

                    }


                    await emailjs.sendForm(

                        "service_6djvlr5",

                        "template_amkqcfo",

                        contactForm

                    );


                    alert(
                        "✅ Message sent successfully!"
                    );


                    contactForm.reset();


                } catch (error) {

                    console.error(
                        "EmailJS Error:",
                        error
                    );


                    alert(
                        "❌ Failed to send message. Please try again."
                    );

                } finally {

                    submitButton.disabled =
                        false;


                    submitButton.innerHTML =
                        originalText;

                }

            }
        );

    }


    /* =====================================
       14. BACK TO TOP
       ===================================== */

    const topButton =
        document.getElementById(
            "topBtn"
        );


    if (topButton) {

        function updateTopButton() {

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


        window.addEventListener(
            "scroll",
            updateTopButton
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


        updateTopButton();

    }


    /* =====================================
       15. CLOSE MOBILE MENU ON RESIZE
       ===================================== */

    window.addEventListener(
        "resize",
        () => {

            if (
                window.innerWidth >= 900 &&
                navMenu &&
                menuToggle
            ) {

                navMenu.classList.remove(
                    "active"
                );

                menuToggle.classList.remove(
                    "active"
                );

            }

        }
    );


    /* =====================================
       16. PAGE READY
       ===================================== */

    document.body.classList.add(
        "js-ready"
    );


    console.log(
        "🚀 Saeed Media Hub V3.0 loaded successfully!"
    );

});
