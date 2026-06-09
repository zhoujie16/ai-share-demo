const STORAGE_KEY = "campingCommunityPosts";
const DEFAULT_COVER = "assets/camp-lakeside.png";

const seedPosts = [
  {
    id: "seed-lakeside-morning",
    title: "湖边清晨扎营，雾气像一层薄纱",
    body: "天刚亮的时候湖面还没有风，帐篷边的芦苇挂着露水。这个点最适合煮一壶咖啡，听水鸟叫几声，再慢慢收拾早餐。湖边湿气重，防潮垫和干燥袋一定要带。",
    images: ["assets/camp-lakeside.png"],
    createdAt: Date.now() - 1000 * 60 * 28,
    likes: 24,
    comments: [
      {
        id: "comment-seed-1",
        nickname: "山野游客",
        content: "这种清晨湖边真的太治愈了，想立刻出发。",
        createdAt: Date.now() - 1000 * 60 * 12
      }
    ]
  },
  {
    id: "seed-forest-kitchen",
    title: "雨后林地厨房，热茶是最好的装备",
    body: "小雨停下以后，松针味特别明显。天幕下面只摆了一张桌子、炉具和水壶，动线简单反而更舒服。雨后地面偏软，桌脚最好垫一下，东西也别直接放地上。",
    images: ["assets/camp-kitchen.png"],
    createdAt: Date.now() - 1000 * 60 * 76,
    likes: 17,
    comments: [
      {
        id: "comment-seed-2",
        nickname: "松针味",
        content: "雨后露营的味道确实很特别，装备少一点更轻松。",
        createdAt: Date.now() - 1000 * 60 * 36
      }
    ]
  },
  {
    id: "seed-meadow-evening",
    title: "山地草甸傍晚，帐篷旁边全是风",
    body: "营地在草甸边缘，视野很开阔，傍晚云层压过山脊的时候特别好看。这里风比林地大很多，搭帐篷时要把风绳全部拉好，夜里温差也明显。",
    images: ["assets/camp-meadow.png"],
    createdAt: Date.now() - 1000 * 60 * 142,
    likes: 21,
    comments: []
  },
  {
    id: "seed-creek-valley",
    title: "溪谷边的午后，水声盖过了所有噪音",
    body: "溪水很浅，石头也平，午后坐在树荫里几乎不想说话。这个位置适合轻徒步后短暂停留，记得把帐篷扎在安全水位线外，晚上不要离溪流太近。",
    images: ["assets/camp-creek.png"],
    createdAt: Date.now() - 1000 * 60 * 210,
    likes: 13,
    comments: [
      {
        id: "comment-seed-3",
        nickname: "溪边坐坐",
        content: "水位线提醒很有用，很多新手容易忽略。",
        createdAt: Date.now() - 1000 * 60 * 95
      }
    ]
  },
  {
    id: "seed-starlight-fire",
    title: "蓝调时刻点起营火，夜色刚刚好",
    body: "天完全黑下来之前，树林里还有一点蓝色。营火只需要小小一堆，照亮桌椅就够了。离开前一定要确认余烬彻底熄灭，安全比氛围重要。",
    images: ["assets/camp-starlight.png"],
    createdAt: Date.now() - 1000 * 60 * 318,
    likes: 29,
    comments: []
  },
  {
    id: "seed-autumn-car-camp",
    title: "秋天车边露营，收纳顺手就很幸福",
    body: "车停在林间土路旁，后备箱打开就是临时操作台。秋天落叶多，拍照很好看，但炉具周围要保持干净，风大时也要避开枯叶堆。",
    images: ["assets/camp-autumn-car.png"],
    createdAt: Date.now() - 1000 * 60 * 430,
    likes: 16,
    comments: []
  }
];

const page = document.body.dataset.page;

function loadPosts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const posts = mergeSeedPosts(JSON.parse(saved));
    savePosts(posts);
    return posts;
  }
  savePosts(seedPosts);
  return seedPosts;
}

function mergeSeedPosts(posts) {
  const seedIds = new Set(seedPosts.map((post) => post.id));
  const legacySeedIds = new Set(["seed-forest-river", "seed-morning"]);
  const legacySeedMap = {
    "seed-lakeside-morning": "seed-forest-river",
    "seed-forest-kitchen": "seed-morning"
  };
  const userPosts = posts.filter((post) => !seedIds.has(post.id) && !legacySeedIds.has(post.id));
  const existingById = new Map(posts.map((post) => [post.id, post]));

  const refreshedSeeds = seedPosts.map((seed) => {
    const existing = existingById.get(seed.id) || existingById.get(legacySeedMap[seed.id]);
    return existing
      ? { ...seed, createdAt: existing.createdAt, likes: existing.likes, comments: existing.comments }
      : seed;
  });

  return [...refreshedSeeds, ...userPosts];
}

function savePosts(posts) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
}

function findPost(id) {
  return loadPosts().find((post) => post.id === id);
}

function updatePost(updatedPost) {
  const posts = loadPosts().map((post) => post.id === updatedPost.id ? updatedPost : post);
  savePosts(posts);
}

function formatTime(time) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  }).format(new Date(time));
}

