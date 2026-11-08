const registerForm = document.getElementById("registerForm");

if (registerForm) {

    registerForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        if (password !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }

        const user = {
            name: name,
            email: email,
            password: password,
            role: "USER"
        };

        try {

            const response = await fetch("http://localhost:8080/api/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(user)
            });

            if (response.ok) {
                alert("Account created successfully!");
                window.location.href = "login.html";
            } else {
                alert("Registration failed.");
            }

        } catch (error) {
            alert("Cannot connect to the server.");
            console.error(error);
        }
    });
}


const loginForm = document.getElementById("loginForm");

if (loginForm) {

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email = document.getElementById("loginEmail").value;
        const password = document.getElementById("loginPassword").value;

        try {

            const response = await fetch("http://localhost:8080/api/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            if (!response.ok) {
                alert("Login failed.");
                return;
            }

            const user = await response.json();

            if (user === null || !user.id) {
                alert("Invalid email or password.");
                return;
            }

            alert("Login successful!");

            window.location.href = "user-dashboard.html";

        } catch (error) {
            console.error(error);
            alert("Cannot connect to the server.");
        }
    });
}

const resourceList = document.getElementById("resourceList");
const resourceSelect = document.getElementById("resourceId");

if (resourceList && resourceSelect) {

    fetch("http://localhost:8080/api/resources")
        .then(response => response.json())
        .then(resources => {

            resourceList.innerHTML = "";
            resourceSelect.innerHTML =
                '<option value="">Select Resource</option>';

            resources.forEach(resource => {

                const card = document.createElement("div");

                card.className = "resource-card";

                card.innerHTML = `
                    <div class="resource-icon">
                        <i class="fa-solid fa-door-open"></i>
                    </div>

                    <div>
                        <h3>${resource.name}</h3>

                        <p>
                            <i class="fa-solid fa-location-dot"></i>
                            ${resource.location}
                        </p>

                        <p>
                            <i class="fa-solid fa-users"></i>
                            Capacity: ${resource.capacity}
                        </p>
                    </div>

                    <button class="select-btn"
                            onclick="selectResource(${resource.id})">
                        Select
                    </button>
                `;

                resourceList.appendChild(card);

                const option = document.createElement("option");

                option.value = resource.id;
                option.textContent = resource.name;

                resourceSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error(error);
            alert("Cannot load resources.");
        });
}

function selectResource(id) {
    document.getElementById("resourceId").value = id;
}

const bookingForm = document.getElementById("bookingForm");

if (bookingForm) {

    bookingForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const resourceId = document.getElementById("resourceId").value;
        const bookingDate = document.getElementById("bookingDate").value;
        const startTime = document.getElementById("startTime").value;
        const endTime = document.getElementById("endTime").value;

        if (startTime >= endTime) {
            alert("End time must be after start time.");
            return;
        }

        const booking = {
            userId: 1,
            resourceId: Number(resourceId),
            bookingDate: bookingDate,
            startTime: startTime,
            endTime: endTime
        };

        try {

            const response = await fetch(
                "http://localhost:8080/api/bookings",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(booking)
                }
            );

            if (response.ok) {

                const savedBooking = await response.json();

                alert(
                    "Booking confirmed! Booking ID: "
                    + savedBooking.id
                );

                bookingForm.reset();

            } else {

                const message = await response.text();

                alert("Booking failed: " + message);
            }

        } catch (error) {

            console.error(error);
            alert("Cannot connect to the server.");
        }
    });
}

