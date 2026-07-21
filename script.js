/* =========================================
   SAEED MEDIA HUB — SCRIPT.JS V2.0
   ========================================= */


/* =========================================
   1. PREMIUM PAGE LOADER
   ========================================= */

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    if (loader) {

        setTimeout(() => {

            loader.style.opacity = "0";
            loader.style.visibility = "hidden";
            loader.style.pointerEvents = "none";

            setTimeout(() => {
                loader.style.display = "none";
            }, 700);

        }, 1500);

    }

});


/* =========================================
   2. SCROLL REVEAL ANIMATION
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const animatedSections = document.querySelectorAll(
        "section:not(.hero)"
    );

    if ("IntersectionObserver" in window) {

        const observer = new IntersectionObserver(
            (entries) => {

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

            observer.observe(section);

        });

    } else {

        animatedSections.forEach((section) => {

            section.classList.add("show");

        });

    }

});


/* =========================================
   3. MOBILE NAVIGATION
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const menuToggle = document.getElementById("menu-toggle");
    const navMenu = document.querySelector(".nav-links");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", () => {

            navMenu.classList.toggle("active");

            menuToggle.classList.toggle("active");

        });


        const navItems = navMenu.querySelectorAll("a");

        navItems.forEach((link) => {

            link.addEventListener("click", () => {

                navMenu.classList.remove("active");

                menuToggle.classList.remove("active");

            });

        });

    }

});


/* =========================================
   4. ACTIVE NAVIGATION ON SCROLL
   ========================================= */

window.addEventListener("scroll", () => {

    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll(".nav-links a");

    let currentSection = "";

    sections.forEach((section) => {

        const sectionTop =
            section.offsetTop - 150;

        if (window.scrollY >= sectionTop) {

            currentSection = section.getAttribute("id");

        }

    });

    navLinks.forEach((link) => {

        link.classList.remove("active");

        const linkTarget =
            link.getAttribute("href");

        if (
            linkTarget === "#" + currentSection
        ) {

            link.classList.add("active");

        }

    });

});


/* =========================================
   5. DARK / LIGHT MODE
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const themeToggle =
        document.getElementById("themeToggle");

    if (!themeToggle) return;


    const savedTheme =
        localStorage.getItem("theme");


    if (savedTheme === "light") {

        document.body.classList.add("light-mode");

        themeToggle.innerHTML = "☀️";

    } else {

        themeToggle.innerHTML = "🌙";

    }


    themeToggle.addEventListener("click", () => {

        document.body.classList.toggle("light-mode");


        if (
            document.body.classList.contains("light-mode")
        ) {

            themeToggle.innerHTML = "☀️";

            localStorage.setItem(
                "theme",
                "light"
            );

        } else {

            themeToggle.innerHTML = "🌙";

            localStorage.setItem(
                "theme",
                "dark"
            );

        }

    });

});


/* =========================================
   6. ANIMATED COUNTERS
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const counters =
        document.querySelectorAll(".counter");


    if (!counters.length) return;


    const animateCounter = (counter) => {

        const target =
            Number(
                counter.getAttribute("data-target")
            );


        if (isNaN(target)) return;


        let current = 0;

        const duration = 1800;

        const startTime =
            performance.now();


        const updateCounter = (currentTime) => {

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

        };


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

});


/* =========================================
   7. TYPING EFFECT
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const typingElement =
        document.getElementById("typing");


    if (!typingElement) return;


    const text =
        "Empowering Creativity Through AI & Technology";


    let index = 0;


    function typeWriter() {

        if (index < text.length) {

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
        1800
    );

});


/* =========================================
   8. PORTFOLIO LIGHTBOX
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

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
        !portfolioImages.length ||
        !lightbox ||
        !lightboxImg
    ) return;


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
                event.target === lightbox
            ) {

                lightbox.style.display =
                    "none";

            }

        }
    );

});


/* =========================================
   9. TESTIMONIAL SLIDER
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const testimonials =
        document.querySelectorAll(
            ".testimonial"
        );


    if (!testimonials.length) return;


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

});


/* =========================================
   10. EMAILJS CONTACT FORM
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const contactForm =
        document.getElementById(
            "contact-form"
        );


    if (!contactForm) return;


    contactForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const submitButton =
                contactForm.querySelector(
                    "button[type='submit']"
                );


            if (!submitButton) return;


            const originalText =
                submitButton.innerHTML;


            submitButton.disabled = true;

            submitButton.innerHTML =
                "Sending...";


            try {

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

});


/* =========================================
   11. BACK TO TOP BUTTON
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const topButton =
        document.getElementById(
            "topBtn"
        );


    if (!topButton) return;


    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 400
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

});


/* =========================================
   12. SMOOTH SCROLL
   ========================================= */

document.addEventListener("DOMContentLoaded", () => {

    const links =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    links.forEach((link) => {

        link.addEventListener(
            "click",
            (event) => {

                const targetId =
                    link.getAttribute(
                        "href"
                    );


                if (
                    targetId === "#" ||
                    !targetId
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
   SAEED MEDIA HUB V2.0 COMPLETE
   ========================================= */