function escapeHtml(text) {
  return String(text)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function excerpt(text, max = 86) {
  const compact = text.replace(/\s+/g, " ").trim();
  return compact.length > max ? `${compact.slice(0, max)}...` : compact;
}

function renderHome() {
  const posts = loadPosts().sort((a, b) => b.createdAt - a.createdAt);
  const list = document.querySelector("#postList");
  const count = document.querySelector("#postCount");
  count.textContent = `${posts.length} 篇帖子`;

  if (!posts.length) {
    list.innerHTML = '<div class="empty-state">还没有帖子，去发布第一篇露营笔记吧。</div>';
    return;
  }

  list.innerHTML = posts.map((post) => `
    <a class="post-card" href="detail.html?id=${encodeURIComponent(post.id)}">
      <img class="card-cover" src="${post.images[0] || DEFAULT_COVER}" alt="${escapeHtml(post.title)}">
      <div class="card-body">
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(excerpt(post.body))}</p>
        <div class="meta-row">
          <span>${formatTime(post.createdAt)}</span>
          <span class="metric-group">
            <span>${post.likes} 赞</span>
            <span>${post.comments.length} 评</span>
          </span>
        </div>
      </div>
    </a>
  `).join("");
}

function renderPreview(files) {
  const preview = document.querySelector("#imagePreview");
  preview.innerHTML = "";
  [...files].forEach((file) => {
    const img = document.createElement("img");
    img.src = URL.createObjectURL(file);
    img.alt = file.name;
    img.onload = () => URL.revokeObjectURL(img.src);
    preview.appendChild(img);
  });
}

function imageFileToDataUrl(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const maxSide = 1400;
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.84));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}

function bindPostForm() {
  const form = document.querySelector("#postForm");
  const imageInput = document.querySelector("#imageInput");
  const hint = document.querySelector("#formHint");

  imageInput.addEventListener("change", () => renderPreview(imageInput.files));

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    const title = document.querySelector("#titleInput").value.trim();
    const body = document.querySelector("#bodyInput").value.trim();
    if (!title || !body) return;

    hint.textContent = "正在保存图片...";
    const images = await Promise.all([...imageInput.files].map(imageFileToDataUrl));
    const post = {
      id: `post-${Date.now()}`,
      title,
      body,
      images: images.length ? images : [DEFAULT_COVER],
      createdAt: Date.now(),
      likes: 0,
      comments: []
    };

    const posts = loadPosts();
    posts.push(post);
    savePosts(posts);
    window.location.href = `detail.html?id=${encodeURIComponent(post.id)}`;
  });
}

function getCurrentPost() {
  const id = new URLSearchParams(window.location.search).get("id");
  return id ? findPost(id) : null;
}

function renderDetail() {
  const post = getCurrentPost();
  const detail = document.querySelector("#postDetail");
  if (!post) {
    detail.innerHTML = `
      <h1>没有找到这篇帖子</h1>
      <p class="detail-body">它可能已经被浏览器本地数据清空了。</p>
      <a class="primary-action" href="index.html">返回首页</a>
    `;
    document.querySelector(".comment-panel").style.display = "none";
    return;
  }

  document.title = `${post.title} - 林间营地`;
  detail.innerHTML = `
    <div class="detail-meta">
      <span>${formatTime(post.createdAt)}</span>
      <button id="likeButton" class="like-button" type="button">喜欢 ${post.likes}</button>
    </div>
    <h1>${escapeHtml(post.title)}</h1>
    <p class="detail-body">${escapeHtml(post.body)}</p>
    <div class="detail-gallery">
      ${post.images.map((src, index) => `
        <img src="${src}" alt="${escapeHtml(post.title)} 图片 ${index + 1}">
      `).join("")}
    </div>
  `;

  document.querySelector("#likeButton").addEventListener("click", () => {
    post.likes += 1;
    updatePost(post);
    renderDetail();
    renderComments(post);
  });

  bindCommentForm(post);
  renderComments(post);
}

function bindCommentForm(post) {
  const form = document.querySelector("#commentForm");
  form.onsubmit = (event) => {
    event.preventDefault();
    const nicknameInput = document.querySelector("#nicknameInput");
    const commentInput = document.querySelector("#commentInput");
    const nickname = nicknameInput.value.trim();
    const content = commentInput.value.trim();
    if (!nickname || !content) return;

    post.comments.push({
      id: `comment-${Date.now()}`,
      nickname,
      content,
      createdAt: Date.now()
    });
    updatePost(post);
    commentInput.value = "";
    renderComments(post);
  };
}

function renderComments(post) {
  const count = document.querySelector("#commentCount");
  const list = document.querySelector("#commentList");
  count.textContent = `${post.comments.length} 条评论`;

  if (!post.comments.length) {
    list.innerHTML = '<div class="empty-state">还没有评论，来坐下聊两句。</div>';
    return;
  }

  list.innerHTML = post.comments
    .slice()
    .sort((a, b) => a.createdAt - b.createdAt)
    .map((comment) => `
      <div class="comment-item">
        <div class="comment-head">
          <strong>${escapeHtml(comment.nickname)}</strong>
          <span>${formatTime(comment.createdAt)}</span>
        </div>
        <p>${escapeHtml(comment.content)}</p>
      </div>
    `).join("");
}

if (page === "home") renderHome();
if (page === "post") bindPostForm();
if (page === "detail") renderDetail();
