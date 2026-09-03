const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

let width;
let height;

let particles = [];
let dataPackets = [];

let selectedSystem = null;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let lastMouseX = mouseX;
let lastMouseY = mouseY;
let mouseVelocity = 0;

window.addEventListener("mousemove", e => {

    const dx = e.clientX - mouseX;
    const dy = e.clientY - mouseY;

    const movement =
        Math.sqrt(
            dx * dx +
            dy * dy
        );

    mouseVelocity =
        Math.min(
            movement,
            80
        );

    mouseX = e.clientX;
    mouseY = e.clientY;

});


/* =================================
   RESIZE
================================= */

function resize() {

    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;

}

window.addEventListener("resize", resize);

resize();


/* =================================
   BACKGROUND PARTICLES
================================= */

for (let i = 0; i < 180; i++) {

    particles.push({

        angle:
            Math.random() *
            Math.PI *
            2,

        radius:
            100 +
            Math.random() *
            560,

        speed:
            0.0005 +
            Math.random() *
            0.0018,

        size:
            0.5 +
            Math.random() *
            1.5

    });

}


/* =================================
   SYSTEM POSITIONS
================================= */

function getSystemPositions() {

    return {

        launch: {
            x: width * 0.50,
            y: height * 0.17
        },

        automate: {
            x: width * 0.92,
            y: height * 0.50
        },

        build: {
            x: width * 0.50,
            y: height * 0.88
        },

        manage: {
            x: width * 0.08,
            y: height * 0.50
        }

    };

}


/* =================================
   CREATE DATA PACKET
================================= */

function createPacket(from, to) {

    dataPackets.push({

        from,
        to,

        progress: 0,

        speed:
            0.004 +
            Math.random() *
            0.004

    });

}


/* =================================
   CONTINUOUS SYSTEM ACTIVITY
================================= */

setInterval(() => {

    createPacket(
        "core",
        "launch"
    );

}, 900);


setInterval(() => {

    createPacket(
        "core",
        "automate"
    );

}, 1200);


setInterval(() => {

    createPacket(
        "core",
        "build"
    );

}, 1000);


setInterval(() => {

    createPacket(
        "core",
        "manage"
    );

}, 1300);


/* =================================
   DRAW CONNECTION
================================= */

function drawConnection(
    x1,
    y1,
    x2,
    y2,
    active = false
) {

    ctx.beginPath();

    ctx.moveTo(
        x1,
        y1
    );

    ctx.lineTo(
        x2,
        y2
    );

    ctx.strokeStyle = active

        ? "rgba(150,230,250,0.45)"

        : "rgba(100,180,210,0.16)";

    ctx.lineWidth =
        active
            ? 2
            : 1;

    ctx.stroke();

}


/* =================================
   DRAW DATA PACKET
================================= */

function drawPacket(
    packet,
    positions
) {

    const cx = width / 2;
    const cy = height / 2;

    let start;
    let end;


    if (packet.from === "core") {

        start = {
            x: cx,
            y: cy
        };

    } else {

        start =
            positions[
                packet.from
            ];

    }


    if (packet.to === "core") {

        end = {
            x: cx,
            y: cy
        };

    } else {

        end =
            positions[
                packet.to
            ];

    }


    const x =
        start.x +
        (end.x - start.x) *
        packet.progress;


    const y =
        start.y +
        (end.y - start.y) *
        packet.progress;


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        7,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(120,220,250,0.10)";

    ctx.fill();


    ctx.beginPath();

    ctx.arc(
        x,
        y,
        2.5,
        0,
        Math.PI * 2
    );

    ctx.fillStyle =
        "rgba(210,250,255,1)";

    ctx.shadowBlur = 15;

    ctx.shadowColor =
        "rgba(120,230,255,1)";

    ctx.fill();

    ctx.shadowBlur = 0;

}


/* =================================
   DRAW ENVIRONMENT
================================= */

