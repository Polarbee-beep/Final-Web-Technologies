
(() => {
"use strict";

const STORAGE_KEY = "blockcrafters_final_builds_v1";
const THEME_KEY = "blockcrafters_theme_v1";

function getDefaultImage(name) {
    const images = {
        "The Colosseum": "css/images/coloseum.png",
        "Wilderness Camp": "css/images/camp.png",
        "The End": "css/images/end.png",
        "Cherry Village": "css/images/village.png"
    };
    return images[name] || "";
}

class Build {
    constructor(id, name, category, difficulty, description, createdAt = Date.now(), image = "") {
        this.id = Number(id);
        this.name = String(name);
        this.category = String(category);
        this.difficulty = String(difficulty);
        this.description = String(description);
        this.createdAt = Number(createdAt);
        this.image = image || getDefaultImage(name);
    }

    getSummary() {
        return `${this.name} is a ${this.difficulty.toLowerCase()} ${this.category.toLowerCase()} project.`;
    }

    update(data) {
        Object.assign(this, data);
    }
}

const starterBuilds = [
    new Build(1, "The Colosseum", "Landmark", "Advanced",
        "A monumental arena with repeating arches and a detailed central floor.",
        Date.now() - 400000),

    new Build(2, "Wilderness Camp", "Survival", "Beginner",
        "A compact camp with a timber shelter, storage, paths, and a firepit.",
        Date.now() - 300000),

    new Build(3, "The End", "Fantasy", "Advanced",
        "A mysterious floating island concept with dramatic terrain and atmosphere.",
        Date.now() - 200000),

    new Build(4, "Cherry Village", "Fantasy", "Intermediate",
        "A peaceful village with custom trees, winding paths, and cozy homes.",
        Date.now() - 100000)
];

const services = [
    {
        name: "Standard Spawn",
        price: 49,
        description: "A compact and welcoming spawn area for a small community.",
        icon: "⌂"
    },
    {
        name: "Advanced Hub",
        price: 129,
        description: "A larger hub with themed zones, paths, and points of interest.",
        icon: "⚒"
    },
    {
        name: "Mega World Map",
        price: 299,
        description: "A large-scale environment with connected districts and landmarks.",
        icon: "✦"
    }
];

let builds = loadBuilds();

function loadBuilds() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);

        if (!raw) {
            return starterBuilds.map(b =>
                new Build(b.id, b.name, b.category, b.difficulty,
                    b.description, b.createdAt, b.image)
            );
        }

        const parsed = JSON.parse(raw);

        if (!Array.isArray(parsed)) {
            throw new Error("Stored data is not an array");
        }

        return parsed
            .filter(x => x && x.name && x.category)
            .map(x => new Build(
                x.id,
                x.name,
                x.category,
                x.difficulty || "Intermediate",
                x.description || "",
                x.createdAt || Date.now(),
                x.image || getDefaultImage(x.name)
            ));

    } catch (error) {
        console.warn("Saved build data could not be loaded:", error);

        return starterBuilds.map(b =>
            new Build(b.id, b.name, b.category, b.difficulty,
                b.description, b.createdAt, b.image)
        );
    }
}

function saveBuilds() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(builds));
        return true;
    } catch (error) {
        console.error("Could not save builds:", error);
        return false;
    }
}

