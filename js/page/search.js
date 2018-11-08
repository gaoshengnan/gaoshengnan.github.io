!function () {
    function t() {
        this.config = {
            minScore: 1e-5,
            minNum: 3,
            language: document.querySelector("html").getAttribute("lang")
        }, this.init()
    }

    t.prototype = {
        init: function () {
            this.container = document.getElementById("page-content"), this.loading = this.container.querySelector(".search__loader"), this.tpl = ['<h2 class="search__result-wrap">', "en" == this.config.language ? "Find <em>{{ num }}</em> {{ enDescription }} <em>{{ query }}</em>" : "找到匹配<em>{{ query }}</em>的结果<em>{{ num }}</em>条", "</h2>", '<div class="page__posts clearfix">', "{{ posts }}", "</div>"].join(""), this.articleTpl = ['<div class="page__post">', '<article itemscope itemtype="http://schema.org/Article" class="page__mini-article">', '<div class="mini-article__cover">', '<img itemprop="image" src="{{ cover }}" alt="{{ title }}"/>', '<div itemprop="datePublished" content="{{ date }}" class="mini-article__date">', '<span class="date__day">{{ day }}</span>', '<span class="date__month">{{ month }}</span>', "</div>", '<a itemprop="url" class="iconfont icon-enter" href="{{ url }}"></a>', "</div>", '<div class="mini-article__info">', '<h3 itemprop="name" class="mini-article__title">', '<a itemprop="url" href="{{ url }}" title="{{ title }}">{{ title }}</a>', "</h3>", '<p class="mini-article__author">by ', '<span itemprop="author" itemscope itemtype="http://schema.org/Person">', '<a itemprop="url" href="{{ authorLink }}" target="_blank">', '<span itemprop="name">{{ authorNick }}</span>', "</a>", "</span>", "</p>", '<p itemprop="articleSection" class="min-article__desc">', "{{ desc }}", "</p>", '<div class="min-article__tags">', '<i class="iconfont icon-tab"></i>', '<ul class="tags__list clearfix">', "{{ tagsHtml }}", "</ul>", "</div>", "</div>", "</article>", "</div>"].join(""), this.tagsTpl = '<li class="tags__item"><a href="{{ path }}">{{ name }}</a></li>', this.queryString = decodeURIComponent(location.search.split("=")[1]), this.getData()
        }, getData: function () {
            var e = this;
            axios.get("/assets/lunr/all.json").then(function (t) {
                return t.data
            }).then(function (t) {
                e.initSearch(t)
            })
        }, initSearch: function (t) {
            this.index = lunr.Index.load(t.index), this.sourceData = t.store, this.result = this.index.search(this.queryString), this.filteredData = this.filterSourceData(), this.render()
        }, compileTemplate: function (a, t) {
            var n = a.match(/\{\{\s(\S+)\s\}\}/g), s = [], r = "";

            function e(t) {
                for (var e = a, i = 0; i < n.length; i++) e = e.replace(/\{\{\s(\S+)\s\}\}/, t[s[i]]);
                r = e + r
            }

            for (var i = 0; i < n.length; i++) s.push(n[i].replace(/\{\{\s(\S+)\s\}\}/, "$1"));
            return "[object Array]" === Object.prototype.toString.apply(t) ? t.forEach(function (t) {
                e(t)
            }) : e(t), r
        }, render: function () {
            var t = this.filteredData, e = "",
                i = "en" == this.config.language ? "Sorry,the content of your search does not exist!" : "抱歉，您要的内容似乎没有哦，不如换个关键字试试吧。",
                a = this;
            console.log("this:" + JSON.stringify(this)), t.length && (this.filteredData = this.filteredData.map(function (t) {
                return t.tagsHtml = a.compileTemplate(a.tagsTpl, t.tagArr), t
            }), e = this.compileTemplate(this.articleTpl, this.filteredData), i = this.compileTemplate(this.tpl, {
                query: this.queryString,
                num: this.filteredData.length,
                posts: e,
                enDescription: 1 < this.filteredData.length ? "results that match" : "result that matches"
            })), this.container.innerHTML = i, setTimeout(function () {
                window._skappPostAnimation()
            })
        }, filterSourceData: function () {
            var i = this, a = [];
            i.config.minNum;
            return this.result.forEach(function (t, e) {
                i.config.minScore > t.score && e >= i.config.minScore.minNum || a.push(i.sourceData[t.ref])
            }), a
        }
    }, window.addEventListener("load", function () {
        new t
    })
}();