function draw() {

    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const cx = width / 2;
    const cy = height / 2;

    const positions =
        getSystemPositions();


    /* =================================
       RADIAL GRID
    ================================= */

    ctx.save();

    ctx.translate(
        cx,
        cy
    );

    ctx.strokeStyle =
        "rgba(100,170,200,0.07)";

    ctx.lineWidth = 1;


    for (
        let r = 120;
        r < 700;
        r += 60
    ) {

        ctx.beginPath();

        ctx.arc(
            0,
            0,
            r,
            0,
            Math.PI * 2
        );

        ctx.stroke();

    }


    for (
        let a = 0;
        a < Math.PI * 2;
        a += Math.PI / 12
    ) {

        ctx.beginPath();

        ctx.moveTo(
            0,
            0
        );

        ctx.lineTo(
            Math.cos(a) * 850,
            Math.sin(a) * 850
        );

        ctx.stroke();

    }

    ctx.restore();


    /* =================================
       CORE CONNECTIONS
    ================================= */

    drawConnection(
        cx,
        cy,
        positions.launch.x,
        positions.launch.y,
        selectedSystem === "launch"
    );


    drawConnection(
        cx,
        cy,
        positions.automate.x,
        positions.automate.y,
        selectedSystem === "automate"
    );


    drawConnection(
        cx,
        cy,
        positions.build.x,
        positions.build.y,
        selectedSystem === "build"
    );


    drawConnection(
        cx,
        cy,
        positions.manage.x,
        positions.manage.y,
        selectedSystem === "manage"
    );


    /* =================================
       OUTER NETWORK
    ================================= */

    drawConnection(
        positions.launch.x,
        positions.launch.y,
        positions.automate.x,
        positions.automate.y
    );


    drawConnection(
        positions.automate.x,
        positions.automate.y,
        positions.build.x,
        positions.build.y
    );


    drawConnection(
        positions.build.x,
        positions.build.y,
        positions.manage.x,
        positions.manage.y
    );


    drawConnection(
        positions.manage.x,
        positions.manage.y,
        positions.launch.x,
        positions.launch.y
    );


    /* =================================
       LIVING PARTICLES
    ================================= */

    particles.forEach(
        p => {

            const currentSpeed =
                p.speed +
                (mouseVelocity * 0.00018);

            p.angle += currentSpeed;

            mouseVelocity *= 0.985;


            const x =
                cx +
                Math.cos(
                    p.angle
                ) *
                p.radius;


            const y =
                cy +
                Math.sin(
                    p.angle
                ) *
                p.radius *
                0.55;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                p.size,
                0,
                Math.PI * 2
            );


            ctx.fillStyle =
                "rgba(150,220,240,0.50)";

            ctx.fill();

        }
    );


    /* =================================
       DATA FLOW
    ================================= */

    dataPackets.forEach(
        packet => {

            packet.progress +=
                packet.speed;


            drawPacket(
                packet,
                positions
            );

        }
    );


    dataPackets =
        dataPackets.filter(
            packet =>
                packet.progress <= 1
        );


    requestAnimationFrame(
        draw
    );

}

draw();


/* =================================
   CHESHIRE AI SYSTEM ARCHITECTURE
================================= */

const systems = {

    launch: {

        number: "01",

        title: "LAUNCH",

        subtitle:
            "DIGITAL PRESENCE",

        description:
            "We create the digital front door to your business — connecting your website, landing pages, Google presence, forms, analytics and AI enquiry handling into a practical digital foundation.",

        flow: [
            "BUSINESS",
            "WEBSITE",
            "LEAD CAPTURE",
            "CONTACT",
            "CRM"
        ],

        items: [
            "WEBSITES",
            "LANDING PAGES",
            "GOOGLE BUSINESS",
            "CONTACT FORMS",
            "ANALYTICS",
            "AI ENQUIRY HANDLING"
        ]

    },


    automate: {

        number: "02",

        title: "AUTOMATE",

        subtitle:
            "INTELLIGENT WORKFLOWS",

        description:
            "We take repetitive work out of the day-to-day operation — capturing leads, qualifying enquiries with AI, updating the CRM, sending follow-ups and keeping the right people informed.",

        flow: [
            "LEAD",
            "AI QUALIFICATION",
            "CRM",
            "FOLLOW-UP",
            "SALE"
        ],

        items: [
            "LEAD CAPTURE",
            "AI QUALIFICATION",
            "EMAIL AUTOMATION",
            "CRM UPDATES",
            "CUSTOMER ENQUIRIES",
            "APPOINTMENT REQUESTS",
            "ADMIN WORKFLOWS"
        ]

    },


    build: {

        number: "03",

        title: "BUILD",

        subtitle:
            "AI SYSTEMS",

        description:
            "We build the layer that off-the-shelf software cannot provide — AI agents, custom dashboards, databases, APIs and internal tools designed around how your business actually works.",

        flow: [
            "BUSINESS DATA",
            "AI AGENT",
            "API",
            "DASHBOARD",
            "ACTION"
        ],

        items: [
            "AI AGENTS",
            "CUSTOM DASHBOARDS",
            "APIs",
            "DATABASES",
            "INTERNAL TOOLS",
            "BUSINESS INTELLIGENCE"
        ]

    },


    manage: {

        number: "04",

        title: "MANAGE",

        subtitle:
            "LIVE OPERATIONS",

        description:
            "The machinery keeps evolving after launch. We monitor automation health, detect failures, review performance, update AI models and continuously improve the systems as your business changes.",

        flow: [
            "LIVE SYSTEM",
            "MONITOR",
            "ANALYSE",
            "OPTIMISE",
            "UPDATE"
        ],

        items: [
            "SYSTEM MONITORING",
            "AUTOMATION HEALTH",
            "ERROR DETECTION",
            "AI MODEL UPDATES",
            "PERFORMANCE OPTIMISATION",
            "ONGOING SUPPORT"
        ]

    }

};


