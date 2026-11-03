/* Parts of the post page that the blog fills by script: floating bars, like button,
   comment list, "category posts" list and the widgets below the post. Demo data only. */
(function () {
  "use strict";

  var LOG_NO = "224460210384";
  var DATA = {
    likes: 27,
    comments: [
      { nick: "주말엔커피", text: "시계 두 개 얘기 공감돼요 ㅎㅎ 찾아볼수록 더 헷갈릴 때가 있더라고요.", date: "2026. 10. 24. 22:15", color: "#cfe0d8" },
      { nick: "숫자산책", text: "1로 시작하는 숫자가 제일 많다는 건 처음 알았어요. 그래프로 보니 바로 이해되네요!", date: "2026. 10. 25. 08:41", color: "#e6d9c8" },
      { nick: "달빛고양이", text: "카드뉴스 다음 편도 기다릴게요~", date: "2026. 10. 25. 13:07", color: "#d6dcea" }
    ],
    categoryPosts: [
      { title: "알아 두면 쓸모 있는 법칙 3가지", date: "2026. 10. 24.", read: 3, on: true, thumb: "static/img/card-first-digit.svg" },
      { title: "그래프 볼 때 세로축부터 확인하는 이유", date: "2026. 10. 17.", read: 5 },
      { title: "평균과 중앙값, 뉴스에서는 어떻게 다를까", date: "2026. 10. 10.", read: 2 },
      { title: "확률을 헷갈리게 만드는 착각 4가지", date: "2026. 10. 3.", read: 4 },
      { title: "물가 지수 카드 한 장으로 읽기", date: "2026. 9. 26.", read: 1 }
    ],
    categories: [
      { name: "카드뉴스", count: 21, selected: true },
      { name: "경제 상식", count: 15 },
      { name: "데이터 읽기", count: 12 }
    ],
    neighbours: [
      { nick: "주말엔커피", color: "#cfe0d8" },
      { nick: "숫자산책", color: "#e6d9c8" },
      { nick: "달빛고양이", color: "#d6dcea" },
      { nick: "오늘의차트", color: "#e9d6d6" },
      { nick: "느린경제", color: "#dfe7cf" },
      { nick: "책읽는곰", color: "#e3dcef" }
    ],
    today: 37,
    total: "18,204"
  };

  function $(id) { return document.getElementById(id); }
  function html(el, s) { if (el) el.innerHTML = s; }

  // ---- like buttons (bottom of the post and the floating bar)
  var liked = false;
  function renderLikes() {
    var buttons = document.querySelectorAll(".u_likeit_button._face");
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle("on", liked);
      buttons[i].classList.toggle("off", !liked);
      buttons[i].setAttribute("aria-pressed", String(liked));
      var num = buttons[i].querySelector("._count");
      if (num) num.textContent = String(DATA.likes + (liked ? 1 : 0));
    }
  }
  document.addEventListener("click", function (e) {
    var b = e.target.closest ? e.target.closest(".u_likeit_button._face") : null;
    if (!b) return;
    e.preventDefault();
    liked = !liked;
    renderLikes();
  });

  // ---- comments (opened from the 댓글 button, as on the real page)
  var ct = $("postComment_201_" + LOG_NO + "_ct");
  var listBox = $("postComment_201_" + LOG_NO);
  var rendered = false;
  function renderComments() {
    var items = DATA.comments.map(function (c) {
      return '<li class="u_cbox_comment"><div class="u_cbox_comment_box">' +
        '<span class="u_cbox_thumb" style="background:' + c.color + '"></span>' +
        '<div class="u_cbox_area"><div class="u_cbox_info"><span class="u_cbox_info_main"><span class="u_cbox_name"><span class="u_cbox_nick">' + c.nick + '</span></span></span></div>' +
        '<div class="u_cbox_text_wrap"><span class="u_cbox_contents">' + c.text + '</span></div>' +
        '<div class="u_cbox_info_base"><span class="u_cbox_date">' + c.date + '</span><a href="#" class="u_cbox_btn_reply">답글</a></div></div></div></li>';
    }).join("");
    html(listBox, '<ul class="u_cbox_list">' + items + '</ul>' +
      '<div class="u_cbox_write_wrap"><span class="u_cbox_btn_upload">등록</span>댓글을 입력해 주세요.</div>');
    rendered = true;
  }
  function toggleComments(open) {
    if (!ct) return;
    var show = typeof open === "boolean" ? open : ct.style.display === "none";
    if (show && !rendered) renderComments();
    ct.style.display = show ? "block" : "none";
    var area = document.querySelector("#post_1 .area_comment");
    if (area) area.classList.toggle("open", show);
  }
  var cmtBtn = $("Comi" + LOG_NO);
  if (cmtBtn) cmtBtn.addEventListener("click", function (e) { e.preventDefault(); toggleComments(); });
  var floatCmt = $("btn_comment_2");
  if (floatCmt) floatCmt.addEventListener("click", function (e) {
    e.preventDefault();
    toggleComments(true);
    if (ct) ct.scrollIntoView({ block: "start", behavior: "smooth" });
  });
  var counts = document.querySelectorAll("._commentCount");
  for (var k = 0; k < counts.length; k++) counts[k].textContent = String(DATA.comments.length);

  // ---- "..." menu in the title block
  var menuBtn = document.querySelector("._open_overflowmenu");
  var menu = $("overflowmenu-" + LOG_NO);
  if (menuBtn && menu) {
    menuBtn.addEventListener("click", function (e) { e.preventDefault(); e.stopPropagation(); menu.classList.toggle("on"); });
    document.addEventListener("click", function () { menu.classList.remove("on"); });
  }
  var anchors = document.querySelectorAll('a[href="#"]');
  for (var a = 0; a < anchors.length; a++) {
    anchors[a].addEventListener("click", function (e) { e.preventDefault(); });
  }

  // ---- this category's other posts
  html($("postBottomThumbnailTitleListBody"), DATA.categoryPosts.map(function (p) {
    var thumb = p.thumb ? '<img src="' + p.thumb + '" class="thumb" alt="" style="object-fit:cover;object-position:0 50%">' : "";
    return '<li class="item' + (p.on ? " on" : "") + '"><a href="#" class="link pcol2">' + thumb +
      '<div class="desc"><strong class="title">' + p.title + '</strong>' +
      '<span class="info"><span class="date">' + p.date + '</span></span>' +
      '<span class="read">댓글 ' + p.read + '</span></div>' +
      '<i class="aline"></i></a></li>';
  }).join(""));
  html($("postBottomThumbnailTitleListNavigation"), '<strong class="pcol2">1</strong><a href="#" class="pcol2">2</a><a href="#" class="pcol2">3</a><a href="#" class="pcol2">4</a><a href="#" class="pcol2">5</a>');

  // ---- widgets below the post
  html($("blog-profile"),
    '<div class="border"><div class="bg-head"></div><div class="bg-body"><h3>프로필</h3><div class="con">' +
    '<div class="image"><span class="profile_img"></span></div>' +
    '<div class="name"><a href="#" class="col nick">데이터지기</a> <span class="id col">(datanote_jigi)</span></div>' +
    '<p class="caption col">생활 속 숫자 이야기를 카드뉴스로 정리해요. 경제 상식과 데이터 읽는 법을 나눕니다.</p>' +
    '<div class="more col"><a href="#">프로필</a><span class="sep">|</span><a href="#">쪽지</a><br><a href="#" class="btn_neighbor">+ 이웃추가</a></div>' +
    '</div></div><div class="bg-footer"></div></div>');

  var cats = DATA.categories.map(function (c) {
    return '<li class="' + (c.selected ? "selectedview" : "") + '"><span class="listimage"></span><a href="#" class="itemfont">' + c.name + '</a> <span class="num cm-col1">(' + c.count + ')</span></li>';
  }).join("");
  var all = DATA.categories.reduce(function (s, c) { return s + c.count; }, 0);
  html($("blog-category"),
    '<div class="cm-border"><div class="cm-head"><h3 class="cm-icol itemfont">카테고리</h3></div><div class="cm-body"><ul>' +
    '<li class="allview"><a href="#" class="itemfont">전체보기</a> <span class="num cm-col1">(' + all + ')</span></li>' + cats +
    '</ul></div><div class="cm-footer"></div></div>');

  html($("blog-recent-comment"),
    '<div class="cm-border"><div class="cm-head"><h3 class="cm-icol itemfont">최근 댓글</h3></div><div class="cm-body"><ul>' +
    DATA.comments.slice().reverse().map(function (c) {
      return '<li><a href="#" class="txt itemfont">' + c.text + '</a><span class="nick cm-col1">' + c.nick + '</span></li>';
    }).join("") + '</ul></div><div class="cm-footer"></div></div>');

  html($("blog-counter"),
    '<p class="today cnt1"><span class="lbl">TODAY</span>' + DATA.today + '</p><p class="total cnt2"><span class="lbl">TOTAL</span>' + DATA.total + '</p>');

  html($("blog_buddyconnect"),
    '<div class="cm-border"><div class="cm-head"><h3 class="cm-icol itemfont">이웃커넥트</h3></div><div class="cm-body"><ul class="buddy_list">' +
    DATA.neighbours.map(function (n) {
      return '<li><a href="#"><span class="ava" style="background:' + n.color + '"></span><span class="bnick">' + n.nick + '</span></a></li>';
    }).join("") + '</ul><p class="buddy_more">이웃 ' + DATA.neighbours.length + '명</p></div><div class="cm-footer"></div></div>');

  renderLikes();

  // ---- floating header (after the title area) and floating bottom bar (until the post's own buttons show)
  var header = $("floating_area_header");
  var bottom = $("floating_bottom");
  var topArea = $("top-area");
  var postBtn = document.querySelector("#post_1 .post-btn");
  function onScroll() {
    var y = window.pageYOffset || document.documentElement.scrollTop;
    var past = y > topArea.offsetTop + topArea.offsetHeight;
    header.classList.toggle("fade_in", past);
    var btnTop = postBtn ? postBtn.getBoundingClientRect().top : 0;
    bottom.classList.toggle("fade_in", past && btnTop > window.innerHeight - 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  onScroll();
  var topBtns = document.querySelectorAll(".btn_top");
  for (var t = 0; t < topBtns.length; t++) {
    topBtns[t].addEventListener("click", function (e) { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); });
  }
})();