function escapeText(value) {
    return String(value).replace(/[&<>"']/g, char => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    }[char]));
}

function nextId() {
    return builds.length
        ? Math.max(...builds.map(b => b.id)) + 1
        : 1;
}

function renderDashboard() {
    const target = document.getElementById("dashboardStats");
    if (!target) return;

    const categories = ["Fantasy", "Survival", "Landmark", "Hub"];
    target.innerHTML = "";

    const stats = [
        { label: "Saved builds", value: builds.length },
        { label: "Categories", value: new Set(builds.map(b => b.category)).size },
        { label: "Advanced builds", value: builds.filter(b => b.difficulty === "Advanced").length }
    ];

    stats.forEach(stat => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        col.innerHTML = `
            <div class="stat-card">
                <div class="stat-number">${stat.value}</div>
                <div class="stat-label">${stat.label}</div>
            </div>
        `;

        target.appendChild(col);
    });

    const chart = document.createElement("div");
    chart.className = "col-12";

    chart.innerHTML = `
        <div class="panel p-4">
            <h3 class="h5">Build categories</h3>
            <div id="categoryChart"></div>
        </div>
    `;

    target.appendChild(chart);

    const chartTarget = chart.querySelector("#categoryChart");

    categories.forEach(category => {
        const count = builds.filter(b => b.category === category).length;
        const width = builds.length
            ? Math.round(count / builds.length * 100)
            : 0;

        const row = document.createElement("div");
        row.className = "bar-row";

        row.innerHTML = `
            <span>${category}</span>
            <div class="bar-track">
                <div class="bar-fill" style="width:${width}%"></div>
            </div>
            <strong>${count}</strong>
        `;

        chartTarget.appendChild(row);
    });
}

function renderServices() {
    const target = document.getElementById("serviceCards");
    if (!target) return;

    target.innerHTML = "";

    services.forEach(service => {
        const col = document.createElement("div");
        col.className = "col-md-4";

        col.innerHTML = `
            <article class="service-card">
                <div class="feature-icon">${service.icon}</div>
                <h3>${service.name}</h3>
                <p>${service.description}</p>
                <div class="estimate mt-3">
                    From <strong>$${service.price}</strong>
                </div>
            </article>
        `;

        target.appendChild(col);
    });
}

function renderBuilds() {
    const grid = document.getElementById("buildGrid");
    if (!grid) return;

    const query = (document.getElementById("searchBuilds")?.value || "")
        .trim()
        .toLowerCase();

    const category = document.getElementById("filterCategory")?.value || "all";
    const sort = document.getElementById("sortBuilds")?.value || "name";

    let visible = builds.filter(b =>
        (category === "all" || b.category === category) &&
        `${b.name} ${b.description} ${b.category}`.toLowerCase().includes(query)
    );

    if (sort === "name") {
        visible.sort((a, b) => a.name.localeCompare(b.name));
    }

    if (sort === "newest") {
        visible.sort((a, b) => b.createdAt - a.createdAt);
    }

    if (sort === "oldest") {
        visible.sort((a, b) => a.createdAt - b.createdAt);
    }

    grid.innerHTML = "";

    if (!visible.length) {
        grid.innerHTML = `
            <div class="col-12">
                <div class="notice">
                    No builds match your search. Try another filter or add a build below.
                </div>
            </div>
        `;
        return;
    }

    visible.forEach(build => {
        const col = document.createElement("div");
        col.className = "col-md-6 col-lg-4";

        const imageHTML = build.image
            ? `<img class="build-image"
                    src="${escapeText(build.image)}"
                    alt="${escapeText(build.name)} Minecraft build"
                    onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'build-image-placeholder\\'>Image unavailable</div>';">`
            : `<div class="build-image-placeholder">▦</div>`;

        col.innerHTML = `
            <article class="build-card">
                <div class="build-visual">
                    ${imageHTML}
                </div>

                <div class="build-body">
                    <span class="tag">
                        ${escapeText(build.category)} · ${escapeText(build.difficulty)}
                    </span>

                    <h3 class="h5 mt-3">${escapeText(build.name)}</h3>

                    <p>${escapeText(build.description)}</p>

                    <small class="muted mb-3">
                        ${escapeText(build.getSummary())}
                    </small>

                    <div class="build-actions">
                        <button class="btn btn-outline-light btn-small edit-build"
                                data-id="${build.id}">
                            Edit
                        </button>

                        <button class="btn btn-outline-danger btn-small delete-build"
                                data-id="${build.id}">
                            Delete
                        </button>
                    </div>
                </div>
            </article>
        `;

        grid.appendChild(col);
    });
}

function clearBuildForm() {
    const form = document.getElementById("buildForm");
    if (!form) return;

    form.reset();

    document.getElementById("buildId").value = "";
    document.getElementById("formTitle").textContent = "Add a build";
    document.getElementById("buildFormMessage").textContent = "";
}

function handleBuildSubmit(event) {
    event.preventDefault();

    const id = document.getElementById("buildId").value;
    const name = document.getElementById("buildName").value.trim();
    const category = document.getElementById("buildCategory").value;
    const difficulty = document.getElementById("buildDifficulty").value;
    const description = document.getElementById("buildDescription").value.trim();
    const message = document.getElementById("buildFormMessage");

    if (name.length < 3 || description.length < 10) {
        message.textContent =
            "Enter a name (at least 3 characters) and description (at least 10 characters).";
        return;
    }

    if (id) {
        const existing = builds.find(b => b.id === Number(id));

        if (existing) {
            existing.update({
                name,
                category,
                difficulty,
                description,
                image: getDefaultImage(name)
            });
        }
    } else {
        builds.push(new Build(
            nextId(), name, category, difficulty, description
        ));
    }

    saveBuilds();
    renderBuilds();
    renderDashboard();
    clearBuildForm();

    message.textContent = "Build saved successfully.";
}

function handleBuildGridClick(event) {
    const edit = event.target.closest(".edit-build");
    const del = event.target.closest(".delete-build");

    if (edit) {
        const build = builds.find(b => b.id === Number(edit.dataset.id));
        if (!build) return;

        document.getElementById("buildId").value = build.id;
        document.getElementById("buildName").value = build.name;
        document.getElementById("buildCategory").value = build.category;
        document.getElementById("buildDifficulty").value = build.difficulty;
        document.getElementById("buildDescription").value = build.description;

        document.getElementById("formTitle").textContent = "Edit build";
        document.getElementById("buildForm").scrollIntoView({
            behavior: "smooth"
        });
    }

    if (del) {
        const id = Number(del.dataset.id);
        const build = builds.find(b => b.id === id);

        if (build && confirm(`Delete "${build.name}"?`)) {
            builds = builds.filter(b => b.id !== id);

            saveBuilds();
            renderBuilds();
            renderDashboard();
        }
    }
}

function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);

    if (saved === "light") {
        document.documentElement.dataset.theme = "light";
    }

    document.getElementById("themeToggle")?.addEventListener("click", () => {
        const light = document.documentElement.dataset.theme !== "light";

        document.documentElement.dataset.theme = light ? "light" : "dark";
        localStorage.setItem(THEME_KEY, light ? "light" : "dark");
    });
}

