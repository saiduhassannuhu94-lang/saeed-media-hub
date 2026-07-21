
window.addEventListener("load", () => {

const loader = document.getElementById("loader");

setTimeout(() => {

loader.style.opacity = "0";

loader.style.visibility = "hidden";

setTimeout(() => {

loader.style.display = "none";

}, 600);

}, 2500);

});
const observer = new IntersectionObserver((entries)=>{

entries.forEach((entry)=>{

if(entry.isIntersecting){

entry.target.classList.add("show");

}

});

});

const hiddenElements=document.querySelectorAll("section");

hiddenElements.forEach((el)=>{

el.classList.add("hidden");

observer.observe(el);

});
const menuToggle = document.getElementById("menu-toggle");
const navMenu = document.querySelector(".nav-links");

if(menuToggle && navMenu){
menuToggle.addEventListener("click", () => {
navMenu.classList.toggle("active");
});
}
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 120;
        const sectionHeight = section.clientHeight;

        if(pageYOffset >= sectionTop){
            current = section.getAttribute("id");
        }

    });

    navLinks.forEach(link=>{

        link.classList.remove("active");

        if(link.getAttribute("href")=="#"+current){
            link.classList.add("active");
        }

    });

});
const portfolioImages = document.querySelectorAll(".portfolio-card img");

const lightbox = document.getElementById("lightbox");

const lightboxImg = document.getElementById("lightboxImg");

const closeLightbox = document.getElementById("closeLightbox");

portfolioImages.forEach(img=>{

img.addEventListener("click",()=>{

lightbox.style.display="flex";

lightboxImg.src=img.src;

});

});

closeLightbox.onclick=()=>{

lightbox.style.display="none";

};

lightbox.onclick=(e)=>{

if(e.target===lightbox){

lightbox.style.display="none";

}

};
const themeToggle = document.getElementById("themeToggle");

if(themeToggle){

themeToggle.addEventListener("click", () => {

document.body.classList.toggle("light-mode");

if(document.body.classList.contains("light-mode")){

themeToggle.innerHTML="☀️";

localStorage.setItem("theme","light");

}else{

themeToggle.innerHTML="🌙";

localStorage.setItem("theme","dark");

}

});

if(localStorage.getItem("theme")==="light"){

document.body.classList.add("light-mode");

themeToggle.innerHTML="☀️";

}}
const counters = document.querySelectorAll(".counter");

counters.forEach(counter => {

const updateCounter = () => {

const target = +counter.getAttribute("data-target");

const count = +counter.innerText;

const increment = target / 100;

if(count < target){

counter.innerText = Math.ceil(count + increment);

setTimeout(updateCounter,20);

}else{

counter.innerText = target + "+";

}

};

updateCounter();

});

const testimonials=document.querySelectorAll(".testimonial");

let currentTestimonial=0;

function showTestimonials(){

testimonials.forEach(t=>t.classList.remove("active"));

testimonials[currentTestimonial].classList.add("active");

currentTestimonial++;

if(currentTestimonial>=testimonials.length){

currentTestimonial=0;

}

}

showTestimonials();

setInterval(showTestimonials,4000);
const text = "Empowering Creativity Through AI & Technology";

let index = 0;

function typeWriter(){

if(index < text.length){

document.getElementById("typing").innerHTML += text.charAt(index);

index++;

setTimeout(typeWriter,70);

}

}

window.addEventListener("load",typeWriter);
document.getElementById("contact-form").addEventListener("submit", function (e) {

e.preventDefault();

emailjs.sendForm(
"service_6djvlr5",
"template_amkqcfo",
this
)
.then(function () {

alert("✅ Message Sent Successfully!");

document.getElementById("contact-form").reset();

})
.catch(function (error) {

alert("Error: " + JSON.stringify(error));

console.log(error);

});
