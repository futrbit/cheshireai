const canvas = document.getElementById("network");
const ctx = canvas.getContext("2d");

let width = 0;
let height = 0;

let particles = [];
let dataPackets = [];

let selectedSystem = null;

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let targetMouseX = mouseX;
let targetMouseY = mouseY;

let scrollProgress = 0;
let smoothScroll = 0;

let time = 0;


/* =================================
   BAUHAUS PALETTE
================================= */

const COLORS = {
    black: "#111111",
    red: "#e63b32",
    yellow: "#f2c230",
    blue: "#1688c9",
    paper: "#f5f4ef"
};


/* =================================
   MOUSE
================================= */

window.addEventListener("mousemove", event => {

    targetMouseX = event.clientX;
    targetMouseY = event.clientY;

});


/* =================================
   SCROLL
================================= */

window.addEventListener("scroll", () => {

    const maxScroll =
        document.documentElement.scrollHeight -
        window.innerHeight;

    if (maxScroll <= 0) {
        scrollProgress = 0;
        return;
    }

    scrollProgress =
        window.scrollY / maxScroll;

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
   PARTICLES
================================= */

for (let i = 0; i < 90; i++) {

    particles.push({

        x:
            Math.random(),

        y:
            Math.random(),

        size:
            Math.random() > 0.85
                ? 3
                : 1,

        speed:
            0.00015 +
            Math.random() * 0.00045,

        phase:
            Math.random() *
            Math.PI *
            2,

        type:
            Math.floor(
                Math.random() * 3
            )

    });

}


/* =================================
   GEOMETRIC OBJECTS
================================= */

const shapes = [

    {
        x: 0.17,
        y: 0.27,
        size: 85,
        rotation: 0.2,
        type: "square",
        color: COLORS.red
    },

    {
        x: 0.82,
        y: 0.22,
        size: 55,
        rotation: 0,
        type: "circle",
        color: COLORS.yellow
    },

    {
        x: 0.78,
        y: 0.76,
        size: 100,
        rotation: 0.4,
        type: "square",
        color: COLORS.blue
    },

    {
        x: 0.18,
        y: 0.76,
        size: 45,
        rotation: 0,
        type: "circle",
        color: COLORS.black
    }

];


/* =================================
   SYSTEM POSITIONS
================================= */

function getSystemPositions() {

    const scrollOffset =
        smoothScroll * height * 0.10;

    return {

        launch: {

            x:
                width * 0.50,

            y:
                height * 0.15 -
                scrollOffset

        },

        automate: {

            x:
                width * 0.90,

            y:
                height * 0.50 -
                scrollOffset * 0.25

        },

        build: {

            x:
                width * 0.50,

            y:
                height * 0.84 -
                scrollOffset

        },

        manage: {

            x:
                width * 0.10,

            y:
                height * 0.50 -
                scrollOffset * 0.25

        }

    };

}


/* =================================
   CORE POSITION
================================= */

function getCorePosition() {

    return {

        x:
            width / 2,

        y:
            height / 2 -
            smoothScroll *
            height *
            0.08

    };

}


/* =================================
   DATA PACKET
================================= */

function createPacket(from, to) {

    dataPackets.push({

        from,
        to,

        progress: 0,

        speed:
            0.0025 +
            Math.random() * 0.003,

        size:
            2 +
            Math.random() * 2

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

}, 1000);


setInterval(() => {

    createPacket(
        "core",
        "automate"
    );

}, 1300);


setInterval(() => {

    createPacket(
        "core",
        "build"
    );

}, 1100);


setInterval(() => {

    createPacket(
        "core",
        "manage"
    );

}, 1400);


/* =================================
   DRAW TECHNICAL GRID
================================= */

function drawGrid() {

    const spacing = 70;

    const offset =
        (time * 0.015) +
        (smoothScroll * 120);

    ctx.save();

    ctx.strokeStyle =
        "rgba(17,17,17,0.055)";

    ctx.lineWidth = 1;

    const startX =
        -spacing +
        (offset % spacing);

    const startY =
        -spacing +
        ((offset * 0.65) % spacing);


    for (
        let x = startX;
        x < width;
        x += spacing
    ) {

        ctx.beginPath();

        ctx.moveTo(x, 0);

        ctx.lineTo(
            x,
            height
        );

        ctx.stroke();

    }


    for (
        let y = startY;
        y < height;
        y += spacing
    ) {

        ctx.beginPath();

        ctx.moveTo(0, y);

        ctx.lineTo(
            width,
            y
        );

        ctx.stroke();

    }

    ctx.restore();

}


/* =================================
   DRAW CROSS AXIS
================================= */

function drawAxis(core) {

    ctx.save();

    ctx.strokeStyle =
        "rgba(17,17,17,0.16)";

    ctx.lineWidth = 1;

    ctx.setLineDash([
        8,
        8
    ]);


    ctx.beginPath();

    ctx.moveTo(
        0,
        core.y
    );

    ctx.lineTo(
        width,
        core.y
    );

    ctx.stroke();


    ctx.beginPath();

    ctx.moveTo(
        core.x,
        0
    );

    ctx.lineTo(
        core.x,
        height
    );

    ctx.stroke();


    ctx.setLineDash([]);

    ctx.restore();

}


/* =================================
   DRAW SYSTEM CONNECTION
================================= */

function drawConnection(
    start,
    end,
    color,
    active = false
) {

    const dx =
        end.x -
        start.x;

    const dy =
        end.y -
        start.y;

    const bend =
        Math.min(
            Math.abs(dx),
            Math.abs(dy)
        ) *
        0.18;


    ctx.save();

    ctx.beginPath();

    ctx.moveTo(
        start.x,
        start.y
    );


    if (
        Math.abs(dx) >
        Math.abs(dy)
    ) {

        ctx.lineTo(
            start.x + dx * 0.5,
            start.y
        );

        ctx.lineTo(
            start.x + dx * 0.5,
            end.y
        );

        ctx.lineTo(
            end.x,
            end.y
        );

    } else {

        ctx.lineTo(
            start.x,
            start.y + dy * 0.5
        );

        ctx.lineTo(
            end.x,
            start.y + dy * 0.5
        );

        ctx.lineTo(
            end.x,
            end.y
        );

    }


    ctx.strokeStyle =
        active
            ? color
            : "rgba(17,17,17,0.22)";

    ctx.lineWidth =
        active
            ? 3
            : 1;

    ctx.stroke();

    ctx.restore();

}


/* =================================
   DRAW SIGNAL MARKER
================================= */

function drawSignal(
    x,
    y,
    color,
    size = 7
) {

    ctx.save();

    ctx.translate(
        x,
        y
    );

    ctx.fillStyle =
        color;

    ctx.fillRect(
        -size / 2,
        -size / 2,
        size,
        size
    );

    ctx.restore();

}


/* =================================
   DRAW PACKET
================================= */

function drawPacket(
    packet,
    positions
) {

    const core =
        getCorePosition();


    let start;
    let end;


    if (
        packet.from === "core"
    ) {

        start = core;

    } else {

        start =
            positions[
                packet.from
            ];

    }


    if (
        packet.to === "core"
    ) {

        end = core;

    } else {

        end =
            positions[
                packet.to
            ];

    }


    const progress =
        packet.progress;


    const x =
        start.x +
        (end.x - start.x) *
        progress;


    const y =
        start.y +
        (end.y - start.y) *
        progress;


    const colors = [
        COLORS.red,
        COLORS.yellow,
        COLORS.blue
    ];


    const color =
        colors[
            Math.floor(
                packet.progress * 3
            ) % 3
        ];


    drawSignal(
        x,
        y,
        color,
        packet.size + 2
    );

}


/* =================================
   DRAW BAUHAUS SHAPES
================================= */

function drawShapes() {

    shapes.forEach(
        (shape, index) => {

            const mouseInfluenceX =
                (mouseX / width - 0.5) *
                30;

            const mouseInfluenceY =
                (mouseY / height - 0.5) *
                30;


            const x =
                width *
                shape.x +
                mouseInfluenceX *
                (index % 2 === 0
                    ? 1
                    : -1);


            const y =
                height *
                shape.y +
                mouseInfluenceY *
                (index % 2 === 0
                    ? -1
                    : 1) -
                smoothScroll *
                height *
                0.25;


            const rotation =
                shape.rotation +
                Math.sin(
                    time * 0.0004 +
                    index
                ) *
                0.08;


            ctx.save();

            ctx.translate(
                x,
                y
            );

            ctx.rotate(
                rotation
            );

            ctx.globalAlpha =
                0.92;


            if (
                shape.type === "circle"
            ) {

                ctx.beginPath();

                ctx.arc(
                    0,
                    0,
                    shape.size / 2,
                    0,
                    Math.PI * 2
                );

                ctx.fillStyle =
                    shape.color;

                ctx.fill();

            } else {

                ctx.fillStyle =
                    shape.color;

                ctx.fillRect(
                    -shape.size / 2,
                    -shape.size / 2,
                    shape.size,
                    shape.size
                );

            }


            ctx.restore();

        }
    );

}


/* =================================
   DRAW TECHNICAL MARKS
================================= */

function drawTechnicalMarks() {

    const margin = 28;

    ctx.save();

    ctx.fillStyle =
        "rgba(17,17,17,0.45)";

    ctx.font =
        "700 8px Arial";

    ctx.letterSpacing =
        "2px";


    ctx.fillText(
        "SYSTEM / 001",
        margin,
        height - margin
    );


    ctx.fillText(
        "AI / AUTOMATION / DIGITAL SYSTEMS",
        width - 210,
        height - margin
    );


    ctx.strokeStyle =
        "rgba(17,17,17,0.25)";

    ctx.beginPath();

    ctx.moveTo(
        margin,
        height - 48
    );

    ctx.lineTo(
        margin + 90,
        height - 48
    );

    ctx.stroke();


    ctx.restore();

}


/* =================================
   LIVING PARTICLES
================================= */

function drawParticles() {

    particles.forEach(
        (particle, index) => {

            particle.phase +=
                particle.speed;


            const driftX =
                Math.sin(
                    particle.phase +
                    index
                ) *
                10;


            const driftY =
                Math.cos(
                    particle.phase *
                    0.7 +
                    index
                ) *
                10;


            const x =
                particle.x *
                width +
                driftX;


            const y =
                particle.y *
                height +
                driftY -
                smoothScroll *
                height *
                0.12;


            ctx.beginPath();

            ctx.arc(
                x,
                y,
                particle.size,
                0,
                Math.PI * 2
            );


            if (
                particle.type === 0
            ) {

                ctx.fillStyle =
                    "rgba(230,59,50,0.38)";

            } else if (
                particle.type === 1
            ) {

                ctx.fillStyle =
                    "rgba(22,136,201,0.38)";

            } else {

                ctx.fillStyle =
                    "rgba(17,17,17,0.25)";

            }


            ctx.fill();

        }
    );

}


/* =================================
   CORE GEOMETRY
================================= */

function drawCoreGeometry(core) {

    const pulse =
        Math.sin(
            time * 0.0015
        ) *
        5;


    ctx.save();

    ctx.translate(
        core.x,
        core.y
    );


    /* outer square */

    ctx.strokeStyle =
        "rgba(17,17,17,0.35)";

    ctx.lineWidth = 1;

    ctx.strokeRect(
        -130 - pulse,
        -130 - pulse,
        260 + pulse * 2,
        260 + pulse * 2
    );


    /* blue axis marker */

    ctx.fillStyle =
        COLORS.blue;

    ctx.fillRect(
        -105,
        -5,
        210,
        10
    );


    /* yellow marker */

    ctx.fillStyle =
        COLORS.yellow;

    ctx.fillRect(
        -5,
        -105,
        10,
        210
    );


    /* red corner */

    ctx.fillStyle =
        COLORS.red;

    ctx.fillRect(
        92,
        92,
        28,
        28
    );


    ctx.restore();

}


/* =================================
   MAIN DRAW
================================= */

function draw() {

    time += 16;


    /* smooth mouse */

    mouseX +=
        (targetMouseX - mouseX) *
        0.055;

    mouseY +=
        (targetMouseY - mouseY) *
        0.055;


    /* smooth scroll */

    smoothScroll +=
        (scrollProgress - smoothScroll) *
        0.06;


    ctx.clearRect(
        0,
        0,
        width,
        height
    );


    const core =
        getCorePosition();


    const positions =
        getSystemPositions();


    /* =================================
       BACKGROUND
    ================================= */

    drawGrid();

    drawShapes();

    drawParticles();

    drawTechnicalMarks();


    /* =================================
       CORE SYSTEM
    ================================= */

    drawAxis(
        core
    );


    drawCoreGeometry(
        core
    );


    /* =================================
       CONNECTIONS
    ================================= */

    drawConnection(
        core,
        positions.launch,
        COLORS.red,
        selectedSystem === "launch"
    );


    drawConnection(
        core,
        positions.automate,
        COLORS.blue,
        selectedSystem === "automate"
    );


    drawConnection(
        core,
        positions.build,
        COLORS.black,
        selectedSystem === "build"
    );


    drawConnection(
        core,
        positions.manage,
        COLORS.yellow,
        selectedSystem === "manage"
    );


    /* =================================
       OUTER SYSTEM
    ================================= */

    drawConnection(
        positions.launch,
        positions.automate,
        COLORS.red
    );


    drawConnection(
        positions.automate,
        positions.build,
        COLORS.blue
    );


    drawConnection(
        positions.build,
        positions.manage,
        COLORS.black
    );


    drawConnection(
        positions.manage,
        positions.launch,
        COLORS.yellow
    );


    /* =================================
       DATA FLOW
    ================================= */

    dataPackets.forEach(
        packet => {

            packet.progress +=
                packet.speed *
                (1 + smoothScroll * 1.5);


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
   RENDER FLOW
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
   OPEN SECONDARY
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
   CLOSE SECONDARY
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


            window.location.href =
                "mailto:" +
                recipient +
                "?subject=" +
                subject +
                "&body=" +
                body;

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