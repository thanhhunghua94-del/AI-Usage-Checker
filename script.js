const prompts = {
  learn:
`Bạn là gia sư kiên nhẫn. Mình đang học [môn/chủ đề].
Mình đã hiểu: [ghi 2-3 ý].
Mình đang kẹt ở: [ghi chỗ chưa hiểu].
Hãy giải thích bằng ngôn ngữ dễ hiểu, dùng 1 ví dụ gần gũi, sau đó hỏi mình 3 câu để kiểm tra xem mình đã hiểu chưa. Đừng đưa đáp án cuối ngay nếu có bài tập.`,

  essay:
`Bạn là người phản biện bài viết, không viết hộ mình.
Đề bài: [dán đề].
Luận điểm ban đầu của mình: [ghi ý chính].
Dàn ý nháp: [dán dàn ý].
Hãy chỉ ra điểm mạnh, điểm yếu, chỗ thiếu bằng chứng và gợi ý cách cải thiện. Không viết thành bài hoàn chỉnh.`,

  check:
`Hãy kiểm tra bản nháp dưới đây theo 4 tiêu chí: đúng kiến thức, logic, diễn đạt, nguồn cần kiểm chứng.
Bản nháp: [dán bài của mình].
Trả lời bằng bảng gồm: vấn đề, vì sao cần sửa, gợi ý sửa. Nếu có thông tin có thể sai, hãy đánh dấu "cần kiểm chứng" thay vì khẳng định chắc chắn.`,

  quiz:
`Bạn là người tạo bài luyện tập. Hãy tạo 8 câu hỏi trắc nghiệm về [chủ đề].
Yêu cầu:
- Có 4 lựa chọn A, B, C, D.
- Không đưa đáp án ngay.
- Sau khi mình trả lời, hãy chấm điểm, giải thích từng câu và gợi ý phần cần ôn lại.`
};

const promptText = document.querySelector("#promptText");
const tabs = document.querySelectorAll(".tab");

function setPrompt(type) {
  promptText.textContent = prompts[type];

  tabs.forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.prompt === type);
  });
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    setPrompt(tab.dataset.prompt);
  });
});

setPrompt("learn");

const usageForm = document.querySelector("#usageForm");
const resultCard = document.querySelector("#resultCard");
const resultTitle = document.querySelector("#resultTitle");
const resultText = document.querySelector("#resultText");
const resultBar = document.querySelector("#resultBar");

usageForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const answers = new FormData(usageForm);
  const totalQuestions = 6;

  if ([...answers.keys()].length < totalQuestions) {
    resultCard.hidden = false;
    resultTitle.textContent = "Bạn chưa trả lời đủ câu hỏi";
    resultText.textContent = "Hãy hoàn thành cả 6 câu để nhận kết quả chính xác hơn.";
    resultBar.style.width = "0%";
    resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  let score = 0;

  for (const value of answers.values()) {
    score += Number(value);
  }

  const percent = Math.round((score / 12) * 100);

  let title = "";
  let text = "";

  if (score >= 10) {
    title = "Bạn đang dùng AI khá hợp lí";
    text = "Bạn biết tự làm trước, kiểm chứng thông tin và dùng AI như công cụ hỗ trợ. Hãy tiếp tục giữ thói quen tự viết lại bằng suy nghĩ của mình.";
  } else if (score >= 6) {
    title = "Bạn dùng AI ở mức cần điều chỉnh";
    text = "Bạn đã có vài thói quen tốt, nhưng vẫn nên kiểm chứng nguồn thường xuyên hơn và tránh để AI làm thay phần suy nghĩ quan trọng.";
  } else {
    title = "Bạn đang có dấu hiệu phụ thuộc vào AI";
    text = "Hãy bắt đầu bằng việc tự thử làm trước 10-15 phút, chỉ hỏi AI để gợi ý hoặc giải thích, và không nộp nguyên văn câu trả lời của AI.";
  }

  resultCard.hidden = false;
  resultTitle.textContent = title;
  resultText.textContent = `Điểm của bạn: ${score}/12. ${text}`;
  resultBar.style.width = `${percent}%`;
  resultCard.scrollIntoView({ behavior: "smooth", block: "center" });
});