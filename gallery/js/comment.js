// Builds the comment list the way the board's own comment script does: it reads the comment
// data (here an inline JSON block instead of a server response), turns it into
// .comment_box > ul.cmt_list.add > li#comment_li_N (replies in li > .reply.show > .reply_box >
// ul.reply_list), appends it after the count bar and opens the wrap with class "show".
(function () {
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }

  // nickname markup: a non-member shows "nick(ip)", a fixed nickname shows its badge box
  function gallogIcon(c) {
    if (c.user_id) {
      return "<span class='nickname in' title='" + escapeHtml(c.name) + "'><em>" + escapeHtml(c.name) +
        "</em></span><a class='writer_nikcon'></a>";
    }
    return '<span class="nickname"><em title="' + escapeHtml(c.name) + '">' + escapeHtml(c.name) +
      '</em><span class="ip">(' + escapeHtml(c.ip) + ")</span></span>";
  }

  function writer(c) {
    return '<div class="cmt_nickbox"><span class="gall_writer ub-writer" data-nick="' + escapeHtml(c.name) +
      '" data-uid="' + escapeHtml(c.user_id) + '" data-ip="' + escapeHtml(c.ip) + '">' + gallogIcon(c) + "</span></div>";
  }

  function memo(c) {
    return '<p class="usertxt ub-word">' + escapeHtml(c.memo).replace(/(?:\r\n|\r|\n)/g, "<br>") + "</p>";
  }

  function getCommentListHtml(data, articleNo) {
    var comments = data.comments;
    var html = '<ul class="cmt_list add">';
    var commentOpen = false;
    var replyOpen = false;
    var curCNo = null;
    for (var key = 0; key < comments.length; key++) {
      var c = comments[key];
      var next = comments[key + 1];
      if (c.depth === 0) {
        commentOpen = true;
        html += '<li id="comment_li_' + c.no + '" class="ub-content">';
        html += '<div class="cmt_info clear" data-no="' + c.no + '" data-rcnt="' + c.rcnt + '" data-article-no="' + articleNo + '">';
        html += '<div class="addbox">' + writer(c);
        html += '<div class="clear cmt_txtbox btn_reply_write_all">' + memo(c) + "</div></div>";
        html += '<div class="fr clear"><span class="date_time">' + c.reg_date + "</span>";
        html += '<div class="cmt_mdf_del" data-type="cmt" re_no="' + c.no + '" data-article-no="' + articleNo + '">';
        if (c.del_btn === "Y") html += '<button type="button" class="btn_cmt_delete">삭제</button>';
        html += "</div></div>";
        html += "</div>";
        if (commentOpen && (!next || !next.c_no)) {
          html += "</li>";
          commentOpen = false;
        }
      } else {
        if (!replyOpen && curCNo !== c.c_no) {
          replyOpen = true;
          html += '<li><div class="reply show"><div class="reply_box">';
          html += '<ul class="reply_list" id="reply_list_' + c.c_no + '" p-no="' + c.c_no + '">';
          curCNo = c.c_no;
        }
        html += '<li id="reply_li_' + c.no + '" class="ub-content" data-rcnt="' + c.rcnt + '">';
        html += '<div class="reply_info clear" data-no="' + c.no + '">';
        html += '<div class="addbox">' + writer(c);
        html += '<div class="clear cmt_txtbox btn_re_reply_write_all">' + memo(c) + "</div></div>";
        html += '<div class="fr clear"><span class="date_time">' + c.reg_date + "</span>";
        if (c.del_btn === "Y") {
          html += '<div class="cmt_mdf_del" data-type="rep" re_no="' + c.no + '" data-article-no="' + articleNo + '">';
          html += '<button type="button" class="btn_cmt_delete">삭제</button></div>';
        }
        html += "</div></div></li>";
        if (replyOpen && (!next || !next.c_no)) {
          html += "</ul></div></div></li>";
          replyOpen = false;
          curCNo = null;
        }
      }
    }
    html += "</ul>";
    return html;
  }

  function viewComments() {
    var source = document.getElementById("comment_data");
    if (!source) return;
    var data = JSON.parse(source.textContent);
    var no = data.article_no;
    var wrap = document.getElementById("comment_wrap_" + no);
    if (!wrap) return;
    document.getElementById("comment_total_" + no).textContent = data.total_cnt;
    var box = '<div class="comment_box">' + getCommentListHtml(data, no);
    box += '<div class="bottom_paging_box iconpaging">';
    box += '<div class="cmt_paging">' + data.pagination + "</div>";
    box += '<div class="cmt_inner"><a href="#container" class="contgo">본문 보기</a>';
    box += '<button type="button" class="btn_cmt_close" data-no="' + no + '" data-loc="BTM"><span>댓글닫기</span><em class="sp_img icon_cmt_more"></em></button>';
    box += '<button type="button" class="btn_cmt_refresh" data-no="' + no + '" data-loc="BTM">새로고침</button></div>';
    box += "</div></div>";
    var old = wrap.querySelector(".comment_box");
    if (old) old.remove();
    wrap.insertAdjacentHTML("beforeend", box);
    wrap.classList.add("show");
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", viewComments);
  else viewComments();
})();
