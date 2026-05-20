/**
 * FRONTEND - Fitness Band Recommendation App
 * Lógica de navegación, formulario y API
 */

const API_BASE = `http://localhost:3000/api`;

// Estado de la aplicación
const state = {
    currentQuestion: 0,
    answers: {
        int: null,
        ex: null,
        mot: null,
        tech: null,
    },
    questions: {},
    result: null,
    history: [],
};

// Mapeos para mostrar valores legibles
const answerLabels = {
    int: {
        B: "🎭 Ambos",
        H: "❤️ Salud",
        A: "✨ Apariencia",
    },
    ex: {
        S: "🛋️ Sedentario",
        M: "🚶 Moderado",
        A: "💪 Activo",
    },
    mot: {
        M: "😊 Moderado",
        A: "🔥 Muy Motivado",
    },
    tech: {
        Y: "✅ Sí, cómodo",
        N: "❌ Prefiero simple",
    },
};

// Mapeos de iconos para modelos
const bandIcons = {
    "iHealth Band 100": "⌚",
    "iHealth Band 500": "📱",
};

// Inicializar cuando carga el DOM
document.addEventListener("DOMContentLoaded", async () => {
    console.log("🚀 Inicializando aplicación...");
    await loadSurveyQuestions();
    setupEventListeners();
    displayQuestion(0);
});

/**
 * Cargar preguntas del API
 */
async function loadSurveyQuestions() {
    try {
        console.log("📋 Cargando preguntas...");
        const response = await fetch(`${API_BASE}/survey`, {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        state.questions = data.questions;
        console.log("✅ Preguntas cargadas:", state.questions);

        renderQuestions();
    } catch (error) {
        console.error("❌ Error cargando preguntas:", error);
        alert("Error al cargar las preguntas. Intenta recargar.");
    }
}

/**
 * Renderizar las preguntas en el formulario
 */
function renderQuestions() {
    const questions = state.questions;

    // Pregunta 1: INT
    if (questions.int) {
        document.getElementById("q1Text").textContent = questions.int.question;
        renderOptions("int", questions.int.options, "optionsINT");
    }

    // Pregunta 2: EX
    if (questions.ex) {
        document.getElementById("q2Text").textContent = questions.ex.question;
        renderOptions("ex", questions.ex.options, "optionsEX");
    }

    // Pregunta 3: MOT
    if (questions.mot) {
        document.getElementById("q3Text").textContent = questions.mot.question;
        renderOptions("mot", questions.mot.options, "optionsMOT");
    }

    // Pregunta 4: TECH
    if (questions.tech) {
        document.getElementById("q4Text").textContent = questions.tech.question;
        renderOptions("tech", questions.tech.options, "optionsTECH");
    }
}

/**
 * Renderizar opciones de respuesta
 */
function renderOptions(questionKey, options, containerId) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    options.forEach((option) => {
        const button = document.createElement("button");
        button.type = "button";
        button.className = "option-btn";
        if (state.answers[questionKey] === option.value) {
            button.classList.add("selected");
        }

        button.innerHTML = `
            <span class="option-icon">${getOptionIcon(questionKey, option.value)}</span>
            <span>${option.label}</span>
        `;

        button.addEventListener("click", () => {
            selectOption(questionKey, option.value);
        });

        container.appendChild(button);
    });
}

/**
 * Obtener icono para una opción
 */
function getOptionIcon(questionKey, value) {
    const icons = {
        int: { B: "🎭", H: "❤️", A: "✨" },
        ex: { S: "🛋️", M: "🚶", A: "💪" },
        mot: { M: "😊", A: "🔥" },
        tech: { Y: "✅", N: "❌" },
    };
    return icons[questionKey]?.[value] || "•";
}

/**
 * Seleccionar una opción
 */
function selectOption(questionKey, value) {
    state.answers[questionKey] = value;
    console.log(`✓ Seleccionado ${questionKey}: ${value}`);

    // Actualizar UI
    renderOptions(
        questionKey,
        state.questions[questionKey].options,
        `options${questionKey.toUpperCase()}`
    );

    // Habilitar/deshabilitar botones según la pregunta actual
    updateButtonStates();
}

/**
 * Actualizar estado de botones
 */
function updateButtonStates() {
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");
    
    // Validar según la pregunta actual
    let currentAnswered = false;
    
    if (state.currentQuestion === 0) {
        currentAnswered = state.answers.int !== null;
    } else if (state.currentQuestion === 1) {
        currentAnswered = state.answers.ex !== null;
    } else if (state.currentQuestion === 2) {
        currentAnswered = state.answers.mot !== null;
    } else if (state.currentQuestion === 3) {
        currentAnswered = state.answers.tech !== null;
    }
    
    // Habilitar siguiente/submit solo si la pregunta actual está respondida
    nextBtn.disabled = !currentAnswered;
    submitBtn.disabled = !currentAnswered;
}

/**
 * Setup de event listeners
 */
function setupEventListeners() {
    const form = document.getElementById("surveyForm");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();
        await submitSurvey();
    });

    nextBtn.addEventListener("click", () => {
        if (state.currentQuestion < 3) {
            displayQuestion(state.currentQuestion + 1);
        }
    });

    prevBtn.addEventListener("click", () => {
        if (state.currentQuestion > 0) {
            displayQuestion(state.currentQuestion - 1);
        }
    });
}