/* =================================
   SERVICE PANEL ELEMENTS
================================= */

const panel =
    document.getElementById(
        "info-panel"
    );

const panelNumber =
    document.getElementById(
        "panel-number"
    );

const panelTitle =
    document.getElementById(
        "panel-title"
    );

const panelSubtitle =
    document.getElementById(
        "panel-subtitle"
    );

const panelDescription =
    document.getElementById(
        "panel-description"
    );

const panelItems =
    document.getElementById(
        "panel-items"
    );

const panelFlow =
    document.getElementById(
        "panel-flow"
    );

const panelAction =
    document.querySelector(
        ".panel-action"
    );


/* =================================
   RENDER SYSTEM FLOW
================================= */

function renderFlow(flow) {

    panelFlow.innerHTML = "";

    flow.forEach(
        (step, index) => {

            const node =
                document.createElement(
                    "span"
                );

            node.className =
                "flow-node";

            node.textContent =
                step;

            panelFlow.appendChild(
                node
            );


            if (
                index <
                flow.length - 1
            ) {

                const arrow =
                    document.createElement(
                        "span"
                    );

                arrow.className =
                    "flow-arrow";

                arrow.textContent =
                    "→";

                panelFlow.appendChild(
                    arrow
                );

            }

        }
    );

}


/* =================================
   RENDER CAPABILITIES
================================= */

function renderItems(items) {

    panelItems.innerHTML = "";

    items.forEach(
        item => {

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "panel-item";

            element.textContent =
                item;

            panelItems.appendChild(
                element
            );

        }
    );

}


/* =================================
   OPEN SERVICE SYSTEM
================================= */

document
    .querySelectorAll(
        ".system-node"
    )
    .forEach(
        node => {

            node.addEventListener(
                "click",
                () => {

                    const key =
                        node.dataset.system;

                    const system =
                        systems[key];

                    if (!system) return;


                    selectedSystem =
                        key;


                    document
                        .querySelectorAll(
                            ".system-node"
                        )
                        .forEach(
                            n =>
                                n.classList.remove(
                                    "active"
                                )
                        );


                    node.classList.add(
                        "active"
                    );


                    panelNumber.textContent =
                        system.number;

                    panelTitle.textContent =
                        system.title;

                    panelSubtitle.textContent =
                        system.subtitle;

                    panelDescription.textContent =
                        system.description;


                    renderFlow(
                        system.flow
                    );

                    renderItems(
                        system.items
                    );


                    panelAction.textContent =
                        "EXPLORE " +
                        system.title;


                    panel.classList.add(
                        "active"
                    );

                }
            );

        }
    );


/* =================================
   EXPLORE SERVICE
================================= */

panelAction.addEventListener(
    "click",
    () => {

        const current =
            systems[selectedSystem];

        if (!current) return;


        panelDescription.textContent =
            "SYSTEM ARCHITECTURE — " +
            current.title +
            " is designed around the real processes, data and tools inside a business. The system can be expanded as new requirements appear.";


        panelAction.textContent =
            "ARCHITECTURE ACTIVE";

    }
);


