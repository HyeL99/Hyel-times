let news = [];
let url = "";
let page = "1";
let total_pages = "1";
let searchItem = "";
let menus = document.querySelectorAll(".menus button");
let searchButton = document.getElementById("search-button");
let searchInput = document.getElementById("search-input");
let inputButton = document.getElementById("input-button");
let icon = document.getElementById("icon");
let inputArea = document.getElementById("input-area");
let clickStatus = false;

const apiKey = "oNt2gl4utbTl2L65TZ7Jhsgt_qi_fogSnhqKzjydU0U";

menus.forEach((item) =>
  item.addEventListener("click", (event) => getNewsByTopic(event))
);

let iconClicked = () => {
  if (inputArea.style.display == "none") {
    inputArea.style.display = "block";
  } else {
    inputArea.style.display = "none";
  }
};

function enterkey() {
  if (window.event.keyCode == 13) {
    searchNews();
  }
}

const callAPI = async () => {
  try {
    let header = new Headers({ "x-api-key": apiKey });
    url.searchParams.set("page", page);
    let response = await fetch(url, { headers: header });
    let data = await response.json();
    if (response.status == 200) {
      if (data.total_hits == 0) {
        throw new Error("검색된 결과값이 없습니다");
      }
      news = data.articles;
      total_pages = data.total_pages;
      page = data.page;

      render();
      pagination();
    } else {
      throw new Error(data, message);
    }
  } catch (error) {
    errorRender(error.message);
  }
};

const errorRender = (message) => {
  let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    <div>${message}</div>
  </div>`;
  document.getElementById("news-board").innerHTML = errorHTML;
};

const getLatestNews = async () => {
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10`
  );
  callAPI();
};

const getNewsByTopic = async (event) => {
  page = 1;
  let topic = event.target.textContent.toLowerCase();
  url = new URL(
    `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=${topic}&page_size=10`
  );
  callAPI();
};

const searchNews = async () => {
  searchItem = searchInput.value;
  searchInput.value = "";
  url = new URL(
    `https://api.newscatcherapi.com/v2/search?q=${searchItem}&countries=KR&page_size=10`
  );
  callAPI();
};

const render = () => {
  let newsHTML = "";
  newsHTML = news
    .map((item) => {
      return `<div class="row news-item pt-3 pb-3 text-center">
        <div class="col-lg-4"><img src="${item.media}"/></div>
        <div class="col-lg-8">
            <h2>${item.title}</h2>
            <p>${item.summary}</p>
            <div>${item.rights} * ${item.published_date}</div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-board").innerHTML = newsHTML;
};

const pagination = () => {
  let paginationHTML = ``;
  let pageGroup = Math.ceil(page / 5);
  let last = pageGroup * 5;
  let first = last - 4;

  if (total_pages - page < total_pages % 5) {
    last = total_pages;
  }

  if (page > 1) {
    paginationHTML = `<li class="page-item" onclick="moveToPage(1)">
    <a class="page-link" href='#js-bottom'>&lt;&lt;</a>
  </li>
  <li class="page-item" onclick="moveToPage(${page - 1})">
    <a class="page-link" href='#js-bottom'>&lt;</a>
  </li>`;
  }

  for (let i = first; i <= last; i++) {
    paginationHTML += `<li class="page-item ${i == page ? "active" : ""}" >
    <a class="page-link" href="#js-bottom" onclick="moveToPage(${i})">${i}</a>
   </li>`;
  }

  if (page < total_pages) {
    paginationHTML += `<li class="page-item" onclick="moveToPage(${page + 1})">
    <a  class="page-link" href='#js-program-detail-bottom'>&gt;</a>
   </li>
   <li class="page-item" onclick="moveToPage(${total_pages})">
    <a class="page-link" href='#js-bottom'>&gt;&gt;</a>
   </li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

function moveToPage(pageNum) {
  page = pageNum;
  window.scrollTo({ top: 0, behavior: "smooth" });
  callAPI();
}

getLatestNews();
searchButton.addEventListener("click", searchNews);
inputButton.addEventListener("click", iconClicked);