const bookingsList = document.getElementById("bookingsList");
function getResourceName(resourceId) {

    const resources = {
        1: "Conference Room",
        2: "Computer Lab",
        3: "Training Hall"
    };

    return resources[resourceId] || "Unknown Resource";
}
if (bookingsList) {

    fetch("http://localhost:8080/api/bookings")
        .then(response => response.json())
        .then(bookings => {

            bookingsList.innerHTML = "";

            if (bookings.length === 0) {

                bookingsList.innerHTML = `
                    <div class="empty-bookings">
                        <i class="fa-regular fa-calendar-xmark"></i>
                        <h2>No Bookings Yet</h2>
                        <p>You haven't made any bookings.</p>
                    </div>
                `;

                return;
            }

            bookings.forEach(booking => {

                const card = document.createElement("div");

                card.className = "booking-card";

                card.innerHTML = `
                    <div class="booking-card-icon">
                        <i class="fa-solid fa-calendar-check"></i>
                    </div>

                    <div class="booking-card-info">

                        <h3>${getResourceName(booking.resourceId)}</h3>

                        <p>
                            <i class="fa-regular fa-calendar"></i>
                            ${booking.bookingDate}
                        </p>

                        <p>
                            <i class="fa-regular fa-clock"></i>
                            ${booking.startTime} - ${booking.endTime}
                        </p>

                    </div>

                    <span class="booking-status">
                        ${booking.status}
                    </span>

                    <button
    class="cancel-btn"
    onclick="cancelBooking(${booking.id})"
    ${booking.status === "CANCELLED" ? "disabled" : ""}>
    ${booking.status === "CANCELLED" ? "Cancelled" : "Cancel Booking"}
</button>
                `;

                bookingsList.appendChild(card);
            });
        })
        .catch(error => {

            console.error(error);

            bookingsList.innerHTML = `
                <div class="empty-bookings">
                    <h2>Unable to load bookings</h2>
                    <p>Make sure Spring Boot is running.</p>
                </div>
            `;
        });
}

async function cancelBooking(id) {

    if (!confirm("Are you sure you want to cancel this booking?")) {
        return;
    }

    try {

        const response = await fetch(
            `http://localhost:8080/api/bookings/${id}/cancel`,
            {
                method: "PUT"
            }
        );

        if (response.ok) {

            alert("Booking cancelled successfully!");

            location.reload();

        } else {

            const message = await response.text();

            alert("Cancellation failed: " + message);
        }

    } catch (error) {

        alert("Cannot connect to the server.");
    }
}

const totalBookingsElement = document.getElementById("totalBookings");

if (totalBookingsElement) {

    fetch("http://localhost:8080/api/bookings")
        .then(response => response.json())
        .then(bookings => {

            const confirmed = bookings.filter(
                booking => booking.status === "CONFIRMED"
            ).length;

            const cancelled = bookings.filter(
                booking => booking.status === "CANCELLED"
            ).length;

            document.getElementById("totalBookings").textContent =
                bookings.length;

            document.getElementById("confirmedBookings").textContent =
                confirmed;

            document.getElementById("cancelledBookings").textContent =
                cancelled;
        })
        .catch(error => {
            console.error("Unable to load dashboard data:", error);
        });


    fetch("http://localhost:8080/api/resources")
        .then(response => response.json())
        .then(resources => {

            document.getElementById("totalResources").textContent =
                resources.length;
        })
        .catch(error => {
            console.error("Unable to load resources:", error);
        });
}

const adminBookingsElement =
    document.getElementById("adminBookings");

if (adminBookingsElement) {

    fetch("http://localhost:8080/api/bookings")
        .then(response => response.json())
        .then(bookings => {

            document.getElementById("adminBookings").textContent =
                bookings.length;

            document.getElementById("adminConfirmed").textContent =
                bookings.filter(
                    booking => booking.status === "CONFIRMED"
                ).length;

        })
        .catch(error => {
            console.error("Unable to load bookings:", error);
        });


    fetch("http://localhost:8080/api/resources")
        .then(response => response.json())
        .then(resources => {

            document.getElementById("adminResources").textContent =
                resources.length;

        })
        .catch(error => {
            console.error("Unable to load resources:", error);
        });


    fetch("http://localhost:8080/api/users")
        .then(response => response.json())
        .then(users => {

            document.getElementById("adminUsers").textContent =
                users.length;

        })
        .catch(error => {
            console.error("Unable to load users:", error);
        });
}

const adminResourceList =
    document.getElementById("adminResourceList");