/* =================================
   CLOSE SERVICE PANEL
================================= */

document
    .getElementById(
        "close-panel"
    )
    .addEventListener(
        "click",
        () => {

            panel.classList.remove(
                "active"
            );


            document
                .querySelectorAll(
                    ".system-node"
                )
                .forEach(
                    node =>
                        node.classList.remove(
                            "active"
                        )
                );


            selectedSystem = null;

        }
    );


/* =================================
   SECONDARY NAVIGATION
================================= */

const secondaryPanel =
    document.getElementById(
        "secondary-panel"
    );

const closeSecondary =
    document.getElementById(
        "close-secondary"
    );

const secondarySections =
    document.querySelectorAll(
        ".secondary-content"
    );

const secondaryButtons =
    document.querySelectorAll(
        "#secondary-nav button"
    );


/* =================================
   OPEN SECONDARY SECTION
================================= */

function openSecondary(
    sectionName
) {

    secondarySections.forEach(
        section => {

            section.classList.remove(
                "active"
            );

        }
    );


    const selected =
        document.getElementById(
            "section-" +
            sectionName
        );


    if (!selected) return;


    selected.classList.add(
        "active"
    );


    secondaryPanel.classList.add(
        "active"
    );


    panel.classList.remove(
        "active"
    );


    document
        .querySelectorAll(
            ".system-node"
        )
        .forEach(
            node =>
                node.classList.remove(
                    "active"
                )
        );


    selectedSystem = null;

}


/* =================================
   NAV BUTTONS
================================= */

secondaryButtons.forEach(
    button => {

        button.addEventListener(
            "click",
            () => {

                openSecondary(
                    button.dataset.section
                );

            }
        );

    }
);


/* =================================
   CLOSE SECONDARY PANEL
================================= */

closeSecondary.addEventListener(
    "click",
    () => {

        secondaryPanel.classList.remove(
            "active"
        );


        secondarySections.forEach(
            section =>
                section.classList.remove(
                    "active"
                )
        );

    }
);


/* =================================
   CONTACT FORM
================================= */

const contactForm =
    document.getElementById(
        "contact-form"
    );

const contactResponse =
    document.getElementById(
        "contact-response"
    );


if (contactForm) {

    contactForm.addEventListener(
        "submit",
        event => {

            event.preventDefault();


            const name =
                document.getElementById(
                    "contact-name"
                ).value.trim();


            const email =
                document.getElementById(
                    "contact-email"
                ).value.trim();


            const business =
                document.getElementById(
                    "contact-business"
                ).value.trim();


            const message =
                document.getElementById(
                    "contact-message"
                ).value.trim();


            if (
                !name ||
                !email ||
                !message
            ) {

                contactResponse.textContent =
                    "PLEASE COMPLETE THE REQUIRED FIELDS.";

                return;

            }


            /* =================================
               BUILD EMAIL
            ================================= */

            const recipient =
                "futrbit@gmail.com";


            const subject =
                encodeURIComponent(
                    "Cheshire AI Enquiry — " +
                    (
                        business ||
                        name
                    )
                );


            const body =
                encodeURIComponent(
                    "CHESHIRE AI ENQUIRY\n\n" +

                    "Name: " +
                    name +
                    "\n" +

                    "Email: " +
                    email +
                    "\n" +

                    "Business: " +
                    (
                        business ||
                        "Not provided"
                    ) +
                    "\n\n" +

                    "WHAT WOULD YOU LIKE TO IMPROVE?\n\n" +

                    message +
                    "\n\n" +

                    "Sent via Cheshire AI"
                );


            /* =================================
               OPEN EMAIL CLIENT
            ================================= */

            const mailto =
                "mailto:" +
                recipient +
                "?subject=" +
                subject +
                "&body=" +
                body;


            window.location.href =
                mailto;

        }
    );

}


/* =================================
   ESCAPE KEY
================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key !== "Escape"
        ) return;


        panel.classList.remove(
            "active"
        );


        secondaryPanel.classList.remove(
            "active"
        );


        secondarySections.forEach(
            section =>
                section.classList.remove(
                    "active"
                )
        );


        document
            .querySelectorAll(
                ".system-node"
            )
            .forEach(
                node =>
                    node.classList.remove(
                        "active"
                    )
        );


        selectedSystem = null;

    }
);



