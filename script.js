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
Trả lời bằng bảng gồm: vấn đề, vì sao cần sửa, gợi ý sửa. Nếu có thông tin có thể sai, hãy đánh dấu "cần kiểm chứng" thay vì khẳng định chắc chắn.`
};

function showPrompt(type, button) {
  document.getElementById("promptText").textContent = prompts[type];

  const buttons = document.querySelectorAll(".prompt-buttons button");

  buttons.forEach(function(item) {
    item.classList.remove("active");
  });

  button.classList.add("active");
}

document.getElementById("promptText").textContent = prompts.learn;