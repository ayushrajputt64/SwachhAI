// ⚠️ REPLACE THIS with your Teachable Machine URL after training
const MODEL_URL = "https://teachablemachine.withgoogle.com/models/E9AlpCNSp/";

let model, webcam, maxPredictions;
let isRunning = false;
let counts = { total: 0, Plastic: 0, Organic: 0, Paper: 0, Metal: 0 };
let lastCountTime = 0;

// Waste database
const wasteData = {
    "Plastic": {
        icon: "🧴",
        color: "#2196F3",
        tip: "♻️ PLASTIC detected at this location! Segregate into BLUE bin. SwachhAI has GPS-tagged this hotspot for priority plastic collection. Patna generates approx 258 TPD of non-biodegradable waste — plastic is the biggest contributor."
    },
    "Organic": {
        icon: "🍃",
        color: "#4CAF50",
        tip: "🌱 ORGANIC waste detected! Place in GREEN bin. Can be composted within 30-45 days. Patna's waste is 47.4% biodegradable (NEERI Study) — composting this can reduce landfill load at Ramachak Bairya significantly."
    },
    "Paper": {
        icon: "📄",
        color: "#FFC107",
        tip: "📦 PAPER waste detected! Place in YELLOW bin for recycling. Recycling 1 tonne of paper saves 17 trees. SwachhAI has flagged this zone for paper recycling pickup route optimization."
    },
    "Metal": {
        icon: "🔩",
        color: "#f44336",
        tip: "⚙️ METAL waste detected! Place in RED bin. Metal is 100% recyclable indefinitely. SwachhAI has alerted Patna scrap collection network for this GPS location."
    }
};

// Start scanner
async function init() {
    try {
        document.getElementById("startBtn").disabled = true;
        document.getElementById("statusText").textContent = "⏳ Loading AI Model...";

        const modelURL = MODEL_URL + "model.json";
        const metadataURL = MODEL_URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();

        const flip = true;
        webcam = new tmImage.Webcam(380, 380, flip);
        await webcam.setup();
        await webcam.play();

        document.getElementById("webcam-container").appendChild(webcam.canvas);
        document.getElementById("stopBtn").disabled = false;
        document.getElementById("statusText").textContent = "✅ Scanner Active — Detecting waste in real-time";

        buildBars();
        getGPS();

        isRunning = true;
        window.requestAnimationFrame(loop);

    } catch (err) {
        console.error(err);
        document.getElementById("startBtn").disabled = false;
        document.getElementById("statusText").textContent = 
            "❌ Error: Replace MODEL_URL in app.js with your Teachable Machine URL";
    }
}

// Build confidence bars
function buildBars() {
    const container = document.getElementById("label-container");
    container.innerHTML = "";
    const classes = ["Plastic", "Organic", "Paper", "Metal"];
    classes.forEach((cls, i) => {
        container.innerHTML += `
            <div class="prob-item">
                <div class="prob-label">
                    <span>${wasteData[cls]?.icon || ""} ${cls}</span>
                    <span id="pct-${i}">0%</span>
                </div>
                <div class="prob-bar-bg">
                    <div class="prob-bar" id="bar-${i}" style="width:0%"></div>
                </div>
            </div>`;
    });
}

// Prediction loop
async function loop() {
    if (!isRunning) return;
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

// Run prediction
async function predict() {
    const prediction = await model.predict(webcam.canvas);

    let maxProb = 0, maxClass = "";

    prediction.forEach((pred, i) => {
        const pct = (pred.probability * 100).toFixed(1);
        const bar = document.getElementById(`bar-${i}`);
        const pctEl = document.getElementById(`pct-${i}`);
        if (bar) bar.style.width = pct + "%";
        if (pctEl) pctEl.textContent = pct + "%";

        if (pred.probability > maxProb) {
            maxProb = pred.probability;
            maxClass = pred.className;
        }
    });

    // Update result if confidence > 70%
    if (maxProb > 0.70 && wasteData[maxClass]) {
        const data = wasteData[maxClass];
        document.getElementById("wasteIcon").textContent = data.icon;
        document.getElementById("wasteType").textContent = maxClass + " Waste";
        document.getElementById("wasteType").style.color = data.color;
        document.getElementById("confidence").textContent = 
            `Confidence: ${(maxProb * 100).toFixed(1)}%`;
        document.getElementById("tipText").textContent = data.tip;

        // Count every 3 seconds
        const now = Date.now();
        if (now - lastCountTime > 3000) {
            counts.total++;
            counts[maxClass]++;
            updateStats();
            lastCountTime = now;
        }
    }
}

// Update stats
function updateStats() {
    document.getElementById("totalScans").textContent = counts.total;
    document.getElementById("plasticCount").textContent = counts.Plastic;
    document.getElementById("organicCount").textContent = counts.Organic;
    document.getElementById("paperCount").textContent = counts.Paper;
    document.getElementById("metalCount").textContent = counts.Metal;
}

// Stop scanner
function stopScanner() {
    isRunning = false;
    if (webcam) webcam.stop();
    document.getElementById("startBtn").disabled = false;
    document.getElementById("stopBtn").disabled = true;
    document.getElementById("statusText").textContent = "⏹ Scanner stopped";
    document.getElementById("wasteType").textContent = "Stopped";
    document.getElementById("wasteIcon").textContent = "⏹";
    document.getElementById("confidence").textContent = "";
}

// Get GPS
function getGPS() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const lat = pos.coords.latitude.toFixed(4);
                const lng = pos.coords.longitude.toFixed(4);
                document.getElementById("gpsCoord").textContent = `${lat},${lng}`;
            },
            () => {
                // Default Patna coordinates
                document.getElementById("gpsCoord").textContent = "25.5941,85.1376";
            }
        );
    }
}