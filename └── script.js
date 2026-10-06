let questions = JSON.parse(localStorage.getItem("deenQuestions")) || [
    {
        question: "ما هي أول سورة في القرآن الكريم؟",
        answers: [
            "الفاتحة",
            "البقرة",
            "الإخلاص",
            "الناس"
        ],
        correct: 0
    },
    {
        question: "كم عدد الصلوات المفروضة في اليوم؟",
        answers: [
            "ثلاث صلوات",
            "أربع صلوات",
            "خمس صلوات",
            "ست صلوات"
        ],
        correct: 2
    }
];

let currentQuestion = 0;
let score = 0;
let playerName = "";
let selectedAnswer = null;


// الانتقال بين الصفحات
function showPage(page) {

    document.querySelectorAll(".page").forEach(p => {
        p.classList.remove("active");
    });

    document.getElementById(page).classList.add("active");

    if (page === "admin") {
        loadQuestions();
    }
}


// بدء المسابقة
function startQuiz() {

    playerName =
        document.getElementById("playerName").value.trim();

    if (!playerName) {
        alert("اكتب اسمك أولاً");
        return;
    }

    currentQuestion = 0;
    score = 0;

    document.getElementById("startBtn").style.display = "none";
    document.getElementById("nextBtn").style.display = "block";

    showQuestion();
}


// عرض السؤال
function showQuestion() {

    selectedAnswer = null;

    const q = questions[currentQuestion];

    let html = `
        <div class="question">
            <h3>
                السؤال ${currentQuestion + 1}
                من ${questions.length}
            </h3>

            <h2>${q.question}</h2>
    `;

    q.answers.forEach((answer, index) => {

        html += `
            <button
                class="option"
                onclick="selectAnswer(${index})">
                ${answer}
            </button>
        `;
    });

    html += "</div>";

    document.getElementById("questionBox").innerHTML = html;
}


// اختيار الإجابة
function selectAnswer(index) {

    selectedAnswer = index;

    document.querySelectorAll(".option")
        .forEach(btn => {
            btn.style.background = "white";
        });

    document.querySelectorAll(".option")[index]
        .style.background = "#d9f5e8";
}


// السؤال التالي
function nextQuestion() {

    if (selectedAnswer === null) {
        alert("اختار إجابة أولاً");
        return;
    }

    if (
        selectedAnswer ===
        questions[currentQuestion].correct
    ) {
        score++;
    }

    currentQuestion++;

    if (currentQuestion >= questions.length) {
        finishQuiz();
    } else {
        showQuestion();
    }
}


// انتهاء المسابقة
function finishQuiz() {

    document.getElementById("questionBox").innerHTML = "";

    document.getElementById("nextBtn").style.display = "none";

    const percentage =
        Math.round((score / questions.length) * 100);

    document.getElementById("result").innerHTML = `
        <h2>🎉 انتهت المسابقة</h2>

        <p>
            الاسم: <strong>${playerName}</strong>
        </p>

        <p>
            النتيجة:
            <strong>
                ${score} / ${questions.length}
            </strong>
        </p>

        <p>
            النسبة:
            <strong>${percentage}%</strong>
        </p>

        <button
            class="main-btn"
            onclick="shareResult()">
            📤 مشاركة النتيجة
        </button>

        <button
            class="main-btn"
            onclick="showCertificate()">
            🏆 شهادة التقدير
        </button>
    `;
}


// مشاركة النتيجة
function shareResult() {

    const text =
        `🏆 شاركت في مسابقة Deen Quiz
الاسم: ${playerName}
النتيجة: ${score} من ${questions.length}

شارك أنت أيضًا في المسابقة 🕌`;

    if (navigator.share) {

        navigator.share({
            title: "Deen Quiz",
            text: text
        });

    } else {

        navigator.clipboard.writeText(text);

        alert("تم نسخ النتيجة، يمكنك مشاركتها الآن.");
    }
}


// عرض الشهادة
function showCertificate() {

    const percentage =
        Math.round((score / questions.length) * 100);

    document.getElementById("certificateName")
        .innerText = playerName;

    document.getElementById("certificateScore")
        .innerText =
        `النتيجة: ${score} من ${questions.length} - ${percentage}%`;

    showPage("certificate");
}


// دخول الإدارة
function loginAdmin() {

    const password =
        document.getElementById("adminPassword").value;

    if (password === "123456") {

        document.getElementById("adminPanel")
            .style.display = "block";

        loadQuestions();

    } else {

        alert("كلمة المرور غير صحيحة");

    }
}


// إضافة سؤال
function addQuestion() {

    const question =
        document.getElementById("newQuestion").value;

    const answers = [
        document.getElementById("answer1").value,
        document.getElementById("answer2").value,
        document.getElementById("answer3").value,
        document.getElementById("answer4").value
    ];

    const correct =
        Number(document.getElementById("correctAnswer").value) - 1;

    if (
        !question ||
        answers.some(a => !a) ||
        correct < 0 ||
        correct > 3
    ) {

        alert("أكمل بيانات السؤال");

        return;
    }

    questions.push({
        question: question,
        answers: answers,
        correct: correct
    });

    localStorage.setItem(
        "deenQuestions",
        JSON.stringify(questions)
    );

    alert("تم إضافة السؤال بنجاح");

    loadQuestions();
}


// عرض الأسئلة
function loadQuestions() {

    const box =
        document.getElementById("questionsList");

    if (!box) return;

    box.innerHTML = "";

    questions.forEach((q, index) => {

        box.innerHTML += `
            <div class="question-admin">

                <strong>
                    ${index + 1}. ${q.question}
                </strong>

                <br><br>

                <button
                    class="main-btn"
                    onclick="deleteQuestion(${index})">
                    🗑️ حذف
                </button>

            </div>
        `;
    });
}


// حذف سؤال
function deleteQuestion(index) {

    if (!confirm("هل تريد حذف السؤال؟")) {
        return;
    }

    questions.splice(index, 1);

    localStorage.setItem(
        "deenQuestions",
        JSON.stringify(questions)
    );

    loadQuestions();
}