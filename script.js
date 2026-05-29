
import { db } from "./firebase.js";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", function () {
  const prompts = {
    learn:
`Hãy trở thành gia sư và dạy mình, đang học [môn/chủ đề].
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
  const promptTabs = document.querySelectorAll(".prompt-tabs .tab");

  function setPrompt(type) {
    if (!promptText) return;

    promptText.textContent = prompts[type];

    promptTabs.forEach(function (tab) {
      tab.classList.toggle("active", tab.dataset.prompt === type);
    });
  }

  promptTabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      setPrompt(tab.dataset.prompt);
    });
  });

  setPrompt("learn");

  const usageForm = document.querySelector("#usageForm");
  const resultCard = document.querySelector("#resultCard");
  const resultTitle = document.querySelector("#resultTitle");
  const resultText = document.querySelector("#resultText");
  const resultBar = document.querySelector("#resultBar");

  if (usageForm) {
    usageForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const answers = new FormData(usageForm);
      const totalQuestions = 6;

      if ([...answers.keys()].length < totalQuestions) {
        resultCard.hidden = false;
        resultTitle.textContent = "Bạn chưa trả lời đủ câu hỏi";
        resultText.textContent = "Hãy hoàn thành cả 6 câu để nhận kết quả chính xác hơn.";
        resultBar.style.width = "0%";
        return;
      }

      let score = 0;

      for (const value of answers.values()) {
        score += Number(value);
      }

      const percent = Math.round((score / 6) * 100);

      let title = "";
      let text = "";

      if (score >= 6) {
        title = "Bạn đang dùng AI khá hợp lí";
        text = "Bạn biết tự làm trước, kiểm chứng thông tin và dùng AI như công cụ hỗ trợ.";
      } else if (score >= 3) {
        title = "Bạn dùng AI ở mức cần điều chỉnh";
        text = "Bạn nên kiểm chứng nguồn thường xuyên hơn và tránh để AI làm thay phần suy nghĩ quan trọng.";
      } else {
        title = "Bạn đang có dấu hiệu phụ thuộc vào AI";
        text = "Hãy tự thử làm trước 10-15 phút, chỉ hỏi AI để gợi ý hoặc giải thích.";
      }

      resultCard.hidden = false;
      resultTitle.textContent = title;
      resultText.textContent = `Dữ liệu đánh giá của bạn: ${score}/6. ${text}`;
      resultBar.style.width = `${percent}%`;
    });
  }

  setupReviewSection();
});

function setupReviewSection() {
  const reviewForm = document.querySelector("#reviewForm");
  const reviewName = document.querySelector("#reviewName");
  const reviewComment = document.querySelector("#reviewComment");
  const starButtons = document.querySelectorAll(".star-rating button");
  const commentList = document.querySelector("#commentList");
  const averageRating = document.querySelector("#averageRating");
  const reviewCount = document.querySelector("#reviewCount");

  if (!reviewForm) return;

  let selectedStars = 0;
  let reviews = [];
  const reviewsCollection = collection(db, "websiteReviews");
  const reviewsQuery = query(reviewsCollection, orderBy("createdAt", "desc"));

  starButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      selectedStars = Number(button.dataset.star);

      starButtons.forEach(function (star) {
        const starValue = Number(star.dataset.star);
        star.classList.toggle("active", starValue <= selectedStars);
      });
    });
  });

  function renderReviews() {
    commentList.innerHTML = "";

    if (reviews.length === 0) {
      commentList.innerHTML = `<p class="empty-comment">Chưa có bình luận. Hãy là người đầu tiên đánh giá.</p>`;
      averageRating.textContent = "0.0";
      reviewCount.textContent = "Chưa có đánh giá nào";
      return;
    }

    const total = reviews.reduce(function (sum, review) {
      return sum + review.stars;
    }, 0);

    const average = total / reviews.length;

    averageRating.textContent = average.toFixed(1);
    reviewCount.textContent = reviews.length + " đánh giá";

    reviews.forEach(function (review) {
      const card = document.createElement("article");
      card.className = "comment-card";

      const name = document.createElement("strong");
      name.textContent = review.name || "Người học ẩn danh";

      const stars = document.createElement("div");
      stars.className = "comment-stars";
      stars.textContent = "★".repeat(review.stars) + "☆".repeat(5 - review.stars);

      const comment = document.createElement("p");
      comment.textContent = review.comment || "Không có bình luận.";

      card.append(name, stars, comment);

      commentList.appendChild(card);
    });
  }

  reviewForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (selectedStars === 0) {
      alert("Bạn hãy chọn số sao trước khi gửi đánh giá.");
      return;
    }

    const newReview = {
      name: reviewName.value.trim(),
      stars: selectedStars,
      comment: reviewComment.value.trim(),
      createdAt: serverTimestamp()
    };

    addDoc(reviewsCollection, newReview)
      .then(function () {
        reviewForm.reset();
        selectedStars = 0;

        starButtons.forEach(function (star) {
          star.classList.remove("active");
        });
      })
      .catch(function (error) {
        console.error("Không gửi được đánh giá:", error);
        alert("Không gửi được đánh giá. Hãy kiểm tra lại kết nối hoặc quyền Firestore.");
      });
  });

  onSnapshot(reviewsQuery, function (snapshot) {
    reviews = snapshot.docs.map(function (doc) {
      return doc.data();
    });
    renderReviews();
  }, function (error) {
    console.error("Không tải được đánh giá:", error);
    commentList.innerHTML = `<p class="empty-comment">Không tải được bình luận. Hãy kiểm tra cấu hình Firestore.</p>`;
  });
}
