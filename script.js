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
function setupReviewSection() {
  const reviewForm = document.querySelector("#reviewForm");
  const reviewName = document.querySelector("#reviewName");
  const reviewComment = document.querySelector("#reviewComment");
  const starButtons = document.querySelectorAll(".star-rating button");
  const commentList = document.querySelector("#commentList");
  const averageRating = document.querySelector("#averageRating");
  const reviewCount = document.querySelector("#reviewCount");

  if (!reviewForm || !reviewName || !reviewComment || !commentList) {
    return;
  }

  let selectedStars = 0;
  let reviews = JSON.parse(localStorage.getItem("websiteReviews")) || [];

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
      commentList.innerHTML = `
        <p class="empty-comment">Chưa có bình luận. Hãy là người đầu tiên đánh giá.</p>
      `;
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

    reviews.slice().reverse().forEach(function (review) {
      const card = document.createElement("article");
      card.className = "comment-card";

      card.innerHTML = `
        <strong>${review.name}</strong>
        <div class="comment-stars">
          ${"★".repeat(review.stars)}${"☆".repeat(5 - review.stars)}
        </div>
        <p>${review.comment}</p>
      `;

      commentList.appendChild(card);
    });
  }

  reviewForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (selectedStars === 0) {
      alert("Bạn hãy chọn số sao trước khi gửi đánh giá.");
      return;
    }

    const nameValue = reviewName.value.trim();
    const commentValue = reviewComment.value.trim();

    if (nameValue === "" || commentValue === "") {
      alert("Bạn hãy nhập tên và bình luận trước khi gửi.");
      return;
    }

    const newReview = {
      name: nameValue,
      stars: selectedStars,
      comment: commentValue
    };

    reviews.push(newReview);
    localStorage.setItem("websiteReviews", JSON.stringify(reviews));

    reviewForm.reset();
    selectedStars = 0;

    starButtons.forEach(function (star) {
      star.classList.remove("active");
    });

    renderReviews();
  });

  renderReviews();
}

setupReviewSection();