/**
 * Mostrar pregunta específica
 */
function displayQuestion(questionIndex) {
    state.currentQuestion = questionIndex;

    // Actualizar progress bar
    const progress = ((questionIndex + 1) / 4) * 100;
    document.getElementById("progressFill").style.width = `${progress}%`;
    document.getElementById("currentQuestion").textContent = questionIndex + 1;

    // Mostrar/ocultar grupos de preguntas
    ["questionGroup1", "questionGroup2", "questionGroup3", "questionGroup4"].forEach((groupId, idx) => {
        const group = document.getElementById(groupId);
        if (idx === questionIndex) {
            group.classList.remove("hidden");
        } else {
            group.classList.add("hidden");
        }
    });

    // Actualizar botones
    const prevBtn = document.getElementById("prevBtn");
    const nextBtn = document.getElementById("nextBtn");
    const submitBtn = document.getElementById("submitBtn");

    if (questionIndex === 0) {
        prevBtn.classList.add("hidden");
    } else {
        prevBtn.classList.remove("hidden");
    }

    if (questionIndex === 3) {
        nextBtn.classList.add("hidden");
        submitBtn.classList.remove("hidden");
    } else {
        nextBtn.classList.remove("hidden");
        submitBtn.classList.add("hidden");
    }

    // Actualizar estado de botones según la pregunta actual
    updateButtonStates();

    // Scroll suave
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Enviar cuestionario
 */
async function submitSurvey() {
    try {
        showLoading(true);

        console.log("📤 Enviando respuestas:", state.answers);

        const response = await fetch(`${API_BASE}/recommend`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(state.answers),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const result = await response.json();
        console.log("✅ Resultado recibido:", result);

        state.result = result;
        displayResults(result);
    } catch (error) {
        console.error("❌ Error enviando cuestionario:", error);
        alert("Error al procesar tu recomendación. Intenta de nuevo.");
    } finally {
        showLoading(false);
    }
}

/**
 * Mostrar resultados
 */
function displayResults(result) {
    // Ocultar survey, mostrar results
    document.getElementById("surveySection").classList.add("hidden");
    document.getElementById("resultsSection").classList.remove("hidden");

    // Banda recomendada
    const bandName = result.predictedBand;
    const icon = bandIcons[bandName] || "🎯";
    document.getElementById("recommendedBand").textContent = `${icon} ${bandName}`;
    document.getElementById("resultIcon").textContent = icon;

    // Confianza
    const confidence = Math.round(result.confidence * 100);
    document.getElementById("confidencePercent").textContent = `${confidence}%`;

    // Ajustar círculo de confianza
    const elem = document.querySelector(".confidence-circle");
    const degrees = (confidence / 100) * 360;
    elem.style.setProperty("--conf-degrees", `${degrees}deg`);

    // Nivel de confianza descriptivo
    let confidenceLevel = "Baja";
    if (confidence >= 75) {
        confidenceLevel = "Muy Alta 🔥";
    } else if (confidence >= 60) {
        confidenceLevel = "Alta ⭐";
    } else if (confidence >= 50) {
        confidenceLevel = "Moderada 👍";
    }
    document.getElementById("confidenceLevel").textContent = confidenceLevel;

    // Gráfico de probabilidades
    displayProbabilities(result.probabilities);

    // Detalles del modelo
    displayModelDetails(bandName);

    // Mostrar respuestas seleccionadas
    document.getElementById("selectedINT").textContent =
        answerLabels.int[state.answers.int] || state.answers.int;
    document.getElementById("selectedEX").textContent =
        answerLabels.ex[state.answers.ex] || state.answers.ex;
    document.getElementById("selectedMOT").textContent =
        answerLabels.mot[state.answers.mot] || state.answers.mot;
    document.getElementById("selectedTECH").textContent =
        answerLabels.tech[state.answers.tech] || state.answers.tech;

    // Scroll a resultados
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Mostrar gráfico de probabilidades
 */
function displayProbabilities(probabilities) {
    const container = document.getElementById("probabilitiesContainer");
    container.innerHTML = "";

    // Ordenar por probabilidad descendente
    const sorted = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);

    sorted.forEach(([model, prob]) => {
        const percentage = Math.round(prob * 100);
        const icon = bandIcons[model] || "📦";

        const html = `
            <div class="probability-item">
                <span class="prob-label">${icon} ${model}</span>
                <div class="prob-bar">
                    <div class="prob-fill" style="width: ${percentage}%">
                        ${percentage}%
                    </div>
                </div>
                <span class="prob-percent">${percentage}%</span>
            </div>
        `;

        container.innerHTML += html;
    });
}

/**
 * Mostrar detalles del modelo
 */
function displayModelDetails(model) {
    const container = document.getElementById("modelDetailsContainer");
    container.innerHTML = "";

    // Detalles específicos por modelo
    const details = {
        "iHealth Band 100": {
            "💰 Precio": "Económico",
            "🎯 Uso": "Básico",
            "🔧 Funciones": "Esenciales",
        },
        "iHealth Band 500": {
            "💰 Precio": "Premium",
            "🎯 Uso": "Avanzado",
            "🔧 Funciones": "Completas",
        },
    };

    const modelDetails = details[model] || {};

    Object.entries(modelDetails).forEach(([label, value]) => {
        const html = `
            <div class="detail-item">
                <div class="detail-label">${label}</div>
                <div class="detail-value">${value}</div>
            </div>
        `;
        container.innerHTML += html;
    });
}

/**
 * Resetear el cuestionario
 */
function resetSurvey() {
    state.currentQuestion = 0;
    state.answers = {
        int: null,
        ex: null,
        mot: null,
        tech: null,
    };
    state.result = null;

    document.getElementById("surveySection").classList.remove("hidden");
    document.getElementById("resultsSection").classList.add("hidden");
    document.getElementById("historySection").classList.add("hidden");

    renderQuestions();
    displayQuestion(0);

    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Ver histórico
 */
async function viewHistory() {
    try {
        console.log("📜 Cargando histórico...");
        showLoading(true);

        const response = await fetch(`${API_BASE}/history`);

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.json();
        const recommendations = data.recommendations || [];

        displayHistory(recommendations);

        document.getElementById("resultsSection").classList.add("hidden");
        document.getElementById("historySection").classList.remove("hidden");

        window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
        console.error("❌ Error cargando histórico:", error);
        alert("Error al cargar el histórico.");
    } finally {
        showLoading(false);
    }
}

/**
 * Mostrar histórico de recomendaciones
 */
function displayHistory(recommendations) {
    const container = document.getElementById("historyContainer");
    container.innerHTML = "";

    if (recommendations.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <p>No hay recomendaciones registradas aún</p>
                <p style="font-size: 0.9rem; opacity: 0.7;">Completa un cuestionario para ver tu histórico</p>
            </div>
        `;
        return;
    }

    recommendations.forEach((rec) => {
        const date = new Date(rec.created_at).toLocaleDateString("es-ES", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

        const confidence = Math.round(rec.confidence * 100);
        const icon = bandIcons[rec.predicted_band] || "📦";

        const html = `
            <div class="history-item">
                <div class="history-icon">${icon}</div>
                <div class="history-info">
                    <div class="history-band">${rec.predicted_band}</div>
                    <div class="history-meta">
                        Ejercicio: ${answerLabels.hm[rec.hm]} • 
                        Dispositivos: ${answerLabels.cel[rec.cel]} • 
                        Motivación: ${answerLabels.mi[rec.mi]}
                    </div>
                </div>
                <div class="history-confidence">
                    ✓ ${confidence}%
                </div>
                <div class="history-date">${date}</div>
            </div>
        `;

        container.innerHTML += html;
    });
}

/**
 * Ocultar histórico
 */
function hideHistory() {
    document.getElementById("historySection").classList.add("hidden");
    document.getElementById("resultsSection").classList.remove("hidden");
    window.scrollTo({ top: 0, behavior: "smooth" });
}

/**
 * Mostrar/ocultar spinner de carga
 */
function showLoading(show) {
    const spinner = document.getElementById("loadingSpinner");
    if (show) {
        spinner.classList.remove("hidden");
    } else {
        spinner.classList.add("hidden");
    }
}

/**
 * Logging
 */
console.log("✅ App.js cargado correctamente");

