// Contact Form Submission

const contactForm = document.getElementById("contactForm");
const responseMessage = document.getElementById("responseMessage");

contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    if (!name || !email || !message) {
        responseMessage.textContent = "Please fill all fields.";
        responseMessage.style.color = "red";
        return;
    }

    try {
        const response = await fetch("/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name,
                email,
                message
            })
        });

        const data = await response.json();

        if (response.ok) {
            responseMessage.textContent = data.message;
            responseMessage.style.color = "green";

            contactForm.reset();
        } else {
            responseMessage.textContent =
                data.message || "Something went wrong.";
            responseMessage.style.color = "red";
        }

    } catch (error) {
        console.error(error);

        responseMessage.textContent =
            "Unable to connect to server.";
        responseMessage.style.color = "red";
    }
});