async function checkServer(event) {
    event.preventDefault();

    const input = document.getElementById("serverAddress");
    const result = document.getElementById("serverResult");
    const address = input.value.trim();

    if (!/^[a-zA-Z0-9.-]+(?::\d{1,5})?$/.test(address)) {
        result.textContent =
            "Enter a valid hostname, optionally followed by a port.";
        return;
    }

    result.textContent = "Checking server…";

    try {
        const response = await fetch(
            `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(address)}`
        );

        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }

        const data = await response.json();

        if (!data.online) {
            result.textContent =
                `${address} is currently offline or could not be reached.`;
            return;
        }

        const players = data.players?.online ?? 0;
        const max = data.players?.max ?? "?";
        const version = data.version?.name_clean ||
            data.version?.name || "Unknown";

        result.textContent =
            `Online · ${players}/${max} players · Version ${version}`;

    } catch (error) {
        console.error("Server status request failed:", error);
        result.textContent =
            "Could not retrieve server status. Check the address and internet connection, then try again.";
    }
}

function initContactForm() {
    const form = document.getElementById("contactForm");
    if (!form) return;

    form.addEventListener("submit", event => {
        event.preventDefault();

        const name = document.getElementById("contactName").value.trim();
        const email = document.getElementById("contactEmail").value.trim();
        const type = document.getElementById("contactType").value;
        const message = document.getElementById("contactMessage").value.trim();

        const errors = {
            name: name.length >= 2
                ? ""
                : "Please enter a name with at least 2 characters.",

            email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
                ? ""
                : "Enter a valid email address.",

            type: type ? "" : "Please choose a project type.",

            message: message.length >= 20
                ? ""
                : "Please describe your project in at least 20 characters."
        };

        document.getElementById("nameError").textContent = errors.name;
        document.getElementById("emailError").textContent = errors.email;
        document.getElementById("typeError").textContent = errors.type;
        document.getElementById("messageError").textContent = errors.message;

        const success = document.getElementById("contactSuccess");

        if (Object.values(errors).some(Boolean)) {
            success.textContent = "Please correct the highlighted fields.";
            return;
        }

        success.textContent =
            `Thanks, ${name}! Your request passed validation. This demo does not send or store the form.`;

        form.reset();
    });
}

function initEstimate() {
    const pkg = document.getElementById("packageSelect");
    const size = document.getElementById("sizeSelect");
    const output = document.getElementById("estimateValue");

    if (!pkg || !size || !output) return;

    const update = () => {
        const total = Number(pkg.value) * Number(size.value);
        output.textContent = `$${total.toFixed(2)}`;
    };

    pkg.addEventListener("change", update);
    size.addEventListener("change", update);

    update();
}

function initJQueryFeatures() {
    if (!window.jQuery) return;

    $(".faq-question").on("click", function() {
        const answer = $(this).closest(".faq-item").children(".faq-answer");

        answer.stop(true, true).slideToggle(180);

        $(this).find("span").text(
            answer.is(":visible") ? "−" : "+"
        );
    });

    $(".feature-card")
        .on("mouseenter", function() {
            $(this).css("transform", "translateY(-4px)");
        })
        .on("mouseleave", function() {
            $(this).css("transform", "translateY(0)");
        });
}

document.addEventListener("DOMContentLoaded", () => {
    initTheme();
    renderDashboard();
    renderServices();
    renderBuilds();
    initContactForm();
    initEstimate();
    initJQueryFeatures();

    document.getElementById("serverForm")
        ?.addEventListener("submit", checkServer);

    document.getElementById("buildForm")
        ?.addEventListener("submit", handleBuildSubmit);

    document.getElementById("buildGrid")
        ?.addEventListener("click", handleBuildGridClick);

    document.getElementById("cancelEdit")
        ?.addEventListener("click", clearBuildForm);

    document.getElementById("searchBuilds")
        ?.addEventListener("input", renderBuilds);

    document.getElementById("filterCategory")
        ?.addEventListener("change", renderBuilds);

    document.getElementById("sortBuilds")
        ?.addEventListener("change", renderBuilds);
});

})();