if (adminResourceList) {

    loadAdminResources();

    async function loadAdminResources() {

        try {

            const response =
                await fetch("http://localhost:8080/api/resources");

            const resources = await response.json();

            adminResourceList.innerHTML = "";

            resources.forEach(resource => {

                const card = document.createElement("div");

                card.className = "admin-resource-item";

                card.innerHTML = `
                    <div class="resource-admin-icon">
                        <i class="fa-solid fa-building"></i>
                    </div>

                    <div class="resource-admin-info">

                        <h3>${resource.name}</h3>

                        <p>
                            <i class="fa-solid fa-location-dot"></i>
                            ${resource.location}
                        </p>

                        <p>
                            <i class="fa-solid fa-users"></i>
                            Capacity: ${resource.capacity}
                        </p>

                        <p>
                            <i class="fa-solid fa-tag"></i>
                            ${resource.type}
                        </p>

                    </div>
                `;

                adminResourceList.appendChild(card);
            });

        } catch (error) {

            adminResourceList.innerHTML =
                "<p>Unable to load resources.</p>";

            console.error(error);
        }
    }


    const resourceForm =
        document.getElementById("resourceForm");

    resourceForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const resource = {

            name:
                document.getElementById("resourceName").value,

            location:
                document.getElementById("resourceLocation").value,

            capacity:
                Number(
                    document.getElementById("resourceCapacity").value
                ),

            type:
                document.getElementById("resourceType").value
        };


        try {

            const response = await fetch(
                "http://localhost:8080/api/resources",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(resource)
                }
            );


            if (response.ok) {

                alert("Resource added successfully!");

                resourceForm.reset();

                loadAdminResources();

            } else {

                const message =
                    await response.text();

                alert("Failed to add resource: " + message);
            }

        } catch (error) {

            alert("Cannot connect to the server.");
        }

    });

}

const adminBookingsList =
    document.getElementById("adminBookingsList");

if (adminBookingsList) {

    loadAdminBookings();

    async function loadAdminBookings() {

        try {

            const response =
                await fetch("http://localhost:8080/api/bookings");

            const bookings = await response.json();

            adminBookingsList.innerHTML = "";

            if (bookings.length === 0) {

                adminBookingsList.innerHTML = `
                    <div class="empty-bookings">
                        <h2>No bookings found</h2>
                    </div>
                `;

                return;
            }

            bookings.forEach(booking => {

                const resourceName =
                    getResourceName(booking.resourceId);

                const card =
                    document.createElement("div");

                card.className = "admin-booking-card";

                card.innerHTML = `

                    <div class="booking-card-icon">
                        <i class="fa-solid fa-calendar-check"></i>
                    </div>

                    <div class="admin-booking-info">

                        <h3>${resourceName}</h3>

                        <p>
                            <i class="fa-solid fa-user"></i>
                            User ID: ${booking.userId}
                        </p>

                        <p>
                            <i class="fa-regular fa-calendar"></i>
                            ${booking.bookingDate}
                        </p>

                        <p>
                            <i class="fa-regular fa-clock"></i>
                            ${booking.startTime}
                            -
                            ${booking.endTime}
                        </p>

                    </div>

                    <span class="booking-status">
                        ${booking.status}
                    </span>
                `;

                adminBookingsList.appendChild(card);
            });

        } catch (error) {

            adminBookingsList.innerHTML = `
                <div class="empty-bookings">
                    <h2>Unable to load bookings</h2>
                    <p>Make sure Spring Boot is running.</p>
                </div>
            `;

            console.error(error);
        }
    }
}

const usersList = document.getElementById("usersList");

if (usersList) {

    fetch("http://localhost:8080/api/users")
        .then(response => response.json())
        .then(users => {

            usersList.innerHTML = "";

            users.forEach(user => {

                const card = document.createElement("div");

                card.className = "user-card";

                card.innerHTML = `

                    <div class="user-icon">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="user-info">

                        <h3>${user.name}</h3>

                        <p>
                            <i class="fa-solid fa-envelope"></i>
                            ${user.email}
                        </p>

                        <p>
                            <i class="fa-solid fa-user-tag"></i>
                            ${user.role}
                        </p>

                    </div>

                `;

                usersList.appendChild(card);
            });

        })
        .catch(error => {

            usersList.innerHTML = `
                <div class="empty-bookings">
                    <h2>Unable to load users</h2>
                    <p>Make sure Spring Boot is running.</p>
                </div>
            `;

            console.error(error);
        });
}